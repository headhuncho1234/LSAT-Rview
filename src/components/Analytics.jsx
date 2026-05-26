import { Brain, BookOpen, Target, ArrowLeft, TrendingUp, Trophy, Clock } from 'lucide-react'
import { SECTION_META } from '../constants'

function pctColor(p) {
  if (p >= 88) return 'var(--green)'
  if (p >= 72) return 'var(--gold)'
  return 'var(--red)'
}

function TypeRow({ type, correct, total, sec, onDrill }) {
  const pct = Math.round((correct / total) * 100)
  const meta = SECTION_META[sec]
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className={`section-pill ${sec}`}>{sec}</span>
          <span style={{ fontSize: 13.5, fontWeight: 500 }}>{type}</span>
          <span style={{ fontSize: 12, color: 'var(--text-3)' }}>{total}q</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: pctColor(pct) }}>{pct}%</span>
          {pct < 80 && (
            <button onClick={() => onDrill(sec, type)} style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20, background: 'var(--red-dim)', border: '1px solid var(--red-border)', color: 'var(--red)', cursor: 'pointer' }}>Drill â</button>
          )}
        </div>
      </div>
      <div className="perf-bar-wrap"><div className="perf-bar" style={{ width: `${pct}%`, background: pctColor(pct) }} /></div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-3)', marginTop: 4 }}>
        <span>{correct} correct Â· {total - correct} wrong</span>
        <span>{pct >= 88 ? 'â Target met' : `Need ${88 - pct}% more`}</span>
      </div>
    </div>
  )
}

