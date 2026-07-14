# 02. Dokumen Persyaratan Produk (Product Requirement Document - PRD)

**Nama Proyek:** FighType  
**Versi:** 1.0.0  
**Status:** Disetujui (Source of Truth)  
**Bahasa:** Bahasa Indonesia  
**Referensi Dokumen Sebelumnya:** [01-vision.md](file:///Users/fzrsahi/Documents/Coding/battle-typing/docs/01-vision.md)  

---

## 1. Ringkasan & Scope MVP
Dokumen ini mendefinisikan persyaratan fungsional dan batasan scope untuk Minimum Viable Product (MVP) dari **FighType**. Sesuai arahan, MVP berfokus murni pada pengalaman **LAN / Online Room-Based Multiplayer** dengan arsitektur yang solid, interaktif, dan mulus.

### 1.1 In-Scope (Lingkup MVP)
- **Room System Terdesentralisasi (Code/Link Based):** Pembuatan, pengaturan, dan penggabungan room tanpa memerlukan akun.
- **5 Mode Permainan:** `1v1`, `Free For All`, `Battle Royale`, `Team Battle (2v2, 5v5)`.
- **Match Settings Konfigurabel:** Owner room memiliki kontrol penuh atas aturan pertandingan.
- **2 Tema Presentasi Otomatis:** `Fighting` (Kombat Pixel Art) dan `Racing` (Balapan Kendaraan Pixel).
- **Automated Skill System:** Skill interaktif yang dipicu otomatis dari akurasi dan combo.
- **Server-Authoritative Realtime Gameplay:** Validasi penuh di server Fastify + Native WebSocket untuk menjamin keadilan.

### 1.2 Out-of-Scope (Ditunda ke Milestone Berikutnya)
- Sistem Autentikasi / Login / Manajemen Profil Pengguna.
- Global Matchmaking / Antrean otomatis berdasarkan MMR.
- Global Leaderboard / Ranking / Season Pass / Achievement.
- Monetisasi / Skin Marketplace / Battle Pass.
- Anti-Cheat tingkat kernel/klien berat (karena server sudah authoritative).
- AI Bots dan Boss Fight Solo.

---

## 2. Mode Permainan (Game Modes)
Owner room dapat memilih salah satu dari mode berikut di dalam lobi:

| Mode | Minimum Pemain | Maksimum Pemain | Deskripsi Singkat | Aturan Kemenangan |
| :--- | :--- | :--- | :--- | :--- |
| **1v1** | 2 | 2 | Duel klasik satu lawan satu dengan HP atau garis waktu/kata. | Pemain pertama menyelesaikan target atau mengurangi HP lawan ke 0. |
| **Free For All (FFA)** | 3 | 10 | Pertempuran terbuka tanpa tim. Semua pemain saling bersaing. | Pemain dengan WPM efektif tertinggi / selesai tercepat / bertahan terakhir. |
| **Battle Royale** | 4 | 20+ | Eliminasi bertahap pada interval waktu tertentu berdasarkan threshold performa. | Pemenang adalah **satu-satunya pemain terakhir yang bertahan** (*Last Man Standing*). |
| **Team Battle (2v2)**| 4 | 4 | 2 tim beranggotakan masing-masing 2 pemain bekerja sama. | Akumulasi progres/skor tim tertinggi atau eliminasi tim lawan. |
| **Team Battle (5v5)**| 10 | 10 | Pertempuran skala besar antar-tim 5 lawan 5. | Akumulasi progres tim tercepat / eliminasi seluruh anggota tim lawan. |

---

## 3. Sistem Room (Room Lifecycle & Management)
Setiap sesi permainan diatur di dalam **Room virtual** yang dikelola di dalam memori server (dan dicatat di database untuk riwayat sesi).

### 3.1 Alur Pengguna di dalam Room
1. **Create Room:** Pemain (Host/Owner) menekan tombol "Create Room" dan langsung dialihkan ke lobi room dengan kode unik (misal: `FT-9823`).
2. **Share Room Code / Link:** Host membagikan kode room atau URL langsung kepada teman/peserta.
3. **Join Room:** Pemain lain memasukkan kode atau membuka tautan dan memasukkan Nickname sementara.
4. **Ready State:** Seluruh pemain (kecuali Host) menekan tombol "Ready" setelah puas dengan konfigurasi match.
5. **Start Match:** Host menekan tombol "Start" setelah seluruh peserta Ready (menimbulkan countdown 3-2-1).
6. **Spectate Mode:** Pemain yang baru bergabung saat match berlangsung, atau pemain yang tereliminasi di Battle Royale, beralih ke mode penonton (*Spectator*) dan dapat melihat status seluruh pemain secara langsung.
7. **Leave Room:** Pemain dapat keluar dari room kapan saja. Jika Host keluar sebelum match dimulai, kepemilikan room dialihkan secara otomatis ke pemain berikutnya (*Host Migration*).

---

## 4. Matriks Konfigurasi Pertandingan (Match Settings Matrix)
Host room memiliki otoritas penuh untuk mengubah parameter pertandingan di lobi:

| Parameter | Pilihan / Nilai yang Tersedia | Default | Keterangan |
| :--- | :--- | :--- | :--- |
| **Time Limit** | 15s, 30s, 60s, 120s, Custom | 60s | Digunakan jika mode kemenangan berbasis waktu. |
| **Word Source** | Standard Dictionary, Code/Syntax (JS/TS/Rust), Quotes, Custom Words | Standard Dictionary | Sumber teks yang akan diketik oleh peserta. |
| **Difficulty** | Easy (huruf kecil), Normal (+koma/titik), Hard (+angka & simbol sulit) | Normal | Menentukan kompleksitas daftar kata yang di-generate. |
| **Language** | Bahasa Indonesia, English, Spanish, Japanese (Romaji) | Bahasa Indonesia | Bahasa dari kamus kata yang digunakan. |
| **Win Condition**| Time-based (WPM tertinggi di akhir waktu), Word-based (Selesai N kata tercepat), Survival (HP habis / tereliminasi) | Word-based (50 Kata) | Kriteria penentuan pemenang akhir. |
| **Theme** | Fighting (Terraria Combat), Racing (Pixel Vehicles) | Fighting | Tema presentasi visual yang akan dirender di klien. |
| **Skill System** | Enabled / Disabled | Enabled | Mengaktifkan/menonaktifkan efek debuff antar-pemain. |
| **Battle Royale Rule**| Interval Eliminasi: 10s, 15s, 20s. Kriteria: WPM Terendah / Akurasi < 85% | Interval 15s (WPM Terendah) | Menentukan seberapa cepat pemain tereliminasi di mode Battle Royale. |

---

## 5. Kriteria Penerimaan Produk (Acceptance Criteria - MVP)
- **Latensi Sinkronisasi:** Update progres mengetik antar-klien di dalam room harus terasa instan (target latensi WebSocket di bawah 50ms pada jaringan LAN / koneksi stabil).
- **Keamanan & Anti-Manipulasi:** Klien tidak dapat mengirimkan "Saya sudah selesai 50 kata dalam 1 detik" tanpa pengiriman validasi keystroke/kalkulasi server-authoritative.
- **Stabilitas Mode Spectator:** Penonton yang melihat pertandingan tidak menyebabkan penurunan FPS atau lag pada pemain yang sedang bertarung.
- **Responsivitas UI Terraria:** Tema harus berjalan mulus pada 60 FPS pada browser desktop modern tanpa memory leak.
