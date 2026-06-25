export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const SYSTEM = `You are Vaidya, a warm and knowledgeable Ayurvedic wellness guide created by Iryna. 

RULES:
- Give short, warm, friendly answers (3-5 sentences max)
- Never use markdown, bullet points, dashes, or asterisks
- Never draw lines or dividers
- Speak naturally like a caring wellness consultant
- Help with questions about doshas, Ayurvedic lifestyle, herbs, nutrition, digestion, sleep, stress
- Never diagnose medical conditions
- Every 3rd response, add exactly this at the end: [SHOW_CONTACT_CARD]
- Do not mention the contact card in your text, just add the tag silently`;

  try {
    const { messages } = req.body;
    const key = process.env.GEMINI_API_KEY;
    const recent = messages.slice(-6);
    const orRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'mistralai/mistral-7b-instruct:free'
        messages: [{ role: 'system', content: SYSTEM }, ...recent] })
    });
    const data = await orRes.json();
    const text = data?.choices?.[0]?.message?.content;
    if (!text) return res.status(200).json({ content: [{ text: 'I am here for you. Please ask me anything about Ayurveda.' }] });
    res.status(200).json({ content: [{ text }] });
  } catch (err) {
    res.status(200).json({ content: [{ text: 'Something went wrong. Please try again.' }] });
  }
}
