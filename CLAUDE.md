# CLAUDE.md — Portfolio "itsfirrr"

## Konteks Proyek
Landing page portfolio satu halaman untuk Ahmad Firdaus (itsfirrr), programmer dan vibe coder. Tema terminal + neon gelap dengan banyak animasi. Dibangun dengan Vite + vanilla JS, di-deploy lewat GitHub ke Netlify.

Baca dokumen ini lebih dulu, lalu `PRD.md`, `UI_UX.md`, dan `TASK_BREAKDOWN.md`. Itu adalah sumber kebenaran. Kerjakan `TASK_BREAKDOWN.md` berurutan, centang tiap task yang selesai.

## Stack (jangan diganti tanpa alasan kuat)
- Vite + vanilla JavaScript (ES modules). Tanpa React/Vue.
- Tailwind CSS, GSAP + ScrollTrigger, Lenis.
- Canvas 2D murni untuk Matrix rain/partikel.
- Font self-host: `@fontsource/jetbrains-mono`.
- Tanpa backend. Tidak ada CDN eksternal untuk script/font.

## Struktur Folder
```
portfolio/
├── index.html
├── netlify.toml
├── package.json
├── CLAUDE.md  PRD.md  UI_UX.md  TASK_BREAKDOWN.md
├── public/            # favicon, og-image
└── src/
    ├── main.js
    ├── styles/main.css
    ├── data/projects.js
    ├── modules/       # hero.js matrix.js terminal.js editor.js
    │                  # cursor.js nav.js tilt.js scroll.js konami.js
    └── utils/         # reducedMotion.js isMobile.js
```

## Perintah
- `npm run dev` jalankan dev server
- `npm run build` build produksi ke `dist/`
- `npm run preview` cek hasil build

## Deployment (Netlify)
- Build command `npm run build`, publish directory `dist`.
- `netlify.toml` harus ada di root.
- Jangan commit `node_modules` dan `dist`.

## Aturan Kode
- Satu modul per fitur, tiap modul mengekspor fungsi `init...()` yang dipanggil dari `main.js`.
- Semua animasi harus menghormati `prefers-reduced-motion` lewat helper di `utils/reducedMotion.js`.
- Efek berat (Matrix rain, editor mengetik) diinisialisasi lazy dengan IntersectionObserver dan dijeda saat tidak terlihat atau tab tidak aktif.
- Desktop-only: cursor glow dan tilt. Matikan di layar sentuh.
- Bersihkan listener, timeline GSAP, dan `requestAnimationFrame` saat tidak dipakai.
- Warna dan spasi hanya lewat design tokens (CSS variables), jangan hardcode hex di komponen.
- Konten proyek hanya di `src/data/projects.js`.
- Tulis kode lengkap dan utuh, bukan potongan. Beri komentar singkat di bagian yang tidak jelas.
- Gunakan semantic HTML dan jaga aksesibilitas (fokus terlihat, ARIA pada terminal dan modal).

## Placeholder
Data yang belum ada ditulis dengan awalan `TODO_` (contoh: `TODO_EMAIL`, `TODO_INSTAGRAM`, `TODO_LINKEDIN`, `TODO_LINK_REPO`, `TODO_AVATAR`). Jangan mengarang data pribadi. Di akhir pekerjaan, tampilkan daftar semua `TODO_` yang masih ada dengan lokasi filenya.

Data yang sudah pasti:
- Nama: Ahmad Firdaus, handle: itsfirrr
- GitHub: https://github.com/itsFirrr
- Kanrung Tech: https://kanrungtech.com
- AIO Tool: https://aio-tool.netlify.app/

## Performa
Target Lighthouse mobile Performance dan Accessibility >= 90. Batasi jumlah partikel/kolom Matrix di mobile, hindari layout thrash, dan animasikan hanya `transform` dan `opacity` bila memungkinkan.

## Alur Kerja
1. Selesaikan satu fase, jalankan `npm run build`, perbaiki error.
2. Update centang di `TASK_BREAKDOWN.md`.
3. Commit dengan pesan jelas (misal `feat: hero terminal and matrix rain`).
4. Lanjut ke fase berikutnya tanpa menunggu konfirmasi, kecuali ada keputusan desain yang ambigu.
