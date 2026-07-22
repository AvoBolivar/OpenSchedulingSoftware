# Task Intake

This file is the spec for `add.md`, the task-intake file. It serves two readers:
1. The AI **executing** an `add.md` — the rules here govern how that file is
   structured and processed.
2. The AI **drafting** an `add.md` — given a rough feature description, follow §4 to
   produce a filled task file matching the template in §2.

Core decision, stated once: **`add.md` has exactly two zones — a permanent procedure
above `---`, copied verbatim and never rewritten per task, and a single disposable
TASK below it, cleared and replaced rather than appended to. The plan gate (procedure
step 3) is mandatory: the executing AI always stops for an explicit "go" before
writing any code.**

If a situation isn't covered here, say so and ask — the answer gets added to this
file, not improvised.

## 1. Structural rules for add.md

- **Above the `---` is permanent, below is disposable.** The procedure section is
  task-agnostic and is never edited when writing a new task. Anything true only for
  the current task — "this module has no local CLAUDE.md yet, use the example
  instead," "this folder already owns all Payment UI" — belongs in the TASK's
  `Where` section, never in the procedure steps.
- **One task per run.** The TASK section holds exactly one task. It is cleared and
  replaced before the next run — never appended to.
- **Context loading is scoped, not total.** The procedure always reads the global
  file (`aiNotes/global.md`); topic files load by trigger:
  | File | Load when the task… |
  |---|---|
  | `aiNotes/directoryLogic.md` | creates, moves, or renames any file |
  | `aiNotes/errorHandling.md` | touches fallible code, IO, validation, or error UI |
  | `aiNotes/testing.md` | writes or changes any test (i.e. almost every feature task) |
  | `aiNotes/design.md` | changes anything the user can see |
  | `src/<module>/CLAUDE.md` | the task's `Where` targets that module and the file exists |
  A task's `Where` section states which topic files apply, so loading is a lookup.
  `humanNotes/aiNotes.md` is philosophy for humans — load only if the *why* behind a
  rule is needed, which it normally isn't.
- **The plan gate is mandatory.** After reading, the AI restates the task + plan in
  3–5 bullets and STOPS for an explicit "go." The plan must surface any judgment
  call the task left open (see §3) — the gate exists to catch exactly those.
- **Verification names only gates that exist.** Currently: `npx tsc -b` →
  `npm run lint` → `npm run test`. Do not reference a "structure check" or any other
  gate until it mechanically exists per `directoryLogic.md` §4; a named gate the AI
  cannot run produces false "could not verify" noise.

## 2. The canonical add.md template

```markdown
# add.md — task intake

## How to process this file (read this first, every time)
1. Read the global context file (`aiNotes/global.md`). Then load topic files per
   the triggers in `prompts/addContext.md` §1 — the TASK's `Where` section states
   which apply.
2. Identify the target module from the TASK. Read its local CLAUDE.md if one
   exists; otherwise rely on the Follow-this-example. Do not load unrelated
   modules.
3. Restate the task + your plan in 3–5 bullets, surfacing any judgment call the
   task leaves open, then STOP and wait for "go" before writing any code.
4. Implement, matching the shape of the referenced example.
5. Run verification until green: npx tsc -b → npm run lint → npm run test.
6. Report: files touched, what you added, any test you updated and why, anything
   you could NOT verify.

---

## TASK  (one task per run — clear this section before the next)

### What
<the change and WHY — intent + the user's actual motivation, not implementation>

### Where
<target files/folders, with the reason each is the right place per
directoryLogic.md; note which topic files apply and whether a local CLAUDE.md
exists>

### Follow this example
<path(s) to canonical code, PLUS a description of the shape being copied and
exactly where the new code should deviate from it>

### Acceptance criteria
<observable behavior: exact names/signatures for new store selectors, UI states
including empty states, the edge cases that must hold>

### Out of scope / don't touch
<files and behavior that must not change; preempted over-engineering ("no new
deps", "no Result types here — no new failure mode exists")>

### Verification
<test list derived from testing.md's priority order — including what NOT to
test and why; ends with the full gate>
```

## 3. Field-by-field quality rules

What separates a good task file from a vague one. The payment-history task in
[`add.md`](add.md) is the reference standard — match its density.

