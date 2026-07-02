// 阅读模块数据：文章 + 固定搭配 + 阅读理解题
// 配合 languageDataApi 实现单词点击查询
// 每个文章按 level 分级，覆盖不同难度

import type { ReadingArticle } from '../types';

export const readingArticles: ReadingArticle[] = [
  // ============ 初级：日常生活 ============
  {
    id: 'reading-eng-1',
    title: 'A Morning in the City',
    language: 'english',
    level: 'beginner',
    paragraphs: [
      'Every morning, Sarah wakes up early and takes a brisk walk through the city park. She loves the fresh air and the sound of birds singing in the trees. The park is usually quiet at this hour, with only a few joggers and dog walkers around.',
      'After her walk, Sarah stops by a small cafe to grab a cup of coffee. The barista knows her by name and always prepares her favorite drink. They exchange a few friendly words before she heads to work. This simple routine brings her a sense of comfort and joy.',
      'Sarah believes that small habits can make a big difference in life. Taking time for herself each morning helps her stay focused and productive throughout the day.',
    ],
    collocations: [
      {
        id: 'col-1-1',
        phrase: 'take a brisk walk',
        meaning: '快走，轻快地散步',
        usage: '表示轻松但速度较快的步行锻炼，常与 morning/evening 搭配',
        example: 'I take a brisk walk after dinner every day.',
        exampleTranslation: '我每天晚饭后快走散步。',
      },
      {
        id: 'col-1-2',
        phrase: 'grab a cup of coffee',
        meaning: '买/喝杯咖啡',
        usage: 'grab 在这里是"匆匆拿取"的口语用法，比 buy/get 更随意',
        example: 'Let us grab a cup of coffee after work.',
        exampleTranslation: '下班后我们去喝杯咖啡吧。',
      },
      {
        id: 'col-1-3',
        phrase: 'by name',
        meaning: '凭名字，知道名字',
        usage: 'know someone by name 表示"知道某人的名字"，强调熟悉程度',
        example: 'The teacher knows every student by name.',
        exampleTranslation: '老师知道每个学生的名字。',
      },
      {
        id: 'col-1-4',
        phrase: 'make a difference',
        meaning: '产生影响，起作用',
        usage: '常用搭配，表示某事带来改变，常接 in + 范围',
        example: 'Your support really made a difference.',
        exampleTranslation: '你的支持真的起了作用。',
      },
      {
        id: 'col-1-5',
        phrase: 'stay focused',
        meaning: '保持专注',
        usage: 'stay + 形容词 表示"保持某种状态"，focused 是 focus 的过去分词作形容词',
        example: 'It is hard to stay focused when you are tired.',
        exampleTranslation: '累的时候很难保持专注。',
      },
    ],
    questions: [
      {
        id: 'rq-1-1',
        question: 'What does Sarah do first in the morning?',
        options: ['Grabs coffee', 'Takes a walk', 'Goes to work', 'Talks to the barista'],
        correctAnswer: 1,
        explanation: '第一段提到 "Sarah wakes up early and takes a brisk walk"',
      },
      {
        id: 'rq-1-2',
        question: 'How does the barista know Sarah?',
        options: ['By face', 'By name', 'By voice', 'By clothes'],
        correctAnswer: 1,
        explanation: '第二段 "The barista knows her by name"',
      },
      {
        id: 'rq-1-3',
        question: 'What does Sarah believe about small habits?',
        options: [
          'They are useless',
          'They take too much time',
          'They can make a big difference',
          'They are only for mornings',
        ],
        correctAnswer: 2,
        explanation: '第三段 "small habits can make a big difference in life"',
      },
    ],
    shadowingText:
      'Every morning, Sarah wakes up early and takes a brisk walk through the city park. She loves the fresh air and the sound of birds singing in the trees.',
    estimatedMinutes: 8,
  },

  // ============ 中级：职场话题 ============
  {
    id: 'reading-eng-2',
    title: 'The Art of Effective Meetings',
    language: 'english',
    level: 'intermediate',
    paragraphs: [
      'In modern workplaces, meetings have become an indispensable part of daily routine. However, many employees complain that meetings often waste valuable time and drain their energy. To make matters worse, poorly organized meetings tend to drag on without reaching any concrete conclusions.',
      'Effective meetings require careful planning and clear objectives. A skilled facilitator should set the agenda in advance and make sure everyone has a chance to contribute. It is also crucial to keep the discussion on track and avoid going off on tangents. When participants feel their voices are heard, they are more likely to engage actively in the conversation.',
      'Ultimately, the success of a meeting depends on follow-up actions. Without proper documentation and accountability, even the most productive discussion will fall flat. Teams that take meeting notes seriously and assign clear responsibilities tend to achieve better outcomes in the long run.',
    ],
    collocations: [
      {
        id: 'col-2-1',
        phrase: 'indispensable part',
        meaning: '不可或缺的部分',
        usage: 'indispensable = cannot be dispensed with，比 necessary 更强烈',
        example: 'Technology has become an indispensable part of our lives.',
        exampleTranslation: '科技已成为我们生活中不可或缺的一部分。',
      },
      {
        id: 'col-2-2',
        phrase: 'waste valuable time',
        meaning: '浪费宝贵时间',
        usage: 'valuable 修饰 time 表示"宝贵的"，是常见搭配',
        example: 'Do not waste valuable time on social media.',
        exampleTranslation: '别把宝贵时间浪费在社交媒体上。',
      },
      {
        id: 'col-2-3',
        phrase: 'to make matters worse',
        meaning: '更糟的是',
        usage: '固定短语作插入语，引出更糟糕的情况',
        example: 'It was raining, and to make matters worse, I forgot my umbrella.',
        exampleTranslation: '天在下雨，更糟的是，我忘了带伞。',
      },
      {
        id: 'col-2-4',
        phrase: 'drag on',
        meaning: '拖沓，冗长地进行',
        usage: 'drag on 表示某事（尤指会议、演讲）拖得太久',
        example: 'The meeting dragged on for three hours.',
        exampleTranslation: '会议拖了三个小时。',
      },
      {
        id: 'col-2-5',
        phrase: 'set the agenda',
        meaning: '设定议程',
        usage: 'agenda = 议事日程；set/establish the agenda 表示制定会议议程',
        example: 'The chairperson set the agenda for the meeting.',
        exampleTranslation: '主席为会议设定了议程。',
      },
      {
        id: 'col-2-6',
        phrase: 'on track',
        meaning: '在正轨上，按计划进行',
        usage: 'keep... on track 表示"让...保持在正轨"，反义为 off track',
        example: 'We are on track to finish the project by Friday.',
        exampleTranslation: '我们按计划能在周五前完成项目。',
      },
      {
        id: 'col-2-7',
        phrase: 'go off on tangents',
        meaning: '偏离主题，跑题',
        usage: 'tangent = 切线，引申为"离题的话题"',
        example: 'The speaker kept going off on tangents.',
        exampleTranslation: '演讲者一直跑题。',
      },
      {
        id: 'col-2-8',
        phrase: 'in the long run',
        meaning: '从长远来看',
        usage: '与 in the short run 相对，常用于总结性陈述',
        example: 'Exercise will benefit you in the long run.',
        exampleTranslation: '从长远来看，运动会让你受益。',
      },
    ],
    questions: [
      {
        id: 'rq-2-1',
        question: 'What do many employees complain about meetings?',
        options: [
          'They are too short',
          'They waste time and drain energy',
          'They are too productive',
          'They are never held',
        ],
        correctAnswer: 1,
        explanation: '第一段 "meetings often waste valuable time and drain their energy"',
      },
      {
        id: 'rq-2-2',
        question: 'What should a skilled facilitator do?',
        options: [
          'Talk the most',
          'Skip the agenda',
          'Set the agenda in advance',
          'End the meeting early',
        ],
        correctAnswer: 2,
        explanation: '第二段 "A skilled facilitator should set the agenda in advance"',
      },
      {
        id: 'rq-2-3',
        question: 'What does the success of a meeting ultimately depend on?',
        options: [
          'The number of attendees',
          'Follow-up actions',
          'The meeting room',
          'The length of the meeting',
        ],
        correctAnswer: 1,
        explanation: '第三段 "the success of a meeting depends on follow-up actions"',
      },
      {
        id: 'rq-2-4',
        question: 'What happens to productive discussions without documentation?',
        options: [
          'They succeed anyway',
          'They will fall flat',
          'They become longer',
          'They are forgotten immediately',
        ],
        correctAnswer: 1,
        explanation: '第三段 "even the most productive discussion will fall flat"',
      },
    ],
    shadowingText:
      'Effective meetings require careful planning and clear objectives. A skilled facilitator should set the agenda in advance and make sure everyone has a chance to contribute.',
    estimatedMinutes: 12,
  },

  // ============ 高级：科技与文化 ============
  {
    id: 'reading-eng-3',
    title: 'The Double-Edged Sword of Artificial Intelligence',
    language: 'english',
    level: 'advanced',
    paragraphs: [
      'Artificial intelligence has permeated virtually every aspect of modern life, from the algorithms that curate our social media feeds to the autonomous vehicles navigating our streets. While proponents hail AI as a transformative force capable of solving humanity\'s most intractable problems, skeptics warn of unforeseen consequences that could undermine the very fabric of society.',
      'The crux of the debate lies in the tension between innovation and regulation. On one hand, overly restrictive policies risk stifling technological progress and ceding competitive advantage to nations with laxer oversight. On the other hand, an unbridled approach could exacerbate existing inequalities and concentrate power in the hands of a few tech conglomerates. Striking the right balance requires nuanced thinking and collaborative governance across borders.',
      'Ultimately, the trajectory of AI will be shaped not merely by the brilliance of its algorithms, but by the wisdom of the humans who deploy them. As we stand on the precipice of an era defined by intelligent machines, the question is no longer whether AI can transform our world, but whether we possess the foresight and ethical clarity to ensure that transformation serves the common good.',
    ],
    collocations: [
      {
        id: 'col-3-1',
        phrase: 'double-edged sword',
        meaning: '双刃剑，有利有弊的事物',
        usage: '经典比喻，形容事物既有好处也有坏处',
        example: 'Social media is a double-edged sword.',
        exampleTranslation: '社交媒体是一把双刃剑。',
      },
      {
        id: 'col-3-2',
        phrase: 'permeate every aspect of',
        meaning: '渗透到...的每个方面',
        usage: 'permeate = 渗透，比 spread 更强调深入程度',
        example: 'Technology permeates every aspect of our lives.',
        exampleTranslation: '科技渗透到我们生活的方方面面。',
      },
      {
        id: 'col-3-3',
        phrase: 'hail...as...',
        meaning: '把...誉为...',
        usage: 'hail 作动词表示"欢呼拥戴"，常用于被动 hail X as Y',
        example: 'Critics hailed the film as a masterpiece.',
        exampleTranslation: '评论家把这部电影誉为杰作。',
      },
      {
        id: 'col-3-4',
        phrase: 'intractable problems',
        meaning: '棘手的问题',
        usage: 'intractable = 难对付的，比 difficult 更强调"难以解决"',
        example: 'Poverty remains an intractable problem.',
        exampleTranslation: '贫困仍是个棘手的问题。',
      },
      {
        id: 'col-3-5',
        phrase: 'the crux of',
        meaning: '...的关键/核心',
        usage: 'crux = 关键点，the crux of the matter = 问题的核心',
        example: 'The crux of the issue is funding.',
        exampleTranslation: '问题的核心在于资金。',
      },
      {
        id: 'col-3-6',
        phrase: 'stifle progress',
        meaning: '扼杀进步',
        usage: 'stifle = 使窒息，引申为"压制、阻碍"',
        example: 'Excessive rules can stifle innovation.',
        exampleTranslation: '过多的规则会扼杀创新。',
      },
      {
        id: 'col-3-7',
        phrase: 'cede advantage to',
        meaning: '把优势让给',
        usage: 'cede = 割让、让出，常用于竞争语境',
        example: 'We must not cede our advantage to competitors.',
        exampleTranslation: '我们不能把优势让给竞争对手。',
      },
      {
        id: 'col-3-8',
        phrase: 'exacerbate inequalities',
        meaning: '加剧不平等',
        usage: 'exacerbate = 使恶化，是 worsen 的正式用词',
        example: 'Inflation can exacerbate wealth inequalities.',
        exampleTranslation: '通货膨胀会加剧财富不平等。',
      },
      {
        id: 'col-3-9',
        phrase: 'strike the right balance',
        meaning: '找到合适的平衡',
        usage: 'strike a balance between A and B 是经典搭配',
        example: 'We must strike the right balance between work and life.',
        exampleTranslation: '我们必须在工作与生活间找到平衡。',
      },
      {
        id: 'col-3-10',
        phrase: 'stand on the precipice of',
        meaning: '站在...的边缘',
        usage: 'precipice = 悬崖，比喻"处于重大变化的前夜"',
        example: 'We stand on the precipice of a new era.',
        exampleTranslation: '我们站在新时代的边缘。',
      },
      {
        id: 'col-3-11',
        phrase: 'serve the common good',
        meaning: '服务于公共利益',
        usage: 'common good = 公共利益，与 personal interest 相对',
        example: 'Laws should serve the common good.',
        exampleTranslation: '法律应服务于公共利益。',
      },
    ],
    questions: [
      {
        id: 'rq-3-1',
        question: 'What do proponents believe about AI?',
        options: [
          'It will destroy society',
          'It can solve humanity\'s hardest problems',
          'It is overhyped',
          'It should be banned',
        ],
        correctAnswer: 1,
        explanation: '第一段 "proponents hail AI as a transformative force capable of solving humanity\'s most intractable problems"',
      },
      {
        id: 'rq-3-2',
        question: 'What is the crux of the AI debate?',
        options: [
          'Cost vs benefit',
          'Innovation vs regulation',
          'Speed vs accuracy',
          'East vs west',
        ],
        correctAnswer: 1,
        explanation: '第二段 "The crux of the debate lies in the tension between innovation and regulation"',
      },
      {
        id: 'rq-3-3',
        question: 'What risk does an unbridled approach to AI pose?',
        options: [
          'Faster progress',
          'Lower costs',
          'Exacerbated inequalities',
          'More regulations',
        ],
        correctAnswer: 2,
        explanation: '第二段 "an unbridled approach could exacerbate existing inequalities"',
      },
      {
        id: 'rq-3-4',
        question: 'According to the author, what will ultimately shape AI\'s trajectory?',
        options: [
          'Algorithm brilliance',
          'Computing power',
          'Human wisdom',
          'Market forces',
        ],
        correctAnswer: 2,
        explanation: '第三段 "the wisdom of the humans who deploy them"',
      },
      {
        id: 'rq-3-5',
        question: 'What is the author\'s final question about AI?',
        options: [
          'Whether AI can transform our world',
          'Whether we can ensure AI serves the common good',
          'Whether AI is too expensive',
          'Whether AI will replace humans',
        ],
        correctAnswer: 1,
        explanation: '结尾 "whether we possess the foresight and ethical clarity to ensure that transformation serves the common good"',
      },
    ],
    shadowingText:
      'The crux of the debate lies in the tension between innovation and regulation. Striking the right balance requires nuanced thinking and collaborative governance across borders.',
    estimatedMinutes: 15,
  },
];

// 根据语言和等级获取阅读文章
export const getReadingArticle = (language: string, level: string): ReadingArticle => {
  // 优先匹配语言+等级
  const exact = readingArticles.find(
    a => a.language === language && a.level === level
  );
  if (exact) return exact;

  // 退而求其次，匹配语言
  const byLang = readingArticles.find(a => a.language === language);
  if (byLang) return byLang;

  // 默认返回第一篇
  return readingArticles[0];
};

// 根据 ID 获取阅读文章
export const getReadingArticleById = (id: string): ReadingArticle | undefined => {
  return readingArticles.find(a => a.id === id);
};
