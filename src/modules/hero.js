// Hero: boot screen opsional, typewriter `whoami`, scramble nama, dan role rotator.
import { prefersReducedMotion } from '../utils/reducedMotion.js';

const SCRAMBLE_CHARS = '!<>-_\\/[]{}=+*^?#ABCDEF0123456789';
const timers = new Set();

const wait = (ms) =>
  new Promise((resolve) => {
    const id = setTimeout(() => {
      timers.delete(id);
      resolve();
    }, ms);
    timers.add(id);
  });

/** Ketik teks ke elemen karakter per karakter. */
async function typeText(el, text, speed = 70) {
  el.textContent = '';
  for (const ch of text) {
    el.textContent += ch;
    await wait(speed + Math.random() * 40);
  }
}

/** Efek scramble: karakter acak yang perlahan "terkunci" menjadi teks asli (~1.2 dtk). */
function scramble(el, text, duration = 1200) {
  return new Promise((resolve) => {
    const start = performance.now();
    const len = text.length;
    const step = (now) => {
      const progress = Math.min(1, (now - start) / duration);
      const locked = Math.floor(progress * len);
      let out = '';
      for (let i = 0; i < len; i++) {
        if (text[i] === ' ' || i < locked) out += text[i];
        else out += SCRAMBLE_CHARS[(Math.random() * SCRAMBLE_CHARS.length) | 0];
      }
      el.textContent = out;
      if (progress < 1) requestAnimationFrame(step);
      else resolve();
    };
    requestAnimationFrame(step);
  });
}

/** Role bergantian: ketik, tahan, hapus, lanjut (loop sampai tab disembunyikan). */
async function rotateRoles(el, roles) {
  let i = 0;
  for (;;) {
    if (document.hidden) {
      await wait(500);
      continue;
    }
    const role = roles[i % roles.length];
    await typeText(el, role, 65);
    await wait(1600);
    while (el.textContent.length) {
      el.textContent = el.textContent.slice(0, -1);
      await wait(35);
    }
    await wait(300);
    i++;
  }
}

/** Boot screen <= 1.5 dtk, hanya sekali per sesi, bisa di-skip (tombol atau Esc). */
function runBoot() {
  return new Promise((resolve) => {
    const boot = document.getElementById('boot');
    const log = document.getElementById('boot-log');
    const skipBtn = document.getElementById('boot-skip');
    let seen = false;
    try {
      seen = sessionStorage.getItem('itsfirrr-boot') === '1';
      sessionStorage.setItem('itsfirrr-boot', '1');
    } catch {
      /* storage diblokir: tetap tampilkan boot */
    }
    if (!boot || seen) return resolve();

    const lines = [
      '[ OK ] Booting itsfirrr-os v1.0 …',
      '[ OK ] Mounting /home/itsfirrr/projects',
      '[ OK ] Loading neon.drv',
      '[ OK ] Starting vibe-coder.service',
      '[ OK ] Connecting to ESP32 … linked',
      '> welcome, guest.',
    ];
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      document.removeEventListener('keydown', onKey);
      boot.classList.add('is-done');
      setTimeout(() => {
        boot.hidden = true;
      }, 360);
      resolve();
    };
    const onKey = (e) => {
      if (e.key === 'Escape' || e.key === 'Enter') finish();
    };

    boot.hidden = false;
    skipBtn.addEventListener('click', finish, { once: true });
    document.addEventListener('keydown', onKey);
    lines.forEach((line, idx) => {
      const id = setTimeout(() => {
        if (!done) log.textContent += `${line}\n`;
      }, idx * 200);
      timers.add(id);
    });
    const id = setTimeout(finish, 1400);
    timers.add(id);
  });
}

export function glitchName() {
  const name = document.getElementById('hero-title');
  if (!name || prefersReducedMotion()) return;
  name.classList.remove('is-glitch');
  void name.offsetWidth; // restart animasi CSS
  name.classList.add('is-glitch');
}

export async function initHero() {
  const cmd = document.getElementById('hero-cmd');
  const name = document.getElementById('hero-title');
  const role = document.getElementById('hero-role');
  if (!cmd || !name || !role) return;

  const roles = role.dataset.roles.split('|');
  const nameText = name.dataset.scramble;

  // Teks untuk screen reader tetap statis; versi animasi disembunyikan dari AT
  const srRoles = document.createElement('span');
  srRoles.className = 'sr-only';
  srRoles.textContent = roles.join(', ');
  role.after(srRoles);
  role.setAttribute('aria-hidden', 'true');
  name.setAttribute('aria-label', nameText);

  if (prefersReducedMotion()) {
    role.textContent = roles[0];
    return;
  }

  cmd.textContent = '';
  name.textContent = ' ';
  role.textContent = '';

  await runBoot();
  await wait(250);
  await typeText(cmd, cmd.dataset.text, 90);
  await wait(200);
  await scramble(name, nameText);
  glitchName();
  rotateRoles(role, roles);

  // Ulang glitch sesekali saat nama di-hover
  name.addEventListener('pointerenter', glitchName);
}
