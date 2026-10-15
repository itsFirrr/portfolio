// Vibe coding: panel prompt AI mengetik permintaan, lalu editor palsu mengetik kode sendiri (loop).
// Lazy via IntersectionObserver; berhenti saat tidak terlihat atau tab tidak aktif.
import { prefersReducedMotion } from '../utils/reducedMotion.js';

const SNIPPETS = [
  {
    file: 'dryer.ino',
    prompt: 'Buat fungsi untuk membaca suhu dari sensor dan kirim ke Firebase tiap 5 detik.',
    code: `// Kanrung Tech: monitoring pengering cengkeh
#include <WiFi.h>
#include <Firebase_ESP_Client.h>

const int INTERVAL = 5000;
unsigned long lastSend = 0;

void loop() {
  if (millis() - lastSend > INTERVAL) {
    float temp = readTemp();
    Firebase.RTDB.setFloat(&db, "/dryer/temp", temp);
    lastSend = millis();
  }
}`,
  },
  {
    file: 'Cashier.php',
    prompt: 'Tambahkan method checkout di Livewire yang mengurangi stok dan mencatat hutang bila belum lunas.',
    code: `// WarPro: checkout kasir
public function checkout()
{
    DB::transaction(function () {
        foreach ($this->cart as $item) {
            Product::find($item['id'])
                ->decrement('stock', $item['qty']);
        }
        if ($this->paid < $this->total) {
            Debt::create(['amount' => $this->total - $this->paid]);
        }
    });
    $this->reset('cart');
}`,
  },
  {
    file: 'pnl_provider.dart',
    prompt: 'Hitung total P/L bulan ini dari jurnal trading pakai Riverpod.',
    code: `// Kalender PNL: total profit/loss bulanan
final monthlyPnl = Provider<double>((ref) {
  final trades = ref.watch(tradesProvider);
  final now = DateTime.now();
  return trades
      .where((t) => t.date.month == now.month)
      .fold(0.0, (sum, t) => sum + t.pnl);
});`,
  },
];

const KEYWORDS =
  /\b(const|final|return|if|else|foreach|as|function|public|private|void|float|int|unsigned|long|double|new|use|class|this|true|false|null)\b/;
const TOKEN_RE = new RegExp(
  [
    '(\\/\\/[^\\n]*)', // komentar
    '("(?:[^"\\\\\\n]|\\\\.)*"?|\'(?:[^\'\\\\\\n]|\\\\.)*\'?)', // string (boleh belum tertutup saat mengetik)
    '(#include|' + KEYWORDS.source + ')',
    '(\\b\\d+(?:\\.\\d+)?\\b)', // angka
    '([A-Za-z_]\\w*)(?=\\()', // pemanggilan fungsi
  ].join('|'),
  'g',
);

const escapeHtml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Highlight sederhana berbasis regex. */
function highlight(src) {
  let out = '';
  let last = 0;
  src.replace(TOKEN_RE, (m, com, str, kw, _k, num, fn, idx) => {
    out += escapeHtml(src.slice(last, idx));
    const cls = com ? 'com' : str ? 'str' : kw ? 'kw' : num ? 'num' : fn ? 'fn' : '';
    out += cls ? `<span class="tok-${cls}">${escapeHtml(m)}</span>` : escapeHtml(m);
    last = idx + m.length;
    return m;
  });
  return out + escapeHtml(src.slice(last));
}

export function initEditor() {
  const grid = document.getElementById('vibe-grid');
  const codeEl = document.querySelector('#editor-code code');
  const linesEl = document.getElementById('editor-lines');
  const tabEl = document.getElementById('editor-tab');
  const promptEl = document.getElementById('vibe-prompt');
  const statusEl = document.getElementById('vibe-status');
  if (!grid || !codeEl) return;

  const renderLines = (n) => {
    linesEl.innerHTML = Array.from({ length: n }, (_, i) => `<li>${i + 1}</li>`).join('');
  };

  const renderCode = (text, withCursor) => {
    codeEl.innerHTML = highlight(text) + (withCursor ? '<span class="editor__cursor"></span>' : '');
    renderLines(text.split('\n').length);
  };

  const showStatic = (s) => {
    tabEl.textContent = s.file;
    promptEl.textContent = s.prompt;
    statusEl.innerHTML = `Selesai. <span class="text-cyan">${s.file}</span> siap direview.`;
    renderCode(s.code, false);
  };

  // Reduced motion: tampilkan snippet pertama, ter-highlight, tanpa animasi
  if (prefersReducedMotion()) {
    showStatic(SNIPPETS[0]);
    return;
  }
  showStatic(SNIPPETS[0]);

  let running = false;
  let visible = false;
  let timer = 0;
  let wake = null;

  // Tunggu ms; bila section tak terlihat / tab tersembunyi, tahan sampai aktif lagi
  const sleep = (ms) =>
    new Promise((resolve) => {
      timer = setTimeout(async () => {
        while (!visible || document.hidden) {
          await new Promise((r) => (wake = r));
        }
        resolve();
      }, ms);
    });

  const resume = () => {
    if (wake && visible && !document.hidden) {
      const w = wake;
      wake = null;
      w();
    }
  };

  async function loop() {
    let idx = 0;
    for (;;) {
      const s = SNIPPETS[idx % SNIPPETS.length];
      tabEl.textContent = s.file;
      renderCode('', true);
      statusEl.textContent = '…';
      promptEl.textContent = '';
      for (const ch of s.prompt) {
        promptEl.textContent += ch;
        await sleep(22 + Math.random() * 30);
      }
      statusEl.innerHTML = 'Thinking<span class="text-neon">…</span>';
      await sleep(700);
      statusEl.innerHTML = `Menulis <span class="text-cyan">${s.file}</span>…`;
      let typed = '';
      for (const ch of s.code) {
        typed += ch;
        renderCode(typed, true);
        // Kecepatan acak; jeda lebih lama di akhir baris agar terasa "berpikir"
        await sleep(ch === '\n' ? 90 + Math.random() * 120 : 12 + Math.random() * 38);
      }
      renderCode(typed, false);
      statusEl.innerHTML = `Selesai. <span class="text-cyan">${s.file}</span> siap direview. <span class="text-neon">✓</span>`;
      await sleep(3200);
      idx++;
    }
  }

  const io = new IntersectionObserver(
    ([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !running) {
        running = true;
        loop();
      }
      resume();
    },
    { threshold: 0.2 },
  );
  io.observe(grid);
  document.addEventListener('visibilitychange', resume);

  // Bersihkan saat halaman ditutup (bfcache aman)
  window.addEventListener('pagehide', () => clearTimeout(timer));
}
