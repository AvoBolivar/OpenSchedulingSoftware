# Directory Logic

This is the enforced-by-convention placement system for `src/`. It exists so that
placement of a new file is a lookup, not a judgment call. When generating or moving
code, follow these rules exactly. If a rule and the existing code disagree, the rule
wins — flag the file as a cleanup candidate rather than copying its shape. If a task
doesn't fit any rule here, say so and ask — don't invent a placement.

## 1. Top-level `src/` layers

| Folder | Contains | Depends on |
|---|---|---|
| `definitions/` | TypeScript interfaces only, one per domain entity | nothing |
| `stores/` | Zustand state stores, one per entity | `definitions/`, other `stores/` (via `getState()`) |
| `hooks/` | Cross-cutting React hooks | `definitions/`, `stores/`, other `hooks/` |
| `lib/` | Pure/IO utility functions (not components, not hooks) | `definitions/`, `stores/` (for import/export-style IO only) |
| `components/` | All UI, see §2 | `definitions/`, `stores/`, `hooks/`, `lib/`, other `components/` per §2 |
| `pages/` | One component per nav-bar tab + the root shell | everything above |
| `App.tsx`, `main.tsx` | Entry points, live at `src/` root, not in a folder | `pages/` |
| `testUtils/` | Shared test helpers only (`resetStores`, `builders`, `render`, `setup`) — see [testing.md](testing.md) §0 | may import from anywhere; nothing outside a `.test.*` file may import from it |

`*.test.ts(x)` files are the one placement exception: they are co-located next to the
file they test, not grouped under any folder above — see [testing.md](testing.md) §0.

This is a strict dependency chain:

```
definitions → stores / lib → hooks → components/basic → components/<feature> → pages
```

**Rule:** nothing imports "upward" in this chain (e.g. a store must never import a
component; `basic/` must never import a feature folder).

**Note on store access:** the chain shows `hooks` between stores and components, but
hooks are *optional*, not a mandatory pass-through. Any component (including `basic/`)
may call a store hook (`useClientStore`) directly. A `hooks/` file exists only when
logic is shared across multiple components — never wrap a store in a hook just to
satisfy the chain. Canonical example of direct store access from `basic/`:
[basic/cards/appointmentCard.tsx](../src/components/basic/cards/appointmentCard.tsx).

## 2. `components/` subfolder taxonomy

- **`basic/`** — generic, feature-agnostic UI primitives. A component belongs here only
  if it imports no other component outside `basic/`. It may read a store directly for
  display purposes (e.g. resolving a name from an ID) but must never import a
  create/update/delete component from a feature folder. Layout: one folder per
  primitive, `basic/<name>/<name>.tsx` + co-located `<name>.css`.
  Canonical example: [basic/cards/appointmentCard.tsx](../src/components/basic/cards/appointmentCard.tsx)
  — reads `useClientStore` for display, takes `onClick` as a prop, has zero feature
  imports.
  Exception: `basic/cards/` is a shared folder for the whole family of presentational
  "Card" components (`appointmentCard`, `collectionCard`, `financeCard`, `payoutCard`),
  rather than one folder per card — they're small and belong together.

