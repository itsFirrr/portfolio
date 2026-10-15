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
