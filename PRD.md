# PRD — Portfolio Landing Page "itsfirrr"

## 1. Ringkasan
Landing page satu halaman untuk Ahmad Firdaus (itsfirrr), mahasiswa D-4 Teknik Komputer dan Jaringan PNUP, yang memposisikan diri sebagai **programmer + vibe coder**. Situs harus terasa seperti terminal hacker bertema neon, penuh animasi, tetapi tetap cepat dan nyaman di HP.

## 2. Tujuan
- Menampilkan identitas dan kemampuan secara memorable.
- Menampilkan 4 proyek utama dengan link ke demo/repo.
- Menyediakan kontak yang mudah dihubungi (recruiter, dosen, klien).
- Skor Lighthouse Performance >= 90 di mobile walaupun banyak animasi.

## 3. Target Pengunjung
Recruiter/HR magang, dosen dan panitia program kampus, calon klien proyek, sesama developer.

## 4. Deployment
- Kode di GitHub (akun `itsFirrr`), repo baru misal `portfolio`.
- Netlify terhubung ke repo, build `npm run build`, publish `dist`. Auto deploy tiap push ke `main`.
- Wajib ada `netlify.toml`.

## 5. Tech Stack (final)
- Vite + vanilla JavaScript (ES modules), tanpa framework UI.
- Tailwind CSS (via `@tailwindcss/vite` atau PostCSS, ikuti versi terbaru yang stabil).
- GSAP + ScrollTrigger (animasi), Lenis (smooth scroll).
- Canvas 2D murni untuk Matrix rain dan partikel.
- Font: JetBrains Mono (self-host via `@fontsource`, jangan CDN).
- Tidak ada backend. Form kontak opsional memakai Netlify Forms.

## 5b. Konten Proyek
| Proyek | Deskripsi | Tech | Link |
|---|---|---|---|
| Kanrung Tech | Pengering cengkeh rotary berbasis IoT dengan aplikasi Android dan website showcase, bagian dari program PPK Ormawa | ESP32, Firebase, Kotlin/Compose, Laravel | https://kanrungtech.com |
| AIO Tool | Kumpulan tools web yang berjalan di browser | Web, JavaScript | https://aio-tool.netlify.app/ |
| WarPro (Aplikasi Kasir) | POS dan manajemen stok offline untuk warung: scan barcode, catatan hutang, dashboard laba/rugi | Laravel, Livewire, MySQL | `TODO_LINK_REPO` (cek https://github.com/itsFirrr) |
| Kalender PNL | Jurnal trading berbentuk kalender dengan statistik P/L | Flutter, Riverpod, Drift | `TODO_LINK_REPO` (cek https://github.com/itsFirrr) |

Semua deskripsi disimpan di satu file data (`src/data/projects.js`) supaya mudah diedit.

## 6. Section dan Fitur
1. **Boot screen (opsional, bisa di-skip):** log boot singkat 1.5 detik.
2. **Hero:** terminal mengetik `whoami`, nama dengan efek scramble/glitch, role bergantian ("Programmer", "Vibe Coder", "IoT Tinkerer"), CTA Projects dan Contact, Matrix rain di background.
3. **About:** teks singkat dalam format output terminal, plus stats counter (jumlah proyek, teknologi, dll, isi placeholder).
4. **Skills:** marquee ikon/teks tech stack (Laravel, Kotlin, Flutter, ESP32, Firebase, MySQL, Tailwind, Python) dan kartu kategori dengan tilt.
5. **Projects:** grid kartu 4 proyek + 1 kartu placeholder "More on GitHub". Hover glow dan tilt, klik membuka modal detail dengan transisi.
6. **Vibe Coding:** jendela editor kode palsu yang mengetik sendiri kode (loop), dengan panel "AI prompt" di sampingnya.
7. **Contact:** terminal interaktif (`help`, `about`, `projects`, `skills`, `contact`, `github`, `clear`) plus tombol kontak biasa sebagai fallback.
8. **Footer:** copyright dan link sosial.

## 7. Efek Global
- Custom cursor glow (desktop saja).
- Smooth scroll Lenis, progress bar scroll di atas.
- Scroll reveal tiap section.
- Easter egg Konami code (mengubah warna tema atau memicu efek khusus).
- Navbar bergaya status bar terminal, menandai section aktif.

## 8. Non-Functional
- Responsif 360px sampai 1920px.
- `prefers-reduced-motion`: matikan Matrix rain, glitch, tilt, dan smooth scroll.
- Partikel/Matrix rain dibatasi di mobile, pause saat tab tidak aktif atau canvas di luar viewport.
- Aksesibilitas: kontras teks cukup, fokus keyboard terlihat, `alt` pada gambar, semantic HTML.
- SEO: title, meta description, Open Graph, favicon.
- Seluruh konten bisa dibaca tanpa JS animasi (progressive enhancement).

## 9. Placeholder yang Harus Diganti
Semua ditandai `TODO_` di kode dan data: email, Instagram, LinkedIn, link repo proyek, foto/avatar, tagline, angka stats, URL domain.

## 10. Di Luar Scope
CMS, blog, backend, multi-bahasa, login.

## 11. Kriteria Selesai
- `npm run build` sukses tanpa error.
- Semua section tampil dan animasi jalan di desktop dan mobile.
- Terminal interaktif berfungsi.
- Lighthouse mobile Performance >= 90, Accessibility >= 90.
- Berhasil deploy di Netlify dari GitHub.
