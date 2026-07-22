# Error Handling

This is the placement system for failures: every error belongs to exactly one layer,
and each layer has one strategy. When writing fallible code, find the layer, follow
its rule. Do not invent a new error pattern — if a failure doesn't fit any layer,
say so and ask; the answer gets added to this file.

Core decision, stated once: **this codebase uses Result types, not thrown exceptions,
for its own fallible functions.** Fallibility must be visible in the signature so the
compiler forces call sites to handle it. `try/catch` exists only at the boundary
around code we don't own (see §3). Never throw from our own `lib/`, store, or hook
code.

## 0. The Result type

Lives at `lib/result.ts`. This is the only error-shape primitive in the codebase.

```ts
// lib/result.ts
export type Result<T, E = AppError> =
  | { ok: true; value: T }
  | { ok: false; error: E };

export const ok = <T>(value: T): Result<T, never> => ({ ok: true, value });
export const err = <E>(error: E): Result<never, E> => ({ ok: false, error });

// The shared error shape. `kind` is for code to branch on;
// `message` is for humans and must be safe to show in the UI.
export interface AppError {
  kind: AppErrorKind;
  message: string;
  cause?: unknown; // original thrown value, for console logging only — never shown to user
}

export type AppErrorKind =
  | "validation"   // data failed a check at a trust boundary (§5)
  | "not_found"    // an entity ID that doesn't resolve
  | "conflict"     // operation invalid given current state (e.g. delete blocked by references)
  | "storage"      // localStorage / persistence failure
  | "parse"        // malformed JSON or file content
  | "unknown";     // caught something unexpected at a try/catch boundary
```

**Rules:**
- Add new `AppErrorKind` values here, in this file and in `result.ts` together —
  never inline a one-off error shape in a feature.
- `message` is written for the user (plain English, no stack traces, no JSON).
- `cause` carries the original error for `console.error`; it never reaches the UI.

## 1. Fallible function signatures

A function that can fail returns `Result<T>`. A function that returns a bare `T`
is promising it cannot fail — the signature is the contract.

```ts
// yes
export function parseImportFile(raw: string): Result<ImportData> { ... }

// no — fallibility hidden from the signature
export function parseImportFile(raw: string): ImportData { /* throws */ }
```

**Which functions must return Result:**
- anything in `lib/` that parses, validates, or does IO
- store actions that can refuse (`deleteClient` when appointments still reference
  the client → `err({ kind: "conflict", ... })`)
- `get<Entity>`-style lookups by ID → `Result<Entity>` with `not_found`, never
  `Entity | undefined`

**Which functions stay bare:**
- pure computation that cannot fail (formatting, totals, sorting)
- store selectors that derive from state already known to be valid
- components — components never return Result; they *consume* one and render an
  outcome (§6)

Async: fallible async functions return `Promise<Result<T>>` and **never reject**.
There is currently no server IO; this rule exists so the first API call doesn't
improvise. If TanStack Query or similar is adopted later, its error state supersedes
this rule for query/mutation code — update this file when that happens.

## 2. Call sites

The compiler forces a branch on `.ok`; the rule is what each branch does:

```ts
const result = parseImportFile(raw);
if (!result.ok) {
  console.error(result.error.cause ?? result.error);
  notify(result.error);            // §6 — surface it
  return;                          // stop; never continue with a placeholder value
}
const data = result.value;
```

- Never swallow: an `err` is either surfaced to the user (§6) or explicitly
  converted to a benign outcome with a comment saying why silence is correct.
- Never fabricate: no `?? defaultValue` to paper over an `err`.
- Don't re-wrap: pass a received `err` upward as-is; only add context if the `kind`
  genuinely changes.

## 3. try/catch — boundary only

`try/catch` appears **only** immediately around code we don't own that throws:
`JSON.parse`, `localStorage`, file readers, future `fetch`. The catch converts to a
Result and the exception never escapes:

```ts
export function readStorage(key: string): Result<string> {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return err({ kind: "not_found", message: "No saved data found." });
    return ok(raw);
  } catch (e) {
    return err({ kind: "storage", message: "Couldn't access saved data.", cause: e });
  }
}
```

