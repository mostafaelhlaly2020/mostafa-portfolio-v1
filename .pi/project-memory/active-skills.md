# Active Skills — mostafa-portfolio-v1

> Auto-maintained by Subagent Operating Policy.
> **Precedence:** project-local > task-specific > global. Collisions resolved by priority, not flagged as errors.

## Global skills (fallback — used only when no project-local equivalent exists)

| Skill | Source | When to apply |
|-------|--------|---------------|
| clean-code-guard | `~/.pi/agent/skills/clean-code-guard/` | Code review, PR audit, production-readiness |
| code-refactorer | `~/.pi/agent/skills/code-refactorer/` | Structural refactoring, SOLID cleanup — high priority for refactors |
| docs-guard | `~/.pi/agent/skills/docs-guard/` | Doc review, changelog, API docs, docstrings |
| osta-architect | `~/.pi/agent/skills/osta-architect/` | Architecture planning, new projects, milestones |
| osta-builder | `~/.pi/agent/skills/osta-builder/` | Implementation from approved plan |
| osta-medic | `~/.pi/agent/skills/osta-medic/` | Debugging crashes, errors, regressions |
| osta-surgeon | `~/.pi/agent/skills/osta-surgeon/` | Precise bug fixes, minimal-blast-radius edits |
| test-guard | `~/.pi/agent/skills/test-guard/` | Test review, test generation |
| ui-ux-pro-max | `~/.pi/agent/skills/ui-ux-pro-max/` | UI/UX design, style palettes, typography |

## Project-local skills discovered

| Skill | Source | Files | When to apply |
|-------|--------|-------|---------------|
| clean-code-guard | `.agents/skills/clean-code-guard/` | SKILL.md + agents/ + 7 references | Code review |
| docs-guard | `.agents/skills/docs-guard/` | SKILL.md + agents/ + 5 references | Doc review |
| code-refactorer | `.agents/skills/code-refactorer/` | SKILL.md | Refactoring |
| osta-architect | `.agents/skills/osta-architect/` | SKILL.md + assets/ + 3 references + scripts/ | Architecture |
| osta-builder | `.agents/skills/osta-builder/` | SKILL.md + assets/ + 3 references + scripts/ | Implementation |
| osta-medic | `.agents/skills/osta-medic/` | SKILL.md + 1 reference + scripts/ | Debugging |
| osta-surgeon | `.agents/skills/osta-surgeon/` | SKILL.md + assets/ + 3 references + scripts/ | Bug fixes |
| test-guard | `.agents/skills/test-guard/` | SKILL.md + agents/ + 4 references | Test review |
| ui-ux-pro-max | `.agents/skills/ui-ux-pro-max/` | SKILL.md + 3 scripts + 26 data CSVs | UI/UX design |
| vercel-react-best-practices | `.agents/skills/vercel-react-best-practices/` | SKILL.md + AGENTS.md + 57 rule files | React/Next.js performance |

## Duplicate skills across harness directories
The same skills also exist under:
- `.claude/skills/` — identical copies for Claude Code compatibility
- `.opencode/skills/` — identical copies for OpenCode CLI compatibility

## Helper scripts & references
*(to be documented per skill as they are used)*
