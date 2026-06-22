export default async function handler(req, res) {
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
  "x-api-key": process.env.ANTHROPIC_API_KEY,
  "anthropic-version": "2023-06-01",
  "content-type": "application/json"
},
      body: JSON.stringify({
  model: "claude-3-5-sonnet-20240620",
  max_tokens: 1000,
  system: "You are a helpful assistant.",
  messages: req.body?.messages || []
})
    });

    const data = await response.json();

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
}
