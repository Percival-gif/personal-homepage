export type Tone = 'paper' | 'ink' | 'acid' | 'blue' | 'magenta' | 'amber' | 'teal';
export type Education = { start: string; end: string; period: string; school: string; field: string; degree: string };
export type Skill = { title: string; body: string };
export type Award = { date?: string; title: string; status: '获奖' | '提名'; detail: string };
export type Employment = { company: string; department: string; role: string; start: string; end: string; period: string; responsibilities: string[]; details: string[] };
export type Profile = {
  name: string; gender: string; country: string; birthDate: string; birthYear: string;
  location: { country: string; province: string; city: string; district?: string };
  privacy: { showExactBirthDate: boolean; showDistrict: boolean };
  introduction: { title: string; paragraphs: string[] };
  languages: { name: string; label: string }[];
  education: Education[];
  research: { intro: string; topics: string[]; keywords: string[]; overview: string[]; areas: Skill[] };
  academic: {
    metrics: { value: number; label: string }[]; summary: string; perspective: string; conference: { title: string; paragraphs: string[] };
    project: { name: string; organization: string; summary: string; perspective: string; steps: Skill[]; awards: Award[] };
  };
  industry: {
    company: string; department: string; start: string; end: string; period: string;
    responsibilities: string[]; awards: Award[];
  };
  currentWork: Employment[]; skills: Skill[]; currentYear: string;
  currentFocus: { title: string; introduction: string[]; areas: Skill[]; approach: Skill[]; closing: string };
};

