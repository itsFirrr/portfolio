// Prompt Roulette: AI menulis kode ber-bug, pilih prompt perbaikan yang benar sebelum waktu habis.
import { PROMPT_QUIZ } from '../../../data/arcade.js';

const ROUNDS = 6;
const SECONDS = 15;
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export default {
  mount(stage, api) {
    const qs = [...PROMPT_QUIZ].sort(() => Math.random() - 0.5).slice(0, ROUNDS);
    let round = 0;
    let score = 0;
    let correct = 0;
    let left = SECONDS;
    let locked = false;

    stage.innerHTML = `
      <div class="roulette__head"><span>round <b data-round>1</b>/${qs.length}</span><span>⏱ <b data-left>${SECONDS}</b>s</span></div>
      <div class="kasir__timer" aria-hidden="true"><span data-bar></span></div>
      <p class="text-muted roulette__who">ai &gt; ini kodenya, tapi kok error ya…</p>
      <pre class="roulette__code window"><code></code></pre>
      <p class="roulette__who text-muted">you &gt; pilih prompt perbaikan:</p>
      <div class="roulette__opts"></div>
      <p class="roulette__fb" aria-live="polite"></p>`;
    const $ = (s) => stage.querySelector(s);

    const show = () => {
      const q = qs[round];
      locked = false;
      left = SECONDS;
      $('[data-round]').textContent = String(round + 1);
      $('.roulette__code code').innerHTML = esc(q.code);
      $('.roulette__fb').textContent = '';
      $('.roulette__opts').innerHTML = q.options
        .map((o, i) => `<button type="button" class="roulette__opt" data-i="${i}"><kbd>${i + 1}</kbd> ${esc(o)}</button>`)
        .join('');
      $('.roulette__opt')?.focus({ preventScroll: true });
    };

    const answer = (i) => {
      if (locked) return;
      locked = true;
      const q = qs[round];
      const btns = stage.querySelectorAll('.roulette__opt');
      btns.forEach((b, j) => {
        b.disabled = true;
        if (j === q.answer) b.classList.add('is-right');
        else if (j === i) b.classList.add('is-wrong');
      });
      if (i === q.answer) {
        correct++;
        score += 100 + Math.round(left * 10);
        $('.roulette__fb').innerHTML = '<span class="text-neon">✓ AI: "ah iya, makasih. sudah diperbaiki."</span>';
      } else {
        $('.roulette__fb').innerHTML =
          i < 0 ? '<span class="text-danger">⌛ waktu habis, kode di-deploy apa adanya…</span>' : '<span class="text-danger">✗ AI malah menambah bug baru 🙃</span>';
      }
      api.setScore(score);
      api.timeout(1400, () => {
        round++;
        if (round >= qs.length) api.gameOver(score, `${correct}/${qs.length} bug diperbaiki`);
        else show();
      });
    };

    $('.roulette__opts').addEventListener('click', (e) => {
      const b = e.target.closest('[data-i]');
      if (b) answer(Number(b.dataset.i));
    });
    api.onKey((e) => {
      if (['1', '2', '3'].includes(e.key)) answer(Number(e.key) - 1);
    });
    api.loop((dt) => {
      if (locked) return;
      left = Math.max(0, left - dt);
      $('[data-left]').textContent = String(Math.ceil(left));
      $('[data-bar]').style.transform = `scaleX(${left / SECONDS})`;
      if (left <= 0) answer(-1);
    });
    show();
  },
};
