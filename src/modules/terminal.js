// Terminal interaktif di section Contact: perintah, riwayat (↑/↓), autocomplete (Tab).
import { projects, GITHUB_URL, CV_URL, isTodo } from '../data/projects.js';
import { THEMES, getTheme, setTheme, cycleTheme, isCrt, setCrt } from './theme.js';
import { GAME_LIST } from '../data/games.js';
import { t, getLang, setLang, localized, LANGS, onLangChange } from './i18n.js';
import { sfx, setSound, isSoundOn } from './sound.js';
import { matrixBurst } from './matrix.js';
import { scrollToTarget } from './scroll.js';
import { prefersReducedMotion } from '../utils/reducedMotion.js';

const openGame = (id) => import('./arcade/arcade.js').then((m) => m.openArcade(id));

const CONTACT = {
  email: 'ahmdfirdaus241@gmail.com',
  github: GITHUB_URL,
  instagram: 'https://www.instagram.com/firrr.af',
  linkedin: 'TODO_LINKEDIN',
};

const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

const link = (url, label = url) =>
  isTodo(url)
    ? `<span class="text-warn">${esc(url)}</span>`
    : `<a href="${esc(url)}" target="_blank" rel="noopener">${esc(label)}</a>`;

const neon = (s) => `<span class="text-neon">${s}</span>`;
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

// Kode cuaca WMO → ikon + key terjemahan
const WEATHER = [
  [[0], '☀️', 'wx.clear'],
  [[1, 2], '🌤️', 'wx.partly'],
  [[3], '☁️', 'wx.cloudy'],
  [[45, 48], '🌫️', 'wx.fog'],
  [[51, 53, 55, 56, 57], '🌦️', 'wx.drizzle'],
  [[61, 63, 65, 66, 67, 80, 81, 82], '🌧️', 'wx.rain'],
  [[71, 73, 75, 77, 85, 86], '❄️', 'wx.snow'],
  [[95, 96, 99], '⛈️', 'wx.storm'],
];

