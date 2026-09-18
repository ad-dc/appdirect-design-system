---
name: audit-prototype
description: >-
  Checks in-tree AppDirect prototype pages (app/prototype) against the design
  system. Runs ds-audit, explains fail vs warn. Use when checking DS compliance
  of prototype pages in this repo, or before a prototype-related PR.
---

# Audit in-tree prototypes

This repo is `appdirect-design-system`, not a thin prototype clone. Pages live under `app/prototype/` and import from `@/components/DesignSystem`.

```bash
npm run ds:audit
```

Optional, needs a working install (Artifactory/VPN):

```bash
npm run typecheck
```

Restricted `@mantine/core` imports in `app/` or `components/local/` **fail**. Missing `PageContentHeader` and handmade record lists **warn**. `components/DesignSystem/` is skipped (it is the source, not a consumer).

Fix restricted imports with `@/components/DesignSystem`. Do not invent DS variants to silence a warning.

Designer clones use `/audit-prototype` from the template (kit imports + GitHub Action). Kit bump lives in `/prototype-workspace` there.
