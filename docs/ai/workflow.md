# AI Collaboration Workflow

## Goal

Use AI agents to ship features faster while keeping regressions low and review quality high.

## Default Flow

1. Create a small feature branch from `main`.
2. Write a short feature brief:
   - problem statement
   - acceptance criteria
   - constraints/non-goals
   - files likely affected
3. Ask the agent for a plan and risks first.
4. Ask the agent to implement only the agreed scope.
5. Run local checks before opening a PR:
   - `pnpm test`
   - `pnpm build`
6. Open a PR with the checklist and validation evidence.

## Branching Rules

- One feature/fix per branch.
- Keep PRs small enough to review in one sitting.
- Avoid mixing refactors with feature changes.

## Prompt Template

```txt
Goal:
Context:
Constraints:
Acceptance criteria:
Files likely involved:

Please:
1) Inspect and propose a plan + risks first.
2) Implement only the agreed scope.
3) Add/update tests for changed behavior.
4) Run checks and report results.
5) Summarize changed files and remaining risks.
```

## Review Standard

- Does behavior match acceptance criteria?
- Are edge cases covered?
- Are tests/checks meaningful?
- Is the diff minimal and focused?
