# LSAT Prep · 176+

AI-powered LSAT practice tool. Hard questions, gamified XP system, performance analytics. Built for Logical Reasoning and Reading Comprehension (current LSAT format, no Logic Games).

## Features

- **AI-generated questions** at 175–180 difficulty level
- **LR** (12 question types) + **RC** (7 question types)
- **Timed practice** with live countdown
- **XP + Level system** with confetti on streaks
- **Full explanations** — why right answers are right, why wrong answers fail
- **Analytics dashboard** with 176+ readiness checklist
- **Persisted stats** via localStorage
- **Target weakness** — auto-drills your worst question type

## Local Development

```bash
# Install dependencies
npm install

# Install Vercel CLI (required to run API functions locally)
npm install -g vercel

# Set up environment
cp .env.example .env.local
# Add your Anthropic API key to .env.local

# Run locally (Vercel dev server handles both Vite + API functions)
npm run dev
```

## Deploy to Vercel

1. Push this repo to GitHub
2. Import the repo at [vercel.com/new](https://vercel.com/new)
3. Add environment variable:
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** your Anthropic API key (from console.anthropic.com)
4. Deploy

The API key stays server-side in the Vercel serverless function — it is never exposed to the browser.

## Project Structure

```
├── api/
│   └── generate.js       # Vercel serverless function (calls Anthropic API)
├── src/
│   ├── App.jsx            # Root component + all state
│   ├── constants.js       # Question types, XP calc, levels
│   ├── styles.css         # Global styles + dark theme
│   └── components/
│       ├── Header.jsx     # Sticky header with XP bar + streak
│       ├── Home.jsx       # Dashboard screen
│       ├── Setup.jsx      # Practice configuration
│       ├── Question.jsx   # Question + answer + explanation
│       └── Analytics.jsx  # Performance breakdown
├── index.html
├── package.json
├── vite.config.js
└── vercel.json
```

## Scoring Benchmarks (176+)

| Metric | Target |
|--------|--------|
| Overall accuracy | ≥ 90% |
| LR accuracy | ≥ 88% |
| RC accuracy | ≥ 85% |
| LR avg time | ≤ 84s |
| No type below 80% | All types ≥ 5 questions |
| Best streak | ≥ 10 |