export default function Analytics({ history, xp, bestStreak, level, setScreen, setSection, setQType, generateQuestion }) {
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

  const secStats = ['LR', 'RC'].map(sec => {
    const sq = history.filter(h => h.section === sec)
    const sc = sq.filter(h => h.correct).length
    const avg = sq.length > 0 ? Math.round(sq.reduce((s, h) => s + h.timeTaken, 0) / sq.length) : 0
    return { sec, total: sq.length, correct: sc, pct: sq.length > 0 ? Math.round(sc / sq.length * 100) : 0, avg }
  })

  const typeMap = {}
  history.forEach(h => {
    const key = `${h.section}::${h.type}`
    if (!typeMap[key]) typeMap[key] = { correct: 0, total: 0, sec: h.section, type: h.type }
    typeMap[key].total++
    if (h.correct) typeMap[key].correct++
  })
  const typeArr = Object.values(typeMap).filter(t => t.total >= 2).sort((a, b) => (a.correct / a.total) - (b.correct / b.total))

  const handleDrill = (sec, type) => { setSection(sec); setQType(type); generateQuestion(sec, type) }
  const recent = history.slice(-20)
  const recentAcc = recent.length > 0 ? Math.round(recent.filter(h => h.correct).length / recent.length * 100) : 0

  if (total === 0) return (
    <div className="screen" style={{ textAlign: 'center', padding: '60px 20px' }}>
      <button onClick={() => setScreen('home')} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: 'var(--text-2)', fontSize: 13, marginBottom: 40, padding: 0 }}>
        <ArrowLeft size={14} /> Back
      </button>
      <TrendingUp size={48} color="var(--text-3)" style={{ marginBottom: 16 }} />
      <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>No data yet</h2>
      <p style={{ color: 'var(--text-2)', fontSize: 14, marginBottom: 24 }}>Answer at least 5 questions to see your analytics.</p>
      <button className="btn btn-primary" style={{ margin: '0 auto' }} onClick={() => setScreen('setup')}>Start practicing</button>
    </div>
  )

  return (
    <div className="screen">
      <button onClick={() => setScreen('home')} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: 'var(--text-2)', fontSize: 13, marginBottom: 24, padding: 0 }}>
        <ArrowLeft size={14} /> Back
      </button>
      <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 6 }}>Your Analytics</h2>
      <p style={{ fontSize: 14, color: 'var(--text-2)', marginBottom: 24 }}>Performance snapshot across {total} questions.</p>
      <div className="stat-grid" style={{ marginBottom: 24 }}>
        <div className="stat-card"><div className="stat-label">Overall accuracy</div><div className="stat-value" style={{ color: pctColor(acc) }}>{acc}%</div><div className="stat-sub">{correct}/{total} correct</div></div>
        <div className="stat-card"><div className="stat-label">Est. score</div><div className="stat-value" style={{ color: 'var(--purple)' }}>{scoreEst()}</div><div className="stat-sub">target: 176â180</div></div>
        <div className="stat-card"><div className="stat-label">Avg time</div><div className="stat-value" style={{ color: avgTime <= 90 ? 'var(--green)' : 'var(--gold)' }}>{avgTime}s</div><div className="stat-sub">{avgTime <= 90 ? 'on pace' : 'over target'}</div></div>
        <div className="stat-card"><div className="stat-label">Best streak</div><div className="stat-value" style={{ color: bestStreak >= 5 ? 'var(--gold)' : 'var(--text)' }}>{bestStreak}</div><div className="stat-sub">recent: {recentAcc}% (last 20)</div></div>
      </div>
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 16 }}>By Section</div>
        {secStats.map(({ sec, total: st, correct: sc, pct, avg }) => {
          if (st === 0) return null
          const meta = SECTION_META[sec]
          return (
            <div key={sec} style={{ marginBottom: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {sec === 'LR' ? <Brain size={14} color={meta.color} /> : <BookOpen size={14} color={meta.color} />}
                  <span style={{ fontSize: 14, fontWeight: 500 }}>{meta.label}</span>
                  <span style={{ fontSize: 12, color: 'var(--text-3)' }}>{st}q Â· avg {avg}s</span>
                </div>
                <span style={{ fontSize: 16, fontWeight: 700, color: pctColor(pct) }}>{pct}%</span>
              </div>
              <div className="perf-bar-wrap"><div className="perf-bar" style={{ width: `${pct}%`, background: pctColor(pct) }} /></div>
            </div>
          )
        })}
      </div>
      {typeArr.length > 0 && (
        <div className="card" style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>By Question Type</div>
            <span style={{ fontSize: 11, color: 'var(--text-3)' }}>sorted worst â best</span>
          </div>
          {typeArr.map(({ type, correct: c, total: t, sec }) => (
            <TypeRow key={`${sec}::${type}`} type={type} correct={c} total={t} sec={sec} onDrill={handleDrill} />
          ))}
        </div>
      )}
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <Trophy size={16} color="var(--gold)" />
          <span style={{ fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-2)' }}>176+ Target Checklist</span>
        </div>
        {[
          { label: 'Overall accuracy â¥ 90%', ok: acc >= 90, note: `you're at ${acc}%` },
          { label: 'LR accuracy â¥ 88%', ok: (() => { const s = history.filter(h => h.section === 'LR'); return s.length >= 5 && s.filter(h => h.correct).length / s.length >= 0.88 })(), note: `${secStats.find(s => s.sec === 'LR')?.pct || 0}%` },
          { label: 'RC accuracy â¥ 85%', ok: (() => { const s = history.filter(h => h.section === 'RC'); return s.length >= 5 && s.filter(h => h.correct).length / s.length >= 0.85 })(), note: `${secStats.find(s => s.sec === 'RC')?.pct || 0}%` },
          { label: 'LR avg time â¤ 84s', ok: (() => { const s = history.filter(h => h.section === 'LR'); return s.length >= 5 && s.reduce((a, h) => a + h.timeTaken, 0) / s.length <= 84 })(), note: `${secStats.find(s => s.sec === 'LR')?.avg || 'â'}s avg` },
          { label: 'No type below 80% (â¥5 done)', ok: typeArr.filter(t => t.total >= 5).every(t => t.correct / t.total >= 0.80), note: `${typeArr.filter(t => t.total >= 5 && t.correct / t.total < 0.80).length} gaps` },
          { label: 'Best streak â¥ 10', ok: bestStreak >= 10, note: `best: ${bestStreak}` },
        ].map(({ label, ok, note }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12, fontSize: 13.5 }}>
            <div style={{ width: 20, height: 20, borderRadius: 50, flexShrink: 0, background: ok ? 'var(--green)" : 'var(--bg-elevated)', border: `1px solid ${ok ? 'var(--green)' : 'var(--border-md)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>{ok ? 'â' : ''}</div>
            <div style={{ flex: 1, color: ok ? 'var(--text)' : 'var(--text-2)' }}>{label}</div>
            <div style={{ fontSize: 12, color: ok ? 'var(--green)' : 'var(--text-3)' }}>{note}</div>
          </div>
        ))}
      </div>
      <button className="btn btn-primary btn-full" style={{ fontSize: 15, fontWeight: 600 }} onClick={() => setScreen('setup')}>
        <Target size={16} /> Continue Practicing
      </button>
    </div>
  )
}
