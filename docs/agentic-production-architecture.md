# Agentic software-production architecture

**Status:** recommendation only. No packages, contracts, agents, telemetry, or configuration were implemented.

**Scope:** treat `appdirect-design-system` (main repository) and `templates/designer-prototype` / `ad-dc/appdirect-prototype-template` (prototype fleet) as one system.

**Out of scope:** CBP. It is a product prototype that has already been split off. It is not part of this fleet, not a design-system package, and not a named audit surface. The template still has a leftover folder called `components/cbp/`; that is naming residue from that split, not a convention the factory should encode. Audit local components generically (modules in a prototype that are not imported from the kit). Do not mention CBP in contracts, telemetry, skills, or metrics.

---

## 1. Smallest viable architecture

**V1 is a checker and reporter.** That is a phase, not the destination. The factory later becomes the production path: agents author prototype software against DS-owned contracts, with audit as a gate rather than the product.

V1 ships **evidence tooling** so that later factory work has something true to generate against. Do not start V1 as an independently versioned factory package, a standing multi-agent runtime, a telemetry platform, LLM evaluation of every contract field, or composite quality scores.

The current system already has the right bones: a source-of-truth DS, a published kit tarball, a thin prototype template, Cursor rules/skills copied into that template, and `prototype-manifest.json`. What V1 adds is a **machine-readable definition of component correctness** owned by the design system, a **deterministic auditor** that prototypes can run locally, and a **small structural report** that can be collected across repos.

```
DESIGN.md (human) + DS component source
        │  (Mantine wrappers + AppDirect complex components)
        │
        ▼
component contracts (JSON, published with the kit)
        │
        ▼
deterministic audit CLI (runs in each prototype)
        │
        ▼
prototype-manifest.json + prototype-audit.json
        │
        ▼
fleet rollup (maintainer script over known prototype repos)
        │
        ▼
roadmap evidence (recurring local patterns, exception hotspots)
```

| Phase | Factory role | Who authors product UI |
|---|---|---|
| **V1** | Checker and reporter: contracts, `ds-audit`, manifest versions, fleet evidence | Existing Cursor agents in the prototype repo, using consumption rules/skills |
| **Later** | Production factory: generate and repair pages against those same contracts; materialize Cursor assets; optionally split from the kit | The factory, still consuming DS contracts rather than inventing them |

V1 does not invent a second product. It installs the definition of correctness and the measurement loop the later factory will use. Without that, a generating factory would amplify the drift already in this repo.

In V1, a semantic LLM review is invoked only when the auditor cannot classify a finding: a local component that looks like a missing DS primitive, or a page that uses supported components in a semantically wrong way. That review writes a structured exception. Later, the same contracts become generation constraints.

---

## 2. Current system (what already exists)

```
┌──────────────────────────────────────────────────────────────────┐
│ Main repository: ad-dc/appdirect-design-system                   │
│                                                                  │
│  components/DesignSystem/   source of component correctness      │
│  DESIGN.md                  human spec (YAML + prose)            │
│  styles/theme.ts            Mantine theme + a11y blue            │
│  @appdirect/design-tokens   Artifactory, VPN (main repo only)    │
│  ds-package/                publishes @appdirect/ds-prototype-kit│
│  templates/designer-prototype/   thin starter + Cursor assets    │
│  .cursor/rules|skills|commands   maintainer + DS authoring       │
└──────────────┬───────────────────────────────┬───────────────────┘
               │ kit tarball (GitHub Release)  │ template publish
               ▼                               ▼
     @appdirect/ds-prototype-kit     ad-dc/appdirect-prototype-template
     (TS source + vendored --ad-*    (pins kit URL, copies .cursor/)
      CSS snapshot)                            │
                                               ▼
                                    individual prototype repos
                                    import kit, add local product UI,
                                    bump kit URL
```

**Versioned packages today**

| Artifact | Versioning today | Consumed by |
|---|---|---|
| `@appdirect/design-tokens` | Artifactory `^0.0.6` | Main repo only |
| `@appdirect/ds-prototype-kit` | GitHub Release tarball, currently `0.2.6` | Prototype repos; CSS is a **vendored snapshot** of tokens |
| Prototype template | GitHub template repo; kit URL baked at publish time | New prototypes only |
| Cursor rules/skills | Copied into template at publish; **not independently versioned** | New prototypes; existing clones do not auto-update |
| `prototype-manifest.json` | Page registry only; **no system versions** | Local `create-page` |

**Important split already in place:** designers never need Artifactory. The kit tarball inlines token CSS (`ds-package/vendor/css/`). The main repo still imports live `@appdirect/design-tokens`. Those two token surfaces can drift independently. That is the first fleet-health problem, before any agent architecture.

---

## 3. Recommended architecture

```
                         ┌─────────────────────────┐
                         │ @appdirect/design-tokens│  independently versioned
                         │ (token source of truth) │
                         └───────────┬─────────────┘
                                     │ consumed by main repo;
                                     │ snapshotted into kit CSS
┌────────────────────────────────────▼─────────────────────────────────────┐
│ Main repo                                                                │
│  DS wrappers ──► contracts/*.json ──► kit build                          │
│  DESIGN.md (human)     FIGMA_PROPS_REGISTRY (Figma-facing, not contracts)│
│  template source       Cursor rules/skills (authoring + maintainer)      │
└────────────┬───────────────────────────────┬─────────────────────────────┘
             │                               │
             ▼                               ▼
┌────────────────────────────┐    ┌────────────────────────────────────────┐
│ @appdirect/ds-prototype-kit│    │ prototype template                     │
│ components + types         │    │ Next.js shell, page templates          │
│ contracts (JSON)           │    │ Cursor consumption rules/skills        │
│ bin: ds-audit              │    │ prototype-manifest.json skeleton       │
│ cursor-assets (optional    │    │ pins kit version                       │
│  materialize later)        │    └─────────────────┬──────────────────────┘
└────────────┬───────────────┘                      │
             │ import + audit                       ▼
             │                          individual prototype repos
             │                          package.json → kit
             │                          prototype-manifest.json → versions
             │                          local components → exceptions when declared
             │                          npm run ds:audit → prototype-audit.json
             │                                      │
             └──────────────────────────────────────┘
                                                │ gh/API collect (opt-in)
                                                ▼
                                    fleet rollup (maintainer, main repo)
                                    drift vs gap vs exception
```

**Code factory in V1** is not a new package. It is the checker/reporter slice of the later factory:

1. Component contracts owned by the DS and published **inside the kit**
2. A `ds-audit` binary published **with the kit** (same version)
3. Cursor consumption rules/skills that already ship in the template
4. Room for a later `materialize` step when the factory starts shipping authoring assets independently of visual kit releases

That is enough to make the fleet observable and to keep today’s agents from redefining correctness. The later factory reuses this loop: it generates against the same contracts, then the same auditor reports whether the output holds.

---

## 4. Code-factory distribution: recommendation

