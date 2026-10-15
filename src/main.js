import './styles/main.css';
import { initScroll } from './modules/scroll.js';
import { initNav } from './modules/nav.js';
import { initHero } from './modules/hero.js';
import { initMatrix } from './modules/matrix.js';

document.getElementById('year').textContent = String(new Date().getFullYear());

initNav();
initScroll();
initHero();
initMatrix();
