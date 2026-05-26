import { Check, X, Lightbulb, ArrowRight, Home, Loader, Flame } from 'lucide-react'
import { TL, SECTION_META } from '../constants'

const LETTERS = ['A', 'B', 'C', 'D', 'E']

function ChoiceLetter({ letter, state }) {
  if (state === 'correct') return <Check size={13} />
  if (state === 'wrong') return <X size={13} />
  return <span>{letter}</span>
}

export default function Question({
  section, currentQ, selected, revealed,
  timeLeft, timeTaken, streak,
  loading, handleSelect, handleReveal, handleNext, setScreen,
}) {
  const limit = TL[section]
  const pct = (timeLeft / limit) * 100
  const meta = SECTION_META[section]
  const isCorrect = revealed && selected === currentQ.correctAnswer

  const timerColor =
    pct > 55 ? 'var(--green)' :
    pct > 25 ? 'var(--gold)' :
    'var(--red)'

  const m = Math.floor(timeLeft / 60)
  const s = timeLeft % 60
  const timeStr = `${m}:${s < 10 ? '0' : ''}${s}`

  const getChoiceClass = (letter) => {
    if (!revealed) return selected === letter ? 'selected' : ''
    if (letter === currentQ.correctAnswer) return 'correct'
    if (letter === selected && letter !== currentQ.correctAnswer) return 'wrong'
    return 'dim'
  }

  return (
    <div className="screen">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className={`section-pill ${section}`}>{section}</span>
          <span style={{ fontSize: 13, color: 'var(--text-2)' }}>{currentQ.questionType}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {streak >= 3 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, fontWeight: 600, color: 'var(--gold)' }}>
              <Flame size={13} />
              {streak}
            </div>
          )}
          {!revealed && (
            <span style={{ fontSize: 14, fontWeight: 700, color: timerColor, fontVariantNumeric: 'tabular-nums' }}>
              {timeStr}
            </span>
          )}
        </div>
      </div>

      {!revealed && (
        <div className="timer-bar-wrap" style={{ marginBottom: 20, borderRadius: 3 }}>
          <div
            className="timer-bar"
            style={{
              width: `${pct}%`,
              background: timerColor,
              boxShadow: pct <= 25 ? `0 0 8px ${timerColor}` : 'none',
            }}
          />
        </div>
      )}

      <div
        className="card"
        style={{
          marginBottom: 18,
          lineHeight: 1.75,
          fontSize: 15,
          color: 'var(--text)',
          borderLeft: `3px solid ${meta.border}`,
          borderRadius: '0 14px 14px 0',
          background: 'var(--bg-elevated)',
        }}
      >
        {currentQ.stimulus}
      </div>

      <p style={{ fontWeight: 600, fontSize: 15.5, lineHeight: 1.6, marginBottom: 18, color: 'var(--text)' }}>
        {currentQ.question}
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginBottom: 20 }}>
        {LETTERS.map((letter, i) => (
          <button
            key={letter}
            className={`choice ${getChoiceClass(letter)}`}
            style={{ animationDelay: `${i * 0.04}s` }}
            onClick={() => handleSelect(letter)}
            disabled={revealed}
          >
            <div className="choice-letter">
              <ChoiceLetter letter={letter} state={getChoiceClass(letter)} />
            </div>
            <span className="choice-text">{currentQ.choices[letter]}</span>
          </button>
        ))}
      </div>

      {!revealed ? (
        <button
          className={`btn btn-full btn-${section === 'LR' ? 'primary' : 'teal'}`}
          onClick={handleReveal}
          disabled={!selected}
          style={{ fontSize: 15, fontWeight: 600 }}
        >
          Submit Answer
        </button>
      ) : (
        <div style={{ animation: 'fadeUp 0.25s ease' }}>
          <div className={`result-banner ${isCorrect ? 'correct-banner' : 'wrong-banner'}`}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 28, height: 28, borderRadius: 50,
                background: isCorrect ? 'var(--green)' : 'var(--red)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {isCorrect ? <Check size={15} color="#fff" /> : <X size={15} color="#fff" />}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, color: isCorrect ? 'var(--green)' : 'var(--red)' }}>
                  {isCorrect ? 'Correct!' : `Wrong â Answer: ${currentQ.correctAnswer}`}
                </div>
                {streak >= 3 && isCorrect && (
                  <div style={{ fontSize: 12, color: 'var(--gold)', marginTop: 1 }}>
                    ð¥ {streak}-question streak!
                  </div>
                )}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 13, color: 'var(--text-2)' }}>{timeTaken}s</div>
              {timeTaken < 60 && isCorrect && (
                <div style={{ fontSize: 11, color: 'var(--green)', marginTop: 1 }}>â¡ speed bonus</div>
              )}
            </div>
          </div>

          <div className="explanation-box" style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
              Explanation
            </div>
            <p style={{ fontSize: 14.5, lineHeight: 1.75, color: 'var(--text)' }}>
              {currentQ.explanation}
            </p>
            {currentQ.strategy && (
              <div className="strategy-box">
                <Lightbulb size={16} color="var(--purple)" style={{ flexShrink: 0, marginTop: 1 }} />
                <p style={{ margin: 0, fontSize: 13.5, color: 'var(--text)', lineHeight: 1.6 }}>
                  <strong style={{ color: 'var(--purple)' }}>Expert tip: </strong>
                  {currentQ.strategy}
                </p>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button
              className={`btn btn-${section === 'LR' ? 'primary' : 'teal'}`}
              style={{ flex: 1, justifyContent: 'center', padding: '13px 0', borderRadius: 12, fontSize: 15, fontWeight: 600 }}
              onClick={handleNext}
              disabled={loading}
            >
              {loading ? (
                <><span className="spinner"><Loader size={15} /></span> Loadingâ¦</>
              ) : (
                <>Next Question <ArrowRight size={15} /></>
              )}
            </button>
            <button
              className="btn"
              style={{ padding: '13px 16px', borderRadius: 12 }}
              onClick={() => setScreen('home')}
            >
              <Home size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
