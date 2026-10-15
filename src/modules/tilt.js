// Tilt 3D ringan (maks 8 derajat) mengikuti kursor. Desktop saja, mati saat reduced motion.
import { prefersReducedMotion } from '../utils/reducedMotion.js';
import { isTouch } from '../utils/isMobile.js';

const MAX_DEG = 8;
const bound = new WeakSet();

function bind(el) {
  if (bound.has(el)) return;
  bound.add(el);
  let rafId = 0;
  let rect = null;
  let px = 0.5;
  let py = 0.5;

  const render = () => {
    rafId = 0;
    const rx = (0.5 - py) * MAX_DEG * 2;
    const ry = (px - 0.5) * MAX_DEG * 2;
    el.style.transform = `rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translateZ(0)`;
  };

  el.addEventListener('pointerenter', () => {
    // Cache rect sekali saat masuk untuk menghindari layout thrash di pointermove
    rect = el.getBoundingClientRect();
    el.style.transition = 'transform 0.1s linear, border-color 0.25s, box-shadow 0.25s';
  });
  el.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse' || !rect) return;
    px = (e.clientX - rect.left) / rect.width;
    py = (e.clientY - rect.top) / rect.height;
    if (!rafId) rafId = requestAnimationFrame(render);
  });
  el.addEventListener('pointerleave', () => {
    cancelAnimationFrame(rafId);
    rafId = 0;
    rect = null;
    el.style.transition = 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1), border-color 0.25s, box-shadow 0.25s';
    el.style.transform = '';
  });
}

/** Pasang tilt ke elemen `[data-tilt]` di dalam root (bisa dipanggil ulang untuk elemen baru). */
export function initTilt(root = document) {
  if (prefersReducedMotion() || isTouch()) return;
  root.querySelectorAll('[data-tilt]').forEach(bind);
}
