import './styles/main.css';
import { initScroll } from './modules/scroll.js';
import { initNav } from './modules/nav.js';
import { initHero } from './modules/hero.js';
import { initMatrix } from './modules/matrix.js';
import { initStats } from './modules/stats.js';
import { initMarquee } from './modules/marquee.js';
import { initTilt } from './modules/tilt.js';

document.getElementById('year').textContent = String(new Date().getFullYear());

initNav();
initMarquee();
initScroll();
initHero();
initMatrix();
initStats();
initTilt();
