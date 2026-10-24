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


## 2026-10-24 公开阅读与艺术展廊
- 完成公开随笔目录、三篇审核文案摘录、详情路由与明确来源说明。
- 门D/全站导航改为公开随笔，私人笔记本保留独立入口与原有存储。
- 完成首页大字轨道构图、走廊线框空间、三个章节展厅视觉。
- 严格TypeScript与生产构建通过；21项本地存储/备份单测通过。
- 已扩展路由、阅读和分流浏览器测试，29项待执行；本地尝试因Playwright浏览器缺失停止，不能据此宣称截图或a11y验收通过。


## 创作展厅集成
首页精选三作品、创作展厅目录与三个详情页已实现。After You为主展位，Bonnie Fridge和TransFloat为次展位。使用用户确认的概念主图，个人肖像未接入。三图压缩为JPEG并在卡片延迟加载；详情页提供真实源码链接/下一作品/回到展厅。TypeScript及生产构建通过，21项日记存储与备份单测通过；浏览器验收受既有MachPort执行环境权限影响，本轮没有宣称通过。
