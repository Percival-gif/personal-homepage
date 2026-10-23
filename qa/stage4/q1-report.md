# Q1 · Build, accessibility and behavioral review

Review scope: source and test review only. The orchestrator owns browser QA and is running the final build/unit tests. This report does not claim browser, Lighthouse, or visual acceptance.

## Findings

1. **Backup restore limit mismatch — recovery risk.** `src/lib/export/backup.ts` exports any valid collection, but `previewImport` rejects ZIPs above 16 MiB expanded / 8 MiB compressed. The store allows 5,000 entries, each up to 1,048,576 characters. Reproduced without browser via Vite SSR module loading: seven valid entries containing 800,000 Chinese characters each exported to an 18,174-byte ZIP; importing the same ZIP failed with `备份解压后过大。`. Export should guarantee that its result satisfies import limits, or clearly provide a recoverable split export. At minimum it must reject before downloading an unusable “all entries” backup and guide the user to individual MD export.

2. **ZIP roundtrip E2E loses the file extension — test defect.** `qa/e2e/diary.spec.ts` uploads `download.path()` directly. Playwright's downloaded temporary path has a UUID basename; `previewImport` dispatches on the uploaded filename's `.zip` extension. Upload an explicit payload with `name: download.suggestedFilename()`, `mimeType: application/zip`, and downloaded bytes, or save to a `.zip` filename. Both uploads in the test need the same correction.

## Test coverage gaps

- Route screenshot/Axe tests enter Diary's first-visit disclosure, so they do not establish the editor/calendar/list layouts or their accessibility at 390/768/1440. Capture and analyze the acknowledged, writing editor too.
- The keyboard test focuses a door programmatically. It verifies the two-Enter behavior but does not establish actual Tab order or Landing's skip control.
- `pageerror` captures uncaught JS exceptions, not `console.error`; a zero-console-error claim needs a separate console listener.
- The ten-minute close/reopen durability requirement is not covered by the current automated suite. A separate timed browser observation is required.
- Existing UI ZIP test checks body and sealed state, while complete metadata fidelity is covered at the storage layer. Add mood/weather/tags to UI roundtrip if claiming end-to-end fidelity for those controls.
- Reduced-motion route captures set the preference, but there is no assertion that opened doors remove rotation. Source contains an explicit opacity-only rule for opened doors, Landing avoids GSAP movement, and Now disables its ticker under reduced motion.

## Source checks that passed

- Diary body uses native IndexedDB; no localStorage body, network API, analytics, external font URL, or cookie access found in source/public application code.
- IndexedDB mutations read and write in a single readwrite transaction; mutation errors abort before a partial replacement can commit.
- Sealed entries reject store edits/deletes, UI metadata and body controls are disabled, and unsealing requires a native modal confirmation.
- Import preview does not mutate data; conflict imports retain both; undo restoration keeps metadata and preserves an entry that reused the original ID.
- Markdown preview renders React text nodes and supports headings, quotes, lists, and bold without dangerous HTML.
- Diary save status uses polite live announcements without body content; radio controls have accessible enclosing labels; modal Escape stops the global route handler.
- CSS provides safe-area padding, selectable textarea text, and a mobile editor-first layout. Actual keyboard/safe-area behavior remains a browser check.
- One h1 exists per page in source; decorative SVG and shared decoration primitives are hidden from assistive technology.

The two findings were sent to the orchestrator for resolution. No implementation files were changed by Q1.
