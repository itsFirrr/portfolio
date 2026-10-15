// "itsfirrr arcade": modal berisi menu minigame. Dibuka lewat Konami code atau `play` di terminal.
// Modul ini dan tiap game di-import dinamis, jadi tidak membebani load awal halaman.
import { gsap } from 'gsap';
import { stopScroll, startScroll } from '../scroll.js';
import { prefersReducedMotion } from '../../utils/reducedMotion.js';
import { GAME_LIST } from '../../data/games.js';
import { sfx } from '../sound.js';

// Loader tiap game; metadata (judul, deskripsi) ada di src/data/games.js
const LOADERS = {
  kasir: () => import('./games/kasir.js'),
  pnl: () => import('./games/pnl.js'),
  bughunt: () => import('./games/bughunt.js'),
  typer: () => import('./games/typer.js'),
  roulette: () => import('./games/roulette.js'),
  runner: () => import('./games/runner.js'),
  snake: () => import('./games/snake.js'),
  2048: () => import('./games/g2048.js'),
  mines: () => import('./games/mines.js'),
};

export const GAMES = GAME_LIST.map((g) => ({ ...g, load: LOADERS[g.id] }));

const BEST_KEY = 'itsfirrr-arcade-best';

function readBest() {
  try {
    return JSON.parse(localStorage.getItem(BEST_KEY)) || {};
  } catch {
    return {};
  }
}

function isBestPreview(id, score) {
  const prev = readBest()[id];
  return prev === undefined || score > prev;
}

function saveBest(id, score) {
  const all = readBest();
  if (all[id] !== undefined && all[id] >= score) return false;
  all[id] = score;
  try {
    localStorage.setItem(BEST_KEY, JSON.stringify(all));
  } catch {
    /* storage tidak tersedia: skor tertinggi hanya berlaku sesi ini */
  }
  return true;
}

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

let ui = null;
let current = null; // { game, meta, cleanups, destroy }
let opener = null;

function buildUi() {
  const root = document.createElement('div');
  root.className = 'arcade';
  root.hidden = true;
  root.innerHTML = `
    <div class="arcade__backdrop" data-arcade-close></div>
    <div class="arcade__dialog window" role="dialog" aria-modal="true" aria-labelledby="arcade-title" tabindex="-1" data-lenis-prevent>
      <div class="window__bar">
        <span class="dots" aria-hidden="true"><i></i><i></i><i></i></span>
        <span class="window__title" id="arcade-title">itsfirrr arcade</span>
        <button type="button" class="modal__close" data-arcade-close aria-label="Tutup arcade">✕</button>
      </div>
      <div class="arcade__hud" hidden>
        <button type="button" class="arcade__back" data-arcade-menu>← menu</button>
        <span class="arcade__game-title"></span>
        <span class="arcade__score" aria-live="off">score <b data-score>0</b></span>
        <span class="arcade__best">best <b data-best>0</b></span>
      </div>
      <div class="arcade__body"></div>
    </div>`;
  document.body.appendChild(root);
  const dialog = root.querySelector('.arcade__dialog');
  ui = {
    root,
    dialog,
    backdrop: root.querySelector('.arcade__backdrop'),
    title: root.querySelector('#arcade-title'),
    hud: root.querySelector('.arcade__hud'),
    gameTitle: root.querySelector('.arcade__game-title'),
    score: root.querySelector('[data-score]'),
    best: root.querySelector('[data-best]'),
    body: root.querySelector('.arcade__body'),
  };

  root.addEventListener('click', (e) => {
    if (e.target.closest('[data-arcade-close]')) closeArcade();
    else if (e.target.closest('[data-arcade-menu]')) showMenu();
    else {
      const card = e.target.closest('[data-game]');
      if (card) startGame(card.dataset.game);
    }
  });
}

const focusables = () =>
  [...ui.dialog.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])')].filter(
    (el) => el.offsetParent !== null,
  );

