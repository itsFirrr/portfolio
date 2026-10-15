// Counter stats 0 -> target saat masuk viewport (sekali jalan).
import { gsap } from 'gsap';
import { prefersReducedMotion } from '../utils/reducedMotion.js';

export function initStats() {
  const nums = [...document.querySelectorAll('[data-count]')];
  if (!nums.length || prefersReducedMotion()) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        io.unobserve(el);
        const target = Number(el.dataset.count) || 0;
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
      });
    },
    { threshold: 0.6 },
  );
  nums.forEach((n) => io.observe(n));
}
