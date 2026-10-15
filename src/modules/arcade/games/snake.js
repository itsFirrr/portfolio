// Snake neon: makan "byte", jangan tabrak dinding atau badan sendiri.
const N = 18; // grid N x N
const DIRS = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
const KEYMAP = { ArrowUp: 'up', w: 'up', ArrowDown: 'down', s: 'down', ArrowLeft: 'left', a: 'left', ArrowRight: 'right', d: 'right' };

export default {
  mount(stage, api) {
    stage.innerHTML = `
      <canvas class="arcade__canvas arcade__canvas--square" aria-label="Papan Snake"></canvas>
      <p class="arcade__help">Panah / WASD atau swipe. Makan <span class="text-neon">■</span>, jangan tabrak dinding.</p>
      <div class="arcade__pad" aria-label="Kontrol arah">
        <button type="button" data-dir="up" aria-label="Atas">▲</button>
        <button type="button" data-dir="left" aria-label="Kiri">◀</button>
        <button type="button" data-dir="down" aria-label="Bawah">▼</button>
        <button type="button" data-dir="right" aria-label="Kanan">▶</button>
      </div>`;
    const canvas = stage.querySelector('canvas');
    const ctx = canvas.getContext('2d');
    const accent = api.color('--accent');
    const food = api.color('--neon-cyan');
    const border = api.color('--border');
    const bg = api.color('--bg');

    let cell = 0;
    const size = () => {
      const px = Math.min(stage.clientWidth, 420);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      cell = px / N;
      canvas.style.width = canvas.style.height = `${px}px`;
      canvas.width = canvas.height = Math.floor(px * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    size();

    let snake = [
      [8, 9],
      [7, 9],
      [6, 9],
    ];
    let dir = 'right';
    let queue = [];
    let apple = null;
    let score = 0;
    let acc = 0;
    let speed = 0.13; // detik per langkah
    let dead = false;

    const placeApple = () => {
      do {
        apple = [(Math.random() * N) | 0, (Math.random() * N) | 0];
      } while (snake.some(([x, y]) => x === apple[0] && y === apple[1]));
    };
    placeApple();

    const turn = (d) => {
      const lastDir = queue.length ? queue[queue.length - 1] : dir;
      const [lx, ly] = DIRS[lastDir];
      const [nx, ny] = DIRS[d];
      if (lx + nx === 0 && ly + ny === 0) return; // tidak boleh balik arah
      if (queue.length < 3) queue.push(d);
    };

    api.onKey((e) => {
      const d = KEYMAP[e.key] || KEYMAP[e.key.toLowerCase()];
      if (d) turn(d);
    });
    api.onSwipe(canvas, turn);
    stage.querySelector('.arcade__pad').addEventListener('click', (e) => {
      const b = e.target.closest('[data-dir]');
      if (b) turn(b.dataset.dir);
    });

    const draw = () => {
      const px = cell * N;
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, px, px);
      ctx.strokeStyle = border;
      ctx.lineWidth = 1;
      ctx.strokeRect(0.5, 0.5, px - 1, px - 1);
      ctx.fillStyle = food;
      ctx.fillRect(apple[0] * cell + 3, apple[1] * cell + 3, cell - 6, cell - 6);
      snake.forEach(([x, y], i) => {
        ctx.globalAlpha = i === 0 ? 1 : Math.max(0.35, 1 - i / (snake.length + 4));
        ctx.fillStyle = accent;
        ctx.fillRect(x * cell + 1, y * cell + 1, cell - 2, cell - 2);
      });
      ctx.globalAlpha = 1;
    };

    const step = () => {
      if (queue.length) dir = queue.shift();
      const [dx, dy] = DIRS[dir];
      const head = [snake[0][0] + dx, snake[0][1] + dy];
      const hitWall = head[0] < 0 || head[1] < 0 || head[0] >= N || head[1] >= N;
      const hitSelf = snake.slice(0, -1).some(([x, y]) => x === head[0] && y === head[1]);
      if (hitWall || hitSelf) {
        dead = true;
        api.gameOver(score, hitWall ? 'segfault: nabrak dinding' : 'stack overflow: makan ekor sendiri');
        return;
      }
      snake.unshift(head);
      if (head[0] === apple[0] && head[1] === apple[1]) {
        score += 10;
        api.setScore(score);
        speed = Math.max(0.06, speed - 0.004);
        placeApple();
      } else {
        snake.pop();
      }
    };

    api.loop((dt) => {
      if (dead) return;
      acc += dt;
      while (acc >= speed && !dead) {
        acc -= speed;
        step();
      }
      draw();
    });

    const onResize = () => {
      size();
      draw();
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  },
};
