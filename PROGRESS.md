# PERCIVAL implementation checkpoint

## Current status
All six routes are implemented. Stage 3 Work, Now and Diary are complete. Stage 4 read-only reviews are in qa/stage4/. The backup size mismatch and E2E upload filename defect found in review have been corrected.

## Verified
- Strict TypeScript and production build pass; 21 storage/IndexedDB/backup tests pass.
- Work and Now at 390/768/1440: no horizontal overflow; WCAG A/AA automated scans report no violations.
- Supported in-app browser verified Diary refresh persistence, offline editing/saving/ZIP export and zero settled-session requests.
- Diary ZIP restore preserves body, date, weather, mood, tags and sealed state; canceling import/unseal has no effect; sealed fields and deletion are disabled.
- Independent /personal-homepage/ build: 26 local resources returned HTTP 200; two self-hosted font subsets.
- Corridor uses simplified cyber linework, with perspective default at >=640px and explicit corridor/list switch. Below640px defaults to list. This follows the user's visual correction.

## Still being verified
- Full six-route screenshot/accessibility refresh, Diary editor mobile layout and real Tab sequence.
- Diary close/reopen after ten minutes.
- Browser-capable GitHub CI E2E and Lighthouse. Local standalone Chrome is blocked by execution permissions; use the supported in-app browser for local QA.
- Actual Pages deployment and user visual acceptance. Existing online site remains unchanged until integration and acceptance.

## Preview
Production preview: http://localhost:4175/#/corridor. Rebuild with npm run build then reload the tab to load the latest asset graph. Older dev preview ports may cache earlier modules.
