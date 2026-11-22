# Worldbuilding

The home of **Axel's Worldbuilding Framework, Revision 05 (Structuralist Edition)**: analysis, verification and development of fictional settings as structures, System first, Lore as proof calculus, Narrative never the resident register, with a Conceit Graph checker. It installs as its own plugin, separate from Operative Mode.

## Layout

```
worldbuilding/
  .claude-plugin/plugin.json   The plugin manifest ("worldbuilding")
  skills/
    worldbuilding-analysis/    Revision 05, the current skill
      SKILL.md                 Entry point: the Structuralist standpoint, levels, the framework in brief, protocols, outputs
      references/01–10         Ontology, pipeline, Conceit Graph, Structural Profile, Analysis and Verification Protocols,
                               Generative Mode, transmission, glossary, and the audit of Revision 04 with its migration map
      assets/                  Conceit Graph template (.json), report skeleton, registers, Ledger, Completion Certificate,
                               examples/ (the Salt Marches: a toy graph and the Survey written from it)
      scripts/                 conceit_graph.py (check, strike, order, seal, dot)
  projects/
    arania/                    Revision 05 Audit of Arania (Worldbuilding Project 49) and its Conceit Graph
```

Revision 04, the version Revision 05 replaces, is kept verbatim at [`../archive/worldbuilding-framework-revision-04.md`](../archive/worldbuilding-framework-revision-04.md), where the skill's own text says it lives, beside Operative Mode's Draft 0.3.

## Installing

**Claude Code, as a plugin.** At the prompt of a Claude Code session:

```
/plugin install worldbuilding --marketplace axelmenace/core-valley
```

**Claude Code, as a plain skill.** Copy the folder into your personal or project skills directory:

```
cp -r worldbuilding/skills/worldbuilding-analysis ~/.claude/skills/      # all projects
cp -r worldbuilding/skills/worldbuilding-analysis .claude/skills/        # this project only
```

**claude.ai / Claude desktop.** Run `./tools/package-skills.sh` from the repository root, then upload `dist/worldbuilding-analysis.zip` under Settings → Capabilities → Skills. It carries the same skill name as the one already there, so it replaces it; if claude.ai refuses the duplicate name, delete the old skill first.

## The checker

`conceit_graph.py` needs only Python 3 and the standard library. Without code execution the framework runs its graph checks by hand.

```
python worldbuilding/skills/worldbuilding-analysis/scripts/conceit_graph.py check worldbuilding/projects/arania/graph-v49.json
```

`check` runs every mechanical check, `strike` shows what loses its license if a Conceit is struck, `order` gives a definitional order for a codex, `seal` prints the graph's SHA-256 seal, and `dot` writes Graphviz source.

## Version history

| Revision | Where | Notes |
|---|---|---|
| 04 | `archive/` (formerly the claude.ai upload) | Two-phase pipeline, Conceit Graph, Verification Protocol, Structuralist Position; one file |
| 05 | `worldbuilding/skills/worldbuilding-analysis/` | Modal Test, Licensure (Determined/Elected), Stance, Closure Test and Sparsity Register, Structural Profile, Type Q, Certification Ladder, medium-indexed transmission, the checker. See `references/10-revision-05-notes.md` |
