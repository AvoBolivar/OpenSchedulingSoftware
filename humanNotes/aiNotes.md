# AI Codebase Notes

## Most important things about ai:
- They have a context window — Therefore the context provided needs to be somewhat dense and specific, but most importantly, relevant to the task. So it does not cause the ai to drift.
- More specific = more better. The ai is probabilistic, so specific isn't
  enough on its own, but specific reduces ambiguity.
- The ai is NOT deterministic. Any rule it just reads is a suggestion. A rule enforced by tooling is a constraint, therefore it needs a verification step

## How to solve for the constraints:

### Context / relevance
- The directory management system needs to be a system in itself that is well
  documented. Placement of functions, classes, components, etc. determined by
  logic rules. Enforce with tooling (see verification).
- Each subfolder should be seen almost as its own project.
- Outside imports expanding context, the fix is interfaces.
  A good import is understandable from its SIGNATURE alone (name, types,
  one-line docstring). Then an import costs 1 line of context, not a whole file.
  Clean typed contracts at the seams = what makes "each folder is its own
  project" actually work.
- Provide info the ai needs every time, in the global file, but minimize it, not for space, but because always-loaded noise causes drift.

### Specificity
- Global context file the ai reads every time.
- Local context files per module, providing:
  - architecture design
    - generic class structures
    - generic function structures
    - specific generic path needed to call certain apis and dbs
  - front end theme/design
  - naming conventions
  - error handling
  - testing
- Examples beat descriptions. One canonical reference implementation
  ("features look like features/auth/, copy that shape") teaches more reliably
  than abstract templates. Point at a REAL file.
- Discoverability: design HOW the ai finds + loads the right local file, not
  just the content. Conventional name + placement, referenced from the global
  file. If it's not findable, it silently won't get read and the effort is wasted.
- Bias every context file toward DURABLE + arbitrary-but-must-be-consistent
  facts (architecture decisions, naming, error policy, api paths). Let DERIVABLE
  facts (what functions exist, what the types are) be read from the code
  directly — where they can't go stale.

### Verification 
- Specificity tries to make the ai produce correct code.
- Verification catches it when specificity fails
- The determinism I want lives HERE, in tooling, not in ai compliance:
- types — type checker rejects wrong data shapes for free
  - tests — behavior stays true across regenerations
  - lint / formatter — naming + style enforced mechanically, not hoped-for
  - structure check — script / CI rule that fails if files land in wrong place
- Move as many "conventions" as possible from prose → enforced tooling.
  Prose only covers what can't be mechanized.

1. Relevance over volume, load the right context. Design
   for on-demand retrieval + clean interfaces so imports cost a signature, not
   a file.
2. Verifiable over specific — specificity reduces ambiguity, but because the
   model is probabilistic, correctness has to be CHECKABLE by tooling (types,
   tests, lint, ci), not just specified in prose.