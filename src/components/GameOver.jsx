import { RotateCcw } from 'lucide-react';
import { ChunkyButton, PALETTE } from './UI';

/* ═══════════════════════════════════════
   SIMPLE RECAP CARD
   ═══════════════════════════════════════ */
function RecapCard({ qData, answer, index }) {
  const { question, correctIndex, options } = qData;
  const { correct, answerIndex } = answer;

  return (
    <div
      style={{
        background: '#111',
        border: '1px solid #1a1a1a',
        borderRadius: 8,
        padding: '0.75rem 1.25rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: '1rem', flexShrink: 0 }}>
          {correct ? '✅' : '❌'}
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontWeight: 800, fontSize: '0.82rem', color: '#ccc', fontFamily: "'Nunito'", margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            Q{index + 1}: {question}
          </p>
          <p style={{ fontSize: '0.72rem', color: '#555', fontWeight: 800, margin: '2px 0 0' }}>
            {correct ? (
              <span>Correct Answer: <span style={{ color: '#51CF66' }}>{options[correctIndex]}</span></span>
            ) : (
              <span>
                Your Answer: <span style={{ color: '#FF6B6B' }}>{options[answerIndex]}</span> | Correct: <span style={{ color: '#51CF66' }}>{options[correctIndex]}</span>
              </span>
            )}
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
  const { teamScore, totalPossible, totalTimeTaken, answers, questions } = data;
  const pct = totalPossible > 0 ? Math.round((teamScore / totalPossible) * 100) : 0;

  const mins = Math.floor((totalTimeTaken || 0) / 60);
  const secs = (totalTimeTaken || 0) % 60;
  const formattedTime = `${mins}:${secs.toString().padStart(2, '0')}`;

  return (
    <div style={{ height: '100vh', overflowY: 'auto', background: '#0d0d0d', color: '#e5e5e5', display: 'flex', flexDirection: 'column' }}>

      {/* ── RESULT HERO ─── */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 2rem',
        borderBottom: '1px solid #161616',
      }}>
        <div style={{ textAlign: 'center' }}>
          <h1 className="display-font" style={{ fontSize: 'clamp(2.2rem, 6vw, 3.5rem)', color: '#fff', marginBottom: '0.25rem', lineHeight: 1 }}>
            GAME COMPLETE
          </h1>
          <p style={{ color: '#555', fontWeight: 900, fontSize: '0.75rem', letterSpacing: 3 }}>TEAM RESULTS</p>
        </div>

        {/* Score row */}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <div style={{ background: '#111', border: '1px solid #222', borderRadius: 8, padding: '1.25rem 2rem', textAlign: 'center', minWidth: 140 }}>
            <div style={{ fontSize: '0.65rem', color: '#555', fontWeight: 900, letterSpacing: 2, marginBottom: 6 }}>SCORE</div>
            <div className="display-font" style={{ fontSize: '2rem', color: '#fff', lineHeight: 1 }}>{teamScore}</div>
            <div style={{ fontSize: '0.7rem', color: '#444', marginTop: 4 }}>/ {totalPossible}</div>
          </div>
          <div style={{ background: '#111', border: '1px solid #222', borderRadius: 8, padding: '1.25rem 2rem', textAlign: 'center', minWidth: 140 }}>
            <div style={{ fontSize: '0.65rem', color: '#555', fontWeight: 900, letterSpacing: 2, marginBottom: 6 }}>ACCURACY</div>
            <div className="display-font" style={{ fontSize: '2rem', color: '#51CF66', lineHeight: 1 }}>{pct}%</div>
          </div>
          <div style={{ background: '#111', border: '1px solid #222', borderRadius: 8, padding: '1.25rem 2rem', textAlign: 'center', minWidth: 140 }}>
            <div style={{ fontSize: '0.65rem', color: '#555', fontWeight: 900, letterSpacing: 2, marginBottom: 6 }}>TOTAL TIME</div>
            <div className="display-font" style={{ fontSize: '2rem', color: '#4A9EFF', lineHeight: 1 }}>{formattedTime}</div>
          </div>
        </div>

        {/* Play Again */}
        {isHost ? (
          <div style={{ marginTop: '2rem' }}>
            <ChunkyButton color="#1a1a1a" onClick={onPlayAgain} style={{ padding: '0.8rem 2.2rem', border: '2px solid #333' }}>
              <RotateCcw size={16}/> Play Again
            </ChunkyButton>
          </div>
        ) : (
          <p style={{ marginTop: '2rem', color: '#444', fontWeight: 800, fontSize: '0.75rem', letterSpacing: 2 }}>
            Waiting for host to start a new game...
          </p>
        )}
      </div>

      {/* ── ROUND RECAP ─── */}
      <div style={{ padding: '2rem 1.5rem', maxWidth: 600, margin: '0 auto', width: '100%', paddingBottom: '3rem' }}>
        <h2 className="display-font" style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '1rem', letterSpacing: 1 }}>RECAP</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {questions.map((q, i) => (
            <RecapCard key={i} qData={q} answer={answers[i]} index={i}/>
          ))}
        </div>
      </div>
    </div>
  );
}
