---
name: create-prototype
description: >-
  Optional local copy of templates/designer-prototype from an appdirect-design-system
  checkout (npm run create-prototype). Prefer /start-prototype or GitHub
  "Use this template" on ad-dc/appdirect-prototype-template for self-serve.
  Use when the user explicitly wants a local scaffold from this repo without
  the GitHub template.
---

# Local prototype scaffold (optional)

Self-serve default is **`/start-prototype`**: `gh repo create SLUG --template ad-dc/appdirect-prototype-template`.

Use this path only from an `appdirect-design-system` checkout when the user wants a local folder without the GitHub template (or the template repo is not published yet).

```bash
npm run create-prototype -- --name proto-jane-doe --dry-run
npm run create-prototype -- --name proto-jane-doe
```

Do not grant write on `appdirect-design-system`. Do not copy `components/DesignSystem/`.