### Alternatives evaluated

| Option | What it is | Verdict |
|---|---|---|
| **A. Kit-bundled factory (recommended V1)** | Contracts + `ds-audit` ship in `@appdirect/ds-prototype-kit`. Cursor assets stay in the template. | Smallest checker/reporter. Audit always matches the components the prototype actually imported. |
| **B. Independent factory package** | `@appdirect/code-factory` versioned separately; prototypes bump factory without bumping kit; materializes `.cursor/` assets; later owns generation/repair | The later production factory. Not V1. Extra version axis before fleet evidence exists. Cursor does not natively install rules/skills from npm. |
| **C. Template-only factory** | Rules/skills/audit live only in the GitHub template | Existing prototypes never receive audit improvements unless they re-clone. Template publish is already a weak update channel. |
| **D. Main-repo-only factory** | Agents and audit exist only in `appdirect-design-system` | Does not serve the fleet. Designers are not supposed to write in this repo. |

### Why not B in V1

- The kit **is** the component API the auditor must understand. Splitting factory from kit in V1 creates a compatibility matrix (`factory x kit x tokens x template`) before any fleet data exists.
- Cursor rules and skills are files, not npm APIs. An independent package still needs a **materialize** step into `.cursor/`. That step belongs in the later factory, not as V1 ceremony.
- Prototype repos should require **minimal custom agent configuration**. Option B only helps that if materialize is automatic; once it is automatic, the package boundary is how the production factory ships.
- V1 pain is “I cannot see whether prototypes still match the kit they claim to use.” Later pain is “agents generate UI that the auditor already knows is wrong.” Checker first, then author.

### When to split later (promote A → B)

V1 stays kit-bundled. The later production factory is the reason to split, not V1 packaging preference.

Split factory from kit when **any** of these become true:

1. Factory authoring assets (rules, skills, generation prompts, repair workflows) need to ship **without** a visual kit release
2. More than one supported kit major/minor must be audited or generated against with newer factory behaviour
3. Materialize-from-package is already working (so the split does not invent a new install UX)

Until the split, version factory **with the kit**. Record `kitVersion` in the prototype manifest; in V1 that is also the factory version. Keep the `factory` field so the later split does not change the schema.

### Compatibility validation (v1, still inside the kit)

A small `compatibility` block in the kit (or `template.meta.json` plus kit `package.json`) is enough:

```json
{
  "kit": "0.2.6",
  "tokensSnapshot": "0.0.6",
  "templateRange": ">=0.1.0",
  "mantine": "^9.0.1",
  "react": "^19.2.0"
}
```

`ds-audit` compares this to the prototype’s `package.json` and `prototype-manifest.json`. Fail on peer mismatch; warn on tokens snapshot older than the latest kit.

---

## 5. Package and version boundaries

Version **together** when a change is not meaningful without the other. Version **apart** when consumers must update one without the other.

| Unit | Version with | Independent because |
|---|---|---|
| Design tokens (`@appdirect/design-tokens`) | Token CSS, semantic `--ad-*` names | Token repo already exists; main repo and kit snapshot it |
| DS components + contracts + `ds-audit` (`@appdirect/ds-prototype-kit`) | Wrapper source, contract JSON, auditor that encodes those contracts | Prototypes consume this as one tarball today |
| Token CSS inside the kit | Kit release (snapshot) | Prototypes must not depend on Artifactory |
| Prototype runtime/template | Next.js shell, page templates, Cursor consumption files | Infrequent; independent of Button pixels |
| Figma Code Connect mappings | Main repo only | Prototypes do not publish Code Connect |
| Cursor **authoring** rules (wrapper pattern, Code Connect serializer) | Main repo only | Designers never author DS wrappers |
| Cursor **consumption** rules | Template; later materialize from kit | Must match the kit API the prototype imported |
| Semantic review prompts | Kit or template, not a package | They consume contracts; they must not define them |

**Do not version independently in v1:** factory CLI, contracts, and components.

**Keep tokens independent** from the kit **source**, but **pin the snapshot** inside each kit release. Fleet telemetry should report both `kitVersion` and `tokensSnapshotVersion`. That is how token drift between main repo and prototypes becomes visible.

---

## 6. Persistent Cursor rules

Rules are for **invariants that must hold on every relevant edit**. Skills are for **procedures**. If a document is longer than the invariant, it does not belong in an always-on rule.

### Keep (and split)

The current `.cursor/rules/design-system.mdc` is always-on and mixes three audiences: app consumption, DS wrapper authoring, and Figma Code Connect composition. That is too much context for prototype agents.

| Rule | Where | Apply | Keep as |
|---|---|---|---|
| DS consumption: import from kit/barrel, no raw `@mantine/core` in app/prototype code, no Tailwind, no consumer CSS modules, no inline `style`, `DataTable` vs `Table`, `PageContentHeader` for page headers | Main repo **and** template | always | Thin always-on rule. Template already has the right thinner version. |
| Prototype page contract: `create-page`, manifest update, `AppShellLayout` + layout primitives, breadcrumbs, nav `active` | Both | glob `app/prototype/**` | Existing `prototyping.mdc` |
| Figma layout → `Stack` / `Inline` / `Grid` / `Box` | Both | on demand (Figma implement) | `figma-layout-mapping.mdc` — keep; its **pixel→token** table is a stale 4px-grid lookup, not a second spacing scale (see drift) |
| Code Connect serializer + stub connects | Main repo only | glob `**/*.figma.tsx` | Existing `figma-code-connect.mdc` |
| Wrapper authoring pattern (`forwardRef`, `DS[Name]Props extends Mantine[Name]Props`, barrel export) | Main repo only | glob `components/DesignSystem/{Buttons,Inputs,Combobox,Navigation,Overlays,DataDisplay,Typography,Misc,Layout}/**` | Extract from always-on `design-system.mdc`. **Do not apply to `ComplexComponents/`.** `PageContentHeader` is not a missing Mantine wrapper. |

### Do not persist as Cursor rules

| Existing text | Why not a persistent rule |
|---|---|
| `LAYOUT_GUIDE.md` “if not layout, use `@mantine/core` for forms” | Contradicts consumption invariant |
| `rules/mantine-rules.ts` runtime allowlist | Dead code; not wired to ESLint; allowlist is raw Mantine, which consumption forbids |
| `CLAUDE.md` Claude Code preview sandbox notes | Tool-hosting constraint, not a DS invariant |
| Code Connect instance-swap essay currently inside always-on `design-system.mdc` | Belongs on `*.figma.tsx` glob only |
| `Inline.tsx` “prefer `Group` for new code” | Contradicts layout mapping and `LAYOUT_GUIDE.md`; resolve in source, then document once |
| Wrapper authoring recipe applied to `ComplexComponents/` | `PageContentHeader` is not `forwardRef` + `extends MantineX`. Forcing that pattern would invent a fake Mantine base. |
| Full `DESIGN.md` | Human spec. Agents should **read it when touching tokens/visuals**, not load it on every keystroke |

