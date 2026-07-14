# FighType Documentation Hierarchy (`Source of Truth`)

Welcome to the **FighType** documentation suite. Following our **Project Constitution**, every major architectural, design, product, and operational decision is fully documented right here before any code implementation.

## Bilingual Structure
To support both regional and global engineering collaboration, our documentation is organized into bilingual directories:
- **`docs/id/` (Indonesian - Authoritative Source of Truth)**: Contains the fully finalized and approved 15-document specifications for the FighType MVP.
- **`docs/en/` (English)**: Contains English translations and placeholders corresponding 1-to-1 with the Indonesian authoritative documents.

---

## Quick Start & Installation Reference
For immediate instructions on installing prerequisites (`Node.js v24+`, `Bun v1.2+`), setting up environment variables, and running the local development servers (`bun run dev`), please refer to the main repository root guide: **[README.md](../README.md)**.

---

## Document Index (`docs/id/` & `docs/en/`)

| Order | Document Name | Indonesian (`Authoritative`) | English (`Placeholder`) | Core Focus / Description |
| :---: | :--- | :--- | :--- | :--- |
| **01** | Vision Document | [`01-vision.md`](file:///Users/fzrsahi/Documents/Coding/battle-typing/docs/id/01-vision.md) | [`01-vision.md`](file:///Users/fzrsahi/Documents/Coding/battle-typing/docs/en/01-vision.md) | Mission, *"Typing is the core mechanic, Gaming is the experience"*, Terraria art direction |
| **02** | Product Requirement Document | [`02-prd.md`](file:///Users/fzrsahi/Documents/Coding/battle-typing/docs/id/02-prd.md) | [`02-prd.md`](file:///Users/fzrsahi/Documents/Coding/battle-typing/docs/en/02-prd.md) | MVP scope (LAN/Online rooms), 5 game modes, room lifecycle, match configuration matrix |
| **03** | Game Design Document | [`03-gdd.md`](file:///Users/fzrsahi/Documents/Coding/battle-typing/docs/id/03-gdd.md) | [`03-gdd.md`](file:///Users/fzrsahi/Documents/Coding/battle-typing/docs/en/03-gdd.md) | Typing mechanics, Fighting & Racing themes, 8 automated skills, Battle Royale rules |
| **04** | Technical Design Document | [`04-tdd.md`](file:///Users/fzrsahi/Documents/Coding/battle-typing/docs/id/04-tdd.md) | [`04-tdd.md`](file:///Users/fzrsahi/Documents/Coding/battle-typing/docs/en/04-tdd.md) | Bun + Fastify + WebSocket + Drizzle + React monorepo, server-authoritative reconciliation |
| **05** | Architecture Decision Records | [`05-adr.md`](file:///Users/fzrsahi/Documents/Coding/battle-typing/docs/id/05-adr.md) | [`05-adr.md`](file:///Users/fzrsahi/Documents/Coding/battle-typing/docs/en/05-adr.md) | ADR-001 through ADR-008 (Bun, Zod, neverthrow, decoupled engine, delivery-first MVP) |
| **06** | UI Design System | [`06-ui-design-system.md`](file:///Users/fzrsahi/Documents/Coding/battle-typing/docs/id/06-ui-design-system.md) | [`06-ui-design-system.md`](file:///Users/fzrsahi/Documents/Coding/battle-typing/docs/en/06-ui-design-system.md) | Immersive HUD, HSL/Hex Terraria color tokens, typography, micro-animations |
| **07** | Database Design | [`07-database-design.md`](file:///Users/fzrsahi/Documents/Coding/battle-typing/docs/id/07-database-design.md) | [`07-database-design.md`](file:///Users/fzrsahi/Documents/Coding/battle-typing/docs/en/07-database-design.md) | Drizzle ORM PostgreSQL schema, Zod validation, functional `ResultAsync` repositories |
| **08** | WebSocket Protocol | [`08-websocket-protocol.md`](file:///Users/fzrsahi/Documents/Coding/battle-typing/docs/id/08-websocket-protocol.md) | [`08-websocket-protocol.md`](file:///Users/fzrsahi/Documents/Coding/battle-typing/docs/en/08-websocket-protocol.md) | Zod discriminated union C2S/S2C packets, 20Hz broadcast ticks, functional parsing |
| **09** | API Specification | [`09-api-specification.md`](file:///Users/fzrsahi/Documents/Coding/battle-typing/docs/id/09-api-specification.md) | [`09-api-specification.md`](file:///Users/fzrsahi/Documents/Coding/battle-typing/docs/en/09-api-specification.md) | Fastify REST endpoints (`/api/v1/rooms`), fastify-type-provider-zod, OpenAPI integration |
| **10** | Folder Structure | [`10-folder-structure.md`](file:///Users/fzrsahi/Documents/Coding/battle-typing/docs/id/10-folder-structure.md) | [`10-folder-structure.md`](file:///Users/fzrsahi/Documents/Coding/battle-typing/docs/en/10-folder-structure.md) | Idiomatic Fastify & React/Vite monorepo boundaries (`packages/*` and `apps/*`) |
| **11** | Coding Standards | [`11-coding-standards.md`](file:///Users/fzrsahi/Documents/Coding/battle-typing/docs/id/11-coding-standards.md) | [`11-coding-standards.md`](file:///Users/fzrsahi/Documents/Coding/battle-typing/docs/en/11-coding-standards.md) | TypeScript strictness, Bun practices, functional `neverthrow` error handling, Zod rules |
| **12** | Development Roadmap | [`12-development-roadmap.md`](file:///Users/fzrsahi/Documents/Coding/battle-typing/docs/id/12-development-roadmap.md) | [`12-development-roadmap.md`](file:///Users/fzrsahi/Documents/Coding/battle-typing/docs/en/12-development-roadmap.md) | Phased milestones from Milestone 0 (Documentation) through Milestone 6 (MVP Launch) |
| **13** | Sprint Planning | [`13-sprint-planning.md`](file:///Users/fzrsahi/Documents/Coding/battle-typing/docs/id/13-sprint-planning.md) | [`13-sprint-planning.md`](file:///Users/fzrsahi/Documents/Coding/battle-typing/docs/en/13-sprint-planning.md) | Detailed sprint breakdowns (`Sprint 1` through `Sprint 6`) |
| **14** | Testing Strategy | [`14-testing-strategy.md`](file:///Users/fzrsahi/Documents/Coding/battle-typing/docs/id/14-testing-strategy.md) | [`14-testing-strategy.md`](file:///Users/fzrsahi/Documents/Coding/battle-typing/docs/en/14-testing-strategy.md) | Automated testing philosophy (deprioritized for initial MVP delivery per ADR-006) |
| **15** | Deployment Guide | [`15-deployment-guide.md`](file:///Users/fzrsahi/Documents/Coding/battle-typing/docs/id/15-deployment-guide.md) | [`15-deployment-guide.md`](file:///Users/fzrsahi/Documents/Coding/battle-typing/docs/en/15-deployment-guide.md) | Docker containerization, Bun/Fastify multi-stage builds, environment configuration |

---

## Framework & Architectural Principles
1. **Never Fight the Framework**: Every application inside `apps/*` strictly adheres to its framework conventions (`Fastify` plugin & route conventions for the backend; `React + Vite` hook, component, and store structures for the frontend).
2. **Server Authoritative & Zero-Latency Local Prediction**: All game state is verified by `packages/game-engine` running on the Fastify WebSocket server (`20Hz` broadcast). Clients predict typing feedback instantaneously using shared pure functions.
3. **Strict Validation & Functional Error Handling**: All external input is parsed using **Zod** (`ADR-007`), and all business logic operations return `neverthrow` `Result/ResultAsync` types (`ADR-008`).
