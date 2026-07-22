# Global

This is the one file every task reads unconditionally, per
[addContext.md](../prompts/addContext.md) §1 — kept short on purpose, because
always-loaded noise causes drift (see [aiNotes.md](../humanNotes/aiNotes.md)).
Implementation detail belongs in the topic files it points to below, not here; if
you're looking for *how* something is built, this file is the wrong place — go to §2's
map instead.

Core decision, stated once: **this is a single-user, mobile-first web app with no
backend — everything below exists to prevent a task from guessing at platform or
deployment shape, not to re-explain the codebase.**

## 0. What this app is

A scheduling tool for a solo cleaning-service operator, used on their phone. It is not
a generic to-do/calendar app — the data model is exactly three entities (see
[definitions/CLAUDE.md](../src/definitions/CLAUDE.md)): **clients** (who they clean
for), **appointments** (scheduled jobs, with a charge to the client and an expense paid
to the helper), and **payments** (has the client paid, has the helper been paid out).
The Finance page's "Owed to Ines" label names the helper directly — this app tracks one
person's cleaning business, not a multi-tenant product.

## 1. Platform and deployment shape

- **Mobile web, mobile-first.** Every page layout and touch target
  (`pages/pages.css`'s breakpoints, the 48px minimum button height) is built for a
  phone screen first, desktop as the wider case — not the other way around.
- **PWA is installed but not wired up.** `vite-plugin-pwa` is a dependency, but
  `vite.config.ts` doesn't include it in `plugins` and there is no manifest yet. Don't
  assume installability, offline support, or a service worker exist today.
- **No backend, no auth, no multi-user.** All data lives in `localStorage` via
  Zustand's `persist` middleware (see [stores/CLAUDE.md](../src/stores/CLAUDE.md)).
  There is no account/session concept anywhere in the data model, and
  [errorHandling.md](errorHandling.md) §1 exists partly because there's no server to
  hand fallibility to — this app owns every failure mode itself.

## 2. Map of the context system

Everything else loads by trigger or by target module, per
[addContext.md](../prompts/addContext.md) §1 — this is the index, not the content:

| File | Load when… |
|---|---|
| [directoryLogic.md](directoryLogic.md) | the task creates, moves, or renames any file |
| [errorHandling.md](errorHandling.md) | the task touches fallible code, IO, validation, or error UI |
| [testing.md](testing.md) | the task writes or changes any test (almost always) |
| [design.md](design.md) | the task changes anything the user can see |
| `src/<module>/CLAUDE.md` | the task's target module has one — currently exist for `definitions/`, `hooks/`, `lib/`, `pages/`, `stores/`; `components/` and its subfolders don't have one yet, use the topic files' canonical examples instead |
| [../prompts/addContext.md](../prompts/addContext.md) | drafting or executing a task file (`prompts/add.md`) |
| [../humanNotes/aiNotes.md](../humanNotes/aiNotes.md) | the *why* behind a rule is needed — rare; this is philosophy for humans, not day-to-day reference |

## Verification status

Per [aiNotes.md](../humanNotes/aiNotes.md): enforced beats specified.

Enforced mechanically today: nothing — this is a file an AI is asked to read, and
nothing currently checks that it was.

Not yet enforced (caught only by re-reading this file):
- a task proceeding without having read this file first
- this file's §2 map going stale when a new topic file or module `CLAUDE.md` is added
  (the discipline that should prevent it lives in
  [addContext.md](../prompts/addContext.md) §6, which currently only names
  `addContext.md`'s own map as something to check — this file's map should be checked
  at the same time and isn't yet)
