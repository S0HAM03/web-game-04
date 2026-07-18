import { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { ChunkyButton, PALETTE } from './UI';

const OPTION_LABELS = ['A', 'B', 'C', 'D'];

/* ═══════════════════════════════════════
   PER-QUESTION RECAP CARD
═══════════════════════════════════════ */
function RecapCard({ qData, answer, index }) {
  const [open, setOpen] = useState(false);
  const { question, options, correctIndex, category, explanation } = qData;
  const { correct, answerIndex, timedOut, pointsEarned } = answer;

  return (
    <div
      onClick={() => setOpen(o => !o)}
      style={{
        background: '#111', border: `1px solid ${correct ? '#51CF66' : '#FF6B6B'}`,
        borderRadius: 10, padding: '1rem 1.25rem',
        cursor: 'pointer', animation: `slideUp 0.3s ${0.04 * index}s both`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>
          {correct ? '✅' : timedOut ? '⏰' : '❌'}
        </span>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.65rem', color: '#444', fontWeight: 900, letterSpacing: 1 }}>Q{index + 1}</span>
            <span style={{ fontSize: '0.65rem', color: '#555', fontWeight: 800, background: '#1a1a1a', padding: '2px 8px', borderRadius: 4 }}>{category}</span>
            <span style={{ marginLeft: 'auto', fontSize: '0.75rem', fontWeight: 900, color: correct ? '#51CF66' : '#FF6B6B' }}>
              +{pointsEarned} pts
            </span>
          </div>
          <p style={{ fontWeight: 800, fontSize: '0.88rem', color: '#ccc', fontFamily: "'Nunito'", lineHeight: 1.5, margin: 0 }}>
            {question}
          </p>

          {/* Answer info */}
          <div style={{ marginTop: 8, fontSize: '0.78rem', fontWeight: 800, color: '#555' }}>
            {timedOut
              ? <span>Timed out — correct was <span style={{ color: '#51CF66' }}>{options[correctIndex]}</span></span>
              : correct
              ? <span style={{ color: '#51CF66' }}>Correct: {options[correctIndex]}</span>
              : <span>
                  Your answer: <span style={{ color: '#FF6B6B' }}>{options[answerIndex]}</span>
                  {' · '}Correct: <span style={{ color: '#51CF66' }}>{options[correctIndex]}</span>
                </span>
            }
          </div>

          {open && (
            <div style={{ marginTop: 10, background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: 8, padding: '0.75rem', animation: 'fadeIn 0.2s ease-out' }}>
              <p style={{ color: '#666', fontWeight: 800, fontSize: '0.8rem', fontFamily: "'Nunito'", lineHeight: 1.6, margin: 0 }}>
                {explanation}
              </p>
            </div>
          )}
          <p style={{ color: '#333', fontSize: '0.68rem', fontWeight: 700, margin: '6px 0 0', fontFamily: "'Nunito'" }}>
            {open ? '▲ Hide' : '▼ Tap for explanation'}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   GAME OVER SCREEN
═══════════════════════════════════════ */
export default function GameOver({ data, isHost, players, onPlayAgain }) {
  const { teamScore, totalPossible, answers, questions } = data;
  const pct = totalPossible > 0 ? Math.round((teamScore / totalPossible) * 100) : 0;
  const correct = answers.filter(a => a.correct).length;

  const getRating = () => {
    if (pct >= 90) return { label: 'LEGENDARY', emoji: '🏆', color: '#FFD43B' };
    if (pct >= 70) return { label: 'BRILLIANT',  emoji: '⭐', color: '#51CF66' };
    if (pct >= 50) return { label: 'SOLID',       emoji: '👍', color: '#4A9EFF' };
    if (pct >= 30) return { label: 'AVERAGE',     emoji: '😅', color: '#FF922B' };
    return              { label: 'SKILL ISSUE',  emoji: '💀', color: '#FF6B6B' };
  };
  const rating = getRating();

  return (
    <div style={{ height: '100vh', overflowY: 'auto', background: '#0d0d0d', color: '#e5e5e5' }}>

      {/* ── RESULT HERO ─── */}
      <div style={{
        minHeight: '55vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '3rem 2rem', borderBottom: '1px solid #1a1a1a',
      }}>
        <div style={{ textAlign: 'center', animation: 'revealIn 0.5s ease-out' }}>
          <div style={{ fontSize: '4.5rem', marginBottom: '0.75rem' }}>{rating.emoji}</div>
          <h1 className="display-font" style={{ fontSize: 'clamp(2.5rem, 7vw, 4.5rem)', color: rating.color, marginBottom: '0.25rem', lineHeight: 1 }}>
            {rating.label}
          </h1>
          <p style={{ color: '#444', fontWeight: 900, fontSize: '0.75rem', letterSpacing: 3 }}>GAME COMPLETE</p>
        </div>

        {/* Score row */}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem', flexWrap: 'wrap', justifyContent: 'center', animation: 'slideUp 0.4s 0.2s both' }}>
          <div style={{ background: '#111', border: '1px solid #2a2a2a', borderRadius: 10, padding: '1.25rem 2rem', textAlign: 'center' }}>
            <div style={{ fontSize: '0.65rem', color: '#555', fontWeight: 900, letterSpacing: 2, marginBottom: 6 }}>TEAM SCORE</div>
            <div className="display-font" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', color: '#fff', lineHeight: 1 }}>{teamScore}</div>
            <div style={{ fontSize: '0.7rem', color: '#444', marginTop: 4 }}>/ {totalPossible}</div>
          </div>
          <div style={{ background: '#111', border: '1px solid #2a2a2a', borderRadius: 10, padding: '1.25rem 2rem', textAlign: 'center' }}>
            <div style={{ fontSize: '0.65rem', color: '#555', fontWeight: 900, letterSpacing: 2, marginBottom: 6 }}>ACCURACY</div>
            <div className="display-font" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', color: '#4A9EFF', lineHeight: 1 }}>{pct}%</div>
          </div>
          <div style={{ background: '#111', border: '1px solid #2a2a2a', borderRadius: 10, padding: '1.25rem 2rem', textAlign: 'center' }}>
            <div style={{ fontSize: '0.65rem', color: '#555', fontWeight: 900, letterSpacing: 2, marginBottom: 6 }}>CORRECT</div>
            <div className="display-font" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', color: '#51CF66', lineHeight: 1 }}>{correct}/{answers.length}</div>
          </div>
        </div>

        {/* Players */}
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.75rem', flexWrap: 'wrap', justifyContent: 'center', animation: 'slideUp 0.4s 0.35s both' }}>
          {players.map((p, i) => {
            const c = PALETTE[i % PALETTE.length];
            return (
              <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#111', border: `1px solid #2a2a2a`, borderRadius: 99, padding: '4px 14px' }}>
                {p.isHost && <span style={{ fontSize: '0.6rem', color: '#4A9EFF', fontWeight: 900 }}>HOST</span>}
                <span style={{ fontWeight: 900, fontSize: '0.82rem', color: c.bg }}>{p.name}</span>
              </div>
            );
          })}
        </div>

        {/* Play Again */}
        {isHost ? (
          <div style={{ marginTop: '2rem', animation: 'slideUp 0.4s 0.45s both' }}>
            <ChunkyButton color="#1a1a1a" onClick={onPlayAgain} style={{ padding: '1rem 2.5rem', border: '2px solid #333' }}>
              <RotateCcw size={18}/> Play Again
            </ChunkyButton>
          </div>
        ) : (
          <p style={{ marginTop: '2rem', color: '#333', fontWeight: 900, fontSize: '0.75rem', letterSpacing: 2 }}>
            Waiting for host to start again...
          </p>
        )}
      </div>

      {/* ── ROUND RECAP ─── */}
      <div style={{ padding: '2rem 1.5rem', maxWidth: 680, margin: '0 auto', paddingBottom: '3rem' }}>
        <h2 className="display-font" style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '0.5rem' }}>ROUND RECAP</h2>
        <p style={{ color: '#444', fontWeight: 800, fontSize: '0.75rem', letterSpacing: 1, marginBottom: '1.5rem' }}>
          Tap a question to see the explanation
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {questions.map((q, i) => (
            <RecapCard key={i} qData={q} answer={answers[i]} index={i}/>
          ))}
        </div>
      </div>
    </div>
  );
}