### Template vs main repo

Prototype agents need **consumption** rules only. Maintainer agents in this repo need **authoring + Code Connect + publish** rules. The template already made this split. The main-repo always-on rule should catch up, or prototype work done inside this repo will keep mixing Figma serializer advice into page edits.

---

## 7. Skills (recurring workflows)

A skill is warranted when the steps are stable, easy to get wrong, and already have a script or a three-step ritual. It is not warranted because “an agent could do it.”

### Keep

| Skill | Repo | Why it is a skill |
|---|---|---|
| `start-prototype` | Main + template | `gh repo create --template`; easy to fork the DS repo by mistake |
| `publish-prototype-template` | Main only | Maintainer ritual; pins kit URL |
| `create-prototype` | Main only | Optional local scaffold; skill already defers to `start-prototype` |
| `prototype-workspace` | Template only | Daily page creation, kit bump, local product UI |

### Promote commands → skills (main repo only)

`/code-connect-props`, `/code-connect-sync`, `/code-connect-pr` are already procedural and high-stakes. They should be skills with the commands as thin entry points. They must **not** ship in the prototype template.

### Add (v1)

| Skill | Where | Trigger |
|---|---|---|
| `audit-prototype` | Template (and main repo for in-tree prototypes) | “check this prototype”, “are we on the kit”, before PR |
| `bump-kit` | Template | “update the design system”; bump tarball URL, `npm install`, run `ds-audit`, update manifest versions |

Fold kit bump into `prototype-workspace` if two skills feel like ceremony. Prefer one skill over two if the only difference is a flag.

### Do not add as skills

- Generic “implement this page from Figma” — the FigQuery `figma-design-to-code` skill already exists; layout mapping is a rule
- “Write a DS wrapper” — rare, maintainer-only; authoring rule + README is enough
- “Classify fleet gaps” — that is a **subagent** (or a maintainer script), not a designer skill
- “Review my PR” — GitHub + `ds-audit` are sufficient

---

## 8. Isolated subagents

Isolate work only when it (a) has a large or foreign context, (b) would pollute the coding thread, and (c) produces a structured artifact. Do not isolate because a task is delegable.

| Task | Subagent? | Why |
|---|---|---|
| Scaffold / edit a prototype page | No | `prototype-workspace` + rules |
| Run lint / typecheck / `ds-audit` | No | Commands |
| Bump kit | No | Skill |
| Code Connect prop audit for one component | No | Existing `/code-connect-props` skill/command |
| Code Connect publish + PR packaging | Maybe | Only if Figma CLI + git/PR steps keep overflowing the mapping thread. A skill is probably enough; the referenced `.cursor/agents/code-connect-pr.md` does not exist. |
| Semantic review of a **flagged** local component | Yes, on demand | Needs contract text + similar prototypes + DESIGN.md; should not rewrite the page in the same turn |
| Fleet rollup across many prototype repos | Yes, maintainer-only | Volume and credentials; output is a table, not code |

**Default agent in V1** (prototype repo): implement the page, then run `ds-audit`. Stop. If the audit emits `needs_semantic_review`, the user (or orchestrator) may launch the exception reviewer. That reviewer cannot mark a gap as “approved DS change”; it can only propose an exception record.

Later, the default path inverts: the factory proposes the page against contracts, then the same auditor gates it.

---

## 9. Durable orchestrator state

The orchestrator (human or agent) needs **files that survive a session**, not memories or transcripts.

| State | Owner | Purpose |
|---|---|---|
| `prototype-manifest.json` | Each prototype | Identity, page list, **pinned system versions** |
| `prototype-audit.json` | Each prototype (generated) | Last deterministic audit; committed or CI artifact |
| Component contracts | Kit / DS source | Definition of correctness |
| `DESIGN.md` | Main repo | Human rationale; not machine-enforced |
| `template.meta.json` | Template source | Template identity + default kit package name |
| Kit `package.json` + `compatibility` | Kit | Peer and snapshot pins |
| `STATUS.md` | Main repo | In-flight DS work, not fleet state |
| Exception records | Audit output / optional `exceptions/` in the prototype | Local, explicit, reviewable |

**Do not persist:** prompts, agent transcripts, designer clickstreams, Claude preview caveats, the dead `rules/mantine-rules.ts` allowlist.

`prototype-manifest.json` already exists and is written by `create-page`. Extend it. Do not add a second identity file.

---

## 10. Component contracts

### Ownership

The design system owns the definition of correctness. Contracts live **next to the component** (or in `components/DesignSystem/contracts/`) and are copied into the kit by the existing `ds-package/scripts/build.js`. The factory/auditor **consumes** them. Cursor rules may **point at** them. Agents must not invent a second variant list.

There are two kinds of DS component. Do not write the same contract for both.

| Kind | What it is | Example | Contract is about |
|---|---|---|---|
| **Mantine wrapper** | Thin DS layer over a Mantine Core component: restricted variants, forced defaults, token mapping | `Button`, `Badge`, `Alert`, `Stack` | Public API vs Mantine, deprecated aliases, fixed `radius` |
| **AppDirect complex component** | Designed composition unique to this system. **No Mantine counterpart.** Built from DS primitives (and occasionally a Mantine utility that has no DS wrapper) | `PageContentHeader`, also `DataTable`, `KeyInsight`, `NameValue`, `DashboardWidget` | Anatomy, mutually exclusive slots, composition rules, which primitives it may use internally |

`PageContentHeader` is the second kind. Mantine has no page-content-header. Its API (`title`, `subhead`, `badge`, `actions`, mutually exclusive `contentSection`: insights / description / descriptionBlock / nameValuePairs / drawer) is AppDirect. Internally it composes `Card`, `Title`, `Button`, `Badge`, `ThemeIcon`, `KeyInsight`, `NameValue`, `DescriptionBlock`. `Collapse` / `rem` from `@mantine/core` are utilities, not a wrapped “PageContentHeader.” A contract that treated it as `DSPageContentHeaderProps extends MantineX` would be wrong.

`FIGMA_PROPS_REGISTRY.md` is the **Figma-facing** subset of the contract. It is not the contract. Today it already disagrees with wrappers (Button variant→Mantine mapping; Badge variant vs color). Wrapper contracts should be generated from, or tested against, TypeScript enums — not from the registry markdown.

`components/DesignSystem/types.ts` already claims to be a single source of truth (`DS_BUTTON_VARIANTS`, `DS_BADGE_VARIANTS`, `STATUS_TO_MANTINE_COLOR`) and is **almost unused** by wrappers. That file is the right seed **if** wrappers actually import it. Until they do, the **component source** remains authoritative (same rule as `CLAUDE.md`: implementation wins over docs). For `PageContentHeader`, that source is `ComplexComponents/PageContentHeader/PageContentHeader.tsx`, not a Mantine type.

