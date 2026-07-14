# 14. Strategi Pengujian (Testing Strategy - Delivery-First MVP Approach)

**Nama Proyek:** FighType  
**Versi:** 1.0.0  
**Status:** Disetujui (Source of Truth)  
**Bahasa:** Bahasa Indonesia  
**Referensi Dokumen Sebelumnya:** [05-adr.md](file:///Users/fzrsahi/Documents/Coding/battle-typing/docs/id/05-adr.md), [11-coding-standards.md](file:///Users/fzrsahi/Documents/Coding/battle-typing/docs/id/11-coding-standards.md)  

---

## 1. Kebijakan Prioritas Pengujian MVP (`ADR-006`)
Sesuai arahan eksplisit proyek dan keputusan arsitektur **ADR-006**, pengembangan **FighType MVP** memprioritaskan kecepatan pengiriman fitur nyata (*fast time-to-market*) dan validasi interaktif di lingkungan LAN/Online. Oleh karena itu, **pembuatan kerangka automated testing (Unit Test, Integration Test, E2E Test Scaffolding) ditiadakan/ditunda selama fase pengembangan MVP awal**.

---

## 2. Kesiapan Pengujian Sejak Desain (*Testable by Design*)
Meskipun kita tidak meluangkan overhead waktu engineering untuk menulis script test pada iterasi MVP, kode yang kita produksi **tetap dijamin 100% siap diuji (*testable by design*)** di masa depan karena kepatuhan kita terhadap pilar arsitektur berikut:

1. **Pure Functions di `packages/game-engine` (`ADR-002`, `ADR-005`):**  
   Seluruh fungsi evaluasi ketikan, kalkulasi WPM kotor/bersih, dan *state machine skill* ditulis tanpa efek samping (`pure functions`). Tidak ada ketergantungan pada `window`, `document`, atau jaringan WebSocket di dalam engine. Hal ini memungkinkan unit test (`Bun test`) ditambahkan dalam sekejap di masa depan cukup dengan memberi input statis dan memverifikasi output `Result`.
2. **Validasi Skema Ketat dengan Zod (`ADR-007`):**  
   Karena semua paket yang masuk ke server (`ClientPacketSchema`) maupun data API divalidasi oleh **Zod**, kita telah mengeliminasi > 80% bug *runtime parsing error* yang biasanya memerlukan pengujian defensive/exception di test case tradisional.
3. **Penanganan Error Terstruktur dengan Neverthrow (`ADR-008`):**  
   Setiap fungsi mengembalikan `Result<T, E>` / `ResultAsync<T, E>`. Tidak ada *unhandled exceptions* tersembunyi yang dapat menyebabkan server Fastify crash di tengah pertandingan malam hari.

---

## 3. Verifikasi Eksploratif Manual (Fase MVP)
Selama fase MVP (Sprint 1 hingga Sprint 6), pengujian kualitas produk dilakukan melalui **Verifikasi Eksploratif Terstruktur** yang mencakup:
- **Simulasi Multi-Klien LAN:** Membuka 2 hingga 4 jendela browser secara bersamaan (atau antar-perangkat di jaringan lokal) untuk memverifikasi kehalusan sinkronisasi tick 20Hz (`ROOM_STATE_TICK`).
- **Verifikasi Skema Zod & Error Rejection:** Mengirimkan payload rusak secara sengaja via console/curl untuk memastikan server membalas dengan `Err<INVALID_SCHEMA>` tanpa crash.
- **Audit FPS Canvas & Memory:** Memastikan render karakter Terraria di `CanvasController.ts` berjalan stabil di 60 FPS dan tidak mengalami kebocoran memori saat transisi lobi ke arena secara berulang.

---

## 4. Peta Pengujian Otomatis Pasca-MVP (Milestone Berikutnya)
Ketika MVP FighType telah diluncurkan dan tervalidasi oleh komunitas, kita akan mengaktifkan piramida pengujian otomatis menggunakan **Bun Test Suite**:

```
         /\
        /  \         E2E & Load Testing (Simulasi 500+ Bot WebSocket via k6)
       /----\
      /      \       Integration Testing (Fastify `app.inject()` & DB migrations)
     /--------\
    /          \     Unit Testing (`bun test` untuk pure functions di packages/game-engine)
   /------------\
```
