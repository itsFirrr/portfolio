# UI/UX Plan — Portfolio "itsfirrr"

## 1. Arah Visual
Terminal hacker + neon gelap. Terasa seperti dev yang hidup di terminal dan editor AI. Tegas, glowing, tapi tidak norak: neon dipakai sebagai aksen, bukan di semua tempat.

## 2. Design Tokens
```css
:root {
  --bg: #05070a;
  --bg-elev: #0b1016;
  --panel: #0f1720;
  --border: #1b2a38;
  --text: #d6e2ee;
  --muted: #6f869b;
  --neon-green: #39ff88;
  --neon-cyan: #22d3ee;
  --neon-magenta: #ff3df2;
  --danger: #ff5c5c;
  --glow-green: 0 0 12px rgba(57,255,136,.55);
  --glow-cyan: 0 0 12px rgba(34,211,238,.55);
  --radius: 10px;
}
```
- Aksen utama: hijau neon. Sekunder: cyan. Magenta hanya untuk glitch dan easter egg.
- Font: JetBrains Mono untuk semua teks (heading 700, body 400). Ukuran body 15-16px.
- Spasi berbasis 4px. Container max-width 1100px.

## 3. Layout per Section
**Navbar:** fixed, tinggi tipis, gaya status bar (`~/itsfirrr  [about] [skills] [projects] [vibe] [contact]`). Mobile: menu hamburger yang membuka overlay terminal.

**Hero:** layar penuh, Matrix rain redup di belakang, jendela terminal di tengah (title bar dengan 3 titik, prompt `itsfirrr@portfolio:~$`). Urutan: ketik `whoami` -> nama (scramble) -> role bergantian -> 2 tombol CTA. Indikator scroll di bawah.

**About:** dua kolom desktop (teks output terminal | kartu stats), satu kolom di mobile. Stats memakai counter naik.

**Skills:** marquee dua baris arah berlawanan, di bawahnya 3-4 kartu kategori (Mobile, Web, IoT, Tools) dengan tilt 3D ringan.

**Projects:** grid 2 kolom desktop, 1 kolom mobile. Kartu: thumbnail/placeholder gradient, judul, deskripsi 2 baris, tag tech, ikon link. Hover: border neon, glow, tilt mengikuti kursor. Klik: modal detail (deskripsi penuh, tech, tombol Live/Repo). Kartu terakhir bergaya "ls -la ... lihat semua di GitHub".

**Vibe Coding:** jendela editor (tab file, nomor baris, syntax highlight sederhana) mengetik kode sendiri. Di sampingnya panel chat "prompt" yang mengetik permintaan, lalu kode muncul seolah dibuat AI. Di mobile ditumpuk vertikal.

**Contact:** terminal besar dengan input aktif, hint "ketik `help`". Di bawahnya grid tombol kontak (Email, GitHub, Instagram, LinkedIn) sebagai fallback.

## 4. Animasi (spesifikasi)
| Elemen | Efek | Durasi/Catatan |
|---|---|---|
| Boot screen | baris log muncul berurutan | total <= 1.5 dtk, ada tombol skip |
| Hero nama | scramble karakter acak menjadi teks | ~1.2 dtk |
| Hero role | typewriter ganti-ganti dengan hapus | loop |
| Matrix rain | canvas, kolom jatuh | 30 fps, opacity rendah, kolom dikurangi di mobile |
| Scroll reveal | fade + slide 24px, stagger 80ms | ScrollTrigger, sekali jalan |
| Stats | counter 0 ke target | saat masuk viewport |
| Marquee | translateX loop linear | pause saat hover |
| Kartu tilt | rotateX/Y maks 8 derajat | desktop saja |
| Cursor glow | lingkaran mengikuti dengan lerp | desktop saja |
| Modal proyek | scale+fade dari posisi kartu | 300 ms |
| Editor mengetik | karakter per karakter, kecepatan acak | loop dengan jeda |
| Progress scroll | bar tipis di atas | warna gradient hijau-cyan |

Easing utama: `power3.out`. Hindari animasi yang memblokir interaksi.

## 5. Interaksi Terminal
Perintah: `help`, `about`, `skills`, `projects`, `contact`, `github`, `theme`, `clear`, `sudo` (jawaban lucu). Riwayat dengan panah atas/bawah, autocomplete Tab, perintah tidak dikenal menampilkan `command not found`.

## 6. Responsif
Breakpoint: 640 / 1024. Mobile: matikan cursor glow dan tilt, kurangi partikel, ukuran font hero diperkecil, navbar jadi hamburger.

## 7. Aksesibilitas
- Rasio kontras teks >= 4.5:1.
- `prefers-reduced-motion`: tanpa Matrix rain, scramble, tilt, marquee statis, smooth scroll nonaktif.
- Fokus keyboard dengan outline neon yang jelas.
- Terminal punya label ARIA dan fallback tombol.
- Modal bisa ditutup dengan Esc dan fokus terkunci di dalamnya.

## 8. Aset
Favicon (ikon `>_` neon), OG image 1200x630, avatar opsional (`TODO_AVATAR`). Tidak ada gambar berat; gunakan SVG dan CSS gradient.
