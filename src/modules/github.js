// GitHub live stats: data publik dari api.github.com, dimuat lazy saat section About terlihat.
// Cache sessionStorage 1 jam (rate limit API publik 60 request/jam per IP). Gagal = kartu tetap tersembunyi.
import { animateCount } from './stats.js';
import { t, onLangChange } from './i18n.js';

const USER = 'itsFirrr';
const CACHE_KEY = 'itsfirrr-gh';
const TTL = 60 * 60 * 1000;

const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

async function load() {
  try {
    const cached = JSON.parse(sessionStorage.getItem(CACHE_KEY));
    if (cached && Date.now() - cached.at < TTL) return cached.data;
  } catch {
    /* cache tidak tersedia */
  }
  const [userRes, repoRes] = await Promise.all([
    fetch(`https://api.github.com/users/${USER}`),
    fetch(`https://api.github.com/users/${USER}/repos?per_page=100&sort=pushed`),
  ]);
  if (!userRes.ok || !repoRes.ok) throw new Error(`GitHub API ${userRes.status}/${repoRes.status}`);
  const user = await userRes.json();
  const repos = (await repoRes.json()).filter((r) => !r.fork);

  const langCount = {};
  repos.forEach((r) => r.language && (langCount[r.language] = (langCount[r.language] || 0) + 1));
  const totalLang = Object.values(langCount).reduce((a, b) => a + b, 0) || 1;
  const data = {
    repos: user.public_repos,
    followers: user.followers,
    stars: repos.reduce((s, r) => s + r.stargazers_count, 0),
    langs: Object.entries(langCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, n]) => ({ name, pct: Math.round((n / totalLang) * 100) })),
    recent: repos.slice(0, 3).map((r) => ({ name: r.name, url: r.html_url, pushed: r.pushed_at, lang: r.language })),
  };
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), data }));
  } catch {
    /* abaikan */
  }
  return data;
}

function timeAgo(iso) {
  const days = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 86400000));
  if (days === 0) return t('gh.today');
  return t('gh.daysAgo', { n: days });
}

function render(card, d, animate) {
  card.querySelector('[data-gh-body]').innerHTML = `
    <ul class="gh__nums">
      <li><b data-gh-num="${d.repos}">${d.repos}</b><span>${t('gh.repos')}</span></li>
      <li><b data-gh-num="${d.stars}">${d.stars}</b><span>stars</span></li>
      <li><b data-gh-num="${d.followers}">${d.followers}</b><span>followers</span></li>
    </ul>
    <p class="gh__label">${t('gh.langs')}</p>
    <ul class="gh__langs">
      ${d.langs
        .map(
          (l) => `<li><span class="gh__lang">${esc(l.name)}</span><span class="gh__bar" aria-hidden="true"><span style="transform:scaleX(${l.pct / 100})"></span></span><span class="gh__pct">${l.pct}%</span></li>`,
        )
        .join('')}
    </ul>
    <p class="gh__label">${t('gh.recent')}</p>
    <ul class="gh__recent">
      ${d.recent
        .map((r) => `<li><a href="${esc(r.url)}" target="_blank" rel="noopener">${esc(r.name)}</a> <span class="text-muted">${r.lang ? `${esc(r.lang)} · ` : ''}${timeAgo(r.pushed)}</span></li>`)
        .join('')}
    </ul>`;
  if (animate) card.querySelectorAll('[data-gh-num]').forEach((el) => animateCount(el, Number(el.dataset.ghNum)));
}

export function initGithub() {
  const card = document.getElementById('gh-card');
  const about = document.getElementById('about');
  if (!card || !about) return;
  let data = null;

  const io = new IntersectionObserver(
    async ([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      try {
        data = await load();
        card.hidden = false;
        render(card, data, true);
      } catch {
        card.hidden = true; // offline / rate limit: stat statis tetap tampil
      }
    },
    { rootMargin: '300px 0px' },
  );
  io.observe(about);
  onLangChange(() => data && render(card, data, false));
}
