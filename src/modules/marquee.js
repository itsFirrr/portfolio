// Marquee tech stack: duplikasi item agar loop translateX(-50%) mulus. Statis saat reduced motion.
import { prefersReducedMotion, onReducedMotionChange } from '../utils/reducedMotion.js';

export function initMarquee() {
  const marquee = document.querySelector('.marquee');
  if (!marquee) return;
  const tracks = [...marquee.querySelectorAll('.marquee__track')];
  const originals = tracks.map((t) => t.innerHTML);

  const enable = () => {
    tracks.forEach((t, i) => {
      // Salinan disembunyikan dari screen reader agar tidak dibaca dua kali
      const clone = originals[i].replace(/<li>/g, '<li aria-hidden="true">');
      t.innerHTML = originals[i] + clone;
    });
    marquee.classList.add('is-running');
  };

  const disable = () => {
    tracks.forEach((t, i) => {
      t.innerHTML = originals[i];
    });
    marquee.classList.remove('is-running');
  };

  if (!prefersReducedMotion()) enable();
  onReducedMotionChange((reduced) => (reduced ? disable() : enable()));
}
