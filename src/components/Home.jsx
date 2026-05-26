import { Brain, BookOpen, Target, TrendingUp, Trophy, Zap } from 'lucide-react'
import { SECTION_META } from '../constants'

function AccuracyColor(pct) {
  if (pct >= 88) return 'var(--green)'
  if (pct >= 72) return 'var(--gold)'
  return 'var(--red)'
}

function SectionCard({ sec, history, onPractice }) {
  const meta = SECTION_META[sec]
  const sq = history.filter(h => h.section === sec)
  const total = sq.length
  const correct = sq.filter(h => h.correct).length
  const pct = total > 0 ? Math.round((correct / total) * 100) : null
  const avg = total > 0 ? Math.round(sq.reduce((s, h) => s + h.timeTaken, 0) / total) : null

  return (
    <div
      className="card"
      style={{
        cursor: 'pointer',
        transition: 'all 0.15s',
        borderColor: 'var(--border)',
      }}
      onClick={() => onPractice(sec)}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = meta.border
        e.currentTarget.style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--border)'
        e.currentTarget.style.transform = 'translateY(0)'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            {sec === 'LR' ? <Brain size={16} color={meta.color} /> : <BookOpen size={16} color={meta.color} />}
            <span style={{ fontSize: 13, fontWeight: 600, color: meta.color }}>{sec}</span>
          </div>
          <div style={{ fontSize: 15, fontWeight: 600 }}>{meta.label}</div>
          <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 2 }}>{meta.desc}</div>
        </div>
        {pct !== null && (
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: AccuracyColor(pct), lineHeight: 1 }}>{pct}%</div>
            <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 3 }}>{total}q done</div>
          </div>
        )}
      </div>

      {pct !== null ? (
        <>
          <div className="perf-bar-wrap">
            <div
              className="perf-bar"
              style={{ width: `${pct}%`, background: AccuracyColor(pct) }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 12, color: 'var(--text-2)' }}>
            <span>{correct} correct / {total - correct} wrong</span>
            <span>avg {avg}s</span>
          </div>
        </>
      ) : (
        <div style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 8 }}>
          No questions yet â click to start
        </div>
      )}

      <div style={{
        marginTop: 14,
        padding: '8px 14px',
        background: meta.dim,
        borderRadius: 8,
        border: `1px solid ${meta.border}`,
        fontSize: 13,
        fontWeight: 500,
        color: meta.color,
        textAlign: 'center',
      }}>
        Practice {sec} â
      </div>
    </div>
  )
}

