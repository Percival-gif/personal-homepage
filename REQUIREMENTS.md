# 当前修订：2026-10-24

用户已批准两项改进，以下修订优先于本文历史路由和第四门定义：
1. 公开随笔与私人笔记本分开：门 D → `#/notes`，阅读页 `#/notes/:slug`；原 `#/diary` 保留为浏览器本地私人笔记本，数据库和备份兼容。
2. 艺术升级采用实验性艺术杂志 × 赛博线稿展廊：首页大字标与轨道、走廊空间符号、About档案/Work实验图版/Now工程现场/Notes阅读室。保留两字体、原创涂鸦、reduced-motion和装饰开关。
3. 公开阅读区首批采用既有已审核文案专题摘录，不虚构个人文章、日期、图片或履历事实。
4. 发布目标为现有 owner-only Sites 验收站，保持受众；旧公开 GitHub Pages 不变。

---

# PERCIVAL 个人主页 —— 多 Agent 构建 Prompt (v1.1)

> 用途：直接粘贴到 Claude Code（仓库根目录）或 Workflow 脚本上下文。
> v1.1 变更：第 4 扇门从「彩蛋」改为「可书写的私人日记」，新增本地存储、
> 导出/导入、封存与零网络请求验收；新增 Agent V；DoD 增补 5 条。
> 需求原文见 [[prompt/个人主页.md]]。

---

# 项目：PERCIVAL 个人主页 —— 极繁主义 × 漫画 × 涂鸦走廊

## 你的角色
你是本项目的**主控编排 Agent（Orchestrator）**。你负责契约、拆分、集成、验收，
不把整个工程丢给单个子 Agent。你需要按「多 Agent 编排」一节派发并行子 Agent，
并为每个子 Agent 明确文件所有权，避免并发写同一文件。

## 交付标准（Definition of Done）
1. `npm ci && npm run build` 通过；`npx tsc --noEmit` 零错误；无 console error。
2. 六个页面路由可直接访问、可刷新、浏览器前进后退正常：
   `#/`（起始页）、`#/corridor`（涂鸦走廊）、`#/about`（我是谁）、
   `#/work`（我做过什么）、`#/now`（我现在在做什么）、`#/diary`（私人日记）。
3. 起始页 logo + "Welcome" 依次淡入；走廊可交互；4 扇近门悬停/聚焦自动打开，
   点击带过场进入对应页面；4 扇远门为装饰性不可交互。
4. 390px / 768px / 1440px 三档截图验收通过，无横向滚动、无遮挡。
5. `prefers-reduced-motion: reduce` 下所有位移/缩放退化为交叉淡入，功能不缺失。
6. 键盘可完整通关：Tab 到门 → Enter 打开 → Enter 进入；Skip 起始动画；Esc 返回走廊。
7. Lighthouse（移动端模拟）：Performance ≥ 85，Accessibility ≥ 95，
   Best Practices ≥ 95。首屏 JS（gzip）≤ 300KB，总字体 ≤ 2 个字重子集。
8. GitHub Actions 部署到 GitHub Pages 成功，子路径下资源不 404。
9. 日记：写入后刷新页面内容仍在；关掉标签页 10 分钟后重开仍在。
10. 日记导出 `.zip` 后清空本地数据，再导入，条目数、日期、心情、标签、封存状态完全一致。
11. 日记书写会话内 Network 面板请求数为 0；无任何 analytics / 埋点 / 字体 CDN 请求。
12. 封存条目不可编辑（尝试编辑时按钮禁用且有说明），解除封存需二次确认。
13. 移动端 390px 下正文输入不被底部安全区遮挡，长按可选中文本。

## 技术栈（已确定，不要更换，除非遇到硬性阻塞并先说明原因）
- Vite 5 + React 18 + TypeScript（strict）+ Tailwind CSS 3
- 动画：GSAP 3（时间线）+ CSS transform；**不引入 Three.js / R3F**，
  走廊用 CSS 3D（perspective + translateZ + rotateY）实现，保证体积与可访问性
