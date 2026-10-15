import './styles/main.css';
import { initScroll } from './modules/scroll.js';
import { initNav } from './modules/nav.js';
import { initHero } from './modules/hero.js';
import { initMatrix } from './modules/matrix.js';
import { initStats } from './modules/stats.js';
import { initMarquee } from './modules/marquee.js';
import { initTilt } from './modules/tilt.js';
import { initProjects } from './modules/projects.js';
import { initTheme } from './modules/theme.js';
import { initTerminal } from './modules/terminal.js';

document.getElementById('year').textContent = String(new Date().getFullYear());

// Kritis untuk tampilan awal
initTheme();
initNav();
initMarquee();
initProjects();
initScroll();
initHero();
initMatrix();
initStats();
initTilt();
initTerminal();

const idle = (fn) =>
  'requestIdleCallback' in window ? requestIdleCallback(fn, { timeout: 2000 }) : setTimeout(fn, 600);

/** Muat modul secara lazy saat elemen mendekati viewport (chunk terpisah, tidak membebani load awal). */
function whenNear(id, load) {
  const el = document.getElementById(id);
  if (!el) return;
  const io = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      load();
    },
    { rootMargin: '400px 0px' },
  );
  io.observe(el);
}

whenNear('vibe', () => import('./modules/editor.js').then((m) => m.initEditor()));
idle(() => {
  import('./modules/cursor.js').then((m) => m.initCursor());
  import('./modules/konami.js').then((m) => m.initKonami());
});
