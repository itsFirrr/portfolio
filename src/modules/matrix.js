// Matrix rain di canvas 2D. Lazy (IntersectionObserver), 30 fps, kolom dibatasi di mobile,
// dijeda saat canvas di luar viewport atau tab tidak aktif.
import { prefersReducedMotion, onReducedMotionChange } from '../utils/reducedMotion.js';
import { isMobile } from '../utils/isMobile.js';

const CHARS = 'アイウエオカキクケコサシスセソタチツテト0123456789ABCDEF<>/{}=$#';
const FRAME_MS = 1000 / 30;

let api = null;

/** Picu efek "burst" (dipakai Konami code): rain lebih cepat & terang selama beberapa detik. */
export function matrixBurst(ms = 3000) {
  api?.burst(ms);
}

/** Paksa baca ulang warna aksen (setelah tema berganti). */
export function matrixRefreshColor() {
  api?.refreshColor();
}

export function initMatrix() {
  const canvas = document.getElementById('matrix');
  if (!canvas || prefersReducedMotion()) return;

  const ctx = canvas.getContext('2d', { alpha: true });
  let w = 0;
  let h = 0;
  let fontSize = 16;
  let drops = [];
  let rafId = 0;
  let last = 0;
  let inView = false;
  let started = false;
  let color = '';
  let burstColor = '';
  let bg = '';
  let burstUntil = 0;

  // Warna diambil dari design tokens CSS, bukan di-hardcode
  const refreshColor = () => {
    const css = getComputedStyle(document.documentElement);
    color = css.getPropertyValue('--accent').trim();
    burstColor = css.getPropertyValue('--neon-magenta').trim();
    bg = css.getPropertyValue('--bg').trim();
  };

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, isMobile() ? 1 : 1.5);
    const rect = canvas.getBoundingClientRect();
    w = rect.width;
    h = rect.height;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    // Mobile: huruf lebih besar dan maksimal 28 kolom; desktop maksimal 110 kolom
    fontSize = isMobile() ? 18 : 16;
    const maxCols = isMobile() ? 28 : 110;
    const cols = Math.min(maxCols, Math.ceil(w / fontSize));
    const gap = w / cols;
    drops = Array.from({ length: cols }, (_, i) => ({
      x: i * gap,
      y: Math.random() * -h,
      speed: 0.6 + Math.random() * 0.8,
    }));
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);
  };

  const draw = (now) => {
    rafId = requestAnimationFrame(draw);
    if (now - last < FRAME_MS) return;
    last = now;
    const burst = now < burstUntil;
    // Jejak memudar: tutup frame sebelumnya dengan latar semi-transparan
    ctx.globalAlpha = 0.12;
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);
    ctx.globalAlpha = 1;
    ctx.font = `${fontSize}px "JetBrains Mono", monospace`;
    ctx.fillStyle = burst ? burstColor : color;
    for (const d of drops) {
      const ch = CHARS[(Math.random() * CHARS.length) | 0];
      ctx.fillText(ch, d.x, d.y);
      d.y += fontSize * d.speed * (burst ? 2.2 : 1);
      if (d.y > h + fontSize && Math.random() > 0.975) d.y = -fontSize * Math.random() * 20;
    }
  };

  const play = () => {
    if (rafId || !inView || document.hidden) return;
    last = 0;
    rafId = requestAnimationFrame(draw);
  };

  const pause = () => {
    cancelAnimationFrame(rafId);
    rafId = 0;
  };

  const onVisibility = () => (document.hidden ? pause() : play());
  let resizeTimer = 0;
  const onResize = () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 150);
  };

  const io = new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    if (inView && !started) {
      // Inisialisasi berat baru dilakukan saat pertama kali terlihat
      started = true;
      refreshColor();
      resize();
      window.addEventListener('resize', onResize, { passive: true });
      document.addEventListener('visibilitychange', onVisibility);
    }
    inView ? play() : pause();
  });

  // Tunda sedikit agar tidak bersaing dengan render pertama (LCP)
  const start = () => io.observe(canvas);
  if ('requestIdleCallback' in window) requestIdleCallback(start, { timeout: 1200 });
  else setTimeout(start, 400);

  const destroy = () => {
    pause();
    io.disconnect();
    window.removeEventListener('resize', onResize);
    document.removeEventListener('visibilitychange', onVisibility);
    ctx.clearRect(0, 0, w, h);
    api = null;
  };

  onReducedMotionChange((reduced) => reduced && destroy());

  api = {
    burst: (ms) => {
      burstUntil = performance.now() + ms;
    },
    refreshColor,
  };
}