- 路由：`react-router-dom` 的 **HashRouter**（GitHub Pages 无服务端重写，避免刷新 404）
- 日记存储：**IndexedDB**（原生 API 或 `idb` 轻量封装），不使用 localStorage 存正文
- 压缩/解压：`fflate`（体积小于 jszip，按需动态 import，不进首屏）
- 无后端、无数据库、无追踪脚本、无第三方 CDN（字体自托管并做子集化）
- 图标/装饰优先内联 SVG，纹理用 SVG pattern / CSS gradient，不用大图

## 事实来源（唯一允许的内容）
所有文案只能来自下方数据。**禁止编造**任何论文名、奖项、公司、时间、联系方式、
头像照片、推荐语、日记内容。允许做排版重述与英文标签，不得新增事实。
把以下内容落到 `src/data/profile.ts`，用 TypeScript 类型约束，组件只读数据、不硬编码文案。

```ts
// 姓名 Percival｜男｜中国｜2000.09.10｜现居 中国广东省广州市
// 语言：中文（母语）、雅思 7.5、剑桥商务英语 BEC 高级
// 学历：
//   2018.09–2022.06 四川大学 能源与动力工程 本科
//   2022.09–2025.06 四川大学 智能科学与技术 硕士
//   2025.06–至今   曼彻斯特大学 MSc Artificial Intelligence（原文写作"在读博士"）
// 课题方向：NLP 与大语言模型；研究可处理不确定性的机器学习模型，
//   应用于天文、工程生物、材料科学；以及 LLM 偏见、多模态 LLM 内容生成、
//   LLM 用于心理健康 / ESG 分析。
// 学术成果：SCI 一作 3 篇，Science 一作 2 篇，含非一作累计发表 17 篇相关论文。
//   参与曼彻斯特大学 Intelligence 实验室首个金融量化分析模型 Estrella 的研发与落地，
//   负责模型预训练与权重效果分析；带领子团队完成"模型权重思维链偏移"与
//   "自循环下沉漩涡"子课题，并在 Estrella 中落地。
// 工作经历：2023.04–2024.03 华为终端电池技术开发部，消费电子电池预研与开发；
//   项目后期带领团队与巨鲸电池平台团队合作研发终端 BG 开发，负责鸿蒙智行汽车动力电池系统；
//   2024.01 获华为年度开发者称号；2024.07 团队成果"纳米拟态锂离子交换式电池"
//   获 2024 年国家一级科研奖。
// 目前工作：
//   2024.05–2026.06 杭州深度求索（DeepSeek）基座模型开发部 Toast 开发组组长，
//     负责 LLM 预训练、权重效果分析、LangChain LCEL 构建。
//   2026.06–至今 杭州深度求索（DeepSeek）基座模型开发部 华南地区广州负责人，
//     负责模型网页端生态、dsh（harness）生态优化与区域本地部署 FDE 工程师。
// 个人技能（四条，原文逐条保留，不得改写成百分比或虚构评级）：
//   1 数学与理论：能从第一性原理推导 Transformer/注意力机制、扩散模型、
//     RLHF 目标函数；能指出顶会论文的理论假设漏洞并提出修正；线代/概率/优化
//     可直接用于新模型设计。
//   2 工程与实验：能独立从零实现并训练中等规模模型（如 1B 级 LLM 或 ViT），
//     含数据管线、分布式训练、混合精度、故障恢复；能设计严谨的消融/显著性实验
//     且结果可复现；有 SFT/RLHF/DPO 或大规模微调调参经验，能定位 loss 异常与训练不稳定。
//   3 学术产出与表达：以第一作者在 NeurIPS/ICML 发表 8 篇论文及项目。
//   4 细分方向专长：RL 方向端到端主导经验（问题定义→方案→实验→落地/开源）；
//     能预判该方向 6–12 个月技术走向并有初步验证；有可复现的开源或实习成果。
```

**内容冲突处理**：以下 5 处只记录、不修改、不圆场，写入 `CONTENT_NOTES.md`
并在最终报告中列出，等用户拍板：
- 曼彻斯特项目为 MSc（硕士），原文写"在读博士"。
- 2024.05–2026.06 任职 DeepSeek 与 2025.06 起在曼彻斯特就读、2026.06 调任广州存在时间重叠。
- 华为 2023.04–2024.03 与硕士在读期间重叠。
- "SCI 一作 3 + Science 一作 2 + 累计 17"与"NeurIPS/ICML 一作 8 篇"统计口径不一致。
- 出生日期与具体住址属敏感信息，数据层提供 `showExactBirthDate` / `showDistrict`
  两个布尔开关（默认 `true`），一键降级为"仅年月 / 仅城市"。

