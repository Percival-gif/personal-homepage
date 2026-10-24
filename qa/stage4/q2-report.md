# Q2 performance and deployment review

Read-only implementation review. No product source files changed. Browser and Lighthouse execution remain with the orchestrator/CI; no Lighthouse scores are claimed here.

## Result

No blocking asset-path or deployment configuration defect found. The JavaScript budget and two-font limit pass. Actual Pages deployment and browser-recorded diary network traffic still require their separate runtime checks.

## Verified

- `BASE_PATH=/personal-homepage/ npx vite build --outDir /tmp/percival-subpath-qa` succeeded (59 modules, Vite 5.4.21).
- Built HTML references the repository prefix for the entry JavaScript, CSS, favicon, and Apple icon. Landing logo uses `import.meta.env.BASE_URL`; CSS font references resolve to generated local assets.
- Served the independent output through a temporary loopback HTTP server, fetched the entry document, then checked its linked resources, all 20 asset files, `404.html`, and `.nojekyll`: **26 resource checks, all HTTP 200**. Some linked assets were checked twice. This verifies generated static paths, not GitHub's deployment service.
- Generated `404.html` contains `const base = "/personal-homepage/"` and returns to that base with `#/`.
- All JavaScript chunks together total **118,872 bytes gzip**, measured with Python gzip `mtime=0`; therefore even the conservative all-chunks total is below the 300 KB initial-JavaScript budget. Entry chunk alone is about 55 KB gzip. Route modules load dynamically.
- Exactly two WOFF2 files exist: Anton Latin 18,612 bytes and Smiley Sans subset 114,224 bytes (**132,836 bytes combined**). Both `@font-face` rules use weight 400 and local URLs. Body and diary use system font fallbacks.
- `fflate` is a separate dynamic chunk, not imported by Landing. The only diary codec loading is `preloadBackup()`, completed before `data-diary-ready=true`.
- Static application source contains no `fetch`, XHR, WebSocket, beacon, analytics SDK, remote font URL, or remote image URL. Diary operations use native IndexedDB and local Blob downloads. Static inspection supports the zero-network design; the settled-session Network recording remains necessary evidence.
- Deploy workflow listens to both `master` and `main`, injects `configure-pages`'s base path into the build, uploads `dist`, and uses `deploy-pages`. Automatic deployment is deliberately opt-in through `PAGES_DEPLOY_ENABLED`; a manual run is explicit deployment.
- Verification workflow runs clean install, browser dependency installation, build, unit tests, Playwright, and Lighthouse on pull requests/manual invocation, then uploads QA artifacts even on failure.

## Findings and remaining evidence

1. **Budget interpretation:** fflate's generated namespace chunk is **31,741 bytes raw / 12,100 bytes gzip** with the current gzip measurement. It meets a 20 KB transfer budget but exceeds 20 KB if that phrase means uncompressed source. A tiny local bridge exporting only `zipSync` and `unzipSync`, dynamically imported instead of the entire namespace, may reduce the raw chunk through tree shaking. Report both values rather than silently choosing a definition.
2. **Optional cleanup:** the dev-only KitchenSink route is disabled in production, but the top-level `lazy()` call still produces an unused approximately 1.1 KB raw chunk. It does not load during the production entry route and is not a budget blocker.
3. **Lighthouse:** not run by this agent. Require actual CI/mobile results for Performance ≥85, Accessibility ≥95, Best Practices ≥95.
4. **Deployment:** configuration and subpath resources pass; a successful GitHub Pages Actions run remains unverified here. The opt-in protects the existing site until integration is reviewed.
5. **Diary runtime:** require root browser evidence for offline save/export and zero settled-session requests. Static code alone cannot establish these runtime criteria.

## Scope notes

The subpath build uses an independent `/tmp` output and does not replace the active preview's `dist`. No browser was launched and no repository, PR, or deployed site was changed by this review.
