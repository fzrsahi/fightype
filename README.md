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

## Development Setup

### Prerequisites
- **Bun** `>= v1.1.0` (Standard runtime and workspace manager)
- **PostgreSQL** `>= v15` (For room session history and persistence)

### Getting Started (Scaffolding Phase)
```bash
# 1. Clone repository
git clone https://github.com/your-org/battle-typing.git
cd battle-typing

# 2. Install dependencies via Bun
bun install

# 3. Setup environment variables
cp apps/server/.env.example apps/server/.env

# 4. Run database migrations via Drizzle ORM
bun run db:migrate

# 5. Start development servers in parallel (Server on :3000, Web on :5173)
bun run dev
```

---

## License & Contribution
This project is built under strict adherence to our **Project Constitution** and **Domain-Driven Design (DDD)** standards. All feature modifications must first be reflected in our documentation suite under [`docs/id/`](file:///Users/fzrsahi/Documents/Coding/battle-typing/docs/id/) before code implementation.
