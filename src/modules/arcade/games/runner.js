// Packet Runner: paket data lompat melewati firewall. Spasi/↑/tap untuk lompat. Ambil ACK untuk bonus.
export default {
  mount(stage, api) {
    stage.innerHTML = `
      <canvas class="arcade__canvas runner__canvas" aria-label="Packet Runner. Tekan spasi atau tap untuk lompat."></canvas>
      <p class="arcade__help">Spasi / ↑ / tap untuk lompat (tahan = lebih tinggi). Ambil <span class="text-cyan">ACK</span> untuk bonus.</p>`;
    const canvas = stage.querySelector('canvas');
    const ctx = canvas.getContext('2d');
    const col = {
      accent: api.color('--accent'),
      cyan: api.color('--neon-cyan'),
      danger: api.color('--danger'),
      grid: api.color('--border'),
      muted: api.color('--muted'),
    };
    let w = 0;
    let h = 0;
    const size = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = stage.clientWidth;
      h = 220;
      canvas.style.height = `${h}px`;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    size();

    const ground = () => h - 30;
    const p = { x: 50, y: 0, vy: 0, s: 22, onGround: true };
    let holding = false;
    let speed = 260;
    let dist = 0;
    let bonus = 0;
    let obstacles = [];
    let acks = [];
    let nextObs = 1;
    let over = false;
    let gridOffset = 0;

    const jump = () => {
      if (over || !p.onGround) return;
      p.vy = -620;
      p.onGround = false;
    };

    api.onKey((e) => {
      if (e.key === ' ' || e.key === 'ArrowUp' || e.key.toLowerCase() === 'w') {
        if (e.type === 'keydown' && !e.repeat) jump();
        holding = true;
      }
    });
    const keyup = (e) => {
      if (e.key === ' ' || e.key === 'ArrowUp' || e.key.toLowerCase() === 'w') holding = false;
    };
    window.addEventListener('keyup', keyup);
    const down = (e) => {
      e.preventDefault();
      holding = true;
      jump();
    };
    const up = () => (holding = false);
    canvas.addEventListener('pointerdown', down);
    window.addEventListener('pointerup', up);

    const hit = (a, b) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;

    api.loop((dt) => {
      if (over) return;
      // Fisika: gravitasi lebih ringan saat tombol ditahan (lompat lebih tinggi)
      p.vy += (holding && p.vy < 0 ? 1300 : 2400) * dt;
      p.y += p.vy * dt;
      const gy = ground() - p.s;
      if (p.y >= gy) {
        p.y = gy;
        p.vy = 0;
        p.onGround = true;
      }
      speed = Math.min(620, speed + 9 * dt);
      dist += speed * dt;
      gridOffset = (gridOffset + speed * dt) % 40;

      nextObs -= dt;
      if (nextObs <= 0) {
        const tall = 24 + Math.random() * 30;
        obstacles.push({ x: w + 10, y: ground() - tall, w: 16 + Math.random() * 14, h: tall });
        if (Math.random() < 0.5) acks.push({ x: w + 140 + Math.random() * 80, y: ground() - 90 - Math.random() * 40, w: 34, h: 16 });
        nextObs = 0.75 + Math.random() * 0.9 - Math.min(0.35, speed / 2000);
      }
      obstacles.forEach((o) => (o.x -= speed * dt));
      acks.forEach((a) => (a.x -= speed * dt));
      obstacles = obstacles.filter((o) => o.x + o.w > -10);
      acks = acks.filter((a) => a.x + a.w > -10 && !a.taken);

      const box = { x: p.x + 2, y: p.y + 2, w: p.s - 4, h: p.s - 4 };
      acks.forEach((a) => {
        if (hit(box, a)) {
          a.taken = true;
          bonus += 50;
        }
      });
      const score = Math.floor(dist / 10) + bonus;
      api.setScore(score);
      if (obstacles.some((o) => hit(box, o))) {
        over = true;
        api.gameOver(score, 'packet dropped by firewall 🧱');
      }

      // Render
      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = col.grid;
      ctx.lineWidth = 1;
      for (let x = -gridOffset; x < w; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, ground());
        ctx.lineTo(x - 20, h);
        ctx.stroke();
      }
      ctx.strokeStyle = col.accent;
      ctx.beginPath();
      ctx.moveTo(0, ground() + 0.5);
      ctx.lineTo(w, ground() + 0.5);
      ctx.stroke();
      obstacles.forEach((o) => {
        ctx.fillStyle = col.danger;
        ctx.fillRect(o.x, o.y, o.w, o.h);
        ctx.fillStyle = col.grid;
        for (let y = o.y + 6; y < o.y + o.h; y += 8) ctx.fillRect(o.x, y, o.w, 1);
      });
      ctx.font = '700 11px "JetBrains Mono", monospace';
      acks.forEach((a) => {
        ctx.strokeStyle = ctx.fillStyle = col.cyan;
        ctx.strokeRect(a.x, a.y, a.w, a.h);
        ctx.fillText('ACK', a.x + 6, a.y + 12);
      });
      ctx.fillStyle = col.accent;
      ctx.fillRect(p.x, p.y, p.s, p.s);
      ctx.fillStyle = col.muted;
      ctx.fillText(`${Math.round(speed / 10)} Mbps`, w - 80, 18);
    });

    const onResize = () => size();
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('keyup', keyup);
      window.removeEventListener('pointerup', up);
    };
  },
};