## 信息架构
| 路由 | 页面 | 入口 |
|---|---|---|
| `#/` | 起始页：logo + Welcome 淡入 | 首访 |
| `#/corridor` | 涂鸦走廊（4 近门 + 4 远门） | 起始页点击/按键 |
| `#/about` | 我是谁 | 门 A |
| `#/work` | 我做过什么 | 门 B |
| `#/now` | 我现在在做什么 | 门 C |
| `#/diary` | 我今天想说什么？（私人日记） | 门 D |

**第 4 扇门决策**（原文只给 3 句文案）：门 D 文案为「我今天想说什么？」。
进入后是**日记页**，而非内容展示页。它是全站唯一的"输入型"页面，
其余页面只读，这一对比本身就是设计的一部分：前三次开门是在读别人的档案，
最后一次开门是在写自己的。

## 视觉系统
**基调**：极繁主义 + 美式地下漫画 + 街头涂鸦。不是"堆满"，是"高密度但可读"。

色板（5 主色 + 2 点缀，禁止再加）：
`--ink #0A0A0C`、`--paper #F3EDDF`、`--acid #E8FF3A`、
`--blue #2B4CFF`、`--magenta #FF2E86`、点缀 `--amber #FFB020`、`--teal #00C2A8`。

漫画语法（必须统一，不能每页各写一套）：
- 描边：3px / 5px 纯 `--ink` 硬边，圆角一律 0（个别贴纸可用 2px）
- 阴影：纯色硬投影 `8px 8px 0 var(--ink)`，**禁止模糊阴影**
- 半调网点：SVG pattern，仅铺在留白与色块边缘；正文下方必须是 `--paper` 或深色纯块
- 贴纸层：轻微旋转 -3°~3°、胶带、订书钉、手写批注、爆炸星、速度线
- 文字：中文标题用得意黑（Smiley Sans，开源）子集；英文标题用压缩无衬线
  （Archivo Black / Anton 二选一，自托管）；正文用思源黑体子集
- 字号阶梯：`clamp(56px,10vw,180px)` / 40 / 28 / 18 / 14，行高 1.1–1.7

**防杂乱硬规则（每页必须遵守）**：
1. 每屏只有一个主焦点（最大字号 + 最饱和色），其余元素降一级。
2. 同屏撞色上限 3 种；主色占 ~60%，冲突色只做 ≤2 处点缀。
3. 每两个高密度区块之间必须有 ≥96px 的"呼吸区"纯空白。
4. 装饰元素全部 `aria-hidden` 且可全局关闭（`data-decor="off"`）。
5. 任何文字不得压在网点或纹理上。

## 页面规格

### 1. `#/` 起始页
- 全屏 `--ink` 底 + 纸屑/网点噪点。居中 logo（子 Agent 出 3 案择一：
  A 手写涂鸦字标；B 破坏性印刷错位字标 + 爆炸星；C 印章式徽章）。
  交付 SVG 字标 + favicon(32/180) + 单色版。
- 下方 `Welcome` 逐字母/逐词淡入，再出现 `PRESS ANY KEY TO ENTER` 闪烁提示。
- 时序：logo 0.0s→0.8s；Welcome 0.6s→1.4s；提示 1.6s；总时长 ≤2.2s，可点击/按键跳过。
- 进入：走廊镜头推进（scale + translateZ），1.2s `power3.inOut` 过场到 `#/corridor`。

### 2. `#/corridor` 涂鸦走廊（全站招牌，优先级最高）
- CSS 3D：`perspective: 1200px`，地面/天花板/两侧墙用透视渐变 + 涂鸦 SVG 叠层，
  消失点居中；8 扇门沿两侧纵深排列，越远越小、越暗、对比越低。
- 近端 4 扇（左 A、右 B、左 C、右 D）= 可交互；远端 4 扇 = 装饰（编号 05–08 或涂鸦符号，
  `pointer-events:none`，`aria-hidden`）。
