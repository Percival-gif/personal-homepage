# PERCIVAL — Personal archive

极繁主义、地下漫画与涂鸦走廊个人主页。技术栈为 Vite 5、React 18、严格 TypeScript、Tailwind CSS 3、GSAP 3 与 CSS 3D；HashRouter 支持 GitHub Pages 静态托管。

当前正在分阶段实现。`REQUIREMENTS.md` 是需求原文，`CONTRACT.md` 是协作契约；实际验收结果以最终 QA 报告为准。本地基线构建通过不代表完整功能已验收，当前尚未部署到远端。

## 本地运行

需要 Node.js 20 或更新版本、npm。

```bash
npm ci
npm run dev
```

使用终端打印的本地地址。生产构建与预览：

```bash
npm run build
npm run preview
```

需要在终端或执行会话结束后继续预览时，使用独立后台服务：

```bash
npm run preview:start
npm run preview:status
npm run preview:stop
```

`preview:start` 先构建最新源码，再启动固定在 4175 端口的后台预览；重复启动会复用本项目现有服务。打开 `http://127.0.0.1:4175/#/corridor` 或 `http://localhost:4175/#/corridor`，两种地址均支持。服务只监听本机 IPv4/IPv6 回环地址，不随启动命令退出；日志和进程状态保存在 `.preview-local/`。更新源码后重新执行 `preview:start` 并刷新页面。重启电脑后需再次启动。

若受限执行环境提示不能终止后台进程，请在本机普通终端执行 `npm run preview:stop`；此时运行中的页面仍可访问。

验证命令：

```bash
npx tsc --noEmit
npm test
npm run test:e2e
```

单元测试位于 src/lib/diary；端到端测试位于 qa/e2e，先构建再执行。Playwright 需要安装 Chromium：npx playwright install chromium。npm run audit 运行移动端 Lighthouse 并按 85/95/95 阈值判断。浏览器进程若受执行沙箱限制，请使用支持浏览器的执行环境或 GitHub 验证工作流；不要将未运行的检查视为通过。

## 路由

| Hash 路径 | 页面 |
| --- | --- |
| `#/` | 起始页 |
| `#/corridor` | 走廊 |
| `#/about` | 我是谁 |
| `#/work` | 我做过什么 |
| `#/now` | 我现在在做什么 |
| `#/diary` | 我今天想说什么？ |

## 内容和隐私

所有履历事实集中在 `src/data/profile.ts`，页面读取这份数据；修改内容时先改数据层。`CONTENT_NOTES.md` 记录原始数据中的时间线、统计口径等问题。曼彻斯特学历已由本人确认为“在读博士”。

`showExactBirthDate` 和 `showDistrict` 控制日期与位置展示精度；当前按审核稿默认关闭，分别仅展示出生年份和城市。原始资料没有区级地址，不补充虚构地址。不要加入未经本人确认的联系方式、成果链接或照片。

2026-10-24 已按本人审核结果填充个人介绍、研究说明、Estrella 项目细节及工程职责。电池团队成果奖项更正为“国家技术发明奖”；Estrella 的“陈嘉庚青年科学奖”及“CCF-ACM Award fre AI（CCF青年科技奖）”均标为“提名”，未补写提名日期或奖项等级。详细来源与审核覆盖关系见 `CONTENT_NOTES.md`。

## GitHub Pages 部署

目标为既有仓库 `Percival-gif/personal-homepage`。请在完整验收后再将本实现整合进目标仓库；本地工作不会自动推送或覆盖旧站。

1. 在目标仓库 Settings → Pages 中选择 **GitHub Actions** 作为构建来源。
2. 确保 `package-lock.json` 与源码一并提交。
3. 完成验收后，在 Actions 中手动运行 **Deploy GitHub Pages** 工作流。一次成功部署会替换当前 Pages 网站。
4. 如需 master/main 分支推送后自动部署，在仓库 Settings → Secrets and variables → Actions → Variables 添加 `PAGES_DEPLOY_ENABLED=true`。默认不启用推送部署；删除变量或设为 `false` 即关闭。

工作流使用 Node 20，读取 `configure-pages` 的 `base_path` 作为 `BASE_PATH`，构建并发布 `dist`。`.nojekyll` 随构建复制，生成的 `404.html` 会回到正确子路径的 `#/`。手动部署不受自动部署变量限制。

模拟仓库子路径构建：

```bash
BASE_PATH=/personal-homepage/ npm run build
npm run preview
```

打开预览服务下的 `/personal-homepage/#/`。普通根路径构建省略 `BASE_PATH`；不要手写绝对 `/assets/` 资源地址，使用 import 或 `import.meta.env.BASE_URL`。

## 日记数据与备份

日记在浏览器本地 IndexedDB 的 `after-you-diary` 数据库保存，`entries` 存条目、`meta` 存设置；正文不写入 localStorage，也不发送到服务器。每个浏览器使用者都有各自的数据，本功能没有登录或站点所有者身份验证。

可导出单篇 Markdown，或导出全部为含 `manifest.json` 的 ZIP；导入前应显示预览，同日期冲突保留两份。换设备前先导出 ZIP，在新设备打开本站后导入。清除站点数据、更换浏览器、使用不同域名或不同设备都不会自动保留这些日记；请自行保存备份文件。私人日记不等同于加密存储，同设备浏览器或开发者工具仍可读取。

日记的存储、封存、备份与导入均有 Vitest 测试。实际浏览器验收见 QA 报告。开发服务器热更新会产生网络请求；零请求验收针对加载完成的生产预览书写会话。

第一版不实现口令锁、云同步或 GitHub token 同步；它们仅为后续扩展方向。可选口令锁必须注明“这不是加密”，不得将 UI 遮挡当作数据保护。

## 原创涂鸦素材

`src/assets/art/graffiti-atlas.webp` 为本项目生图创作的透明素材，包含神经花朵、轨道流星、独眼终端和手绘箭头四组图案。共享 `Graffiti` 组件以 CSS 分区呈现，复用同一静态文件；首屏图预先加载，其余按需加载，使用明确宽高比预留空间。所有图案只作装饰，屏幕阅读器忽略，可通过“关闭装饰”隐藏，减少动态效果时取消旋转。走廊保留简化赛博线条，日记书写区不新增素材或请求。
