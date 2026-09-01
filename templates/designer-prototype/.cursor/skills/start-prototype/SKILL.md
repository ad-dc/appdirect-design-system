---
name: start-prototype
description: >-
  Starts a self-serve AppDirect prototype GitHub repo from
  ad-dc/appdirect-prototype-template. Use when a designer, engineer, or PM wants
  a new prototype workspace without write access to appdirect-design-system.
---

# Start a prototype (self-serve)

Anyone with GitHub access can create their own repo. Do not fork `appdirect-design-system`.

Default: private repo under the signed-in GitHub user.

```bash
gh repo create SLUG --template ad-dc/appdirect-prototype-template --private --clone
```

Then `npm install` and `npm run dev`. The kit tarball comes from GitHub Releases on `ad-dc/appdirect-design-system`. No Artifactory.