export const profile: Profile = {
  name: 'Percival', gender: '男', country: '中国', birthDate: '2000.09.10', birthYear: '2000',
  location: { country: '中国', province: '广东省', city: '广州' },
  privacy: { showExactBirthDate: false, showDistrict: false },
  introduction: {
    title: '从模型原理，到工程现场。',
    paragraphs: [
      '我在广州生活与工作，研究兴趣连接模型原理、跨学科问题与工程实践。',
      '从能源与动力工程，到智能科学与技术，再到人工智能研究，不同阶段的学习让我逐渐形成一种习惯：先理解问题所处的系统，再选择适合的方法，并用实验检验判断。',
      '工作之外，我也希望为观察、阅读和日常感受留下空间。这个网站既记录研究与项目，也保留那些尚未形成结论的想法。',
    ],
  },
  languages: [
    { name: '中文', label: '中文母语' },
    { name: '雅思', label: 'IELTS 7.5' },
    { name: '剑桥商务英语', label: 'BEC Higher' },
  ],
  education: [
    { start: '2018.09', end: '2022.06', period: '2018.09–2022.06', school: '四川大学', field: '能源与动力工程', degree: '本科' },
    { start: '2022.09', end: '2025.06', period: '2022.09–2025.06', school: '四川大学', field: '智能科学与技术', degree: '硕士' },
    { start: '2025.06', end: '至今', period: '2025.06–至今', school: '曼彻斯特大学', field: '人工智能', degree: '在读博士' },
  ],
  research: {
    intro: 'NLP 与大语言模型',
    topics: [
      '研究可处理不确定性的机器学习模型，应用于天文、工程生物、材料科学。',
      'LLM 偏见、多模态 LLM 内容生成、LLM 用于心理健康 / ESG 分析。',
    ],
    keywords: ['NLP', 'LLM', '不确定性', '天文', '工程生物', '材料科学', '偏见', '多模态生成', '心理健康', 'ESG'],
    overview: [
      '我的研究主要围绕自然语言处理与大语言模型展开，关注模型如何形成判断、处理不确定性，以及在复杂任务中保持可靠的表现。',
      '相比单一的性能指标，我更关心模型背后的机制：一次能力提升来自哪里，实验结论能否复现，以及研究方法能否在真实场景中继续成立。',
    ],
    areas: [
      { title: '不确定性与跨学科建模', body: '探索模型在数据有限、噪声较高或分布变化时的表现，将不确定性作为理解预测结果的一部分。应用兴趣覆盖天文、工程生物与材料科学，关注不同学科的问题如何转化为可计算、可验证的研究任务。' },
      { title: '大语言模型的偏见与可靠性', body: '关注训练数据、任务指令及评价方式对模型输出的影响，研究偏见如何出现、如何被识别，以及干预措施是否会带来新的性能与公平性权衡。' },
      { title: '多模态内容生成', body: '探索文本与视觉信息之间的关联，关注生成内容的语义一致性、可控性及评价方法，尝试将模型能力转化为更自然的创作与交互体验。' },
      { title: '面向复杂场景的语言模型应用', body: '关注心理健康与 ESG 分析等场景中的信息理解、证据组织与辅助分析，重视输出的可追溯性、使用边界及人工复核机制。' },
    ],
  },
  academic: {
    metrics: [{ value: 3, label: 'SCI 一作' }, { value: 2, label: 'Science 一作' }, { value: 17, label: '累计相关论文' }],
    summary: 'SCI 一作 3 篇，Science 一作 2 篇，含非一作累计发表 17 篇相关论文。',
    perspective: '研究与项目实践涉及模型训练、权重分析、推理行为及强化学习等方向，持续探索理论分析、实验验证与工程应用之间的联系。',
    conference: {
      title: '顶会研究与项目经历',
      paragraphs: [
        '围绕 NeurIPS、ICML 相关研究与项目开展工作，关注问题定义、方法设计、实验对照与结果表达，重视对研究假设和适用边界的讨论。',
        '研究过程中，既关注方法是否有效，也关注结论是否依赖特定数据、实验设置或评价方式，并通过消融实验、误差分析与复现记录检验其稳定性。',
      ],
    },
    project: {
      name: 'Estrella', organization: '曼彻斯特大学 Intelligence 实验室',
      summary: '参与曼彻斯特大学 Intelligence 实验室 Estrella 项目的研发与落地，负责模型预训练及权重效果分析，并带领子团队推进相关研究任务。',
      perspective: '在项目中，我关注模型从训练到应用的完整过程：训练结果是否稳定，权重变化如何影响任务表现，以及实验中观察到的现象能否转化为可复用的方法。',
      steps: [
        { title: '子课题推进', body: '将研究目标拆解为可执行的实验任务，协调实验对照、结果记录与阶段复盘，推动子团队形成可讨论、可复现的研究结论。' },
        { title: '模型预训练', body: '围绕任务目标参与训练方案设计，跟踪训练过程中的收敛表现与异常现象，并结合下游任务结果调整实验方向。' },
        { title: '权重效果分析', body: '比较不同权重配置与训练阶段下的模型表现，分析性能变化、输出差异及潜在失效情形，为后续实验提供依据。' },
        { title: '推理轨迹与权重变化', body: '研究不同训练阶段及权重配置下，模型在多步任务中的输出路径与判断倾向，关注推理过程的稳定性，以及偏移现象与任务表现之间的关系。' },
        { title: '迭代反馈与误差累积', body: '关注模型输出重新进入后续流程时，偏差可能如何累积或被放大，探索通过对照实验、反馈约束与评估机制识别潜在的退化现象。' },
        { title: '研究成果落地', body: '将经过验证的研究结果整理为可接入项目的方案，关注训练、评估与应用之间的一致性，减少实验结论在实际使用中的偏差。' },
      ],
      awards: [
        { title: '陈嘉庚青年科学奖', status: '提名', detail: 'Estrella 项目相关研究 · 提名记录' },
        { title: 'CCF-ACM Award fre AI（CCF青年科技奖）', status: '提名', detail: 'Estrella 项目相关研究 · 提名记录' },
      ],
    },
  },
  industry: {
    company: '华为', department: '终端电池技术开发部', start: '2023.04', end: '2024.03', period: '2023.04–2024.03',
    responsibilities: [
      '消费电子电池预研与开发。',
      '项目后期带领团队与巨鲸电池平台团队合作研发终端 BG 开发，负责鸿蒙智行汽车动力电池系统。',
    ],
    awards: [
      { date: '2024.01', title: '华为年度开发者', status: '获奖', detail: '参与终端电池技术相关研发工作，在跨团队协作与项目推进中积累产业实践经验，并获得年度开发者荣誉。' },
      { date: '2024.07', title: '国家技术发明奖', status: '获奖', detail: '团队成果“纳米拟态锂离子交换式电池”。围绕该成果参与团队研究，探索材料机制与终端应用之间的联系，关注技术方案的实验验证与工程可行性。' },
    ],
  },
  currentWork: [
    {
      company: '杭州深度求索（DeepSeek）', department: '基座模型开发部', role: 'Toast 开发组组长',
      start: '2024.05', end: '2026.06', period: '2024.05–2026.06',
      responsibilities: ['负责 LLM 预训练、权重效果分析、LangChain LCEL 构建。'],
      details: [
        '承担开发组的任务协调与阶段推进工作。围绕训练目标组织实验，比较不同配置下的模型表现；在应用链路中，将提示词、模型调用、数据处理及结果解析组织为可复用流程，关注模块衔接、异常处理与评估方式。',
        '在团队协作中，重视实验记录与问题复盘，让阶段结果能够被理解、复查，并为后续工作提供依据。',
      ],
    },
    {
      company: '杭州深度求索（DeepSeek）', department: '基座模型开发部', role: '华南地区广州负责人',
      start: '2026.06', end: '至今', period: '2026.06–至今',
      responsibilities: ['负责模型网页端生态、dsh（harness）生态优化与区域本地部署 FDE 工程师。'],
      details: ['目前工作重点覆盖模型网页端生态、dsh（harness）生态优化，以及区域本地部署相关的 FDE 工程实践。'],
    },
  ],
  skills: [
    { title: '数学与理论', body: '能从第一性原理推导 Transformer/注意力机制、扩散模型、RLHF 目标函数；能指出顶会论文的理论假设漏洞并提出修正；线代/概率/优化可直接用于新模型设计。' },
    { title: '工程与实验', body: '能独立从零实现并训练中等规模模型（如 1B 级 LLM 或 ViT），含数据管线、分布式训练、混合精度、故障恢复；能设计严谨的消融/显著性实验且结果可复现；有 SFT/RLHF/DPO 或大规模微调调参经验，能定位 loss 异常与训练不稳定。' },
    { title: '学术产出与表达', body: '围绕 NeurIPS、ICML 相关研究与项目开展工作，关注问题定义、方法设计、实验对照与结果表达，重视对研究假设和适用边界的讨论。' },
    { title: '细分方向专长', body: 'RL 方向端到端主导经验（问题定义→方案→实验→落地/开源）；能预判该方向 6–12 个月技术走向并有初步验证；有可复现的开源或实习成果。' },
  ],
  currentYear: '2026',
  currentFocus: {
    title: '连接模型能力、产品体验与部署现场',
    introduction: [
      '目前担任 DeepSeek 华南地区广州负责人，工作重点覆盖模型网页端生态、dsh（harness）生态优化，以及区域本地部署相关的 FDE 工程实践。',
      '我希望让模型能力在具体场景中变得可用、稳定且易于理解：既能回应用户需求，也能在真实的运行条件下持续工作。',
    ],
    areas: [
      { title: '模型网页端生态', body: '关注模型能力在网页产品中的交互呈现，围绕任务输入、响应反馈、上下文衔接与异常状态梳理使用流程。从用户实际完成任务的过程出发，识别影响体验的中断点，推动模型服务与产品界面之间形成更清晰、连贯的反馈。' },
      { title: 'dsh（harness）生态优化', body: '关注模型与工具、运行环境及任务流程之间的协作，围绕上下文组织、工具调用、执行反馈与失败恢复梳理链路。通过典型任务复现与运行记录，定位影响任务完成的环节，推动问题从“偶发失败”转化为能够解释、验证和改进的具体事项。' },
      { title: '区域部署与 FDE 工程实践', body: '面向具体业务场景，将需求拆解为模型能力、部署条件与交付标准，参与从方案验证到现场调试的实施过程。关注系统兼容性、运行资源、响应表现及维护需求，推动研究与产品能力在实际环境中形成可持续使用的方案。' },
    ],
    approach: [
      { title: '先定义问题', body: '明确使用场景、约束条件与成功标准，避免在目标尚不清晰时堆叠方案。' },
      { title: '让实验可解释', body: '保留数据、配置与结果记录，通过对照和复盘判断改进来自哪里。' },
      { title: '把边界讲清楚', body: '说明模型适用条件、已知问题与需要人工介入的环节。' },
      { title: '让交付可以延续', body: '将验证过程、部署方法与维护说明整理为团队能够继续使用的资料。' },
    ],
    closing: '在广州，继续连接研究与实践。',
  },
};

