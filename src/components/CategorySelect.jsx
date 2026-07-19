import { useState } from 'react';

const CATEGORIES = [
  { id: 'Video Games',        emoji: '🎮', label: 'Video Games',       desc: '20 questions about gaming', count: 20 },
  { id: 'YouTube & Creators', emoji: '📺', label: 'YouTube & Creators', desc: '20 questions about YouTube', count: 20 },
  { id: 'Movies',             emoji: '🎬', label: 'Movies',             desc: '20 questions about cinema', count: 20 },
  { id: 'Top Web Series',     emoji: '📱', label: 'Top Web Series',     desc: '20 questions about shows',  count: 20 },
  { id: 'Anime & Manga',      emoji: '🏮', label: 'Anime & Manga',      desc: '20 questions about anime',  count: 20 },
  { id: 'Tech & Internet Culture', emoji: '💻', label: 'Tech & Internet', desc: '20 questions about tech',  count: 20 },
  { id: 'General Knowledge',  emoji: '🧠', label: 'General Knowledge',  desc: '20 questions about trivia', count: 20 },
];

export default function CategorySelect({ isHost, onSelect }) {
  const [hovered, setHovered] = useState(null);

  return (
    <div style={{
      height: '100vh',
      background: '#0d0d0d',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h1 className="display-font" style={{ fontSize: 'clamp(1.8rem, 5vw, 2.8rem)', color: '#fff', marginBottom: '0.5rem' }}>
          CHOOSE A CATEGORY
        </h1>
        <p style={{ color: '#555', fontWeight: 800, fontSize: '0.85rem', letterSpacing: 2 }}>
          {isHost
            ? 'YOU ARE THE HOST — pick a category to start'
            : 'WAITING FOR HOST TO CHOOSE...'}
        </p>
      </div>

      {/* Category grid — Auto-responsive */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1rem',
        maxWidth: 800,
        width: '100%',
      }}>
        {CATEGORIES.map((cat) => {
          const isHov = hovered === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => isHost && onSelect(cat.id)}
              onMouseEnter={() => isHost && setHovered(cat.id)}
              onMouseLeave={() => setHovered(null)}
              disabled={!isHost}
              style={{
                background: isHov ? '#1f1f1f' : '#161616',
                border: isHov ? '2px solid #4A9EFF' : '2px solid #2a2a2a',
                borderRadius: 12,
                padding: '2rem 1.5rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: 10,
                cursor: isHost ? 'pointer' : 'not-allowed',
                opacity: isHost ? 1 : 0.5,
                transition: 'border-color 0.15s, background 0.15s',
                textAlign: 'left',
                animation: 'slideUp 0.3s ease-out both',
              }}
            >
              <span style={{ fontSize: '2.5rem', lineHeight: 1 }}>{cat.emoji}</span>
              <div>
                <div className="display-font" style={{ fontSize: '1rem', color: '#fff', marginBottom: 4 }}>
                  {cat.label}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#555', fontWeight: 800, fontFamily: "'Nunito'" }}>
                  {cat.desc}
                </div>
              </div>
              <div style={{
                background: '#0d0d0d',
                border: '1px solid #2a2a2a',
                borderRadius: 4,
                padding: '2px 10px',
                fontSize: '0.7rem',
                color: '#444',
                fontWeight: 900,
                letterSpacing: 1,
              }}>
                {cat.count} questions
              </div>
            </button>
          );
        })}
      </div>

      {/* Spectator hint */}
      {!isHost && (
        <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#4A9EFF', animation: 'pulseHard 1.5s infinite' }}/>
          <span style={{ color: '#444', fontWeight: 800, fontSize: '0.8rem', letterSpacing: 1 }}>
            The host is choosing a category...
          </span>
        </div>
      )}
    </div>
  );
}
