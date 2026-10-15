# itsfirrr — Portfolio

Landing page portfolio satu halaman untuk **Ahmad Firdaus (itsfirrr)**. Tema terminal + neon gelap.

Stack: Vite, vanilla JS, Tailwind CSS v4, GSAP + ScrollTrigger, Lenis, Canvas 2D.

## Perintah
```bash
npm install
npm run dev      # dev server
npm run build    # build ke dist/
npm run preview  # cek hasil build
```

## Deploy (Netlify)
Build command `npm run build`, publish directory `dist` (sudah diatur di `netlify.toml`).

## Catatan Keputusan
- Tailwind v4 dipasang via `@tailwindcss/vite`; styling utama memakai CSS kustom berbasis design tokens (`src/styles/main.css`) karena komponen bertema terminal lebih rapi sebagai kelas semantik. Token juga diekspos ke `@theme` Tailwind.
- Token `--muted` dinaikkan sedikit dari `#6f869b` ke `#7d93a8` agar kontras teks kecil di atas `--panel` tetap >= 4.5:1.
- Token aksen `--accent`/`--accent-2` ditambahkan supaya perintah `theme` dan Konami code bisa mengganti warna tema tanpa mengubah komponen.
- Fase 1 dan 2 di-commit bersama karena kerangka HTML dan fondasi CSS saling bergantung.
- Konten statis (hero, about, skills, vibe, contact) ditulis langsung di HTML agar terbaca tanpa JS; daftar proyek dirender dari `src/data/projects.js` dengan `<noscript>` fallback berisi link proyek.
- Boot screen hanya tampil sekali per sesi browser (sessionStorage) dan dilewati total saat `prefers-reduced-motion`, agar kunjungan ulang tidak terhambat.
- Placeholder repo dibuat spesifik per proyek (`TODO_LINK_REPO_WARPRO`, `TODO_LINK_REPO_KALENDER_PNL`) agar mudah dicari. Selama masih placeholder, tombol Repo di modal diarahkan ke profil GitHub dan diberi gaya putus-putus.
- Kartu proyek memakai satu `<button>` "open --detail" yang area kliknya diperluas ke seluruh kartu, sehingga tetap satu tab-stop per kartu untuk keyboard.
- Netlify Forms (opsional) tidak dipakai: terminal interaktif + tombol kontak sudah cukup, dan email masih placeholder sehingga form belum punya tujuan yang jelas.
- Tab di terminal hanya ditahan untuk autocomplete bila input berisi teks; saat kosong, Tab tetap memindahkan fokus agar keyboard tidak terjebak.
- Pilihan tema (`theme`) disimpan di localStorage per pengunjung.
- Konami code (↑ ↑ ↓ ↓ ← → ← → B A) men-toggle tema magenta, memicu Matrix "burst" dan glitch nama. Diabaikan saat fokus di input terminal.
