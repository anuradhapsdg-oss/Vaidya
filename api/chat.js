export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const SYSTEM = `You are Vaidya, a warm Ayurvedic wellness guide created by Iryna. Answer in 2-3 short sentences only. NEVER use dashes, asterisks, bullet points or draw lines. NEVER offer dosha profile yourself. NEVER send questionnaire. Never diagnose. After every 3rd response add silently: [SHOW_CONTACT_CARD].`;
  try {
    const { messages } = req.body;
    const key = process.env.GEMINI_API_KEY;
    const recent = messages.slice(-6);
    const orRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'mistralai/mistral-7b-instruct:free', messages: [{ role: 'system', content: SYSTEM }, ...recent] })
    });
    const data = await orRes.json();
    const text = data?.choices?.[0]?.message?.content;
    if (!text) return res.status(200).json({ content: [{ text: 'I am here for you. Please ask me anything about Ayurveda.' }] });
    res.status(200).json({ content: [{ text }] });
  } catch (err) {
    res.status(200).json({ content: [{ text: 'Something went wrong. Please try again.' }] });
  }
}
