// Bug Hunt: bug muncul acak di baris kode. Pencet sebelum lolos ke production.
import { BUG_HUNT_CODE } from '../../../data/arcade.js';

const BUGS = ['🐛', '🪲', '🐞'];

export default {
  mount(stage, api) {
    stage.innerHTML = `
      <div class="bughunt__head"><span>lives <b data-lives>❤❤❤</b></span><span class="text-muted">bug lolos = prod down</span></div>
      <div class="bughunt window">
        <div class="window__bar"><span class="window__title">production.php</span></div>
        <ol class="bughunt__code">${BUG_HUNT_CODE.map((l) => `<li><code>${l.replace(/</g, '&lt;') || ' '}</code></li>`).join('')}</ol>
        <div class="bughunt__layer"></div>
      </div>
      <p class="arcade__help">Klik / tap bug. Makin lama makin banyak.</p>`;
    const layer = stage.querySelector('.bughunt__layer');
    const livesEl = stage.querySelector('[data-lives]');
    let lives = 3;
    let score = 0;
    let over = false;
    let spawnEvery = 1.1;
    let life = 2.2; // detik bug bertahan
    let acc = 0;
    const alive = new Set();

    const lose = (bug) => {
      if (!alive.has(bug)) return;
      alive.delete(bug);
      bug.remove();
      if (over) return;
      lives--;
      livesEl.textContent = '❤'.repeat(Math.max(0, lives)) + '♡'.repeat(3 - Math.max(0, lives));
      if (lives <= 0) {
        over = true;
        api.gameOver(score, `${score} bug dibasmi, sisanya masuk production 🔥`);
      }
    };

    const spawn = () => {
      const bug = document.createElement('button');
      bug.type = 'button';
      bug.className = 'bughunt__bug';
      bug.textContent = BUGS[(Math.random() * BUGS.length) | 0];
      bug.setAttribute('aria-label', 'bug');
      bug.style.left = `${5 + Math.random() * 85}%`;
      bug.style.top = `${4 + Math.random() * 86}%`;
      bug.ttl = life;
      layer.appendChild(bug);
      alive.add(bug);
    };

    layer.addEventListener('pointerdown', (e) => {
      const bug = e.target.closest('.bughunt__bug');
      if (!bug || over || !alive.has(bug)) return;
      alive.delete(bug);
      bug.classList.add('is-squashed');
      bug.textContent = '💥';
      api.timeout(250, () => bug.remove());
      score++;
      api.setScore(score);
      spawnEvery = Math.max(0.35, spawnEvery * 0.97);
      life = Math.max(1, life * 0.985);
    });
    // Keyboard: Enter/Spasi pada bug yang terfokus
    layer.addEventListener('click', (e) => {
      if (e.detail === 0) e.target.closest('.bughunt__bug')?.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
    });

    api.loop((dt) => {
      if (over) return;
      acc += dt;
      if (acc >= spawnEvery) {
        acc = 0;
        spawn();
      }
      alive.forEach((bug) => {
        bug.ttl -= dt;
        bug.style.opacity = String(Math.min(1, bug.ttl / 0.6 + 0.2));
        if (bug.ttl <= 0) lose(bug);
      });
    });
  },
};