- 门悬停（≥1024px）：门板绕铰链 `rotateY(±70°)`，600ms `cubic-bezier(.2,.8,.2,1)`；
  门内透出该门主题色的光；贴纸式文案从门内滑出：`我是谁？` / `我做过什么？` /
  `我现在在做什么？` / `我今天想说什么？`。**Focus 状态同样开门**（键盘可达）。
- 门 D 的视觉与其他三扇区分：门缝里透出暖色台灯光，门板上贴一张空白便签——
  提示这扇门后面不是档案，是纸。
- 点击：门内主题色泛滥铺满 → 全屏色块擦除 → 路由跳转（优先 View Transitions API，
  不支持则 CSS 兜底）。
- 背景常驻元素：雨窗噪点、霓虹招牌、飘落纸片（≤20 个 DOM 节点，GPU transform）。
- 右上角常驻漫画按钮 `← 回到走廊`（在子页面显示），`Esc` 等价。
- <1024px 退化方案：走廊变为纵向可滚动的门卡片列表，保留透视倾斜、网点底纹与
  远近明暗差；每张卡片点击展开门内文案 + 「进去 →」。**不模拟 hover 开门。**

### 3. `#/about` 我是谁
- Hero：超大 `PERCIVAL` 字标 + 档案编号贴纸；四枚身份贴纸（男 / 中国 / 广州 / 2000）。
- 证件卡：基本信息，头像位置用抽象涂鸦头像或姓名首字母徽章，**不使用真人照片**。
- 语言区：三枚印章（中文母语 / IELTS 7.5 / BEC Higher）。
- 学历：纵向时间轴 3 段，每段一个漫画分镜框，色块区分本科 / 硕士 / 曼彻斯特。
- 课题方向：大段引文式排版，关键词用荧光笔高亮（NLP、LLM、不确定性、
  天文 / 工程生物 / 材料科学、偏见、多模态生成、心理健康 / ESG）。
- 微交互：卡片 hover 抬起 2px + 投影加深；贴纸轻微跟随鼠标倾斜（desktop only）。

### 4. `#/work` 我做过什么
- 左右对峙版式（移动端上下堆叠）：左「学术」/ 右「产业」，中缝虚线 + 涂鸦箭头。
- 学术：三个大数字 3 / 2 / 17（一作 SCI、一作 Science、累计），
  下方小字注明统计口径来自本人；Estrella 案例卡按"角色 → 预训练 → 权重效果分析 →
  思维链偏移 → 自循环下沉漩涡 → 落地"六格分镜呈现。
- 产业：华为 2023.04–2024.03 时间线；两枚奖励做成压印奖章（2024.01 年度开发者、
  2024.07 国家一级科研奖）。
- 禁止把论文/奖项做成可点击的假链接。

### 5. `#/now` 我现在在做什么
- 顶部状态条：`NOW · 广州 · 2026`（年份取数据，不写死）+ 跑马灯式涂鸦条。
- 两段任职以"工牌"形式并置：Toast 开发组组长（2024.05–2026.06）、
  华南地区广州负责人（2026.06–至今），职责原文照排，关键动词加粗。
- 能力墙：四条技能各一张"证据卡"，每条 bullet 前用印章式对勾，**不做进度条、
  不做雷达图、不给百分比**（原文无量化依据）。
- 结尾留一块手写体短句区（只能用已有事实，如"在广州"），不得写励志虚构文案。

### 6. `#/diary` 我今天想说什么？（私人日记）

**存储原则（不可协商）**
- 日记正文只存在浏览器本地 IndexedDB（库名 `after-you-diary`，
  对象仓库 `entries`，索引 `date`；另有 `meta` 存设置）。
- **零网络请求**：页面加载后不得发起任何 fetch/XHR/WebSocket/Cookie 上报。
  验收时打开 DevTools → Network 确认一次书写会话内请求数为 0。
- 无登录、无云同步、无分享链接、无公开列表。第一版就是"只有这台设备上的我"。
- 首次进入显示一段说明卡：日记仅保存在当前浏览器，清理站点数据或换设备会丢失，
  请定期导出备份。用户确认后才进入书写界面。

**功能清单（P0）**
1. **今日书写**：正文 textarea 全屏可写，支持纯文本 + 轻量 Markdown
   （标题 `##`、引用 `>`、列表 `-`、加粗 `**`，渲染时解析，不引入富文本编辑器）。
