// Satu-satunya sumber konten proyek. Edit di sini saja.
// `live`/`repo` bernilai string URL, atau placeholder berawalan TODO_ bila belum ada.

export const GITHUB_URL = 'https://github.com/itsFirrr';

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
    thumb: 'magenta',
    glyph: '+P/L',
  },
];

export const isTodo = (v) => typeof v === 'string' && v.startsWith('TODO_');
