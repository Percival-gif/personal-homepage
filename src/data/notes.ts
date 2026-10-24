import { profile } from './profile';

// Public reading material is curated from approved profile copy only.
// Never read the local diary, fabricate publication dates, or publish draft entries.
export const publicNotes = [
  {
    slug: 'research-and-evidence', number: '01', category: '研究摘记', english: 'EVIDENCE',
    title: '理解模型，也理解结论的边界。',
    summary: profile.research.overview[1],
    sections: [
      { title: '从模型机制出发', paragraphs: profile.research.overview },
      { title: '方法与实验', paragraphs: profile.academic.conference.paragraphs },
      { title: '偏见与可靠性', paragraphs: [profile.research.areas[1].body] },
    ],
    related: '/work', relatedLabel: '查看研究与项目',
  },
  {
    slug: 'model-to-field', number: '02', category: '实践摘记', english: 'IN PRACTICE',
    title: '从模型能力，到真实的运行条件。',
    summary: profile.currentFocus.introduction[1],
    sections: [
      { title: '产品与使用过程', paragraphs: [profile.currentFocus.areas[0].body] },
      { title: '工具与执行反馈', paragraphs: [profile.currentFocus.areas[1].body] },
      { title: '部署现场', paragraphs: [profile.currentFocus.areas[2].body] },
    ],
    related: '/now', relatedLabel: '查看当前工作',
  },
  {
    slug: 'how-i-work', number: '03', category: '方法摘记', english: 'WORKING NOTES',
    title: '先理解问题，再选择方法。',
    summary: profile.introduction.paragraphs[1],
    sections: profile.currentFocus.approach.map(item => ({ title: item.title, paragraphs: [item.body] })),
    related: '/about', relatedLabel: '了解我的经历',
  },
];
