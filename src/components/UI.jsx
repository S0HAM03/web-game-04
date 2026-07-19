import { useState, useEffect } from 'react';
import { Gamepad2, Users, ArrowLeft, ChevronRight, Play, Dices, Zap, Target, Trophy, Globe, ChevronDown, Clock, Cpu, Shield, Star } from 'lucide-react';

/* ═══════════════════════════════════════════
   PALETTE — used by other components
═══════════════════════════════════════════ */
export const PALETTE = [
  { bg: "#4A9EFF", text: "#000000" },
  { bg: "#FF6B6B", text: "#ffffff" },
  { bg: "#51CF66", text: "#000000" },
  { bg: "#FFD43B", text: "#000000" },
  { bg: "#CC5DE8", text: "#ffffff" },
  { bg: "#FF922B", text: "#ffffff" },
  { bg: "#20C997", text: "#000000" },
  { bg: "#F783AC", text: "#000000" },
];

export const MAX_SLOTS = 8;

/* ═══════════════════════════════════════════
   AI NAME GENERATOR
═══════════════════════════════════════════ */
const ADJECTIVES = ["Toxic", "Chaotic", "Based", "Epic", "Savage", "Ghost", "Neon", "Cyber", "Mega", "Sneaky", "Salty", "Sweaty", "Cursed"];
const NOUNS = ["Goblin", "Ninja", "Wizard", "Panda", "Slime", "Glitch", "Cyborg", "Viper", "Potato", "Gremlin", "Phantom", "Demon"];

export const generateAIName = () => {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  return `${adj} ${noun}`;
};

