# Vendored token CSS

Snapshot of `@appdirect/design-tokens` `foundations.css` and `mantine.css`.

Copied into the kit tarball so prototype consumers do **not** need Artifactory. The kit `package.json` records this pin as `tokensSnapshot`. Refresh after a tokens bump:

```bash
cp node_modules/@appdirect/design-tokens/dist/css/foundations.css ds-package/vendor/css/
cp node_modules/@appdirect/design-tokens/dist/css/mantine.css ds-package/vendor/css/
```