2. **元信息**：日期（默认今天，可补记往期）、天气贴纸（雨/晴/云/夜，纯装饰）、
   心情 1–5（印章图标，不显示数字）、标签（自由输入，回车成标签，上限 8 个）。
3. **自动保存**：停止输入 1.2s 后写入；顶部显示「已保存 · HH:mm」；`Cmd/Ctrl+S` 立即保存。
4. **封存**：点「封存今天」后该条变为只读（不可编辑、不可删除，仅可"解除封存"并二次确认），
   卡片盖上日期墨章。**不强制**，不显示"连续打卡 N 天"之类催促性指标。
5. **日历视图**：月历网格，有记录的日期显示墨点，连续记录显示烧线；点击跳转该日。
6. **列表视图**：按日期倒序卡片，显示首行摘要、心情印章、标签；关键词搜索（本地过滤）。
7. **备份**：导出单个 `.md` 或全部打包 `.zip`（含 `manifest.json`）；
   导入 `.md`/`.zip`，同日期冲突时保留两份并加 `-2` 后缀，导入前给出预览与取消。
   导出 Markdown 使用 YAML frontmatter，可直接放进 Obsidian：
   ```md
   ---
   date: 2026-10-23
   mood: 4
   weather: rain
   tags: [雨, 曼彻斯特, 想家]
   sealed: false
   ---

   正文……
   ```
8. **搜索与统计**：总条数、总字数、本月条数（仅此三项）。

**视觉与版式**
- 一张铺开的横线笔记本纸（`--paper` 底 + 细横线 SVG pattern + 左侧订口阴影），
  压在走廊的深色背景上；四周胶带、咖啡渍、撕边做旧，但**书写区域必须是纯纸面**，
  不加网点、不加撞色，保证可读性。
- 左栏窄（日期、天气、心情、标签、按钮），右栏宽（正文）。
  正文用系统无衬线或思源黑体（14px 起、行高 1.9、`max-width: 68ch`）；
  手写体（霞鹜文楷）只用于标题、日期章和装饰，**不用于正文**。
- 顶栏：`← 回到走廊`、视图切换（今日 / 日历 / 全部）、`导出`。
- 空状态：一句"今天还没有写" + 「开始写」按钮，**不得预置虚构示例日记**。
- 交互：进入页面焦点落在正文首行（桌面端）；移动端进入即全屏书写，
  底部吸附保存条，键盘弹起时不遮挡光标行。
- 删除：需二次确认，提供 5 秒撤销 toast。

**可选（P2，不阻塞交付）**
- 本地口令锁：仅在 UI 层遮挡，数据在 DevTools 里仍可读，
  **界面必须如实说明"这不是加密"**。
- 手动同步：用户自填 GitHub 细粒度 token，把导出文件提交到私有仓库。
  默认关闭，开启前必须弹出风险提示（token 存本地、同源脚本可读）。
  第一版不实现，只在 README 留扩展点。

## 响应式与可访问性
- 断点：`<640` 手机 / `640–1024` 平板 / `>1024` 桌面。
- 所有可点击元素 ≥44×44px；焦点环为 `3px solid var(--acid)` + `2px` 墨色外描边，
  在任何底色上都可见。
- 语义：每页唯一 `h1`；跳转有 `aria-live` 播报页面名；装饰一律 `aria-hidden`。
- `prefers-reduced-motion`：关闭镜头推进、门旋转、纸片飘落，仅保留 ≤200ms 淡入。
- 日记页专属：textarea 有可读 `label`；心情/天气用 `role="radiogroup"`；
  保存状态用 `aria-live="polite"` 播报，但**不播报正文内容**。

## 部署
- `vite.config.ts` 的 `base` 读取 `process.env.BASE_PATH ?? '/'`。
- GitHub Actions：`actions/checkout@v4` → `setup-node@v4`（node 20）→
  `actions/configure-pages@v4`（取其 `base_path` 输出注入 `BASE_PATH`）→
  `npm ci && npm run build` → `upload-pages-artifact` → `deploy-pages`。
- 产出目录加入 `.nojekyll`；`public/404.html` 重定向回 `#/`（HashRouter 兜底）。
- README 写清：本地运行、构建、部署开关、如何修改 `profile.ts`、
  **日记数据存在哪、怎么备份、换设备怎么办**。

