// Deteksi layar sentuh / viewport kecil untuk mematikan efek khusus desktop.
const coarse = window.matchMedia('(hover: none), (pointer: coarse)');
const small = window.matchMedia('(max-width: 767px)');

/** true bila perangkat utama berupa layar sentuh (tanpa hover presisi). */
export function isTouch() {
  return coarse.matches;
}

/** true bila viewport kecil (mobile). */
export function isMobile() {
  return small.matches || coarse.matches;
}
