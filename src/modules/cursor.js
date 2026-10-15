// Cursor glow mengikuti kursor dengan lerp. Desktop saja; mati di layar sentuh & reduced motion.
import { prefersReducedMotion, onReducedMotionChange } from '../utils/reducedMotion.js';
import { isTouch } from '../utils/isMobile.js';

export function initCursor() {
  const glow = document.getElementById('cursor-glow');
  if (!glow || isTouch() || prefersReducedMotion()) {
    glow?.remove();
    return;
  }

  let tx = window.innerWidth / 2;
  let ty = window.innerHeight / 2;
  let x = tx;
  let y = ty;
  let rafId = 0;

  const tick = () => {
    x += (tx - x) * 0.15;
    y += (ty - y) * 0.15;
    glow.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
    // Berhenti sendiri bila sudah dekat target, supaya tidak ada rAF yang jalan terus
    if (Math.abs(tx - x) > 0.3 || Math.abs(ty - y) > 0.3) rafId = requestAnimationFrame(tick);
    else rafId = 0;
  };

  const onMove = (e) => {
    if (e.pointerType !== 'mouse') return;
    tx = e.clientX;
    ty = e.clientY;
    glow.classList.add('is-active');
    if (!rafId) rafId = requestAnimationFrame(tick);
  };
  const onLeave = () => glow.classList.remove('is-active');

  window.addEventListener('pointermove', onMove, { passive: true });
  document.documentElement.addEventListener('pointerleave', onLeave);

  onReducedMotionChange((reduced) => {
    if (!reduced) return;
    cancelAnimationFrame(rafId);
    window.removeEventListener('pointermove', onMove);
    document.documentElement.removeEventListener('pointerleave', onLeave);
    glow.remove();
  });
}
