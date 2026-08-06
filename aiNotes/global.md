# Global

This is the one file every task reads unconditionally, per
[CLAUDE.md](../CLAUDE.md) — kept short on purpose, because
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

Everything else loads by trigger or by target module — this is the index, not the
content:

| File | Load when… |
|---|---|
| [directoryLogic.md](directoryLogic.md) | the task creates, moves, or renames any file |
| [errorHandling.md](errorHandling.md) | the task touches fallible code, IO, validation, or error UI |
| [testing.md](testing.md) | the task writes or changes any test (almost always) |
| [design.md](design.md) | the task changes anything the user can see |
| `src/<module>/CLAUDE.md` | the task's target module has one — currently exist for `definitions/`, `hooks/`, `lib/`, `pages/`, `stores/`; `components/` and its subfolders don't have one yet, use the topic files' canonical examples instead |
| [../docs/agents/domain.md](../docs/agents/domain.md) | the task needs the business-level picture — points at root [../CONTEXT.md](../CONTEXT.md) (product/feature vision) and `docs/adr/`; note CONTEXT.md describes the full intended feature set, some of which (invoicing, inventory, analytics — see its "Recommended Addition" modules) isn't built yet, whereas §0 above is what actually exists today |
| [../docs/agents/issue-tracker.md](../docs/agents/issue-tracker.md) | the task creates, reads, or comments on a GitHub issue |
| [../humanNotes/aiNotes.md](../humanNotes/aiNotes.md) | the *why* behind a rule is needed — rare; this is philosophy for humans, not day-to-day reference |

## Verification status

Per [aiNotes.md](../humanNotes/aiNotes.md): enforced beats specified.

Enforced mechanically today: nothing — this is a file an AI is asked to read, and
nothing currently checks that it was.

Not yet enforced (caught only by re-reading this file):
- a task proceeding without having read this file first — the only guarantee is
  root [CLAUDE.md](../CLAUDE.md) pointing here at the start of every session;
  nothing checks that the pointer was actually followed
- this file's §2 map going stale when a new topic file, module `CLAUDE.md`, or
  `docs/agents/*.md` file is added — no tooling checks the map against the
  filesystem, so a new file here needs a manual row added at the same time
