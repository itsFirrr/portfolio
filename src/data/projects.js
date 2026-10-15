// Satu-satunya sumber konten proyek. Edit di sini saja.
// `live`/`repo` bernilai string URL, atau placeholder berawalan TODO_ bila belum ada.

export const GITHUB_URL = 'https://github.com/itsFirrr';

// Taruh file CV di public/cv.pdf lalu ganti nilai ini menjadi '/cv.pdf'
export const CV_URL = 'TODO_CV';

export const projects = [
  {
    id: 'kanrung-tech',
    title: 'Kanrung Tech',
    file: 'kanrung-tech.md',
    short: 'Pengering cengkeh rotary berbasis IoT dengan aplikasi Android dan website showcase.',
    description:
      'Pengering cengkeh rotary berbasis IoT dengan aplikasi Android dan website showcase, bagian dari program PPK Ormawa. ESP32 membaca sensor dan mengirim data ke Firebase, aplikasi Android (Kotlin/Compose) dipakai untuk monitoring dan kontrol, dan website Laravel menjadi etalase proyek.',
    tech: ['ESP32', 'Firebase', 'Kotlin/Compose', 'Laravel'],
    live: 'https://kanrungtech.com',
    repo: null,
    en: {
      short: 'IoT-based rotary clove dryer with an Android app and a showcase website.',
      description:
        'IoT-based rotary clove dryer with an Android app and a showcase website, part of the PPK Ormawa program. An ESP32 reads sensors and pushes data to Firebase, the Android app (Kotlin/Compose) handles monitoring and control, and a Laravel website showcases the project.',
    },
    thumb: 'green',
    glyph: '[iot]',
  },
  {
    id: 'aio-tool',
    title: 'AIO Tool',
    file: 'aio-tool.md',
    short: 'Kumpulan tools web yang berjalan langsung di browser.',
    description:
      'Kumpulan tools web yang berjalan langsung di browser, tanpa instalasi dan tanpa mengunggah data ke server. Dibuat untuk mempercepat pekerjaan kecil sehari-hari.',
    tech: ['Web', 'JavaScript'],
    live: 'https://aio-tool.netlify.app/',
    repo: null,
    en: {
      short: 'A collection of web tools that run right in the browser.',
      description:
        'A collection of web tools that run right in the browser, with no install and no uploading data to a server. Built to speed up small everyday tasks.',
    },
    thumb: 'cyan',
    glyph: '{ aio }',
  },
  {
    id: 'warpro',
    title: 'WarPro (Aplikasi Kasir)',
    file: 'warpro.md',
    short: 'POS dan manajemen stok offline untuk warung: scan barcode, catatan hutang, dashboard laba/rugi.',
    description:
      'Aplikasi kasir (POS) dan manajemen stok yang berjalan offline untuk warung. Fitur: scan barcode, catatan hutang pelanggan, dan dashboard laba/rugi.',
    tech: ['Laravel', 'Livewire', 'MySQL'],
    live: null,
    repo: 'https://github.com/itsFirrr/warpro',
    en: {
      title: 'WarPro (POS App)',
      short: 'Offline POS and stock management for small shops: barcode scanning, debt notes, profit/loss dashboard.',
      description:
        'An offline point-of-sale (POS) and stock management app for small neighborhood shops. Features: barcode scanning, customer debt notes, and a profit/loss dashboard.',
    },
    thumb: 'mix',
    glyph: '$ pos',
  },
  {
    id: 'kalender-pnl',
    title: 'Kalender PNL',
    file: 'kalender-pnl.md',
    short: 'Jurnal trading berbentuk kalender dengan statistik P/L.',
    description:
      'Jurnal trading berbentuk kalender: catat hasil harian dan lihat statistik profit/loss (P/L) secara visual. Data disimpan lokal dengan Drift, state dikelola dengan Riverpod.',
    tech: ['Flutter', 'Riverpod', 'Drift'],
    live: null,
    repo: 'https://github.com/itsFirrr/pnl-calendar',
    en: {
      short: 'Calendar-style trading journal with P/L statistics.',
      description:
        'A calendar-style trading journal: log daily results and see profit/loss (P/L) statistics visually. Data is stored locally with Drift, state is managed with Riverpod.',
    },
    thumb: 'magenta',
    glyph: '+P/L',
  },
];

export const isTodo = (v) => typeof v === 'string' && v.startsWith('TODO_');
