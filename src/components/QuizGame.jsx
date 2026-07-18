import { useState, useEffect, useRef } from 'react';

/* ═══════════════════════════════════════
   TIMER HOOK
═══════════════════════════════════════ */
function useTimer(timeLimit, active) {
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const startRef = useRef(Date.now());

  useEffect(() => {
    setTimeLeft(timeLimit);
    if (!active) return;
    startRef.current = Date.now();
    const iv = setInterval(() => {
      const elapsed = (Date.now() - startRef.current) / 1000;
      setTimeLeft(Math.max(0, timeLimit - elapsed));
    }, 100);
    return () => clearInterval(iv);
  }, [active, timeLimit]);

  return timeLeft;
}

/* ═══════════════════════════════════════
   ANSWER REVEAL — simple dark overlay
═══════════════════════════════════════ */
function AnswerReveal({ result, question }) {
  const { correct, timedOut, explanation, pointsEarned, teamScore, correctIndex, chosenIndex } = result;
  const correctText = question?.options?.[correctIndex] ?? '';
  const chosenText  = question?.options?.[chosenIndex]  ?? '';

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 60,
      background: 'rgba(0,0,0,0.93)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '2rem',
      animation: 'fadeIn 0.25s ease-out',
    }}>
      {/* Status */}
      <div style={{
        fontSize: '4rem', lineHeight: 1, marginBottom: '1rem',
        animation: 'revealIn 0.35s ease-out',
      }}>
        {timedOut ? '⏰' : correct ? '✅' : '❌'}
      </div>

      <h2 style={{
        fontFamily: "'Nunito', sans-serif",
        fontSize: 'clamp(1.5rem, 4vw, 2.2rem)',
        fontWeight: 900,
        color: timedOut ? '#FFD43B' : correct ? '#51CF66' : '#FF6B6B',
        marginBottom: '1.5rem',
        textAlign: 'center',
      }}>
        {timedOut ? "Time's Up!" : correct ? 'Correct!' : 'Wrong!'}
      </h2>

      {/* Correct answer banner (when wrong) */}
      {!correct && !timedOut && (
        <div style={{
          background: '#161616', border: '1px solid #51CF66',
          borderRadius: 8, padding: '0.6rem 1.5rem',
          marginBottom: '1rem',
          animation: 'slideUp 0.3s 0.1s both',
        }}>
          <span style={{ color: '#888', fontSize: '0.75rem', fontWeight: 900, letterSpacing: 1 }}>CORRECT ANSWER  </span>
          <span style={{ color: '#51CF66', fontWeight: 900, fontSize: '0.95rem' }}>{correctText}</span>
        </div>
      )}
      {timedOut && (
        <div style={{
          background: '#161616', border: '1px solid #51CF66',
          borderRadius: 8, padding: '0.6rem 1.5rem',
          marginBottom: '1rem',
          animation: 'slideUp 0.3s 0.1s both',
        }}>
          <span style={{ color: '#888', fontSize: '0.75rem', fontWeight: 900, letterSpacing: 1 }}>CORRECT ANSWER  </span>
          <span style={{ color: '#51CF66', fontWeight: 900, fontSize: '0.95rem' }}>{correctText}</span>
        </div>
      )}

      {/* Explanation */}
      <div style={{
        background: '#111', border: '1px solid #222',
        borderRadius: 10, padding: '1.25rem 1.5rem',
        maxWidth: 520, width: '100%',
        animation: 'slideUp 0.3s 0.2s both',
      }}>
        <p style={{ color: '#aaa', fontWeight: 800, fontSize: '0.9rem', lineHeight: 1.65, margin: 0, fontFamily: "'Nunito'" }}>
          {explanation}
        </p>
      </div>

      {/* Points + team score */}
      <div style={{ display: 'flex', gap: '1.25rem', marginTop: '1.5rem', animation: 'slideUp 0.3s 0.3s both', flexWrap: 'wrap', justifyContent: 'center' }}>
        <div style={{ background: '#161616', border: `1px solid ${correct ? '#51CF66' : '#333'}`, borderRadius: 8, padding: '0.75rem 1.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.65rem', color: '#555', fontWeight: 900, letterSpacing: 2, marginBottom: 4 }}>POINTS</div>
          <div className="display-font" style={{ fontSize: '1.5rem', color: correct ? '#51CF66' : '#555' }}>+{pointsEarned}</div>
        </div>
        <div style={{ background: '#161616', border: '1px solid #4A9EFF', borderRadius: 8, padding: '0.75rem 1.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.65rem', color: '#555', fontWeight: 900, letterSpacing: 2, marginBottom: 4 }}>TEAM SCORE</div>
          <div className="display-font" style={{ fontSize: '1.5rem', color: '#4A9EFF' }}>{teamScore}</div>
        </div>
      </div>

      <p style={{ marginTop: '1.5rem', color: '#333', fontWeight: 800, fontSize: '0.75rem', letterSpacing: 2 }}>
        Next question loading...
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════
   MAIN QUIZ GAME
