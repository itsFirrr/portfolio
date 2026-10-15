// Smooth scroll Lenis (disinkronkan dengan ScrollTrigger), progress bar, dan scroll reveal.
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from '../utils/reducedMotion.js';

gsap.registerPlugin(ScrollTrigger);

let lenis = null;

/** Scroll ke target (selector/elemen); memakai Lenis bila aktif. */
export function scrollToTarget(target) {
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  if (!el) return;
  if (lenis) {
    lenis.scrollTo(el, { offset: -56, duration: 1.1 });
  } else {
    el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
  }
}

export function stopScroll() {
  lenis?.stop();
}

export function startScroll() {
  lenis?.start();
}

function initLenis() {
  if (prefersReducedMotion()) return;
  lenis = new Lenis({ duration: 1.1, easing: (t) => 1 - Math.pow(1 - t, 3) });
  lenis.on('scroll', ScrollTrigger.update);
  // Satu sumber rAF: ticker GSAP menggerakkan Lenis
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

function initProgress() {
  const bar = document.getElementById('progress-bar');
  if (!bar) return;
  let ticking = false;
  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const p = max > 0 ? window.scrollY / max : 0;
    bar.style.transform = `scaleX(${Math.min(1, Math.max(0, p))})`;
    ticking = false;
  };
  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    },
    { passive: true },
  );
  update();
}

function initReveal() {
  if (prefersReducedMotion()) return;
  const items = gsap.utils.toArray('[data-reveal]');
  if (!items.length) return;
  document.documentElement.classList.add('reveal-ready');
  // batch memberi stagger 80ms pada elemen yang masuk viewport bersamaan
  ScrollTrigger.batch(items, {
    start: 'top 88%',
    once: true,
    onEnter: (batch) =>
      gsap.to(batch, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power3.out',
        stagger: 0.08,
        clearProps: 'transform',
      }),
  });
}

/** Transisi antar section: jendela hero memudar & naik sedikit saat discroll (scrub). */
function initSectionTransitions() {
  if (prefersReducedMotion()) return;
  const win = document.querySelector('.hero__window');
  if (!win) return;
  gsap.to(win, {
    y: -60,
    opacity: 0.25,
    ease: 'none',
    scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true },
  });
}

/** Tautan anchor internal memakai scrollToTarget supaya konsisten dengan Lenis. */
function initAnchors() {
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href');
    if (id.length < 2) return;
    const el = document.querySelector(id);
    if (!el) return;
    e.preventDefault();
    scrollToTarget(el);
    history.replaceState(null, '', id);
    // Pindahkan fokus untuk pengguna keyboard / screen reader
    if (id !== '#hero') {
      el.setAttribute('tabindex', '-1');
      el.focus({ preventScroll: true });
    }
  });
}

export function initScroll() {
  initLenis();
  initProgress();
  initReveal();
  initSectionTransitions();
  initAnchors();
}
