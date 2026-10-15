// Ganti tema aksen (green | cyan | magenta) dan mode CRT. Dipakai perintah `theme`/`crt` dan Konami code.
import { matrixRefreshColor } from './matrix.js';

export const THEMES = ['green', 'cyan', 'magenta'];

export function getTheme() {
  return document.documentElement.dataset.theme || 'green';
}

export function setTheme(name) {
  if (!THEMES.includes(name)) return false;
  if (name === 'green') delete document.documentElement.dataset.theme;
  else document.documentElement.dataset.theme = name;
  try {
    localStorage.setItem('itsfirrr-theme', name);
  } catch {
    /* storage tidak tersedia: tema tetap berlaku untuk sesi ini */
  }
  matrixRefreshColor();
  return true;
}

export function cycleTheme() {
  const next = THEMES[(THEMES.indexOf(getTheme()) + 1) % THEMES.length];
  setTheme(next);
  return next;
}

const CRT_KEY = 'itsfirrr-crt';

export function isCrt() {
  return document.documentElement.classList.contains('crt');
}

/** Mode CRT retro: scanline + vignette (lihat .crt di main.css). */
export function setCrt(on) {
  document.documentElement.classList.toggle('crt', Boolean(on));
  try {
    localStorage.setItem(CRT_KEY, on ? '1' : '0');
  } catch {
    /* storage tidak tersedia */
  }
  return Boolean(on);
}

export function initTheme() {
  try {
    if (localStorage.getItem(CRT_KEY) === '1') document.documentElement.classList.add('crt');
  } catch {
    /* abaikan */
  }
  let saved = null;
  try {
    saved = localStorage.getItem('itsfirrr-theme');
  } catch {
    saved = null;
  }
  if (saved) setTheme(saved);
}
