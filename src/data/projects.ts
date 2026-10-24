import afterYouImage from '../assets/projects/after-you.jpg';
import fridgeImage from '../assets/projects/bonnie-fridge.jpg';
import transfloatImage from '../assets/projects/transfloat.jpg';

export type CreativeProject = {
  slug: string; number: string; name: string; subtitle: string; category: string;
  status: string; image: string; imageAlt: string; imageNote: string;
  question: string; summary: string; tags: string[]; repository?: string;
  sections: { title: string; paragraphs: string[] }[];
};

export const projects: CreativeProject[] = [
  {
    slug: 'after-you', number: '01', name: 'AFTER YOU', subtitle: '在你之后',
    category: '叙事互动作品', status: '创作中', image: afterYouImage,
    imageAlt: 'Lina 的动漫概念肖像，周围叠合纸张、轨道线条与记忆碎片',
    imageNote: 'Lina 形象探索 · 概念插画',
    question: '记忆可以被修复。重逢会把我们带向哪里？',
    summary: '你受托修复已故乐队搭档的数字人格。随着记忆逐渐完整，她开始表达自己的愿望，也开始拒绝成为你记忆中的那个人。',
    tags: ['记忆', '数字人格', '关系与选择'],
    sections: [
      { title: '2048 年，钟雨城。', paragraphs: [
        '你接下一项特殊的修复工作：从残存的记录中，重建已故乐队搭档 Lina 的数字人格。声音、对话，以及共同生活留下的细节，成为你重新接近她的途径。你逐渐找回熟悉的语气，辨认那些只有彼此才懂的停顿。',
        '随着修复继续，Lina 开始提出问题。她对某些回忆有不同的理解，对未来也有自己的愿望。你越了解她，就越需要重新思考这次重逢。她想成为什么样的人？你又希望她成为谁？',
      ] },
      { title: '你会参与她的变化', paragraphs: [
        '《在你之后》正在探索一种围绕记忆编辑展开的叙事体验。你选择保留哪些片段，如何处理矛盾，以及是否修改令人痛苦的回忆，都会影响关系的走向。',
        '一段被删除的争执，可能让交谈变得轻松，也可能带走她坚持某个选择的理由。Lina 也会回应这些决定。她可以质疑你的解释，拒绝你的安排，提出与你不同的愿望。',
      ] },
      { title: '声音、纸张与空白', paragraphs: [
        '这部作品的情绪将落在具体的事物里。一段旋律唤回过去的某个瞬间。纸上的记录保留了当时没有说出口的话。对话停下之后，空白留给仍在等待回答的人。',
        '《After You／在你之后》正在逐步展开。有些答案会在创作中改变。我希望把这个过程也留下来。',
      ] },
    ],
  },
  {
    slug: 'bonnie-fridge', number: '02', name: 'BONNIE FRIDGE', subtitle: '冰箱侦探',
    category: '生活工具 / 多模态应用', status: '应用原型', image: fridgeImage,
    imageAlt: '打开的冰箱、手机取景框、食材剪纸与菜谱便签组成的动漫拼贴',
    imageNote: '项目主题概念插画 · 非软件截图',
    question: '打开冰箱之后，离一顿饭还有多远？',
    summary: '从一张冰箱照片开始，将食材识别、菜谱匹配和缺料购物清单连接起来，让“今晚吃什么”逐渐变成能够行动的选择。',
    tags: ['食材识别', '菜谱匹配', '购物清单'],
    repository: 'https://github.com/Percival-gif/bonnie-fridge',
    sections: [
      { title: '从手边已有的食材出发', paragraphs: [
        '冰箱里有一些食材，却依然不知道今晚吃什么。Bonnie Fridge 围绕这个日常问题，将照片识别、菜谱匹配与购物清单连接起来。上传冰箱照片，识别已有食材，再查看可以尝试的菜。',
      ] },
      { title: '让识别结果可以被修正', paragraphs: [
        '识别结果允许手动修正，常备食材和部分饮食偏好可以参与推荐。你也可以从一道想吃的菜出发，检查手边已经有什么，还需要补买什么。',
      ] },
      { title: '一张照片，一顿饭的可能', paragraphs: [
        '这件作品关注技术进入日常生活的方式：从一张照片开始，把信息整理成一顿饭的可能。目前以应用原型与源码的形式展示。',
      ] },
    ],
  },
  {
    slug: 'transfloat', number: '03', name: 'TRANSFLOAT', subtitle: '桌面翻译悬浮窗',
    category: '桌面工具 / Windows', status: '源码可查阅', image: transfloatImage,
    imageAlt: '光标选区、蓝色原文窗口与暖白译文窗口叠合的动漫桌面插画',
    imageNote: '项目主题概念插画 · 非软件截图',
    question: '让理解，留在当前窗口。',
    summary: '选中文字，通过快捷键唤起翻译悬浮窗；在译文之外附加编程术语解释，让理解成为工作过程中的一个小动作。',
    tags: ['划词翻译', '术语解释', '悬浮窗口'],
    repository: 'https://github.com/Percival-gif/TransFloat',
    sections: [
      { title: '减少理解过程中的切换', paragraphs: [
        '读到一句陌生的英文，或者遇见一段看不懂的编程报错时，理解常常伴随着切换：复制文字、打开翻译页面，再回到原来的工作。TransFloat 将这个过程放进一个 Windows 桌面悬浮窗。',
      ] },
      { title: '翻译之外，多一点解释', paragraphs: [
        '选中文字，按下 Ctrl + Alt + T，即可发起翻译；也可以直接输入或粘贴文本。对于匹配到的编程报错术语，工具会在译文之外附加中文解释，帮助使用者进一步理解信息。支持中英互译。',
      ] },
      { title: '一个轻量的工作伙伴', paragraphs: [
        '窗口支持置顶、拖动与托盘收起，让翻译成为工作过程中的一个小动作。这件作品关注那些容易被忽略的使用阻力，以及一个轻量工具能够带来的改变。项目提供源码供查阅。',
      ] },
    ],
  },
];
