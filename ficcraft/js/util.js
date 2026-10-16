/* Ficcraft: shared helpers. Classic script; everything hangs off window.FC. */
(function () {
  'use strict';
  const FC = (window.FC = window.FC || {});
  const U = {};

  U.uid = function () {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  };

  const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  U.esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ESC[c]);

  U.debounce = function (fn, ms) {
    let t = 0;
    const d = function (...a) {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, a), ms);
    };
    d.cancel = () => clearTimeout(t);
    return d;
  };

  U.rafThrottle = function (fn) {
    let queued = false;
    let args = null;
    return function (...a) {
      args = a;
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        fn.apply(this, args);
      });
    };
  };

  U.clamp = (n, a, b) => Math.max(a, Math.min(b, n));

  const WORD = /[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu;
  U.words = function (s) {
    if (!s) return 0;
    const m = String(s).match(WORD);
    return m ? m.length : 0;
  };

  const enc = new TextEncoder();
  U.byteLen = (s) => enc.encode(s).length;

  U.stripMd = function (s) {
    return String(s || '')
      .replace(/```[\s\S]*?```/g, ' ')
      .replace(/\[\[([^\]|\n]+)\|([^\]\n]+)\]\]/g, '$2')
      .replace(/\[\[([^\]\n]+)\]\]/g, '$1')
      .replace(/\[([^\]\n]+)\]\([^)\s]+\)/g, '$1')
      .replace(/^\s{0,3}(#{1,6}|>|[-*+]|\d+[.)])\s+/gm, '')
      .replace(/(\*\*|__|~~|\*|`)/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  };

  U.snippet = function (s, n) {
    n = n || 160;
    const t = U.stripMd(s);
    if (t.length <= n) return t;
    return t.slice(0, n).replace(/\s+\S*$/, '') + '…';
  };

  U.firstLine = (s) => U.stripMd(String(s || '').split('\n').find((l) => l.trim()) || '');

  /* Dates */
  U.dayKey = function (ts) {
    const d = new Date(ts);
    return d.getFullYear() + '-' + d.getMonth() + '-' + d.getDate();
  };
  U.fmtDay = (ts) =>
    new Date(ts).toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  U.fmtDate = (ts) => new Date(ts).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
  U.fmtTime = (ts) => new Date(ts).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
  U.fmtStamp = (ts) => U.fmtDate(ts) + ', ' + U.fmtTime(ts);
  U.isoish = (ts) => new Date(ts).toISOString();

  const rtf = typeof Intl !== 'undefined' && Intl.RelativeTimeFormat ? new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' }) : null;
  const STEPS = [
    [3600, 'minute', 60],
    [86400, 'hour', 3600],
    [604800, 'day', 86400],
    [2629800, 'week', 604800],
    [31557600, 'month', 2629800],
    [Infinity, 'year', 31557600],
  ];
  U.ago = function (ts) {
    if (!ts) return '';
    const s = (ts - Date.now()) / 1000;
    const a = Math.abs(s);
    if (a < 45) return 'just now';
    for (const [lim, unit, div] of STEPS) {
      if (a < lim) {
        const v = Math.round(s / div);
        return rtf ? rtf.format(v, unit) : Math.abs(v) + ' ' + unit + (Math.abs(v) === 1 ? '' : 's') + ' ago';
      }
    }
    return '';
  };

  U.roman = function (n) {
    const map = [[1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']];
    let out = '';
    for (const [v, r] of map) while (n >= v) { out += r; n -= v; }
    return out;
  };

  U.num = (n) => Number(n || 0).toLocaleString();
  U.plural = (n, one, many) => U.num(n) + ' ' + (n === 1 ? one : many || one + 's');

  /* Per-viewer conveniences only (drafts, remembered tabs, reading position). Never the archive. */
  U.pref = {
    get(k, d) {
      try {
        const v = localStorage.getItem('fc:' + k);
        return v == null ? d : JSON.parse(v);
      } catch (e) {
        return d;
      }
    },
    set(k, v) {
      try {
        localStorage.setItem('fc:' + k, JSON.stringify(v));
      } catch (e) {
        /* storage blocked: conveniences simply don't persist */
      }
    },
    del(k) {
      try {
        localStorage.removeItem('fc:' + k);
      } catch (e) {
        /* ignore */
      }
    },
  };

  U.icon = (name, cls) =>
    '<svg class="ic' + (cls ? ' ' + cls : '') + '" aria-hidden="true" focusable="false"><use href="#i-' + name + '"></use></svg>';

  U.qs = (sel, root) => (root || document).querySelector(sel);
  U.qsa = (sel, root) => Array.from((root || document).querySelectorAll(sel));

  U.frag = function (html) {
    const t = document.createElement('template');
    t.innerHTML = html;
    return t.content;
  };
  U.el = function (html) {
    return U.frag(html.trim()).firstElementChild;
  };

  U.normName = (s) => String(s || '').trim().toLowerCase().replace(/\s+/g, ' ');

  U.splitList = (s) =>
    String(s || '')
      .split(',')
      .map((x) => x.trim())
      .filter(Boolean);

  U.sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  U.slug = (s) =>
    String(s || 'untitled')
      .toLowerCase()
      .replace(/[^\p{L}\p{N}]+/gu, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60) || 'untitled';

  U.isTyping = function (ev) {
    const t = ev.target;
    if (!t || !t.tagName) return false;
    const tag = t.tagName;
    return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || t.isContentEditable;
  };

  FC.U = U;
})();
