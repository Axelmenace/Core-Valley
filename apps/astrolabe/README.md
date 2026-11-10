# Astrolabe

A drafting and planning instrument for long-form fiction: short stories, novellas, novels and serials. It is one self-contained HTML file with no build step to run it and no server.

**Open it:** double-click `index.html`, serve the folder from any static host (GitHub Pages works), or publish it as a claude.ai Artifact.

## What it does

| View | For |
|---|---|
| **Write** | A distraction-free manuscript page. Select a scene to write it alone, or a chapter or part to write all its scenes as one continuous page; each scene still saves separately. Smart punctuation (curly quotes, `--` to em dash, `...` to ellipsis), bold and italic, scene breaks, splitting a scene in two at the cursor, typewriter scrolling and a focus mode that dims everything but the current paragraph. The binder and inspector each retract with a slide (topbar buttons, `Ctrl \` and `Ctrl Shift \`) and stay put between visits; a retracted binder peeks out when the pointer rests on the left edge. |
| **Board** | Index cards for every scene, grouped by chapter or episode. Edit titles and synopses on the card, drag to reorder or move between chapters, double-click to write. |
| **Outline** | Every scene in one table: point of view, location, status, words against target and synopsis, all editable in place. |
| **Threads** | Plotlines, subplots, arcs and mysteries as a scene-by-thread matrix. Flags a thread that goes quiet for four scenes or more. |
| **Codex** | The story bible: characters, places, factions, lore and magic, tech and artifacts, creatures, events, notes. Names and aliases are spotted in your scenes and shown in the inspector, and each entry lists the scenes it appears in. |
| **Progress** | Words against goal, today against the daily goal, streak (a day of cutting still counts as a day worked), 30-day chart, words-per-day needed to hit a deadline, words by chapter, scene status, sprint log, and a release schedule for serials. |

**Forms.** Each project is a short story (sections and scenes), novella or novel (parts, chapters and scenes) or serial (arcs, episodes with release dates and per-episode targets, and scenes). New projects can start from a structure: five-scene arc, three acts, seven-point, the hero's journey, kishōtenketsu, or a six-episode serial season.

**Finding and moving.** Find and replace runs across every scene (`Ctrl Shift H`), optionally through titles, synopses and notes as well; a typed straight quote finds the curly ones, and each scene is snapshotted before a replace. A scene, chapter or part can be sent to another place in the binder from its menu (**Move to…**), which is the way to rearrange on a touch screen, and a scene can be merged with the one after it.

**Safety nets.** Autosave on every pause. A snapshot of each scene the first time you edit it each day, plus manual snapshots (`Ctrl+Shift+S`) you can preview and restore. Deleting goes to a trash you can restore from. Full backups download as JSON and restore from the library; a restored file is checked and its prose cleaned before it is let in. If the same project is open in two tabs or on two devices, the one that falls behind brings itself up to date when you return to it, or asks which version to keep if both have changes.

**In and out.** Export a Word document or an HTML page in standard manuscript format, an e-book (EPUB), Markdown, plain text, an outline, or a project backup; leave any scene or chapter out of the export from the binder. Import a Markdown or text manuscript or a backup. A single `#` heading is the title and a `by …` line under it the author; several `#` headings are parts when there are `##` chapters beneath them, and chapters when there are not; `###` is a scene and `* * *` a scene break. A Markdown export can keep its scene titles as headings, so it reads back in with the same binder.

**Look.** Five skins: Auto (follows the system), Astral (deep void and astrolabe brass), Vellum (light observatory paper), Nebula (cyan and magenta HUD) and Ember (dark grimoire). Five prose faces, adjustable size, spacing and page width, and a slow starfield that can be turned off.

## Where your work is kept

| Opened as | Storage |
|---|---|
| A claude.ai Artifact (yours, or shared with you as an editor) | The artifact's database, in your own private subtree: only you can read it, on any device |
| A file or a static site | IndexedDB in that browser. Clearing the site's data erases it, so download a backup now and then; Astrolabe reminds you after a week, in the library and when you resume a project |
| A browser that refuses storage | Memory only, with a warning and a prompt before you close the page |

## Keys

| Keys | Action |
|---|---|
| `Ctrl K` | Command palette: jump to any scene, codex entry or command |
| `Ctrl S` | Save now |
| `Ctrl Shift S` | Snapshot the current scene |
| `Ctrl \` | Retract or bring back the binder. While it's away, rest the pointer on the left edge to peek at it |
| `Ctrl Shift \` | Retract or bring back the inspector |
| `Ctrl Shift H` | Find and replace across the manuscript |
| `Ctrl Shift F` | Focus mode (`Esc` leaves) |
| `Ctrl Alt N` | New scene after this one |
| `Ctrl Shift Enter` | Scene break |
| `Ctrl Alt ↑ / ↓` | Previous / next scene |
| `Alt 1–6` | Write, Board, Outline, Threads, Codex, Progress |
| Binder: `↑ ↓`, `Enter`, `F2`, `Del`, `Alt ↑ / ↓` | Move, open, rename, trash, reorder |

## Editing the source

`index.html` is built; edit `src/` and rebuild:

```
python tools/build-astrolabe.py                          # writes apps/astrolabe/index.html
python tools/build-astrolabe.py --fragment page.html     # also writes a body-only copy for an Artifact
```

```
src/shell.html     markup and the head (fonts, title)
src/style.css      tokens for the five skins, then every component, then a finishing layer (depth, ornament, motion)
src/js/core.js     helpers, story forms, the astrolabe ornament, the starfield
src/js/store.js    one key–value store over the Artifact database, IndexedDB or memory, with a write queue
src/js/model.js    projects, the binder tree, snapshots, structure templates, the sample, prose cleaning and import
src/js/formats.js  a small zip writer, and the Word and e-book exporters
src/js/editor.js   the manuscript page
src/js/views.js    Board, Outline, Threads, Codex, Progress
src/js/ui.js       binder, inspector, status bar, sprints, library, dialogs, export, command palette
src/js/find.js     find and replace across the manuscript
src/js/main.js     settings, keyboard shortcuts, boot
```
