// 2048: gabungkan ubin bernilai sama. Panah/WASD atau swipe.
const KEYMAP = { ArrowUp: 'up', w: 'up', ArrowDown: 'down', s: 'down', ArrowLeft: 'left', a: 'left', ArrowRight: 'right', d: 'right' };

/** Geser satu baris ke kiri; kembalikan baris baru + skor gabungan. */
function slideRow(row) {
  const vals = row.filter(Boolean);
  const out = [];
  let gained = 0;
  for (let i = 0; i < vals.length; i++) {
    if (vals[i] === vals[i + 1]) {
      out.push(vals[i] * 2);
      gained += vals[i] * 2;
      i++;
    } else {
      out.push(vals[i]);
    }
  }
  while (out.length < 4) out.push(0);
  return { row: out, gained };
}

export default {
  mount(stage, api) {
    stage.innerHTML = `
      <div class="g2048" role="grid" aria-label="Papan 2048"></div>
      <p class="arcade__help">Panah / WASD atau swipe di papan. Target: <span class="text-neon">2048</span>.</p>`;
    const boardEl = stage.querySelector('.g2048');
    let grid = Array.from({ length: 4 }, () => [0, 0, 0, 0]);
    let score = 0;
    let won = false;

    const empty = () => {
      const cells = [];
      grid.forEach((r, y) => r.forEach((v, x) => !v && cells.push([x, y])));
      return cells;
    };
    const spawn = () => {
      const cells = empty();
      if (!cells.length) return;
      const [x, y] = cells[(Math.random() * cells.length) | 0];
      grid[y][x] = Math.random() < 0.9 ? 2 : 4;
    };
    const canMove = () =>
      empty().length > 0 || grid.some((r, y) => r.some((v, x) => v === r[x + 1] || v === grid[y + 1]?.[x]));

    const render = () => {
      boardEl.innerHTML = grid
        .map(
          (r) =>
            `<div role="row" class="g2048__row">${r
              .map((v) => `<div role="gridcell" class="g2048__cell" data-v="${Math.min(v, 4096)}">${v || ''}</div>`)
              .join('')}</div>`,
        )
        .join('');
    };

    // Rotasi grid supaya semua arah bisa memakai slideRow (kiri)
    const rotate = (g) => g[0].map((_, i) => g.map((r) => r[i]).reverse());
    const move = (dir) => {
      const turns = { left: 0, down: 1, right: 2, up: 3 }[dir];
      let g = grid.map((r) => [...r]);
      for (let i = 0; i < turns; i++) g = rotate(g);
      let gained = 0;
      g = g.map((r) => {
        const res = slideRow(r);
        gained += res.gained;
        return res.row;
      });
      for (let i = 0; i < (4 - turns) % 4; i++) g = rotate(g);
      const changed = g.some((r, y) => r.some((v, x) => v !== grid[y][x]));
      if (!changed) return;
      grid = g;
      score += gained;
      api.setScore(score);
      spawn();
      render();
      if (!won && grid.some((r) => r.includes(2048))) {
        won = true;
        const note = document.createElement('p');
        note.className = 'arcade__toast';
        note.textContent = '2048! Kamu boleh lanjut 🎉';
        stage.appendChild(note);
        api.timeout(2500, () => note.remove());
      }
      if (!canMove()) api.gameOver(score, 'no moves left');
    };

    api.onKey((e) => {
      const d = KEYMAP[e.key] || KEYMAP[e.key.toLowerCase()];
      if (d) move(d);
    });
    api.onSwipe(boardEl, move);

    spawn();
    spawn();
    render();
  },
};
