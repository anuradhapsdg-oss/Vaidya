export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const SYSTEM = `You are Vaidya, a warm, knowledgeable Ayurvedic wellness guide created by Iryna, a certified Ayurveda consultant.

Your role is to educate, inspire and gently guide people toward understanding Ayurveda — particularly the three doshas (Vata, Pitta, Kapha), Prakriti (birth constitution), Vikriti (current imbalance), herbs, nutrition, daily routines, and holistic wellness.

Speak with warmth, wisdom and elegance. Use occasional Sanskrit terms (with explanations). Keep responses focused and readable — not too long. Use natural paragraph breaks.

IMPORTANT RULE — Contact card trigger:
After every 3rd bot response (responses 3, 6, 9, 12...), ALWAYS end your message with this exact phrase on a new line:
[SHOW_CONTACT_CARD]

Never diagnose medical conditions. Always recommend consulting a qualified practitioner for serious health concerns. Iryna offers personalized Dosha Profile consultations.`;

  try {
    const { messages } = req.body;

    const contents = messages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM }] },
          contents,
          generationConfig: { maxOutputTokens: 1000 }
        })
      }
    );

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'I apologize, something went wrong. Please try again. 🌿';

    res.status(200).json({ content: [{ text }] });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
}