### Which components get explicit contracts first

Do not contract all ~70 DS exports. Start with components that (1) already restrict a Mantine API, (2) are AppDirect page-level compositions used on every prototype, or (3) are the usual drift magnets.

| Tier | Components | Why |
|---|---|---|
| 0 wrappers | `Button`, `Badge`, `Alert`, layout primitives (`Stack`, `Inline`/`Group`, `Grid`, `Box`) | Restricted Mantine APIs |
| 0 complex | `PageContentHeader`, `DataTable` | AppDirect-designed compositions; page-level patterns; not Mantine components |
| 1 | `ActionIcon`, `TextInput`, `Select`, `Card`, `Tooltip`, `Avatar`, `Table` | Defaults (`radius="sm"`), semantic colors, `Table` vs `DataTable` |
| 2 | Remaining wrappers and other complex components (`KeyInsight`, `DashboardWidget`, …) | Passthrough wrappers: TypeScript + import lint. Other complex components: wait until a real restriction exists |

Passthrough wrappers (`Paper`, `Divider`, `Kbd`) do not need a narrative contract. An empty `restrictions: []` with `importFrom` is enough.

`PageContentHeader` stays in V1 because prototypes are required to use it for page headers. Its contract fields are `contentSection` exclusivity, required `title`, composition (do not rebuild this from a raw `Card` + `Title`), and that actions use DS `Button` variants — not a Mantine variant map.

### Contract shape (v1)

Keep the schema small. Every field must have an enforcement owner: `deterministic` or `semantic`.

```json
{
  "$schema": "https://appdirect.local/schemas/ds-component-contract.v1.json",
  "id": "Button",
  "version": "0.2.6",
  "purpose": "Primary interactive control for user actions. One primary button per view.",
  "importFrom": ["@appdirect/ds-prototype-kit", "@/components/DesignSystem"],
  "anatomy": ["root", "label", "leftSection", "rightSection"],
  "api": {
    "variants": ["primary", "secondary", "default", "outline", "danger", "link", "secret"],
    "sizes": ["xs", "sm", "md", "lg", "xl"],
    "defaults": { "variant": "default", "size": "sm", "radius": "sm" },
    "deprecated": [
      { "name": "color", "replacement": "variant", "since": "0.2.0" },
      { "name": "variant=disabled", "replacement": "disabled={true}", "since": "0.2.0" }
    ]
  },
  "tokens": {
    "required": ["--ad-action-primary-bg", "--ad-action-secondary-bg", "--ad-radius-sm"],
    "forbiddenInConsumers": ["raw hex", "raw px padding"]
  },
  "states": ["default", "hover", "active", "disabled", "loading"],
  "a11y": {
    "role": "button",
    "nameFrom": "children",
    "rules": ["must have accessible name", "loading announced"]
  },
  "composition": {
    "mustUseFor": ["page primary/secondary actions"],
    "mustNotUseFor": ["navigation to a route (use link/NavLink)", "icon-only (use ActionIcon)"]
  },
  "content": {
    "label": "verb phrase, sentence case",
    "maxPrimaryPerView": 1
  },
  "extensions": { "allowed": ["leftSection", "rightSection"], "forbidden": ["style", "className for visual override"] },
  "enforcement": {
    "deterministic": ["importFrom", "api.variants", "api.sizes", "api.defaults.radius", "api.deprecated", "tokens.forbiddenInConsumers", "a11y.nameFrom"],
    "semantic": ["purpose", "composition", "content.maxPrimaryPerView", "content.label"]
  }
}
```

The JSON above is a **proposal**, not an implemented file. A representative example grounded in the actual `Button` wrapper follows.

### Representative example: `Button` (from this repository)

Ground truth is `components/DesignSystem/Buttons/Button.tsx`, not `FIGMA_PROPS_REGISTRY.md` and not `types.ts`.

Observed definition of correctness:

- Public variants: `primary | secondary | default | disabled | link | secret | outline | danger`
- Default `variant="default"`, default `size="sm"`, forced `radius="sm"`
- `color` is documented `@deprecated` and ignored
- `variant="disabled"` is a **state alias** mapped to Mantine `default` + `disabled`
- DS variant names are passed through to Mantine (`data-variant="primary"`); CSS adapter + `Button.module.css` style them
- `leftSection` / `rightSection` are supported
- Consumer CSS module `Button.module.css` exists despite the “no CSS modules” **consumer** rule — that exception is **producer-side** and must be named in the contract so auditors do not flag the kit itself

Proposed contract (abridged, still recommendation-only):

```json
{
  "id": "Button",
  "purpose": "Submit or trigger an action. Not for navigation or icon-only controls.",
  "importFrom": ["@appdirect/ds-prototype-kit", "@/components/DesignSystem"],
  "anatomy": ["root", "children", "leftSection", "rightSection"],
  "api": {
    "props": {
      "variant": {
        "enum": ["primary", "secondary", "default", "outline", "danger", "link", "secret", "disabled"],
        "default": "default",
        "notes": "disabled is a deprecated alias for disabled={true}"
      },
      "size": { "enum": ["xs", "sm", "md", "lg", "xl"], "default": "sm" },
      "radius": { "fixed": "sm", "consumerOverride": false },
      "color": { "deprecated": true, "ignored": true },
      "loading": { "type": "boolean" },
      "disabled": { "type": "boolean" },
      "fullWidth": { "type": "boolean" },
      "leftSection": { "type": "ReactNode" },
      "rightSection": { "type": "ReactNode" },
      "children": { "required": true, "type": "ReactNode" }
    }
  },
  "tokens": {
    "maps": {
      "primary": ["--ad-action-primary-bg", "--ad-color-brand-on-primary"],
      "secondary": ["--ad-action-secondary-bg", "--ad-action-secondary-fg"]
    }
  },
  "states": ["enabled", "hover", "active", "disabled", "loading"],
  "interaction": {
    "click": "onClick",
    "disabledSkipsClick": true,
    "loadingSkipsClick": true
  },
  "a11y": {
    "accessibleName": "required from children or aria-label",
    "contrast": "primary on white is the a11y blue #326FDE"
  },
  "content": { "maxPrimaryPerView": 1 },
  "composition": {
    "preferInstead": {
      "iconOnly": "ActionIcon",
      "navigation": "NavLink or Anchor/Text link variant"
    }
  },
  "deprecatedPatterns": [
    "import { Button } from '@mantine/core'",
    "variant=\"disabled\"",
    "color=\"blue\"",
    "radius=\"xl\"",
    "style={{ backgroundColor: '#326FDE' }}"
  ],
  "exceptions": {
    "producerCssModule": "components/DesignSystem/Buttons/Button.module.css is allowed in the kit, not in prototypes"
  }
}
```

Conflicts the contract must resolve (today they are live drift):

