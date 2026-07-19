import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import './App.css';
import { LandingView, JoinSetupView, HostSetupView, LobbyView, AnimatedCursor } from './components/UI';
import CategorySelect from './components/CategorySelect';
import QuizGame from './components/QuizGame';
import GameOver from './components/GameOver';
import Subpages from './components/Subpages';
import { playGameOver } from './utils/sfx';

const SERVER_URL = import.meta.env.VITE_SERVER_URL || '';

function App() {
  // views: landing | host_setup | join_setup | lobby | category_select | quiz | game_over
  const [view, setView] = useState('landing');

  const [socket, setSocket]           = useState(null);
  const socketRef                     = useRef(null);
  const [roomCode, setRoomCode]       = useState(null);
  const [lobbyError, setLobbyError]   = useState('');
  const [activePlayers, setActivePlayers] = useState([]);
  const [isHost, setIsHost]           = useState(false);
  const [myId, setMyId]               = useState(null);
  const [gameOverData, setGameOverData] = useState(null);
  const [gameStartTime, setGameStartTime] = useState(null);
  
  // Compliance routing state
  const [hash, setHash] = useState(window.location.hash);
  const [cookieAccepted, setCookieAccepted] = useState(() => localStorage.getItem('cookie_accepted') === 'true');

  /* ── Socket setup & Routing ──────────────── */
  useEffect(() => {
    const handleHashChange = () => setHash(window.location.hash);
    window.addEventListener('hashchange', handleHashChange);

    const s = io(SERVER_URL, { transports: ['websocket', 'polling'] });
    socketRef.current = s;
    setSocket(s);

    s.on('connect', () => setMyId(s.id));

    s.on('room_created', ({ roomCode: code }) => {
      setRoomCode(code); setIsHost(true); setView('lobby'); setLobbyError('');
    });

    s.on('room_joined', ({ roomCode: code }) => {
      setRoomCode(code); setIsHost(false); setView('lobby'); setLobbyError('');
    });

    s.on('room_error', ({ message }) => setLobbyError(message));

    s.on('player_list', (players) => {
      setActivePlayers(players);
      const me = players.find(p => p.id === socketRef.current?.id);
      if (me) setIsHost(me.isHost);
    });

    // Server tells everyone to go to category select
    s.on('choose_category', () => {
      setView('category_select');
    });

    s.on('game_started', ({ gameStartTime }) => {
      setGameStartTime(gameStartTime);
      setView('quiz');
    });

    s.on('game_over', (data) => {
      setGameOverData(data); setView('game_over');
      playGameOver();
    });

    s.on('back_to_lobby', () => {
      setView('lobby');
    });

    s.on('host_changed', ({ newHostId }) => {
      if (newHostId === socketRef.current?.id) setIsHost(true);
    });

    return () => {
      s.disconnect();
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const handleAcceptCookie = () => {
    localStorage.setItem('cookie_accepted', 'true');
    setCookieAccepted(true);
  };

  const isHome = !hash || hash === '#/' || hash === '#';

  /* ── Handlers ─────────────────────────── */
  const handleHost = (_, playerName) => {
    socket?.emit('create_room', { playerName });
  };

  const handleJoin = (code, playerName) => {
    socket?.emit('join_room', { roomCode: code, playerName });
  };

  // Lobby START → ask server to move room to category_select
  const handleRequestCategory = () => {
    socket?.emit('request_category', { roomCode });
  };

  // Host picks a category → start game
  const handleCategorySelect = (category) => {
    socket?.emit('start_game', { roomCode, category });
  };

  const handlePlayAgain = () => {
    socket?.emit('play_again', { roomCode });
  };

  const handleLeave = () => {
    try { socket?.disconnect(); } catch (e) {}
    window.location.reload();
  };

  /* ── Render ───────────────────────────── */
  const renderView = () => {
    if (view === 'landing')         return <LandingView onHost={() => setView('host_setup')} onJoin={() => setView('join_setup')}/>;
    if (view === 'host_setup')      return <HostSetupView onBack={() => setView('landing')} onEnter={handleHost} error={lobbyError}/>;
    if (view === 'join_setup')      return <JoinSetupView onBack={() => setView('landing')} onEnter={handleJoin} error={lobbyError}/>;
    if (view === 'lobby')           return <LobbyView roomCode={roomCode} players={activePlayers} onBack={handleLeave} onStart={isHost ? handleRequestCategory : undefined}/>;
    if (view === 'category_select') return <CategorySelect isHost={isHost} onSelect={handleCategorySelect}/>;
    if (view === 'quiz')            return <QuizGame socket={socket} roomCode={roomCode} isHost={isHost} players={activePlayers} myId={myId} gameStartTime={gameStartTime}/>;
    if (view === 'game_over')       return <GameOver data={gameOverData} isHost={isHost} players={activePlayers} onPlayAgain={handlePlayAgain}/>;
    return null;
  };

  return (
    <>
      <AnimatedCursor/>
      {isHome ? renderView() : <Subpages pageId={hash.replace('#/', '')} onBack={() => window.location.hash = ''} />}

      {!cookieAccepted && (
        <div style={{
          position: 'fixed', bottom: 0, left: 0, right: 0,
          background: 'rgba(22, 22, 22, 0.98)', borderTop: '3px solid #333',
          padding: '1.25rem 2rem', display: 'flex', justifyContent: 'center',
          alignItems: 'center', gap: '2rem', zIndex: 9999,
          boxShadow: '0 -4px 20px rgba(0,0,0,0.7)', flexWrap: 'wrap',
          fontFamily: "'Nunito', sans-serif"
        }}>
          <p style={{ color: '#ccc', fontSize: '0.82rem', margin: 0, maxWidth: '800px', lineHeight: 1.5, fontWeight: 800 }}>
            We use cookies (including third-party cookies from Google AdSense) to serve personalized ads, analyze traffic, and improve your trivia experience. By playing, you agree to our use of cookies as described in our <a href="#/privacy-policy" style={{ color: '#4A9EFF', textDecoration: 'none', fontWeight: 900 }}>Privacy Policy</a>.
          </p>
          <button onClick={handleAcceptCookie} style={{
            background: '#51CF66', border: '3px solid #fff', borderRadius: '8px',
            padding: '8px 20px', color: '#000', fontWeight: 900,
            cursor: 'pointer', fontFamily: "'Bungee', sans-serif", fontSize: '0.85rem',
            boxShadow: '3px 3px 0px #fff', transform: 'translateY(-1px)',
            transition: 'transform 0.1s, box-shadow 0.1s'
          }}>
            Got it!
          </button>
        </div>
      )}
    </>
  );
}

export default App;
