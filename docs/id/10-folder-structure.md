# 10. Struktur Folder Monorepo (`Bun Workspaces`)

**Nama Proyek:** FighType  
**Versi:** 1.0.0  
**Status:** Disetujui (Source of Truth)  
**Bahasa:** Bahasa Indonesia  
**Referensi Dokumen Sebelumnya:** [04-tdd.md](file:///Users/fzrsahi/Documents/Coding/battle-typing/docs/04-tdd.md), [05-adr.md](file:///Users/fzrsahi/Documents/Coding/battle-typing/docs/05-adr.md)  

---

## 1. Peta Direktori Monorepo (Root Level)
Struktur direktori **FighType** diatur menggunakan **Bun Workspaces** (`packages/*` dan `apps/*`) untuk menjamin *strict module boundary* dan mencegah ketergantungan sirkular (*circular dependency*).

```
battle-typing/
├── package.json               # Bun root workspaces config
├── bun.lockb                  # Bun binary lockfile
├── tsconfig.json              # Base TypeScript strict config
├── docs/                      # 15 Dokumen Source of Truth
├── packages/                  # Shared Domain & Engine Packages
│   ├── shared/                # Zod schemas, protokol, tipe global
│   └── game-engine/           # Pure functions: logika mengetik, skill & WPM
└── apps/                      # Aplikasi Executable
    ├── server/                # Backend Fastify + Native WebSocket + Drizzle ORM
    └── web/                   # Frontend React + Terraria Presentation Engine
```

---

## 2. Rincian Paket Internal (`packages/*`)

### 2.1 `packages/shared` (Protokol & Validasi Zod)
Tempat penyimpanan tunggal untuk seluruh kontrak data antar-aplikasi (`ADR-007`).
```
packages/shared/
├── package.json
├── tsconfig.json
└── src/
    ├── index.ts               # Public re-exports
    ├── protocol/              # Skema Zod WebSocket C2S dan S2C (`08-websocket-protocol.md`)
    │   ├── c2s-packets.ts
    │   └── s2c-packets.ts
    ├── schemas/               # Skema Zod REST API, Env, & Drizzle insert schemas
    │   ├── api-rooms.ts
    │   └── env-config.ts
    └── constants/             # Konstanta game (batas waktu, threshold combo, kamus dasar)
        ├── game-rules.ts
        └── dictionaries.ts
```

### 2.2 `packages/game-engine` (Deterministik Domain Logic)
Mesin permainan universal yang dijalankan oleh klien (`apps/web`) untuk prediksi cepat dan server (`apps/server`) untuk validasi otoritatif. Semua fungsi mengembalikan **`neverthrow` `Result<T, E>` (`ADR-008`)** dan bebas dari side-effect DOM/Node/DB.
```
packages/game-engine/
├── package.json
├── tsconfig.json
└── src/
    ├── index.ts
    ├── typing/                # Evaluasi karakter, WPM kotor/bersih, Akurasi
    │   ├── typing-engine.ts
    │   └── wpm-calculator.ts
    ├── skills/                # State machine untuk 8 skill otomatis (`Combo`, `Smoke`, `Confuse`, dll)
    │   ├── skill-engine.ts
    │   └── debuff-reducer.ts
    └── battle-royale/         # Aturan eliminasi 15s interval (`Lowest WPM`, `Accuracy Drop`)
        └── elimination-engine.ts
```

---

## 3. Rincian Aplikasi (`apps/*`)

### 3.1 `apps/server` (Idiomatic Fastify + Native WebSocket)
Backend server-authoritative yang mengelola state room dan sinkronisasi tick 20Hz, disusun mengikuti konvensi **Fastify Plugin Architecture** agar tidak melanggar standar framework (*framework-idiomatic*).
```
apps/server/
├── package.json
├── tsconfig.json
├── .env.example
└── src/
    ├── index.ts               # Entrypoint (`Bun.serve` / Fastify listen)
    ├── app.ts                 # Fastify instance builder & Zod type provider setup
    ├── plugins/               # Idiomatic Fastify Plugins (di-load via fastify-autoload / manual)
    │   ├── cors.ts            # @fastify/cors setup
    │   ├── websocket.ts       # @fastify/websocket (native Bun WS adapter)
    │   ├── swagger.ts         # @fastify/swagger + fastify-type-provider-zod
    │   └── db-plugin.ts       # Drizzle ORM instance decorator (`fastify.db`)
    ├── routes/                # Idiomatic Fastify Routes (terpisah per namespace)
    │   ├── health/
    │   │   └── index.ts       # GET /health
    │   └── api/
    │       └── rooms/
    │           └── index.ts   # POST /api/v1/rooms, GET /api/v1/rooms/:code
    ├── modules/               # Domain Feature Modules (Encapsulated Business Logic)
    │   ├── room/              # Room Management Module
    │   │   ├── room.service.ts# ResultAsync functional service (`neverthrow`)
    │   │   ├── room.manager.ts# In-memory room lobby state
    │   │   └── room.schemas.ts# Re-exports dari packages/shared Zod schemas
    │   ├── match/             # Match Engine & 20Hz Loop Module
    │   │   ├── match.loop.ts  # 20Hz tick broadcaster
    │   │   └── ws.handler.ts  # Functional WebSocket packet dispatcher
    │   └── ws/
    │       └── connection.pool.ts # Active socket connection registry
    └── db/                    # Persistensi PostgreSQL Drizzle ORM (`07-database-design.md`)
        ├── connection.ts      # Drizzle pg client
        ├── schema.ts          # Skema tabel users, rooms, matches
        └── repository/        # RoomRepository & MatchRepository (`ResultAsync`)
            ├── room.repository.ts
            └── match.repository.ts
```

### 3.2 `apps/web` (Idiomatic React + Vite + Terraria Presentation)
Frontend disusun mengikuti standar konvensi direktori **React + Vite**, di mana komponen UI, hooks, pages, dan stores tertata rapi, dan engine presentasi 2D Pixel Art menyatu sebagai layer grafis kustom tanpa merusak konvensi komponen React.
```
apps/web/
├── package.json
├── tsconfig.json
├── vite.config.ts             # Vite build untuk Bun/React
├── index.html
└── src/
    ├── main.tsx               # Root DOM renderer
    ├── App.tsx                # App router & providers
    ├── assets/                # Statis, sprite sheet Terraria, font monospaced/pixel
    ├── components/            # Idiomatic React Reusable UI Components
    │   ├── common/            # Tombol, GlassCard, Modal, Alert
    │   ├── typing/            # TypingArea.tsx (Monospaced input & highlight)
    │   ├── hud/               # StatsHUD.tsx (WPM, Accuracy, Combo), SkillNotify.tsx
    │   └── lobby/             # RoomConfigMatrix.tsx, PlayerList.tsx
    ├── pages/                 # Route Pages
    │   ├── LobbyPage.tsx      # Create/Join room & match settings
    │   └── ArenaPage.tsx      # Match container (1v1 / Battle Royale)
    ├── hooks/                 # Custom React Hooks (`useTypingInput`, `useRoomSocket`, `useComboPulse`)
    ├── stores/                # Client State Management (Zustand / React Context)
    │   ├── room.store.ts      # State lobby, daftar pemain, status ready
    │   └── match.store.ts     # State real-time WPM, HP lawan, debuff aktif
    ├── services/              # API & WebSocket Network Layer
    │   ├── api.client.ts      # REST fetcher ke Fastify (`/api/v1/rooms`)
    │   └── ws.client.ts       # Socket listener & dispatcher (`packages/shared` Zod verified)
    ├── presentation/          # Decoupled 2D Pixel Art & Audio Engine (`ADR-005`)
    │   ├── CanvasController.ts# Master requestAnimationFrame loop
    │   ├── ScreenShake.ts     # Getaran layar saat Critical Hit/Lightning
    │   └── AudioManager.ts    # BGM Terraria & sound effect keystroke
    └── themes/                # Pluggable Renderer Plugins (`03-gdd.md`)
        ├── ThemeInterface.ts  # Kontrak standar untuk semua tema (`onAttack`, `onDamage`)
        ├── fighting/          # Tema 1: Pertarungan Karakter Pixel ala Terraria
        │   ├── FightingRenderer.ts
        │   └── sprites/
        └── racing/            # Tema 2: Balapan Kendaraan Pixel
            └── RacingRenderer.ts
```

---

## 4. Batas Modul & Aturan Anti-Coupling (Module Boundaries)
1. **Frontend Tidak Mengakses DB/API Server:**  
   `apps/web` dilarang keras mengimpor dari `apps/server` ataupun `drizzle-orm`. Frontend hanya berinteraksi via HTTP REST dan WebSocket dengan skema dari `packages/shared`.
2. **Game Engine Bersifat Agnostik:**  
   `packages/game-engine` dilarang mengimpor `React`, `fastify`, atau `WebSocket`. Paket ini murni berisi matematika logika deterministik.
3. **Pemisahan Presentation vs Typing:**  
   Komponen `TypingArea.tsx` tidak boleh secara langsung menggambar sprite ke Canvas. `TypingArea.tsx` memanggil `wsClient.sendTypingInput()`, dan Canvas (`presentation/`) baru bereaksi saat event `ROOM_STATE_TICK` atau `SKILL_TRIGGERED` diterima dari server.
