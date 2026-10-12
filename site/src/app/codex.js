/* ===== Codex: the framework's fixed reference, for consulting during Play ===== */

function simpleTable(head, rows) {
  return h("div", { class: "table-wrap" }, h("table", null, h("thead", null, h("tr", null, head.map((x) => h("th", null, x)))),
    h("tbody", null, rows.map((r) => h("tr", null, r.map((c) => h("td", null, c)))))));
}
function codexSection(sec, title, ...body) {
  return h("section", { class: "panel stack" }, h("div", { class: "panel-head" }, h("p", { class: "eyebrow" }, h("span", { class: "sec" }, sec), title)), ...body);
}
function renderCodex() {
  const root = $("#codex");
  clear(root);
  resetLive();
  const even = bandStrip(50, null).el;
  put(root,
    h("div", { class: "view-head" },
      h("p", { class: "eyebrow" }, h("span", { class: "sec" }, "§13–§25"), "Reference"),
      h("h1", null, "Codex"),
      h("p", { class: "lede" }, "The fixed parts of the framework, for consulting at the Table. The full text lives in skills/operative-mode/references.")),
    h("div", { class: "grid-2" },
      codexSection("§20", "Hard invariants: every level, Inline included", h("ol", { class: "inv" }, FRAMEWORK.invariants.map((x) => h("li", null, x)))),
      h("div", { class: "stack" },
        codexSection("§14.2", "The Continuation Checklist: silent, every continuation",
          h("ol", { class: "inv" }, FRAMEWORK.checklist.map(([n, t]) => h("li", null, h("b", null, n + ". "), t))),
          h("p", { class: "small muted" }, "Two more where relevant: new persistent facts go into the Record, and content goes in the Channel it belongs to.")),
        codexSection("§13.8", "Channels", simpleTable(["Channel", "Marker", "Carries"], FRAMEWORK.channels.map(([a, b, c]) => [a, h("span", { class: "token" }, b), c]))))),
    codexSection("§13.7", "The Intervention Ladder: each honoured at its own weight",
      simpleTable(["Rung", "Token", "Effect", "Play continues?"], FRAMEWORK.interventions.map((i) => [h("b", null, i.rung), h("span", { class: "token" }, i.token), i.effect, i.go]))),
    h("div", { class: "grid-2" },
      codexSection("§15.6", "The Odds Ladder", simpleTable(["Rung", "Odds", "Draw"], FRAMEWORK.ladder.map(([k, v]) => [k, String(v), v === 0 || v === 100 ? "None" : "d100"])),
        h("p", { class: "small muted" }, "Odds begin at Even and move one rung for each decisive Established factor, each one named.")),
      codexSection("§15.7", "Outcome Bands",
        simpleTable(["Draw r against odds T", "Band", "Oracle reads"], [["r ≤ T/2", FRAMEWORK.bands[0], FRAMEWORK.oracle[0]], ["r ≤ T", FRAMEWORK.bands[1], FRAMEWORK.oracle[1]],
          ["r ≤ (T+100)/2", FRAMEWORK.bands[2], FRAMEWORK.oracle[2]], ["otherwise", FRAMEWORK.bands[3], FRAMEWORK.oracle[3]]]),
        h("p", { class: "small muted" }, "At Even odds: 1–25 Clean Success, 26–50 Success at Cost, 51–75 Failure with Opening, 76–100 Clean Failure."), even)),
    h("div", { class: "grid-2" },
      codexSection("§7.6", "The Consequence Gate", simpleTable(["Tier", "Settled by"], FRAMEWORK.gate),
        h("p", { class: "small muted" }, "The Telegraph Rule: no Tier 2 or 3 consequence lands on your Character without a Telegraph or declared Stakes. The world may be lethal. It may not be sudden.")),
      codexSection("§23", "The Commitment Ladder", simpleTable(["Level", "Name", "Practice"], FRAMEWORK.commitment),
        h("p", { class: "small muted" }, "The Operator's possession of a secret grants no Character knowledge of it."))),
    codexSection("§18", "Drift, and its first Tell-tales", simpleTable(["Drift", "First Tell-tale", "Check"], FRAMEWORK.drift.map(([a, b, c]) => [h("b", null, a), b, c])),
      h("p", { class: "small muted" }, "Either Party may allege Drift. Recovery: identify → consult the Mode and the Record → judge → correct the Record → annul, reinterpret or restore → resume, amend between Parts, branch, close or withdraw.")),
    codexSection("§25.15", "Magical Drift", simpleTable(["Drift", "First Tell-tale", "Check"], MAGIC.drift.map(([a, b, c]) => [h("b", null, a), b, c]))),
    codexSection("§25.6", "The Residual Thaumaturgic Clause: what answers the Specification's silence",
      h("ol", { class: "inv" }, MAGIC.residual.map(([n, t]) => h("li", null, h("b", null, n + ". "), t)))),
    codexSection("§8.7", "Anchored Scales", simpleTable(["Parameter", "0", "2", "4"], FRAMEWORK.graded.map((g) => [h("b", null, g.id), g.a[0], g.a[1], g.a[2]])),
      h("p", { class: "small muted" }, "Values 1 and 3 lie between the anchors on either side. “Medium” is not a value.")),
    codexSection("App. D", "The Baseline Posture Library", postureTable()));
}
RENDER.codex = renderCodex;
