// Vibe Typer: ketik ulang 3 baris kode secepatnya, adu cepat dengan "AI".
import { CODE_SNIPPETS } from '../../../data/arcade.js';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export default {
  mount(stage, api) {
    const pool = [...CODE_SNIPPETS].sort(() => Math.random() - 0.5).slice(0, 3);
    const text = pool.join('\n');
    stage.innerHTML = `
      <div class="typer__race">
        <div><span>you</span><div class="typer__bar"><span data-you></span></div></div>
        <div><span>ai</span><div class="typer__bar typer__bar--ai"><span data-ai></span></div></div>
      </div>
      <pre class="typer__text window" aria-hidden="true"></pre>
      <label class="sr-only" for="typer-input">Ketik teks kode berikut: ${esc(text)}</label>
      <textarea id="typer-input" class="typer__input" rows="2" spellcheck="false" autocapitalize="off" autocomplete="off" placeholder="mulai ketik di sini… (Enter = baris baru)"></textarea>
      <p class="arcade__help"><span data-wpm>0</span> WPM · akurasi <span data-acc>100</span>% · AI mulai saat kamu mengetik.</p>`;
    const $ = (s) => stage.querySelector(s);
    const input = $('#typer-input');
    const textEl = $('.typer__text');
    let started = 0;
    let errors = 0;
    let lastLen = 0;
    let aiChars = 0;
    let over = false;
    const aiCps = 4.2; // ~50 WPM

    const render = () => {
      const typed = input.value;
      let html = '';
      for (let i = 0; i < text.length; i++) {
        const ch = text[i] === '\n' ? '↵\n' : esc(text[i]);
        if (i < typed.length) html += `<span class="${typed[i] === text[i] ? 'is-ok' : 'is-bad'}">${ch}</span>`;
        else if (i === typed.length) html += `<span class="is-cur">${ch}</span>`;
        else html += ch;
      }
      textEl.innerHTML = html;
    };

    const stats = () => {
      const mins = Math.max(1 / 60, (performance.now() - started) / 60000);
      const correct = [...input.value].filter((c, i) => c === text[i]).length;
      const wpm = Math.round(correct / 5 / mins);
      const acc = Math.max(0, Math.round((1 - errors / Math.max(1, input.value.length + errors)) * 100));
      $('[data-wpm]').textContent = String(wpm);
      $('[data-acc]').textContent = String(acc);
      return { wpm, acc };
    };

    const end = (win) => {
      over = true;
      input.disabled = true;
      const { wpm, acc } = stats();
      api.gameOver(Math.round((wpm * acc) / 100), win ? `menang lawan AI! ${wpm} WPM, ${acc}%` : `AI duluan 🤖 ${wpm} WPM, ${acc}%`);
    };

    input.addEventListener('input', () => {
      if (over) return;
      if (!started) started = performance.now();
      const v = input.value;
      if (v.length > lastLen && v[v.length - 1] !== text[v.length - 1]) errors++;
      lastLen = v.length;
      if (v.length > text.length) input.value = v.slice(0, text.length);
      render();
      $('[data-you]').style.transform = `scaleX(${Math.min(1, input.value.length / text.length)})`;
      api.setScore(stats().wpm);
      if (input.value === text) end(true);
    });

    api.loop((dt) => {
      if (over || !started) return;
      aiChars += aiCps * dt;
      $('[data-ai]').style.transform = `scaleX(${Math.min(1, aiChars / text.length)})`;
      if (aiChars >= text.length) end(false);
    });

    render();
    input.focus({ preventScroll: true });
  },
};
