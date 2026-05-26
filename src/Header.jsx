import { Brain, BarChart2, Home, Zap, Flame } from 'lucide-react'
import { LEVELS } from '../constants'

export default function Header({ xp, level, levelPct, streak, screen, setScreen }) {
  const nextLevel = LEVELS.find(l => l.min > (xp || 0))

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(7,7,15,0.88)',
      backdropFilter: 'blur(14px)',
      borderBottom: '1px solid var(--border)',
      padding: '12px 0',
      marginBottom: '28px',
    }}>
      {/* Top row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        {/* Logo / nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {screen !== 'home' && (
            <button
              onClick={() => setScreen('home')}
              style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-md)',
                borderRadius: 8,
                padding: '6px 10px',
                color: 'var(--text-2)',
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                fontSize: 13,
              }}
            >
              <Home size={14} />
            </button>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <Brain size={18} color="var(--purple)" />
            <span style={{ fontSize: 15, fontWeight: 700, letterSpacing: '-0.02em' }}>
              LSAT <span style={{ color: 'var(--purple)' }}>176+</span>
            </span>
          </div>
        </div>

        {/* Right: streak + xp + analytics */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Streak */}
          <div className={`streak-badge ${streak >= 3 ? 'streak-hot' : 'streak-cold'} ${streak > 0 && streak % 5 === 0 ? 'pulse' : ''}`}>
            <Flame size={13} />
            <span>{streak}</span>
          </div>

          {/* XP */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-md)',
            borderRadius: 20,
            padding: '4px 12px',
            fontSize: 13,
            fontWeight: 600,
            color: 'var(--gold)',
          }}>
            <Zap size={12} />
            <span>{xp.toLocaleString()}</span>
          </div>

          {/* Analytics */}
          {screen !== 'analytics' && (
            <button
              onClick={() => setScreen('analytics')}
              style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-md)',
                borderRadius: 8,
                padding: '6px 10px',
                color: 'var(--text-2)',
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                fontSize: 13,
              }}
            >
              <BarChart2 size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Level bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: level.color, minWidth: 90, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
          {level.name}
        </span>
        <div className="level-bar-wrap" style={{ flex: 1 }}>
          <div
            className="level-bar"
            style={{ width: `${levelPct}%`, background: `linear-gradient(90deg, ${level.color}, var(--teal))` }}
          />
        </div>
        <span style={{ fontSize: 11, color: 'var(--text-3)', minWidth: 40, textAlign: 'right' }}>
          {levelPct}%
        </span>
      </div>
    </header>
  )
}