async function fetchWeather(city) {
  let place = { name: 'Makassar', latitude: -5.1477, longitude: 119.4327 };
  if (city && city.toLowerCase() !== 'makassar') {
    const g = await fetch(`https://geocoding-api.open-meteo.com/v1/search?count=1&language=${getLang()}&name=${encodeURIComponent(city)}`, { signal: AbortSignal.timeout(8000) });
    const data = await g.json();
    if (!data.results?.length) return t('wx.notfound', { city: esc(city) });
    place = data.results[0];
  }
  const r = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto`,
    { signal: AbortSignal.timeout(8000) },
  );
  const { current: c } = await r.json();
  const [, icon, key] = WEATHER.find(([codes]) => codes.includes(c.weather_code)) || [null, '🌡️', 'wx.unknown'];
  return [
    `${icon}  ${neon(esc(place.name))} — ${t(key)}`,
    `   temp      ${c.temperature_2m}°C`,
    `   humidity  ${c.relative_humidity_2m}%`,
    `   wind      ${c.wind_speed_10m} km/h`,
    `<span class="text-muted">   ${t('wx.source')}</span>`,
  ].join('\n');
}

function cowsay(text) {
  const msg = text || t('cow.default');
  const lines = [];
  for (let i = 0; i < msg.length; i += 36) lines.push(msg.slice(i, i + 36));
  const w = Math.max(...lines.map((l) => l.length));
  const bubble =
    lines.length === 1
      ? [`< ${lines[0]} >`]
      : lines.map((l, i) => {
          const [a, b] = i === 0 ? ['/', '\\'] : i === lines.length - 1 ? ['\\', '/'] : ['|', '|'];
          return `${a} ${l.padEnd(w)} ${b}`;
        });
  return esc(
    [
      ` ${'_'.repeat(w + 2)}`,
      ...bubble,
      ` ${'-'.repeat(w + 2)}`,
      '        \\   ^__^',
      '         \\  (oo)\\_______',
      '            (__)\\       )\\/\\',
      '                ||----w |',
      '                ||     ||',
    ].join('\n'),
  );
}

function neofetch() {
  const uptime = Math.round(performance.now() / 1000);
  const logo = [
    '  ╭──────────────╮',
    '  │ <span class="text-neon">&gt;_</span>           │',
    '  │              │',
    '  │   <span class="text-cyan">itsfirrr</span>   │',
    '  │              │',
    '  ╰──────┬┬──────╯',
    '      ───┴┴───   ',
  ];
  const info = [
    `${neon('guest')}@${neon('itsfirrr')}`,
    '-----------------',
    `${neon('name')}     Ahmad Firdaus`,
    `${neon('role')}     Programmer · Vibe Coder · IoT`,
    `${neon('campus')}   ${t('neo.campus')}`,
    `${neon('stack')}    Laravel · Kotlin · Flutter · ESP32`,
    `${neon('editor')}   VS Code + AI pair`,
    `${neon('theme')}    ${getTheme()}${isCrt() ? ' + crt' : ''}`,
    `${neon('lang')}     ${getLang()}`,
    `${neon('uptime')}   ${uptime}s`,
    '<span style="color:var(--danger)">███</span><span style="color:var(--warn)">███</span><span style="color:var(--neon-green)">███</span><span style="color:var(--neon-cyan)">███</span><span style="color:var(--neon-magenta)">███</span>',
  ];
  return Array.from({ length: Math.max(logo.length, info.length) }, (_, i) => `${logo[i] ?? ' '.repeat(18)}   ${info[i] ?? ''}`).join('\n');
}

const HACK_LINES = [
  'hack.1',
  'hack.2',
  'hack.3',
  'hack.4',
  'hack.5',
  'hack.6',
];

const SUDO_KEYS = ['sudo.1', 'sudo.2', 'sudo.3', 'sudo.4'];

/** Perintah: `run(args, io)` mengembalikan HTML (string), null, atau Promise. `io.print` untuk output bertahap. */
const COMMANDS = {
  help: {
    run: () => Object.keys(COMMANDS).map((name) => `  ${neon(name.padEnd(9))} ${esc(t(`cmd.${name}`))}`).join('\n'),
  },
  about: { run: () => t('term.about') },
  skills: {
    run: () =>
      [
        '<span class="text-cyan">mobile</span>  Kotlin, Jetpack Compose, Flutter, Riverpod',
        '<span class="text-cyan">web</span>     Laravel, Livewire, MySQL, JavaScript, Tailwind',
        '<span class="text-cyan">iot</span>     ESP32, Firebase, Arduino',
        '<span class="text-cyan">tools</span>   Git, Linux, Python, AI-assisted workflow',
      ].join('\n'),
  },
  projects: {
    run: () =>
      projects
        .map((p) => `${neon(`▸ ${esc(p.title)}`)}\n  ${esc(localized(p, 'short'))}\n  ${link(p.live || p.repo)}`)
        .join('\n') + `\n\n${t('term.more')} ${link(GITHUB_URL)}`,
  },
  contact: {
    run: () =>
      [
        `email      ${isTodo(CONTACT.email) ? link(CONTACT.email) : link(`mailto:${CONTACT.email}`, CONTACT.email)}`,
        `github     ${link(CONTACT.github)}`,
        `instagram  ${link(CONTACT.instagram)}`,
        `linkedin   ${link(CONTACT.linkedin)}`,
      ].join('\n'),
  },
  github: {
    run: () => {
      window.open(GITHUB_URL, '_blank', 'noopener');
      return t('term.opening', { url: link(GITHUB_URL) });
    },
  },
  neofetch: { run: neofetch },
  cv: {
    run: () => {
      if (isTodo(CV_URL)) return t('term.cvSoon');
      const a = document.createElement('a');
      a.href = CV_URL;
      a.download = 'CV-Ahmad-Firdaus.pdf';
      a.click();
      return t('term.cvDownload', { url: link(CV_URL, 'cv.pdf') });
    },
  },
  theme: {
    run: (args) => {
      if (args[0] === 'crt') return COMMANDS.crt.run([]);
      if (!args[0]) return t('term.themeSet', { name: neon(cycleTheme()) });
      if (setTheme(args[0])) return t('term.themeSet', { name: neon(esc(args[0])) });
      return `<span class="text-danger">${t('term.themeUnknown', { name: esc(args[0]) })}</span> ${THEMES.join(', ')}, crt (${getTheme()})`;
    },
  },
  crt: {
    run: (args) => {
      const on = args[0] === 'on' ? true : args[0] === 'off' ? false : !isCrt();
      setCrt(on);
      return on ? t('term.crtOn') : t('term.crtOff');
    },
  },
  sound: {
    run: (args) => {
      const on = args[0] === 'on' ? true : args[0] === 'off' ? false : !isSoundOn();
      setSound(on);
      return on ? t('term.soundOn') : t('term.soundOff');
    },
  },
  lang: {
    run: (args) => {
      const next = (args[0] || (getLang() === 'id' ? 'en' : 'id')).toLowerCase();
      if (!setLang(next)) return `<span class="text-danger">lang: ${esc(next)}?</span> ${LANGS.join(' | ')}`;
      return t('term.langSet', { lang: neon(next) });
    },
  },
  matrix: {
    run: () => {
      matrixBurst(4000);
      scrollToTarget('#hero');
      return t('term.matrix');
    },
  },
  cowsay: { run: (args) => cowsay(args.join(' ')) },
  weather: {
    run: async (args) => {
      try {
        return await fetchWeather(args.join(' '));
      } catch {
        return `<span class="text-danger">${t('wx.error')}</span>`;
      }
    },
  },
  hack: {
    run: async (args, io) => {
      const instant = prefersReducedMotion();
      for (const key of HACK_LINES) {
        io.print(`<span class="text-neon">${t(key)}</span>`);
        sfx('key');
        if (!instant) await wait(380 + Math.random() * 420);
      }
      sfx('success');
      return t('hack.done');
    },
  },
  games: {
    run: () => {
      openGame();
      return (
        GAME_LIST.map((g) => `  ${neon(g.id.padEnd(9))} ${esc(g.title)} <span class="text-muted">— ${esc(localized(g, 'desc'))}</span>`).join('\n') +
        `\n\n${t('term.playHint')}`
      );
    },
  },
  play: {
    run: (args) => {
      const id = (args[0] || '').toLowerCase();
      if (!id) return t('term.playUsage');
      const g = GAME_LIST.find((x) => x.id === id);
      if (!g) return `<span class="text-danger">${t('term.playUnknown', { id: esc(id) })}</span>`;
      openGame(g.id);
      return t('term.playLoading', { title: esc(g.title) });
    },
  },
  clear: { run: () => null },
  sudo: { run: () => t(SUDO_KEYS[(Math.random() * SUDO_KEYS.length) | 0]) },
};

// Argumen yang bisa di-autocomplete per perintah
const ARG_COMPLETIONS = {
  play: () => GAME_LIST.map((g) => g.id),
  theme: () => [...THEMES, 'crt'],
  lang: () => LANGS,
  crt: () => ['on', 'off'],
  sound: () => ['on', 'off'],
};

export function initTerminal() {
  const body = document.getElementById('term-body');
  const out = document.getElementById('term-output');
  const form = document.getElementById('term-form');
  const input = document.getElementById('term-input');
  if (!body || !form || !input) return;

  const history = [];
  let hIndex = 0;
  let draft = '';
  let busy = false;

  const scrollBottom = () => {
    body.scrollTop = body.scrollHeight;
  };

  const print = (html, cls = '') => {
    const p = document.createElement('pre');
    if (cls) p.className = cls;
    p.innerHTML = html;
    out.appendChild(p);
    scrollBottom();
  };

  const welcome = () => {
    out.innerHTML = '';
    print(t('term.welcome'));
  };
  welcome();
  // Ganti bahasa: tampilkan ulang sambutan hanya jika terminal belum dipakai
  onLangChange(() => {
    if (!history.length) welcome();
  });

  const exec = async (raw) => {
    const line = raw.trim();
    print(`<span class="prompt">guest@itsfirrr:~$</span> ${esc(line)}`);
    if (!line) return;
    history.push(line);
    hIndex = history.length;
    const [name, ...args] = line.split(/\s+/);
    const key = name.toLowerCase();
    const cmd = Object.hasOwn(COMMANDS, key) ? COMMANDS[key] : null;
    if (!cmd) {
      sfx('error');
      print(`<span class="text-danger">${esc(name)}: command not found</span>. ${t('term.tryHelp')}`);
      return;
    }
    if (key === 'clear') {
      out.innerHTML = '';
      return;
    }
    const result = cmd.run(args, { print });
    if (result instanceof Promise) {
      busy = true;
      input.disabled = true;
      const loading = document.createElement('pre');
      loading.className = 'text-muted';
      loading.textContent = '…';
      out.appendChild(loading);
      try {
        const html = await result;
        loading.remove();
        if (html) print(html);
      } finally {
        busy = false;
        input.disabled = false;
        input.focus({ preventScroll: true });
      }
    } else if (result) {
      print(result);
    }
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (busy) return;
    sfx('enter');
    exec(input.value);
    input.value = '';
    draft = '';
  });

  input.addEventListener('input', () => sfx('key'));

  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') {
      if (!history.length) return;
      e.preventDefault();
      if (hIndex === history.length) draft = input.value;
      hIndex = Math.max(0, hIndex - 1);
      input.value = history[hIndex];
    } else if (e.key === 'ArrowDown') {
      if (!history.length) return;
      e.preventDefault();
      hIndex = Math.min(history.length, hIndex + 1);
      input.value = hIndex === history.length ? draft : history[hIndex];
    } else if (e.key === 'Tab') {
      // Autocomplete: hanya tahan Tab bila ada teks, supaya navigasi keyboard tidak terjebak
      const value = input.value.trim().toLowerCase();
      if (!value) return;
      e.preventDefault();
      const [first, ...rest] = value.split(/\s+/);
      if (ARG_COMPLETIONS[first] && rest.length <= 1) {
        const m = ARG_COMPLETIONS[first]().filter((x) => x.startsWith(rest[0] || ''));
        if (m.length === 1) input.value = `${first} ${m[0]}`;
        else if (m.length) print(m.join('  '), 'text-muted');
      } else if (!rest.length) {
        const matches = Object.keys(COMMANDS).filter((c) => c.startsWith(first));
        if (matches.length === 1) input.value = `${matches[0]} `;
        else if (matches.length > 1) print(matches.join('  '), 'text-muted');
      }
    }
  });

  // Klik di area terminal memfokuskan input (kecuali sedang memilih teks atau klik link)
  body.addEventListener('click', (e) => {
    if (e.target.closest('a') || String(window.getSelection())) return;
    input.focus({ preventScroll: true });
  });
}
