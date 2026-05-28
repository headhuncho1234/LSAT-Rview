// api/generate.js — Vercel serverless function
// Uses OpenAI API — set OPENAI_API_KEY in Vercel environment variables

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { section, questionType } = req.body || {}
  if (!section || !questionType) {
    return res.status(400).json({ error: 'section and questionType are required' })
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: 'OPENAI_API_KEY is not set. Add it to your Vercel environment variables.' })
  }

  const sectionContext = {
    LR: `Create a 5-8 sentence argument that contains a subtle logical gap. Wrong answers should be tempting near-misses — they require precise logical discrimination to eliminate. Avoid obvious flaws.`,
    RC: `Create a 190-220 word academic passage on legal theory, natural science, philosophy of mind, or social science. Include a nuanced thesis with layered supporting claims. The passage should reward careful reading.`,
  }

  const prompt = `Generate one difficult LSAT ${section} question. Question type: "${questionType}".

${sectionContext[section]}

Return ONLY valid JSON — no markdown fences, no preamble, no explanation outside the JSON:
{
  "questionType": "${questionType}",
  "stimulus": "full stimulus text here",
  "question": "full question stem here",
  "choices": {
    "A": "first answer choice",
    "B": "second answer choice",
    "C": "third answer choice",
    "D": "fourth answer choice",
    "E": "fifth answer choice"
  },
  "correctAnswer": "A",
  "explanation": "Thorough analysis: why the correct answer is logically necessary, and why each wrong answer specifically fails. Use precise LSAT terminology.",
  "strategy": "One expert strategic insight for approaching this specific question type under timed conditions."
}`

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        max_tokens: 1200,
        messages: [
          {
            role: 'system',
            content: 'You are an elite LSAT instructor specializing in 175-180 score preparation. Generate realistic, hard LSAT questions with thorough explanations. Return ONLY valid JSON — absolutely no markdown.',
          },
          { role: 'user', content: prompt },
        ],
      }),
    })

    if (!response.ok) {
      const errText = await response.text()
      console.error('OpenAI API error:', response.status, errText)
      return res.status(500).json({ error: `OpenAI API error ${response.status}` })
    }

    const data = await response.json()
    const text = data.choices?.[0]?.message?.content || ''

    const match = text.match(/\{[\s\S]*\}/)
    if (!match) {
      console.error('No JSON in response:', text)
      return res.status(500).json({ error: 'Model returned unexpected format. Try again.' })
    }

    const question = JSON.parse(match[0])

    const required = ['stimulus', 'question', 'choices', 'correctAnswer', 'explanation']
    for (const field of required) {
      if (!question[field]) {
        return res.status(500).json({ error: `Missing field: ${field}. Try again.` })
      }
    }

    return res.json({ question })
  } catch (err) {
    console.error('Generate handler error:', err)
    return res.status(500).json({ error: err.message || 'Internal server error' })
  }
}
