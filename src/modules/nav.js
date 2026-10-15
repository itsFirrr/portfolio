// Navbar status-bar: hamburger mobile + highlight section aktif.
export function initNav() {
  const toggle = document.getElementById('nav-toggle');
  const menu = document.getElementById('nav-menu');
  const links = [...document.querySelectorAll('[data-nav]')];

  const setOpen = (open) => {
    menu.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Tutup menu' : 'Buka menu');
  };

  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  menu.addEventListener('click', (e) => {
    if (e.target.closest('a')) setOpen(false);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('is-open')) {
      setOpen(false);
      toggle.focus();
    }
  });

  // Section aktif: section yang melewati garis 40% tinggi viewport
  const sections = links.map((l) => document.getElementById(l.dataset.nav)).filter(Boolean);
  const setActive = (id) => {
    links.forEach((l) => {
      const on = l.dataset.nav === id;
      l.classList.toggle('is-active', on);
      if (on) l.setAttribute('aria-current', 'true');
      else l.removeAttribute('aria-current');
    });
  };

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    },
    { rootMargin: '-40% 0px -55% 0px' },
  );
  sections.forEach((s) => io.observe(s));
  // Hero tidak punya link; kosongkan highlight saat kembali ke atas
  const hero = document.getElementById('hero');
  if (hero) {
    const heroIo = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setActive(null);
      },
      { rootMargin: '-40% 0px -55% 0px' },
    );
    heroIo.observe(hero);
  }
}
