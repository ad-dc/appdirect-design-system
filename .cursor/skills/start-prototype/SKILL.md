---
name: start-prototype
description: >-
  Starts a self-serve AppDirect prototype GitHub repo from
  ad-dc/appdirect-prototype-template (Use this template / gh repo create --template).
  Use when a designer, engineer, or PM wants a new prototype workspace without
  write access to appdirect-design-system. Triggers: start prototype, new prototype
  repo, use the prototype template, gh repo create --template.
---

# Start a prototype (self-serve)

Anyone with GitHub access can create their own repo. Do **not** wait for a maintainer, and do **not** fork `appdirect-design-system`.

Default: create the repo under the **signed-in GitHub user**, private. Put it in `ad-dc/` only if they asked and they can create org repos.

## Steps

1. Confirm `gh auth status` works.
2. Pick a slug (`proto-checkout`, `proto-jane-doe`, or a product name). Ask if missing.
3. Create from the template:

```bash
gh repo create SLUG --template ad-dc/appdirect-prototype-template --private --clone
```

To place it in the org (optional):

```bash
gh repo create ad-dc/SLUG --template ad-dc/appdirect-prototype-template --private --clone
```

4. `cd` into the clone, `npm install`, `npm run dev`.
5. The kit tarball installs from GitHub Releases on `ad-dc/appdirect-design-system`. Token CSS is inside that tarball. No Artifactory or VPN.

If `--template ad-dc/appdirect-prototype-template` 404s, the shared template is not published yet. Tell them a maintainer must run `npm run publish-prototype-template` in `appdirect-design-system`. Do not copy `components/DesignSystem/` as a workaround.

## Afterward

Daily work uses `/prototype-workspace` in the new repo. Shared UI: `@appdirect/ds-prototype-kit`. Product widgets: `components/cbp/`. Kit updates: bump the tarball URL.

## Do not

- Do not fork or "Use this template" on `appdirect-design-system`
- Do not grant write on the design-system repo
- Do not cherry-pick DS commits into the prototype