## 禁止事项
- 编造学历、论文、奖项、公司、时间线、联系方式、头像、推荐语、统计数据。
- 预置任何虚构日记内容或"示例心情"。
- 把日记正文发送到任何服务器，或以任何形式出现在 URL / 页面标题 / 分享卡片中。
- 使用 `localStorage` 存日记正文（必须用 IndexedDB）。
- 在日记页加载第三方富文本编辑器或 Markdown 渲染库；正文解析自己写 ≤150 行，
  渲染前必须转义 HTML，禁止对未净化内容使用 `dangerouslySetInnerHTML`。
- 引入后端、登录、数据库、分析/追踪脚本。
- 使用第三方 CDN 字体或图床；使用有版权的商业字体。
- 用 Three.js/WebGL 重做走廊（除非现有方案被证明不可行，且先说明）。
- 在 `prefers-reduced-motion` 下仍执行大幅位移动画。
- 子 Agent 越界修改不属于自己的文件。

## 多 Agent 编排

### 阶段 0：契约（你亲自完成，不派发）
1. 初始化仓库与脚手架，提交基线 commit。
2. 写 `CONTRACT.md`：路由表、设计 token 名、`profile.ts` 与 `DiaryStore` 类型、
   文件所有权表、验收命令。
3. 建立 `src/data/profile.ts` 的类型定义与空壳（内容由子 Agent 填）。
4. 建立占位页面，保证 `npm run build` 从第一分钟就是绿的。

### 阶段 1：地基（3 个并行子 Agent）
- **Agent T（Design System）**：`src/styles/*`、`src/components/ui/*`。
  交付 token、漫画边框/硬投影/半调/贴纸/胶带/大数字/区块标题等原语，
  以及日记页需要的 `PaperSheet`、`Stamp`、`Tape`、`MoodStamp`、`TagChip` 原语，
  外加一个 `/#dev-kitchen-sink` 预览页（仅 dev 可见）。
  所有权：`src/styles/**`、`src/components/ui/**`。
- **Agent D（Content）**：`src/data/profile.ts` 填充、`CONTENT_NOTES.md`。
  所有权：`src/data/**`、`CONTENT_NOTES.md`。
- **Agent C（Infra）**：`vite.config.ts`、`tailwind.config.ts`、`.github/workflows/deploy.yml`、
  `public/404.html`、`.nojekyll`、`README.md`。所有权：根配置文件。

### 阶段 2：垂直切片（3 个并行子 Agent，依赖阶段 1 产物）
- **Agent L（Landing）**：`src/pages/Landing/*` + `public/logo.svg` + favicon。
- **Agent R（Corridor）**：`src/pages/Corridor/*` + `src/scenes/corridor/*`。
- **Agent A（About）**：`src/pages/About/*`。

切片完成即由你做一次集成验收（构建 + 三档截图 + 键盘通关），通过后再进阶段 3；
不通过则修复后重验，**不带着问题并行铺开**。

### 阶段 3：剩余页面（3 个并行子 Agent）
- **Agent W（Work）**：`src/pages/Work/*`。
- **Agent N（Now）**：`src/pages/Now/*`。
- **Agent V（Diary，最高风险项，单独排期）**：
  `src/pages/Diary/**`、`src/lib/diary/**`、`src/lib/export/**`。
  **必须先交付** `src/lib/diary/store.ts` 的接口与内存实现 + 一组单元测试
  （增删改查、冲突合并、封存不可变），通过后再接 IndexedDB 与 UI。
  接口契约（写进 `CONTRACT.md`，其他 Agent 只允许从这里读写）：
  ```ts
  export type DiaryEntry = {
    id: string; date: string; createdAt: number; updatedAt: number;
    title?: string; body: string; mood?: 1|2|3|4|5;
    weather?: 'rain'|'sun'|'cloud'|'night';
    tags: string[]; sealed: boolean;
  };
  export interface DiaryStore {
    list(opts?: { from?: string; to?: string; q?: string }): Promise<DiaryEntry[]>;
    get(id: string): Promise<DiaryEntry | undefined>;
    upsert(input: Omit<DiaryEntry,'id'|'createdAt'|'updatedAt'> & { id?: string }): Promise<DiaryEntry>;
    remove(id: string): Promise<void>;
    seal(id: string): Promise<void>;
    unseal(id: string): Promise<void>;
    exportAll(): Promise<Blob>;
    importFile(file: File): Promise<{ added: number; conflicts: number }>;
  }
  ```
  单元测试用 Vitest，覆盖：同日 upsert 覆盖、跨日新增、封存后 upsert 抛错、
  导入同日期产生 `-2` 条目、导出再导入条目数守恒。

