import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Groq from 'groq-sdk';

@Injectable()
export class XaiService {
  private readonly logger = new Logger(XaiService.name);
  private readonly aiClient: Groq | null = null;
  private circuitBreakerUntil: number = 0;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('GROQ_API_KEY');
    if (apiKey) {
      this.aiClient = new Groq({ apiKey });
      this.logger.log('Groq AI client initialized successfully.');
    } else {
      this.logger.warn(
        'GROQ_API_KEY is not set. XAI will fallback to static rule-based explanations.',
      );
    }
  }

  generateExplanation(
    attendance: number,
    averageTryout: number,
    teacherObjective: number,
    predictedScore: number,
  ): string {
    let explanation = `The predicted score of ${predictedScore} is `;

    const isAttendanceLow = attendance < 75;
    const isTryoutLow = averageTryout < 70;
    const isTeacherScoreLow = teacherObjective < 70;

    const factors: string[] = [];

    if (isAttendanceLow) {
      factors.push(`a low attendance rate of ${attendance}%`);
    } else {
      factors.push(`a solid attendance rate of ${attendance}%`);
    }

    if (isTryoutLow) {
      factors.push(`a low average tryout score of ${averageTryout}`);
    } else {
      factors.push(`a strong average tryout score of ${averageTryout}`);
    }

    if (isTeacherScoreLow) {
      factors.push(
        `a below-average teacher objective score of ${teacherObjective}`,
      );
    } else {
      factors.push(`a good teacher objective score of ${teacherObjective}`);
    }

    if (predictedScore < 70) {
      explanation += `negatively influenced by ${factors.join(', and ')}.`;
    } else {
      explanation += `positively influenced by ${factors.join(', and ')}.`;
    }

    return explanation;
  }

  generateExamScoreExplanation(
    mathScore: number | null,
    logicScore: number | null,
    englishScore: number | null,
    actualExamScore: number | null,
  ): string {
    if (actualExamScore === null) {
      return `Ujian akhir belum dilaksanakan. Terus semangat belajar dan tingkatkan nilai komponenmu (Matematika: ${mathScore ?? '-'}, Logika: ${logicScore ?? '-'}, Bahasa Inggris: ${englishScore ?? '-'}) untuk mendapatkan hasil maksimal!`;
    }

    let explanation = `The actual exam score of ${actualExamScore} was achieved with `;
    const factors: string[] = [];

    if (mathScore !== null) {
      factors.push(
        mathScore < 70
          ? `a weak math score of ${mathScore}`
          : `a strong math score of ${mathScore}`,
      );
    }
    if (logicScore !== null) {
      factors.push(
        logicScore < 70
          ? `a weak logic score of ${logicScore}`
          : `a strong logic score of ${logicScore}`,
      );
    }
    if (englishScore !== null) {
      factors.push(
        englishScore < 70
          ? `a weak english score of ${englishScore}`
          : `a strong english score of ${englishScore}`,
      );
    }

    if (factors.length > 0) {
      explanation += `${factors.join(', and ')}.`;
    } else {
      explanation += `no component scores available.`;
    }
    return explanation;
  }

  async generateDynamicExplanationAsync(
    attendance: number,
    averageTryout: number,
    teacherObjective: number,
    predictedScore: number,
  ): Promise<string> {
    if (!this.aiClient || Date.now() < this.circuitBreakerUntil) {
      return this.generateExplanation(
        attendance,
        averageTryout,
        teacherObjective,
        predictedScore,
      );
    }

    try {
      const prompt = `Sebagai seorang konselor akademik yang empatik dan suportif, berikan 2 kalimat analisis dan rekomendasi langkah belajar yang spesifik untuk seorang siswa. Data siswa: Kehadiran ${attendance}%, rata-rata Tryout ${averageTryout}, dan Nilai Objektif Guru ${teacherObjective}. Prediksi nilai ujian akhir siswa ini adalah ${predictedScore} (dari 100). Jangan menyertakan salam atau penutup, langsung pada inti poin dengan nada penyemangat. Gunakan bahasa Indonesia yang baik dan profesional.`;

      const response = await this.aiClient.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama-3.1-8b-instant',
      });

      if (response.choices[0]?.message?.content) {
        return response.choices[0].message.content.trim();
      }
    } catch (error: any) {
      if (error.status === 429 || error.message?.includes('429')) {
        this.circuitBreakerUntil = Date.now() + 65000; // Suspend for 65 seconds
        this.logger.warn(
          `Groq API rate limit exceeded (429). Circuit breaker engaged for 65s. AI generation suspended.`,
        );
      } else {
        this.logger.error(
          `Failed to generate dynamic explanation: ${error.message}`,
        );
      }
    }

    return this.generateExplanation(
      attendance,
      averageTryout,
      teacherObjective,
      predictedScore,
    );
  }

  async generateDynamicExamScoreExplanationAsync(
    mathScore: number | null,
    logicScore: number | null,
    englishScore: number | null,
    actualExamScore: number | null,
  ): Promise<string> {
    if (!this.aiClient || Date.now() < this.circuitBreakerUntil) {
      return this.generateExamScoreExplanation(
        mathScore,
        logicScore,
        englishScore,
        actualExamScore,
      );
    }

    try {
      let prompt = '';
      if (actualExamScore === null) {
        prompt = `Sebagai seorang konselor akademik yang empatik dan suportif, berikan kalimat penyemangat dan motivasi belajar (maksimal 2 kalimat) untuk siswa yang sedang bersiap menghadapi ujian akhir namun belum memiliki nilai ujian. Nilai sementara komponen pembelajarannya saat ini adalah: Matematika ${mathScore ?? 'Belum ada'}, Logika ${logicScore ?? 'Belum ada'}, Bahasa Inggris ${englishScore ?? 'Belum ada'}. Berikan saran singkat apa yang harus difokuskan agar sukses ujian. Jangan menyertakan salam pembuka atau penutup. Gunakan bahasa Indonesia yang bersahabat.`;
      } else {
        prompt = `Sebagai seorang konselor akademik yang suportif, berikan analisis singkat 2 kalimat atas hasil ujian siswa. Nilai aktual ujian akhir adalah ${actualExamScore}. Nilai komponen siswa: Matematika ${mathScore ?? 'Belum ada'}, Logika ${logicScore ?? 'Belum ada'}, Bahasa Inggris ${englishScore ?? 'Belum ada'}. Jelaskan kekuatan atau area yang perlu ditingkatkan secara empatik berdasarkan komponen nilai tersebut. Jangan menyertakan salam. Gunakan bahasa Indonesia.`;
      }

      const response = await this.aiClient.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama-3.1-8b-instant',
      });

      if (response.choices[0]?.message?.content) {
        return response.choices[0].message.content.trim();
      }
    } catch (error: any) {
      if (error.status === 429 || error.message?.includes('429')) {
        this.circuitBreakerUntil = Date.now() + 65000; // Suspend for 65 seconds
        // Do not log repetitively to keep terminal clean if circuit breaker just engaged
      } else {
        this.logger.error(
          `Failed to generate dynamic exam score explanation: ${error.message}`,
        );
      }
    }

    return this.generateExamScoreExplanation(
      mathScore,
      logicScore,
      englishScore,
      actualExamScore,
    );
  }

  async chatWithCounselor(
    message: string,
    context: string,
    language?: string,
  ): Promise<string> {
    if (!this.aiClient) {
      return language === 'en'
        ? "We're sorry, the AI Counselor service is currently offline (API Key not configured)."
        : 'Mohon maaf, layanan AI Counselor sedang offline (API Key tidak diatur).';
    }

    try {
      const languageInstruction =
        language === 'en'
          ? 'CRITICAL: You MUST reply entirely in English.'
          : 'CRITICAL: You MUST reply entirely in Indonesian.';

      const systemPrompt = `Anda adalah "AI Counselor", asisten virtual yang ramah, empatik, dan suportif khusus untuk siswa di platform HiveEdu.
Tugas Anda adalah mendengarkan keluh kesah siswa terkait masalah akademik mereka (nilai tryout, kehadiran) dan memberikan saran praktis yang membangun.
Selalu bersikap positif dan memotivasi. Jika siswa bertanya hal di luar pendidikan/sekolah, arahkan kembali dengan sopan ke topik akademik.
Siswa tidak tahu data teknis di bawah ini. Anda hanya boleh menggunakan data ini sebagai dasar argumen/saran Anda tanpa harus menyebutkan angkanya secara kaku.

Berikut adalah konteks data akademik siswa saat ini yang didapat dari algoritma Regresi Linear:
${context}

${languageInstruction}`;

      this.logger.log(`Memanggil Groq API untuk pesan: "${message}"`);
      const response = await this.aiClient.chat.completions.create(
        {
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: message },
          ],
          model: 'llama-3.1-8b-instant',
        },
        {
          maxRetries: 0,
          timeout: 10000,
        },
      );
      this.logger.log(`Berhasil menerima respons dari Groq API.`);

      if (response.choices[0]?.message?.content) {
        return response.choices[0].message.content.trim();
      }
    } catch (error: any) {
      if (error.status === 429 || error.message?.includes('429')) {
        return 'Mohon maaf, server AI saat ini sedang sibuk (Rate Limit). Silakan coba beberapa saat lagi.';
      }
      this.logger.error(`Failed to chat with AI: ${error.message}`);
      return 'Maaf, terjadi kesalahan saat menghubungi AI Counselor.';
    }

    return 'Maaf, saya tidak mengerti. Bisa diulangi?';
  }

  async draftInterventionMessage(
    studentName: string,
    riskLevel: string,
    attendancePercentage: number,
    averageTryoutScore: number,
    teacherObjectiveScore: number | null,
    predictedScore: number | null,
    language?: string,
  ): Promise<string> {
    // Fallback template if AI client is not configured or circuit breaker is active
    const generateFallback = () => {
      if (language === 'en') {
        return `Dear ${studentName},\n\nWe would like to inform you that based on our learning analytics system, your current academic performance shows a ${riskLevel.toLowerCase()} risk of not meeting the final exam target.\n\nKey indicators:\n- Attendance: ${attendancePercentage.toFixed(1)}%\n- Average Tryout Score: ${averageTryoutScore.toFixed(1)}\n${teacherObjectiveScore !== null ? `- Teacher Objective Score (X3): ${teacherObjectiveScore.toFixed(1)}\n` : ''}- Predicted Score: ${predictedScore !== null ? predictedScore.toFixed(1) : 'N/A'}\n\nWe strongly encourage you to increase your study intensity and attendance. Please do not hesitate to reach out to your tutor for additional guidance.\n\nBest regards,\nHiveEdu Academic Team`;
      }
      return `Yth. ${studentName},\n\nKami ingin menyampaikan bahwa berdasarkan sistem analitik pembelajaran kami, performa akademik Anda saat ini menunjukkan risiko ${riskLevel === 'HIGH' ? 'tinggi' : 'menengah'} untuk tidak memenuhi target ujian akhir.\n\nIndikator utama:\n- Kehadiran: ${attendancePercentage.toFixed(1)}%\n- Rata-rata Nilai Tryout: ${averageTryoutScore.toFixed(1)}\n${teacherObjectiveScore !== null ? `- Nilai Objektif Guru (X3): ${teacherObjectiveScore.toFixed(1)}\n` : ''}- Prediksi Nilai Akhir: ${predictedScore !== null ? predictedScore.toFixed(1) : 'N/A'}\n\nKami sangat menganjurkan Anda untuk meningkatkan intensitas belajar dan kehadiran. Jangan ragu untuk menghubungi tutor Anda untuk mendapatkan bimbingan tambahan.\n\nHormat kami,\nTim Akademik HiveEdu`;
    };

    if (!this.aiClient || Date.now() < this.circuitBreakerUntil) {
      return generateFallback();
    }

    try {
      const isEnglish = language === 'en';
      const langInstruction = isEnglish
        ? 'CRITICAL: Write the entire message in English.'
        : 'CRITICAL: Tulis seluruh pesan dalam Bahasa Indonesia yang baik dan sopan.';

      const prompt = isEnglish
        ? `You are an academic coordinator assistant. Draft a short, professional, and empathetic follow-up message (suitable for WhatsApp or email) from the academic team to notify the student "${studentName}" about their academic risk. Do NOT be harsh or discouraging. The tone should be supportive and motivational.

Student data from the learning analytics system:
- Risk Level: ${riskLevel}
- Attendance: ${attendancePercentage.toFixed(1)}%
- Average Tryout Score: ${averageTryoutScore.toFixed(1)}
${teacherObjectiveScore !== null ? `- Teacher Objective Score (X3): ${teacherObjectiveScore.toFixed(1)}` : ''}
- Predicted Final Score: ${predictedScore !== null ? predictedScore.toFixed(1) : 'Not yet available'}

Instructions:
- Start with a polite salutation addressing the student by name.
- Mention 1-2 specific data points as context (without being too technical).
- End with an encouraging call-to-action to reach out to their tutor or increase study effort.
- Keep it concise (under 150 words).
- Do NOT include a subject line header.
${langInstruction}`
        : `Anda adalah asisten koordinator akademik. Buatlah draf pesan singkat, profesional, dan empatik (cocok untuk WhatsApp atau email) dari tim akademik kepada siswa "${studentName}" untuk menginformasikan risiko akademik mereka. Jangan bersikap keras atau mengecilkan hati. Nada harus suportif dan memotivasi.

Data siswa dari sistem analitik pembelajaran:
- Tingkat Risiko: ${riskLevel === 'HIGH' ? 'TINGGI' : 'MENENGAH'}
- Kehadiran: ${attendancePercentage.toFixed(1)}%
- Rata-rata Nilai Tryout: ${averageTryoutScore.toFixed(1)}
${teacherObjectiveScore !== null ? `- Nilai Objektif Guru (X3): ${teacherObjectiveScore.toFixed(1)}` : ''}
- Prediksi Nilai Akhir: ${predictedScore !== null ? predictedScore.toFixed(1) : 'Belum tersedia'}

Instruksi:
- Mulai dengan salam yang sopan dan menyebut nama siswa.
- Sebutkan 1-2 data spesifik sebagai konteks (tanpa terlalu teknis).
- Akhiri dengan ajakan yang menyemangati untuk menghubungi tutor atau meningkatkan usaha belajar.
- Buat singkat dan padat (di bawah 150 kata).
- JANGAN sertakan header subject.
${langInstruction}`;

      const response = await this.aiClient.chat.completions.create(
        {
          messages: [{ role: 'user', content: prompt }],
          model: 'llama-3.1-8b-instant',
        },
        {
          maxRetries: 0,
          timeout: 15000,
        },
      );

      this.logger.log(
        `Berhasil men-generate draf pesan intervensi untuk siswa: ${studentName}`,
      );

      if (response.choices[0]?.message?.content) {
        return response.choices[0].message.content.trim();
      }
    } catch (error: any) {
      if (error.status === 429 || error.message?.includes('429')) {
        this.circuitBreakerUntil = Date.now() + 65000;
        this.logger.warn(
          `Groq API rate limit (429). Circuit breaker engaged. Falling back to template.`,
        );
      } else {
        this.logger.error(
          `Failed to draft intervention message: ${error.message}`,
        );
      }
    }

    return generateFallback();
  }

  async generateStudyPlanAsync(
    studentName: string,
    averageTryoutScore: number,
    teacherObjectiveScore: number | null,
    weakestSubjects: string[],
    language?: string,
  ): Promise<string> {
    const isEnglish = language === 'en';

    const fallbackPlan = isEnglish
      ? `# Study Plan for ${studentName}\n\nAI service is currently unavailable. Please focus on regular reviews and practice tests.`
      : `# Rencana Belajar untuk ${studentName}\n\nLayanan AI saat ini tidak tersedia. Silakan fokus pada pengulangan materi dan latihan soal rutin.`;

    if (!this.aiClient || Date.now() < this.circuitBreakerUntil) {
      return fallbackPlan;
    }

    try {
      const langInstruction = isEnglish
        ? 'CRITICAL: Write the entire study plan in English.'
        : 'CRITICAL: Tulis seluruh rencana belajar dalam Bahasa Indonesia yang baik.';

      const prompt = isEnglish
        ? `You are an expert AI academic counselor. Create a highly specific, actionable, and concrete 4-week (Weekly) Study Plan for a student named "${studentName}".
        
Student's Current Academic Context:
- Average Tryout (Exam) Score: ${averageTryoutScore.toFixed(1)} / 100
- Teacher Objective Evaluation: ${teacherObjectiveScore !== null ? teacherObjectiveScore.toFixed(1) : 'N/A'} / 100
- Areas Needing Improvement (Weakest Subjects): ${weakestSubjects.length > 0 ? weakestSubjects.join(', ') : 'General Studies'}

Instructions:
1. Provide a short, highly personalized and encouraging introductory paragraph referencing their current scores.
2. Structure the plan into exactly 4 weeks (Week 1 to Week 4).
3. Use a clear Markdown table for each week, detailing:
   - "Focus Subject / Topic" (Be specific on topics, e.g. "Algebra", not just "Math")
   - "Actionable Tasks" (Give concrete, step-by-step actions and methods)
   - "Estimated Hours" (Reasonable daily/weekly time limits)
4. Provide a short concluding motivational remark.
5. Format the entire response in clean Markdown so it looks beautiful when rendered as a PDF document. Do not include random commentary outside the requested format.
${langInstruction}`
        : `Anda adalah pakar konselor akademik AI. Buatlah Rencana Belajar 4 Minggu (Mingguan) yang sangat spesifik, konkrit, dan bisa ditindaklanjuti untuk siswa bernama "${studentName}".
        
Konteks Akademik Siswa Saat Ini:
- Rata-rata Nilai Ujian/Tryout: ${averageTryoutScore.toFixed(1)} / 100
- Evaluasi Objektif Guru: ${teacherObjectiveScore !== null ? teacherObjectiveScore.toFixed(1) : 'Belum Ada'} / 100
- Area yang Perlu Ditingkatkan (Mata Pelajaran Terlemah): ${weakestSubjects.length > 0 ? weakestSubjects.join(', ') : 'Materi Umum'}

Instruksi:
1. Berikan paragraf pengantar singkat yang menyemangati secara personal, menyebutkan kemajuan atau skor mereka saat ini.
2. Susun rencana tepat untuk 4 minggu (Minggu 1 hingga Minggu 4).
3. Gunakan tabel Markdown yang rapi untuk setiap minggu, berisi kolom:
   - "Fokus Materi" (Harus spesifik, misalnya "Pecahan Campuran", bukan sekadar "Matematika")
   - "Tindakan Spesifik" (Berikan instruksi langkah demi langkah dan teknik belajar konkrit seperti Pomodoro, mind mapping, dll)
   - "Estimasi Waktu" (Pembagian waktu harian atau mingguan yang masuk akal)
4. Berikan kalimat penutup yang memotivasi.
5. Format seluruh respons dalam Markdown yang bersih (Gunakan standar GitHub Flavored Markdown untuk tabel) agar terlihat rapi saat dicetak sebagai dokumen PDF. Jangan tambahkan komentar di luar format yang diminta.
${langInstruction}`;

      const response = await this.aiClient.chat.completions.create(
        {
          messages: [{ role: 'user', content: prompt }],
          model: 'llama-3.1-8b-instant',
          max_tokens: 3000,
        },
        {
          maxRetries: 1,
          timeout: 45000,
        },
      );

      this.logger.log(
        `Berhasil men-generate Rencana Belajar AI untuk siswa: ${studentName}`,
      );

      if (response.choices[0]?.message?.content) {
        return response.choices[0].message.content.trim();
      }
    } catch (error: any) {
      if (error.status === 429 || error.message?.includes('429')) {
        this.circuitBreakerUntil = Date.now() + 65000;
        this.logger.warn(
          `Groq API rate limit (429). Circuit breaker engaged. Falling back to template.`,
        );
      } else {
        this.logger.error(`Failed to generate AI study plan: ${error.message}`);
      }
    }

    return fallbackPlan;
  }
}