function onKeydown(e) {
  if (e.key === 'Escape') {
    e.preventDefault();
    closeArcade();
    return;
  }
  if (e.key !== 'Tab') return;
  // Focus trap di dalam arcade
  const f = focusables();
  if (!f.length) return;
  const first = f[0];
  const last = f[f.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
}

/** Hentikan game yang sedang berjalan dan jalankan semua cleanup-nya. */
function stopGame() {
  if (!current) return;
  try {
    current.destroy?.();
  } finally {
    current.cleanups.forEach((fn) => fn());
    current = null;
  }
}

function showMenu() {
  stopGame();
  const best = readBest();
  ui.hud.hidden = true;
  ui.title.textContent = 'itsfirrr arcade';
  ui.body.innerHTML = `
    <p class="arcade__intro"><span class="prompt">$</span> ls ~/arcade <span class="text-muted">// pilih game, Esc untuk keluar</span></p>
    <ul class="arcade__menu">
      ${GAMES.map(
        (g) => `
        <li>
          <button type="button" class="arcade__card" data-game="${g.id}">
            <span class="arcade__tag">${esc(g.tag)}</span>
            <span class="arcade__card-title">${esc(g.title)}</span>
            <span class="arcade__card-desc">${esc(g.desc)}</span>
            <span class="arcade__card-best">best: ${best[g.id] ?? '-'}</span>
          </button>
        </li>`,
      ).join('')}
    </ul>`;
  ui.body.querySelector('[data-game]')?.focus({ preventScroll: true });
}

/** API yang diberikan ke tiap game. Semua listener/loop yang didaftarkan lewat sini dibersihkan otomatis. */
function makeApi(meta, stage, cleanups) {
  const css = getComputedStyle(document.documentElement);
  let running = true;
  const api = {
    reducedMotion: prefersReducedMotion(),
    color: (token) => css.getPropertyValue(token).trim(),
    sfx,
    setScore(n) {
      // Bunyi "coin" tiap skor naik (dibatasi oleh sound.js; mati bila suara off)
      if (n > Number(ui.score.textContent)) sfx('coin');
      ui.score.textContent = String(n);
    },
    /** Daftarkan keydown di window; panah/spasi tidak menggulir halaman. */
    onKey(handler) {
      const fn = (e) => {
        if (e.key === 'Escape' || e.key === 'Tab') return;
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key) && !(e.target instanceof HTMLInputElement)) {
          e.preventDefault();
        }
        handler(e);
      };
      window.addEventListener('keydown', fn);
      cleanups.push(() => window.removeEventListener('keydown', fn));
    },
    /** Loop rAF dengan delta waktu (detik). Otomatis berhenti saat tab disembunyikan. */
    loop(step) {
      let raf = 0;
      let last = 0;
      const tick = (t) => {
        raf = requestAnimationFrame(tick);
        if (document.hidden || !running) {
          last = 0;
          return;
        }
        const dt = last ? Math.min(0.05, (t - last) / 1000) : 0;
        last = t;
        step(dt);
      };
      raf = requestAnimationFrame(tick);
      const stop = () => cancelAnimationFrame(raf);
      cleanups.push(stop);
      return stop;
    },
    /** Interval yang dibersihkan otomatis dan dilewati saat tab tidak aktif. */
    every(ms, fn) {
      const id = setInterval(() => {
        if (!document.hidden && running) fn();
      }, ms);
      cleanups.push(() => clearInterval(id));
      return () => clearInterval(id);
    },
    timeout(ms, fn) {
      const id = setTimeout(fn, ms);
      cleanups.push(() => clearTimeout(id));
      return id;
    },
    /** Deteksi swipe (arah: up/down/left/right) pada elemen. */
    onSwipe(el, cb) {
      let sx = 0;
      let sy = 0;
      const down = (e) => {
        sx = e.clientX;
        sy = e.clientY;
      };
      const up = (e) => {
        const dx = e.clientX - sx;
        const dy = e.clientY - sy;
        if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) return;
        cb(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : dy > 0 ? 'down' : 'up');
      };
      el.addEventListener('pointerdown', down);
      el.addEventListener('pointerup', up);
      cleanups.push(() => {
        el.removeEventListener('pointerdown', down);
        el.removeEventListener('pointerup', up);
      });
    },
    /** Selesaikan game: simpan skor tertinggi dan tampilkan layar game over. */
    gameOver(score, message = 'game over') {
      if (!running) return;
      running = false;
      sfx(isBestPreview(meta.id, score) ? 'success' : 'over');
      const isBest = saveBest(meta.id, score);
      ui.best.textContent = String(readBest()[meta.id] ?? score);
      const over = document.createElement('div');
      over.className = 'arcade__over';
      over.setAttribute('role', 'status');
      over.innerHTML = `
        <p class="arcade__over-title">${esc(message)}</p>
        <p>score: <b class="text-neon">${esc(score)}</b>${isBest ? ' <span class="text-warn">★ new best</span>' : ''}</p>
        <div class="arcade__over-actions">
          <button type="button" class="btn btn--primary" data-again>main lagi</button>
          <button type="button" class="btn btn--ghost" data-arcade-menu>menu</button>
        </div>`;
      stage.appendChild(over);
      over.querySelector('[data-again]').addEventListener('click', () => startGame(meta.id));
      over.querySelector('[data-again]').focus({ preventScroll: true });
    },
  };
  return api;
}