- `types.ts` `DS_BUTTON_VARIANTS` omits `disabled`; the wrapper includes it
- `FIGMA_PROPS_REGISTRY.md` maps `primary` → Mantine `filled`/`blue`; the wrapper passes `variant="primary"` through
- `Button.figma.tsx` uses a function-body `example`, which `.cursor/rules/figma-code-connect.mdc` forbids
- `DESIGN.md` says one primary per view — semantic only

---

## 11. Deterministic vs semantic enforcement

Prefer tools the prototype already has: TypeScript, ESLint, AST grep, axe/Storybook a11y, `ds-audit`.

| Contract field | Deterministic? | Mechanism |
|---|---|---|
| Identity / import path | Yes | `no-restricted-imports`; ban `@mantine/core` in prototype `app/` and local component files |
| Supported props / enums | Yes | TypeScript on the wrapper; `ds-audit` flags `as any` / spread that escape the type |
| Fixed defaults (`radius="sm"`) | Yes | Wrapper hardcodes them; consumer override via `radius` can be omitted from the public type (already done on `ActionIcon`) |
| Deprecated props | Yes | TS `@deprecated` + ESLint `deprecation` or audit on `color=`, `variant="disabled"`, `Alert type=` |
| Forbidden styling (`style=`, Tailwind classes, CSS modules in consumers) | Yes | ESLint; grep `style={{`; `.module.css` under prototype `app/` and local components |
| Raw hex / off-scale px in consumers | Yes | Restricted syntax; allowlist `var(--ad-*)` |
| Token CSS loaded | Yes | `app/layout.tsx` must import kit foundations + mantine CSS |
| Kit / template / tokens versions | Yes | Manifest vs `package.json` vs kit `compatibility` |
| `PageContentHeader` present on prototype pages | Yes (heuristic) | AST: default export page under `app/prototype/**` |
| `DataTable` vs `Table` vs handmade list | Partial | AST can see `DataTable` unused while mapping arrays of records into `Stack`/`Inline` (see `app/prototype/customers/page.tsx`). Classification needs semantics. |
| Accessible name on buttons/inputs | Mostly | `eslint-plugin-jsx-a11y` + `@storybook/addon-a11y` / axe on stories. Custom widgets need review. |
| Anatomy | No as a consumer check | Producer test: wrapper still renders the slots. Optional later. |
| Interaction behaviour (keyboard, focus trap) | Partial | Testing-library/playwright for overlays in the **main** repo. Prototypes: only if they fork overlay behaviour. |
| Content guidance (label tone, one primary) | No | Semantic |
| Semantic usage (this should have been `Alert` not `Card` + red `Text`) | No | Semantic |
| Composition (“list page should be header + DataTable”) | Heuristic only | Semantic confirmation |
| “Should this local component become a DS component?” | No | Semantic + fleet recurrence |
| Legitimate product exception | No | Human; auditor only records it |

**Rule:** if a property is in `enforcement.deterministic` and an LLM is used to “also check it,” the LLM is waste. Use the linter.

Current enforcement gap: `package.json` `lint` in the main repo only lints a handful of shell files, not `components/DesignSystem` or `app/prototype`. The template lints `app/`. v1 of `ds-audit` should not wait for a perfect ESLint config; it can AST-scan the same rules.

---

## 12. Where design-system drift already occurs

This is current, in-repo evidence. A factory that cannot see these will not help the fleet.

### Conflicting sources of truth

| Topic | Sources that disagree |
|---|---|
| Token package in this repo | `package.json` and `app/layout.tsx` import `@appdirect/design-tokens`; `CLAUDE.md` still says it is not a dependency; `STATUS.md` matches package.json |
| Token CSS in prototypes | Kit vendors a snapshot (`ds-package/vendor/css`); main repo uses live package. Snapshot refresh is a manual `cp` |
| Button variant mapping | Wrapper pass-through vs `FIGMA_PROPS_REGISTRY.md` filled/blue table vs `types.ts` omitting `disabled` |
| Badge API | Wrapper `variant` includes semantic colors; `types.ts` `DS_BADGE_VARIANTS` is `filled \| outline`; registry matches types, not wrapper |
| Alert `warning` vs `pending` | `DESIGN.md`: `warning` for alerts, `pending` for badges. Wrapper `Alert` has `pending` and no `warning`. Deprecated `type` alias still exists |
| Horizontal layout | `figma-layout-mapping.mdc` and `LAYOUT_GUIDE.md`: use `Inline`, never `Group`. `Inline.tsx`: “Prefer `Group` for new code.” `Group.tsx` is a first-class export |
| Spacing scale | **One scale:** Mantine Core `xs–xl` (10 / 12 / 16 / 20 / 32) plus added `none` (0), `xxs` (4), `xxl` (48). Runtime layout (`Stack` et al.) passes `gap` through to Mantine; `theme.ts` does not override spacing. The 4 / 8 / 16 / 24 / 32 table in `figma-layout-mapping.mdc`, `LAYOUT_GUIDE.md`, and `config.ts` is a **stale pixel→token lookup**, not a competing DS scale. Agents using that table still mis-assign names (`4px` is `xxs`, not `xs`). `DESIGN.md` YAML documents `xxs` but omits `none` / `xxl`; vendored `--ad-spacing-*` has `none` / `xxs` and not `xxl`. |
| “No CSS modules / no inline styles” | Consumer rule. Producers: `Button.module.css`, `Card.module.css`, `Tooltip` hardcoded `#212529` and `padding: '5px 8px'` (documented exception in DESIGN.md) |
| Raw Mantine inside DS | Shell, DataTable internals, stories, and utilities with no DS wrapper (`Collapse`, `rem` inside `PageContentHeader`). Complex components are **not** Mantine wrappers; they should compose DS primitives. Consumption rules still do not distinguish producer vs consumer. |
| LAYOUT_GUIDE vs consumption | Guide still says use Mantine Core for “form controls / complex interactions” |
| Deprecated local shells | `components/HeaderBar.tsx` etc. still present, marked deprecated |

### Pattern drift in the only in-tree prototypes

`app/prototype/customers/page.tsx` is a list of records rendered as `Card` + `Stack` + `Inline` + `Badge`. Rules and Figma Code Connect notes say list pages should use `DataTable`. That may be a **gap** (DataTable is heavy for five static rows) or **drift** (the canonical list pattern was not used). In V1 the factory **flags** it. Later, the same finding is a generation/repair input, not only a report.

`app/prototype/settings/page.tsx` still has `TODO` nav and empty `PageContentHeader` description — template leftover, not a DS gap.

### Authoring drift (main repo, still leaks to the kit)

- DataTable and Combobox implementations import raw Mantine primitives that have DS wrappers (`ActionIcon`, `Select`, `Text`, `Box`). `PageContentHeader` is an AppDirect complex component; it correctly composes DS primitives and only reaches `@mantine/core` for `Collapse` / `rem` (no DS Collapse exists).
- Stories use `style={{` extensively — agents copy stories
- `Button.figma.tsx` violates the serializer rule
- `needs-connect` remains on Title, FileInput, RadioGroup, AutocompleteClearable, and most ComplexComponents
- `LAYOUT_MIGRATION_PLAN.md` still describes “50+ files import Group from `@mantine/core`” as current; some of that is stale, some is not

