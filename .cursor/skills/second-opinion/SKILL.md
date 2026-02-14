---
name: second-opinion
description: Get a fresh perspective when stuck after many refactors or when the primary approach isn't working. Use when the user says "second opinion", "fresh take", "we're stuck", "try another way", or when multiple refactor attempts (e.g. 3+) have failed and the thing still doesn't work.
---

# Second Opinion

## When to Use

- User explicitly asks for a second opinion or fresh take.
- Several refactor/attempt cycles have happened and the issue persists.
- Same fix pattern has been tried repeatedly without success.
- User or agent senses "we're going in circles."

## Two Options

### Option A: Handoff for a new chat (recommended when deeply stuck)

Produce a **Second Opinion Request** the user can paste into a **new Cursor chat** (or another AI) for a clean-slate perspective. No shared history = no refactor tunnel vision.

**Steps:**

1. **Create a single markdown file** (e.g. `_AutoDad/.second-opinion-request.md` or `_notes/second-opinion-YYYY-MM-DD.md`) containing:

```markdown
# Second opinion request

## Goal
[One sentence: what should work or what we're trying to achieve]

## What’s wrong
[Observed behavior: error message, wrong output, or "still broken after many edits"]

## What we tried (brief)
- Attempt 1: [one line]
- Attempt 2: [one line]
- … (no need to list every refactor; 3–5 is enough)

## Current state
- **Key file(s):** [paths]
- **Relevant snippet or error:** [paste minimal code or full error text]
- **How to run/repro:** [command or steps]

## One clear question for the second opinion
[E.g. "Is this approach wrong and we should do X instead?" or "Why would this code still do Y?"]
```

2. **Tell the user:** "I've written a second-opinion request to `[path]`. Open a **new chat**, paste the contents (or reference the file), and ask for a fresh take. No prior refactor history—often that’s enough to unstick things."

3. **Optional:** Add the request file to `.gitignore` if it contains project-specific details you don’t want committed.

### Option B: In-chat second-opinion mode (same conversation)

When the user wants a fresh take in **this** chat without opening a new one:

1. **Stop proposing further refactors** for the moment.
2. **Restate the problem from first principles:**
   - Goal in one sentence.
   - Observed vs expected behavior.
   - Exact error or wrong output (quote it).
3. **List assumptions to question:**
   - E.g. "We’ve been assuming the bug is in X; it might be in Y or in the environment."
4. **Propose one minimal verification step** before any more code changes:
   - Run a single command and report output.
   - Add one `print()` or log and run once.
   - Run one existing test and show the failure.
5. **After the result:** Interpret together; only then suggest the next change (single, small step).

## Rules

- **Do not** keep refactoring in the same direction once second-opinion is invoked. Pause and either hand off (Option A) or reset in-chat (Option B).
- **Do not** pack the handoff doc with every edit ever made. Summarize attempts and current state; keep it scannable.
- **Do** include a single, concrete question so the second opinion has a clear task.

## Quick triggers

User phrases that should trigger this skill:

- "Second opinion"
- "Fresh pair of eyes" / "fresh take"
- "We're stuck" / "still not working"
- "Try another way" / "different approach"
- "Open a new chat and…" (in the sense of getting a clean-slate opinion)

Agent self-trigger: After ~3+ substantial refactor attempts and the problem persists, suggest: "We’ve tried several refactors and it’s still not working. Do you want a second opinion? I can either (A) draft a handoff for a new chat or (B) restate the problem here and suggest one minimal check before we change more code."
