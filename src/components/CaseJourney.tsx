import { useState } from 'react';
import type { CreativeProject } from '../data/projects';
import './case-journey.css';
const journeys: Record<string, { labels: string[]; descriptions: string[] }> = {
  'after-you': { labels: ['找回记忆', '作出选择', '面对回应'], descriptions: ['从残存的声音与记录中，逐渐重建 Lina 的数字人格。', '选择保留、处理或修改记忆片段，探索它们如何改变关系。', 'Lina 表达自己的愿望，质疑你的解释，也可能拒绝你的安排。'] },
  'bonnie-fridge': { labels: ['拍下食材', '修正与匹配', '补齐缺料'], descriptions: ['从一张冰箱照片开始，识别手边已有的食材。', '手动修正识别结果，将常备食材与饮食偏好纳入菜谱推荐。', '从想吃的菜出发，检查已有食材并整理还需要购买的内容。'] },
  'transfloat': { labels: ['选中文字', '唤起翻译', '继续工作'], descriptions: ['选择原文，也可以直接输入或粘贴需要理解的文本。', '使用 Ctrl + Alt + T 唤起翻译；匹配到的编程报错术语附带中文解释。', '通过置顶、拖动与托盘收起，让译文留在当前工作过程里。'] },
};
export function CaseJourney({ project }: { project: CreativeProject }) {
  const [active, setActive] = useState(0);
  const journey = journeys[project.slug];
  if (!journey) return null;
  return <section className="case-journey" aria-labelledby="case-journey-title">
    <header><div><p className="mono">IDEA → EXPERIENCE</p><h2 className="display-zh" id="case-journey-title">一个想法，怎样被体验。</h2></div><p>体验路径示意 · {project.status}</p></header>
    <div className="case-journey-steps" role="group" aria-label="查看体验步骤">{journey.labels.map((label, index) => <button key={label} type="button" aria-pressed={active === index} aria-controls="case-journey-detail" onClick={() => setActive(index)}><span className="display-en">0{index + 1}</span><span>{label}</span><span aria-hidden="true">↗</span></button>)}</div>
    <div className="case-journey-detail" id="case-journey-detail" aria-live="polite" aria-atomic="true"><span className="display-en" aria-hidden="true">0{active + 1}</span><div><h3 className="display-zh">{journey.labels[active]}</h3><p>{journey.descriptions[active]}</p></div></div>
    <p className="case-journey-caption">选择上方步骤，查看作品中的体验路径。</p>
  </section>;
}
