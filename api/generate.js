// api/generate.js — Vercel serverless function
// Keeps OPENAI_API_KEY server-side (never exposed to the browser)

const OpenAI = require('openai')

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

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
  "explanation": "Thorough analysis: why the correct answer is logically necessary, and why each wrong answer specifically fails. Use precise LSAT terminology (sufficient condition, necessary condition, conclusion, premise, etc.).",
  "strategy": "One expert strategic insight for approaching this specific question type under timed conditions."
}`

  try {
    const response = await client.responses.create({
      model: 'gpt-5.5',
      input: [
        {
          role: 'system',
          content: `You are an elite LSAT instructor specializing in 175–180 score preparation.
Generate realistic, hard LSAT questions with thorough explanations.
Return ONLY valid JSON — absolutely no markdown.`
        },
        {
          role: 'user',
          content: prompt
        }
      ]
    })

    const text = response.output_text || ''

    const question = JSON.parse(text)

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
