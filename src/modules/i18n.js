// Toggle bahasa ID/EN. Teks bahasa Indonesia untuk HTML statis tetap ditulis di index.html (sumber asli);
// saat init teks itu disimpan, lalu diganti dengan kamus EN bila bahasa diubah.
// Teks yang dirender JS memakai t(key) dengan kamus di src/data/i18n.js.
import { DICT } from '../data/i18n.js';

export const LANGS = ['id', 'en'];
const KEY = 'itsfirrr-lang';
let lang = 'id';
const originals = new WeakMap();

export function getLang() {
  return lang;
}

/** Terjemahkan key; `vars` mengganti {nama} di dalam teks. Fallback: ID → key itu sendiri. */
export function t(key, vars) {
  let s = DICT[lang]?.[key] ?? DICT.id[key] ?? key;
  if (vars) for (const [k, v] of Object.entries(vars)) s = s.replaceAll(`{${k}}`, v);
  return s;
}

/** Ambil versi bahasa aktif dari objek data `{ ..., en: { field } }`. */
export function localized(obj, field) {
  return (lang === 'en' && obj.en?.[field]) || obj[field];
}

function applyDom() {
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    if (!originals.has(el)) originals.set(el, el.innerHTML);
    const key = el.dataset.i18n;
    // Kamus dikelola sendiri (bukan input pengguna), jadi aman dipakai sebagai HTML
    el.innerHTML = lang === 'id' ? originals.get(el) : (DICT.en[key] ?? originals.get(el));
  });
  // data-i18n-attr="aria-label:key;placeholder:key2"
  document.querySelectorAll('[data-i18n-attr]').forEach((el) => {
    el.dataset.i18nAttr.split(';').forEach((pair) => {
      const [attr, key] = pair.split(':');
      const store = `i18nOrig_${attr.replace(/-/g, '_')}`;
      if (!(store in el.dataset)) el.dataset[store] = el.getAttribute(attr) ?? '';
      el.setAttribute(attr, lang === 'id' ? el.dataset[store] : (DICT.en[key] ?? el.dataset[store]));
    });
  });
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-lang-btn]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.langBtn === lang)));
}

export function setLang(next) {
  if (!LANGS.includes(next)) return false;
  lang = next;
  try {
    localStorage.setItem(KEY, next);
  } catch {
    /* storage tidak tersedia */
  }
  applyDom();
  document.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));
  return true;
}

/** Daftarkan callback saat bahasa berubah. */
export function onLangChange(cb) {
  document.addEventListener('langchange', () => cb(lang));
}

export function initI18n() {
  let saved = null;
  try {
    saved = localStorage.getItem(KEY);
  } catch {
    saved = null;
  }
  if (LANGS.includes(saved)) lang = saved;
  applyDom();
  document.querySelectorAll('[data-lang-btn]').forEach((b) => b.addEventListener('click', () => setLang(b.dataset.langBtn)));
}
