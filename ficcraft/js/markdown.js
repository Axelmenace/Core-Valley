/* Ficcraft: a small, safe Markdown renderer.
   Everything is escaped first; only the constructs below become markup.
   [[Name]] and [[Name|shown text]] become codex links. */
(function () {
  'use strict';
  const FC = window.FC;
  const esc = FC.U.esc;

  const WL_SRC = '\\[\\[([^\\[\\]|\\n]{1,160})(?:\\|([^\\[\\]\\n]{1,160}))?\\]\\]';
  const RE_LIST = /^\s{0,3}([-*+]|\d{1,3}[.)])\s+(.*)$/;
  const RE_HEAD = /^\s{0,3}(#{1,4})\s+(.+?)\s*#*\s*$/;
  const RE_HR = /^\s{0,3}([-*_])(\s*\1){2,}\s*$/;
  const RE_QUOTE = /^\s{0,3}>\s?(.*)$/;
  const RE_FENCE = /^\s{0,3}```/;

  let resolver = null;

  function emph(s) {
    return s
      .replace(/\*\*(?=\S)([^\n]*?\S)\*\*/g, '<strong>$1</strong>')
      .replace(/__(?=\S)([^\n]*?\S)__/g, '<strong>$1</strong>')
      .replace(/(^|[^*\p{L}\p{N}])\*(?=\S)([^*\n]*?\S)\*(?![*\p{L}\p{N}])/gu, '$1<em>$2</em>')
      .replace(/(^|[^_\p{L}\p{N}])_(?=\S)([^_\n]*?\S)_(?![_\p{L}\p{N}])/gu, '$1<em>$2</em>')
      .replace(/~~(?=\S)([^~\n]*?\S)~~/g, '<del>$1</del>');
  }

  function inline(raw) {
    const stash = [];
    const keep = (html) => '\u0001' + (stash.push(html) - 1) + '\u0002';
    let s = String(raw);
    s = s.replace(/`([^`\n]+)`/g, (_, c) => keep('<code>' + esc(c) + '</code>'));
    s = s.replace(new RegExp(WL_SRC, 'g'), (_, name, label) => {
      const n = name.trim();
      const known = resolver ? resolver(n) : true;
      return keep(
        '<a class="wl' + (known ? '' : ' wl-missing') + '" href="#" data-wl="' + esc(n) + '"' +
          (known ? '' : ' title="Not in the codex yet. Click to write it."') + '>' +
          emph(esc((label || name).trim())) + '</a>'
      );
    });
    s = s.replace(/\[([^\]\n]{1,300})\]\((https?:\/\/[^\s()]+)\)/g, (_, t, u) =>
      keep('<a href="' + esc(u) + '" target="_blank" rel="noopener noreferrer">' + emph(esc(t)) + '</a>')
    );
    s = emph(esc(s));
    return s.replace(/\u0001(\d+)\u0002/g, (_, i) => stash[+i]);
  }

  function isBlockStart(l) {
    return RE_HEAD.test(l) || RE_HR.test(l) || RE_QUOTE.test(l) || RE_FENCE.test(l) || RE_LIST.test(l);
  }

  function blocks(lines) {
    let out = '';
    let i = 0;
    let m;
    while (i < lines.length) {
      const l = lines[i];
      if (!l.trim()) { i++; continue; }

      if (RE_FENCE.test(l)) {
        const buf = [];
        i++;
        while (i < lines.length && !RE_FENCE.test(lines[i])) buf.push(lines[i++]);
        i++;
        out += '<pre><code>' + esc(buf.join('\n')) + '</code></pre>';
        continue;
      }
      if ((m = RE_HEAD.exec(l))) {
        const lv = Math.min(6, m[1].length + 2);
        out += '<h' + lv + '>' + inline(m[2]) + '</h' + lv + '>';
        i++;
        continue;
      }
      if (RE_HR.test(l)) {
        out += '<hr>';
        i++;
        continue;
      }
      if (RE_QUOTE.test(l)) {
        const buf = [];
        while (i < lines.length && (m = RE_QUOTE.exec(lines[i]))) { buf.push(m[1]); i++; }
        out += '<blockquote>' + blocks(buf) + '</blockquote>';
        continue;
      }
      if ((m = RE_LIST.exec(l))) {
        const ordered = /\d/.test(m[1]);
        const start = ordered ? parseInt(m[1], 10) : 1;
        const items = [];
        while (i < lines.length) {
          const lm = RE_LIST.exec(lines[i]);
          if (lm && /\d/.test(lm[1]) === ordered) { items.push(lm[2]); i++; }
          else if (items.length && lines[i].trim() && /^\s{2,}/.test(lines[i])) { items[items.length - 1] += '\n' + lines[i].trim(); i++; }
          else break;
        }
        const tag = ordered ? 'ol' : 'ul';
        out += '<' + tag + (ordered && start !== 1 ? ' start="' + start + '"' : '') + '>' +
          items.map((t) => '<li>' + t.split('\n').map(inline).join('<br>') + '</li>').join('') +
          '</' + tag + '>';
        continue;
      }
      const buf = [];
      while (i < lines.length && lines[i].trim() && !(buf.length && isBlockStart(lines[i]))) buf.push(lines[i++]);
      out += '<p>' + buf.map(inline).join('<br>') + '</p>';
    }
    return out;
  }

  function render(src, opts) {
    resolver = (opts && opts.resolve) || null;
    try {
      const lines = String(src || '').replace(/\r\n?/g, '\n').replace(/[\u0001\u0002]/g, '').split('\n');
      return blocks(lines);
    } finally {
      resolver = null;
    }
  }

  function renderInline(src, opts) {
    resolver = (opts && opts.resolve) || null;
    try {
      return inline(String(src || '').replace(/[\u0001\u0002\n]/g, ' '));
    } finally {
      resolver = null;
    }
  }

  /* Every [[link]] target in a text, trimmed, original casing. */
  function links(src) {
    const out = [];
    if (!src || src.indexOf('[[') < 0) return out;
    const re = new RegExp(WL_SRC, 'g');
    let m;
    while ((m = re.exec(src))) out.push(m[1].trim());
    return out;
  }

  FC.md = { render, inline: renderInline, links };
})();
