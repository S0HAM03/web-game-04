import { useState, useEffect, useRef } from 'react';
import { ChunkyButton } from './UI';
import { ArrowRight, Image as ImageIcon, Volume2 } from 'lucide-react';
import { playClick, playCorrect, playWrong } from '../utils/sfx';

/* ═══════════════════════════════════════
   TIMERS
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

  return Math.ceil(timeLeft);
}

function useStopwatch(startTime) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!startTime) return;
    const iv = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    // Initial set
    setElapsed(Math.floor((Date.now() - startTime) / 1000));
    return () => clearInterval(iv);
  }, [startTime]);

  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/* ═══════════════════════════════════════
   MAIN QUIZ GAME
═══════════════════════════════════════ */
export default function QuizGame({ socket, roomCode, isHost, players, gameStartTime }) {
  const [question, setQuestion]       = useState(null);
  const [result, setResult]           = useState(null);
  const [selectedIdx, setSelectedIdx] = useState(null); // this player's pick
  const [hostPickIdx, setHostPickIdx] = useState(null); // host's broadcast pick (for spectators)
  const [spectatorVotes, setSpectatorVotes] = useState({});
  const [teamScore, setTeamScore]     = useState(0);
  const [submitted, setSubmitted]     = useState(false);

  const activeGameStartTime = question?.gameStartTime || gameStartTime;
  const timeString = useStopwatch(activeGameStartTime);
  
  const revealTimeLeft = useTimer(15, !!result);

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
    });

    socket.on('answer_result', (data) => {
      setResult(data);
      setTeamScore(data.teamScore);
      if (data.correct) playCorrect();
      else playWrong();
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

    playClick();
    setSelectedIdx(idx);

    if (!isHost) {
      // Spectator: broadcast vote only
      socket.emit('spectator_pick', { roomCode, answerIndex: idx });
    }
  };

  /* ── Lock Answer (host only) ─────────── */
  const handleLockAnswer = () => {
    if (!isHost || submitted || selectedIdx === null || result) return;
    playClick();
    setSubmitted(true);
    socket.emit('submit_answer', { roomCode, answerIndex: selectedIdx });
  };

  /* ── Next Question (host only) ───────── */
  const handleNextQuestion = () => {
    if (!isHost || !result) return;
    playClick();
    socket.emit('next_question', { roomCode });
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

  /* ── Option style ── */
  const getOptionStyle = (idx) => {
    const isSelected = selectedIdx === idx;
    const isHostPick = hostPickIdx === idx;

    // After reveal
    if (result) {
      if (idx === result.correctIndex) {
        return {
          background: '#161616', border: '2px solid #51CF66',
          borderRadius: 8, padding: '1rem 1.25rem',
          display: 'flex', alignItems: 'center', gap: '0.85rem',
          cursor: 'default', width: '100%',
        };
      }
      if (idx === result.chosenIndex && !result.correct) {
        return {
          background: '#161616', border: '2px solid #FF6B6B',
          borderRadius: 8, padding: '1rem 1.25rem',
          display: 'flex', alignItems: 'center', gap: '0.85rem',
          cursor: 'default', width: '100%',
        };
      }
      return {
        background: '#161616', border: '2px solid #1a1a1a',
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
        return <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>✅</span>;
      if (idx === result.chosenIndex && !result.correct)
        return <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>❌</span>;
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

  /* ── Spectator vote count chip ── */
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
        <span style={{ fontFamily: "'Nunito'", fontWeight: 900, fontSize: '0.85rem', color: '#4A9EFF', letterSpacing: 1 }}>
          ROUND {question.index} OF {question.total}
        </span>
        <span style={{ fontFamily: "'Nunito'", fontWeight: 800, fontSize: '0.75rem', color: '#555', letterSpacing: 1 }}>
          {question.category}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontFamily: "'Nunito'", fontWeight: 900, fontSize: '0.85rem', color: '#888' }}>
            ⏱ {timeString}
          </span>
          <span style={{ fontFamily: "'Nunito'", fontWeight: 900, fontSize: '0.85rem', color: '#ccc' }}>
            {teamScore} pts
          </span>
        </div>
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
            {question.imageUrl && (
              <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
                <img 
                  src={question.imageUrl} 
                  alt="Clue" 
                  style={{ maxWidth: '100%', maxHeight: 220, borderRadius: 8, objectFit: 'contain', border: '1px solid #333' }} 
                />
              </div>
            )}
            {question.audioUrl && (
              <div style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#0d0d0d', padding: '1rem', borderRadius: 8, border: '1px solid #333' }}>
                <Volume2 size={24} color="#4A9EFF" style={{ marginBottom: '0.5rem' }}/>
                <span style={{ fontSize: '0.75rem', color: '#888', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: 1 }}>AUDIO CLUE</span>
                <audio controls src={question.audioUrl} style={{ height: 35, width: '100%', maxWidth: 300 }} />
              </div>
            )}
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

          {/* ACTIONS / STATUS */}
          {!result && isHost && (
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

          {result && isHost && (
             <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '0.25rem', animation: 'fadeIn 0.3s ease' }}>
                <ChunkyButton color="#4A9EFF" onClick={handleNextQuestion} style={{ padding: '0.6rem 2rem', border: '2px solid #fff', fontSize: '0.85rem' }}>
                  Next Question <ArrowRight size={16}/>
                </ChunkyButton>
                <span style={{ marginTop: '0.75rem', fontFamily: "'Nunito'", fontWeight: 800, fontSize: '0.78rem', color: '#666', letterSpacing: 1 }}>
                  Auto-advancing in {revealTimeLeft}s...
                </span>
             </div>
          )}

          {!isHost && !result && (
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontFamily: "'Nunito'", fontWeight: 800, fontSize: '0.78rem', color: '#444', letterSpacing: 1 }}>
                {selectedIdx !== null
                  ? `Your vote: ${question.options[selectedIdx]}`
                  : 'Select your vote — host will lock the answer'}
              </span>
            </div>
          )}

          {!isHost && result && (
             <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
                <span style={{ fontFamily: "'Nunito'", fontWeight: 800, fontSize: '0.78rem', color: '#555', letterSpacing: 1 }}>
                  Waiting for host to continue (or <span style={{ color: '#4A9EFF' }}>{revealTimeLeft}s</span> auto-skip)...
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
    </div>
  );
}
