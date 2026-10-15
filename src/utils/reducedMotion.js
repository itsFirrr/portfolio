// Deteksi prefers-reduced-motion + helper untuk bereaksi saat preferensi berubah.
const query = window.matchMedia('(prefers-reduced-motion: reduce)');

export function prefersReducedMotion() {
  return query.matches;
}

/** Jalankan `fn` hanya bila motion diizinkan. Mengembalikan hasil fn atau null. */
export function withMotion(fn) {
  return query.matches ? null : fn();
}

/** Daftarkan callback saat preferensi berubah. Mengembalikan fungsi unsubscribe. */
export function onReducedMotionChange(cb) {
  const handler = (e) => cb(e.matches);
  query.addEventListener('change', handler);
  return () => query.removeEventListener('change', handler);
}