### Docs drift

- `STATUS.md` last updated 2026-09-01; kit is 0.2.6
- Memory file `.cursor/memory/code-connect-figma-ds.md` references `.cursor/agents/code-connect-pr.md`, which is absent
- Template and skills still tell agents to put product widgets in `components/cbp/`. CBP is a split-off prototype. That folder name is leftover and must not become the fleet’s custom-component convention or an audit dimension.

These are exactly the classes fleet telemetry should distinguish: **doc/source mismatch** (fix the DS), **prototype misuse** (drift), **missing primitive** (gap).

---

## 13. Prototype manifest

Extend the existing file. Do not add `factory.json`.

Proposed `prototype-manifest.json`:

```json
{
  "prototypeName": "Revenue Ops",
  "template": {
    "id": "ad-dc/appdirect-prototype-template",
    "version": "2026.09.01"
  },
  "versions": {
    "kit": "0.2.6",
    "tokensSnapshot": "0.0.6",
    "factory": "0.2.6",
    "mantine": "9.0.1"
  },
  "pages": [],
  "navGroups": {},
  "exceptions": [
    {
      "id": "local-pricing-matrix",
      "path": "components/PricingMatrix.tsx",
      "kind": "legitimate_local",
      "reason": "Product-specific pricing grid; not a shared admin pattern"
    }
  ]
}
```

Notes:

- `versions.factory` equals `versions.kit` in v1. Keep the field so a later split does not change the schema.
- `template.version` can be a date stamp or git sha written by `publish-prototype-template`.
- `ds-audit` should **rewrite `versions` from lockfile/package.json**, not trust hand-edited numbers.
- `exceptions` are opt-in and local. Recurrence across repos is computed centrally, not by copying another team’s exception list.

`template.meta.json` should gain `templateVersion` and `minKit` so new clones are self-describing before the first audit.

---

## 14. Minimal telemetry schema

One generated file per prototype: `prototype-audit.json`. Produced by `ds-audit`. No prompts. No transcripts. No designer identity beyond the GitHub repo name the maintainer already has.

```json
{
  "schemaVersion": 1,
  "generatedAt": "2026-09-14T21:00:00Z",
  "repo": "ad-dc/proto-checkout",
  "versions": {
    "template": "2026.09.01",
    "kit": "0.2.6",
    "tokensSnapshot": "0.0.6",
    "factory": "0.2.6",
    "latestKitKnown": "0.2.6"
  },
  "health": {
    "typecheck": "pass",
    "lint": "pass",
    "build": "pass",
    "audit": "fail"
  },
  "adoption": {
    "systemComponents": { "Button": 12, "PageContentHeader": 3, "DataTable": 0, "Stack": 19 },
    "customComponents": { "count": 2, "paths": ["components/PricingMatrix.tsx", "components/UsageChart.tsx"] }
  },
  "compliance": {
    "restrictedImports": 4,
    "deprecatedApi": 1,
    "tokenViolations": 3,
    "contractViolations": [
      { "component": "Button", "rule": "api.deprecated.color", "file": "app/prototype/settings/page.tsx", "line": 40 }
    ],
    "a11y": { "violations": 2, "tool": "jsx-a11y" }
  },
  "patterns": {
    "unsupported": [
      { "id": "handmade-record-list", "file": "app/prototype/customers/page.tsx", "insteadOf": "DataTable" }
    ]
  },
  "exceptions": [
    { "id": "local-pricing-matrix", "kind": "legitimate_local", "path": "components/PricingMatrix.tsx" }
  ]
}
```

**Collection:** do not build a service. v1 collection is:

1. Prototype CI or `npm run ds:audit` writes the file
2. Optional: commit it (small, structural) **or** upload as a GitHub Actions artifact
3. Maintainer script in the main repo: `gh` list of repos created from `appdirect-prototype-template`, fetch latest `prototype-audit.json`

If the org cannot query template-generated repos, keep a manual `fleet.json` list of clone URLs in the main repo. That is ugly and sufficient.

**Privacy:** no prompt text, no file contents, no user email. Paths and counts only.

---

## 15. Drift vs gap vs legitimate exception

| Class | Definition | Detection |
|---|---|---|
| **Drift** | A supported DS pattern exists and the prototype reinvented it | Deterministic: banned import, deprecated API, handmade list while `DataTable` is in the kit, raw hex, extra `radius`. Low ambiguity. |
| **Gap** | Several prototypes independently invent the **same** local component or the same `unsupported` pattern because the kit cannot express the requirement | Fleet rollup: cluster local component names + hashed AST shapes + repeated `unsupported` ids across repos. Semantic review confirms “same problem.” |
| **Legitimate local exception** | One product needs a one-off; it should not enter the kit | Declared in manifest `exceptions` with a reason. Rollup shows **n=1** over time. |

### Clustering without an ML platform

1. Normalize local component filenames (`PricingTable`, `PriceTable`, `pricing-matrix`)
2. Hash imports + DS components used inside each local component file
3. Group identical `unsupported` pattern ids
4. Threshold: **n ≥ 3 prototypes** or **n ≥ 2 independent authors** → candidate gap
5. Human DS review (or on-demand semantic subagent) writes a roadmap note in `STATUS.md` / DESIGN.md pending work

The in-tree customer list is the template for this decision:

- If many prototypes render record lists as stacked `Inline` rows → **gap or docs failure** (DataTable too heavy; need a `SimpleList` primitive) or **drift** (agents were not told to use `Table` for static markup)
- The contract for `Table` vs `DataTable` must state that **static dummy lists may use `Table`**, not `DataTable`. That single sentence prevents false drift.

Do not auto-promote local components into the DS. Recurrence is **evidence**, not a merge.

---

## 16. Metrics

Dimensional metrics only. No aggregate 0–100 “conformance score.” Aggregates hide whether the fleet is stale, sloppy, or blocked by a missing primitive.

### v1 metrics (actionable)

| Metric | Question it answers | How |
|---|---|---|
| Kit version distribution | How current is the fleet? | Histogram of `versions.kit` vs latest release |
| Kit lag (days behind latest) | Is update friction the problem? | `latestKitKnown` − pin date |
| Tokens snapshot vs live tokens | Are prototypes visually behind main? | `tokensSnapshot` ≠ current `@appdirect/design-tokens` |
| System component usage | What is actually adopted? | Counts per component |
| Custom component count per prototype | Where is local UI exploding? | Local component files not imported from the kit |
| Recurring local-pattern clusters | Where might the DS be inadequate? | Cluster size ≥ threshold |
| Deprecated API hits | Which primitives generate exceptions? | `contractViolations` grouped by `component.rule` |
| Restricted import hits | Raw Mantine / Tailwind drift | Count |
| Token violations | Off-token color/spacing | Count |
| A11y violations | Accessibility health | jsx-a11y/axe counts |
| Build/typecheck/audit health | Is the repo still a runnable prototype? | `health.*` |
| Exception rate with declared reason | Are people using the exception valve? | `exceptions.length` vs undeclared custom components |

