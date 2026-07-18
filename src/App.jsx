import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import './App.css';
import { LandingView, JoinSetupView, HostSetupView, LobbyView, AnimatedCursor } from './components/UI';
import CategorySelect from './components/CategorySelect';
import QuizGame from './components/QuizGame';
import GameOver from './components/GameOver';

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

  /* ── Socket setup ─────────────────────── */
  useEffect(() => {
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

    s.on('game_started', () => {
      setView('quiz');
    });

    s.on('game_over', (data) => {
      setGameOverData(data); setView('game_over');
    });

    s.on('back_to_lobby', () => {
      setGameOverData(null); setView('lobby');
    });

    s.on('host_changed', ({ newHostId }) => {
      if (newHostId === socketRef.current?.id) setIsHost(true);
    });

    return () => { try { s.disconnect(); } catch (e) {} };
  }, []);

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
    if (view === 'quiz')            return <QuizGame socket={socket} roomCode={roomCode} isHost={isHost} players={activePlayers} myId={myId}/>;
    if (view === 'game_over')       return <GameOver data={gameOverData} isHost={isHost} players={activePlayers} onPlayAgain={handlePlayAgain}/>;
    return null;
  };

  return (
    <>
      <AnimatedCursor/>
      {renderView()}
    </>
  );
}

export default App;
