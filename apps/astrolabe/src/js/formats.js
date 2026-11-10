/* ── formats: a small zip writer, and the Word and e-book exporters ─────────
   Both exporters take the same plain description of a manuscript:
     meta  { title, author, words, contact, font, sep }
     doc   [{ kind: "part" | "chapter", text } | { kind: "break" } | { kind: "para", runs }]
   where runs come from inlineRuns(): [{ t, b, i } | { br: true }]. */
const Formats = (() => {
  const enc = new TextEncoder();
  const CRC = new Uint32Array(256).map((_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; return c >>> 0; });
  const crc32 = b => { let c = ~0; for (let i = 0; i < b.length; i++) c = CRC[(c ^ b[i]) & 255] ^ (c >>> 8); return ~c >>> 0; };

  /* files: [[name, string | Uint8Array]], stored without compression (which is all an e-book's first entry may be). */
  function zip(files) {
    const chunks = [], central = []; let offset = 0;
    for (const [name, content] of files) {
      const nb = enc.encode(name), data = typeof content === "string" ? enc.encode(content) : content, crc = crc32(data);
      const h = new DataView(new ArrayBuffer(30));
      h.setUint32(0, 0x04034b50, true); h.setUint16(4, 20, true); h.setUint16(6, 0x0800, true); // names are UTF-8
      h.setUint16(12, 33, true); // 1 January 1980: the same bytes for the same book, whenever it is exported
      h.setUint32(14, crc, true); h.setUint32(18, data.length, true); h.setUint32(22, data.length, true); h.setUint16(26, nb.length, true);
      const c = new DataView(new ArrayBuffer(46));
      c.setUint32(0, 0x02014b50, true); c.setUint16(4, 20, true); c.setUint16(6, 20, true); c.setUint16(8, 0x0800, true); c.setUint16(14, 33, true);
      c.setUint32(16, crc, true); c.setUint32(20, data.length, true); c.setUint32(24, data.length, true); c.setUint16(28, nb.length, true); c.setUint32(42, offset, true);
      chunks.push(new Uint8Array(h.buffer), nb, data); central.push(new Uint8Array(c.buffer), nb);
      offset += 30 + nb.length + data.length;
    }
    const size = central.reduce((a, b) => a + b.length, 0);
    const e = new DataView(new ArrayBuffer(22));
    e.setUint32(0, 0x06054b50, true); e.setUint16(8, files.length, true); e.setUint16(10, files.length, true); e.setUint32(12, size, true); e.setUint32(16, offset, true);
    const all = [...chunks, ...central, new Uint8Array(e.buffer)], out = new Uint8Array(offset + size + 22);
    let p = 0; for (const a of all) { out.set(a, p); p += a.length; }
    return out;
  }

  const xml = s => String(s ?? "").replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f￾￿]/g, "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  function inlineRuns(html) {
    const t = document.createElement("template"); t.innerHTML = html || ""; const out = [];
    const walk = (n, b, i) => n.childNodes.forEach(c => {
      if (c.nodeType === 3) { if (c.nodeValue) out.push({ t: c.nodeValue, b, i }); }
      else if (c.nodeType === 1) { if (c.tagName === "BR") out.push({ br: true }); else walk(c, b || c.tagName === "STRONG" || c.tagName === "B", i || c.tagName === "EM" || c.tagName === "I"); }
    });
    walk(t.content, false, false);
    return out;
  }
  const roundWords = w => (w < 20000 ? Math.max(100, Math.round(w / 100) * 100) : Math.round(w / 1000) * 1000);

  /* ═════ Word: standard manuscript format ═════ */
  const W = 'xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"';
  function docx(meta, doc) {
    const font = meta.font === "courier" ? "Courier New" : "Times New Roman";
    const run = r => r.br ? "<w:r><w:br/></w:r>" : `<w:r>${r.b || r.i ? `<w:rPr>${r.b ? "<w:b/>" : ""}${r.i ? "<w:i/>" : ""}</w:rPr>` : ""}<w:t xml:space="preserve">${xml(r.t)}</w:t></w:r>`;
    const para = (style, inner) => `<w:p><w:pPr><w:pStyle w:val="${style}"/></w:pPr>${inner}</w:p>`;
    const text = (style, s) => para(style, s ? run({ t: s }) : "");
    const author = meta.author || "Author name", surname = meta.author ? author.trim().split(/\s+/).pop() : "Author";
    let body = "";
    for (const line of (meta.contact || "Address · email · phone").split("\n")) body += text("Contact", line);
    body += text("Contact", author) + para("Count", run({ t: "About " + roundWords(meta.words).toLocaleString("en-US") + " words" }));
    body += text("TitlePage", meta.title.toUpperCase()) + text("Center", "by " + author);
    let first = true, started = false;
    for (const it of doc) {
      if (it.kind === "part") { body += text("Heading1", it.text); first = true; started = true; }
      else if (it.kind === "chapter") { body += text("Heading2", it.text); first = true; started = true; }
      else if (it.kind === "break") { body += text("Center", meta.sep); first = true; }
      else {
        if (!started) { body += '<w:p><w:r><w:br w:type="page"/></w:r></w:p>'; started = true; } // a story with no headings starts on a page of its own
        body += para(first ? "First" : "Body", it.runs.map(run).join("")); first = false;
      }
    }
    body += text("Center", "END");
    const document = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document ${W}><w:body>${body}<w:sectPr><w:headerReference w:type="default" r:id="rId1"/><w:pgSz w:w="12240" w:h="15840"/><w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440" w:header="720" w:footer="720" w:gutter="0"/><w:titlePg/></w:sectPr></w:body></w:document>`;
    const style = (id, name, ppr, extra = "") => `<w:style w:type="paragraph" w:styleId="${id}"><w:name w:val="${name}"/><w:basedOn w:val="Normal"/>${extra}<w:pPr>${ppr}</w:pPr></w:style>`;
    const styles = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles ${W}><w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="${font}" w:hAnsi="${font}" w:cs="${font}"/><w:sz w:val="24"/><w:szCs w:val="24"/><w:lang w:val="en-US"/></w:rPr></w:rPrDefault></w:docDefaults>
<w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/><w:pPr><w:spacing w:before="0" w:after="0" w:line="480" w:lineRule="auto"/></w:pPr></w:style>
${style("Body", "Body Text", '<w:ind w:firstLine="720"/>')}
${style("First", "Body Text First", "")}
${style("Center", "Centered", '<w:jc w:val="center"/>')}
${style("Contact", "Contact", '<w:spacing w:line="240" w:lineRule="auto"/>')}
${style("Count", "Word Count", '<w:spacing w:line="240" w:lineRule="auto"/><w:jc w:val="right"/>')}
${style("TitlePage", "Title Page", '<w:spacing w:before="4320"/><w:jc w:val="center"/>')}
${style("Heading1", "heading 1", '<w:pageBreakBefore/><w:spacing w:before="2880" w:after="480"/><w:jc w:val="center"/><w:outlineLvl w:val="0"/>', '<w:next w:val="First"/><w:rPr><w:caps/></w:rPr>')}
${style("Heading2", "heading 2", '<w:pageBreakBefore/><w:spacing w:before="2880" w:after="480"/><w:jc w:val="center"/><w:outlineLvl w:val="1"/>', '<w:next w:val="First"/>')}
${style("Header", "header", '<w:spacing w:line="240" w:lineRule="auto"/><w:jc w:val="right"/>')}
</w:styles>`;
    const header = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:hdr ${W}><w:p><w:pPr><w:pStyle w:val="Header"/></w:pPr><w:r><w:t xml:space="preserve">${xml(surname)} / ${xml(meta.title.slice(0, 40).toUpperCase())} / </w:t></w:r><w:r><w:fldChar w:fldCharType="begin"/></w:r><w:r><w:instrText xml:space="preserve"> PAGE </w:instrText></w:r><w:r><w:fldChar w:fldCharType="separate"/></w:r><w:r><w:t>1</w:t></w:r><w:r><w:fldChar w:fldCharType="end"/></w:r></w:p></w:hdr>`;
    const WML = "application/vnd.openxmlformats-officedocument.wordprocessingml.", REL = "http://schemas.openxmlformats.org/officeDocument/2006/relationships";
    return zip([
      ["[Content_Types].xml", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="${WML}document.main+xml"/><Override PartName="/word/styles.xml" ContentType="${WML}styles+xml"/><Override PartName="/word/header1.xml" ContentType="${WML}header+xml"/><Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/></Types>`],
      ["_rels/.rels", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="${REL}/officeDocument" Target="word/document.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/></Relationships>`],
      ["docProps/core.xml", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:title>${xml(meta.title)}</dc:title><dc:creator>${xml(meta.author || "")}</dc:creator></cp:coreProperties>`],
      ["word/document.xml", document],
      ["word/styles.xml", styles],
      ["word/header1.xml", header],
      ["word/_rels/document.xml.rels", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="${REL}/header" Target="header1.xml"/><Relationship Id="rId2" Type="${REL}/styles" Target="styles.xml"/></Relationships>`],
    ]);
  }

  /* ═════ E-book: EPUB 3, with the older table of contents alongside for older readers ═════ */
  function epub(meta, doc) {
    const author = meta.author || "", lang = "en";
    const run = r => r.br ? "<br/>" : (r.b ? "<strong>" : "") + (r.i ? "<em>" : "") + xml(r.t) + (r.i ? "</em>" : "") + (r.b ? "</strong>" : "");
    const page = (title, body) => `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="${lang}" xml:lang="${lang}"><head><meta charset="utf-8"/><title>${xml(title)}</title><link rel="stylesheet" type="text/css" href="style.css"/></head><body>${body}</body></html>`;
    // One file per part heading and per chapter; text before any heading is a section of its own.
    const sections = []; let cur = null, first = true;
    const open = (label, head) => { cur = { label, body: head }; sections.push(cur); first = true; };
    for (const it of doc) {
      if (it.kind === "part") open(it.text, `<h1 class="part">${xml(it.text)}</h1>`);
      else if (it.kind === "chapter") open(it.text, `<h2 class="chapter">${xml(it.text)}</h2>`);
      else {
        if (!cur) open(meta.title, "");
        if (it.kind === "break") { cur.body += `<p class="brk">${xml(meta.sep)}</p>`; first = true; }
        else { cur.body += `<p${first ? ' class="first"' : ""}>${it.runs.map(run).join("")}</p>`; first = false; }
      }
    }
    if (!sections.length) open(meta.title, "<p> </p>");
    sections.forEach((s, i) => { s.file = "s" + String(i + 1).padStart(3, "0") + ".xhtml"; if (!s.body) s.body = "<p> </p>"; });
    const id = "astrolabe:" + meta.id, stamp = new Date().toISOString().replace(/\.\d+Z$/, "Z");
    const items = sections.map((s, i) => `<item id="s${i + 1}" href="${s.file}" media-type="application/xhtml+xml"/>`).join("");
    const opf = `<?xml version="1.0" encoding="utf-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="uid" xml:lang="${lang}"><metadata xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:identifier id="uid">${xml(id)}</dc:identifier><dc:title>${xml(meta.title)}</dc:title>${author ? `<dc:creator>${xml(author)}</dc:creator>` : ""}<dc:language>${lang}</dc:language><meta property="dcterms:modified">${stamp}</meta></metadata>
<manifest><item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/><item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/><item id="css" href="style.css" media-type="text/css"/><item id="title" href="title.xhtml" media-type="application/xhtml+xml"/>${items}</manifest>
<spine toc="ncx"><itemref idref="title"/>${sections.map((_, i) => `<itemref idref="s${i + 1}"/>`).join("")}</spine></package>`;
    const nav = page("Contents", `<nav epub:type="toc" id="toc"><h1>Contents</h1><ol>${sections.map(s => `<li><a href="${s.file}">${xml(s.label)}</a></li>`).join("")}</ol></nav>`);
    const ncx = `<?xml version="1.0" encoding="utf-8"?>
<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1"><head><meta name="dtb:uid" content="${xml(id)}"/></head><docTitle><text>${xml(meta.title)}</text></docTitle><navMap>${sections.map((s, i) => `<navPoint id="n${i + 1}" playOrder="${i + 1}"><navLabel><text>${xml(s.label)}</text></navLabel><content src="${s.file}"/></navPoint>`).join("")}</navMap></ncx>`;
    const css = `body { font-family: serif; line-height: 1.5; margin: 0 5%; }
h1, h2 { text-align: center; font-weight: normal; margin: 3em 0 1.5em; page-break-before: always; }
h1.part { text-transform: uppercase; letter-spacing: .08em; }
p { margin: 0; text-indent: 1.5em; text-align: justify; }
p.first { text-indent: 0; }
p.brk { text-indent: 0; text-align: center; margin: 1em 0; }
.titlepage { text-align: center; margin-top: 30%; }
.titlepage h1 { page-break-before: auto; margin: 0 0 1em; }
.titlepage p { text-indent: 0; text-align: center; }
`;
    return zip([
      ["mimetype", "application/epub+zip"],
      ["META-INF/container.xml", `<?xml version="1.0" encoding="utf-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container"><rootfiles><rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/></rootfiles></container>`],
      ["OEBPS/content.opf", opf], ["OEBPS/nav.xhtml", nav], ["OEBPS/toc.ncx", ncx], ["OEBPS/style.css", css],
      ["OEBPS/title.xhtml", page(meta.title, `<div class="titlepage"><h1>${xml(meta.title)}</h1>${author ? `<p>${xml(author)}</p>` : ""}</div>`)],
      ...sections.map(s => ["OEBPS/" + s.file, page(s.label, s.body)]),
    ]);
  }

  return { zip, docx, epub, inlineRuns };
})();
