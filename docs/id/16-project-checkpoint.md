# 16. Pelacakan Progres & Checkpoint Ekstensif Proyek (`Project Checkpoint & Exhaustive Feature Roadmap`)

**Nama Proyek:** FighType (`battle-typing-monorepo`)  
**Versi:** 1.0.0-dev  
**Branch Aktif:** `dev` (Commit terakhir: `07a87e8`)  
**Status Dokumen:** *Source of Truth & Living Checklist* (Lengkap dari awal hingga akhir tanpa ringkasan parsial)  
**Bahasa:** Bahasa Indonesia  
**Referensi Spesifikasi:** [01-vision.md](file:///Users/fzrsahi/Documents/Coding/battle-typing/docs/id/01-vision.md) hingga [15-deployment-guide.md](file:///Users/fzrsahi/Documents/Coding/battle-typing/docs/id/15-deployment-guide.md)

---

## 1. Ikhtisar Eksekutif Milestone Proyek

| Milestone / Sprint | Fokus Utama | Status Pengerjaan | Item Selesai | Item Belum |
| :--- | :--- | :---: | :---: | :---: |
| **Milestone 0** | Fondasi Dokumentasi & Source of Truth | 🟢 **100% Selesai** | 17 / 17 | 0 |
| **Sprint 1 (Milestone 1)** | Scaffolding Monorepo & Shared Domain Engine | 🟢 **100% Selesai** | 19 / 19 | 0 |
| **Sprint 2 (Milestone 2)** | Fastify Server Architecture & Drizzle ORM DB Setup | 🟡 **Sebagian Selesai** | 8 / 18 | 10 |
| **Sprint 3 (Milestone 3)** | Realtime WebSocket Match Loop (`/ws` & Client Pool) | 🔵 **Target Berikutnya** | 0 / 14 | 14 |
| **Sprint 4 (Milestone 4)** | Frontend React HUD & Terraria Presentation Engine | 🟡 **Sebagian Selesai** | 12 / 16 | 4 |
| **Sprint 5 (Milestone 5)** | Automated Skill Engine & Battle Royale Mechanics | 🟡 **Sebagian Selesai** | 3 / 11 | 8 |
| **Sprint 6 (Milestone 6)** | Polish, Sound Effects, Performance Tuning & Docker | 🟡 **Sebagian Selesai** | 2 / 12 | 10 |

---

## 2. Rincian Ekstensif Seluruh Fitur & Tugas (`Exhaustive Checklist`)

### 📜 Milestone 0: Fondasi Dokumentasi & Source of Truth (`Selesai 100%`)
- [x] **01. Vision Document (`docs/id/01-vision.md`)**: Visi inti *"Typing is the core mechanic, Gaming is the experience"*, arahan seni Terraria 2D, dan pilar fundamental.
- [x] **02. Product Requirement Document (`docs/id/02-prd.md`)**: Ruang lingkup MVP (LAN/Online), 5 mode permainan (`1v1`, `Team Battle`, `FFA`, `Battle Royale`, `Speed Run`), siklus hidup room, dan matriks konfigurasi.
- [x] **03. Game Design Document (`docs/id/03-gdd.md`)**: Mekanika ketikan, tema `Fighting` & `Racing`, kalkulasi combo/damage, 8 skill otomatis, dan aturan eliminasi Battle Royale.
- [x] **04. Technical Design Document (`docs/id/04-tdd.md`)**: Arsitektur Bun + Fastify + WebSocket + Drizzle + React + Vite, model rekonsiliasi *server-authoritative*, dan prediksi lokal latensi nol.
- [x] **05. Architecture Decision Records (`docs/id/05-adr.md`)**: Keputusan teknis formal `ADR-001` hingga `ADR-008` (pilihan Bun, Zod, `neverthrow`, decoupled engine, MVP *delivery-focused*).
- [x] **06. UI Design System (`docs/id/06-ui-design-system.md`)**: Token warna HSL/Hex tema Terraria neon, tipografi monospaced, *Glassmorphism*, dan spesifikasi mikro-animasi.
- [x] **07. Database Design (`docs/id/07-database-design.md`)**: ERD relasional PostgreSQL dan definisi skema Drizzle ORM (`users`, `rooms`, `matches`, `match_participants`).
- [x] **08. WebSocket Protocol (`docs/id/08-websocket-protocol.md`)**: Skema Zod *discriminated union* untuk paket `ClientPacket` (C2S) dan `ServerPacket` (S2C), serta siklus *broadcaster tick* 20Hz.
- [x] **09. API Specification (`docs/id/09-api-specification.md`)**: Spesifikasi endpoint Fastify REST (`/api/v1/rooms`), integrasi `fastify-type-provider-zod`, dan dokumentasi interaktif OpenAPI/Swagger.
- [x] **10. Folder Structure (`docs/id/10-folder-structure.md`)**: Pembatas batas modular monorepo idiomatic (`packages/*` untuk domain murni, `apps/*` untuk runtime aplikasi).
- [x] **11. Coding Standards (`docs/id/11-coding-standards.md`)**: Aturan ketat TypeScript 7, konvensi Bun, *functional error handling* dengan `neverthrow`, dan pelarangan *hardcoding*.
- [x] **12. Development Roadmap (`docs/id/12-development-roadmap.md`)**: Peta jalan pentahapan dari Milestone 0 hingga Milestone 6 menuju peluncuran MVP.
- [x] **13. Sprint Planning (`docs/id/13-sprint-planning.md`)**: Rincian pengerjaan per sprint (`Sprint 1` hingga `Sprint 6`) dengan fokus pengiriman bertahap.
- [x] **14. Testing Strategy (`docs/id/14-testing-strategy.md`)**: Filosofi pengujian otomatis dan rasionalisasi penundaan *test scaffolding* di awal iterasi MVP (`ADR-006`).
- [x] **15. Deployment Guide (`docs/id/15-deployment-guide.md`)**: Panduan kontainerisasi Docker multi-stage build untuk Fastify dan Vite, serta manajemen variabel lingkungan.
- [x] **Struktur Multibahasa & Root README (`README.md`)**: Panduan instalasi cepat, tabel perintah Bun monorepo (`dev`, `build`, `lint`), serta folder placeholder `docs/en/`.
- [x] **Indeks Dokumentasi (`docs/README.md`)**: Tabel indeks terlengkap dengan tautan navigasi langsung ke seluruh dokumen spesifikasi dan checkpoint.

---

### 📦 Sprint 1 (Milestone 1): Scaffolding Monorepo & Shared Domain Engine (`Selesai 100%`)

#### 2.1 Konfigurasi Root & Workspaces
- [x] Inisialisasi `package.json` root dengan deklarasi workspace `packages/*` dan `apps/*`.
- [x] Konfigurasi skrip root: `bun run dev`, `bun run build:packages`, `bun run build:apps`, `bun run build`, `bun run lint`, dan `bun run prepare`.
- [x] Pembuatan `.nvmrc` (`v24`) dan spesifikasi `engines` (`node: >=24.0.0`, `bun: >=1.2.0`) di `package.json`.
- [x] Konfigurasi `tsconfig.json` root dengan mode strict maksimal (`noUncheckedIndexedAccess: true`, `verbatimModuleSyntax: true` per `ADR-010`).
- [x] Pembuatan dan pemeliharaan `bun.lock` serta `.gitignore` terpusat yang mengabaikan `node_modules/`, `dist/`, `.env`, dan `.tsbuildinfo`.

#### 2.2 Paket Domain Bersama (`@fightype/shared`)
- [x] **Skema Pengaturan & HTTP API (`src/schemas/room.schema.ts`)**:
  - `CreateRoomSettingsSchema` (timeLimit, wordSource, difficulty, theme, skillSystem)
  - `CreateRoomRequestSchema` (hostNickname, gameMode, settings)
  - `CreateRoomResponseSchema` & `CheckRoomResponseSchema`
- [x] **Konstanta Aturan Permainan (`src/constants/rules.ts`)**:
  - `GAME_RULES` (`MAX_PLAYERS: 8`, `MIN_PLAYERS: 2`, `TICK_RATE_HZ: 20`, `TICK_INTERVAL_MS: 50`, `ROOM_CODE_LENGTH: 6`)
- [x] **Konstanta Kode Status HTTP (`src/constants/status.ts`)**:
  - `HTTP_STATUS` dengan konversi `Number()` eksplisit agar kompatibel penuh dengan Fastify response typing.
- [x] **Skema Protokol WebSocket C2S & S2C (`src/protocol/ws.ts`)**:
  - `C2S_RoomJoinSchema`, `C2S_RoomReadySchema`, `C2S_TypingInputSchema`, dan *discriminated union* `ClientPacketSchema` (`ClientPacket`).
  - `PlayerStateSchema`, `S2C_RoomStateTickSchema`, `S2C_SkillTriggeredSchema`, `S2C_MatchEndSchema`, dan *discriminated union* `ServerPacketSchema` (`ServerPacket`).
- [x] **Entry Point Bersih (`src/index.ts`)**:
  - Mengekspor seluruh tipe, skema, dan konstanta tanpa menyisakan keluaran `.js` atau `.d.ts` di folder `src/`.

#### 2.3 Paket Core Game Engine (`@fightype/game-engine`)
- [x] **Desentralisasi Error Domain (`src/errors/domain.errors.ts`)**:
  - Kelas dasar `DomainError` (mendukung `instanceof`) dan turunan khusus: `RoomNotFoundError`, `RoomFullError`, `GameAlreadyStartedError`, `InvalidInputError`.
- [x] **Mesin Kalkulasi Ketikan (`src/typing/typing.engine.ts`)**:
  - `TypingEngine.validateInput()`: Memeriksa akurasi karakter ketikan, menambah `combo` saat benar, atau memutus streak saat salah.
  - `TypingEngine.calculateDamage()`: Menghitung damage serangan ke musuh berdasarkan akurasi dan pengali combo.
- [x] **Kalkulator WPM Deterministik (`src/typing/wpm.calculator.ts`)**:
  - `WpmCalculator.calculateGrossWPM()` dan `WpmCalculator.calculateNetWPM()` dengan pengembalian pure `Result<number, DomainError>` dari `neverthrow`.
- [x] **Mesin Evaluasi Skill (`src/skills/skill.engine.ts`)**:
  - `SkillEngine.checkComboTrigger()`: Mengevaluasi ambang batas combo (25, 50, 100) dan mengembalikan spesifikasi debuff (`COMBO_ATTACK`, `CRITICAL`, `CONFUSE`, `MIRROR`, `SMOKE`, `LIGHTNING`, `WIND`, `GHOST`, `FREEZE`).
- [x] **Kerapian Struktur Build (`src/index.ts`)**:
  - Kompilasi `tsc -b` mengarahkan definisi tipe murni ke `dist/` dan memastikan `src/` bersih 100%.

---

### 🖥️ Sprint 2 (Milestone 2): Fastify Server Architecture & Drizzle ORM DB Setup (`Sebagian Selesai - 8 / 18`)

#### 3.1 Skeleton & HTTP API Fastify (`@fightype/server` - Selesai)
- [x] Konfigurasi `package.json` server dengan dependensi Fastify v5, `fastify-plugin`, `fastify-type-provider-zod`, `pino`, `pino-pretty`, `@fastify/cors`, `@fastify/swagger`, dan `@fastify/websocket`.
- [x] **System Logger (`src/logger/index.ts`)**: Modular logger `createLogger()` dengan format warna `pino-pretty` untuk pengembangan lokal dan format JSON berstruktur untuk production.
- [x] **Fastify App Setup (`src/app.ts` & `src/index.ts`)**:
  - Pengikatan `ZodTypeProvider` global untuk validasi otomatis request body/query/params.
  - Registrasi plugin CORS dan Swagger OpenAPI interaktif (`/docs`).
  - Entry point server yang berjalankan `fastify.listen({ port: 3000, host: '0.0.0.0' })` dengan penanganan graceful shutdown.
- [x] **Modul Manajemen Lobi In-Memory (`src/modules/room/`)**:
  - `RoomManager` (`room.manager.ts`): Menyimpan struktur `RoomSession`, membuat kode unik `generateUniqueCode()`, serta mengelola penambahan peserta dan penguncian status *Ready*.
  - `RoomService` (`room.service.ts`): Mengorkestrasi pembuatan room dan pengambilan status room dengan pengembalian fungsional `ResultAsync<T, DomainError>`.
- [x] **HTTP Routes (`src/routes/`)**:
  - `GET /health`: Pemeriksaan status kesehatan server dan masa aktif sistem (`routes/health/index.ts`).
  - `POST /api/v1/rooms`: Pembuatan room baru dengan validasi skema Zod request dan pengembalian URL WebSocket (`routes/api/rooms/index.ts`).
  - `GET /api/v1/rooms/:code`: Pengambilan detail room dan validasi keberadaannya di `RoomManager`.

#### 3.2 Persistensi Database PostgreSQL + Drizzle ORM (`Belum Diimplementasikan`)
- [ ] Konfigurasi koneksi database PostgreSQL di `apps/server/src/db/connection.ts` menggunakan instance `drizzle-orm/postgres-js`.
- [ ] **Definisi Skema Tabel (`apps/server/src/db/schema.ts`)**:
  - [ ] Tabel `users`: `id (UUID, PK)`, `username (VARCHAR 50, UNIQUE)`, `created_at (TIMESTAMP)`.
  - [ ] Tabel `rooms`: `id (UUID, PK)`, `code (VARCHAR 20, UNIQUE)`, `host_nickname`, `game_mode`, `settings_json (JSONB)`, `status (LOBBY | IN_PROGRESS | FINISHED)`, `created_at`.
  - [ ] Tabel `matches`: `id (UUID, PK)`, `room_id (FK ke rooms.id)`, `game_mode`, `settings_json (JSONB)`, `start_time`, `end_time`.
  - [ ] Tabel `match_participants`: `id (UUID, PK)`, `match_id (FK)`, `user_id (FK nullable)`, `nickname`, `gross_wpm`, `net_wpm`, `accuracy`, `max_combo`, `placement`, `is_winner`.
- [ ] **Functional Database Repositories (`neverthrow` ResultAsync)**:
  - [ ] `apps/server/src/modules/room/room.repository.ts`: Fungsi `createRoomRecord()`, `getRoomByCode()`, `updateRoomStatus()` yang menangani error database tanpa melempar exception.
  - [ ] `apps/server/src/modules/match/match.repository.ts`: Fungsi `createMatchRecord()` dan `saveParticipantsHistory()`.
- [ ] Konfigurasi `drizzle.config.ts` di `apps/server/` serta pendaftaran skrip `db:migrate` dan `db:push` pada `package.json`.

---

### ⚡ Sprint 3 (Milestone 3): Realtime WebSocket Engine & Match Broadcast Loop (`Target Berikutnya - 0 / 14`)

#### 4.1 WebSocket Gateway & Packet Dispatcher (`@fightype/server/src/ws/`)
- [ ] **Registrasi Plugin WebSocket**: Memasang dan mengaktifkan plugin `@fastify/websocket` pada `apps/server/src/app.ts`.
- [ ] **Route Handler WebSocket (`apps/server/src/routes/ws/index.ts`)**:
  - [ ] Menangani koneksi masuk dari `ws://localhost:3000/ws?room=CODE`.
  - [ ] Memverifikasi parameter `room` terhadap `RoomManager` dan menolak koneksi jika kode room tidak ditemukan atau penuh.
- [ ] **Modul `ClientPool` (`apps/server/src/ws/client.pool.ts`)**:
  - [ ] Struktur data `WebSocketSession`: `userId (UUID/string)`, `nickname`, `roomCode`, `isReady (boolean)`, `progress`, `wpm`, `accuracy`, `combo`, `hp`, dan referensi `socket`.
  - [ ] Fungsi `addClient(session)` dan `removeClient(userId)` berkinerja tinggi untuk melacak koneksi aktif.
  - [ ] Fungsi `getRoomClients(roomCode)` untuk mengambil seluruh socket yang terhubung pada room tertentu.
  - [ ] Fungsi `broadcastToRoom(roomCode, packet)` untuk memancarkan paket JSON ke semua anggota room.
- [ ] **Socket Packet Parser & Dispatcher (`apps/server/src/ws/ws.handler.ts`)**:
  - [ ] Validasi pesan masuk menggunakan `ClientPacketSchema.safeParse(JSON.parse(rawMessage))` tanpa blok `try/catch` yang rentan crash.
  - [ ] **Handler `ROOM_JOIN`**: Mendaftarkan nickname pemain ke `ClientPool` dan mengabarkan kedatangan pemain baru ke seluruh anggota room.
  - [ ] **Handler `ROOM_READY`**: Memperbarui status `isReady` pemain. Jika seluruh pemain dalam room telah `isReady: true` dan jumlah pemain $\ge$ `MIN_PLAYERS`, server memulai hitung mundur (*countdown*) 3 detik.
  - [ ] **Handler `TYPING_INPUT`**: Menerima indeks kata dan karakter yang diketik, memvalidasinya melalui pure function `TypingEngine.validateInput()`, memperbarui WPM/Akurasi/Combo di `ClientPool`, dan menghitung pengurangan HP lawan jika terjadi combo attack.
  - [ ] **Handler `ws.on('close')`**: Menangani pemutusan koneksi secara tiba-tiba, menghapus sesi dari `ClientPool`, dan memancarkan pemberitahuan ke pemain tersisa.

#### 4.2 Broadcaster Tick 20Hz (`match.loop.ts`)
- [ ] **Server Tick Engine (`apps/server/src/ws/match.loop.ts`)**:
  - [ ] Membuat siklus `setInterval(..., GAME_RULES.TICK_INTERVAL_MS)` (50ms / 20Hz).
  - [ ] Memindai seluruh room di `RoomManager` yang berstatus `IN_PROGRESS` (pertarungan aktif).
  - [ ] Mengompilasi seluruh `PlayerState` dalam room tersebut menjadi satu paket `S2C_RoomStateTickSchema`.
  - [ ] Memancarkan (`broadcastToRoom`) paket `ROOM_STATE_TICK` ke seluruh socket di room, memastikan semua pemain menerima data sinkronisasi latensi rendah secara bersamaan.

---

### 🎨 Sprint 4 (Milestone 4): Frontend React HUD & Terraria Presentation Engine (`Sebagian Selesai - 12 / 16`)

#### 5.1 Infrastruktur Frontend (`@fightype/web` - Selesai)
- [x] Inisialisasi Vite 6 + React 19 + TypeScript 7 dengan arsitektur folder modular (`src/components`, `src/pages`, `src/hooks`, `src/stores`, `src/services`, `src/themes`).
- [x] Desain sistem Vanilla CSS (`src/index.css`) berkonsep cyberpunk, latar belakang gelap, neon glow, dan utilitas *Glassmorphism*.
- [x] **State & Cache Management**:
  - Global TanStack Query setup (`QueryProvider.tsx`) di `main.tsx`.
  - Custom React Query hooks (`useCreateRoomMutation()`, `useCheckRoomQuery()`) di `hooks/queries/useRoomQueries.ts`.
  - HTTP API Client (`services/api.client.ts`) berbasis `fetch` yang bersih.
  - Global UI store berbasis Zustand (`stores/room.store.ts`) mengelola transisi `view: LOBBY | ARENA` dan identitas pemain.

#### 5.2 Antarmuka Pengguna & HUD Pertarungan (`LobbyPage` & `ArenaPage` - Selesai)
- [x] **Halaman Lobi (`src/pages/LobbyPage.tsx`)**: Form interaktif input Nickname, pembuat room baru, atau pengisi kode room (Join Room) dengan penanganan loading/error otomatis dari TanStack Query.
- [x] **Wadah Arena (`src/pages/ArenaPage.tsx`)**: Layout pertarungan yang memadukan Canvas 2D di bagian atas/tengah dan area ketik di bawah.
- [x] **HUD Statistik (`src/components/hud/StatsHUD.tsx`)**: Menampilkan timer hitung mundur 60 detik, Gross/Net WPM langsung, persentase Akurasi, indikator Combo berkedip, dan kode room.
- [x] **Area Ketik (`src/components/typing/TypingArea.tsx`)**:
  - Teks paragraf kata bahasa Indonesia monospaced berkurasi.
  - Highlight karakter presisi: Hijau untuk karakter yang benar diketik, Merah bergetar untuk kesalahan, dan Kursor berkedip pada huruf berikutnya.
  - Fokus otomatis pada area input tanpa memerlukan klik ulang dari pemain.

#### 5.3 Engine Render 2D Pixel Art Terraria (`src/themes/fighting/` - Selesai)
- [x] **Controller Canvas (`CanvasController.ts`)**: Mengelola siklus hidup `requestAnimationFrame`, kalibrasi ukuran layar (*resize listener*), dan stabilisasi context 2D.
- [x] **Fighting Renderer (`FightingRenderer.ts`)**:
  - Menggambar latar belakang malam/bulan Terraria dan daratan rumput hijau bertingkat (*layered environment*).
  - Merender sprite karakter lokal dan sprite karakter lawan di sisi berlawanan.
  - Merender bar HP visual bergaya RPG di atas kepala masing-masing karakter.
  - Merender animasi tebasan pedang (`slash effects`) saat terjadi pengetikan beruntun.
  - Mengelola sistem partikel dinamis (`sparks` saat bentrokan senjata, `floating text` untuk damage angka).
- [x] **Efek Getaran Layar (`ScreenShake.ts`)**: Modul `shake(intensity, duration)` yang menggeser koordinat kamera canvas secara dinamis untuk memberikan sensasi bentrokan fisik yang kuat (*juiciness*).

#### 5.4 Live WebSocket Client Synchronization (`Belum Diimplementasikan`)
- [ ] **Custom Hook WebSocket (`apps/web/src/hooks/useBattleSocket.ts`)**:
  - [ ] Membuka koneksi WebSocket ke `wsUrl` secara otomatis begitu pengguna masuk ke `view === 'ARENA'`.
  - [ ] Mengirimkan paket `ROOM_JOIN` saat event `onopen` terpicu.
  - [ ] Mengirimkan paket `ROOM_READY` saat pemain menekan tombol siap bertarung di lobi arena.
  - [ ] Mengirimkan paket `TYPING_INPUT` setiap kali pengguna mengetik karakter baru di `TypingArea.tsx`.
- [ ] **Sinkronisasi Canvas & HUD dari Data WebSocket (`ROOM_STATE_TICK`)**:
  - [ ] Menangkap pesan masuk `ROOM_STATE_TICK` dari server (20 kali per detik).
  - [ ] Memperbarui nilai `progress`, `wpm`, `accuracy`, dan `combo` lawan secara *real-time* pada `StatsHUD.tsx`.
  - [ ] Mengubah koordinat X sprite lawan dan menggerakkan animasi melangkah maju/mundur pada `FightingRenderer.ts` berdasarkan kemajuan kata yang diketik lawan.
  - [ ] Menurunkan bar HP musuh atau bar HP sendiri di Canvas secara mulus ketika server memancarkan update damage serangan.

---

### ⚔️ Sprint 5 (Milestone 5): Automated Skill Engine & Battle Royale Mechanics (`Sebagian Selesai - 3 / 11`)

#### 6.1 Logika Domain Skill di Engine (`packages/game-engine` - Selesai)
- [x] Implementasi pendeteksi trigger combo beruntun (`25 combo`, `50 combo`, `100 combo`) pada `SkillEngine`.
- [x] Pemilihan otomatis jenis debuff skill dari daftar 8 tier debuff (`COMBO_ATTACK`, `CRITICAL`, `CONFUSE`, `MIRROR`, `SMOKE`, `LIGHTNING`, `WIND`, `GHOST`, `FREEZE`).
- [x] Perhitungan durasi aktif debuff (`durationMs: 2000` hingga `4000`) yang dikembalikan ke server untuk di-broadcast.

#### 6.2 Integrasi Efek Visual & Mekanik Debuff di Klien (`Belum Diimplementasikan`)
- [ ] **Komponen Banner Notifikasi (`apps/web/src/components/hud/SkillNotify.tsx`)**:
  - [ ] Menampilkan banner animasi teks di tengah layar (contoh: *"⚡ OPPONENT CASTED LIGHTNING! ⚡"*) saat menerima paket `SKILL_TRIGGERED` dari server.
- [ ] **Implementasi Efek Debuff `CONFUSE`**:
  - [ ] Ketika status `CONFUSE` aktif, komponen `TypingArea.tsx` secara acak mengubah huruf kapital/kecil pada sisa kata yang belum diketik untuk merusak konsentrasi lawan.
- [ ] **Implementasi Efek Debuff `MIRROR`**:
  - [ ] Ketika status `MIRROR` aktif, komponen `TypingArea.tsx` membalikkan urutan huruf pada kata saat ini (misal: `berkelahi` menjadi `ihalekreb`).
- [ ] **Implementasi Efek Debuff `SMOKE`**:
  - [ ] Ketika status `SMOKE` aktif, `FightingRenderer.ts` menggambar awan asap abu-abu tebal yang menutupi bagian tengah/bawah canvas serta menutupi sebagian teks di `TypingArea.tsx`.
- [ ] **Implementasi Efek Debuff `LIGHTNING` & `FREEZE`**:
  - [ ] `LIGHTNING`: Memicu `ScreenShake.shake(18, 600)` dan kilatan putih menyilaukan pada latar canvas.
  - [ ] `FREEZE`: Mengunci event listener keyboard di `TypingArea.tsx` selama 1.5 detik, disertai lapisan es kebiruan (*ice overlay*) di sekeliling area input.

#### 6.3 Mesin Eliminasi Battle Royale & Mode Penonton (`Belum Diimplementasikan`)
- [ ] **Elimination Engine (`apps/server/src/modules/match/elimination.engine.ts`)**:
  - [ ] Aktif khusus saat `gameMode === 'battle_royale'`.
  - [ ] Menjalankan pengecekan berkala setiap interval 15 detik selama status room `IN_PROGRESS`.
  - [ ] Memfilter pemain yang masih berstatus `ACTIVE`, membandingkan nilai Net WPM mereka, dan mengubah pemain dengan nilai terendah menjadi status `ELIMINATED`.
  - [ ] Memancarkan paket pemberitahuan eliminasi ke seluruh pemain di room.
- [ ] **Mode Penonton (`apps/web/src/components/hud/SpectatorHUD.tsx`)**:
  - [ ] Saat pemain tereliminasi, UI bertransisi secara mulus dari `TypingArea.tsx` menuju `SpectatorHUD.tsx`.
  - [ ] Menampilkan daftar pemain yang tersisa dan memungkinkan penonton untuk memantau duel antara pemain yang masih bertahan di atas Canvas.

---

### 🛠️ Sprint 6 (Milestone 6): Polish, Sound Effects, Performance Tuning & Docker (`Sebagian Selesai - 2 / 12`)

#### 7.1 Quality Control & Automasi Hook (`Root Monorepo` - Selesai)
- [x] Pemasangan dan konfigurasi linter Rust **Oxlint** (`oxlint .`) dengan waktu eksekusi $< 15\text{ms}$ di root monorepo.
- [x] Pemasangan dan konfigurasi **Husky & lint-staged** di `.husky/pre-commit` yang mengeksekusi linter pada file terstaged sekaligus memvalidasi kompilasi statis monorepo (`bun run build`) sebelum commit diizinkan.

#### 7.2 Sistem Audio Terintegrasi (`apps/web/src/audio/` - Belum Diimplementasikan)
- [ ] **Audio Manager Module (`AudioManager.ts`)**:
  - [ ] Menggunakan Web Audio API atau preloaded `HTMLAudioElement` pool untuk menghindari jeda pemutaran audio (*zero latency playback*).
- [ ] **Background Music (BGM)**:
  - [ ] Memutar BGM Lobi (irama tenang bernuansa chip/synth) saat berada di `view === 'LOBBY'`.
  - [ ] Memutar BGM Pertarungan 8-bit ala Terraria yang bersemangat saat `view === 'ARENA'` dan permainan dimulai.
- [ ] **Sound Effects (SFX) Presisi**:
  - [ ] SFX ketikan karakter benar (`keystroke.mp3` / `click.wav`) yang diputar di setiap penekanan tombol.
  - [ ] SFX kesalahan ketik (`error_buzz.mp3`) saat huruf yang ditekan tidak sesuai.
  - [ ] SFX tebasan pedang (`sword_slash.mp3`) saat combo diluncurkan.
  - [ ] SFX aktivasi skill (`skill_cast.mp3`) dan ledakan bentrokan senjata di Canvas.

#### 7.3 Tuning Performa & Memory Leak Prevention (`Belum Diimplementasikan`)
- [ ] **Audit Performa Canvas 2D**:
  - [ ] Memastikan `CanvasController.ts` membersihkan (*dispose*) event listener dan membatalkan `requestAnimationFrame` secara sempurna saat komponen unmount untuk mencegah *memory leak*.
  - [ ] Mengoptimalkan *offscreen rendering* untuk sprite pohon/rumput latar belakang agar FPS tetap stabil di atas $60\text{ FPS}$ pada perangkat browser rendah.
- [ ] **Audit WebSocket Server Pool**:
  - [ ] Memastikan `ClientPool` dan loop interval `setInterval` di `match.loop.ts` dimatikan secara otomatis saat room kosong atau permainan selesai.

#### 7.4 Kontainerisasi & Siap Deploy (`Belum Diimplementasikan`)
- [ ] **Multi-stage `Dockerfile` di Root Monorepo**:
  - [ ] **Stage 1 (Builder)**: Menggunakan `oven/bun:latest` untuk meng-clone monorepo, menjalankan `bun install --frozen-lockfile`, `bun run build:packages`, dan `bun run --filter '@fightype/web' build` (menghasilkan bundel statis Vite di `apps/web/dist`).
  - [ ] **Stage 2 (Production Server)**: Mengemas `apps/server` dalam image Bun ultra-ringan, menyalin hasil build statis frontend `apps/web/dist` untuk disajikan langsung melalui plugin `@fastify/static` atau reverse proxy.
- [ ] **`docker-compose.yml` (`Belum Diimplementasikan`)**:
  - [ ] Mengonfigurasi layanan kontainer `server` (berjalan di port `:3000`) dan kontainer `db` (PostgreSQL 15+ dengan volume persisten untuk Drizzle ORM).
- [ ] **Verifikasi Lingkungan Produksi**:
  - [ ] Menyusun berkas `.env.example` untuk produksi (`DATABASE_URL`, `PORT`, `CORS_ORIGIN`) dan memverifikasi kelancaran alur permainan 1v1 dari dalam kontainer Docker.

---

## 3. Kesimpulan & Arah Eksekusi Langsung (`Next Immediate Target`)

Berdasarkan pelacakan ekstensif di atas, **seluruh fondasi domain (`packages/*`), arsitektur REST Lobi (`@fightype/server`), UI/UX Canvas Lobi & Arena (`@fightype/web`), serta otomatisasi kualitas lint/build (`husky`) telah selesai 100% dan terverifikasi**.

Langkah kita selanjutnya tanpa putus adalah menyelesaikan **Sprint 3 (Realtime WebSocket Match Loop)** agar seluruh UI dan Engine yang sudah jadi ini dapat saling berbicara secara *real-time*:
1. Mendaftarkan plugin `@fastify/websocket` dan membuat `apps/server/src/routes/ws/index.ts`.
2. Membangun `ClientPool` (`apps/server/src/ws/client.pool.ts`) dan Dispatcher (`apps/server/src/ws/ws.handler.ts`).
3. Menyalakan Broadcaster 20Hz (`apps/server/src/ws/match.loop.ts`).
4. Menghubungkan `useBattleSocket` di `ArenaPage.tsx` pada frontend.
