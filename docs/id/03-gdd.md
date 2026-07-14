# 03. Dokumen Desain Game (Game Design Document - GDD)

**Nama Proyek:** FighType  
**Versi:** 1.0.0  
**Status:** Disetujui (Source of Truth)  
**Bahasa:** Bahasa Indonesia  
**Referensi Dokumen Sebelumnya:** [01-vision.md](file:///Users/fzrsahi/Documents/Coding/battle-typing/docs/01-vision.md), [02-prd.md](file:///Users/fzrsahi/Documents/Coding/battle-typing/docs/02-prd.md)  

---

## 1. Konsep Utama Gameplay & Filosofi Kontrol
Dalam **FighType**, **Mengetik adalah satu-satunya input pemain (The ONLY Input Mechanic)**.
- **Zero Mouse Interaction During Battle:** Begitu hitungan mundur pertandingan selesai (3-2-1 GO!), tangan pemain sepenuhnya berada di atas keyboard. Tidak ada tombol klik mouse untuk mengeluarkan jurus, memilih target, atau mengaktifkan item.
- **Semua Reaksi Bersifat Otomatis:** Sistem game merespons secara deterministik terhadap kecepatan, akurasi, dan ritme ketikan pemain. Animasi serangan, pergerakan kendaraan, pengaktifan skill debuff, dan kamera otomatis diatur oleh **Game Engine**.

---

## 2. Spesifikasi Typing Engine (Mesin Pengetikan)
Typing Engine adalah jantung mekanis dari **FighType**. Mesin ini bertugas memproses setiap karakter ketikan secara real-time dan menerjemahkannya menjadi statistik serta event kombat.

### 2.1 Pemrosesan Input & Validasi Karakter
- **Target Word Buffer:** Klien menyimpan rentang kata aktif yang harus diketik.
- **Keystroke Evaluation:** Setiap ketikan tombol (`keydown` / `input`) divalidasi langsung:
  - **Correct Keystroke:** Kursor maju ke karakter berikutnya. Combo bertambah (+1). Jika ini karakter terakhir dari sebuah kata, kata ditandai selesai dan event `WORD_COMPLETED` dikirim/diproses.
  - **Incorrect Keystroke:** Kursor tertahan di posisi saat ini. Karakter salah ditandai merah (*highlight error*). Combo direset ke 0 (`COMBO_BREAK`). Efek suara *miss/stumble* diputar. Pemain harus mengetik karakter yang benar untuk bisa melanjutkan (atau menggunakan Backspace jika aturan *Strict Backspace* diaktifkan di match settings).

### 2.2 Kalkulasi Kecepatan & Akurasi
- **Gross WPM (Kecepatan Kotor):**  
  $$\text{Gross WPM} = \frac{\text{Total Karakter Diketik}}{5} \times \frac{60}{\text{Waktu Berjalan (detik)}}$$
- **Net WPM (Kecepatan Bersih / Efektif):**  
  $$\text{Net WPM} = \frac{\text{Total Karakter Benar} - \text{Total Kesalahan}}{5} \times \frac{60}{\text{Waktu Berjalan (detik)}}$$
- **Accuracy Percentage:**  
  $$\text{Accuracy} = \left( \frac{\text{Total Karakter Benar}}{\text{Total Keystroke}} \right) \times 100\%$$

### 2.3 Sistem Combo & Streak Multiplier
- Setiap karakter benar berturut-turut menaikkan **Combo Meter**.
- Threshold Combo:
  - **10 Combo:** Multiplier damage / boost x1.2.
  - **25 Combo:** Multiplier x1.5 + memicu animasi aura pada karakter/kendaraan.
  - **50 Combo:** Multiplier x2.0 + memicu kemungkinan **Skill Otomatis**.
  - **100+ Combo:** Multiplier x3.0 + status *ON FIRE / MAX OVERDRIVE*.

---

## 3. Presentasi Otomatis (Automated Presentation Layer)
Tema adalah presentasi visual yang memvisualisasikan data matematis dari Typing Engine.

### 3.1 Tema 1: Fighting (Terraria-Inspired Combat)
- **Visual Setup:** Arena pertarungan pixel-art 2D dengan latar belakang dinamis (misal: Hutan Terraria, Dungeon Kastil). Karakter pemain berdiri berhadapan dengan lawan (atau monster/avatar lawan).
- **Mekanik Animasi:**
  - **Attack Trigger:** Setiap kali pemain menyelesaikan 1 kata dengan benar, karakternya otomatis melompat/maju melancarkan serangan (tebasan pedang, tembakan panah, atau bola api sihir).
  - **Damage Scaling:** Damage yang diterima lawan dihitung berdasarkan panjang kata $\times$ Combo Multiplier.
  - **Miss / Stumble:** Jika pemain melakukan kesalahan ketik (*error*), karakternya akan tersandung (*stumble*), menangkis dengan susah payah, atau serangannya meleset dengan animasi lucu.
  - **Critical Hit:** Saat berada di combo > 25, serangan memiliki peluang 30% (atau otomatis setiap 10 kata di combo tinggi) menghasilkan **Critical Hit** dengan animasi tebasan raksasa berguncang (*screen shake* + *floating red numbers*).

### 3.2 Tema 2: Racing (Pixel Vehicles)
- **Visual Setup:** Lintasan balap pixel-art horizontal bergulir cepat (*parallax scrolling background*).
- **Mekanik Animasi:**
  - **Acceleration:** Kecepatan laju kendaraan berbanding lurus dengan **Net WPM** real-time pemain.
  - **Turbo Boost:** Menyelesaikan kata dengan Combo > 25 memberikan efek api knalpot biru (*boost*) yang melesatkan kendaraan ke depan.
  - **Skid / Slowdown:** Kesalahan ketik menyebabkan roda selip (asap putih) dan pengurangan kecepatan sementara sebesar 15-20%.

---

## 4. Sistem Skill Otomatis (Automated Skill Generation Engine)
Skill di-generate dan diluncurkan secara **otomatis oleh sistem berdasarkan performa mengetik pemain** (misal: setiap mencapai kelipatan 30 Combo atau menyelesaikan rangkaian kata sempurna dengan akurasi > 95%). Pemain **tidak menekan tombol manual** untuk mengeluarkan skill.

| Nama Skill | Kondisi Pemicu Otomatis | Efek pada Lawan / Arena (Debuff / Buff) | Durasi / Pemulihan |
| :--- | :--- | :--- | :--- |
| **Combo / Critical Attack** | Mencapai 25, 50, dan 100 Combo | Pukulan ekstra keras yang langsung mengurangi HP lawan secara signifikan atau memberi lompatan jarak instan. | Instan |
| **Confuse** | Menyelesaikan 5 kata berurutan tanpa error saat WPM > 70 | Sebagian karakter pada target kata lawan berubah secara acak antara huruf besar dan kecil (misal: `mEnaRik` dari `menarik`). | 4 Detik (atau 2 Kata) |
| **Mirror** | Kelipatan 40 Combo sempurna | Kata berikutnya pada layar lawan ditampilkan terbalik secara visual (misal: `gnitek` untuk `keting`). | 1 Kata |
| **Smoke** | Akurasi > 98% selama 20 detik | Kabut asap tebal ala Terraria muncul menutupi 40% area teks ketikan lawan, menyulitkan pembacaan cepat. | 5 Detik |
| **Lightning** | Memicu Critical Hit ke-3 | Kilatan petir terang bergetar di layar lawan sesaat (*screen flash/shake*), menciptakan disorientasi visual 0.5 detik. | 0.5 Detik Flash |
| **Wind** | Menjaga WPM > 80 selama 15 detik | Teks kata target lawan bergoyang/bergeser ringan ke kiri dan kanan seolah diterpa angin kencang. | 6 Detik |
| **Ghost** | WPM melonjak +20 dalam 5 detik | Teks yang harus diketik lawan menjadi semi-transparan (fading 30% opacity), menuntut ingatan/fokus ekstra. | 4 Detik |
| **Freeze** | Mengalahkan/mengurangi 50% HP lawan pertama kali | Debuff es yang membuat kecepatan ketik efektif lawan melambat 25% (atau kursor mengalami delay 50ms per karakter). | 3 Detik |

> [!NOTE]
> Semua skill debuff di atas **dapat dimatikan (Disabled)** pada pengaturan room oleh Host jika pemain menginginkan pertandingan murni (*Pure Typing WPM Match* tanpa gangguan visual).

---

## 5. Aturan Battle Royale (Elimination Engine)
Dalam mode **Battle Royale (4 hingga 20+ pemain)**, pertandingan tidak ditentukan oleh siapa yang pertama selesai 50 kata, melainkan **siapa yang bertahan hidup terakhir (*Last Man Standing*)**.

### 5.1 Siklus Evaluasi & Eliminasi
1. **Periodic Evaluation Tick:** Setiap **15 detik** (atau interval sesuai konfigurasi room), sistem server melakukan pengecekan performa seluruh pemain yang masih bertahan di dalam arena.
2. **Kriteria Eliminasi (Bisa dipilih di Match Settings):**
   - **Lowest WPM Elimination:** Pemain dengan *Net WPM* paling rendah pada interval 15 detik tersebut langsung tereliminasi (*Knocked Out* / tenggelam dari arena).
   - **Accuracy Threshold Death:** Pemain yang akurasinya jatuh di bawah **80%** selama 2 interval berturut-turut tereliminasi karena "kehabisan stamina/armor".
   - **Progress Lagging:** Pemain yang tertinggal > 30 kata dari pemimpin pertandingan tereliminasi oleh "zona bahaya/badai" (*The Storm/Danger Zone* yang menyusut dari belakang).
3. **Spectator Transition:** Pemain yang tereliminasi seketika beralih ke mode penonton (*Spectator HUD*), di mana mereka dapat mengamati sisa pertarungan sengit para pemain yang masih hidup hingga muncul 1 juara utama.
