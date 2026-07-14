# 13. Perencanaan Sprint (Sprint Planning - MVP Delivery Focus)

**Nama Proyek:** FighType  
**Versi:** 1.0.0  
**Status:** Disetujui (Source of Truth)  
**Bahasa:** Bahasa Indonesia  
**Referensi Dokumen Sebelumnya:** [12-development-roadmap.md](file:///Users/fzrsahi/Documents/Coding/battle-typing/docs/id/12-development-roadmap.md)  

---

## 1. Strategi & Durasi Sprint
Untuk mencapai pengiriman produk MVP berkecepatan tinggi sesuai arahan (*"MVP dulu jangan dulu buat test"*), pengerjaan dibagi menjadi **6 Sprint Intensif**. Setiap sprint memiliki fokus deliverable yang terisolasi, di mana seluruh paket monorepo dibangun secara inkremental dari lapisan core data ke lapisan visual UI.

---

## 2. Rincian Eksekusi per Sprint

### Sprint 1: Scaffolding Monorepo & Shared Domain Engine
- **Fokus Utama:** Membangun kerangka Bun workspaces, konfigurasi strict TypeScript, dan implementasi logika deterministik di `packages/*`.
- **Daftar Tugas (Backlog Items):**
  1. Inisialisasi root `package.json` dan `tsconfig.json` dengan mode strict (`noUncheckedIndexedAccess: true`).
  2. Buat `packages/shared` dan deklarasikan Zod Schema untuk `ClientPacketSchema`, `ServerPacketSchema`, serta skema request API.
  3. Buat `packages/game-engine` dan tulis pure functions untuk `TypingEngine` (validasi karakter, akumulasi combo, pemutusan streak).
  4. Implementasikan kalkulator Gross WPM, Net WPM, dan Akurasi menggunakan pengembalian `Result<T, E>` dari `neverthrow`.

### Sprint 2: Fastify Server Architecture & Drizzle ORM PostgreSQL Setup
- **Fokus Utama:** Membangun struktur backend idiomatic (`plugins`, `routes`, `modules`) dan persistensi Drizzle ORM.
- **Daftar Tugas (Backlog Items):**
  1. Inisialisasi `apps/server` menggunakan Bun + Fastify dan pasang plugin `@fastify/cors`, `@fastify/websocket`, `@fastify/swagger`.
  2. Setup Drizzle ORM koneksi PostgreSQL dan buat definisi tabel `users`, `rooms`, `matches`, dan `match_participants` di `schema.ts`.
  3. Buat `RoomRepository` dan `MatchRepository` dengan pengembalian `ResultAsync<T, DatabaseError>`.
  4. Implementasikan modul manajemen lobi (`room.service.ts` dan `room.manager.ts`) beserta endpoint HTTP `POST /api/v1/rooms` dan `GET /api/v1/rooms/:code`.

### Sprint 3: Realtime WebSocket Match Loop & Reconciliation Engine
- **Fokus Utama:** Komunikasi WebSocket berkinerja tinggi (`/ws`) dan broadcaster tick 20Hz.
- **Daftar Tugas (Backlog Items):**
  1. Buat fungsional packet parser di `ws.handler.ts` yang memvalidasi `rawMessage` menggunakan skema Zod tanpa `try/catch`.
  2. Implementasikan `ClientPool` untuk melacak koneksi socket aktif di dalam room dan alur penanganan `ROOM_JOIN` / `ROOM_READY`.
  3. Bangun *match loop broadcaster* (`match.loop.ts`) yang berjalan di dalam `setInterval` 50ms (20Hz) memancarkan `ROOM_STATE_TICK`.
  4. Integrasikan penanganan event `TYPING_INPUT` di server dan perhitungan ulang posisi serta progress lawan secara real-time.

### Sprint 4: Frontend React HUD & Terraria Presentation Engine
- **Fokus Utama:** Membangun UI modular Vite + React serta rendering 2D Pixel Art ala Terraria.
- **Daftar Tugas (Backlog Items):**
  1. Inisialisasi `apps/web` dengan Vite + React + TypeScript dan buat struktur direktori idiomatic (`components`, `pages`, `hooks`, `stores`).
  2. Bangun halaman lobi (`LobbyPage.tsx`) dan interaksi pembuatan room serta pengaturan matriks match.
  3. Buat komponen HUD pertarungan (`StatsHUD.tsx`, `TypingArea.tsx`) dengan highlight warna hijau/merah monospaced dan kaca *Glassmorphism*.
  4. Implementasikan `CanvasController.ts` dan `FightingRenderer.ts` yang merender sprite karakter Terraria bertarung saat menerima event `ROOM_STATE_TICK`.

### Sprint 5: Automated Skill Engine & Battle Royale Mechanics
- **Fokus Utama:** Mengaktifkan 8 debuff skill otomatis dan sistem eliminasi periodik Battle Royale.
- **Daftar Tugas (Backlog Items):**
  1. Implementasikan `SkillEngine` di `packages/game-engine` untuk mendeteksi trigger combo (25, 50, 100) dan menghitung durasi debuff.
  2. Pasang efek visual debuff pada klien: `Confuse` (acak huruf kapital), `Mirror` (kata terbalik), `Smoke` (kabut asap Canvas), `Lightning` (`ScreenShake.ts`), `Wind`, `Ghost`, dan `Freeze`.
  3. Bangun `EliminationEngine` untuk mode Battle Royale yang memindai WPM terendah setiap interval 15 detik dan memancarkan `PLAYER_ELIMINATED`.
  4. Buat alur transisi mulus dari pemain tereliminasi menjadi penonton (*Spectator HUD*).

### Sprint 6: Polish, Sound Effects, Performance Tuning & Docker Build
- **Fokus Utama:** Sentuhan akhir (*juiciness*), optimasi performa memory-leak, dan kontainerisasi siap deploy.
- **Daftar Tugas (Backlog Items):**
  1. Integrasikan `AudioManager.ts` untuk memutar BGM Terraria dan efek suara ketikan pedang/bentrokan secara presisi.
  2. Review performa FPS Canvas agar tetap stabil di 60+ FPS pada resolusi desktop dan mobile browser.
  3. Buat `Dockerfile` multi-stage build untuk mengemas `apps/server` (Bun runtime) dan serving statis `apps/web`.
  4. Lakukan verifikasi eksploratif menyeluruh untuk alur pertandingan 1v1, FFA, Battle Royale, dan Team Battle.
