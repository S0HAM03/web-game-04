require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');
const { QUESTIONS } = require('./questions');

const app = express();
app.use(cors());

// Serve static frontend files in production
app.use(express.static(path.join(__dirname, '../dist')));

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});

// ══════════════════════════════════════
//  Room State
// ══════════════════════════════════════
// rooms[roomCode] = {
//   players: [{ id, name, isHost, socketId }],
//   state: 'lobby' | 'playing' | 'reveal' | 'game_over',
//   questions: [],           // selected & shuffled questions for this game
//   currentQuestionIndex: 0,
//   teamScore: 0,
//   totalPossible: 0,
//   answers: [],             // { questionIndex, answerIndex, correct, pointsEarned }
//   timer: null              // server-side countdown timeout
// }
const rooms = {};

const QUESTIONS_PER_GAME = 20;
const REVEAL_DURATION = 15000; // ms to show result before auto-next

// ── Helpers ────────────────────────────────────────
function generateRoomCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let code = '';
  for (let i = 0; i < 4; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getPlayerList(roomCode) {
  const room = rooms[roomCode];
  if (!room) return [];
  return room.players.map((p, idx) => ({ id: p.id, name: p.name, isHost: p.isHost, color: idx }));
}

function broadcastPlayerList(roomCode) {
  io.to(roomCode).emit('player_list', getPlayerList(roomCode));
}

function getPublicQuestion(q, index, total, gameStartTime) {
  return {
    index,
    total,
    question: q.question,
    options: q.options,
    category: q.category,
    categoryColor: q.categoryColor,
    points: q.points,
    gameStartTime
  };
}

// ── Game Flow ──────────────────────────────────────
function startQuestion(roomCode) {
  const room = rooms[roomCode];
  if (!room || room.state === 'game_over') return;

  const qi = room.currentQuestionIndex;
  if (qi >= room.questions.length) {
    return endGame(roomCode);
  }

  room.state = 'playing';
  const q = room.questions[qi];

  // Emit question to all players
  io.to(roomCode).emit('question', getPublicQuestion(q, qi + 1, room.questions.length, room.gameStartTime));
}

function handleAnswer(roomCode, answerIndex) {
  const room = rooms[roomCode];
  if (!room || room.state !== 'playing') return;

  room.state = 'reveal';

  const qi = room.currentQuestionIndex;
  const q = room.questions[qi];
  const correct = answerIndex === q.correctIndex;
  const pointsEarned = correct ? q.points : 0;

  room.teamScore += pointsEarned;
  room.answers.push({ questionIndex: qi, answerIndex, correct, pointsEarned });

  // Emit result to everyone
  io.to(roomCode).emit('answer_result', {
    correct,
    correctIndex: q.correctIndex,
    chosenIndex: answerIndex,
    explanation: q.explanation,
    pointsEarned,
    teamScore: room.teamScore
  });

  // Auto-advance after 15 seconds
  room.timer = setTimeout(() => {
    room.timer = null;
    advanceToNextQuestion(roomCode);
  }, REVEAL_DURATION);
}

function advanceToNextQuestion(roomCode) {
  const room = rooms[roomCode];
  if (!room || room.state !== 'reveal') return;

  if (room.timer) { clearTimeout(room.timer); room.timer = null; }

  room.currentQuestionIndex++;
  if (room.currentQuestionIndex >= room.questions.length) {
    endGame(roomCode);
  } else {
    startQuestion(roomCode);
  }
}

function endGame(roomCode) {
  const room = rooms[roomCode];
  if (!room) return;
  room.state = 'game_over';
  if (room.timer) { clearTimeout(room.timer); room.timer = null; }

  const totalTimeTaken = room.gameStartTime ? Math.floor((Date.now() - room.gameStartTime) / 1000) : 0;

  io.to(roomCode).emit('game_over', {
    teamScore: room.teamScore,
    totalPossible: room.totalPossible,
    totalTimeTaken,
    answers: room.answers,
    questions: room.questions.map(q => ({
      question: q.question,
      options: q.options,
      correctIndex: q.correctIndex,
      category: q.category,
      categoryColor: q.categoryColor,
      explanation: q.explanation
    }))
  });
}

// ── Socket Connections ─────────────────────────────
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // — Create Room —
  socket.on('create_room', ({ playerName }) => {
    let roomCode;
    do { roomCode = generateRoomCode(); } while (rooms[roomCode]);

    rooms[roomCode] = {
      players: [{ id: socket.id, name: playerName || 'HOST', isHost: true }],
      state: 'lobby',
      questions: [],
      currentQuestionIndex: 0,
      teamScore: 0,
      totalPossible: 0,
      answers: [],
      timer: null
    };
    socket.join(roomCode);
    socket.emit('room_created', { roomCode });
    broadcastPlayerList(roomCode);
  });

  // — Join Room —
  socket.on('join_room', ({ roomCode, playerName }) => {
    const code = (roomCode || '').toUpperCase();
    const room = rooms[code];

    if (!room) return socket.emit('room_error', { message: 'Invalid room code' });
    if (room.state !== 'lobby') return socket.emit('room_error', { message: 'Game already in progress' });
    if (room.players.length >= 8) return socket.emit('room_error', { message: 'Room is full (max 8)' });

    room.players.push({ id: socket.id, name: playerName || 'PLAYER', isHost: false });
    socket.join(code);
    socket.emit('room_joined', { roomCode: code });
    broadcastPlayerList(code);
  });

  // — Request Category Select (host only) —
  socket.on('request_category', ({ roomCode }) => {
    const room = rooms[roomCode];
    if (!room || room.state !== 'lobby') return;
    if (!room.players.find(p => p.id === socket.id)?.isHost) return;
    room.state = 'category_select';
    io.to(roomCode).emit('choose_category');
  });

  // — Start Game with Category (host only) —
  socket.on('start_game', ({ roomCode, category }) => {
    const room = rooms[roomCode];
    if (!room) return;
    if (!room.players.find(p => p.id === socket.id)?.isHost) return;
    if (room.state !== 'category_select') return;

    // Filter questions by chosen category
    let pool = QUESTIONS;
    if (category && category !== 'all') {
      pool = QUESTIONS.filter(q => q.category === category);
    }

    // Pick & shuffle questions (up to QUESTIONS_PER_GAME)
    const selected = shuffle(pool).slice(0, Math.min(QUESTIONS_PER_GAME, pool.length));
    room.questions = selected;
    room.totalPossible = selected.reduce((sum, q) => sum + q.points, 0);
    room.currentQuestionIndex = 0;
    room.teamScore = 0;
    room.answers = [];
    room.selectedCategory = category;
    room.gameStartTime = Date.now();

    io.to(roomCode).emit('game_started', { category, gameStartTime: room.gameStartTime });
    // Small delay then first question
    setTimeout(() => startQuestion(roomCode), 1500);
  });

  // — Submit Answer (host only) —
  socket.on('submit_answer', ({ roomCode, answerIndex }) => {
    const room = rooms[roomCode];
    if (!room) return;
    if (!room.players.find(p => p.id === socket.id)?.isHost) return; // only host can submit
    if (room.state !== 'playing') return;

    handleAnswer(roomCode, answerIndex);
  });

  // — Request Next Question (host only) —
  socket.on('next_question', ({ roomCode }) => {
    const room = rooms[roomCode];
    if (!room) return;
    if (!room.players.find(p => p.id === socket.id)?.isHost) return; // only host
    if (room.state !== 'reveal') return; // only valid during reveal state

    advanceToNextQuestion(roomCode);
  });

  // — Spectator Highlight (non-host, visual only) —
  socket.on('spectator_pick', ({ roomCode, answerIndex }) => {
    const room = rooms[roomCode];
    if (!room) return;

    // Broadcast to all so host can see others' picks
    io.to(roomCode).emit('spectator_voted', {
      playerId: socket.id,
      answerIndex
    });
  });

  // — Play Again (host only, resets to lobby) —
  socket.on('play_again', ({ roomCode }) => {
    const room = rooms[roomCode];
    if (!room) return;
    if (!room.players.find(p => p.id === socket.id)?.isHost) return;

    room.state = 'lobby';
    room.questions = [];
    room.currentQuestionIndex = 0;
    room.teamScore = 0;
    room.totalPossible = 0;
    room.answers = [];
    room.gameStartTime = null;
    if (room.timer) { clearTimeout(room.timer); room.timer = null; }

    io.to(roomCode).emit('back_to_lobby');
    broadcastPlayerList(roomCode);
  });

  // — Disconnect —
  socket.onAny((event) => {}); // no-op listener to prevent memory leaks
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    for (const roomCode in rooms) {
      const room = rooms[roomCode];
      const idx = room.players.findIndex(p => p.id === socket.id);
      if (idx === -1) continue;

      const wasHost = room.players[idx].isHost;
      room.players.splice(idx, 1);

      if (room.players.length === 0) {
        if (room.timer) clearTimeout(room.timer);
        delete rooms[roomCode];
        break;
      }

      if (wasHost) {
        room.players[0].isHost = true; // Promote next player to host
        io.to(roomCode).emit('host_changed', { newHostId: room.players[0].id, newHostName: room.players[0].name });
      }

      broadcastPlayerList(roomCode);

      // If game was in progress and now only 1 player, end the game
      if (room.state === 'playing' || room.state === 'reveal') {
        if (room.players.length < 1) {
          if (room.timer) clearTimeout(room.timer);
          delete rooms[roomCode];
        }
      }
      break;
    }
  });
});

// Catch-all route to serve the React app
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🎯 Quiz Mania server running on port ${PORT}`);
});