Factory version adoption is **identical to kit version** in v1. Track it as a field, do not chart it separately until the package splits.

### What not to measure

- Lines of code generated
- Number of agent turns
- “Percent of components used”
- A weighted quality index
- Southleft’s **69/100** screen score as a portable target. That number is five tasks, a closed catalog, and a **deterministic JSX judge** (`docs/10-honest-generation.md` in `southleft/ds-contracts-poc`). Without the same judge and a consistent catalog, copying the score is vanity.

### Does the factory improve quality?

Run a **fixed evaluation set**, not production vanity metrics.

1. Freeze 5–8 tasks (e.g. list page, detail page, settings form, Figma-to-page, kit bump)
2. Implement each twice against the same brief: current template vs template + contracts + `ds-audit` in the loop
3. Score only:
   - deterministic audit findings (count by class)
   - presence of required composition (`PageContentHeader`, correct table primitive)
   - undeclared custom components
   - a11y hits
   - kit pin currency after the bump task
4. Human DS review of “would we merge this visual language?”
5. Repeat quarterly on new prototypes (fleet histograms), not on the gold set alone

If audit counts fall while custom-component clusters stay flat, the V1 factory is catching **drift**. If custom clusters grow around the same hash, it is revealing **gaps** — success, not failure. If both rise, agents are producing more code and ignoring the auditor: fix the always-on rules and CI gate before promoting the factory from checker to author. Adding generating agents on top of ignored audits will scale the same failures.

**CI gate (prototype):** fail on restricted imports and typecheck; **warn** on composition heuristics and undeclared local components. Failing the build on semantic guesses will train designers to disable the factory.

---

## 17. Ownership boundaries

| Concern | Owner | Not owner |
|---|---|---|
| Visual language, wrapper behaviour, contracts | Design-system package (this repo’s `components/DesignSystem` + kit) | Factory, Cursor, prototypes |
| `--ad-*` tokens, palettes | `@appdirect/design-tokens` | Kit (snapshots only), prototypes |
| Contract JSON | DS (same PR as wrapper changes) | Agents must not edit contracts to match bad usage |
| Figma Code Connect + `FIGMA_PROPS_REGISTRY.md` | DS / Figma workflow in main repo | Prototype fleet |
| Prototype runtime (Next app shell, `create-page`) | Template | Kit |
| Consumption Cursor rules/skills | Template (v1); kit materialize (later) | Main-repo authoring rules |
| Authoring Cursor rules, Code Connect skills | Main repo | Prototypes |
| Deterministic validation (`ds-audit`, ESLint, tsc) | Ships with kit; run in prototype | LLM |
| Semantic validation | On-demand reviewer using **DS contracts** | Must not define new variants |
| Telemetry schema + auditor output | Kit | Aggregation script may live in main repo |
| Fleet aggregation / roadmap | DS maintainers | Individual prototype authors |
| Local exceptions | Prototype manifest, declared by author | DS does not veto; rollup may still classify as gap |
| V1 factory (audit CLI, reports) | Ships with kit; run in prototype | Does not author product UI |
| Later production factory (generation, repair, Cursor materialize) | Factory package or kit export, consuming DS contracts | Must not own component correctness |

**Versioned together (V1):** kit components + contracts + `ds-audit`.

**Versioned independently:** tokens (source), template (runtime), main-repo Code Connect. Later, the production factory (authoring assets, generation/repair) when its cadence diverges from the kit.

**Cursor agents in V1** are not a versioned product. They load rules/skills from the repo they are in. The later factory versions those assets (template republish, then materialize, then an independent factory package) so authoring behaviour can move without a visual kit release.

---

## 18. Evaluation framework (quality, not volume)

Goal: decide whether the architecture **reduces incorrect UI** and **surfaces real DS gaps**, not whether agents write more TSX.

**Unit of evaluation:** a prototype repository after a specified task, plus the fleet histogram once ≥ ~5 live prototypes exist.

**Gold checks (automated):**

- No `@mantine/core` in prototype `app/` or local component files
- Kit pin parses and matches manifest
- Token CSS imported
- No deprecated contract APIs
- Page headers use `PageContentHeader`
- Tables: `DataTable` or `Table` per contract, not ad-hoc HTML tables
- `ds-audit` schema v1 present

**Gold checks (human, small sample):**

- One primary button per view
- Status colors only on status components
- Local components are product-specific, not a second Button
- Spacing tokens match Mantine Core `xs–xl` plus added `none` / `xxs` / `xxl` (not the stale 4px-grid lookup in agent mapping docs)

**Fleet checks:**

- Median kit lag
- Top 5 contract violation rules
- Local-pattern clusters ≥ 3
- Ratio of declared exceptions to undeclared custom files (low ratio = people bypassing the system)

**Stop-the-line before promoting the factory:** if after two evaluation cycles custom-component count and restricted imports do not move, do not add generating agents. Fix contracts, CI, and the consumption rule. A production factory on top of current contradictions (Inline vs Group, Badge variant vs color) will produce more of the same UI.

---

## 19. Migration path

No big-bang. Each step is useful alone.

### Step 0 — Repair contradictions (this repo, before the V1 factory)

Without this, agents will “enforce” the wrong system.

1. Pick `Inline` vs `Group` (layout mapping currently says Inline; `Inline.tsx` says prefer Group)
2. Treat spacing as Mantine Core `xs–xl` plus added `none` / `xxs` / `xxl`. Rewrite the pixel→token lookup in both `figma-layout-mapping.mdc` copies, `LAYOUT_GUIDE.md`, and `config.ts` so `4px` maps to `xxs` (not `xs`). Do not invent a second scale. Optionally list `none` and `xxl` in `DESIGN.md` YAML so docs match the token screenshot.
3. Make `types.ts` actually used by `Button` / `Badge` / `Alert`, or delete the “single source of truth” claim
4. Align `FIGMA_PROPS_REGISTRY.md` Button mapping with the wrapper
5. Split main-repo `design-system.mdc` so Code Connect and wrapper authoring are not always-on
6. Expand `lint` beyond the handful of shell files, or admit that `ds-audit` is the real gate
7. Refresh or snapshot-date `STATUS.md` / `CLAUDE.md` token-dependency text
8. Rename the leftover `components/cbp/` slot in the template (and matching Cursor rules/skills) to a generic local-components folder. Do not carry CBP into audit, telemetry, or metrics.

### Step 1 — Manifest versions

Add `versions` (and optional `template`) to `prototype-manifest.json` in the template and in this repo. Have `create-page` leave them alone; have a tiny script fill them from `package.json`.

