# Testing

This is the placement system for tests: what gets tested, at what level, where the
file lives, and when a test may be changed or deleted. Writing a test is a lookup,
not a judgment call. If a thing you're testing doesn't fit any rule here, say so and
ask — the answer gets added to this file.

Core decision, stated once: **tests exist to make AI-generated changes safe, not to
hit a coverage number.** A test earns its place by pinning behavior that would be
expensive to notice breaking. Tests are ranked by value: store logic and `lib/`
first, component behavior second, rendering detail never.

## 0. Stack and layout

- **Runner:** Vitest (native to the Vite setup — same config, same TS handling).
- **Component testing:** React Testing Library (`@testing-library/react` +
  `@testing-library/user-event`), environment `jsdom`.
- **No E2E layer.** Personal app, no auth, no server — Playwright is not worth its
  maintenance cost here. If a multi-step flow ever breaks twice in a way unit tests
  missed, revisit this line.
- **Placement:** co-located. The test sits next to the file it tests, same basename:
  `useClientStore.ts` → `useClientStore.test.ts`;
  `clientCard.tsx` → `clientCard.test.tsx`.
  One test file per source file, covering only that file's exports. No `__tests__/`
  folders, no central `tests/` directory.
- **Shared test helpers:** `src/testUtils/` (builders, store-reset helper, custom
  render). This is the only exception to co-location. `testUtils/` may import from
  anywhere; nothing outside a `.test.*` file may import from `testUtils/`.
- **Gotcha — Node's built-in `localStorage`:** Node 22+ ships an experimental global
  `localStorage` that, unconfigured, is a non-functional stub (throws
  `storage.setItem is not a function`) and shadows jsdom's real in-memory
  implementation that `zustand/persist` and `resetStores()` need. Both `npm run test`
  and `npm run test:watch` therefore run with
  `NODE_OPTIONS=--no-experimental-webstorage` (see `package.json`). If a test ever
  fails with a `localStorage`/`storage.setItem` error, this flag is the first thing to
  check — don't add a `localStorage` mock to work around it.

## 1. What gets tested (priority order)

1. **Store actions and selectors** — this is where the app's real logic lives, and
   it's plain functions: cheap to test, high value. Every CRUD action with any rule
   beyond "assign the value" gets tests. Every derived selector (`getTotalOwed`,
   `getPaymentsToPayout`) gets tests — these are the numbers the user trusts.
2. **`lib/` functions** — everything fallible (returns `Result`) gets both branches
   tested: the `ok` path and each meaningful `err.kind`. Pure helpers get tested when
   they have edge cases (date math, rollovers, formatting with odd inputs), skipped
   when they're one-liners.
3. **Components with behavior** — forms (validation → inline error → successful
   submit calls the store action), cards/lists with conditional logic, anything
   consuming a `Result` and branching on it.
4. **Components without behavior** — purely presentational output. **Not tested.**
   No snapshot tests, ever: they pin markup, not behavior, and fail on every
   harmless change — pure maintenance cost.

**What is never tested:** the store library itself (Zustand persisting is Zustand's
job), CSS/visual appearance, exact markup structure, third-party components.

## 2. Writing tests

**Name = behavior sentence.** `it("returns conflict when deleting a client with
appointments")`, never `it("works")` or `it("deleteClient test 2")`. The test name
is documentation; a failing name should tell you what broke without opening the file.

**Structure:** arrange–act–assert, one behavior per `it`. Multiple asserts are fine
when they describe one outcome; two behaviors means two `it`s.

**Stores** are tested through their actions, not by poking state:

```ts
// useClientStore.test.ts
beforeEach(() => resetStores()); // testUtils helper — restores initial state

it("returns conflict when deleting a client with appointments", () => {
  const client = buildClient();
  useClientStore.getState().createClient(client);
  useAppointmentStore.getState().createAppointment(buildAppointment({ clientId: client.id }));

  const result = useClientStore.getState().deleteClient(client.id);

  expect(result).toEqual(err({ kind: "conflict", message: expect.any(String) }));
  expect(useClientStore.getState().clients).toHaveLength(1); // nothing was deleted
});
```

- `resetStores()` runs in `beforeEach` for every store test — Zustand state leaks
  across tests otherwise. `persist` is pointed at in-memory storage in test setup so
  tests never touch real localStorage.
- Assert on `Result` values per [errorHandling.md](errorHandling.md): check `kind`,
  never match on `message` text (messages are for humans and may be reworded freely).

**Components** are tested the way the user interacts, via Testing Library:

```tsx
it("shows an inline error when name is empty on submit", async () => {
  render(<CreateClient />);
  await userEvent.click(screen.getByRole("button", { name: /save/i }));
  expect(screen.getByText(/name is required/i)).toBeInTheDocument();
  expect(useClientStore.getState().clients).toHaveLength(0); // action never ran
});
```

