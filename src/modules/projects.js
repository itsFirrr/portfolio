// Render kartu proyek dari data + modal detail (animasi dari posisi kartu, Esc, focus trap).
import { gsap } from 'gsap';
import { projects, GITHUB_URL, isTodo } from '../data/projects.js';
import { prefersReducedMotion } from '../utils/reducedMotion.js';
import { initTilt } from './tilt.js';
import { stopScroll, startScroll } from './scroll.js';
import { t, localized, onLangChange } from './i18n.js';

const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

const tagsHtml = (tech) => tech.map((t) => `<span>${esc(t)}</span>`).join('');

function cardHtml(p) {
  return `
    <li class="card project-card" data-tilt data-reveal>
      <div class="project-card__thumb thumb--${p.thumb}" aria-hidden="true"><span>${esc(p.glyph)}</span></div>
      <div class="project-card__body">
        <h3 class="project-card__title">${esc(localized(p, 'title'))}</h3>
        <p class="project-card__desc">${esc(localized(p, 'short'))}</p>
        <p class="tags">${tagsHtml(p.tech)}</p>
        <div class="project-card__footer">
          <span class="text-muted">${p.live ? '● live' : '○ repo'}</span>
          <button type="button" class="project-card__open" data-project="${esc(p.id)}" aria-haspopup="dialog">
            open --detail <span class="sr-only">${esc(localized(p, 'title'))}</span>
          </button>
        </div>
      </div>
    </li>`;
}

function moreCardHtml() {
  return `
    <li class="card project-card project-card--more" data-tilt data-reveal>
      <div class="project-card__body">
        <pre aria-hidden="true">$ ls -la ~/projects
drwxr-xr-x  kanrung-tech/
drwxr-xr-x  aio-tool/
drwxr-xr-x  warpro/
drwxr-xr-x  kalender-pnl/
drwxr-xr-x  ...</pre>
        <h3 class="project-card__title">More on GitHub</h3>
        <p class="project-card__desc">${t('proj.more')}</p>
        <a href="${GITHUB_URL}" target="_blank" rel="noopener" class="text-neon">github.com/itsFirrr →</a>
      </div>
    </li>`;
}

function linkBtn(label, url, primary) {
  if (!url) return '';
  if (isTodo(url)) {
    return `<a class="btn btn--ghost is-todo" href="${GITHUB_URL}" target="_blank" rel="noopener" data-todo="${esc(url)}">${label} (${t('proj.seeGithub')})</a>`;
  }
  return `<a class="btn ${primary ? 'btn--primary' : 'btn--ghost'}" href="${esc(url)}" target="_blank" rel="noopener">${label} ↗</a>`;
}

function initModal() {
  const modal = document.getElementById('project-modal');
  const dialog = modal.querySelector('.modal__dialog');
  const backdrop = modal.querySelector('.modal__backdrop');
  const els = {
    file: document.getElementById('modal-file'),
    title: document.getElementById('modal-title'),
    desc: document.getElementById('modal-desc'),
    tags: document.getElementById('modal-tags'),
    actions: document.getElementById('modal-actions'),
  };
  let opener = null;
  let originCard = null;
  let tl = null;

  const focusables = () =>
    [...dialog.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')].filter(
      (el) => el.offsetParent !== null,
    );

  const onKey = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      close();
      return;
    }
    if (e.key !== 'Tab') return;
    // Focus trap
    const f = focusables();
    if (!f.length) return;
    const first = f[0];
    const last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  // Offset dari pusat kartu ke pusat viewport, agar dialog "tumbuh" dari kartu
  const originOffset = () => {
    if (!originCard) return { x: 0, y: 0 };
    const r = originCard.getBoundingClientRect();
    return { x: r.left + r.width / 2 - window.innerWidth / 2, y: r.top + r.height / 2 - window.innerHeight / 2 };
  };

  function open(project, button) {
    opener = button;
    originCard = button.closest('.project-card');
    els.file.textContent = project.file;
    els.title.textContent = localized(project, 'title');
    els.desc.textContent = localized(project, 'description');
    els.tags.innerHTML = tagsHtml(project.tech);
    els.actions.innerHTML = linkBtn('Live', project.live, true) + linkBtn('Repo', project.repo, !project.live);

    modal.hidden = false;
    document.body.classList.add('is-locked');
    stopScroll();
    document.addEventListener('keydown', onKey);

    tl?.kill();
    if (!prefersReducedMotion()) {
      const o = originOffset();
      tl = gsap.timeline();
      tl.fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'power3.out' }, 0);
      tl.fromTo(
        dialog,
        { opacity: 0, scale: 0.6, x: o.x, y: o.y },
        { opacity: 1, scale: 1, x: 0, y: 0, duration: 0.3, ease: 'power3.out' },
        0,
      );
    }
    dialog.focus();
  }

  function close() {
    if (modal.hidden) return;
    document.removeEventListener('keydown', onKey);
    const finish = () => {
      modal.hidden = true;
      gsap.set([dialog, backdrop], { clearProps: 'all' });
      document.body.classList.remove('is-locked');
      startScroll();
      opener?.focus({ preventScroll: true });
    };
    tl?.kill();
    if (prefersReducedMotion()) return finish();
    const o = originOffset();
    tl = gsap.timeline({ onComplete: finish });
    tl.to(backdrop, { opacity: 0, duration: 0.25, ease: 'power3.out' }, 0);
    tl.to(dialog, { opacity: 0, scale: 0.6, x: o.x, y: o.y, duration: 0.25, ease: 'power3.in' }, 0);
  }

  modal.addEventListener('click', (e) => {
    if (e.target.closest('[data-close]')) close();
  });

  return { open, close };
}

export function initProjects() {
  const grid = document.getElementById('project-grid');
  if (!grid) return;
  const render = () => {
    grid.innerHTML = projects.map(cardHtml).join('') + moreCardHtml();
    initTilt(grid);
  };
  render();
  onLangChange(() => {
    render();
    // Kartu hasil render ulang langsung tampil (scroll reveal hanya sekali)
    grid.querySelectorAll('[data-reveal]').forEach((el) => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
  });

  const modal = initModal();
  grid.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-project]');
    if (!btn) return;
    const project = projects.find((p) => p.id === btn.dataset.project);
    if (project) modal.open(project, btn);
  });
}
