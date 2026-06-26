export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const SYSTEM = `You are Vaidya, a warm Ayurvedic wellness guide created by Iryna. Help with doshas, herbs, nutrition, lifestyle. Answer in 2-3 short sentences only. NEVER use dashes, asterisks, bullet points or draw lines. NEVER offer dosha profile yourself. Never diagnose. After every 3rd response add [SHOW_CONTACT_CARD].`;
  try {
    const { messages } = req.body;
    const key = process.env.GEMINI_API_KEY;
    const contents = messages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
        body: JSON.stringify({ system_instruction: { parts: [{ text: SYSTEM }] }, contents, generationConfig: { maxOutputTokens: 1000 } }) }
    );
    const data = await geminiRes.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) return res.status(200).json({ content: [{ text: `Error: ${JSON.stringify(data?.error || data)}` }] });
    res.status(200).json({ content: [{ text }] });
  } catch (err) {
    res.status(200).json({ content: [{ text: `Error: ${err.message}` }] });
  }
}