- **Feature folders** — one per domain entity that needs a full CRUD UI. Named
  `<entity>List/` (plural entity + `List`, regardless of whether it renders as a visual
  list or a table). Canonical example: [components/clientsList/](../src/components/clientsList/).
  Each feature folder is self-contained ("its own project") and holds:
  - a thin container component, named exactly after the folder in PascalCase
    (`clientsList/clientsList.tsx` exports `ClientsList`), which composes the read view
    and nothing else
  - CRUD subcomponents named `read<Entity>.tsx`, `create<Entity>.tsx`,
    `update<Entity>.tsx`, `delete<Entity>.tsx` — include only the verbs the entity
    actually needs (e.g. a derived/joined entity like collections has no
    `create`/`delete` file, since it isn't directly owned)
  - the entity's card component, only when required by the card placement rule below

  **Scope limit:** a feature folder is always one entity's CRUD UI. If a new feature is
  *not* that — a dashboard, a multi-entity workflow, a wizard — it does not get a
  `<entity>List/` folder. Stop and ask where it goes; that decision gets added to this
  file, not improvised.

- **Card placement (the `basic/cards/` vs feature-folder decision).** Placement follows
  from imports, so decide it directionally, not up front:
  1. **Start every card in `basic/cards/`**, purely presentational: props in,
     `onClick`/callbacks out.
  2. The moment the card needs to import a feature's `update`/`delete` component,
     that is the trigger to move it into that feature folder
     (e.g. `clientsList/clientCard.tsx`).
  3. Before moving it, check whether the card should instead *stay* presentational and
     receive the action as a prop — prefer that when the card is used by more than one
     feature. Move it only if the card is genuinely owned by one feature's CRUD
     lifecycle.
  A card never lives in a feature folder "just in case."

- **`confirmationModals/`** — standalone confirmation-flow modals not tied to one
  feature's CRUD lifecycle (`appointmentFinished.tsx`, `payHelper.tsx`). Composed by
  whichever feature folder needs them; never composed by `basic/`.

- **`modal/`, `calendar/`** — single generic primitives with exactly one component
  each, each in their own folder, used across multiple feature folders.

- **`settings/`** — flat folder for app-level settings/utility actions (currently just
  `importExportData.tsx`). Stays flat, one file per action; only split into subfolders
  once it holds 2+ distinct settings features that each need multiple files.

- **Cross-feature imports are not allowed.** Do not import `appointmentsList/*` from
  `clientsList/*` or vice versa. If two feature folders need the same piece of UI:
  1. **Default: promote it to `basic/`.**
  2. **Duplicate instead** only when promoting would break a `basic/` rule — i.e. the
     shared piece would need a feature CRUD import, or store access beyond read-only
     display. Duplication is the exception, not a convenience; if you duplicate, note
     it in a comment at the top of both copies (`// duplicated from X, see
     directoryLogic.md §2`) so the pair is findable later.

## 3. Naming conventions

- **Filenames**: camelCase, matching the primary export exactly except for a lowercase
  first letter (`ClientCard` → `clientCard.tsx`). Hooks and stores already start
  lowercase (`useClientStore`), so the filename is verbatim:
  `stores/useClientStore.ts`, `hooks/useClient.ts`.
- **Exports**: one *primary* export per file, named after the file.
  - Components: PascalCase **default** export (`clientCard.tsx` →
    `export default ClientCard`).
  - Stores and hooks: **named** export, verbatim filename
    (`export const useClientStore = ...`). Do not convert stores/hooks to default
    exports to match the component rule — the rules differ on purpose.
  - Small helper exports alongside the primary export are fine; a second
    component/store/hook in the same file is not — that's a new file.
- **CSS**: co-located, same basename as its component (`clientCard.tsx` +
  `clientCard.css`), imported via a relative `./` import. A component only gets its own
  `.css` file if it defines its own class names. If it only composes other
  already-styled components (e.g. `deleteClient.tsx`, which is just `Button` + `Modal`),
  it needs no CSS file. A component may deliberately import a *sibling's* CSS if it
  intentionally reuses that markup shape verbatim (e.g. `payoutCard.tsx` imports
  `collectionCard.css`) — that must be a deliberate reuse decision, never a stand-in
  for a missing file.
- **Type interfaces**: `definitions/<entity>.ts`, one interface per file, PascalCase
  singular name matching the lowercase singular filename (`client.ts` → `Client`).
- **Store files**: `stores/use<Entity>Store.ts`, exporting `use<Entity>Store`, one per
  entity, `create<...>()(persist(...))`. CRUD action names: `set<Entities>`,
  `create<Entity>`, `get<Entity>`, `update<Entity>`, `delete<Entity>`.
  Derived/computed selectors are named as questions the UI asks (`getTotalOwed`,
  `getPaymentsToPayout`), not as generic getters.
- **Page files**: `pages/<entity>Page.tsx` for each nav-bar tab (`clientsPage.tsx`,
  `financePage.tsx`, `appointmentsPage.tsx`); the root shell is `home.tsx` (no `Page`
  suffix — it isn't a tab, it's the container that switches between tabs).

## 4. Verification status

These rules are prose only right now — nothing in CI enforces them. Per the philosophy
in [aiNotes.md](../humanNotes/aiNotes.md), an unenforced rule is a suggestion, not a constraint.

Currently enforced mechanically:
- `npx tsc -b` — catches broken import paths and casing mismatches (TS1261) after a
  move/rename. Cannot catch a misplaced file or a layering violation (e.g. `basic/`
  importing a feature component); those only get caught by re-reading this file.

Next step (not yet done): an ESLint import-boundary rule (e.g.
`eslint-plugin-boundaries`) encoding §1's dependency chain and §2's cross-feature
import ban, so a bad import fails `npm run lint` instead of waiting for review. Once
that exists, the mechanical parts of §1/§2 shrink to rationale here and the lint
config becomes their source of truth — update this section when that lands.