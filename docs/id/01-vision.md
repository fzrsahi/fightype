# 01. Dokumen Visi (Vision Document)

**Nama Proyek:** FighType  
**Versi:** 1.0.0  
**Status:** Disetujui (Source of Truth)  
**Bahasa:** Bahasa Indonesia  

---

## 1. Misi Utama
Membangun game mengetik multiplayer kompetitif berbasis web terbaik di dunia. **FighType** bukan sekadar klon *Monkeytype* atau aplikasi tes kecepatan mengetik biasa. *Monkeytype* berfokus pada latihan dan evaluasi mengetik pasif, sedangkan **FighType** berfokus penuh pada **pengalaman bermain game kompetitif online nyata** di mana kemampuan mengetik adalah satu-satunya penggerak aksi di dalam arena.

---

## 2. Filosofi Inti (Core Philosophy)
> **"Typing is the core mechanic. Gaming is the experience."**

1. **Sensasi Game Sejati:** Pemain harus merasa sedang bermain game multiplayer online seru dan kompetitif, bukan sedang mengisi form atau berlatih di situs edukasi.
2. **UI yang Menyatu (Immersive HUD):** Antarmuka mengetik melebur sepenuhnya ke dalam gameplay dan estetika pertarungan.
3. **Fokus pada Feedback Visual & Audio:** Animasi yang hidup (*juicy*), efek suara bentrokan, indikator combo, visualisasi skill, dan atmosfer kompetisi adalah pusat dari pengalaman pengguna.
4. **Satu Input Universal:** Mengetik (keyboard) adalah satu-satunya interaksi saat pertandingan berlangsung. Tanpa mouse, tanpa tombol manual yang mendistraksi fokus pemain.

---

## 3. Target Pengguna
- **Gamers & Kompetitor:** Pemain yang menyukai game PvP (*Player vs Player*), pertarungan, dan balapan cepat dengan mekanik berbasis skill (*skill-based gameplay*).
- **Programmer & Software Engineers:** Profesional dan developer yang ingin memamerkan kecepatan dan akurasi mengetik dalam duel yang intens dan seru.
- **Pelajar & Mahasiswa:** Generasi muda yang ingin meningkatkan kecepatan mengetik (*WPM*) secara alami melalui kompetisi antarteman.
- **Komunitas & Turnamen:** Grup Discord, sekolah, komunitas tech, atau kreator konten yang ingin mengadakan turnamen mengetik interaktif (*room-based/spectator friendly*).

---

## 4. Platform & Aksesibilitas
- **Web-Only (Browser Modern):** Akses instan tanpa instalasi rumit, kompatibel penuh dengan browser desktop (Chrome, Firefox, Safari, Edge) dan mobile browser (dengan external/virtual keyboard).
- **Desain Responsif:** Layout layar beradaptasi secara dinamis terhadap berbagai ukuran resolusi tanpa mengurangi keterbacaan teks yang diketik.
- **Progressive Web App (PWA):** Siap diinstal di desktop/mobile sebagai aplikasi mandiri di masa depan.

---

## 5. Arahan Estetika (Art Direction)
- **Inspirasi Utama: Terraria.**  
  Mengusung gaya **2D Pixel Art** yang kaya, berkarakter, dan dipadukan dengan efek-efek visual modern (*Modern Pixel Effects*).
- **Animasi Halus & Juicy Feedback:** Setiap ketikan tombol (*keystroke*) menghasilkan reaksi visual sesaat—partikel melompat, angka damage/boost muncul (*floating text*), dan getaran ringan pada layar (*screen shake yang dapat dikonfigurasi*).
- **UI & HUD Minimalis:** Keterbacaan (*readability*) adalah prioritas. Teks yang harus diketik kontras dan jelas, sementara elemen HUD (waktu, skor, combo, HP/posisi) tersusun rapi tanpa menutupi area ketik.

---

## 6. Presentasi Visual vs. Gameplay Mekanis
Dalam **FighType**, **Tema (Theme)** tidak pernah merubah aturan dasar gameplay atau kalkulasi performa mengetik. Tema hanya bertugas sebagai **Lapisan Presentasi (Presentation Layer)** yang bereaksi otomatis terhadap statistik ketikan pemain:

1. **Tema Pertarungan (Fighting Theme):**  
   Karakter pixel-art di arena bertarung secara otomatis. Ketikan yang cepat dan akurat menghasilkan pukulan, tebasan pedang, atau tembakan sihir. Kesalahan mengetik membuat karakter tersandung atau serangan meleset (*miss*). Combo tinggi menghasilkan serangan kritis (*Critical Hit/Special Attack*).
2. **Tema Balapan (Racing Theme):**  
   Kendaraan pixel-art melaju di lintasan. Mengetik mengontrol akselerasi dan dorongan (*boost*). Kesalahan menyebabkan rem mendadak atau selip. Combo tinggi memicu *turbo boost*.
3. **Ekspansi Tema Masa Depan:** Fantasy, Cyberpunk, Pirates, Space, Kingdom, Sports.

---

## 7. Diferensiasi Kunci: FighType vs. Monkeytype / Nitro Type
| Fitur / Parameter | Monkeytype | Nitro Type | **FighType (Proyek Kita)** |
| :--- | :--- | :--- | :--- |
| **Fokus Utama** | Latihan WPM Solo & Minimalis | Balapan Mobil Kasual Anak | **Arena Kombat & Balapan Multiplayer Hardcore/Kompetitif** |
| **Art Direction** | Flat Teks Minimalis | 2D Kartun Kasual | **Terraria-inspired Modern 2D Pixel Art & Juicy Effects** |
| **Skill System** | Tidak Ada | Power-up Kasual Manual | **Otomatis dari Performa (Combo, Critical, Confuse, Mirror, Smoke)** |
| **Game Modes** | Time/Words/Quote Solo | Balapan 5 Pemain | **1v1, FFA, Battle Royale, Team Battle (2v2/5v5)** |
| **Arsitektur Network**| Client-based / P2P statis | HTTP / Basic Socket | **Server-Authoritative Fastify + Native WebSocket + Client Reconciliation** |
