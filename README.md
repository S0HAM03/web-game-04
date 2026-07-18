# QuizMania 🎯

A team-based multiplayer quiz game built with React, Vite, and Socket.io. Inspired by the HiveMind UI style — dark, minimal, and clean.

All players join the same room and play as a **team**. Everyone sees the same question at the same time, but only the **host** can lock in the final answer. Spectators can vote to guide the host's decision.

---

## Features

- 🎮 **Team Play** — One shared score for the whole room. Win or lose together.
- 📂 **Category Select** — Host picks a specific category before the game starts.
- ⏱️ **Timed Questions** — 20 seconds per question, server-enforced. No skipping.
- 🔒 **Host Locks Answer** — Only the host submits. Other players vote to influence the pick.
- 💡 **Instant Reveals** — Correct answer + explanation shown after every question.
- 📊 **Game Over Recap** — Full round-by-round breakdown with expandable explanations.
- 👁️ **Spectator Votes** — Non-host players select an option; their vote count is visible to the host.
- 🔄 **Play Again** — Host can restart with the same room after a game ends.
- 🖱️ **Custom Cursor** — HiveMind-style animated cursor throughout.

---

## Question Bank

40 total questions across 4 categories — 10 per category. One category is chosen per game session.

| Category | Count |
|---|---|
| 🎮 Video Games | 10 |
| 📺 YouTube & Creators | 10 |
| 🎬 Movies | 10 |
| 📱 Top Web Series | 10 |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + Vite 8 |
| Backend | Node.js + Express |
| Real-time | Socket.io 4 |
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
│   │   └── GameOver.jsx        # Results screen with per-question recap
│   ├── App.jsx                 # Root: Socket.io setup + view routing
│   ├── index.css               # Global dark theme + animations
│   └── main.jsx
├── server/
│   ├── index.js                # Socket.io game server: rooms, timers, scoring
│   ├── questions.js            # 40-question bank across 4 categories
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

### Run separately (optional)

```bash
npm run dev:client   # Vite only
npm run dev:server   # Node server only
```

---

## How to Play

1. **Host** opens the app and clicks **Host Game**, enters a name, and creates a lobby.
2. **Players** click **Join Game**, enter the 4-letter room code and their name.
3. Once everyone is in, the **host clicks Start Game**.
4. All players are taken to the **category select screen** — host picks one category.
5. Each question appears on screen for everyone simultaneously:
   - **Host** — selects an option, then clicks **Lock Answer** to submit.
   - **Spectators** — click any option to cast a vote (visible to host as a count). Cannot submit.
6. After the host locks in an answer (or time runs out), the **correct answer and explanation** are shown.
7. After all questions, the **Game Over** screen shows the team score, accuracy, and a full recap.
8. Host can click **Play Again** to restart with the same room.

---

## Game Flow

```
Landing → Host / Join Setup → Lobby
                                 ↓
                     Host clicks "Start Game"
                                 ↓
                       Category Select Screen
                    (Host picks: Games / YouTube / Movies / Series)
                                 ↓
                       Quiz (10 questions, 20s each)
                     ┌──────────────────────────────┐
                     │  ROUND X OF 10               │
                     │  [Question card]             │
                     │  ○ Option A   ○ Option B     │
                     │  ○ Option C   ○ Option D     │
                     │       [ Lock Answer ]        │  ← host only
                     └──────────────────────────────┘
                                 ↓
                          Game Over + Recap
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
