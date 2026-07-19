# QuizMania 🎯

A team-based multiplayer quiz game built with React, Vite, and Socket.io. Inspired by the HiveMind UI style — dark, minimal, and clean.

All players join the same room and play as a **team**. Everyone sees the same question at the same time, but only the **host** can lock in the final answer. Spectators can vote to guide the host's decision.

---

## Features

- 🎮 **Team Play** — One shared score for the whole room. Win or lose together.
- 📂 **8 Categories** — Host picks a specific category before the game starts.
- ⏱️ **Stopwatch Gameplay** — No timers when answering. Discuss as a team for as long as you want; final rankings are based on total time taken!
- 🖼️ **Image Questions** — Support for visual-based questions displayed prominently as the main card.
- 🎵 **Synthesized Sound Effects (SFX)** — Snappy, retro Web Audio SFX for button clicks, correct/wrong answers, and game over.
- 🔒 **Host Locks Answer** — Only the host submits. Other players vote to influence the pick.
- 🟢🔴 **Simple Border Reveals** — Visual feedback showing correct (green) and incorrect (red) choices directly on option borders.
- 📊 **Simple Game Over Recap** — Full round-by-round breakdown with a minimal, dark theme.
- 👁️ **Spectator Votes** — Non-host players select an option; their vote count is visible to the host.
- 🔄 **Play Again** — Host can restart with the same room after a game ends.
- 🖱️ **Custom Cursor** — HiveMind-style animated cursor throughout.

---

## Question Bank

350 total questions across 8 categories — 50 per category. 20 random questions are queued per game session.

| Category | Count |
|---|---|
| 🎮 Video Games | 50 |
| 📺 YouTube & Creators | 50 |
| 🎬 Movies | 50 |
| 📱 Top Web Series | 50 |
| 🏮 Anime & Manga | 50 |
| 💻 Tech & Programming | 50 |
| 🌐 Internet Culture | 50 |
| 🧠 General Knowledge | 50 |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + Vite 8 |
| Backend | Node.js + Express |
| Real-time | Socket.io 4 |
| Sound | Web Audio API (procedural SFX) |
| Icons | Lucide React |
| Styling | Vanilla CSS (dark theme) |
| Fonts | Bungee + Nunito (Google Fonts) |

---

## Project Structure

```
web-game-04/
├── src/
│   ├── components/
│   │   ├── UI.jsx              # Shared UI: AnimatedCursor, ChunkyButton, Landing, Lobby, Setup views
│   │   ├── CategorySelect.jsx  # Category picker screen (host chooses, spectators wait)
│   │   ├── QuizGame.jsx        # Main game screen: question + 2×2 options + Lock Answer
│   │   └── GameOver.jsx        # Simple results screen with per-question recap
│   ├── utils/
│   │   └── sfx.js              # Synthesized procedural UI sound effects
│   ├── App.jsx                 # Root: Socket.io setup + view routing
│   ├── index.css               # Global dark theme + animations
│   └── main.jsx
├── server/
│   ├── questions/              # Separate question modules
│   │   ├── anime.js
│   │   ├── gk.js
│   │   ├── internet.js
│   │   └── tech.js
│   ├── index.js                # Socket.io game server: rooms, stopwatch, scoring
│   ├── questions.js            # Main exporter combining all 350 questions
│   └── package.json
├── vite.config.js              # Vite config with Socket.io proxy
└── package.json                # Root: concurrently script runs client + server
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Why two separate `package.json` files?

The Vite/React app lives at the **project root** (`src/`) and the Node.js game server lives in `server/`. They run in different environments (browser vs Node) and use different module systems (ES modules vs CommonJS), so they have separate dependency trees. A single `install:all` script handles both.

### Install

```bash
npm run install:all
```

This installs dependencies for both the client (root) and the server (`server/`).

### Run (Development)

```bash
npm run dev
```

Starts both services via `concurrently`:

| Service | URL |
|---|---|
| Client (Vite) | http://localhost:5173 |
| Server (Socket.io) | http://localhost:3001 |

The Vite dev server automatically proxies `/socket.io` requests to port 3001, so you don't need to configure CORS or origins in development.

---

## How to Play

1. **Host** opens the app and clicks **Host Game**, enters a name, and creates a lobby.
2. **Players** click **Join Game**, enter the 4-letter room code and their name.
3. Once everyone is in, the **host clicks Start Game**.
4. All players are taken to the **category select screen** — host picks one category.
5. Each question appears on screen for everyone simultaneously (with image questions displayed prominently).
   - **Host** — selects an option, then clicks **Lock Answer** to submit.
   - **Spectators** — click any option to cast a vote (visible to host as a count). Cannot submit.
6. After the host locks in an answer, the **option borders light up** (green for correct, red for incorrect). 
7. Host can advance manually, or the game auto-advances to the next question after 15 seconds.
8. After 20 questions, the **Game Over** screen shows the team score, accuracy, total time taken, and a clean recap of the questions.
9. Host can click **Play Again** to restart with the same room.

---

## Game Flow

```
Landing → Host / Join Setup → Lobby
                                 ↓
                     Host clicks "Start Game"
                                 ↓
                       Category Select Screen
                 (Host picks one of 8 categories)
                                 ↓
                       Quiz (20 questions, stopwatch)
                     ┌──────────────────────────────┐
                     │  ROUND X OF 20               │
                     │  [Image or Question card]    │
                     │  ○ Option A   ○ Option B     │
                     │  ○ Option C   ○ Option D     │
                     │       [ Lock Answer ]        │  ← host only
                     └──────────────────────────────┘
                                 ↓
                        Simple Game Over Recap
```

---

## Environment Variables

The client reads `VITE_SERVER_URL` to find the backend. In development, Vite proxies `/socket.io` to `localhost:3001` automatically — no `.env` needed.

For production, create a `.env` file in the root:

```env
VITE_SERVER_URL=https://your-server-domain.com
```

---

## Related Projects

- [HiveMind Cursor](https://github.com/S0HAM03/web-game-03) — Co-op shared cursor game (Web-game-03)