/** Public display defaults to birth year, as approved in the reviewed copy. */
export function getBirthLabel(value: Profile = profile): string {
  return value.privacy.showExactBirthDate ? value.birthDate : value.birthYear;
}
/** No district was supplied. Never infer one, regardless of the privacy switch. */
export function getLocationLabel(value: Profile = profile): string {
  return value.privacy.showDistrict && value.location.district
    ? `${value.location.city} · ${value.location.district}` : value.location.city;
}
export type Door = { id: string; number: string; label: string; english: string; path: string; tone: Tone };
export const doors: Door[] = [
  { id: 'A', number: '01', label: '我是谁？', english: 'ABOUT', path: '/about', tone: 'acid' },
  { id: 'B', number: '02', label: '我做过什么？', english: 'WORK', path: '/work', tone: 'blue' },
  { id: 'C', number: '03', label: '我现在在做什么？', english: 'NOW', path: '/now', tone: 'magenta' },
  { id: 'D', number: '04', label: '我今天想说什么？', english: 'DIARY', path: '/diary', tone: 'amber' },
];
export const pageLabels: Record<string, string> = {
  '/': 'Welcome', '/corridor': '涂鸦走廊',
  '/about': doors[0].label, '/work': doors[1].label, '/now': doors[2].label, '/diary': doors[3].label,
};
