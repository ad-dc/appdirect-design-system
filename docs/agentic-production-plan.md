# Agentic production — where we are and the plan

Working sequence for the factory loop. Rationale, contract sketches, and cited models stay in [`agentic-production-architecture.md`](./agentic-production-architecture.md). Repo snapshot stays in [`STATUS.md`](../STATUS.md).

**As of:** 2026-09-16  
**Proposal PR:** https://github.com/ad-dc/appdirect-design-system/pull/68 (draft)  
**Current phase:** recommendation complete. Step 0.8 (archive leftover CBP slot) landed. Contracts, `ds-audit`, agents, and telemetry are not started.

---

## Where we are

The main repo already ships a design system, kit tarball (`@appdirect/ds-prototype-kit` **0.2.6**), and a thin prototype template (`ad-dc/appdirect-prototype-template`). Cursor consumption rules/skills copy into new prototypes. `prototype-manifest.json` lists pages only (no system versions). Main-repo `lint` barely covers DS/prototype code.

This PR started as **docs only**. Step 0.8 now also changes the thin template: leftover `components/cbp/` → `components/local/`. It does not change the kit, template CI, or the published GitHub template until a maintainer runs `npm run publish-prototype-template`.

| Layer | State |
|---|---|
| Design system source | Shipping. Mix of Mantine wrappers and AppDirect complex components |
| Kit + template | Shipping. New clones pin the kit tarball; existing clones do not auto-update |
| Canonical correctness | **Decided:** DS component source. Not Figma, not `DESIGN.md`, not unused `types.ts` |
| V1 factory | **Decided, not built:** checker and reporter |
| Later factory | **Decided, gated:** authors/repairs pages against the same contracts |
| Step 0 (repair contradictions) | **0.8 done.** 0.1–0.7 not started. Required before contracts, or remaining contradictions freeze as truth |
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
| Spacing | One scale: Mantine Core `xs–xl` (10/12/16/20/32) plus added `none` (0), `xxs` (4), `xxl` (48). The 4px-grid table in mapping docs is a stale **lookup**, not a second scale |
| CBP | Out of scope. Split-off prototype. Leftover `components/cbp/` archived to `components/local/` (`docs/archive/cbp.md`) |
| External products | Do not install Southleft `ds-contracts-poc`, Curtis Specs as SoT, or Pandya markdown+CSS-as-contract. Steal refuse-by-name + deterministic judge only |
| Metrics | Dimensional. No 69/100 composite score |

### Still true in the repo (will freeze into contracts if Step 0 is skipped)

- Horizontal layout: `figma-layout-mapping.mdc` / `LAYOUT_GUIDE.md` say use `Inline`, never `Group`. `Inline.tsx` says it is a legacy alias and to prefer `Group` for new code. **This is the one product pick still open.**
- Spacing lookup: both `figma-layout-mapping.mdc` copies, `LAYOUT_GUIDE.md`, and `config.ts` still map `4px` → `xs`. Runtime token for 4px is `xxs`.
- `types.ts` claims single source of truth and is almost unused; Button `disabled` variant disagrees with the wrapper.
- `FIGMA_PROPS_REGISTRY.md` Button mapping disagrees with `Button.tsx`. Wrapper wins.
- Alert: `DESIGN.md` `warning` vs wrapper `pending`.
- `CLAUDE.md` still says `@appdirect/design-tokens` is not a dependency; `package.json` / `app/layout.tsx` import it.
- Always-on `design-system.mdc` mixes consumption, wrapper authoring, and Code Connect.

### One decision still needed

**Layout primitive for new horizontal rows:** `Inline` (what Figma mapping and agent rules already teach) or `Group` (what `Inline.tsx` now recommends, matching Mantine). Until that is picked, Step 0.1 cannot land, and a layout contract cannot be written.

Everything else in Step 0 is alignment work against already-locked rules (spacing names, wrapper-wins, docs honesty). Step 0.8 (CBP leftover) is done.

---

## Plan

Do not start contracts or `ds-audit` until Step 0 items that would be **encoded as truth** are resolved. Each step is useful alone.

**Stop-the-line:** if after V1 the checker is ignored (restricted imports and undeclared local components do not move), do not add generating agents.

### Step 0 — One source of truth (this repo)

Repair contradictions agents would otherwise enforce. No new packages.

1. **Layout primitive:** pick `Inline` or `Group`. Align `Inline.tsx`, `Group.tsx`, `LAYOUT_GUIDE.md`, both `figma-layout-mapping.mdc` copies, and consumption rules.
2. **Spacing lookup:** rewrite pixel→token tables to Mantine Core + `none` / `xxs` / `xxl` (`4px` → `xxs`). Optionally list `none` and `xxl` in `DESIGN.md` YAML.
3. **Shared enums:** either `Button` / `Badge` / `Alert` import `types.ts`, or stop calling `types.ts` the source of truth.
4. **Figma registry:** Button (and Badge if still wrong) mapping matches the wrapper. Wrapper wins.
5. **Cursor rules split:** always-on = consumption only. Wrapper authoring glob excludes `ComplexComponents/`. Code Connect stays on `*.figma.tsx`.
6. **Lint honesty:** expand ESLint to prototype `app/` + DS, or document that `ds-audit` (Step 3) is the gate.
7. **Docs drift:** `CLAUDE.md` token-dependency text matches `package.json`. Keep `STATUS.md` current.
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

## Suggested next (when implementation is approved)

Start **Step 0.1 + 0.2** only:

1. Pick `Inline` or `Group` and align the mapping docs and wrapper comments.
2. Rewrite pixel→token lookups (`4px` → `xxs`).

Those are doc/rule fixes with no kit release required. Contracts wait until 0.3–0.4 so they are not authored from the wrong Button mapping.

Step 0.8 is done. Refresh `ad-dc/appdirect-prototype-template` with `npm run publish-prototype-template` when a maintainer wants clones to pick up `components/local/`.