A `try/catch` anywhere other than a thin wrapper like this is a rule violation —
flag it as a cleanup candidate.

## 4. Render errors — Error Boundaries

Boundaries catch *bugs* (a component throwing during render), not expected failures.
Expected failures are Results and never reach a boundary.

- One app-level boundary wrapping the shell in `App.tsx`.
- One boundary per nav-tab page, wrapped in `home.tsx` around the active page, so a
  crash in one tab doesn't take down the others.
- Implementation: `react-error-boundary` package; the fallback is a `basic/` component
  (`basic/errorFallback/errorFallback.tsx`) showing a plain "Something went wrong
  here." message and a reset button. Fallback never shows the error object.
- Do not add boundaries deeper than page level unless a specific subtree has a known
  crash risk — ask first.

Boundaries do not catch async errors or event-handler errors; those are covered by
§1's no-reject rule and §2's call-site rule.

## 5. Validation — trust boundaries only

Validate where data *enters* the system; trust data already inside stores.

Current trust boundaries:
- **Import** (`settings/importExportData.tsx` path): imported JSON must be validated
  before any store `set` runs. Validation failure → `err({ kind: "validation" | "parse", ... })`,
  and **no partial writes** — an import either fully applies or fully doesn't.
- **User input forms**: `create`/`update` components check their own required/shape
  rules before calling the store action; store actions may still return `conflict`
  for state-level rules (referential checks live in the store, not the form).

No schema library yet — validation is hand-written checks returning `Result`. If
imported-data shapes grow past a couple of entities, adopt Zod for the import path
(schema = single source for TS type + runtime check) and update this section.

Inside-the-app data (already in stores) is not re-validated on read. If invalid state
is ever observed internally, that's a bug to fix at the boundary that let it in, not
a place to add defensive checks.

## 6. Surfacing errors to the user

Every error class maps to exactly one surface:

| Error situation | Surface |
|---|---|
| Form field invalid (`validation` from a form) | inline message next to the field, shown on submit attempt |
| Operation failed (`conflict`, `storage`, `parse`, `not_found` from an action) | toast via `notify()` |
| Render crash | boundary fallback (§4) |
| Truly silent-by-design outcome | explicit comment at the call site justifying it |

- `notify(error: AppError)` is the single entry point for toasts: a small store
  (`stores/useNotificationStore.ts`) plus a `basic/toast/` component rendered once in
  the shell. Features never render their own ad-hoc error banners.
- Toast text is `error.message` verbatim — which is why §0 requires `message` to be
  user-safe.
- Never `alert()`; never show `kind`, `cause`, or stack traces.

## 7. Last resort

`window.onerror` and `window.onunhandledrejection` are registered once in `main.tsx`
and only `console.error`. They exist to make escaped errors *visible during
development*, not as a handling mechanism — if one fires, something violated §1–§4
and that's the bug to fix. No external logging service; personal app.

## 8. Verification status

Per [aiNotes.md](../humanNotes/aiNotes.md): enforced beats specified.

Enforced mechanically today:
- **The core rule enforces itself.** Once a function returns `Result<T>`, `npx tsc -b`
  forces every call site to branch before touching `value` — unhandled failure is a
  compile error, not a convention. This is why Result was chosen over exceptions.

Not yet enforced (caught only by re-reading this file):
- a rogue `throw` or non-boundary `try/catch` in our own code
- a swallowed `err` (branch exists but does nothing)
- `alert()` or ad-hoc error UI outside `notify()`

Next step: ESLint rules — `no-throw-literal` plus a `no-restricted-syntax` rule
banning `throw` and `try` outside `lib/` boundary wrappers, and `no-alert`. When that
lands, move those bullets up to "enforced" and shrink the prose to rationale.

## Canonical examples

None exist yet — this file predates the code. The **first** implementations of each
of these become the canonical examples and must be linked here when written:
- first `lib/` boundary wrapper (likely `readStorage` / the import parser)
- first store action returning `conflict`
- first form doing inline validation
- `basic/errorFallback/` and `basic/toast/`

Linking them is part of the task that creates them, not a cleanup for later.