const { Groq } = require("groq-sdk");
require("dotenv").config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function main() {
  try {
    const response = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are a counselor.' },
        { role: 'user', content: 'Saya ingin nilai akhir saya tembus 90. Apa yang harus saya lakukan?' }
      ],
      model: 'llama-3.1-8b-instant',
    });
    console.log('REPLY:', response.choices[0]?.message?.content);
  } catch (err) {
    console.error('ERROR:', err);
  }
}
main();
