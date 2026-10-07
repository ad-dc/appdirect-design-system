---
name: publish-prototype-template
description: >-
  Publishes templates/designer-prototype to ad-dc/appdirect-prototype-template as a
  GitHub template, with the latest @appdirect/ds-prototype-kit tarball URL baked in.
  Use when the user asks to publish, refresh, or sync the shared prototype template
  so designers/engineers/PMs can self-serve.
---

# Publish the shared prototype template

Run from the **appdirect-design-system** checkout. This is maintainer work. It does not create per-person repos.

## Steps

1. Confirm this repo is `appdirect-design-system`.
2. Dry-run:

```bash
npm run publish-prototype-template -- --dry-run
```

3. If the kit URL looks right, run without `--dry-run`. That creates or updates `ad-dc/appdirect-prototype-template`, bakes `prototype-manifest.json` `versions` from the kit pin, sets `is_template=true` on the thin template, and sets `is_template=false` on `ad-dc/appdirect-design-system` (so “Use this template” does not appear on the DS source repo).
4. Report the template URL and the consumer paths:

```bash
# UI
open https://github.com/ad-dc/appdirect-prototype-template/generate

# CLI
gh repo create my-prototype --template ad-dc/appdirect-prototype-template --private --clone
```

Re-run after changing `templates/designer-prototype/` or cutting a new kit release so self-serve clones get the current pin.
