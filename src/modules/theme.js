// Ganti tema aksen (green | cyan | magenta). Dipakai perintah `theme` dan Konami code.
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

export function initTheme() {
  let saved = null;
  try {
    saved = localStorage.getItem('itsfirrr-theme');
  } catch {
    saved = null;
  }
  if (saved) setTheme(saved);
}
