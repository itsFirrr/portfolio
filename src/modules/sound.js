// Sound effects sintetis dengan Web Audio API (tanpa file audio). Default mati.
// AudioContext baru dibuat setelah pengguna menyalakan suara (butuh gesture).
const KEY = 'itsfirrr-sound';
let enabled = false;
let ctx = null;
let lastKey = 0;

// name: [frekuensi awal, frekuensi akhir, durasi (detik), tipe gelombang, volume]
const SFX = {
  key: [1800, 1200, 0.025, 'square', 0.025],
  enter: [660, 880, 0.08, 'square', 0.05],
  error: [220, 110, 0.22, 'sawtooth', 0.06],
  success: [523, 1046, 0.18, 'triangle', 0.08],
  coin: [988, 1319, 0.12, 'square', 0.05],
  hit: [160, 60, 0.15, 'square', 0.07],
  over: [440, 110, 0.5, 'triangle', 0.08],
  toggle: [880, 1320, 0.07, 'sine', 0.08],
};

export function isSoundOn() {
  return enabled;
}

function ensureCtx() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

/** Mainkan efek suara bernama (diabaikan bila suara mati). */
export function sfx(name) {
  if (!enabled || document.hidden) return;
  const def = SFX[name];
  const ac = ensureCtx();
  if (!def || !ac) return;
  // Batasi suara ketik supaya tidak menumpuk saat mengetik cepat
  if (name === 'key') {
    const now = performance.now();
    if (now - lastKey < 35) return;
    lastKey = now;
  }
  const [f0, f1, dur, type, vol] = def;
  const t = ac.currentTime;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(f0, t);
  osc.frequency.exponentialRampToValueAtTime(f1, t + dur);
  gain.gain.setValueAtTime(vol, t);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(gain).connect(ac.destination);
  osc.start(t);
  osc.stop(t + dur + 0.02);
}

function syncButtons() {
  document.querySelectorAll('[data-sound-btn]').forEach((b) => {
    b.setAttribute('aria-pressed', String(enabled));
    b.innerHTML = `<span aria-hidden="true">${enabled ? '🔊' : '🔇'}</span>`;
  });
}

export function setSound(on) {
  enabled = Boolean(on);
  try {
    localStorage.setItem(KEY, enabled ? '1' : '0');
  } catch {
    /* storage tidak tersedia */
  }
  syncButtons();
  if (enabled) sfx('toggle');
  return enabled;
}

export function initSound() {
  // Preferensi diingat, tetapi AudioContext tetap menunggu gesture pertama dari browser
  try {
    enabled = localStorage.getItem(KEY) === '1';
  } catch {
    enabled = false;
  }
  syncButtons();
  document.querySelectorAll('[data-sound-btn]').forEach((b) => b.addEventListener('click', () => setSound(!enabled)));
}
