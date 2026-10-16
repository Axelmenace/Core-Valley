# Ficcraft

*A scriptorium for the worlds you haven't finished yet.*

Ficcraft is a notebook for fantasy novelists who build worlds slowly. You log an idea the moment it strikes, then keep developing it for weeks or months in a single thread. The thread can run to thousands of entries without losing its shape.

It is a static, local-first web app: plain HTML, CSS and JavaScript, no build step, no server, no accounts, no tracking. Fonts come from Google Fonts; everything else ships in this folder.

## What's in it

**Realms.** One per world, book or series. Each realm has its own threads and codex.

**Threads.** One idea, followed for as long as it stays interesting. Entries come in kinds, and each kind looks different on the page:

| Kind | For |
|---|---|
| Musing | A thought, a note, a scrap |
| What If | A speculation to try on |
| Riddle | An open question; it stays on the Riddles list until you mark it answered |
| Canon | Settled truth about your world, sealed in gold |
| Fragment | A passage of prose or dialogue, set like a printed page |
| Lore | Research and borrowed facts |
| Waypoint | A heading that divides a long thread into stretches |
| Oracle | A question drawn from the deck |

Threads carry a status that moves like a forge fire: Spark, Kindling, Burning, Forged, or Banked (set aside, kept warm).

**Built for long threads.**
- Only a window of entries is in the page at once, so a 5,000-entry thread opens in about 150 ms.
- The **spine** at the right edge maps the whole thread: every entry is a tick coloured by kind, with waypoints as gold rules and ribbons as red flags. Drag it or use the arrow keys to move anywhere. It replaces the scrollbar, which can't represent entries that aren't rendered.
- **Find in thread** (Ctrl+F) searches every entry, rendered or not, and marks the hits on the spine.
- **Filters** show only some kinds of entry, for example only Canon, or only ribboned entries.
- **Ribbons** bookmark entries. **Waypoints** divide the thread; `[` and `]` jump between them.
- **Branches** split a new thread off any entry. Each side links to the other.
- The **distillation** holds what you currently believe about the idea, kept apart from the history that led there. It lives in the margin with the thread's waypoints, ribbons, canon, open riddles and named things.
- **Skim** mode shortens long entries. Day separators and session breaks keep the chronology readable. The thread reopens where you stopped reading, and when you return after a while a short note tells you what was left open.

**Codex.** Write `[[The Salt Synod]]` in any entry and it becomes a link. Names without an entry wait under *Unwritten names*. Every codex entry lists each place it was mentioned, under its name or any alias.

**Riddles.** Every open question across the realm, grouped by thread.

**Oracle.** A deck of 130 questions in ten suits (magic, customs, power, faith, land, history, trade, character, story, craft), plus questions written for each kind of codex entry. Draw one and inscribe it into a thread. When Ficcraft runs as a published Claude page, *Consult Claude* can also ask five questions about one thread. It only asks; it never writes your world, and it runs on the reader's own Claude account.

**Sample realm.** *The Drowned Marches* shows the pieces working together. Delete it from Settings when you're done.

## Running it

Any static host works:

```sh
cd ficcraft
python3 -m http.server 8000      # then open http://localhost:8000
```

On GitHub Pages, publish the repository root and the app lives at `/ficcraft/`.

For a single file you can hand to someone, or open by double-clicking:

```sh
python3 ficcraft/tools/bundle.py             # -> ficcraft/dist/ficcraft.html
python3 ficcraft/tools/bundle.py --artifact  # -> page content for a Claude artifact
```

## Where the writing is kept

- **On a website or from a file:** in the browser's IndexedDB, falling back to localStorage, then to memory with a warning. Each browser on each device keeps its own archive, and nothing is sent anywhere. Ficcraft asks the browser to keep the archive rather than evict it under storage pressure. **Settings → Export** writes a JSON archive that any copy of Ficcraft can import, so export now and then.
- **As a published Claude page:** each signed-in reader's archive is saved privately in their own Claude account (`data/users/<id>/` in the page's database), so it follows them between devices. A signed-out reader, or one without permission to write, falls back to browser storage, and the page says so. The page's database holds at most 25,000 documents across all its readers. That's ample for one writer or a small circle, but not for a public audience.

Entries are stored in chunks of up to 60 entries. A chunk splits automatically if it ever nears the 256 KiB per-document limit, so threads have no practical length limit. A single entry holds up to 50,000 characters.

## Keyboard

| Key | Does |
|---|---|
| `/` | Search the realm |
| `Ctrl+Enter` | Inscribe, or save an edit |
| `Ctrl+F` | Find in the open thread |
| `[` `]` | Previous / next waypoint |
| `i` | Jump to the entry box |
| `[[` | Link a codex name while typing |
| `Esc` | Close a dialog, menu or editor |

## Files

```
index.html            the shell and the icon sprite
css/ficcraft.css      vellum, ink, lapis and gold; a candlelit dark theme
js/util.js            helpers
js/markdown.js        a small, escape-first Markdown renderer with [[links]]
js/storage.js         IndexedDB / localStorage / Claude account adapters and the write-behind queue
js/model.js           realms, threads, entries, codex; chunking, links, search, import/export
js/oracle.js          the question deck
js/sample-realm.js    The Drowned Marches
js/ui.js              dialogs, menus, toasts, [[ autocomplete
js/thread.js          the thread view: window, spine, composer, find, margin
js/views.js           hall, threads, codex, riddles, oracle, search, settings, welcome
js/app.js             boot, storage choice, routing, the index
tools/bundle.py       inline everything into one HTML file
```
