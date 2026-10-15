import './styles/main.css';
import { initScroll } from './modules/scroll.js';
import { initNav } from './modules/nav.js';

document.getElementById('year').textContent = String(new Date().getFullYear());

initNav();
initScroll();
