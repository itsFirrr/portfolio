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

## Arcade (easter egg)
Konami code (↑ ↑ ↓ ↓ ← → ← → B A) atau perintah `games` / `play <nama>` di terminal membuka **itsfirrr arcade**:

| id | Game | Tema |
|---|---|---|
| `kasir` | Kasir Rush | WarPro: hitung kembalian sebelum pelanggan kabur |
| `pnl` | PNL Trader | Kalender PNL: BUY/SELL candle, 7 hari trading |
| `bughunt` | Bug Hunt | Pencet bug sebelum lolos ke production |
| `typer` | Vibe Typer | Adu cepat mengetik kode vs AI |
| `roulette` | Prompt Roulette | Pilih prompt perbaikan bug yang benar |
| `runner` | Packet Runner | Endless runner bertema jaringan |
| `snake` | Snake | Klasik |
| `2048` | 2048 | Klasik |
| `mines` | Minesweeper | Klasik |

Konten game (barang warung, snippet kode, soal kuis) ada di `src/data/arcade.js`; daftar game di `src/data/games.js`. Skor tertinggi disimpan di localStorage pengunjung.

## Fitur tambahan
- **Bahasa ID/EN**: tombol di navbar atau `lang en`. Teks Indonesia ada di `index.html`; terjemahan & teks JS di `src/data/i18n.js`. Konten proyek/timeline punya field `en` opsional.
- **GitHub live stats**: kartu di About, data publik `api.github.com/users/itsFirrr` (cache 1 jam per sesi). Bila API gagal, kartu disembunyikan.
- **Timeline**: section `git log --graph`, isi di `src/data/timeline.js`.
- **CRT mode**: `crt on` / `crt off`. **Sound**: tombol 🔇 di navbar atau `sound on` (default mati).
- **Perintah terminal baru**: `neofetch`, `cv`, `matrix`, `cowsay <teks>`, `weather [kota]` (Open-Meteo, tanpa API key), `hack`, `lang`, `crt`, `sound`.

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
- Modul editor vibe coding, cursor glow, dan Konami dimuat sebagai chunk terpisah (dynamic import saat idle/mendekati viewport) untuk menekan Total Blocking Time. Terminal tetap dimuat langsung agar form tidak pernah submit sebelum handler siap.
- Lighthouse mobile (lokal, `vite preview`): Performance 92–95, Accessibility 100, Best Practices 100, SEO 92 (canonical masih `TODO_DOMAIN_URL`).
- Fase 10 (push GitHub & hubungkan Netlify) sengaja tidak dijalankan; dikerjakan oleh pemilik repo.
- Arcade dan tiap game di-import dinamis (chunk terpisah), jadi tidak menambah bundle awal kecuali metadata kecil di terminal.
- Pilihan game klasik tidak dirinci, jadi dipilih Snake, 2048, dan Minesweeper karena ringan dan enak dimainkan di layar sentuh.
- Konami di-nonaktifkan saat arcade terbuka supaya tombol panah game tidak memicunya lagi.
- i18n: teks Indonesia untuk HTML statis tetap di `index.html` (sumber asli, terbaca tanpa JS); hanya versi EN yang ada di kamus. Konten game arcade tetap berbahasa Indonesia.
- Kartu GitHub tidak menimpa angka stats manual (tahun ngoding, commit) karena API publik tidak menyediakan total commit tanpa token.
- `weather` dan GitHub stats memanggil API eksternal saat runtime (fetch data, bukan script CDN), dengan timeout/fallback agar halaman tidak bergantung padanya.
- Angka stats di HTML diisi nilai akhir (bukan 0) supaya benar tanpa JS dan saat reduced motion; counter tetap animasi dari 0 bila motion aktif.