export default function Home({ history, xp, streak, bestStreak, level, weakest, setScreen, setSection, setQType, generateQuestion }) {
  const total = history.length
  const correct = history.filter(h => h.correct).length
  const acc = total > 0 ? Math.round((correct / total) * 100) : 0
  const avgTime = total > 0 ? Math.round(history.reduce((s, h) => s + h.timeTaken, 0) / total) : 0

  const scoreEst = () => {
    if (total < 5) return 'â'
    if (acc >= 92) return '176â180'
    if (acc >= 88) return '172â175'
    if (acc >= 84) return '168â171'
    if (acc >= 79) return '164â167'
    return '< 164'
  }

  const handlePracticeSection = (sec) => {
    setSection(sec)
    setQType('Random')
    setScreen('setup')
  }

  const handleTargetWeakness = () => {
    if (!weakest) return
    setSection(weakest.sec)
    setQType(weakest.type)
    generateQuestion(weakest.sec, weakest.type)
  }

  return (
    <div className="screen">
      {/* Hero */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.03em', marginBottom: 6 }}>
          Crush the LSAT.
        </h1>
        <p style={{ fontSize: 15, color: 'var(--text-2)', lineHeight: 1.5 }}>
          AI-powered hard questions. Logical Reasoning + Reading Comprehension. Built for 176+.
        </p>
      </div>

      {/* Stats row */}
      <div className="stat-grid" style={{ marginBottom: 24 }}>
        <div className="stat-card">
          <div className="stat-label">Questions done</div>
          <div className="stat-value">{total}</div>
          <div className="stat-sub">this profile</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Accuracy</div>
          <div className="stat-value" style={{ color: total >= 5 ? AccuracyColor(acc) : 'var(--text)' }}>{total > 0 ? `${acc}%` : 'â'}</div>
          <div className="stat-sub">{total >= 5 ? `${correct} of ${total}` : 'need 5+ questions'}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Est. score</div>
          <div className="stat-value" style={{ color: total >= 5 ? 'var(--purple)' : 'var(--text)' }}>{scoreEst()}</div>
          <div className="stat-sub">{total < 5 ? '5+ needed' : 'projected range'}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Best streak</div>
          <div className="stat-value" style={{ color: bestStreak >= 5 ? 'var(--gold)' : 'var(--text)' }}>{bestStreak}</div>
          <div className="stat-sub">{avgTime > 0 ? `avg ${avgTime}s / q` : 'no data'}</div>
        </div>
      </div>

      {/* Section cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 }}>
        <SectionCard sec="LR" history={history} onPractice={handlePracticeSection} />
        <SectionCard sec="RC" history={history} onPractice={handlePracticeSection} />
      </div>

      {/* Quick start buttons */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: weakest ? 16 : 0 }}>
        <button
          className="btn btn-primary"
          style={{ flex: 1, justifyContent: 'center', padding: '12px 0', borderRadius: 12 }}
          onClick={() => { setSection('LR'); setQType('Random'); setScreen('setup') }}
        >
          <Brain size={16} />
          Practice LR
        </button>
        <button
          className="btn btn-teal"
          style={{ flex: 1, justifyContent: 'center', padding: '12px 0', borderRadius: 12 }}
          onClick={() => { setSection('RC'); setQType('Random'); setScreen('setup') }}
        >
          <BookOpen size={16} />
          Practice RC
        </button>
      </div>

      {weakest && (
        <button
          className="btn"
          style={{
            width: '100%',
            justifyContent: 'center',
            padding: '12px 0',
            borderRadius: 12,
            marginTop: 12,
            background: 'var(--red-dim)',
            borderColor: 'var(--red-border)',
            color: 'var(--red)',
          }}
          onClick={handleTargetWeakness}
        >
          <Target size={16} />
          Target weakness: {weakest.type} ({Math.round(weakest.pct * 100)}% acc)
        </button>
      )}

      {total >= 10 && (
        <div className="card" style={{ marginTop: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <Trophy size={16} color="var(--gold)" />
            <span style={{ fontSize: 14, fontWeight: 600 }}>176+ Readiness Check</span>
          </div>
          {[
            { label: 'Overall accuracy â¥ 90%', ok: acc >= 90 },
            { label: 'LR accuracy â¥ 88%', ok: (() => { const s = history.filter(h => h.section === 'LR'); return s.length >= 5 && (s.filter(h => h.correct).length / s.length) >= 0.88 })() },
            { label: 'RC accuracy â¥ 85%', ok: (() => { const s = history.filter(h => h.section === 'RC'); return s.length >= 5 && (s.filter(h => h.correct).length / s.length) >= 0.85 })() },
            { label: 'Avg LR time â¤ 90s', ok: (() => { const s = history.filter(h => h.section === 'LR'); return s.length >= 5 && s.reduce((a, h) => a + h.timeTaken, 0) / s.length <= 90 })() },
            { label: 'Best streak â¥ 10', ok: bestStreak >= 10 },
          ].map(({ label, ok }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, fontSize: 13 }}>
              <div style={{
                width: 18, height: 18, borderRadius: 50,
                background: ok ? 'var(--green-dim)' : 'var(--bg-elevated)',
                border: `1px solid ${ok ? 'var(--green-border)' : 'var(--border-md)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, fontSize: 10,
              }}>
                {ok ? 'â' : ''}
              </div>
              <span style={{ color: ok ? 'var(--green)' : 'var(--text-2)' }}>{label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
