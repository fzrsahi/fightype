# FighType ⌨️⚔️

> **"Typing is the core mechanic. Gaming is the experience."**  
> A production-grade, Terraria-inspired competitive multiplayer typing game where typing controls combat, racing, and survival.

---

## Overview

**FighType** is not another passive typing practice website or Monkeytype clone. It is a full-fledged online multiplayer game designed from the ground up where typing controls every single action in the arena. During battle, the keyboard is the only input mechanism—no mouse clicks, no distractions—while the automated presentation engine renders vibrant 2D pixel art combat, vehicle racing, and dynamic skill effects.

### Key Highlights
- **Terraria-Inspired 2D Pixel Art:** Juicy animations, screen shakes, floating damage numbers, and rich visual presentation.
- **Server-Authoritative Realtime Engine:** Powered by **Fastify** and **Native WebSockets (`/ws`)** running on **Bun**, ensuring fair gameplay with sub-50ms synchronization and client-side prediction (`20Hz` broadcast ticks).
- **Automated Skill System:** Performance-generated skills (`Combo Attack`, `Critical`, `Confuse`, `Mirror`, `Smoke`, `Lightning`, `Wind`, `Ghost`, `Freeze`) trigger automatically based on typing streaks and accuracy.
- **5 Competitive Game Modes:** `1v1 Duel`, `Free For All (3-10 players)`, `Battle Royale (periodic lowest-WPM elimination)`, `Team Battle 2v2`, and `Team Battle 5v5`.
- **Idiomatic Monorepo Architecture:** Strict separation of concerns adhering to standard framework conventions without fighting against `Fastify` or `React/Vite`.
- **Strict Validation & Error Handling:** Universal type-safety driven by **Zod** (`ADR-007`) and functional error handling using **neverthrow (`Result<T, E>`)** (`ADR-008`).

---

## Documentation Hierarchy (`Source of Truth`)

Before any production code is written, our **Project Constitution** enforces a strict 15-document specification hierarchy located in `docs/`. This documentation serves as the ultimate Source of Truth for the entire engineering suite.

