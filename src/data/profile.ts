export type Tone = 'paper' | 'ink' | 'acid' | 'blue' | 'magenta' | 'amber' | 'teal';
export type Education = { start: string; end: string; period: string; school: string; field: string; degree: string };
export type Skill = { title: string; body: string };
export type Employment = { company: string; department: string; role: string; start: string; end: string; period: string; responsibilities: string[] };
export type Profile = {
  name: string; gender: string; country: string; birthDate: string; birthYear: string;
  location: { country: string; province: string; city: string; district?: string };
  privacy: { showExactBirthDate: boolean; showDistrict: boolean };
  languages: { name: string; label: string }[];
  education: Education[];
  research: { intro: string; topics: string[]; keywords: string[] };
  academic: {
    metrics: { value: number; label: string }[]; summary: string;
    project: { name: string; organization: string; summary: string; steps: { title: string; body: string }[] };
  };
  industry: {
    company: string; department: string; start: string; end: string; period: string;
    responsibilities: string[]; awards: { date: string; title: string; detail?: string }[];
  };
  currentWork: Employment[]; skills: Skill[]; currentYear: string;
};

export const profile: Profile = {
  name: 'Percival', gender: '男', country: '中国', birthDate: '2000.09.10', birthYear: '2000',
  location: { country: '中国', province: '广东省', city: '广州' },
  privacy: { showExactBirthDate: true, showDistrict: true },
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
  },
  academic: {
    metrics: [{ value: 3, label: 'SCI 一作' }, { value: 2, label: 'Science 一作' }, { value: 17, label: '累计相关论文' }],
    summary: 'SCI 一作 3 篇，Science 一作 2 篇，含非一作累计发表 17 篇相关论文。',
    project: {
      name: 'Estrella', organization: '曼彻斯特大学 Intelligence 实验室',
      summary: '参与曼彻斯特大学 Intelligence 实验室首个金融量化分析模型 Estrella 的研发与落地，负责模型预训练与权重效果分析；带领子团队完成“模型权重思维链偏移”与“自循环下沉漩涡”子课题，并在 Estrella 中落地。',
      steps: [
        { title: '角色', body: '参与首个金融量化分析模型 Estrella 的研发与落地，带领子团队。' },
        { title: '预训练', body: '负责模型预训练。' },
        { title: '权重效果分析', body: '负责权重效果分析。' },
        { title: '思维链偏移', body: '带领子团队完成“模型权重思维链偏移”子课题。' },
        { title: '自循环下沉漩涡', body: '带领子团队完成“自循环下沉漩涡”子课题。' },
        { title: '落地', body: '两项子课题在 Estrella 中落地。' },
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
      { date: '2024.01', title: '华为年度开发者' },
      { date: '2024.07', title: '2024 年国家一级科研奖', detail: '团队成果“纳米拟态锂离子交换式电池”' },
    ],
  },
  currentWork: [
    {
      company: '杭州深度求索（DeepSeek）', department: '基座模型开发部', role: 'Toast 开发组组长',
      start: '2024.05', end: '2026.06', period: '2024.05–2026.06',
      responsibilities: ['负责 LLM 预训练、权重效果分析、LangChain LCEL 构建。'],
    },
    {
      company: '杭州深度求索（DeepSeek）', department: '基座模型开发部', role: '华南地区广州负责人',
      start: '2026.06', end: '至今', period: '2026.06–至今',
      responsibilities: ['负责模型网页端生态、dsh（harness）生态优化与区域本地部署 FDE 工程师。'],
    },
  ],
  skills: [
    { title: '数学与理论', body: '能从第一性原理推导 Transformer/注意力机制、扩散模型、RLHF 目标函数；能指出顶会论文的理论假设漏洞并提出修正；线代/概率/优化可直接用于新模型设计。' },
    { title: '工程与实验', body: '能独立从零实现并训练中等规模模型（如 1B 级 LLM 或 ViT），含数据管线、分布式训练、混合精度、故障恢复；能设计严谨的消融/显著性实验且结果可复现；有 SFT/RLHF/DPO 或大规模微调调参经验，能定位 loss 异常与训练不稳定。' },
    { title: '学术产出与表达', body: '以第一作者在 NeurIPS/ICML 发表 8 篇论文及项目。' },
    { title: '细分方向专长', body: 'RL 方向端到端主导经验（问题定义→方案→实验→落地/开源）；能预判该方向 6–12 个月技术走向并有初步验证；有可复现的开源或实习成果。' },
  ],
  currentYear: '2026',
};

/** Exact birth date is an explicit data-layer choice; false yields year/month. */
export function getBirthLabel(value: Profile = profile): string {
  return value.privacy.showExactBirthDate ? value.birthDate : value.birthDate.slice(0, 7);
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
