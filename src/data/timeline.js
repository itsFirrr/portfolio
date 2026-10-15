// Riwayat untuk section "git log". Urut dari terbaru. Field `en` opsional untuk versi bahasa Inggris.
// `type`: work (kerja/magang), feat (proyek), org (organisasi/program), edu (pendidikan).
export const timeline = [
  {
    date: '2026 — sekarang',
    type: 'work',
    title: 'Magang di PT PLN Icon Plus',
    desc: 'Bagian aset: pengelolaan data aset dan penggambaran peta jaringan berbasis GIS.',
    en: {
      date: '2026 — present',
      title: 'Intern at PT PLN Icon Plus',
      desc: 'Asset division: managing asset data and drawing GIS-based network maps.',
    },
  },
  {
    date: 'Okt 2026',
    type: 'feat',
    title: 'Launch portfolio itsfirrr',
    desc: 'Landing page bertema terminal neon, lengkap dengan terminal interaktif dan arcade minigame.',
    en: { date: 'Oct 2026', desc: 'Neon terminal-themed landing page with an interactive terminal and a minigame arcade.' },
  },
  {
    date: '2026',
    type: 'feat',
    title: 'Kalender PNL',
    desc: 'Jurnal trading berbentuk kalender dengan statistik P/L (Flutter, Riverpod, Drift).',
    en: { desc: 'Calendar-style trading journal with P/L statistics (Flutter, Riverpod, Drift).' },
  },
  {
    date: '2026',
    type: 'feat',
    title: 'WarPro (Aplikasi Kasir)',
    desc: 'POS dan manajemen stok offline untuk warung (Laravel, Livewire, MySQL).',
    en: { title: 'WarPro (POS App)', desc: 'Offline POS and stock management for small shops (Laravel, Livewire, MySQL).' },
  },
  {
    date: '2026',
    type: 'feat',
    title: 'AIO Tool',
    desc: 'Kumpulan tools web yang berjalan langsung di browser.',
    en: { desc: 'A collection of web tools that run right in the browser.' },
    link: 'https://aio-tool.netlify.app/',
  },
  {
    date: '2026',
    type: 'org',
    title: 'Lolos Abdidaya 2026 — Kanrung Tech',
    desc: 'Tim Kanrung Tech lolos ke Abdidaya 2026. Saya di divisi hardware dan software.',
    en: {
      title: 'Selected for Abdidaya 2026 — Kanrung Tech',
      desc: 'The Kanrung Tech team was selected for Abdidaya 2026. I work in the hardware and software division.',
    },
    link: 'https://kanrungtech.com',
  },
  {
    date: 'Awal 2026',
    type: 'org',
    title: 'PPK Ormawa — Kanrung Tech',
    desc: 'Pengering cengkeh rotary berbasis IoT dengan aplikasi Android dan website showcase (ESP32, Firebase, Kotlin, Laravel).',
    en: {
      date: 'Early 2026',
      desc: 'IoT rotary clove dryer with an Android app and a showcase website (ESP32, Firebase, Kotlin, Laravel).',
    },
  },
  {
    date: 'Sep 2023',
    type: 'edu',
    title: 'D-4 Teknik Komputer dan Jaringan, PNUP',
    desc: 'Mulai kuliah di Politeknik Negeri Ujung Pandang. Sekarang semester 7.',
    en: {
      title: 'B.A.Sc. Computer & Network Engineering, PNUP',
      desc: 'Started studying at Politeknik Negeri Ujung Pandang. Currently in semester 7.',
    },
  },
  {
    date: 'Awal 2021',
    type: 'edu',
    title: 'git init',
    desc: 'Pertama kali ngoding, dimulai dari HTML.',
    en: { date: 'Early 2021', desc: 'Wrote my first code, starting with HTML.' },
  },
];
