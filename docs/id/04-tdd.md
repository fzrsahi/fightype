# 04. Dokumen Desain Teknis (Technical Design Document - TDD)

**Nama Proyek:** FighType  
**Versi:** 1.0.0  
**Status:** Disetujui (Source of Truth)  
**Bahasa:** Bahasa Indonesia  
**Referensi Dokumen Sebelumnya:** [01-vision.md](file:///Users/fzrsahi/Documents/Coding/battle-typing/docs/01-vision.md), [02-prd.md](file:///Users/fzrsahi/Documents/Coding/battle-typing/docs/02-prd.md), [03-gdd.md](file:///Users/fzrsahi/Documents/Coding/battle-typing/docs/03-gdd.md)  

---

## 1. Arsitektur Sistem Tingkat Tinggi (High-Level Architecture)
**FighType** dirancang sebagai sistem **Server-Authoritative Realtime Game Engine** dengan arsitektur **Monorepo** berbasis **Bun** dan **TypeScript murni**.

```
+-----------------------------------------------------------------------------------+
|                                  MONOREPO WORKSPACE                               |
|                                                                                   |
|  +-------------------------------------+   +-----------------------------------+  |
|  |             apps/web                |   |            apps/server            |  |
|  |     (React + UI Design System)      |   |  (Fastify + Native WebSocket)     |  |
|  |                                     |   |                                   |  |
|  |  +-------------------------------+  |   |  +-----------------------------+  |  |
|  |  | Presentation & Theme Engine   |  |   |  | RoomManager & Match Loop    |  |  |
|  |  | (Terraria Pixel Art Renderer) |  |   |  | (20Hz State Broadcast)      |  |  |
|  |  +-------------------------------+  |   |  +-----------------------------+  |  |
|  |                  |                  |   |                 |                 |  |
|  +------------------|------------------+   +-----------------|-----------------+  |
|                     |                                        |                    |
|                     |              WebSocket (`/ws`)         |                    |
|                     +----------------------------------------+                    |
|                                        |                                          |
|  +-------------------------------------v---------------------------------------+  |
|  |                              packages/shared                                |  |
|  |          (Protokol Payload, Types, Validators, Constants, Enums)            |  |
|  +-----------------------------------------------------------------------------+  |
|  |                            packages/game-engine                             |  |
|  |     (Pure Functions: TypingEngine, SkillEngine, WPM Calculator, Combos)     |  |
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

## 2. Arsitektur Server-Authoritative & Client Prediction
Untuk mencegah manipulasi skor/cheat dan menjamin keadilan dalam kompetisi multiplayer, **Server adalah satu-satunya pemilik kebenaran (*Single Source of Truth / Server Authoritative*)**.

### 2.1 Alur Validasi Input & Sinkronisasi
1. **Client Prediction (Zero-Latency Local Feedback):**  
   Saat pemain menekan tombol keyboard, `TypingEngine` di klien langsung memvalidasi karakter secara lokal untuk memberikan *visual highlight* instan (hijau/merah) dan memutar *sound effect* bentrokan. Ini memastikan antarmuka terasa **sepenuhnya real-time tanpa jeda latensi jaringan (*zero perceived latency*)**.
2. **Input Transmission:**  
   Klien mengirimkan paket `TYPING_INPUT` ringan (mengandung indeks karakter, *keystroke timestamp*, dan *delta count*) melalui **Native WebSocket** ke server.
3. **Server Authoritative Validation:**  
   Server memproses `TYPING_INPUT` menggunakan *pure functions* yang sama dari `packages/game-engine`. Server memverifikasi keabsahan input terhadap kamus kata aktif dan menghitung ulang **Gross WPM, Net WPM, Akurasi, Combo, HP Lawan, dan Evaluasi Skill**.
4. **State Broadcast (20Hz Tick / Event-Driven):**  
   Server mem-broadcast status pertandingan terkini (`ROOM_STATE_TICK` pada frekuensi 20Hz atau event konfirmasi instan `SKILL_TRIGGERED`) kepada seluruh pemain di dalam room.
5. **Client Reconciliation:**  
   Saat klien menerima `ROOM_STATE_TICK`, klien melakukan rekonsiliasi (*reconciliation*) atas posisi lawan, HP, dan status debuff tanpa mengganggu input ketikan lokal yang sedang berjalan.

---

## 3. Pemisahan Subsistem secara Ketat (Separation of Concerns)
Sesuai dengan **Design Principles**, modul-modul dalam sistem saling terisolasi dengan *coupling* minimal dan *cohesion* tinggi:

| Subsistem / Modul | Peran & Tanggung Jawab Utama | Ketergantungan (Dependencies) |
| :--- | :--- | :--- |
| **Typing Engine** (`packages/game-engine`) | Logika murni deterministik untuk evaluasi karakter, pengecekan kata, kalkulasi WPM kotor/bersih, dan multiplier combo. | `packages/shared` (Types). Tidak tergantung pada React, DOM, atau WebSocket. |
| **Skill Engine** (`packages/game-engine`) | *State machine* yang mendeteksi pemicu skill (combo/akurasi) dan menghitung durasi serta efek debuff (*Confuse, Mirror, Smoke, Freeze*). | `packages/shared`. Tidak menyentuh UI atau render engine. |
| **Room & Game Logic** (`apps/server/src/domain`) | Mengelola *lifecycle* room (Create, Join, Ready, Start, Leave), siklus waktu match, aturan eliminasi Battle Royale, dan penentuan pemenang. | `packages/game-engine`, `packages/shared`. |
| **Networking** (`apps/server/src/net`) | Mengelola koneksi *Native WebSocket*, *pool connection*, serialisasi/deserialisasi paket JSON/Binary, *heartbeat/ping-pong*. | `packages/shared` (Protocol Schema). |
| **Persistence** (`apps/server/src/db`) | Lapisan asinkron untuk menyimpan riwayat sesi room, konfigurasi match, dan statistik akhir menggunakan **Drizzle ORM + PostgreSQL** (tanpa memblokir *real-time match loop*). | `packages/shared`. |
| **Presentation Engine** (`apps/web/src/presentation`) | Mengatur animasi 2D Pixel Art ala Terraria, sistem partikel (*juicy effects*), getaran layar (*screen shake*), dan pemutaran audio/BGM. | Hanya bereaksi terhadap *Domain Events* dari `Game Logic`. Tidak mengandung kalkulasi skor ketikan. |
| **Theme Engine** (`apps/web/src/themes`) | Arsitektur *pluggable renderer* yang memetakan event standar (`ATTACK`, `DAMAGE`, `MISS`, `BOOST`) menjadi visualisasi spesifik tema (`Fighting` atau `Racing`). | `Presentation Engine`. |
| **UI Engine** (`apps/web/src/ui`) | Komponen HUD minimalis berbasis React: indikator HP, WPM/Akurasi meter, notifikasi skill yang aktif, papan skor sementara, dan lobi room. | `packages/shared`. Terpisah dari *Canvas / Presentation Engine*. |

---

## 4. Pilihan Teknologi Core (Tech Stack Specification)
- **Runtime & Package Manager: Bun**  
  Bun dipilih karena kecepatan startup ultra-cepat, eksekusi TypeScript native tanpa langkah *transpile* berat, build tooling bawaan, dan *package manager* berkinerja tinggi.
- **Backend HTTP & Router: Fastify**  
  Fastify memberikan throughput HTTP/REST tinggi dengan overhead rendah untuk pembuatan room dan *health check API*.
- **Realtime Layer: Bun Native WebSocket (`bun:http` / `@fastify/websocket`)**  
  Memanfaatkan implementasi WebSocket native berkinerja tinggi untuk menangani ribuan pesan tick per detik dengan konsumsi memori minimal.
- **Database & ORM: PostgreSQL + Drizzle ORM**  
  Drizzle ORM memberikan *strict type-safety* langsung dari skema TypeScript ke query SQL dengan performa nyaris *raw SQL* dan migrasi skema yang bersih.
- **Frontend Framework: React + TypeScript**  
  Mengelola state UI modern, routing lobi, dan rendering komponen HUD interaktif dengan Vanilla CSS / CSS Modules / Tailwind untuk styling responsif.

---

## 5. Strategi Eksekusi & Prioritas MVP (*Delivery-First Approach*)
Sesuai arahan pengguna: **"MVP dulu jangan dulu buat test" (*Delivery-First approach without initial test scaffolding overhead*)**.
- **Fokus Prioritas:** Seluruh upaya engineering pada fase awal difokuskan 100% pada **pembangunan arsitektur modular yang berfungsi nyata**, integrasi komunikasi WebSocket real-time, sinkronisasi state server-authoritative, serta kehalusan presentasi visual Terraria.
- **Isolasi Logika Murni:** Meskipun penulisan automated test (*Unit/Integration/E2E test*) diprioritaskan di fase pasca-MVP, seluruh kode *engine* (`packages/game-engine`) tetap ditulis sebagai **pure functions** (tanpa side-effect/tanpa ketergantungan jaringan). Hal ini menjamin bahwa sistem 100% siap untuk diuji (*testable by design*) kapan pun fase testing diaktifkan di masa depan.