- **Authoritative Specifications (Indonesian):** Maintained under [`docs/id/`](file:///Users/fzrsahi/Documents/Coding/battle-typing/docs/id/01-vision.md)
- **English Translations & Placeholders:** Maintained under [`docs/en/`](file:///Users/fzrsahi/Documents/Coding/battle-typing/docs/en/01-vision.md)
- **Live Checkpoint Tracker:** See [`docs/id/16-project-checkpoint.md`](file:///Users/fzrsahi/Documents/Coding/battle-typing/docs/id/16-project-checkpoint.md)
- **Full Index:** See [`docs/README.md`](file:///Users/fzrsahi/Documents/Coding/battle-typing/docs/README.md)

---

## Tech Stack & Architecture

```
+-----------------------------------------------------------------------------------+
|                                 BUN MONOREPO ROOT                                 |
|                                                                                   |
|  +-------------------------------------+   +-----------------------------------+  |
|  |             apps/web                |   |            apps/server            |  |
|  |     (React + Vite + TypeScript)     |   |    (Fastify + Native WebSocket)   |  |
|  |                                     |   |                                   |  |
|  |  +-------------------------------+  |   |  +-----------------------------+  |  |
|  |  | Terraria Presentation Engine  |  |   |  | Room & Match Loop Module    |  |  |
|  |  | (2D Pixel Art / Audio / HUD)  |  |   |  | (20Hz State Broadcast)      |  |  |
|  |  +-------------------------------+  |   |  +-----------------------------+  |  |
|  +------------------|------------------+   +-----------------|-----------------+  |
|                     |              WebSocket (`/ws`)         |                    |
|                     +----------------------------------------+                    |
|                                        |                                          |
|  +-------------------------------------v---------------------------------------+  |
|  |                              packages/shared                                |  |
|  |         (Zod Discriminated Unions, API Schemas, Enums, Constants)           |  |
|  +-----------------------------------------------------------------------------+  |
|  |                            packages/game-engine                             |  |
|  |   (Pure Functions: TypingEngine, SkillEngine, WPM Calculator, neverthrow)   |  |
|  +-----------------------------------------------------------------------------+  |
+-----------------------------------------------------------------------------------+
                                         |
                                         v
                         +-------------------------------+
                         |          PostgreSQL           |
                         |      (via Drizzle ORM)        |
                         +-------------------------------+
```

---

## Development & Installation Setup

### Prerequisites (`System Requirements`)
FighType enforces strict runtime environments to ensure zero discrepancies between local development and CI/CD production pipelines:
1. **Node.js (`v24+`):** Pinned precisely via [`@.nvmrc`](file:///Users/fzrsahi/Documents/Coding/battle-typing/.nvmrc).
   ```bash
   # If using nvm (Node Version Manager):
   nvm install
   nvm use
   # Verifies Node v24.x is active
   node -v
   ```
2. **Bun (`v1.2+`):** High-speed package manager and workspace runner.
   ```bash
   # Install or upgrade Bun if not already present:
   curl -fsSL https://bun.sh/install | bash
   bun --version
   ```
3. **PostgreSQL (`v15+`):** Required for Drizzle ORM room session history and persistence.

---

### Step-by-Step Installation Guide

```bash
# 1. Clone the repository and enter workspace root
git clone https://github.com/fzrsahi/fightype.git
cd fightype

# 2. Activate Node v24 runtime per .nvmrc
nvm use

# 3. Install all monorepo workspace dependencies via Bun (~3 seconds)
bun install

# 4. Setup environment variables for local backend
cp apps/server/.env.example apps/server/.env

# 5. Build shared composite packages (@fightype/shared & @fightype/game-engine)
bun run build:packages
```

---

### Running the Application Locally (`Quick Start`)

To start both the Fastify Backend (`apps/server`) and React + Vite Frontend (`apps/web`) simultaneously in parallel:
```bash
bun run dev
```

Once running, access the local environments:
- 🎮 **Game Client (React + Vite + Terraria 2D Canvas):** [http://localhost:5173](http://localhost:5173)
- 🔌 **Server REST & WebSocket API:** [http://localhost:3000/api/v1/rooms](http://localhost:3000/api/v1/rooms)
- 📖 **OpenAPI / Swagger Interactive Documentation:** [http://localhost:3000/docs](http://localhost:3000/docs)

---

## Available Monorepo Commands (`Scripts`)

Run any of the following commands from the root directory using Bun:

| Command | Description | Target Workspaces |
| :--- | :--- | :--- |
| `bun run dev` | Spins up both backend (`:3000`) and frontend (`:5173`) in parallel | `@fightype/server`, `@fightype/web` |
| `bun run dev:server` | Starts only the Fastify backend with colorized `pino-pretty` dev logs | `@fightype/server` |
| `bun run dev:web` | Starts only the React + Vite frontend with instant HMR | `@fightype/web` |
| `bun run build:packages` | Compiles composite TypeScript references (`tsc -b`) | `@fightype/shared`, `@fightype/game-engine` |
| `bun run build` | Full production bundle build across shared packages and applications | All Workspaces |
| `bun run lint` | Runs ultra-fast Rust-powered **Oxlint** across 30+ files in `< 15ms` | All Workspaces |
| `bun run db:migrate` | Executes Drizzle ORM database migrations against PostgreSQL | `@fightype/server` |
| `bun run db:push` | Directly pushes Drizzle schema updates to local development database | `@fightype/server` |

---

## Core Engineering Standards & ADRs

FighType enforces strict engineering guidelines documented in [`docs/id/05-adr.md`](file:///Users/fzrsahi/Documents/Coding/battle-typing/docs/id/05-adr.md) and [`docs/id/11-coding-standards.md`](file:///Users/fzrsahi/Documents/Coding/battle-typing/docs/id/11-coding-standards.md):

1. **Framework-Idiomatic Architecture (`ADR-010`):** Pinned to **TypeScript `v7.0.2`**. Each workspace (`apps/server`, `apps/web`) maintains tailored `tsconfig.json` setups so code never fights against Fastify plugins or Vite `react-jsx` conventions.
2. **Decentralized Error Handling (`ADR-009`):** All domain failures inherit from `DomainError` with encapsulated HTTP status codes (`statusCode`), unique error codes (`errorCode`), and **English-only (`English Only`)** user messages. Route handlers delegate `domainError.toResponse()` without manual string matching.
3. **Structured Observability (`ADR-011`):** All server logs run via **Pino** (`apps/server/src/logger/index.ts`). In development (`NODE_ENV !== 'production'`), logs are colorized and formatted via `pino-pretty`. In production, logs output pure high-throughput async JSON.
4. **Deterministic Functional Engine (`ADR-008`):** The game engine (`@fightype/game-engine`) is written as pure, zero-side-effect functions returning **`neverthrow` (`Result<T, E>`)** objects, guaranteeing sub-tick evaluation safety.

---

## License & Contribution
This project is built under strict adherence to our **Project Constitution** and **Domain-Driven Design (DDD)** standards. All feature modifications must first be reflected in our documentation suite under [`docs/id/`](file:///Users/fzrsahi/Documents/Coding/battle-typing/docs/id/) before code implementation.