### Step 2 — Contracts for tier 0 only

Hand-write JSON for tier-0 wrappers (Button, Badge, Alert, layout) and tier-0 complex components (`PageContentHeader`, `DataTable`). Publish them in the kit. Wrapper test: enums ⊆ contract enums. Complex-component test: `contentSection` union and required `title` match `PageContentHeader.tsx` — do not assert a Mantine base type.

### Step 3 — `ds-audit` in the kit

Read-only scanner: versions, restricted imports, deprecated APIs, token/style bans, component usage counts, local component file list. Write `prototype-audit.json`. Wire `npm run ds:audit` in the template.

No LLM. No network.

### Step 4 — Template: CI warn + `audit-prototype` skill

Prototype GitHub Action: typecheck + audit. Fail on imports; warn on heuristics. Skill documents how to bump kit and re-audit.

### Step 5 — Fleet rollup

Maintainer script + optional `fleet.json`. Produce a markdown table: kit versions, top violations, local-pattern clusters. Feed DESIGN.md pending work.

### Step 6 — Semantic reviewer (optional)

Only after false positives on composition heuristics are understood. Input: audit `needs_semantic_review` items. Output: exception record `{ drift | gap | legitimate_local }`.

### Step 7 — Materialize Cursor assets (start of the production factory)

V1 skills stay in the template. When authoring behaviour must move without a visual kit release, the factory starts shipping Cursor assets and materializing them into prototype repos. API-describing rules must still match the installed kit; factory-owned skills (generation, repair, audit-driven rewrite) can move faster.

### Step 8 — Production factory

The factory becomes the authoring path: generate and repair pages against DS contracts, run the same `ds-audit` as a gate, then optionally split to an independent factory package (option B). Do not start this step until V1 evidence shows the checker is actually used (restricted imports and undeclared local components trend down, or clusters are classified as gaps rather than ignored noise).

### Deferred from V1 (not abandoned)

These belong to later factory work or are out of scope:

- Independent `@appdirect/code-factory` package (later factory, option B)
- Factory-authored generation/repair of prototype pages (later factory)
- Per-component LLM eval harness
- Analytics warehouse
- Standing multi-agent orchestrator
- Auto-extraction of contracts from Figma (Curtis Specs as **source of truth**; later it may be a Figma **observation** against wrapper-owned contracts)
- Installing `southleft/ds-contracts-poc` as the factory (incomplete v1; generates both React and Figma; ~10% brownfield coverage; would import Mantine Core APIs this kit exists to hide)
- Pandya-style markdown `specs/` + prototype-owned `tokens.css` as the contract (JSON matches; markdown is understood; prototypes must not own hex/px CSS)
- Requiring Artifactory in prototype repos
- CBP as an audit, telemetry, or contract concern (split-off prototype; out of this system)

---

## 20. What “done” looks like

### V1 (checker and reporter)

A designer prototype can:

1. Pin a kit version in `package.json`
2. Run `npm run ds:audit`
3. See structural evidence: versions, banned imports, deprecated APIs, local component files
4. Declare a local exception in the manifest

A DS maintainer can:

1. Open a rollup of those audit files
2. Answer “how current is the fleet?” and “which rule fires most?”
3. See three similar local components as a **gap candidate**, not as noise

An agent in a prototype repo:

1. Loads a **short** consumption rule
2. Uses `prototype-workspace` / `audit-prototype`
3. Does not load Code Connect serializer rules
4. Does not invent Button variants
5. Is not spawned as a swarm

V1 is done when that loop produces useful evidence. The later factory waits on that evidence; it does not replace it.

### Later (production factory)

The same contracts and auditor remain. What changes is authorship:

1. The factory generates or repairs prototype UI against DS contracts
2. `ds-audit` is a gate on factory output, not the only factory behaviour
3. Factory assets can update without a visual kit release
4. Prototypes still need almost no custom agent configuration

The design system still owns correctness. The factory never becomes a second design system.

---

## 21. Cited work: three contract models, not one

Friedman’s roundup stacks Vallaure, Curtis Specs, and Pandya as the same move. The primary sources are **three ownership models**. This proposal is a **fourth**, on purpose.

| Model | Canonical artefact | Figma | Code | Fit here |
|---|---|---|---|---|
| **Southleft / Vallaure** | Third JSON/YAML file; both surfaces are printouts | Generated + three-way differ | Generated | Steal refuse-by-name, deterministic judge, “report GAP don’t fake.” Do **not** generate the kit from contracts in V1. Shipable truth is hand-written DS source. Their playground is not a complete v1 (`docs/CURRENT.md`, 2026-09-16). |
| **Curtis Specs** | Neutral YAML; **Figma is usually the extract input** | Input (and optional generate) | Scaffolded from spec | Steal compact schema ideas (anatomy, default + deltas, invalid combos) and **examples beside contracts**. Do **not** extract Button variants from Figma: the registry already disagrees with `Button.tsx`. Later: Specs as a Figma drift detector against DS-owned contracts. |
| **Pandya** | Markdown specs + closed `tokens.css` + CSS grep in CI | Not in the loop | App owns visual CSS | Steal “Definition of Done is a command” and session-start lookup. Do **not** put a token CSS layer inside prototypes; they consume kit `--ad-*` and Mantine system props. Markdown is guidance (`DESIGN.md`); it is not `enforcement.deterministic`. |
| **This proposal** | DS component source (wrappers **and** AppDirect complex components such as `PageContentHeader`) | Code Connect subset, not parent | Hand-written; published as the kit | Contracts are tested against that source. Factory consumes them. V1 checks; later factory authors pages, not the DS. |

**JSON vs markdown is a fork.** Vallaure: a contract must *match*; markdown must be *understood*. Understanding varies. `DESIGN.md` stays human. Contract JSON is the matchable artefact.

**Steal at the right layer**

- Pitre: lookups are not judgments; authority is the layer that can refuse. AI authors a spec once; machinery enforces it.
- Southleft judge: illegal props, raw hex, style overrides, unknown tokens — no LLM. When the catalog has a real hole, **comment GAP** and widen the contract; do not invent `TableHeaderCell`.
- Curtis Examples as Data: a pricing card is not a Button variant. `PageContentHeader` + list/detail recipes are **patterns beside** contracts, which is why `PageContentHeader` is a complex-component contract, not `extends MantineX`.
- Harness Engineering (coding-agent course, not a DS): five subsystems (instructions, state, verification, scope, session). Maker ≠ checker. `/goal` without an independent `ds-audit` scales ungoverned generation. Campbell’s six UX layers are product-AI fluency, not kit packaging.

**The V1 risk is not “we lack Friedman’s stack.”** It is too many unlabeled sources of truth (component source, `types.ts`, registry, `DESIGN.md`, stale 4px lookup, leftover `components/cbp/`). A contract file written on top of those contradictions would freeze them. A later factory would generate them at fleet scale.
