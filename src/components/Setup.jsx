import { Brain, BookOpen, Loader, Sparkles, ArrowLeft } from 'lucide-react'
import { QT, SECTION_META } from '../constants'

export default function Setup({ section, setSection, qType, setQType, loading, error, setScreen, generateQuestion }) {
  const meta = SECTION_META[section]

  const handleSectionChange = (sec) => {
    setSection(sec)
    setQType('Random')
  }

  return (
    <div className="screen">
      <button
        onClick={() => setScreen('home')}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: 'none', border: 'none', color: 'var(--text-2)',
          fontSize: 13, marginBottom: 24, padding: 0,
        }}
      >
        <ArrowLeft size={14} /> Back
      </button>

      <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 6 }}>Configure Practice</h2>
      <p style={{ fontSize: 14, color: 'var(--text-2)', marginBottom: 28 }}>
        Choose your section and question type, then generate a hard question.
      </p>

      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
          Section
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          {['LR', 'RC'].map(sec => {
            const m = SECTION_META[sec]
            const active = section === sec
            return (
              <button
                key={sec}
                className={`section-select-btn ${active ? `active-${sec}` : ''}`}
                onClick={() => handleSectionChange(sec)}
                style={{ flex: 1 }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  {sec === 'LR'
                    ? <Brain size={18} color={active ? m.color : 'var(--text-2)'} />
                    : <BookOpen size={18} color={active ? m.color : 'var(--text-2)'} />
                  }
                  <span style={{ fontSize: 20, fontWeight: 700, color: active ? m.color : 'var(--text)' }}>{sec}</span>
                </div>
                <div style={{ fontSize: 14, fontWeight: 500, color: active ? m.color : 'var(--text)', marginBottom: 2 }}>
                  {m.label}
                </div>
                <div style={{ fontSize: 12, color: active ? m.color : 'var(--text-2)' }}>
                  {m.desc}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
          Question Type
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {['Random', ...QT[section]].map(t => {
            const active = qType === t
            return (
              <button
                key={t}
                className={`type-pill ${active ? `active-${section}` : ''}`}
                onClick={() => setQType(t)}
                style={{ fontWeight: t === 'Random' ? 600 : 400 }}
              >
                {t === 'Random' ? 'â¦ Random' : t}
              </button>
            )
          })}
        </div>
        {qType !== 'Random' && (
          <div style={{
            marginTop: 14, padding: '10px 14px',
            background: meta.dim,
            border: `1px solid ${meta.border}`,
            borderRadius: 10,
            fontSize: 13,
            color: meta.color,
          }}>
            Generating a hard <strong>{qType}</strong> question for {section}.
          </div>
        )}
      </div>

      {error && (
        <div className="error-box" style={{ marginBottom: 16 }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      <button
        className={`btn btn-full btn-${section === 'LR' ? 'primary' : 'teal'}`}
        onClick={() => generateQuestion()}
        disabled={loading}
        style={{ fontSize: 16, fontWeight: 600, letterSpacing: '-0.01em' }}
      >
        {loading ? (
          <>
            <span className="spinner"><Loader size={16} /></span>
            Generating questionâ¦
          </>
        ) : (
          <>
            <Sparkles size={16} />
            Generate Question
          </>
        )}
      </button>

      {loading && (
        <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-2)', marginTop: 14 }}>
          Crafting a 176+ level {section} Â· {qType === 'Random' ? 'random type' : qType} questionâ¦
        </p>
      )}
    </div>
  )
}