- Query by role/label/text (what the user perceives), never by CSS class or test-id
  unless there is genuinely no accessible handle — and a missing accessible handle is
  usually a component bug worth fixing instead.
- Components read real stores (reset per test), not mocks. Mocking is reserved for
  true boundaries: `lib/` storage wrappers, future `fetch`. Never mock one store to
  test another.

**Builders, not fixtures.** Test data comes from `testUtils/builders.ts` functions
(`buildClient(overrides?)`) returning a valid entity with sensible defaults, where
each test overrides only the field it cares about. No shared JSON fixture blobs —
they make every test silently depend on every field.

**Edge cases come from the task.** The `Verification` field in `add.md` names the
edge cases the feature must handle (month rollover, the no-cap case, empty import);
each named case becomes an `it`. That field is the test plan.

## 3. Running

- `npm run test` → `vitest run` (single pass, what CI/verification uses)
- `npm run test:watch` → `vitest` (watch mode, for development)
- The **full verification gate**, in order: `npx tsc -b` → `npm run lint` →
  `npm run test`. All three green before any task is reported done — this is step 5
  of the `add.md` procedure. Never skip, filter, or `.only` a test to get to green;
  a stray `.only`/`.skip` left in a file is itself a rule violation.
- No coverage threshold. Coverage may be *looked at* (`vitest run --coverage`) to
  find untested store logic, but a percentage is never a gate — see the core
  decision in the header.

## 4. Maintaining

The rules for touching existing tests — this is where test suites rot, so these are
strict:

- **A failing test is a stop, not an obstacle.** When a change breaks a test, decide
  which is wrong:
  - the *code* → fix the code; the test did its job.
  - the *test*, because the task **explicitly changed** that behavior → update the
    test in the same task, and say so in the report ("updated X because the cap now
    rolls over on Monday, per task").
  - Never weaken an assertion, broaden a matcher, or delete a test just to get green.
    If a test seems wrong and the task didn't change its behavior, stop and ask.
- **Tests change in the same task as the code they cover.** A behavior change with
  its test update deferred to "later" is an incomplete task.
- **Renames/moves:** the test file moves with its source file (co-location is a
  rule, not a default). `directoryLogic.md` placement rules apply to the pair.
- **Deleting code deletes its test file** in the same task. Orphaned tests that
  import nothing real are cleanup candidates — flag them.
- **Flaky tests are bugs.** A test that passes on retry gets fixed or rewritten, not
  retried until green. Common cause here: missing `resetStores()` or shared state
  between tests.
- **Don't test the same behavior twice.** If a store test already pins the conflict
  rule, the component test only checks that the error *surfaces* (toast/inline),
  not the rule itself.

## 5. Verification status

Per [aiNotes.md](../humanNotes/aiNotes.md): enforced beats specified.

Enforced mechanically today:
- the tests themselves — behavior pinned in a test cannot silently regress while
  `npm run test` is part of the gate
- type-checking of tests — `.test.ts(x)` files go through the same `tsc`/Vitest TS
  pipeline, so builders and store calls can't drift from real signatures

Not yet enforced (caught only by re-reading this file):
- a source file with logic but no test file (no structural check)
- `.only`/`.skip` left behind (`eslint-plugin-vitest` has `no-focused-tests` /
  `no-disabled-tests` — add these when the ESLint setup from
  [directoryLogic.md](directoryLogic.md) §4 lands)
- queries by test-id/class instead of role (`eslint-plugin-testing-library` — same
  ESLint pass)

## Canonical examples

- First store test with `resetStores()` + builders:
  [`stores/useClientStore.test.ts`](../src/stores/useClientStore.test.ts)
- `testUtils/` itself: [`testUtils/resetStores.ts`](../src/testUtils/resetStores.ts),
  [`testUtils/builders.ts`](../src/testUtils/builders.ts),
  [`testUtils/render.ts`](../src/testUtils/render.ts) (the "custom render" seam —
  currently a thin pass-through since no providers wrap the tree yet; add wrapping here,
  not in individual tests, once one exists — e.g. the error boundary in
  [errorHandling.md](errorHandling.md) §4), and
  [`testUtils/setup.ts`](../src/testUtils/setup.ts) (RTL `cleanup()` +
  `localStorage.clear()` per test).
- First component test (list with an empty state + click-to-open-modal interaction, seeding
  cross-store state via `setState` rather than through the UI):
  [`collectionsList/readPaymentHistory.test.tsx`](../src/components/collectionsList/readPaymentHistory.test.tsx)

Still none yet — first implementations become canonical and must be linked here when written:
- first `lib/` Result test covering `ok` + each `err.kind` (likely the import parser)
- first component *form* test, i.e. validation → inline error → successful submit calling the
  store action (likely `createClient.test.tsx`)

Linking them is part of the task that creates them, not a cleanup for later.