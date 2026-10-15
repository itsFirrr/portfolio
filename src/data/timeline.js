// Riwayat untuk section "git log". Urut dari terbaru. Field `en` opsional untuk versi bahasa Inggris.
// `type`: feat (proyek), edu (pendidikan), org (organisasi/program).
export const timeline = [
  {
    date: '2026',
    type: 'feat',
    title: 'Launch portfolio itsfirrr',
    desc: 'Landing page bertema terminal neon, lengkap dengan terminal interaktif dan arcade minigame.',
    en: { desc: 'Neon terminal-themed landing page with an interactive terminal and a minigame arcade.' },
  },
  {
    date: 'TODO_TIMELINE_YEAR_KALENDER_PNL',
    type: 'feat',
    title: 'Kalender PNL',
    desc: 'Jurnal trading berbentuk kalender dengan statistik P/L (Flutter, Riverpod, Drift).',
    en: { desc: 'Calendar-style trading journal with P/L statistics (Flutter, Riverpod, Drift).' },
  },
  {
    date: 'TODO_TIMELINE_YEAR_WARPRO',
    type: 'feat',
    title: 'WarPro (Aplikasi Kasir)',
    desc: 'POS dan manajemen stok offline untuk warung (Laravel, Livewire, MySQL).',
    en: { title: 'WarPro (POS App)', desc: 'Offline POS and stock management for small shops (Laravel, Livewire, MySQL).' },
  },
  {
    date: 'TODO_TIMELINE_YEAR_AIO',
    type: 'feat',
    title: 'AIO Tool',
    desc: 'Kumpulan tools web yang berjalan langsung di browser.',
    en: { desc: 'A collection of web tools that run right in the browser.' },
    link: 'https://aio-tool.netlify.app/',
  },
  {
    date: 'TODO_TIMELINE_YEAR_PPK',
    type: 'org',
    title: 'PPK Ormawa — Kanrung Tech',
    desc: 'Pengering cengkeh rotary berbasis IoT dengan aplikasi Android dan website showcase.',
    en: { desc: 'IoT rotary clove dryer with an Android app and a showcase website.' },
    link: 'https://kanrungtech.com',
  },
  {
    date: 'TODO_TIMELINE_YEAR_PNUP',
    type: 'edu',
    title: 'D-4 Teknik Komputer dan Jaringan, PNUP',
    desc: 'Mulai kuliah di Politeknik Negeri Ujung Pandang. TODO_TIMELINE_PNUP_DETAIL',
    en: {
      title: 'B.A.Sc. Computer & Network Engineering, PNUP',
      desc: 'Started studying at Politeknik Negeri Ujung Pandang. TODO_TIMELINE_PNUP_DETAIL',
    },
  },
  {
    date: 'TODO_TIMELINE_YEAR_FIRST_CODE',
    type: 'edu',
    title: 'git init',
    desc: 'Pertama kali menulis kode. TODO_TIMELINE_FIRST_CODE_DETAIL',
    en: { desc: 'Wrote my first line of code. TODO_TIMELINE_FIRST_CODE_DETAIL' },
  },
];
