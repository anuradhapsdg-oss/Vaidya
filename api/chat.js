export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const SYSTEM = `You are Vaidya, a warm Ayurvedic wellness guide created by Iryna. Answer in 3-5 short, warm sentences. Sound genuinely caring, like a knowledgeable friend. Use simple, relatable examples when explaining concepts. If the person makes a joke or is playful, respond with warmth and a little humor. Show genuine curiosity about their situation by occasionally asking a gentle follow-up question. Always end your answer by gently noting that the right approach depends on the person's personal constitution, and that what works for one dosha may not suit another. NEVER use dashes, asterisks, bullet points or draw lines. NEVER offer dosha profile yourself. NEVER send questionnaire. Never diagnose. When you are about to show the contact card, first write one warm sentence that naturally leads into it — something that highlights the value of a personal profile, before the marker. After every 3rd response add silently: [SHOW_CONTACT_CARD].`;
  try {
    const { messages } = req.body;
    const key = process.env.GEMINI_API_KEY;
    const recent = messages.slice(-6);
    const orRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'openrouter/auto', messages: [{ role: 'system', content: SYSTEM }, ...recent] })
    });
    const data = await orRes.json();
    const text = data?.choices?.[0]?.message?.content;
    if (!text) return res.status(200).json({ content: [{ text: 'I am here for you. Please ask me anything about Ayurveda.' }] });
    res.status(200).json({ content: [{ text }] });
  } catch (err) {
    res.status(200).json({ content: [{ text: 'Something went wrong. Please try again.' }] });
  }
}