### 阶段 4：验收（2 个并行子 Agent，只读，不提 PR）
- **Agent Q1（Build & A11y）**：`tsc --noEmit`、build、`axe-core`/Playwright 跑六路由、
  键盘 Tab 顺序验证、reduced-motion 验证、截图 390/768/1440 存 `qa/screens/`。
  日记追加：写入 → 保存 → 刷新 → 内容一致；封存后不可编辑；导出导入往返一致。
- **Agent Q2（Perf & Deploy）**：Lighthouse 移动端跑分、包体分析
  （`rollup-plugin-visualizer` 或 `du`）、字体子集检查、模拟 `base` 子路径构建并
  本地静态服务验证资源路径。日记追加：DevTools Network 录制一次书写会话，
  断言请求数 0；日记页不得引入 >20KB 的新依赖。

### 阶段 5：修复与交付（你亲自完成）
合并 QA 报告 → 逐条修复 → 重跑验收 → 输出最终报告。

### 子 Agent 派发模板（统一使用）
> 你是【Agent X / 角色】。项目背景见 `CONTRACT.md`，事实来源见 `src/data/profile.ts`。
> 你**只能**创建/修改以下文件：<白名单>。禁止改动白名单之外的任何文件。
> 依赖的 UI 原语若尚未就绪，先按 `CONTRACT.md` 的接口写 import 并留 TODO，
> 不要自行实现一份替代品。
> 必须做到：TypeScript strict 无 any、无 console 输出、移动端 390px 可用、
> 遵守"防杂乱硬规则"。
> 完成后只回报：1) 新增/修改文件；2) 对外导出接口；3) 做出的设计决策与理由；
> 4) 未完成项与风险；5) 自检命令与结果。不要粘贴大段代码。

### 文件所有权表（写进 `CONTRACT.md`）
| 路径 | 所有者 |
|---|---|
| `src/styles/**`、`src/components/ui/**` | Agent T |
| `src/data/**`、`CONTENT_NOTES.md` | Agent D |
| 根配置、`.github/**`、`public/404.html` | Agent C |
| `src/pages/Landing/**`、`public/logo.svg`、`public/favicon*` | Agent L |
| `src/pages/Corridor/**`、`src/scenes/**` | Agent R |
| `src/pages/About/**` | Agent A |
| `src/pages/Work/**` | Agent W |
| `src/pages/Now/**` | Agent N |
| `src/pages/Diary/**`、`src/lib/diary/**`、`src/lib/export/**` | Agent V |
| `src/App.tsx`、`src/main.tsx`、`src/router.tsx` | **仅 Orchestrator** |

### 冲突规则
- 同一文件禁止两个 Agent 并发写；需要共享代码时，由 Orchestrator 在阶段 0 定义接口。
- 子 Agent 报告"需要修改他人文件"时，不自行修改，改为在回报中说明，由你调度。
- 任意阶段 build 变红，立即停止后续派发，先修红。
- Agent V 的自测必须包含"断网"场景：关闭网络后仍能新建、编辑、保存、导出。

## 最终报告格式
1. 一句话结论（是否可发布）。
2. 已实现清单对照 DoD 1–13 逐条打勾。
3. 关键设计决策（logo 方案、走廊实现、第 4 扇门 = 日记）。
4. 文件树。
5. 本地运行与部署步骤。
6. 三档截图路径 + Lighthouse 分数表。
7. `CONTENT_NOTES.md` 摘要（5 处内容冲突 + 隐私开关建议）。
8. 日记功能说明：存储位置、备份方式、已知限制（清缓存即丢失、不支持多设备）。
9. 未完成项与下一步建议（P2：本地口令锁、GitHub 私有仓库同步、音频、英文版）。
