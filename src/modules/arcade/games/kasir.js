// Kasir Rush (WarPro): hitung kembalian sebelum waktu habis. Salah/telat = masuk buku hutang.
import { WARUNG_ITEMS, CUSTOMERS } from '../../../data/arcade.js';

const rupiah = (n) => `Rp${n.toLocaleString('id-ID')}`;
const pick = (arr) => arr[(Math.random() * arr.length) | 0];
const NOTES = [5000, 10000, 20000, 50000, 100000];

export default {
  mount(stage, api) {
    stage.innerHTML = `
      <div class="kasir">
        <div class="kasir__receipt window">
          <div class="window__bar"><span class="window__title">warpro://pos</span><span class="kasir__lives" aria-label="nyawa"></span></div>
          <div class="window__body">
            <p class="kasir__customer"></p>
            <ul class="kasir__items"></ul>
            <p class="kasir__total"></p>
            <p class="kasir__paid"></p>
            <div class="kasir__timer" aria-hidden="true"><span></span></div>
          </div>
        </div>
        <form class="kasir__form">
          <label for="kasir-input">Kembalian (Rp)</label>
          <input id="kasir-input" class="kasir__input" inputmode="numeric" autocomplete="off" />
          <div class="kasir__keys">
            ${[1, 2, 3, 4, 5, 6, 7, 8, 9, '000', 0, '⌫'].map((k) => `<button type="button" data-k="${k}">${k}</button>`).join('')}
          </div>
          <button type="submit" class="btn btn--primary kasir__submit">bayar ↵</button>
        </form>
        <p class="kasir__log text-muted" aria-live="polite"></p>
      </div>`;

    const $ = (s) => stage.querySelector(s);
    const input = $('#kasir-input');
    const timerBar = $('.kasir__timer span');
    let lives = 3;
    let served = 0;
    let answer = 0;
    let limit = 12;
    let left = limit;
    let over = false;

    const renderLives = () => {
      $('.kasir__lives').textContent = '❤'.repeat(lives) + '♡'.repeat(3 - lives);
    };

    const next = () => {
      const count = 1 + Math.min(3, (Math.random() * (2 + served / 3)) | 0);
      const items = Array.from({ length: count }, () => ({ ...pick(WARUNG_ITEMS), qty: 1 + ((Math.random() * 2) | 0) }));
      const total = items.reduce((s, it) => s + it.price * it.qty, 0);
      const paid = NOTES.find((n) => n > total) ?? Math.ceil(total / 100000) * 100000 + 100000;
      answer = paid - total;
      $('.kasir__customer').innerHTML = `<span class="text-cyan">${pick(CUSTOMERS)}</span> belanja:`;
      $('.kasir__items').innerHTML = items
        .map((it) => `<li><span>${it.qty}× ${it.name}</span><span>${rupiah(it.price * it.qty)}</span></li>`)
        .join('');
      $('.kasir__total').innerHTML = `total <b>${rupiah(total)}</b>`;
      $('.kasir__paid').innerHTML = `bayar pakai <b class="text-neon">${rupiah(paid)}</b>`;
      limit = Math.max(5, 12 - served * 0.5);
      left = limit;
      input.value = '';
      input.focus({ preventScroll: true });
    };

    const fail = (why) => {
      lives--;
      renderLives();
      $('.kasir__log').innerHTML = `<span class="text-danger">${why}</span> → masuk buku hutang 📒 (jawaban: ${rupiah(answer)})`;
      if (lives <= 0) {
        over = true;
        api.gameOver(served, `warung tutup. ${served} pelanggan terlayani`);
      } else next();
    };

    $('.kasir__form').addEventListener('submit', (e) => {
      e.preventDefault();
      if (over) return;
      const val = Number(input.value.replace(/\D/g, ''));
      if (val === answer) {
        served++;
        api.setScore(served);
        $('.kasir__log').innerHTML = `<span class="text-neon">✓ pas!</span> ${rupiah(answer)} — sisa waktu ${left.toFixed(1)}s`;
        next();
      } else {
        fail(`✗ salah hitung (${rupiah(val)})`);
      }
    });

    $('.kasir__keys').addEventListener('click', (e) => {
      const k = e.target.closest('[data-k]')?.dataset.k;
      if (!k) return;
      if (k === '⌫') input.value = input.value.slice(0, -1);
      else input.value += k;
      input.focus({ preventScroll: true });
    });

    api.loop((dt) => {
      if (over) return;
      left -= dt;
      timerBar.style.transform = `scaleX(${Math.max(0, left / limit)})`;
      if (left <= 0) fail('⌛ pelanggan kabur');
    });

    renderLives();
    next();
  },
};
