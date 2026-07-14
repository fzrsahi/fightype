# 05. Catatan Keputusan Arsitektur (Architecture Decision Records - ADR)

**Nama Proyek:** FighType  
**Versi:** 1.0.0  
**Status:** Disetujui (Source of Truth)  
**Bahasa:** Bahasa Indonesia  
**Referensi Dokumen Sebelumnya:** [01-vision.md](file:///Users/fzrsahi/Documents/Coding/battle-typing/docs/01-vision.md), [04-tdd.md](file:///Users/fzrsahi/Documents/Coding/battle-typing/docs/04-tdd.md)  

---

## ADR-001: Penggunaan Runtime Bun sebagai Standar Eksekusi Monorepo
- **Status:** Disetujui (*Accepted*)
- **Konteks:**  
  Proyek membutuhkan runtime JavaScript/TypeScript berkinerja tinggi yang mendukung eksekusi cepat pada lapisan server (`apps/server`) serta manajemen paket monorepo yang mulus tanpa overhead konfigurasi yang rumit.
- **Keputusan:**  
  Mengadopsi **Bun** sebagai runtime utama untuk server, eksekutor script, dan *package/workspace manager* untuk seluruh monorepo FighType.
- **Konsekuensi Positif:**
  - Startup server instan dan konsumsi memori lebih rendah dibanding Node.js standar.
  - Eksekusi file `.ts` secara native tanpa memerlukan langkah *pre-build* tsc saat pengembangan.
  - Resolusi workspace (`bun workspaces`) ultra-cepat untuk paket internal (`packages/shared`, `packages/game-engine`).
- **Konsekuensi Negatif / Mitigasi:**
  - Beberapa package Node.js lawas mungkin memiliki ketidakcocokan minor API internal. *Mitigasi:* Kita menggunakan package berkinerja modern (`Fastify`, `Drizzle ORM`) yang telah teruji kompatibilitas penuhya dengan Bun.

---

## ADR-002: Arsitektur Monorepo dengan Pemisahan Paket Domain
- **Status:** Disetujui (*Accepted*)
- **Konteks:**  
  Karena klien (`apps/web`) dan server (`apps/server`) sama-sama ditulis dalam TypeScript dan perlu berbagi definisi tipe, skema paket WebSocket, serta kalkulasi akurasi/WPM, pemisahan repository terpisah akan menimbulkan risiko duplikasi kode dan *drift bug*.
- **Keputusan:**  
  Menggunakan arsitektur **Monorepo** berbasis Bun workspaces dengan pembagian direktori:
  - `packages/shared`: Menyimpan skema protokol payload, tipe data universal, enums, dan konstanta aturan game.
  - `packages/game-engine`: Menyimpan *pure functions* (`TypingEngine`, `SkillEngine`, kalkulator WPM) yang dijalankan baik oleh klien maupun server.
  - `apps/server`: Backend HTTP & WebSocket server.
  - `apps/web`: Frontend React & Presentation Engine.
- **Konsekuensi Positif:**
  - *End-to-end type safety:* Perubahan struktur paket di `packages/shared` langsung terdeteksi di klien dan server saat compile-time.
  - Kode logika mengetik tidak perlu ditulis dua kali.

---

## ADR-003: Fastify + Native WebSocket untuk Server-Authoritative Realtime Engine
- **Status:** Disetujui (*Accepted*)
- **Konteks:**  
  Game mengetik multiplayer kompetitif membutuhkan latensi komunikasi yang sangat rendah dan kepastian bahwa state room dihitung di server (*Server-Authoritative*) untuk mencegah kecurangan.
- **Keputusan:**  
  Menggunakan **Fastify** bersama **@fastify/websocket (Native WebSocket / `bun:http` adapters)** untuk komunikasi dua arah real-time, menggantikan polling HTTP standar atau library wrapper berat.
- **Konsekuensi Positif:**
  - Latensi transmisi data minimal dan overhead protokol kecil (cocok untuk tick 20Hz).
  - Skalabilitas tinggi untuk menangani banyak room serentak dalam satu instance.

---

## ADR-004: PostgreSQL + Drizzle ORM untuk Persistensi Relasional
- **Status:** Disetujui (*Accepted*)
- **Konteks:**  
  Kita perlu mencatat riwayat room MVP, konfigurasi match, serta mempersiapkan skema untuk fitur masa depan (pengguna, leaderboard, turnamen) tanpa mengorbankan performa atau type-safety.
- **Keputusan:**  
  Menggunakan database relasional **PostgreSQL** yang dikendalikan melalui **Drizzle ORM**.
- **Konsekuensi Positif:**
  - *Strict TypeScript Schema:* Skema database ditulis langsung dalam TypeScript dan sinkron dengan definisi domain.
  - Query SQL efisien, cepat, dan transparan tanpa *black-box overhead* dari ORM tradisional.

---

## ADR-005: Decoupled Presentation Engine (Pemisahan Logika Mengetik dan Render Visual)
- **Status:** Disetujui (*Accepted*)
- **Konteks:**  
  Game memiliki berbagai tema visual (`Fighting` ala Terraria, `Racing`, dan tema di masa depan). Jika logika pengetikan dicampur dengan logika rendering atau DOM/Canvas, penambahan tema baru akan merusak atau memperlambat mesin pengetikan.
- **Keputusan:**  
  Menerapkan **Decoupled Engine Architecture**. `TypingEngine` dan `SkillEngine` beroperasi murni pada struktur data abstrak. Saat state berubah, mereka memancarkan *Domain Events* (`ATTACK`, `DAMAGE`, `MISS`, `BOOST`). `Presentation Engine` mendengarkan event tersebut dan merender animasi pixel art secara independen.
- **Konsekuensi Positif:**
  - Tema baru dapat ditambahkan kapan saja hanya dengan membuat *renderer plugin* baru tanpa menyentuh satu baris pun kode logika pengetikan.
  - Performa pengetikan dijamin tetap lancar di 60+ FPS.

---

## ADR-006: Delivery-First MVP Strategy (Penundaan Scaffolding Test pada MVP)
- **Status:** Disetujui (*Accepted*)
- **Konteks:**  
  Sesuai arahan dan keputusan strategis proyek (*"MVP dulu jangan dulu buat test"*), tim perlu memprioritaskan penyampaian produk fungsional MVP (*fast time-to-market*) untuk validasi gameplay LAN/Online di awal.
- **Keputusan:**  
  Menunda pembuatan automated test (`Bun test`, E2E test scripts) pada fase MVP awal. Seluruh waktu engineering difokuskan pada implementasi fitur arsitektur, komunikasi WebSocket real-time, sinkronisasi state room, dan render visual.
- **Konsekuensi & Mitigasi:**
  - *Konsekuensi:* Pengujian dilakukan secara manual/eksploratif selama pengembangan MVP.
  - *Mitigasi:* Karena ADR-002 dan ADR-005 mewajibkan logika inti ditulis dalam `packages/game-engine` sebagai **pure functions (determinis & bebas side-effect)**, sistem tetap *100% testable by design*. Ketika MVP selesai dan memasuki milestone berikutnya, unit test dapat ditambahkan dengan mudah tanpa perlu merefaktor ulang arsitektur.

---

## ADR-007: Validasi Skema & Tipe Data Universal Menggunakan Zod
- **Status:** Disetujui (*Accepted*)
- **Konteks:**  
  Dalam arsitektur monorepo Fastify + Native WebSocket yang menerima input real-time dari klien, kita memerlukan mekanisme validasi payload jaringan yang ketat, cepat, dan secara otomatis menghasilkan inferensi tipe TypeScript (`z.infer<typeof schema>`).
- **Keputusan:**  
  Mengadopsi **Zod** sebagai *single source of truth* untuk seluruh skema validasi di `packages/shared`. Skema Zod digunakan untuk memvalidasi:
  - Payload masuk WebSocket (`TYPING_INPUT`, `ROOM_JOIN`, `READY`).
  - Request body & query params REST API di Fastify.
  - Skema konfigurasi room dan variabel lingkungan (`env`).
- **Konsekuensi Positif:**
  - Mencegah *runtime crash* akibat malformed payload atau upaya manipulasi data oleh klien.
  - Tipe TypeScript di-generate langsung dari skema Zod tanpa perlu duplikasi interface/type manual.

---

## ADR-008: Functional Error Handling Menggunakan Neverthrow (`Result<T, E>`)
- **Status:** Disetujui (*Accepted*)
- **Konteks:**  
  Penggunaan `try / catch` konvensional di TypeScript sering menyebabkan *unhandled exceptions*, alur eksekusi yang sulit dilacak (*hidden control flow*), serta ketidakjelasan mengenai tipe error apa yang mungkin dikembalikan oleh sebuah fungsi.
- **Keputusan:**  
  Mengadopsi **neverthrow** (`Result<T, E>` dan `ResultAsync<T, E>`) sebagai standar penanganan error di seluruh lapisan logika bisnis, *game engine*, *room manager*, dan panggilan database.
- **Konsekuensi Positif:**
  - *Zero Unhandled Exceptions:* Fungsi yang dapat gagal secara eksplisit mendeklarasikan tipe error-nya dalam *return type* (`Result<SuccessData, DomainError>`).
  - Pemanggilan fungsi dipaksa oleh kompiler TypeScript untuk memeriksa hasil `result.isOk()` atau `result.isErr()` sebelum mengakses data.
  - Alur logika pengetikan real-time (`TypingEngine`) menjadi sangat deterministik dan aman.

---

## ADR-009: Desentralisasi Error Handling, English Application Messages & Zero Hardcoding
- **Status:** Disetujui (*Accepted*)
- **Konteks:**  
  Pemeriksaan error secara terpusat dan kondisional manual (`if (error.type === 'ROOM_NOT_FOUND')`) menciptakan ketergantungan erat (*tight coupling*) di handler rute, membuat kode sulit dipelihara, dan rentan terhadap *magic strings/numbers*. Selain itu, pesan aplikasi (`error messages`, `WebSocket notification texts`, `response messages`) yang dicampur bahasa atau di-hardcode di dalam logika bisnis menyulitkan standarisasi global.
- **Keputusan:**  
  1. **Desentralisasi Error Handling:** Mengadopsi arsitektur *Decentralized Error Classes / Domain Error Handlers*. Setiap tipe error domain mewarisi kelas dasar `DomainError` yang secara mandiri merapsulasi `statusCode` HTTP, `errorCode` unik dari konstanta terpusat, dan *English message* yang diformat. Handler Fastify hanya memanggil `error.toResponse()` atau delegator desentralisasi tanpa melakukan pencocokan string (`error.type === ...`).
  2. **English Application Messages:** Seluruh pesan aplikasi yang dikirimkan ke klien (HTTP response `message`, WebSocket notification `text`, UI error alerts) **wajib ditulis dalam Bahasa Inggris (*English Only*)**.
  3. **Zero Hardcoding (Centralized Constants):** Dilarang keras menuliskan *magic string* (`'ROOM_NOT_FOUND'`), *magic status code* (`404`), atau batas angka (`10`, `60`) secara langsung (*hardcoded*) di dalam service, handler, atau engine. Seluruh konstanta wajib dideklarasikan dan diimpor dari file konstanta terpusat di `packages/shared/src/constants/`.
- **Konsekuensi Positif:**
  - Route handler dan WebSocket dispatcher menjadi sangat ringkas, bersih, dan agnostik terhadap rincian error internal.
  - Perubahan teks pesan atau kode status hanya perlu dilakukan di satu tempat di dalam konstanta `packages/shared`.
  - Aplikasi siap untuk kolaborasi global dan integrasi antarmuka internasional sejak awal.

---

## ADR-010: Adopsi TypeScript `v7.0.2` dengan Konfigurasi Khusus Framework (*Framework-Tailored tsconfig*)
- **Status:** Disetujui (*Accepted*)
- **Konteks:**  
  Satu konfigurasi `tsconfig.json` monolitik untuk seluruh monorepo dapat melanggar konvensi framework (*fighting the framework*), di mana Fastify (backend Bun) dan React + Vite (frontend bundler) memiliki kebutuhan `moduleResolution`, `jsx`, dan `target` yang berbeda.
- **Keputusan:**  
  Mengadopsi **TypeScript versi `7.0.2`** (`"typescript": "^7.0.2"`) secara seragam pada monorepo root, dengan `tsconfig.json` yang disesuaikan secara presisi dengan kebutuhan masing-masing framework:
  1. **Root (`tsconfig.json`):** Berisi aturan strict universal (`strict: true`, `noUncheckedIndexedAccess: true`, `verbatimModuleSyntax: true`).
  2. **`apps/server/tsconfig.json` (Fastify + Bun):** Menggunakan `target: "ESNext"`, `module: "ESNext"`, `moduleResolution: "bundler"`, dan mendukung native Bun types (`@types/bun`).
  3. **`apps/web/tsconfig.json` (React + Vite):** Menggunakan `jsx: "react-jsx"`, `moduleResolution: "bundler"`, `target: "ES2022"`, serta DOM type definitions (`lib: ["ES2022", "DOM", "DOM.Iterable"]`).
  4. **`packages/shared` & `packages/game-engine`:** Dikonfigurasi dengan `composite: true` dan `declaration: true` agar referensi antar-workspace Bun berjalan instan tanpa overhead kompilasi ulang.
- **Konsekuensi Positif:**
  - Memanfaatkan seluruh fitur pengetikan modern dari TypeScript 7.0.2 tanpa konflik modul antar-lingkungan (Node/Bun vs Browser/DOM).
  - Integrasi mulus dengan toolchain Vite, Fastify, dan linter Oxlint.

---

## ADR-011: Spesifikasi Runtime Node.js `v24` (`.nvmrc`) & Structured Logging dengan Pino (`Dev` vs `Prod`)
- **Status:** Disetujui (*Accepted*)
- **Konteks:**  
  Konsistensi versi runtime sangat penting saat bekerja dalam tim atau CI/CD, dan aplikasi membutuhkan penanganan log yang cepat tanpa overhead di production namun tetap mudah dibaca (*human-readable*) di development.
- **Keputusan:**  
  1. **Runtime Target:** Menggunakan spesifikasi **Node.js `v24`** (`.nvmrc`) sebagai standar ekspektasi eksekusi lingkungan berbarengan dengan package manager **Bun**. `package.json` secara eksplisit mencantumkan `"engines": { "node": ">=24.0.0", "bun": ">=1.2.0" }`.
  2. **Structured Logging (`Pino`):** Semua log server/backend wajib menggunakan library `pino` (`apps/server/src/logger/index.ts`).
  3. **Pemisahan Mode Logging (`Dev vs Production`):**
     - **Development (`NODE_ENV !== 'production'`):** Menggunakan `pino-pretty` transport dengan warna, stempel waktu yang mudah dibaca (`translateTime`), serta menyembunyikan field sistem teknis (`ignore: 'pid,hostname'`). Level default `debug`.
     - **Production (`NODE_ENV === 'production'`):** Menonaktifkan transport pretty (`transport: undefined`) dan menghasilkan keluaran JSON murni yang ultra-cepat untuk dianalisis oleh tool agregator log (Elasticsearch, Datadog, CloudWatch). Level default `info`.
- **Konsekuensi Positif:**
  - Diagnostik lokal sangat nyaman bagi developer karena log berwarna dan terstruktur rapi.
  - Performa production maksimal dengan asinkronus JSON logging tanpa bottleneck formatting.

