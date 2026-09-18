---
name: audit-prototype
description: >-
  Checks an AppDirect designer prototype against the design system. Runs
  typecheck and ds-audit, explains fail vs warn, and re-audits after a kit
  bump. Use when checking DS compliance, before a PR, or when asked if the
  prototype is on the kit.
---

# Audit this prototype

No LLM. No network inside `ds-audit`. Restricted `@mantine/core` imports **fail**. Missing `PageContentHeader` and handmade record lists **warn**.

## Commands

```bash
npm run typecheck
npm run ds:audit
```

CI (`.github/workflows/ds-check.yml`) runs the same two commands. `GITHUB_ACTIONS` makes `ds-audit` emit GitHub error/warning annotations. Locally, add `--ci` to see the same lines:

```bash
npx ds-audit --ci
```

## Fail (must fix)

- Any `from '@mantine/core'` in `app/` or `components/local/`
- Typecheck errors

Fix restricted imports by switching to `@appdirect/ds-prototype-kit`. Never add `components/DesignSystem/`.

## Warn (CI stays green)

- Prototype `app/prototype/<slug>/page.tsx` without `PageContentHeader`
- Handmade record list (`Card`/`Inline` + `.map`) instead of `DataTable` or `Table`

Fix the page, or leave the warning. Do not invent a DS variant to silence it. Do not mark a gap as an approved DS change.

## After a kit bump

1. Set `@appdirect/ds-prototype-kit` in `package.json` to the new GitHub Release `.tgz` URL
2. `npm install`
3. `npm run fill-manifest-versions` (do not hand-edit `versions`)
4. Re-run typecheck + `ds-audit`

Releases: https://github.com/ad-dc/appdirect-design-system/releases
