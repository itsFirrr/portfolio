// Section "git log": render riwayat dari src/data/timeline.js dengan gaya `git log --graph`.
import { timeline } from '../data/timeline.js';
import { localized, onLangChange, t } from './i18n.js';
import { isTodo } from '../data/projects.js';

const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

/** Hash pendek deterministik (mirip hash commit) dari judul. */
function shortHash(str) {
  let h = 2166136261;
  for (const ch of str) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return (h >>> 0).toString(16).padStart(8, '0').slice(0, 7);
}

function render(list) {
  list.innerHTML = timeline
    .map((item, i) => {
      const title = esc(localized(item, 'title'));
      const date = isTodo(item.date) ? `<span class="text-warn">${esc(item.date)}</span>` : esc(item.date);
      const head = i === 0 ? ` <span class="log__ref">(HEAD -&gt; main)</span>` : '';
      return `
        <li class="log__item log__item--${item.type}" data-reveal>
          <span class="log__dot" aria-hidden="true"></span>
          <p class="log__meta"><span class="log__hash">${shortHash(item.title)}</span>${head} <span class="log__type">${esc(t(`log.${item.type}`))}:</span> <time>${date}</time></p>
          <h3 class="log__title">${item.link ? `<a href="${esc(item.link)}" target="_blank" rel="noopener">${title} ↗</a>` : title}</h3>
          <p class="log__desc">${esc(localized(item, 'desc'))}</p>
        </li>`;
    })
    .join('');
}

export function initTimeline() {
  const list = document.getElementById('log-list');
  if (!list) return;
  render(list);
  onLangChange(() => {
    render(list);
    // Item hasil render ulang tidak perlu dianimasikan lagi
    list.querySelectorAll('[data-reveal]').forEach((el) => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
  });
}
