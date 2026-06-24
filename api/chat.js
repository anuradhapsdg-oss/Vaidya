export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const SYSTEM = `You are Vaidya, a warm Ayurvedic wellness guide by Iryna. Help with doshas, herbs, nutrition, lifestyle. After every 3rd response add [SHOW_CONTACT_CARD]. Never diagnose.`;
  try {
    const { messages } = req.body;
    const key = process.env.GEMINI_API_KEY;
    const recent = messages.slice(-6);const orRes = await fetch('https://openrouter.ai/api/v1/chat/completions',
      { method: 'POST',
        headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'meta-llama/llama-3.1-8b-instruct:free',
          messages: [{ role: 'system', content: SYSTEM }, ...recent] })
      });
    const data = await orRes.json();
    const text = data?.choices?.[0]?.message?.content;if (!text) return res.status(200).json({ content: [{ text: `Error: ${JSON.stringify(data)}` }] });
    res.status(200).json({ content: [{ text }] });
  } catch (err) {
    res.status(200).json({ content: [{ text: `Error: ${err.message}` }] });
  }
}
