# Agentic production — where we are and the plan

Working sequence for the factory loop. Rationale, contract sketches, and cited models stay in [`agentic-production-architecture.md`](./agentic-production-architecture.md). Repo snapshot stays in [`STATUS.md`](../STATUS.md).

**As of:** 2026-09-17  
**Proposal PR:** https://github.com/ad-dc/appdirect-design-system/pull/68 (merged)  
**Current phase:** Step 0.1–0.4, 0.7, 0.8 merged. 0.5–0.6 in flight. Contracts, `ds-audit`, agents, and telemetry are not started.

---

## Where we are

The main repo already ships a design system, kit tarball (`@appdirect/ds-prototype-kit` **0.2.6**), and a thin prototype template (`ad-dc/appdirect-prototype-template`). Cursor consumption rules/skills copy into new prototypes. `prototype-manifest.json` lists pages only (no system versions). Main-repo `lint` barely covers DS/prototype code.

This repo already merged the architecture plus Steps 0.1–0.4, 0.7, and 0.8 (PR #68). Remaining Step 0: Cursor rules split and lint honesty.

| Layer | State |
|---|---|
| Design system source | Shipping. Mix of Mantine wrappers and AppDirect complex components |
| Kit + template | Shipping. New clones pin the kit tarball; existing clones do not auto-update |
| Canonical correctness | **Decided:** DS component source. Not Figma, not `DESIGN.md`, not unused `types.ts` |
| V1 factory | **Decided, not built:** checker and reporter |
| Later factory | **Decided, gated:** authors/repairs pages against the same contracts |
| Step 0 (repair contradictions) | **0.1–0.8 done** after this change (0.5–0.6). Contracts still unstarted |
| Steps 1–5 (manifest, contracts, audit, CI, fleet) | Blocked on Step 0 |
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

Do not start contracts or `ds-audit` until Step 0 items that would be **encoded as truth** are resolved. Each step is useful alone.

**Stop-the-line:** if after V1 the checker is ignored (restricted imports and undeclared local components do not move), do not add generating agents.

### Step 0 — One source of truth (this repo)

Repair contradictions agents would otherwise enforce. No new packages.

1. **Layout primitive:** **Done.** `Inline` for new Figma/agent/prototype rows. `Group` remains the Mantine-named alias.
2. **Spacing lookup:** **Done.** Pixel→token tables match Mantine Core + `none` / `xxs` / `xxl` (`4px` → `xxs`). `DESIGN.md` YAML lists `none` and `xxl`. `theme.ts` resolves the extra keys.
3. **Shared enums:** **Done.** `Button` / `Badge` / `Alert` import unions from `types.ts`. Arrays match the wrappers (`disabled` on Button; Alert has `pending`, not `warning`).
4. **Figma registry:** **Done.** Button pass-through mapping (plus `disabled`). Badge/Alert match wrappers. Wrapper wins.
5. **Cursor rules split:** **Done.** Always-on = consumption only. Wrapper authoring glob excludes `ComplexComponents/`. Code Connect stays on `*.figma.tsx`.
6. **Lint honesty:** **Done.** `npm run lint` covers `app/`, `components/`, and `next.config.ts`. Fleet prototypes still wait on `ds-audit` (Step 3).
7. **Docs drift:** **Done.** `CLAUDE.md` token-dependency text matches `package.json`. Keep `STATUS.md` current.
8. **Template leftover:** ~~rename `components/cbp/`~~ **Done.** Template slot is `components/local/`. Agent-facing copy does not mention CBP. Published GitHub template still has the old folder until `npm run publish-prototype-template`.

**Done when:** an agent implementing a Figma frame would map spacing and horizontal layout to the same tokens/primitives the runtime uses, and would not be told to `extends Mantine` a `PageContentHeader`.

### Step 1 — Manifest versions

Extend `prototype-manifest.json` (template + this repo) with `versions` filled from `package.json` / kit pin (`kit`, `tokensSnapshot`, `factory` = kit in V1). `create-page` does not hand-edit versions.

**Done when:** a new prototype clone has readable system pins without opening `package.json`.

### Step 2 — Tier-0 contracts

Hand-write JSON next to source; copy into the kit on build.

- **Wrappers:** `Button`, `Badge`, `Alert`, layout primitives.
- **Complex:** `PageContentHeader`, `DataTable`.

Tests: wrapper enums ⊆ contract enums; `PageContentHeader` `contentSection` + required `title` match the TSX. No Mantine base type on complex components.

**Done when:** changing a Button variant without updating the contract fails CI in this repo.

### Step 3 — `ds-audit` in the kit

Read-only CLI, same version as the kit. Writes `prototype-audit.json`.

Scan: versions, banned `@mantine/core` in prototype `app/` and local components, deprecated APIs, raw hex/px / `style=`, component usage counts, local component file list. No LLM. No network. Definition of Done is this command plus `tsc`.

**Done when:** `npm run ds:audit` runs in the template against a fresh clone.

### Step 4 — Prototype CI + skill

Template GitHub Action: typecheck + audit. **Fail** on restricted imports. **Warn** on composition heuristics (`PageContentHeader` missing, handmade record lists). Skill: `audit-prototype` (and kit-bump, or fold into `prototype-workspace`).

**Done when:** a raw Mantine `Button` import fails CI; a missing header only warns.

### Step 5 — Fleet rollup

Maintainer script + optional `fleet.json` of prototype clone URLs. Table: kit lag, top violation rules, local-pattern clusters (≥3 = gap candidate). No analytics platform. No prompts.

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

Step **1** — manifest versions on `prototype-manifest.json`. Then tier-0 contracts (Step 2).

Refresh `ad-dc/appdirect-prototype-template` when a maintainer wants clones to pick up `components/local/` and the corrected spacing lookup.
