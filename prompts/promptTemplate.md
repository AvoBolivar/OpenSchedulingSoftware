# add.md — task intake

## How to process this file (read this first, every time)
1. Read the global context file: <path/to/global.md>
2. From the TASK below, identify the target module. Read ONLY that module's
   local context file. Do not load unrelated modules.
3. Restate the task + your plan in 3–5 bullets, then STOP and wait for my "go"
   before writing any code. (plan gate — cheap insurance against wrong guesses)
4. Implement, matching the shape of the referenced example.
5. Run verification until green: types, tests, lint, structure check.
6. Report: files touched, what you added, anything you could NOT verify.

## Task format (fill in the fields that matter; skip the rest)

### What
<plain english: the change and WHY. intent, not implementation.>

### Where
<target module/folder — or "you decide, per placement rules">

### Follow this example
<path to a canonical file/folder to mimic, e.g. features/auth/>

### Acceptance criteria
<how we know it's correct: observable behavior + edge cases to handle>

### Out of scope / don't touch
<files or behavior that must NOT change — bounds the blast radius>

### Verification
<tests to add/pass, checks that must be green before you're done>

---

## TASK
<the actual current task goes here>