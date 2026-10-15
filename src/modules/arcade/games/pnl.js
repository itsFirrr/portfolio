// PNL Trader: harga bergerak acak; BUY/SELL untuk buka posisi long/short, tekan lagi untuk close.
// 7 "hari" trading, hasil tiap hari tercatat di kalender mini.
const DAYS = 7;
const CANDLES_PER_DAY = 14;
const CANDLE_SEC = 0.8;
const SIZE = 10; // unit per posisi

export default {
  mount(stage, api) {
    stage.innerHTML = `
      <div class="pnl__head">
        <span>day <b data-day>1</b>/${DAYS}</span>
        <span>price <b data-price>100.00</b></span>
        <span>pos <b data-pos>flat</b></span>
        <span>P/L hari ini <b data-today>0</b></span>
      </div>
      <canvas class="arcade__canvas pnl__chart" aria-label="Grafik candle harga"></canvas>
      <div class="pnl__actions">
        <button type="button" class="btn pnl__buy" data-act="buy">BUY ▲ <kbd>B</kbd></button>
        <button type="button" class="btn pnl__sell" data-act="sell">SELL ▼ <kbd>S</kbd></button>
      </div>
      <ol class="pnl__cal" aria-label="Kalender P/L"></ol>`;
    const $ = (s) => stage.querySelector(s);
    const canvas = $('canvas');
    const ctx = canvas.getContext('2d');
    const col = { up: api.color('--neon-green'), down: api.color('--danger'), grid: api.color('--border'), text: api.color('--muted'), line: api.color('--neon-cyan') };

    $('.pnl__cal').innerHTML = Array.from({ length: DAYS }, (_, i) => `<li data-d="${i}"><span>D${i + 1}</span><b>-</b></li>`).join('');

    let w = 0;
    let h = 0;
    const size = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = stage.clientWidth;
      h = Math.min(260, Math.max(180, w * 0.45));
      canvas.style.height = `${h}px`;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    size();

    let price = 100;
    let drift = 0;
    let candles = [];
    let cur = { o: price, h: price, l: price, c: price };
    let t = 0;
    let day = 0;
    let candleInDay = 0;
    let pos = null; // { side: 1 | -1, entry }
    let realizedToday = 0;
    let total = 0;
    let over = false;

    const unreal = () => (pos ? (price - pos.entry) * pos.side * SIZE : 0);
    const fmt = (n) => (n >= 0 ? '+' : '') + n.toFixed(1);

    const hud = () => {
      $('[data-day]').textContent = String(day + 1);
      $('[data-price]').textContent = price.toFixed(2);
      $('[data-pos]').textContent = pos ? `${pos.side > 0 ? 'LONG' : 'SHORT'} @${pos.entry.toFixed(2)}` : 'flat';
      const today = realizedToday + unreal();
      const el = $('[data-today]');
      el.textContent = fmt(today);
      el.className = today >= 0 ? 'text-neon' : 'text-danger';
    };

    const close = () => {
      if (!pos) return;
      realizedToday += unreal();
      pos = null;
    };

    const act = (side) => {
      if (over) return;
      if (pos && pos.side !== side) close();
      else if (!pos) pos = { side, entry: price };
      hud();
    };

    const endDay = () => {
      close();
      const li = $(`[data-d="${day}"]`);
      li.classList.add(realizedToday >= 0 ? 'is-win' : 'is-loss');
      li.querySelector('b').textContent = fmt(realizedToday);
      total += realizedToday;
      api.setScore(Math.round(total));
      realizedToday = 0;
      day++;
      candleInDay = 0;
      if (day >= DAYS) {
        over = true;
        const greens = stage.querySelectorAll('.pnl__cal .is-win').length;
        api.gameOver(Math.round(total), `${greens}/${DAYS} hari hijau · total ${fmt(total)}`);
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const all = [...candles, cur];
      const view = all.slice(-28);
      const hi = Math.max(...view.map((c) => c.h)) + 0.5;
      const lo = Math.min(...view.map((c) => c.l)) - 0.5;
      const y = (v) => h - 12 - ((v - lo) / (hi - lo)) * (h - 24);
      const cw = w / 28;
      ctx.strokeStyle = col.grid;
      ctx.lineWidth = 1;
      for (let i = 1; i < 4; i++) {
        ctx.beginPath();
        ctx.moveTo(0, (h / 4) * i);
        ctx.lineTo(w, (h / 4) * i);
        ctx.stroke();
      }
      view.forEach((c, i) => {
        const x = i * cw + cw / 2;
        const color = c.c >= c.o ? col.up : col.down;
        ctx.strokeStyle = ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(x, y(c.h));
        ctx.lineTo(x, y(c.l));
        ctx.stroke();
        const top = y(Math.max(c.o, c.c));
        ctx.fillRect(x - cw * 0.3, top, cw * 0.6, Math.max(1, y(Math.min(c.o, c.c)) - top));
      });
      if (pos) {
        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = col.line;
        ctx.beginPath();
        ctx.moveTo(0, y(pos.entry));
        ctx.lineTo(w, y(pos.entry));
        ctx.stroke();
        ctx.setLineDash([]);
      }
    };

    stage.querySelector('.pnl__actions').addEventListener('click', (e) => {
      const b = e.target.closest('[data-act]');
      if (b) act(b.dataset.act === 'buy' ? 1 : -1);
    });
    api.onKey((e) => {
      const k = e.key.toLowerCase();
      if (k === 'b' || e.key === 'ArrowUp') act(1);
      if (k === 's' || e.key === 'ArrowDown') act(-1);
    });

    let tickAcc = 0;
    api.loop((dt) => {
      if (over) return;
      tickAcc += dt;
      t += dt;
      // Random walk dengan drift yang berganti-ganti (tren pendek)
      while (tickAcc >= 0.05) {
        tickAcc -= 0.05;
        if (Math.random() < 0.02) drift = (Math.random() - 0.5) * 0.12;
        price = Math.max(5, price + drift + (Math.random() - 0.5) * 0.45);
        cur.h = Math.max(cur.h, price);
        cur.l = Math.min(cur.l, price);
        cur.c = price;
      }
      if (t >= CANDLE_SEC) {
        t = 0;
        candles.push(cur);
        if (candles.length > 60) candles.shift();
        cur = { o: price, h: price, l: price, c: price };
        candleInDay++;
        if (candleInDay >= CANDLES_PER_DAY) endDay();
      }
      hud();
      draw();
    });

    const onResize = () => size();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  },
};
