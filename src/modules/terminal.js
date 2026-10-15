// Terminal interaktif di section Contact: perintah, riwayat (↑/↓), autocomplete (Tab).
import { projects, GITHUB_URL, isTodo } from '../data/projects.js';
import { THEMES, getTheme, setTheme, cycleTheme } from './theme.js';

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

const SUDO_REPLIES = [
  'guest is not in the sudoers file. This incident will be reported. 🚨',
  'Nice try. Akses root hanya untuk yang sudah traktir kopi ☕',
  'sudo: permission denied. Coba `contact` dulu, kita kenalan.',
  "With great power comes great responsibility… and you're still guest.",
];

const COMMANDS = {
  help: {
    desc: 'tampilkan daftar perintah',
    run: () =>
      Object.entries(COMMANDS)
        .map(([name, c]) => `  <span class="text-neon">${name.padEnd(9)}</span> ${esc(c.desc)}`)
        .join('\n'),
  },
  about: {
    desc: 'siapa saya',
    run: () =>
      'Ahmad Firdaus (itsfirrr)\nMahasiswa D-4 Teknik Komputer dan Jaringan, PNUP.\nProgrammer + vibe coder: IoT, Android, web, dan tools browser.',
  },
  skills: {
    desc: 'tech stack',
    run: () =>
      [
        '<span class="text-cyan">mobile</span>  Kotlin, Jetpack Compose, Flutter, Riverpod',
        '<span class="text-cyan">web</span>     Laravel, Livewire, MySQL, JavaScript, Tailwind',
        '<span class="text-cyan">iot</span>     ESP32, Firebase, Arduino',
        '<span class="text-cyan">tools</span>   Git, Linux, Python, AI-assisted workflow',
      ].join('\n'),
  },
  projects: {
    desc: 'daftar proyek',
    run: () =>
      projects
        .map((p) => {
          const url = p.live || p.repo;
          return `<span class="text-neon">▸ ${esc(p.title)}</span>\n  ${esc(p.short)}\n  ${link(url)}`;
        })
        .join('\n') + `\n\nLihat lebih banyak: ${link(GITHUB_URL)}`,
  },
  contact: {
    desc: 'cara menghubungi saya',
    run: () =>
      [
        `email      ${isTodo(CONTACT.email) ? link(CONTACT.email) : link(`mailto:${CONTACT.email}`, CONTACT.email)}`,
        `github     ${link(CONTACT.github)}`,
        `instagram  ${link(CONTACT.instagram)}`,
        `linkedin   ${link(CONTACT.linkedin)}`,
      ].join('\n'),
  },
  github: {
    desc: 'buka profil GitHub',
    run: () => {
      window.open(GITHUB_URL, '_blank', 'noopener');
      return `Membuka ${link(GITHUB_URL)} …`;
    },
  },
  theme: {
    desc: `ganti warna: theme [${THEMES.join('|')}]`,
    run: (args) => {
      if (!args[0]) return `Tema diganti ke <span class="text-neon">${cycleTheme()}</span>.`;
      if (setTheme(args[0])) return `Tema diganti ke <span class="text-neon">${esc(args[0])}</span>.`;
      return `<span class="text-danger">theme: tema tidak dikenal "${esc(args[0])}".</span> Pilihan: ${THEMES.join(', ')} (sekarang: ${getTheme()})`;
    },
  },
  clear: {
    desc: 'bersihkan layar',
    run: () => null,
  },
  sudo: {
    desc: 'jangan coba-coba 😏',
    run: () => SUDO_REPLIES[(Math.random() * SUDO_REPLIES.length) | 0],
  },
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

  const print = (html, cls = '') => {
    const p = document.createElement('pre');
    if (cls) p.className = cls;
    p.innerHTML = html;
    out.appendChild(p);
  };

  const scrollBottom = () => {
    body.scrollTop = body.scrollHeight;
  };

  const exec = (raw) => {
    const line = raw.trim();
    print(`<span class="prompt">guest@itsfirrr:~$</span> ${esc(line)}`);
    if (!line) return;
    history.push(line);
    hIndex = history.length;
    const [name, ...args] = line.split(/\s+/);
    const cmd = COMMANDS[name.toLowerCase()];
    if (!cmd) {
      print(`<span class="text-danger">${esc(name)}: command not found</span>. Ketik <span class="text-neon">help</span>.`);
      return;
    }
    if (name.toLowerCase() === 'clear') {
      out.innerHTML = '';
      return;
    }
    const result = cmd.run(args);
    if (result) print(result);
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    exec(input.value);
    input.value = '';
    draft = '';
    scrollBottom();
  });

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
      if (first === 'theme' && rest.length <= 1) {
        const m = THEMES.filter((t) => t.startsWith(rest[0] || ''));
        if (m.length === 1) input.value = `theme ${m[0]}`;
        else if (m.length) print(m.join('  '), 'text-muted');
      } else if (!rest.length) {
        const matches = Object.keys(COMMANDS).filter((c) => c.startsWith(first));
        if (matches.length === 1) input.value = `${matches[0]} `;
        else if (matches.length > 1) print(matches.join('  '), 'text-muted');
      }
      scrollBottom();
    }
  });

  // Klik di area terminal memfokuskan input (kecuali sedang memilih teks atau klik link)
  body.addEventListener('click', (e) => {
    if (e.target.closest('a') || String(window.getSelection())) return;
    input.focus({ preventScroll: true });
  });
}