/* ═══════════════════════════════════════════
   ANIMATED CURSOR (Hive Mind style, kept)
═══════════════════════════════════════════ */
export function AnimatedCursor() {
  const [pos, setPos] = useState({
    x: typeof window !== 'undefined' ? window.innerWidth / 2 : -100,
    y: typeof window !== 'undefined' ? window.innerHeight / 2 : -100
  });
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    const move = (e) => {
      if (e.touches && e.touches.length > 0) {
        setPos({ x: e.touches[0].clientX, y: e.touches[0].clientY });
      } else if (e.clientX !== undefined) {
        setPos({ x: e.clientX, y: e.clientY });
      }
    };
    const down = () => setClicked(true);
    const up = () => setClicked(false);
    window.addEventListener('mousemove', move);
    window.addEventListener('touchmove', move);
    window.addEventListener('mousedown', down);
    window.addEventListener('mouseup', up);
    window.addEventListener('touchstart', down);
    window.addEventListener('touchend', up);
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('touchmove', move);
      window.removeEventListener('mousedown', down);
      window.removeEventListener('mouseup', up);
      window.removeEventListener('touchstart', down);
      window.removeEventListener('touchend', up);
    };
  }, []);

  return (
    <div style={{
      position: 'fixed', left: 0, top: 0,
      transform: `translate(${pos.x}px, ${pos.y}px)`,
      pointerEvents: 'none', zIndex: 99999,
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{
        transform: `rotate(${clicked ? -15 : 0}deg) scale(${clicked ? 0.8 : 1})`,
        transition: 'transform 0.1s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
      }}>
        <svg width="24" height="24" viewBox="0 0 24 24" style={{ filter: 'drop-shadow(2px 2px 0px rgba(0,0,0,0.8))' }}>
          <path d="M4 2 L4 22 L10 16 L15 22 L18 19 L13 13 L20 13 Z" fill="#ffffff" stroke="#000000" strokeWidth="2" strokeLinejoin="round"/>
        </svg>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   CHUNKY BUTTON — same shape, dark bg
═══════════════════════════════════════════ */
export function ChunkyButton({ children, color = "#4A9EFF", onClick, disabled = false, style = {} }) {
  const [active, setActive] = useState(false);
  const isDark = color.startsWith('#1') || color === '#222' || color === '#333';
  return (
    <button
      onClick={onClick} disabled={disabled}
      onMouseDown={() => !disabled && setActive(true)}
      onMouseUp={() => !disabled && setActive(false)}
      onMouseLeave={() => setActive(false)}
      style={{
        background: disabled ? "#222" : color,
        border: "3px solid #fff", borderRadius: "10px",
        padding: "1rem 1.5rem", fontSize: "1rem", fontWeight: "900", fontFamily: "'Nunito', sans-serif",
        textTransform: "uppercase", letterSpacing: "2px",
        color: disabled ? "#555" : (isDark ? "#fff" : "#000"),
        cursor: disabled ? "not-allowed" : "pointer",
        boxShadow: active || disabled ? "0px 0px 0px #fff" : "4px 4px 0px #fff",
        transform: active || disabled ? "translate(4px, 4px)" : "translate(0, 0)",
        transition: "transform 0.05s linear, box-shadow 0.05s linear",
        display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
        ...style
      }}
    >
      {children}
    </button>
  );
}

/* ═══════════════════════════════════════════
   CHUNKY INPUT — dark style
═══════════════════════════════════════════ */
export function ChunkyInput({ value, onChange, placeholder, maxLength, onKeyDown }) {
  return (
    <input
      value={value} onChange={onChange} onKeyDown={onKeyDown}
      maxLength={maxLength} placeholder={placeholder}
      className="display-font"
      style={{
        width: "100%", textAlign: "center", fontSize: "1.8rem",
        background: "#111", border: "3px solid #fff", borderRadius: "12px",
        padding: "1rem", color: "#fff", outline: "none",
        boxShadow: "4px 4px 0px #fff",
      }}
    />
  );
}

/* ═══════════════════════════════════════════
   LANDING VIEW — dark theme
═══════════════════════════════════════════ */
export function LandingView({ onHost, onJoin }) {
  const sectionStyle = { width: '100%', maxWidth: 900, margin: '0 auto', padding: '0 2rem' };

  const HOW_STEPS = [
    { icon: <Gamepad2 size={28}/>, title: 'Create or Join', desc: 'Host a room or enter a 4-letter code to join your team.', color: '#4A9EFF' },
    { icon: <Users size={28}/>, title: 'Pick a Category', desc: 'Host chooses from 8 categories: Games, Anime, Tech, Internet, GK, and more.', color: '#51CF66' },
    { icon: <Target size={28}/>, title: 'Host Answers', desc: 'Discuss together, but only the host locks in the final answer.', color: '#FFD43B' },
    { icon: <Trophy size={28}/>, title: 'Score Together', desc: 'One shared team score. Win or lose as a crew.', color: '#FF6B6B' },
  ];

  const FEATURES = [
    { icon: <Clock size={22}/>, title: 'Stopwatch Gameplay', desc: 'Unlimited time to answer. Your final score is ranked by total time taken.', color: '#4A9EFF' },
    { icon: <Shield size={22}/>, title: 'Team Play', desc: 'One score for everyone. Spectators can vote to guide the host.', color: '#FF6B6B' },
    { icon: <Cpu size={22}/>, title: '350+ Questions', desc: '8 categories — 50 questions each. Shuffled randomly per game.', color: '#CC5DE8' },
    { icon: <Zap size={22}/>, title: 'Clean Border Reveals', desc: 'Correct/wrong status marked instantly via beautiful border colors.', color: '#FFD43B' },
    { icon: <Users size={22}/>, title: 'Sound Effects (SFX)', desc: 'Satisfying, procedurally synthesized UI audio feedback.', color: '#51CF66' },
    { icon: <Globe size={22}/>, title: 'No Download', desc: 'Browser-only. Share the link and play.', color: '#FF922B' },
  ];

  const STATS = [
    { value: '8', label: 'MAX PLAYERS' },
    { value: '350+', label: 'QUESTIONS' },
    { value: '8', label: 'CATEGORIES' },
    { value: 'Stopwatch', label: 'GAME TIMER' },
  ];

  const CATEGORIES = [
    { emoji: '🎮', label: 'Video Games' },
    { emoji: '📺', label: 'YouTube' },
    { emoji: '🎬', label: 'Movies' },
    { emoji: '📱', label: 'Web Series' },
    { emoji: '🏮', label: 'Anime & Manga' },
    { emoji: '💻', label: 'Tech & Programming' },
    { emoji: '🌐', label: 'Internet Culture' },
    { emoji: '🧠', label: 'General Knowledge' },
  ];

  return (
    <div className="game-bg" style={{ height: '100vh', overflowY: 'auto', overflowX: 'hidden' }}>

      {/* ══ HERO ══ */}
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', position: 'relative' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem', animation: 'floaty 4s ease-in-out infinite' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
            <Trophy size={56} color="#fff" strokeWidth={1.5}/>
          </div>
          <h1 className="display-font" style={{ fontSize: 'clamp(3rem, 9vw, 5.5rem)', color: '#fff', letterSpacing: 4, lineHeight: 1 }}>
            QUIZ<span style={{ color: '#4A9EFF' }}>MANIA</span>
          </h1>
          <div style={{ marginTop: '1rem', color: '#555', fontWeight: 900, textTransform: 'uppercase', letterSpacing: 4, fontSize: '0.85rem' }}>
            Team-Based Multiplayer Quiz
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: '1.5rem', flexWrap: 'wrap' }}>
            {CATEGORIES.map((cat, i) => (
              <span key={i} style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 6, padding: '4px 12px', fontSize: '0.8rem', fontWeight: 800, color: '#888', animation: `slideUp 0.4s ${0.1 * i}s both` }}>
                {cat.emoji} {cat.label}
              </span>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center', width: '100%', maxWidth: 700 }}>
          <div style={{ flex: '1 1 260px' }}>
            <ChunkyButton color="#4A9EFF" onClick={onHost} style={{ flexDirection: 'column', padding: '2.5rem 1.5rem', gap: 14, width: '100%' }}>
              <Gamepad2 size={36} color="#000"/>
              <span className="display-font" style={{ fontSize: '1.5rem' }}>Host Game</span>
            </ChunkyButton>
          </div>
          <div style={{ flex: '1 1 260px' }}>
            <ChunkyButton color="#51CF66" onClick={onJoin} style={{ flexDirection: 'column', padding: '2.5rem 1.5rem', gap: 14, width: '100%' }}>
              <Users size={36} color="#000"/>
              <span className="display-font" style={{ fontSize: '1.5rem' }}>Join Game</span>
            </ChunkyButton>
          </div>
        </div>

        <div style={{ position: 'absolute', bottom: 30, animation: 'bounceDown 2s ease-in-out infinite', opacity: 0.4 }}>
          <ChevronDown size={32} color="#fff" strokeWidth={2}/>
        </div>
      </div>

      {/* ══ HOW TO PLAY ══ */}
      <div style={{ background: '#111', padding: '5rem 2rem', borderTop: '1px solid #1f1f1f' }}>
        <div style={sectionStyle}>
          <h2 className="display-font" style={{ fontSize: '2rem', color: '#fff', marginBottom: '2.5rem', textAlign: 'center' }}>HOW TO PLAY</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
            {HOW_STEPS.map((s, i) => (
              <div key={i} style={{ background: '#161616', border: '1px solid #222', borderRadius: 12, padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: 10, animation: `slideUp 0.4s ${0.1 * i}s both` }}>
                <div style={{ color: s.color }}>{s.icon}</div>
                <div style={{ fontSize: '0.65rem', color: '#444', fontWeight: 900, letterSpacing: 2 }}>STEP {i + 1}</div>
                <h3 className="display-font" style={{ fontSize: '1rem', color: '#fff', margin: 0 }}>{s.title}</h3>
                <p style={{ fontWeight: 800, fontSize: '0.85rem', color: '#666', lineHeight: 1.5, margin: 0 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══ FEATURES ══ */}
      <div style={{ background: '#0d0d0d', padding: '5rem 2rem', borderTop: '1px solid #1a1a1a' }}>
        <div style={sectionStyle}>
          <h2 className="display-font" style={{ fontSize: '2rem', color: '#fff', marginBottom: '2.5rem', textAlign: 'center' }}>FEATURES</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            {FEATURES.map((f, i) => (
              <div key={i} style={{ background: '#161616', border: '1px solid #222', borderRadius: 10, padding: '1.25rem', display: 'flex', gap: 12, alignItems: 'flex-start', animation: `slideUp 0.4s ${0.06 * i}s both` }}>
                <div style={{ color: f.color, flexShrink: 0, marginTop: 2 }}>{f.icon}</div>
                <div>
                  <div className="display-font" style={{ fontSize: '0.9rem', color: '#ccc', marginBottom: 4 }}>{f.title}</div>
                  <p style={{ fontSize: '0.82rem', color: '#555', fontWeight: 700, lineHeight: 1.5, margin: 0 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══ STATS ══ */}
      <div style={{ background: '#111', padding: '3rem 2rem', borderTop: '1px solid #1f1f1f', borderBottom: '1px solid #1f1f1f' }}>
        <div style={{ ...sectionStyle, display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '2rem' }}>
          {STATS.map((s, i) => (
            <div key={i} style={{ textAlign: 'center', animation: `countUp 0.4s ${0.1 * i}s both` }}>
              <div className="display-font" style={{ fontSize: 'clamp(2.5rem, 6vw, 3.5rem)', color: '#fff', lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: '0.7rem', color: '#555', fontWeight: 900, letterSpacing: 2, marginTop: 6 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ══ CTA ══ */}
      <div style={{ background: '#0d0d0d', padding: '5rem 2rem', textAlign: 'center' }}>
        <h2 className="display-font" style={{ fontSize: '2rem', color: '#fff', marginBottom: '2rem' }}>READY TO PLAY?</h2>
        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <ChunkyButton color="#4A9EFF" onClick={onHost} style={{ padding: '1.25rem 2.5rem' }}>
            <Gamepad2 size={20} color="#000"/> Host Game
          </ChunkyButton>
          <ChunkyButton color="#51CF66" onClick={onJoin} style={{ padding: '1.25rem 2.5rem' }}>
            <Users size={20} color="#000"/> Join Game
          </ChunkyButton>
        </div>
      </div>

      {/* ══ FOOTER ══ */}
      <div style={{ background: '#080808', padding: '2rem 1.5rem', textAlign: 'center', borderTop: '1px solid #1a1a1a', fontFamily: "'Nunito', sans-serif" }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          {[
            { label: "About", url: "#/about" },
            { label: "Contact Us", url: "#/contact-us" },
            { label: "Privacy Policy", url: "#/privacy-policy" },
            { label: "Cookie Declaration", url: "#/cookie-declaration" },
            { label: "Legal", url: "#/legal" }
          ].map(l => (
            <a key={l.label} href={l.url} style={{ color: '#555', textDecoration: 'none', fontSize: '0.8rem', fontWeight: 800, transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = '#ccc'}
              onMouseLeave={e => e.currentTarget.style.color = '#555'}>
              {l.label}
            </a>
          ))}
        </div>
        <p style={{ color: '#333', fontWeight: 800, fontSize: '0.75rem', margin: 0 }}>
          © 2026 QuizMania. All rights reserved. Play responsively.
        </p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   HOST SETUP VIEW — dark
═══════════════════════════════════════════ */
export function HostSetupView({ onBack, onEnter }) {
  const [name, setName] = useState("");

  return (
    <div className="game-bg" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", padding: "2rem" }}>
      <div><ChunkyButton color="#1a1a1a" onClick={onBack} style={{ display: "inline-flex", padding: "0.5rem 1rem" }}><ArrowLeft size={18}/> Back</ChunkyButton></div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", marginTop: "-4rem" }}>
        <h2 className="display-font" style={{ fontSize: "2.5rem", marginBottom: "2rem", color: "#fff" }}>HOST A ROOM</h2>

        <div style={{ width: "320px", display: "flex", flexDirection: "column", gap: "1.5rem", marginBottom: "2rem" }}>
          <div style={{ position: "relative" }}>
            <ChunkyInput value={name} onChange={(e) => setName(e.target.value.toUpperCase().slice(0, 12))} placeholder="YOUR NAME" maxLength={12}/>
            <button onClick={() => setName(generateAIName().toUpperCase())} style={{ position: "absolute", right: -18, top: -18, background: "#FF922B", border: "3px solid #fff", borderRadius: "50%", width: 42, height: 42, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#000", boxShadow: "2px 2px 0px #fff" }} title="Auto Generate">
              <Dices size={20}/>
            </button>
          </div>
        </div>

        <ChunkyButton color="#FFD43B" onClick={() => onEnter('Squad', name)} disabled={name.trim().length === 0} style={{ width: "320px", padding: "1.25rem" }}>
          Create Lobby <ChevronRight size={20}/>
        </ChunkyButton>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   JOIN SETUP VIEW — dark
═══════════════════════════════════════════ */
export function JoinSetupView({ onBack, onEnter }) {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");

  return (
    <div className="game-bg" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", padding: "2rem" }}>
      <div><ChunkyButton color="#1a1a1a" onClick={onBack} style={{ display: "inline-flex", padding: "0.5rem 1rem" }}><ArrowLeft size={18}/> Back</ChunkyButton></div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", marginTop: "-4rem" }}>
        <h2 className="display-font" style={{ fontSize: "2.5rem", marginBottom: "2rem", color: "#fff" }}>JOIN A ROOM</h2>

        <div style={{ width: "320px", display: "flex", flexDirection: "column", gap: "1.5rem", marginBottom: "2rem" }}>
          <ChunkyInput value={code} onChange={(e) => setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 4))} placeholder="ROOM CODE" maxLength={4}/>

          <div style={{ position: "relative" }}>
            <ChunkyInput value={name} onChange={(e) => setName(e.target.value.toUpperCase().slice(0, 12))} placeholder="YOUR NAME" maxLength={12}/>
            <button onClick={() => setName(generateAIName().toUpperCase())} style={{ position: "absolute", right: -18, top: -18, background: "#FF922B", border: "3px solid #fff", borderRadius: "50%", width: 42, height: 42, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#000", boxShadow: "2px 2px 0px #fff" }} title="Auto Generate">
              <Dices size={20}/>
            </button>
          </div>
        </div>

        <ChunkyButton color="#FFD43B" onClick={() => onEnter(code, name)} disabled={code.length !== 4 || name.trim().length === 0} style={{ width: "320px", padding: "1.25rem" }}>
          Enter Lobby <ChevronRight size={20}/>
        </ChunkyButton>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   LOBBY VIEW — dark
═══════════════════════════════════════════ */
export function LobbyView({ roomCode, players, onBack, onStart }) {
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard?.writeText(roomCode).catch(() => {});
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="game-bg" style={{ height: "100vh", overflowY: "auto", display: "flex", flexDirection: "column", padding: "2rem", paddingBottom: "6rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
        <ChunkyButton color="#1a1a1a" onClick={onBack} style={{ padding: "0.5rem 1rem" }}><ArrowLeft size={18}/> Leave</ChunkyButton>
        <div style={{ background: "#1a1a1a", border: '3px solid #333', color: "#888", padding: "8px 16px", borderRadius: "10px", fontWeight: 900, fontSize: '0.75rem', letterSpacing: 2 }}>
          WAITING FOR PLAYERS...
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "3rem", marginTop: "2rem" }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ fontWeight: 900, fontSize: "0.75rem", marginBottom: "0.75rem", color: '#888', letterSpacing: 3 }}>ROOM CODE</p>
          <div
            className="display-font"
            onClick={copyCode}
            style={{ fontSize: "clamp(4rem, 15vw, 7rem)", background: "#CC5DE8", color: "#000", padding: "0.25rem 2.5rem", border: "3px solid #fff", borderRadius: "16px", display: "inline-block", cursor: "pointer", boxShadow: "6px 6px 0px #fff" }}
          >
            {roomCode}
          </div>
          <p style={{ marginTop: "1.25rem", fontWeight: 800, fontSize: '0.9rem', color: copied ? "#51CF66" : "#aaa", letterSpacing: 2 }}>
            {copied ? "COPIED!" : "CLICK TO COPY"}
          </p>
        </div>

        <div style={{ width: "100%", maxWidth: "700px" }}>
          <p style={{ fontWeight: 900, fontSize: '0.7rem', letterSpacing: 2, color: "#444", marginBottom: "1.25rem", textAlign: 'center' }}>
            {players.length} OF {MAX_SLOTS} PLAYERS
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "1.25rem" }}>
            {players.map((p, index) => {
              const c = PALETTE[(p.color !== undefined ? p.color : index) % PALETTE.length] || PALETTE[0];
              return (
                <div key={p.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                  <div style={{ width: 72, height: 72, background: c.bg, border: `3px solid #fff`, borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: '3px 3px 0px #fff' }}>
                    <span className="display-font" style={{ fontSize: "2.2rem", color: "#000" }}>
                      {(p.name || 'P').charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span style={{ fontWeight: 900, fontSize: "0.8rem", color: "#fff", padding: "3px 10px", background: '#222', border: '2px solid #444', borderRadius: "6px", maxWidth: "90px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {p.name}
                  </span>
                  {p.isHost && (
                    <span style={{ fontSize: '0.65rem', color: '#4A9EFF', fontWeight: 900, letterSpacing: 2 }}>HOST</span>
                  )}
                </div>
              );
            })}

            {Array.from({ length: Math.max(0, MAX_SLOTS - players.length) }).map((_, i) => (
              <div key={`empty-${i}`} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                <div style={{ width: 72, height: 72, background: "transparent", border: "3px dashed #333", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ width: 14, height: 14, background: "#222", borderRadius: "50%" }}/>
                </div>
                <span style={{ fontWeight: 800, fontSize: "0.8rem", color: "#444", padding: "3px 10px" }}>Open</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {players.length >= 1 && onStart && (
        <div style={{ position: "fixed", bottom: "2rem", left: "50%", transform: "translateX(-50%)", zIndex: 100 }}>
          <ChunkyButton color="#51CF66" onClick={onStart} style={{ padding: "1.25rem 4rem", fontSize: "1.2rem" }}>
            <Play size={22} color="#000"/> START GAME
          </ChunkyButton>
        </div>
      )}
    </div>
  );
}
