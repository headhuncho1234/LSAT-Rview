export const QT = {
  LR: [
    'Necessary Assumption',
    'Sufficient Assumption',
    'Weaken',
    'Strengthen',
    'Flaw in Reasoning',
    'Must Be True',
    'Main Point',
    'Method of Reasoning',
    'Parallel Reasoning',
    'Resolve the Paradox',
    'Point at Issue',
    'Principle',
  ],
  RC: [
    "Main Point",
    "Author's Attitude",
    'Inference',
    'Specific Detail',
    'Function / Purpose',
    'Analogy / Application',
    'Strengthen / Weaken',
  ],
}

export const SECTION_META = {
  LR: {
    label: 'Logical Reasoning',
    desc: 'Argument analysis & evaluation',
    color: 'var(--purple)',
    dim: 'var(--purple-dim)',
    border: 'var(--purple-border)',
  },
  RC: {
    label: 'Reading Comprehension',
    desc: 'Passage analysis & inference',
    color: 'var(--teal)',
    dim: 'var(--teal-dim)',
    border: 'var(--teal-border)',
  },
}

// Time limits per section (seconds)
export const TL = { LR: 90, RC: 120 }

// XP earned per answer
export const calcXp = (correct, timeTaken, streak) => {
  if (!correct) return 10
  let xp = 100
  if (timeTaken < 60) xp += 50        // speed bonus
  else if (timeTaken < 90) xp += 25
  xp += Math.min(streak * 20, 200)    // streak bonus, capped
  return xp
}

// Level definitions
export const LEVELS = [
  { name: 'Novice',        min: 0,     max: 499,   color: 'var(--text-2)' },
  { name: 'Apprentice',    min: 500,   max: 1499,  color: '#60A5FA' },
  { name: 'Intermediate',  min: 1500,  max: 3499,  color: 'var(--teal)' },
  { name: 'Advanced',      min: 3500,  max: 6999,  color: 'var(--purple)' },
  { name: 'Expert',        min: 7000,  max: 11999, color: 'var(--gold)' },
  { name: '176+ Ready',    min: 12000, max: Infinity, color: '#F43F5E' },
]

export const getLevel = (totalXp) => {
  return LEVELS.find(l => totalXp >= l.min && totalXp <= l.max) || LEVELS[0]
}

export const getLevelProgress = (totalXp) => {
  const level = getLevel(totalXp)
  if (level.max === Infinity) return 100
  const range = level.max - level.min + 1
  const earned = totalXp - level.min
  return Math.min(100, Math.round((earned / range) * 100))
}
