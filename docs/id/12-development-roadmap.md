# 12. Peta Jalan Pengembangan (Development Roadmap)

**Nama Proyek:** FighType  
**Versi:** 1.0.0  
**Status:** Disetujui (Source of Truth)  
**Bahasa:** Bahasa Indonesia  
**Referensi Dokumen Sebelumnya:** [02-prd.md](file:///Users/fzrsahi/Documents/Coding/battle-typing/docs/id/02-prd.md), [04-tdd.md](file:///Users/fzrsahi/Documents/Coding/battle-typing/docs/id/04-tdd.md)  

---

## 1. Rangkuman Milestone & Alur Kerja
Sesuai **Project Constitution** ("Never rush into coding. Always design first"), pengembangan **FighType** dibagi menjadi **7 Milestone Utama (M0 hingga M6)**. Kita berfokus pada pengiriman **MVP berkecepatan tinggi (*delivery-focused MVP*)** dengan penundaan automated test scaffolding pada awal iterasi (`ADR-006`).

```
+-------------------+     +-------------------+     +-------------------+
|    Milestone 0    | --> |    Milestone 1    | --> |    Milestone 2    |
| (Documentation &  |     | (Monorepo Setup & |     | (Server Room &    |
|  Source of Truth) |     |  Shared Engine)   |     |  Drizzle ORM DB)  |
+-------------------+     +-------------------+     +-------------------+
                                                              |
                                                              v
+-------------------+     +-------------------+     +-------------------+
|    Milestone 5    | <-- |    Milestone 4    | <-- |    Milestone 3    |
| (Skill Engine &   |     | (React HUD &      |     | (Real-Time 20Hz   |
|  Battle Royale)   |     |  Terraria Theme)  |     |  WS Match Loop)   |
+-------------------+     +-------------------+     +-------------------+
          |
          v
+-------------------+
|    Milestone 6    |
| (Polish, QA &     |
|  Docker Deploy)   |
+-------------------+
```

---

## 2. Rincian Milestone

### Milestone 0: Fondasi Dokumentasi & Source of Truth (`Selesai`)
- **Tujuan:** Menyusun keseluruhan 15 dokumen spesifikasi produk, game design, arsitektur monorepo, protokol, dan standar koding dalam Bahasa Indonesia (`docs/id/`) serta placeholder bahasa Inggris (`docs/en/`).
- **Luaran Kunci:** Seluruh dokumen terverifikasi tanpa konflik spesifikasi.

### Milestone 1: Inisialisasi Monorepo & Core Domain Package
- **Tujuan:** Membangun kerangka monorepo Bun workspaces, mengonfigurasi strict TypeScript, dan membuat paket inti (`packages/shared` & `packages/game-engine`).
- **Target Deliverables:**
  - `package.json` root dengan konfigurasi workspace `packages/*` dan `apps/*`.
  - Skema Zod untuk validasi payload WebSocket dan REST API di `packages/shared`.
  - Fungsi murni *functional error handling* dengan `neverthrow` untuk `TypingEngine` dan kalkulator WPM di `packages/game-engine`.

### Milestone 2: Server Room Lifecycle & Persistensi PostgreSQL
- **Tujuan:** Membangun backend Fastify (`apps/server`) dengan struktur idiomatic (*Fastify Plugin Architecture*) dan menghubungkannya ke PostgreSQL melalui Drizzle ORM.
- **Target Deliverables:**
  - Setup Drizzle ORM (`schema.ts`) untuk tabel `users`, `rooms`, `matches`, dan `match_participants`.
  - API endpoint `POST /api/v1/rooms` dan `GET /api/v1/rooms/:code` yang divalidasi oleh `fastify-type-provider-zod`.
  - Modul in-memory `RoomManager` untuk mengatur lobi, daftar peserta, dan status *Ready*.

### Milestone 3: Real-Time WebSocket Engine & Match Broadcast Loop
- **Tujuan:** Mengaktifkan komunikasi dua arah latensi rendah via Native WebSocket (`@fastify/websocket`) dan mengimplementasikan *broadcaster loop* 20Hz.
- **Target Deliverables:**
  - Socket dispatcher (`ws.handler.ts`) yang memvalidasi `ClientPacket` menggunakan Zod.
  - Server tick loop (`match.loop.ts`) yang mem-broadcast status pemain (`ROOM_STATE_TICK`) setiap 50ms (20Hz).
  - Mekanisme sinkronisasi *keystroke* dan validasi akurasi/WPM real-time di server.

### Milestone 4: Frontend React HUD & Terraria Presentation Engine
- **Tujuan:** Membangun antarmuka pengguna (`apps/web`) mengikuti standar konvensi React + Vite dan merender tema visual ala Terraria.
- **Target Deliverables:**
  - Halaman Lobi (`LobbyPage.tsx`) dengan matriks pengaturan match.
  - HUD interaktif (`StatsHUD.tsx`, `TypingArea.tsx`) bergaya *Glassmorphism* dan border pixel art.
  - Decoupled 2D Pixel Art Canvas (`CanvasController.ts`, `ScreenShake.ts`) yang merender animasi pertarungan dan efek partikel *stumble/hit*.

### Milestone 5: Automated Skill Engine & Aturan Battle Royale
- **Tujuan:** Mengaktifkan 8 skill otomatis yang dipicu dari combo/akurasi serta mengimplementasikan eliminasi periodik Battle Royale.
- **Target Deliverables:**
  - Logika penembakan skill debuff (`Combo`, `Critical`, `Confuse`, `Mirror`, `Smoke`, `Lightning`, `Wind`, `Ghost`, `Freeze`) di `SkillEngine`.
  - Notifikasi visual/debuff aktif pada HUD lawan (`SkillNotify.tsx`).
  - *Elimination engine* yang mengevaluasi pemain dengan WPM terendah setiap interval 15 detik dan mengubah mereka menjadi *Spectator*.

### Milestone 6: Polish, Performance Optimization & Docker Deployment
- **Tujuan:** Memoles kehalusan animasi, mengoptimalkan memori WebSocket, dan menyiapkan kontainer produksi.
- **Target Deliverables:**
  - *Screen shake & audio balance review* agar seluruh feedback terasa *juicy* tanpa memory leak.
  - *Dockerfile* multi-stage build untuk Bun Fastify backend dan statis CDN Vite.
  - Uji beban manual LAN/Online dan verifikasi kesiapan rilis MVP.
