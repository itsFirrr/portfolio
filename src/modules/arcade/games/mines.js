// Minesweeper 9x9, 10 ranjau. Klik pertama selalu aman. Klik kanan / mode bendera untuk menandai.
const W = 9;
const H = 9;
const MINES = 10;

export default {
  mount(stage, api) {
    stage.innerHTML = `
      <div class="mines__bar">
        <span>💣 <b data-left>${MINES}</b></span>
        <button type="button" class="btn btn--ghost mines__mode" aria-pressed="false">mode: gali ⛏</button>
        <span>⏱ <b data-time>0</b>s</span>
      </div>
      <div class="mines" role="grid" aria-label="Papan Minesweeper"></div>
      <p class="arcade__help">Klik untuk membuka, klik kanan atau mode 🚩 untuk bendera.</p>`;
    const boardEl = stage.querySelector('.mines');
    const modeBtn = stage.querySelector('.mines__mode');
    const leftEl = stage.querySelector('[data-left]');
    const timeEl = stage.querySelector('[data-time]');

    const cells = Array.from({ length: W * H }, () => ({ mine: false, open: false, flag: false, n: 0 }));
    let started = false;
    let over = false;
    let flagMode = false;
    let seconds = 0;
    let opened = 0;

    const idx = (x, y) => y * W + x;
    const neighbors = (i) => {
      const x = i % W;
      const y = (i / W) | 0;
      const out = [];
      for (let dy = -1; dy <= 1; dy++)
        for (let dx = -1; dx <= 1; dx++) {
          const nx = x + dx;
          const ny = y + dy;
          if ((dx || dy) && nx >= 0 && ny >= 0 && nx < W && ny < H) out.push(idx(nx, ny));
        }
      return out;
    };

    // Tanam ranjau setelah klik pertama supaya klik pertama (dan tetangganya) aman
    const plant = (safe) => {
      const banned = new Set([safe, ...neighbors(safe)]);
      let placed = 0;
      while (placed < MINES) {
        const i = (Math.random() * cells.length) | 0;
        if (cells[i].mine || banned.has(i)) continue;
        cells[i].mine = true;
        placed++;
      }
      cells.forEach((c, i) => {
        c.n = neighbors(i).filter((j) => cells[j].mine).length;
      });
    };

    boardEl.innerHTML = cells
      .map((_, i) => `<button type="button" class="mines__cell" data-i="${i}" aria-label="kotak ${(i % W) + 1},${((i / W) | 0) + 1}"></button>`)
      .join('');
    const btns = [...boardEl.children];

    const paint = (i) => {
      const c = cells[i];
      const b = btns[i];
      b.classList.toggle('is-open', c.open);
      b.classList.toggle('is-mine', c.open && c.mine);
      b.dataset.n = c.open && !c.mine ? c.n : '';
      b.textContent = c.open ? (c.mine ? '✹' : c.n || '') : c.flag ? '🚩' : '';
    };

    const finish = (win) => {
      over = true;
      cells.forEach((c, i) => {
        if (c.mine) {
          c.open = true;
          paint(i);
        }
      });
      api.gameOver(win ? Math.max(1, 999 - seconds) : 0, win ? `cleared in ${seconds}s` : 'BOOM 💥 kernel panic');
    };

    const open = (i) => {
      const stack = [i];
      while (stack.length) {
        const j = stack.pop();
        const c = cells[j];
        if (c.open || c.flag) continue;
        c.open = true;
        opened++;
        paint(j);
        if (c.mine) return finish(false);
        if (c.n === 0) stack.push(...neighbors(j));
      }
      api.setScore(opened);
      if (opened === W * H - MINES) finish(true);
    };

    const toggleFlag = (i) => {
      const c = cells[i];
      if (c.open) return;
      c.flag = !c.flag;
      paint(i);
      leftEl.textContent = String(MINES - cells.filter((x) => x.flag).length);
    };

    boardEl.addEventListener('click', (e) => {
      const b = e.target.closest('[data-i]');
      if (!b || over) return;
      const i = Number(b.dataset.i);
      if (flagMode) return toggleFlag(i);
      if (!started) {
        started = true;
        plant(i);
        api.every(1000, () => {
          if (!over) timeEl.textContent = String(++seconds);
        });
      }
      open(i);
    });
    boardEl.addEventListener('contextmenu', (e) => {
      const b = e.target.closest('[data-i]');
      if (!b) return;
      e.preventDefault();
      if (!over) toggleFlag(Number(b.dataset.i));
    });
    modeBtn.addEventListener('click', () => {
      flagMode = !flagMode;
      modeBtn.setAttribute('aria-pressed', String(flagMode));
      modeBtn.textContent = flagMode ? 'mode: bendera 🚩' : 'mode: gali ⛏';
    });
    // Navigasi panah antar kotak untuk keyboard
    api.onKey((e) => {
      const i = btns.indexOf(document.activeElement);
      if (i < 0) return;
      const moves = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -W, ArrowDown: W };
      if (moves[e.key] !== undefined) btns[Math.min(btns.length - 1, Math.max(0, i + moves[e.key]))].focus();
      if (e.key.toLowerCase() === 'f') toggleFlag(i);
    });
  },
};
