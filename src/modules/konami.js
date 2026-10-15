// Easter egg Konami code: ↑ ↑ ↓ ↓ ← → ← → B A
// Efek: toggle tema magenta, Matrix rain "burst", glitch nama, pesan ACCESS GRANTED, lalu buka arcade minigame.
import { getTheme, setTheme } from './theme.js';
import { matrixBurst } from './matrix.js';
import { glitchName } from './hero.js';
import { prefersReducedMotion } from '../utils/reducedMotion.js';

const SEQUENCE = ['arrowup', 'arrowup', 'arrowdown', 'arrowdown', 'arrowleft', 'arrowright', 'arrowleft', 'arrowright', 'b', 'a'];

function trigger() {
  const enabling = getTheme() !== 'magenta';
  setTheme(enabling ? 'magenta' : 'green');

  const flash = document.createElement('div');
  flash.className = 'konami-flash';
  flash.setAttribute('role', 'status');
  flash.textContent = enabling ? '> ACCESS GRANTED: neon mode unlocked' : '> neon mode off';
  document.body.appendChild(flash);
  setTimeout(() => flash.remove(), prefersReducedMotion() ? 1800 : 2300);

  if (enabling) {
    matrixBurst(3500);
    glitchName();
  }
  // Arcade dimuat lazy, baru diunduh saat easter egg ditemukan
  import('./arcade/arcade.js').then((m) => m.openArcade());
}

export function initKonami() {
  // Buffer 10 tombol terakhir; cocokkan dengan urutan (tahan terhadap tombol berulang seperti ↑↑↑)
  const buffer = [];
  document.addEventListener('keydown', (e) => {
    // Abaikan saat mengetik di terminal agar perintah tidak terganggu
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
    // Jangan terpicu saat sedang bermain (panah dipakai game)
    if (document.body.classList.contains('arcade-open')) return;
    buffer.push(e.key.toLowerCase());
    if (buffer.length > SEQUENCE.length) buffer.shift();
    if (buffer.length === SEQUENCE.length && buffer.every((k, i) => k === SEQUENCE[i])) {
      buffer.length = 0;
      trigger();
    }
  });
}