- **What** carries intent *and motivation* ("once marked received it disappears with
  no way to edit it again"). The motivation is what lets ambiguous calls be decided
  correctly without asking. Reference exact fields/values from the real code
  (`payment.paymentReceived === true`), not paraphrases.
- **Where** justifies each placement ("this folder already owns all Payment UI"),
  names the new file per `directoryLogic.md` §3 conventions, and pre-answers the
  CSS/co-location question. Task-specific module facts live here (per §1).
- **Follow this example** names the *shape*, not just the file: "join-and-guard-and-
  open-modal, filtered to X instead of Y, sorted by Z." Then states the deviations
  explicitly. **Consistency rule:** the example's shape must not contradict the
  acceptance criteria — if the criteria move a behavior (e.g. a guard from component
  to selector), the deviation must be stated here, or the AI is left with two valid
  readings. An unstated contradiction between these two sections is the single most
  common source of wrong implementations.
- **Acceptance criteria** are checkable: exact selector names and return shapes,
  the empty state's text pattern, and the edge cases — which double as the test
  plan. Include the "must fall out naturally" criteria that ban state-forking.
- **Out of scope** does two jobs: bounds blast radius (which folders are read-only
  for this task) and *preempts over-engineering* — name the specific tempting-but-
  wrong additions (new deps, unnecessary error handling, defensive checks for
  impossible states) so they're violations, not judgment calls.
- **Verification** is derived from `testing.md` §1's priority order, names the edge
  cases from Acceptance criteria as individual tests, states what is deliberately
  NOT tested (with the testing.md rule that exempts it), and ends with the full
  gate.
- **Citations must be accurate.** Every `per <file> §N` reference is checked against
  the actual file before the task ships. A wrong citation costs more than no
  citation — it teaches the reader to distrust all of them.

## 4. Drafting procedure — turning a rough description into an add.md

When asked to write a new task file from a feature description:

1. **Read first, write second.** Load `aiNotes/global.md`, the topic files the feature
   plausibly touches, and the actual source files involved (the store, the sibling
   components, the page). Field names, existing selector shapes, and taken
   `colorScheme`s come from the code, not from memory.
2. **Find the canonical example** — the existing file whose shape the new code
   should copy. If none fits, that's a finding to report, not a gap to silently
   fill: propose what the example *should* be.
3. **Extract the motivation.** If the rough description says only what to build,
   ask one question to get the why — it's load-bearing for every ambiguous call.
4. **Hunt the ambiguities.** Walk the draft looking for places where two readings
   are both defensible (where does the guard live? does the new list share the old
   component or copy it? is the total scoped or all-time?). Resolve each one
   explicitly in the relevant field — or, if it's genuinely the user's call, list
   it as an open question *above* the draft rather than burying a guess in it.
5. **Fill the template** from §2, applying §3's quality rules. Copy the procedure
   section verbatim — it is never redrafted per-task.
6. **Self-check before presenting:**
   - Follow-this-example and Acceptance criteria agree (no §3 contradiction)
   - every cited `§` reference verified against the real file
   - every named gate in Verification actually exists
   - nothing task-specific leaked above the `---`
   - each acceptance edge case appears in the Verification test list
7. **Present the draft + open questions.** The user resolves the questions and
   pastes the result into `add.md`. The drafting AI does not begin implementing —
   drafting and executing are separate runs.

## 5. Maintaining this file

- When a task run reveals a recurring ambiguity type, add it to §4 step 4's hunt
  list — that list is this system's memory of past near-misses.
- When a new mechanical gate lands (the ESLint boundaries/vitest rules per
  `directoryLogic.md` §4 / `testing.md` §5), update §1's gate list and the template's
  step 5 in the same change.
- If the loading table in §1 changes, the template's step 1 wording is checked
  against it — those two must never disagree.
- If `aiNotes/global.md` §2's map changes (a new topic file or module `CLAUDE.md`
  appears), this file's §1 loading table is checked against it in the same change —
  they describe the same system from two directions and must never disagree.

## 6. Verification status

Per [global.md](../aiNotes/global.md): enforced beats specified.

Enforced mechanically today: nothing. This is a process file for an AI reading
instructions, not code — no tooling can check whether the plan gate was honored,
whether the TASK section holds exactly one task, or whether a cited `§N` still matches
the real file it names.

Not yet enforced (caught only by re-reading this file, or by the human/AI-in-the-loop
"go" at the plan gate):
- the plan gate being skipped (nothing stops jumping straight to step 4)
- a second task appended below the first instead of replacing it
- a stale or wrong `§N` citation — §4 step 6's self-check is the only guard, and it's
  prose, not tooling
- the permanent procedure section being edited per-task instead of copied verbatim

Next step: none obvious for this file specifically — the plan gate itself *is* this
system's verification step. A human or reviewing AI approving the restated plan before
any code is written is the check; that's why §1 calls it mandatory rather than
optional.