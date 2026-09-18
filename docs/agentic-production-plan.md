# Agentic production — where we are and the plan

Working sequence for the factory loop. Rationale, contract sketches, and cited models stay in [`agentic-production-architecture.md`](./agentic-production-architecture.md). Repo snapshot stays in [`STATUS.md`](../STATUS.md).

**As of:** 2026-09-18  
**Proposal PR:** https://github.com/ad-dc/appdirect-design-system/pull/68 (merged)  
**Current phase:** Step 0–5 merged. Kit **0.2.7**. Next: publish the tarball + template, then collect fleet audits. Steps 6–8 stay gated.

---

## Where we are

The main repo already ships a design system, kit tarball (`@appdirect/ds-prototype-kit` **0.2.7**), and a thin prototype template (`ad-dc/appdirect-prototype-template`). Cursor consumption rules/skills copy into new prototypes. `prototype-manifest.json` now pins `versions` (`kit`, `tokensSnapshot`, `factory`, `mantine`); `create-page` leaves those pins alone.

This repo already merged the architecture (PR #68) and Step 0 (PR #69).

| Layer | State |
|---|---|
| Design system source | Shipping. Mix of Mantine wrappers and AppDirect complex components |
| Kit + template | Shipping. New clones pin the kit tarball; existing clones do not auto-update |
| Canonical correctness | **Decided:** DS component source. Not Figma, not `DESIGN.md`, not unused `types.ts` |
| V1 factory | Checker shipping (`ds-audit` + fleet rollup). Evidence depends on clones writing audits |
| Later factory | **Decided, gated:** authors/repairs pages against the same contracts |
| Step 0 (repair contradictions) | **0.1–0.8 done** (PR #69). |
| Step 1 (manifest versions) | **Done** (PR #70). Clones still pick it up on the next template publish. |
| Step 2 (tier-0 contracts) | **Done** (PR #71). |
| Step 3 (`ds-audit`) | **Done** (PR #72). |
| Step 4 (prototype CI + skill) | **Done** (PR #73). |
| Step 5 (fleet) | **Done** (PR #74). |
| Steps 6–8 (semantic reviewer, authoring factory) | Blocked on V1 evidence that the checker is used |

### Locked decisions

| Decision | Locked |
|---|---|
| V1 factory | Checker and reporter: contracts + `ds-audit` + fleet evidence |
| Later factory | Authors/repairs pages against those same contracts; audit becomes a gate |
| Package split | Kit-bundled in V1. Independent factory package only when authoring assets must move without a visual kit release |
| Canonical correctness | DS **component source** (Mantine wrappers **and** AppDirect complex components) |
| `PageContentHeader` | AppDirect complex component. No Mantine counterpart. Contract is anatomy / `contentSection` / composition, not `extends MantineX` |
| Spacing | One scale: Mantine Core `xs–xl` (10/12/16/20/32) plus added `none` (0), `xxs` (4), `xxl` (48). Lookups rewritten 2026-09-16 |
| CBP | Out of scope. Split-off prototype. Leftover `components/cbp/` archived to `components/local/` (`docs/archive/cbp.md`) |
| External products | Do not install Southleft `ds-contracts-poc`, Curtis Specs as SoT, or Pandya markdown+CSS-as-contract. Steal refuse-by-name + deterministic judge only |
| Metrics | Dimensional. No 69/100 composite score |

### Still true in the repo

- LAYOUT_GUIDE still says use Mantine Core for “form controls / complex interactions” (consumption rule forbids that).
- Vendored kit `--ad-spacing-*` still lacks `xxl`.
- Published GitHub template is stale until `npm run publish-prototype-template`.

---

## Plan

Step 5 (fleet rollup) is done. Next is publish kit **0.2.7** + the GitHub template, then collect fleet audits. The optional semantic reviewer (Step 6) waits on false positives. The authoring factory (Steps 7–8) stays gated.

**Stop-the-line:** if after V1 the checker is ignored (restricted imports and undeclared local components do not move), do not add generating agents.

### Step 0 — One source of truth (this repo)

Repair contradictions agents would otherwise enforce. No new packages.

1. **Layout primitive:** **Done.** `Inline` for new Figma/agent/prototype rows. `Group` remains the Mantine-named alias.
2. **Spacing lookup:** **Done.** Pixel→token tables match Mantine Core + `none` / `xxs` / `xxl` (`4px` → `xxs`). `DESIGN.md` YAML lists `none` and `xxl`. `theme.ts` resolves the extra keys.
3. **Shared enums:** **Done.** `Button` / `Badge` / `Alert` import unions from `types.ts`. Arrays match the wrappers (`disabled` on Button; Alert has `pending`, not `warning`).
4. **Figma registry:** **Done.** Button pass-through mapping (plus `disabled`). Badge/Alert match wrappers. Wrapper wins.
5. **Cursor rules split:** **Done.** Always-on = consumption only. Wrapper authoring glob excludes `ComplexComponents/`. Code Connect stays on `*.figma.tsx`.
6. **Lint honesty:** **Done.** `npm run lint` covers `app/`, `components/`, and `next.config.ts`. Fleet gate is `ds-audit` (template CI in Step 4).
7. **Docs drift:** **Done.** `CLAUDE.md` token-dependency text matches `package.json`. Keep `STATUS.md` current.
8. **Template leftover:** ~~rename `components/cbp/`~~ **Done.** Template slot is `components/local/`. Agent-facing copy does not mention CBP. Published GitHub template still has the old folder until `npm run publish-prototype-template`.

**Done when:** an agent implementing a Figma frame would map spacing and horizontal layout to the same tokens/primitives the runtime uses, and would not be told to `extends Mantine` a `PageContentHeader`.

### Step 1 — Manifest versions

Extend `prototype-manifest.json` (template + this repo) with `versions` filled from `package.json` / kit pin (`kit`, `tokensSnapshot`, `factory` = kit in V1). `create-page` does not hand-edit versions.

**Done (2026-09-17).** `npm run fill-manifest-versions` rewrites pins. `create-prototype` / `publish-prototype-template` fill `versions` and `template` when the kit URL is baked. `template.meta.json` has `templateVersion` and `minKit`. Published GitHub template still needs `npm run publish-prototype-template` for clones to pick this up.

**Done when:** a new prototype clone has readable system pins without opening `package.json`.

### Step 2 — Tier-0 contracts

Hand-write JSON next to source; copy into the kit on build.

- **Wrappers:** `Button`, `Badge`, `Alert`, layout primitives.
- **Complex:** `PageContentHeader`, `DataTable`.

Tests: wrapper enums ⊆ contract enums; `PageContentHeader` `contentSection` + required `title` match the TSX. No Mantine base type on complex components.

**Done (2026-09-18).** `*.contract.json` next to source; kit build copies them to `dist/contracts/`. `npm run test:scripts` fails if a Button/Badge/Alert enum is added without the contract.

**Done when:** changing a Button variant without updating the contract fails CI in this repo.

### Step 3 — `ds-audit` in the kit

Read-only CLI, same version as the kit. Writes `prototype-audit.json`.

Scan: versions, banned `@mantine/core` in prototype `app/` and local components, deprecated APIs, raw hex/px / `style=`, component usage counts, local component file list. No LLM. No network. Definition of Done is this command plus `tsc`.

**Done (2026-09-18).** `ds-package/bin/ds-audit.js` is the kit `ds-audit` bin. Template and this repo expose `npm run ds:audit`. Exit 1 only on restricted `@mantine/core` imports; composition heuristics (missing `PageContentHeader`, handmade record lists) are findings, not failures. `health.typecheck/lint/build` are `skipped` until Step 4. No network.

**Done when:** `npm run ds:audit` runs in the template against a fresh clone.

### Step 4 — Prototype CI + skill

Template GitHub Action: typecheck + audit. **Fail** on restricted imports. **Warn** on composition heuristics (`PageContentHeader` missing, handmade record lists). Skill: `audit-prototype` (and kit-bump, or fold into `prototype-workspace`).

**Done (2026-09-18).** `templates/designer-prototype/.github/workflows/ds-check.yml` runs typecheck + `ds-audit`. `ds-audit --ci` / `GITHUB_ACTIONS` emits `::error` for `@mantine/core` imports and `::warning` for missing headers / handmade lists. `audit-prototype` skill ships in the template and this repo; kit bump stays in `prototype-workspace`.

**Done when:** a raw Mantine `Button` import fails CI; a missing header only warns.

### Step 5 — Fleet rollup

Maintainer script + optional `fleet.json` of prototype clone URLs. Table: kit lag, top violation rules, local-pattern clusters (≥3 = gap candidate). No analytics platform. No prompts.

**Done (2026-09-18).** `npm run fleet-rollup` reads `fleet.json` (optional `--discover` via `gh`). Prints markdown answering “how current is the fleet?” and “which primitive throws the most exceptions?”. Clusters with n ≥ 3 repos are gap candidates. Does not write DESIGN.md.

**Done when:** a maintainer can answer “how current is the fleet?” and “which primitive throws the most exceptions?”

### Step 6 — Semantic reviewer (optional)

Only after Step 4 false positives are understood. Classifies `needs_semantic_review` as `{ drift | gap | legitimate_local }`. Cannot invent DS variants. Cannot mark a gap as an approved DS change.

### Step 7–8 — Production factory (gated)

Materialize Cursor assets from the kit, then generate/repair pages against contracts. Split to an independent factory package only if authoring cadence diverges from visual kit releases.

**Do not start** until Step 5 shows the checker is used, or clusters are classified as gaps rather than ignored.

---

## Explicitly not this plan

- Southleft generate-both-surfaces compiler
- Curtis Specs as the source of Button variants (later: Figma observation only)
- Pandya markdown specs + prototype `tokens.css`
- Independent `@appdirect/code-factory` package in V1
- Standing multi-agent `/goal` loops
- Composite quality scores
- CBP in audit, telemetry, or contracts
- Regenerating the DS itself from JSON

---

## Suggested next

Step **6** — optional semantic reviewer, only after Step 4 false positives are understood. Then Steps 7–8 (authoring factory) if Step 5 shows the checker is used.

Refresh `ad-dc/appdirect-prototype-template` after the **0.2.7** kit tarball is on GitHub Releases so clones pick up `ds-audit`, contracts, and prototype CI.
