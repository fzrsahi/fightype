# 06. Sistem Desain Antarmuka (UI Design System)

**Nama Proyek:** FighType  
**Versi:** 1.0.0  
**Status:** Disetujui (Source of Truth)  
**Bahasa:** Bahasa Indonesia  
**Referensi Dokumen Sebelumnya:** [01-vision.md](file:///Users/fzrsahi/Documents/Coding/battle-typing/docs/01-vision.md), [03-gdd.md](file:///Users/fzrsahi/Documents/Coding/battle-typing/docs/03-gdd.md)  

---

## 1. Filosofi Antarmuka & Keterbacaan (HUD Immersive)
Sesuai prinsip **"Typing is the core mechanic, Gaming is the experience"**, antarmuka pengguna (**UI HUD**) di **FighType** dirancang agar:
1. **Tidak Menghalangi Fokus Mengetik:** Area teks ketikan (*Typing Box*) berada di pusat perhatian layar dengan kontras tinggi dan ukuran font yang optimal.
2. **Menyatu dengan Atmosfer Terraria:** Elemen kontainer menggunakan gaya *Glassmorphism* gelap bercampur border pixel-art yang tegas.
3. **Juicy Feedback:** Setiap perubahan status (kenaikan combo, damage didapat, skill aktif) disertai animasi mikro (*micro-animations*) yang dinamis tanpa mengaburkan teks.

---

## 2. Design Tokens & Palet Warna (Color Palette)
Kita menggunakan sistem warna berbasis HSL/Hex bergetar (*vibrant colors*) dengan mode gelap (*dark mode*) sebagai standar default:

```css
:root {
  /* Background & Surfaces (Glassmorphism & Pixel Borders) */
  --bg-main: #0b0f19;          /* Deep Dark Void / Terraria Night Sky */
  --bg-surface: rgba(22, 29, 47, 0.75); /* Semi-transparent HUD Glass */
  --bg-panel: #1a233a;
  --border-pixel: #3b4d7a;     /* 2px Solid Crisp Border */
  --border-glow: #00f0ff;      /* Cyan Neon Glow for Active elements */

  /* Typography Colors */
  --text-primary: #ffffff;     /* Bright White for completed text/headings */
  --text-target: #a0aec0;      /* Soft Grey for un-typed target text */
  --text-error: #ff3366;       /* Vibrant Red for typing errors */
  --text-correct: #00ff66;     /* Electric Green for correct keystroke hits */
  --text-muted: #64748b;       /* Secondary info / spectator labels */

  /* Combat & Skill Accent Colors */
  --color-combo: #ffb800;      /* Golden Yellow for Combo counter */
  --color-critical: #ff1a1a;   /* Fiery Red for Critical Hits */
  --color-skill: #bf40bf;      /* Mystical Purple for Skill Triggers */
  --color-hp-bar: #22c55e;     /* Healthy Green */
  --color-hp-low: #ef4444;     /* Danger Red for low HP */
}
```

---

## 3. Tipografi & Skala Font (Typography System)
Tipografi dibedakan menjadi 2 kategori utama: **Monospaced (untuk area mengetik)** dan **Modern Sans/Pixel (untuk HUD & Lobi)**.

| Elemen UI | Keluarga Font | Bobot (Weight) | Ukuran (Desktop) | Keterangan |
| :--- | :--- | :--- | :--- | :--- |
| **Typing Area (Teks Target)** | `JetBrains Mono`, `Fira Code`, `Courier New` | 500 (Medium) | `28px` (`1.75rem`) | Monospaced wajib agar lebar karakter konsisten dan mata tidak lelah. |
| **Combo / Damage Floating** | `Press Start 2P`, `Outfit` (Pixel/Bold) | 800 (Extra Bold)| `36px` - `48px` | Angka besar melompat (*floating text*) saat menyerang. |
| **HUD Stats (WPM, Akurasi)**| `Inter`, `Outfit` | 600 (Semi Bold)| `18px` (`1.125rem`) | Jelas, ringkas di sudut layar. |
| **Lobby Headings & Buttons**| `Outfit`, `Inter` | 700 (Bold) | `24px` - `32px` | Tombol interaktif bergaya game arcade modern. |

---

## 4. Struktur HUD Pertandingan (Match HUD Layout)
Berikut adalah tata letak visual komponen di layar saat pertandingan (`Fighting Theme` / `1v1` / `Battle Royale`):

```
+-----------------------------------------------------------------------------------+
| [ Room: FT-9823 ]       [ Timer: 00:45 ]         [ Mode: Battle Royale (12/20) ]  |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|  +-----------------------------------------------------------------------------+  |
|  |                         PRESENTATION LAYER (CANVAS)                         |  |
|  |                                                                             |  |
|  |     [ Player Pixel Character ]       VS       [ Opponent Pixel Character ]  |  |
|  |     HP: [==============--] 80%                HP: [========--------] 45%     |  |
|  |                                                                             |  |
|  |                     * CRITICAL HIT! -120 DAMAGE *                           |  |
|  +-----------------------------------------------------------------------------+  |
|                                                                                   |
|  +-----------------------------------------------------------------------------+  |
|  |                        COMBO: 35x (BOOST ACTIVE!)                           |  |
|  |                                                                             |  |
|  |   [Keti]kan kata selanjutnya dengan cepat agar serangan tidak meleset...     |  |
|  |   ^^^^^^                                                                    |  |
|  |   (Hijau=Benar) (Abu-abu=Belum) (Merah=Error highlight)                     |  |
|  +-----------------------------------------------------------------------------+  |
|                                                                                   |
| [ WPM: 92 | Accuracy: 98.4% ]      [ Active Skill Debuff: NONE ]                  |
+-----------------------------------------------------------------------------------+
```

---

## 5. Spesifikasi Micro-Animations (Juicy Feedback)
1. **Screen Shake (Getaran Layar):**  
   Saat pemain menerima Critical Hit dari lawan atau saat memicu skill `Lightning`, kontainer utama bergetar sejauh `±4px` secara acak selama `150ms`. (Dapat dimatikan di opsi aksesibilitas).
2. **Floating Damage Numbers:**  
   Setiap kata yang selesai memunculkan angka damage melompat ke atas (`translateY(-30px)` + `opacity fade-out` selama `600ms`) di atas karakter lawan.
3. **Combo Pulse (Detak Combo):**  
   Ketika combo mencapai kelipatan 10, teks Combo membesar seketika (`scale(1.3)`) lalu kembali ke ukuran asal (`scale(1.0)`) dengan transisi `cubic-bezier(0.34, 1.56, 0.64, 1)`.
4. **Error Flash:**  
   Jika terjadi salah ketik (`incorrect keystroke`), batas area ketikan berkedip merah terang selama `100ms` dan kursor bergoyang kecil ke kiri-kanan (`shake-x`).

---

## 6. Aksesibilitas & Responsivitas Breakpoints
- **Desktop Standard (`> 1024px`):** HUD lengkap, ukuran font mengetik 28px, Canvas presentasi 100% resolusi.
- **Tablet / Small Laptop (`768px - 1024px`):** Font mengetik 24px, rasio Canvas diatur agar tetap mempertahankan aspect ratio 16:9.
- **Mobile Browser (`< 768px`):** Layout ditata vertikal (`flex-direction: column`), Canvas presentasi dikompresi di bagian atas layar (`height: 180px`), area mengetik berada langsung di atas virtual keyboard agar pemain tetap fokus.
