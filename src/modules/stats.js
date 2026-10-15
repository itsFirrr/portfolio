// Counter stats 0 -> target saat masuk viewport (sekali jalan).
import { gsap } from 'gsap';
import { prefersReducedMotion } from '../utils/reducedMotion.js';

/** Animasikan angka elemen dari 0 ke target (langsung tampil bila reduced motion). */
export function animateCount(el, target) {
  if (prefersReducedMotion()) {
    el.textContent = String(target);
    return;
  }
  const state = { v: 0 };
  el.textContent = '0';
  gsap.to(state, {
    v: target,
    duration: 1.4,
    ease: 'power3.out',
    onUpdate: () => {
      el.textContent = String(Math.round(state.v));
    },
  });
}

export function initStats() {
  const nums = [...document.querySelectorAll('[data-count]')];
  if (!nums.length || prefersReducedMotion()) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        io.unobserve(entry.target);
        animateCount(entry.target, Number(entry.target.dataset.count) || 0);
      });
    },
    { threshold: 0.6 },
  );
  nums.forEach((n) => io.observe(n));
}
