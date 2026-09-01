# Project Commands

This repo includes project-local Cursor slash commands.

## Prototyping

### `/start-prototype`

Self-serve: create **your own** GitHub repo from `ad-dc/appdirect-prototype-template`. For designers, engineers, and PMs. Follows `.cursor/skills/start-prototype/SKILL.md`.

### `/publish-prototype-template`

Maintainer: refresh the shared GitHub template so self-serve clones stay current. Follows `.cursor/skills/publish-prototype-template/SKILL.md`.

### `/create-prototype`

Optional local scaffold from this checkout. Prefer `/start-prototype`.

## Figma Code Connect

### `/code-connect-props`

Use this first when you want to decide the correct `Mantine Core -> DS -> Figma` prop contract before editing anything.

What it does:
- inspects the selected Figma component
- compares Mantine Core, the local DS wrapper, and the current Figma mapping
- recommends which props to keep, remove, rename, or treat as DS exceptions
- recommends the correct Figma binding type such as `figma.slot(...)`, `figma.instance(...)`, `figma.enum(...)`, or `figma.boolean(...)`

### `/code-connect-sync`

Use this after the contract is clear and you want the code side updated.

What it does:
- re-checks the selected Figma component
- updates the relevant `*.figma.tsx` mapping
- updates `components/DesignSystem/FIGMA_PROPS_REGISTRY.md`
- lints touched files
- publishes with the explicit `FIGMA_ACCESS_TOKEN` workaround

### `/code-connect-pr`

Use this after the mapping work is done and published.

What it does:
- reviews the current git state
- creates a focused branch if needed
- commits only the relevant Code Connect changes
- pushes the branch
- opens a GitHub pull request with a short summary and test plan

## Recommended flow

1. Run `/code-connect-props` to decide the correct contract.
2. Run `/code-connect-sync` to update and publish the mapping.
3. Run `/code-connect-pr` when you want the work packaged into a PR.