async function startGame(id) {
  const meta = GAMES.find((g) => g.id === id);
  if (!meta) return;
  stopGame();
  ui.title.textContent = `arcade://${meta.id}`;
  ui.gameTitle.textContent = meta.title;
  ui.score.textContent = '0';
  ui.best.textContent = String(readBest()[meta.id] ?? 0);
  ui.hud.hidden = false;
  ui.body.innerHTML = '<p class="text-muted arcade__loading">loading…</p>';

  const token = {};
  current = { meta, cleanups: [], token };
  const { default: game } = await meta.load();
  if (current?.token !== token) return; // user sudah pindah game saat loading

  const stage = document.createElement('div');
  stage.className = `arcade__stage arcade__stage--${meta.id}`;
  ui.body.innerHTML = '';
  ui.body.appendChild(stage);
  const api = makeApi(meta, stage, current.cleanups);
  current.destroy = game.mount(stage, api);
  // Fokus ke stage agar input keyboard langsung jalan (kecuali game menaruh fokus sendiri)
  if (!stage.contains(document.activeElement)) {
    stage.tabIndex = -1;
    stage.focus({ preventScroll: true });
  }
}

/** Buka arcade; bila `gameId` diberikan langsung masuk ke game tersebut. */
export function openArcade(gameId) {
  if (!ui) buildUi();
  if (ui.root.hidden) {
    opener = document.activeElement;
    ui.root.hidden = false;
    document.body.classList.add('is-locked', 'arcade-open');
    stopScroll();
    document.addEventListener('keydown', onKeydown);
    if (!prefersReducedMotion()) {
      gsap.fromTo(ui.backdrop, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'power3.out' });
      gsap.fromTo(ui.dialog, { opacity: 0, scale: 0.92, y: 20 }, { opacity: 1, scale: 1, y: 0, duration: 0.35, ease: 'power3.out' });
    }
    ui.dialog.focus({ preventScroll: true });
  }
  if (gameId && GAMES.some((g) => g.id === gameId)) startGame(gameId);
  else showMenu();
}

export function closeArcade() {
  if (!ui || ui.root.hidden) return;
  stopGame();
  document.removeEventListener('keydown', onKeydown);
  ui.root.hidden = true;
  gsap.set([ui.dialog, ui.backdrop], { clearProps: 'all' });
  document.body.classList.remove('is-locked', 'arcade-open');
  startScroll();
  if (opener instanceof HTMLElement && document.contains(opener)) opener.focus({ preventScroll: true });
}
