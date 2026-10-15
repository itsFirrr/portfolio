# Task Breakdown — Portfolio "itsfirrr"

Kerjakan berurutan. Centang `[x]` setelah selesai dan verifikasi dengan `npm run build` di akhir tiap fase. Commit per fase dengan pesan jelas.

## Fase 0 — Setup
- [x] Init Vite vanilla project, struktur folder sesuai CLAUDE.md
- [x] Install: `gsap`, `lenis`, `tailwindcss` (+ plugin Vite), `@fontsource/jetbrains-mono`
- [x] Konfigurasi Tailwind dan design tokens (UI_UX.md bagian 2)
- [x] Buat `netlify.toml` (build `npm run build`, publish `dist`)
- [x] `.gitignore`, `README.md` singkat, inisialisasi git
- [x] Verifikasi: dev server jalan, build sukses

## Fase 1 — Fondasi
- [x] `index.html` semantik + meta SEO + Open Graph + favicon
- [x] `src/styles/main.css` (token, reset, utilitas, focus style)
- [x] `src/main.js` sebagai entry yang menginisialisasi modul
- [x] Util: `reducedMotion.js` (deteksi dan helper), `isMobile.js`
- [x] Inisialisasi Lenis + sinkron dengan ScrollTrigger
- [x] Verifikasi: halaman kosong dengan font dan warna benar

## Fase 2 — Layout dan Navbar
- [x] Navbar status-bar + menu hamburger mobile
- [x] Highlight section aktif saat scroll
- [x] Progress bar scroll
- [x] Kerangka 6 section (id: hero, about, skills, projects, vibe, contact) + footer

## Fase 3 — Hero
- [x] Jendela terminal dengan typewriter `whoami`
- [x] Scramble text untuk nama
- [x] Role rotator (typewriter + hapus)
- [x] Matrix rain canvas (30 fps, dibatasi di mobile, pause saat tidak terlihat)
- [x] Tombol CTA
- [x] Boot screen opsional + tombol skip

## Fase 4 — About dan Skills
- [x] About: teks gaya terminal + kartu stats (counter) dengan nilai placeholder `TODO_`
- [x] Skills: marquee dua baris + kartu kategori tilt
- [x] Scroll reveal dengan stagger

## Fase 5 — Projects
- [ ] `src/data/projects.js` berisi 4 proyek (lihat PRD bagian 5b) + kartu "More on GitHub"
- [ ] Render kartu dari data, hover glow dan tilt
- [ ] Modal detail (animasi, Esc untuk tutup, focus trap)
- [ ] Link placeholder ditandai `TODO_LINK_REPO`

## Fase 6 — Vibe Coding
- [ ] Jendela editor palsu: tab, nomor baris, highlight sederhana
- [ ] Panel prompt AI yang mengetik, lalu kode mengetik sendiri (loop)
- [ ] Layout responsif (vertikal di mobile)

## Fase 7 — Contact dan Terminal Interaktif
- [ ] Terminal input dengan command: help, about, skills, projects, contact, github, theme, clear, sudo
- [ ] Riwayat (panah atas/bawah) dan autocomplete Tab
- [ ] Tombol kontak fallback (email, GitHub, Instagram, LinkedIn) dengan placeholder `TODO_`
- [ ] Opsional: Netlify Forms

## Fase 8 — Efek Global dan Easter Egg
- [ ] Custom cursor glow (desktop)
- [ ] Konami code easter egg
- [ ] Transisi dan polish antar section

## Fase 9 — Optimasi dan QA
- [ ] Terapkan `prefers-reduced-motion` di semua animasi
- [ ] Audit performa: lazy init efek berat via IntersectionObserver, cek ukuran bundle
- [ ] Audit aksesibilitas (kontras, fokus, ARIA)
- [ ] Uji responsif 360 / 768 / 1280 / 1920
- [ ] Lighthouse mobile target Performance dan Accessibility >= 90
- [ ] Daftar semua `TODO_` yang tersisa dan tampilkan di akhir

## Fase 10 — Deploy
- [ ] Push ke GitHub (`itsFirrr/portfolio`)
- [ ] Hubungkan ke Netlify, pastikan auto deploy
- [ ] Cek situs live, OG image, favicon
- [ ] Update `README.md` dengan URL live
