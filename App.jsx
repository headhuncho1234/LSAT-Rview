import { useState, useEffect, useCallback } from 'react'
import confetti from 'canvas-confetti'
import { QT, TL, calcXp, getLevel, getLevelProgress } from './constants'
import Header from './components/Header'
import Home from './components/Home'
import Setup from './components/Setup'
import Question from './components/Question'
import Analytics from './components/Analytics'

function loadFromStorage(key, fallback, parse = JSON.parse) {
  try {
    const raw = localStorage.getItem(key)
    return raw !== null ? parse(raw) : fallback
  } catch {
    return fallback
  }
}

export default function App() {
  const [screen, setScreen] = useState('home')
  const [section, setSection] = useState('LR')
  const [qType, setQType] = useState('Random')
  const [loading, setLoading] = useState(false)
  const [currentQ, setCurrentQ] = useState(null)
  const [selected, setSelected] = useState(null)
  const [revealed, setRevealed] = useState(false)
  const [timeLeft, setTimeLeft] = useState(90)
  const [timerActive, setTimerActive] = useState(false)
  const [timeTaken, setTimeTaken] = useState(0)
  const [startMs, setStartMs] = useState(0)
  const [error, setError] = useState(null)
  const [xpToast, setXpToast] = useState(null) // { amount, correct }
  const [toastKey, setToastKey] = useState(0)

  // Persisted state
  const [history, setHistory] = useState(() =>
    loadFromStorage('lsat_history', [], JSON.parse)
  )
  const [xp, setXp] = useState(() =>
    loadFromStorage('lsat_xp', 0, Number)
  )
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(() =>
    loadFromStorage('lsat_best_streak', 0, Number)
  )

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('lsat_history', JSON.stringify(history.slice(-1000)))
  }, [history])
  useEffect(() => {
    localStorage.setItem('lsat_xp', String(xp))
  }, [xp])
  useEffect(() => {
    localStorage.setItem('lsat_best_streak', String(bestStreak))
  }, [bestStreak])

  // Countdown timer
  useEffect(() => {
    if (!timerActive || timeLeft <= 0) return
    const t = setTimeout(() => setTimeLeft(tl => Math.max(0, tl - 1)), 1000)
    return () => clearTimeout(t)
  }, [timerActive, timeLeft])

  const generateQuestion = useCallback(async (overrideSection, overrideType) => {
    const sec = overrideSection || section
    const types = QT[sec]
    const type = overrideType || (qType === 'Random'
      ? types[Math.floor(Math.random() * types.length)]
      : qType)

    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: sec, questionType: type }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || `Server error ${res.status}`)
      }

      const { question } = await res.json()
      setCurrentQ(question)
      setSelected(null)
      setRevealed(false)
      setTimeLeft(TL[sec])
      setTimerActive(true)
      setStartMs(Date.now())
      setScreen('question')
    } catch (err) {
      setError(err.message || 'Something went wrong. Check your API key and try again.')
    } finally {
      setLoading(false)
    }
  }, [section, qType])

  const handleSelect = (letter) => {
    if (revealed) return
    setSelected(letter)
  }

  const handleReveal = () => {
    if (!selected || revealed) return
    setTimerActive(false)
    const taken = Math.round((Date.now() - startMs) / 1000)
    setTimeTaken(taken)

    const correct = selected === currentQ.correctAnswer
    const newStreak = correct ? streak + 1 : 0
    const earned = calcXp(correct, taken, streak)

    setRevealed(true)
    setStreak(newStreak)
    setXp(prev => prev + earned)
    setXpToast({ amount: earned, correct })
    setToastKey(k => k + 1)

    if (newStreak > bestStreak) setBestStreak(newStreak)

    // Confetti on streak milestones
    if (correct && newStreak > 0 && newStreak % 5 === 0) {
      confetti({
        particleCount: 140,
        spread: 80,
        origin: { y: 0.55 },
        colors: ['#8B7CF8', '#00D4AA', '#FFB800', '#22C55E', '#F43F5E'],
      })
    }

    setHistory(h => [...h, {
      section,
      type: currentQ.questionType,
      correct,
      timeTaken: taken,
      ts: Date.now(),
    }])

    setTimeout(() => setXpToast(null), 2600)
  }

  const handleNext = () => {
    generateQuestion()
  }

  const level = getLevel(xp)
  const levelPct = getLevelProgress(xp)

  // Find the user's weakest question type for "target weakness" feature
  const getWeakestType = () => {
    const stats = {}
    history.forEach(h => {
      if (!stats[h.type]) stats[h.type] = { c: 0, t: 0, sec: h.section }
      stats[h.type].t++
      if (h.correct) stats[h.type].c++
    })
    const arr = Object.entries(stats)
      .filter(([, v]) => v.t >= 2)
      .map(([type, v]) => ({ type, pct: v.c / v.t, sec: v.sec, total: v.t }))
      .sort((a, b) => a.pct - b.pct)
    return arr[0] || null
  }

  const weakest = getWeakestType()

  return (
    <div className="app-wrap">
      <Header
        xp={xp}
        level={level}
        levelPct={levelPct}
        streak={streak}
        screen={screen}
        setScreen={setScreen}
      />

      {xpToast && (
        <div key={toastKey} className={`xp-toast ${xpToast.correct ? 'correct' : 'incorrect'}`}>
          {xpToast.correct ? `+${xpToast.amount} XP ⚡` : '+10 XP · Keep going'}
        </div>
      )}

      {screen === 'home' && (
        <Home
          history={history}
          xp={xp}
          streak={streak}
          bestStreak={bestStreak}
          level={level}
          weakest={weakest}
          setScreen={setScreen}
          setSection={setSection}
          setQType={setQType}
          generateQuestion={generateQuestion}
        />
      )}
      {screen === 'setup' && (
        <Setup
          section={section}
          setSection={setSection}
          qType={qType}
          setQType={setQType}
          loading={loading}
          error={error}
          setScreen={setScreen}
          generateQuestion={generateQuestion}
        />
      )}
      {screen === 'question' && currentQ && (
        <Question
          section={section}
          currentQ={currentQ}
          selected={selected}
          revealed={revealed}
          timeLeft={timeLeft}
          timeTaken={timeTaken}
          streak={streak}
          loading={loading}
          handleSelect={handleSelect}
          handleReveal={handleReveal}
          handleNext={handleNext}
          setScreen={setScreen}
        />
      )}
      {screen === 'analytics' && (
        <Analytics
          history={history}
          xp={xp}
          bestStreak={bestStreak}
          level={level}
          setScreen={setScreen}
          setSection={setSection}
          setQType={setQType}
          generateQuestion={generateQuestion}
        />
      )}
    </div>
  )
}
