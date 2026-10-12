/* ===== Threshold, masthead, boot ===== */

function renderModeChip() {
  const el = $("#modeChip");
  if (!el) return;
  clear(el);
  if (S.active) put(el, pill("live", "Active"), h("b", null, `${modeName()} v${S.active.version}`), h("span", { class: "muted" }, `Part ${S.active.part}`));
  else if (S.example) put(el, pill("", "Example"), h("b", null, S.example));
  else if (S.decl.name || S.decl.intent) put(el, pill("warn", "Candidate"), h("b", null, modeName()), h("span", { class: "muted" }, `${STEPS[S.step || 0].name}`));
}

function renderThreshold() {
  resetLive();
  const st = $("#thresholdStatus");
  clear(st);
  const done = STEPS.map((_, i) => stepStatus(i));
  put(st,
    h("div", { class: "panel-head" },
      h("p", { class: "eyebrow" }, h("span", { class: "sec" }, "§12"), "Your Mode"),
      h("h2", null, S.active ? `${modeName()} is active` : S.example ? `Worked example: ${S.example}` : S.decl.name || S.decl.intent ? `${modeName()}, a candidate` : "No Mode yet"),
      h("div", { class: "row tight" },
        S.active ? h("a", { class: "btn primary", href: "#table" }, "Go to the Table") : h("a", { class: "btn primary", href: "#deploy" }, S.decl.intent ? "Continue the sequence" : "Begin the sequence"),
        h("a", { class: "btn", href: "#play-menu" }, "Play Menu"))),
    S.decl.intent ? h("p", { class: "prose" }, "“" + S.decl.intent + "”") : h("p", { class: "prose muted" }, "Declaration → Completion → Validation → Election → Compilation → Proving → Amendment → Assent → Activation."),
    h("div", { class: "procession", style: "margin-top:14px" }, STEPS.map((s, i) => h("a", { href: "#deploy", class: done[i] === "done" ? "done" : "", onclick: () => { S.step = i; persist(); } },
      h("span", { class: "rn" }, roman(i + 1)), h("span", { class: "nm" }, s.name)))));

  const rl = $("#regressList");
  put(clear(rl), ...FRAMEWORK.failures.regression.map(([n, t]) => h("li", null, h("b", null, n), h("span", null, t.charAt(0).toUpperCase() + t.slice(1)))));

  const cp = $("#ceremonyPick");
  put(clear(cp),
    h("div", { class: "spread" }, h("div", { class: "stack tight" }, h("p", { class: "eyebrow" }, h("span", { class: "sec" }, "§21.2"), "Ceremony"),
      h("h2", { style: "font-size:1.8rem" }, "Choose a ceremony level first")),
      h("p", { class: "small muted", style: "max-width:46ch" }, "Imposing Full ratification on someone who wants to play now is a failure of the framework, not an application of it.")),
    h("div", { class: "grid-3" }, FRAMEWORK.ceremony.map((c) => h("button", { type: "button", class: "posture", "aria-pressed": String(S.ceremony === c.id),
      onclick: () => { S.ceremony = c.id; changed(); renderThreshold(); } },
      h("h3", null, c.id), h("p", null, h("b", null, "Use when: "), c.use), h("p", { class: "vals" }, "Produce: " + c.produce)))));
}
RENDER.threshold = renderThreshold;

function boot() {
  initCaps();
  const fromHash = () => show(location.hash.slice(1) || "threshold");
  window.addEventListener("hashchange", fromHash);
  fromHash();
}
boot();