═══════════════════════════════════════ */
export default function QuizGame({ socket, roomCode, isHost, players }) {
  const [question, setQuestion]       = useState(null);
  const [result, setResult]           = useState(null);
  const [selectedIdx, setSelectedIdx] = useState(null); // this player's pick
  const [hostPickIdx, setHostPickIdx] = useState(null); // host's broadcast pick (for spectators)
  const [spectatorVotes, setSpectatorVotes] = useState({});
  const [teamScore, setTeamScore]     = useState(0);
  const [submitted, setSubmitted]     = useState(false);
  const [timerKey, setTimerKey]       = useState(0);

  const timeLeft = useTimer(
    question?.timeLimit ?? 20,
    !!(question && !result && !submitted)
  );

  /* ── Socket events ─────────────────────── */
  useEffect(() => {
    if (!socket) return;

    socket.on('question', (q) => {
      setQuestion(q);
      setResult(null);
      setSelectedIdx(null);
      setHostPickIdx(null);
      setSpectatorVotes({});
      setSubmitted(false);
      setTimerKey(k => k + 1);
    });

    socket.on('answer_result', (data) => {
      setResult(data);
      setTeamScore(data.teamScore);
    });

    socket.on('spectator_voted', ({ playerId, answerIndex }) => {
      setSpectatorVotes(prev => ({ ...prev, [playerId]: answerIndex }));
      // Track host's pick for spectator view
      if (players?.[0]?.id === playerId) setHostPickIdx(answerIndex);
    });

    return () => {
      socket.off('question');
      socket.off('answer_result');
      socket.off('spectator_voted');
    };
  }, [socket, players]);

  /* ── Click handler ─────────────────────── */
  const handleOptionClick = (idx) => {
    if (result) return;
    if (!question) return;

    setSelectedIdx(idx);

    if (!isHost) {
      // Spectator: broadcast vote only
      socket.emit('spectator_pick', { roomCode, answerIndex: idx });
    }
    // Host: just select — they must click "Lock Answer" to submit
  };

  /* ── Lock Answer (host only) ─────────── */
  const handleLockAnswer = () => {
    if (!isHost || submitted || selectedIdx === null || result) return;
    setSubmitted(true);
    socket.emit('submit_answer', { roomCode, answerIndex: selectedIdx });
  };

  /* ── Waiting screen ─────────────────── */
  if (!question) {
    return (
      <div style={{ height: '100vh', background: '#0d0d0d', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ animation: 'pulseHard 1.5s infinite' }}>
          <p style={{ fontFamily: "'Nunito'", fontWeight: 900, fontSize: '1.1rem', color: '#555', letterSpacing: 3 }}>
            GET READY...
          </p>
        </div>
      </div>
    );
  }

  const pct = (timeLeft / (question.timeLimit ?? 20)) * 100;
  const isWarning = timeLeft <= 5;

  /* ── Option style (reference image style) ── */
  const getOptionStyle = (idx) => {
    const isSelected = selectedIdx === idx;
    const isHostPick = hostPickIdx === idx;

    // After reveal
    if (result) {
      if (idx === result.correctIndex) {
        return {
          background: '#0e2e16', border: '2px solid #51CF66',
          borderRadius: 8, padding: '1rem 1.25rem',
          display: 'flex', alignItems: 'center', gap: '0.85rem',
          cursor: 'default', width: '100%',
        };
      }
      if (idx === result.chosenIndex && !result.correct) {
        return {
          background: '#2a0e0e', border: '2px solid #FF6B6B',
          borderRadius: 8, padding: '1rem 1.25rem',
          display: 'flex', alignItems: 'center', gap: '0.85rem',
          cursor: 'default', width: '100%',
        };
      }
      return {
        background: '#111', border: '2px solid #1a1a1a',
        borderRadius: 8, padding: '1rem 1.25rem',
        display: 'flex', alignItems: 'center', gap: '0.85rem',
        cursor: 'default', opacity: 0.45, width: '100%',
      };
    }

    // Pre-reveal
    const selected = isSelected || (!isHost && isHostPick);
    return {
      background: selected ? '#1e2535' : '#161616',
      border: selected ? '2px solid #4A9EFF' : '2px solid #2a2a2a',
      borderRadius: 8, padding: '1rem 1.25rem',
      display: 'flex', alignItems: 'center', gap: '0.85rem',
      cursor: result ? 'default' : 'pointer', width: '100%',
      transition: 'background 0.12s, border-color 0.12s',
    };
  };

  /* ── Radio indicator ─────────────────── */
  const RadioDot = ({ idx }) => {
    const isSelected = selectedIdx === idx;
    const isHostPick = hostPickIdx === idx;
    const active = isSelected || (!isHost && isHostPick);

    if (result) {
      if (idx === result.correctIndex)
        return <span style={{ fontSize: '1rem', flexShrink: 0 }}>✅</span>;
      if (idx === result.chosenIndex && !result.correct)
        return <span style={{ fontSize: '1rem', flexShrink: 0 }}>❌</span>;
      return (
        <div style={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid #2a2a2a', flexShrink: 0 }}/>
      );
    }

    return (
      <div style={{
        width: 18, height: 18, borderRadius: '50%',
        border: `2px solid ${active ? '#4A9EFF' : '#444'}`,
        background: active ? '#4A9EFF' : 'transparent',
        flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'background 0.12s, border-color 0.12s',
      }}>
        {active && <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#0d0d0d' }}/>}
      </div>
    );
  };

  /* ── Spectator vote count chip (visible to host) ── */
  const VoteCount = ({ idx }) => {
    if (!isHost || result) return null;
    const count = Object.values(spectatorVotes).filter(v => v === idx).length;
    if (!count) return null;
    return (
      <span style={{
        marginLeft: 'auto', background: '#1a2a3a', color: '#4A9EFF',
        borderRadius: 4, padding: '2px 8px', fontSize: '0.7rem', fontWeight: 900,
      }}>
        {count}
      </span>
    );
  };

  return (
    <div style={{ position: 'relative', height: '100vh', background: '#0d0d0d', display: 'flex', flexDirection: 'column', overflow: 'hidden', color: '#e5e5e5' }}>

      {/* ── TOP BAR ─────────────────────────── */}
      <div style={{
        padding: '0.9rem 1.75rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid #1a1a1a', flexShrink: 0, gap: '1rem',
      }}>
        {/* Round counter */}
        <span style={{ fontFamily: "'Nunito'", fontWeight: 900, fontSize: '0.85rem', color: '#4A9EFF', letterSpacing: 1 }}>
          ROUND {question.index} OF {question.total}
        </span>

        {/* Category */}
        <span style={{ fontFamily: "'Nunito'", fontWeight: 800, fontSize: '0.75rem', color: '#555', letterSpacing: 1 }}>
          {question.category}
        </span>

        {/* Timer + score */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontFamily: "'Nunito'", fontWeight: 900, fontSize: '0.85rem', color: isWarning ? '#FF6B6B' : '#888' }}>
            {Math.ceil(timeLeft)}s
          </span>
          <span style={{ fontFamily: "'Nunito'", fontWeight: 900, fontSize: '0.85rem', color: '#ccc' }}>
            {teamScore} pts
          </span>
        </div>
      </div>

      {/* ── TIMER BAR ────────────────────────── */}
      <div style={{ height: 3, background: '#1a1a1a', flexShrink: 0 }}>
        <div style={{
          height: '100%',
          width: `${pct}%`,
          background: isWarning ? '#FF6B6B' : '#4A9EFF',
          transition: 'width 0.1s linear, background 0.3s',
        }}/>
      </div>

      {/* ── MAIN CONTENT (centered) ──────────── */}
      <div style={{
        flex: 1, overflowY: 'auto',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '2rem 1.5rem', gap: '1.25rem',
      }}>
        <div style={{ width: '100%', maxWidth: 640, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          {/* QUESTION CARD */}
          <div style={{
            background: '#161616', border: '1px solid #222',
            borderRadius: 10, padding: '1.75rem 2rem',
          }}>
            <p style={{
              fontFamily: "'Nunito', sans-serif",
              fontWeight: 800,
              fontSize: 'clamp(1rem, 2.8vw, 1.35rem)',
              lineHeight: 1.65, color: '#e5e5e5', margin: 0,
            }}>
              {question.question}
            </p>
          </div>

          {/* OPTIONS — 2×2 grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
            {question.options.map((opt, idx) => (
              <button
                key={idx}
                id={`option-${idx}`}
                onClick={() => handleOptionClick(idx)}
                disabled={!!result || (isHost && submitted)}
                style={getOptionStyle(idx)}
              >
                <RadioDot idx={idx}/>
                <span style={{
                  fontFamily: "'Nunito', sans-serif",
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  color: result
                    ? (idx === result.correctIndex ? '#51CF66' : idx === result.chosenIndex ? '#FF6B6B' : '#444')
                    : '#ccc',
                  flex: 1, textAlign: 'left', lineHeight: 1.4,
                }}>
                  {opt}
                </span>
                <VoteCount idx={idx}/>
              </button>
            ))}
          </div>

          {/* LOCK ANSWER — host only */}
          {isHost && !result && (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0.25rem' }}>
              <button
                onClick={handleLockAnswer}
                disabled={selectedIdx === null || submitted}
                style={{
                  background: selectedIdx !== null && !submitted ? '#1e2535' : '#111',
                  border: `2px solid ${selectedIdx !== null && !submitted ? '#4A9EFF' : '#222'}`,
                  borderRadius: 8, padding: '0.7rem 2.5rem',
                  fontFamily: "'Nunito', sans-serif", fontWeight: 900,
                  fontSize: '0.9rem', color: selectedIdx !== null && !submitted ? '#4A9EFF' : '#444',
                  cursor: selectedIdx !== null && !submitted ? 'pointer' : 'not-allowed',
                  transition: 'all 0.12s',
                  letterSpacing: 1,
                }}
              >
                {submitted ? 'Answer Locked ✓' : 'Lock Answer'}
              </button>
            </div>
          )}

          {/* Spectator status */}
          {!isHost && !result && (
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontFamily: "'Nunito'", fontWeight: 800, fontSize: '0.78rem', color: '#444', letterSpacing: 1 }}>
                {selectedIdx !== null
                  ? `Your vote: ${question.options[selectedIdx]}`
                  : 'Select your vote — host will lock the answer'}
              </span>
            </div>
          )}

          {/* Players row */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center', paddingTop: '0.25rem' }}>
            {players.map((p, i) => {
              const hasVoted = spectatorVotes[p.id] !== undefined;
              return (
                <div key={p.id} style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  background: '#111', border: '1px solid #222',
                  borderRadius: 99, padding: '3px 10px',
                }}>
                  {p.isHost && <span style={{ fontSize: '0.6rem', color: '#4A9EFF', fontWeight: 900 }}>HOST</span>}
                  <span style={{ fontWeight: 800, fontSize: '0.75rem', color: '#555' }}>{p.name}</span>
                  {hasVoted && !p.isHost && <span style={{ fontSize: '0.6rem', color: '#51CF66' }}>●</span>}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── ANSWER REVEAL OVERLAY ─────────── */}
      {result && <AnswerReveal result={result} question={question}/>}
    </div>
  );
}
