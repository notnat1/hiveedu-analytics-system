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
      this.logger.warn('GROQ_API_KEY is not set. XAI will fallback to static rule-based explanations.');
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
      factors.push(`a below-average teacher objective score of ${teacherObjective}`);
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
      factors.push(mathScore < 70 ? `a weak math score of ${mathScore}` : `a strong math score of ${mathScore}`);
    }
    if (logicScore !== null) {
      factors.push(logicScore < 70 ? `a weak logic score of ${logicScore}` : `a strong logic score of ${logicScore}`);
    }
    if (englishScore !== null) {
      factors.push(englishScore < 70 ? `a weak english score of ${englishScore}` : `a strong english score of ${englishScore}`);
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
      return this.generateExplanation(attendance, averageTryout, teacherObjective, predictedScore);
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
        this.logger.warn(`Groq API rate limit exceeded (429). Circuit breaker engaged for 65s. AI generation suspended.`);
      } else {
        this.logger.error(`Failed to generate dynamic explanation: ${error.message}`);
      }
    }
    
    return this.generateExplanation(attendance, averageTryout, teacherObjective, predictedScore);
  }

  async generateDynamicExamScoreExplanationAsync(
    mathScore: number | null,
    logicScore: number | null,
    englishScore: number | null,
    actualExamScore: number | null,
  ): Promise<string> {
    if (!this.aiClient || Date.now() < this.circuitBreakerUntil) {
      return this.generateExamScoreExplanation(mathScore, logicScore, englishScore, actualExamScore);
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
        this.logger.error(`Failed to generate dynamic exam score explanation: ${error.message}`);
      }
    }

    return this.generateExamScoreExplanation(mathScore, logicScore, englishScore, actualExamScore);
  }

  async chatWithCounselor(message: string, context: string): Promise<string> {
    if (!this.aiClient) {
      return "Mohon maaf, layanan AI Counselor sedang offline (API Key tidak diatur).";
    }

    try {
      const systemPrompt = `Kamu adalah 'HiveEdu AI Counselor', konselor akademik virtual yang ramah, empatik, dan suportif. 
Tugasmu adalah membantu siswa memahami performa akademiknya dan memberikan saran belajar yang spesifik.
Gunakan bahasa Indonesia yang santai tapi profesional (gunakan kata 'Kamu' untuk siswa).
Jawab dengan singkat dan jelas (maksimal 3 paragraf pendek).
Berikut adalah konteks data akademik siswa saat ini yang didapat dari algoritma Regresi Linear:
${context}`;

      this.logger.log(`Memanggil Groq API untuk pesan: "${message}"`);
      const response = await this.aiClient.chat.completions.create({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        model: 'llama-3.1-8b-instant',
      }, {
        maxRetries: 0,
        timeout: 10000,
      });
      this.logger.log(`Berhasil menerima respons dari Groq API.`);
      
      if (response.choices[0]?.message?.content) {
        return response.choices[0].message.content.trim();
      }
    } catch (error: any) {
      if (error.status === 429 || error.message?.includes('429')) {
        return "Mohon maaf, server AI saat ini sedang sibuk (Rate Limit). Silakan coba beberapa saat lagi.";
      }
      this.logger.error(`Failed to chat with AI: ${error.message}`);
      return "Maaf, terjadi kesalahan saat menghubungi AI Counselor.";
    }

    return "Maaf, saya tidak mengerti. Bisa diulangi?";
  }
}
