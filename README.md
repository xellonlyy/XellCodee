# 🚀 XellCodee - Interactive Software Engineering Academy (100% Free)

<p align="center">
  <img src="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='24' fill='%23080C14'/><path d='M28 32 L48 50 L28 68' stroke='%236366F1' stroke-width='12' stroke-linecap='round' stroke-linejoin='round' fill='none'/><path d='M72 32 L52 50 L72 68' stroke='%2306B6D4' stroke-width='12' stroke-linecap='round' stroke-linejoin='round' fill='none'/></svg>" width="80" height="80" alt="XellCodee Logo" />
</p>

<p align="center">
  <b>Platform edukasi coding berbasis web interaktif & gamified modern untuk siapa saja yang ingin belajar software engineering 100% gratis tanpa login & tanpa biaya.</b>
</p>

---

## ✨ Fitur Utama

- ⚡ **In-Hero Interactive Sandbox**: Pengunjung bisa langsung mengetik dan menguji coba kode Python langsung di Hero Landing Page dengan terminal output instan (*WASM in-browser execution*).
- 🗺️ **Gamified Skill Tree (Peta Jalur Belajar)**: Roadmap pembelajaran berjenjang dari Level 1 (Variabel) hingga Level 5 (Algoritma Boss Project).
- 🎯 **Daily Quests & Streak Hub**: Sistem misi harian terintegrasi untuk menjaga konsistensi belajar, poin XP, dan Gems kristal.
- 🧩 **Click-to-Insert Code Chips (Blok Bantuan Ketik)**: Mempermudah pemula & anak-anak memasukkan blok kode instan tanpa typo.
- 🔊 **Narasi Suara Soal (Web Speech API)**: Membacakan instruksi materi dalam bahasa Indonesia/Inggris.
- 🔍 **Bedah Arti Kode (Analogi Sehari-hari)**: Penjelasan logika pemrograman dengan analogi visual kehidupan nyata yang ramah anak.
- 🎊 **Canvas Confetti & SFX Synthesizer**: Efek kembang api partikel dan audio synthesizer bawaan Web Audio API.
- 🌐 **Offline First & Local Storage**: Progres latihan, draf kode, streak, dan XP tersimpan otomatis di browser tanpa login.
- 📱 **Progressive Web App (PWA Ready)**: Siap diinstall di Android, iOS, Windows, macOS via `manifest.json`.

---

## 🛠️ Arsitektur & Teknologi

- **HTML5 & Vanilla JavaScript**: Arsitektur modular cepat tanpa overhead framework berat.
- **Tailwind CSS**: Desain ultra-sleek dengan tema *Electric Indigo (`#6366F1`)* & *Aurora Cyan (`#06B6D4`)*.
- **Web Audio API**: Synthesizer audio native tanpa dependensi file MP3 luar.
- **Web Speech API**: Text-to-Speech native tanpa API key eksternal.
- **HTML5 Canvas**: Engine partikel confetti interaktif.

---

## 📂 Struktur Proyek

```
├── index.html          # Halaman utama aplikasi (Landing, Onboarding, Playground)
├── 404.html            # Halaman 404 modern dengan visual terminal neon
├── manifest.json       # Konfigurasi PWA (Progressive Web App)
├── vercel.json         # Konfigurasi deployment Vercel
├── _redirects          # SPA redirects untuk Netlify & Cloudflare
├── css/
│   └── main.css        # Core stylesheet, token warna, glassmorphism, & animations
└── js/
    ├── security.js     # Sanitasi & filter keamanan in-browser
    ├── sound.js        # Web Audio Synthesizer (SFX Chime & Fanfare)
    ├── kidfriendly.js  # Blok cepat, narasi suara, bedah kode, & confetti
    ├── storage.js      # Centralized localStorage manager
    ├── translations.js # Kamus bahasa multilingual (ID / EN)
    ├── onboarding.js   # Wizard preferensi belajar
    ├── playground.js   # In-Browser IDE Sandbox & 5 modul latihan
    └── app.js          # Main app lifecycle controller
```

---

## 🚀 Menjalankan Secara Lokal

Cukup buka `index.html` langsung di browser atau gunakan local server:

```bash
# Menggunakan Python
python -m http.server 3000

# Atau menggunakan Live Server (VS Code / npx)
npx serve .
```

---

## 📄 Lisensi

Platform ini 100% gratis dan open-source di bawah lisensi MIT.
Dibuat dengan ❤️ untuk seluruh pemelajar koding di Indonesia.
