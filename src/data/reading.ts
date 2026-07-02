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

  // ============ 日语：初级 ============
  {
    id: 'reading-jp-1',
    title: '東京の朝',
    language: 'japanese',
    level: 'beginner',
    paragraphs: [
      '毎朝、田中さんは早く起きて、近くの公園を散歩します。彼は新鮮な空気と鳥の声が大好きです。この時間の公園はとても静かで、ジョギングする人や犬の散歩をする人が少しだけいます。',
      '散歩の後、田中さんは小さな喫茶店によって、コーヒーを一杯飲みます。店の人は彼の名前を知っていて、いつも好きな飲み物を準備してくれます。彼らは仕事に行く前に、少しだけ親しい会話を交わします。',
      '田中さんは、小さな習慣が人生に大きな違いをもたらすと信じています。毎朝自分のために時間を使うことは、一日中集中力を保つことに役立ちます。',
    ],
    collocations: [
      {
        id: 'col-jp-1',
        phrase: '散歩する',
        meaning: '散步',
        usage: '表示步行锻炼或悠闲地走，前面常加 を 表示散步的场所',
        example: '公園を散歩します。',
        exampleTranslation: '在公园散步。',
      },
      {
        id: 'col-jp-2',
        phrase: '新鮮な空気',
        meaning: '新鲜的空气',
        usage: '新鮮な 修饰空气、食材等，表示"新鲜的"',
        example: '朝の新鮮な空気を吸う。',
        exampleTranslation: '呼吸早晨新鲜的空气。',
      },
      {
        id: 'col-jp-3',
        phrase: '名前を知っている',
        meaning: '知道名字',
        usage: '表示对某人熟悉，知道对方的名字',
        example: '先生は学生の名前を知っています。',
        exampleTranslation: '老师知道学生的名字。',
      },
      {
        id: 'col-jp-4',
        phrase: '大きな違い',
        meaning: '巨大的差异',
        usage: '大きな + 名词，表示"大的、巨大的"',
        example: 'この習慣は大きな違いをもたらします。',
        exampleTranslation: '这个习惯会带来巨大的改变。',
      },
      {
        id: 'col-jp-5',
        phrase: '集中力を保つ',
        meaning: '保持专注力',
        usage: '集中力 を 保つ/維持する 表示"保持专注"',
        example: '一日中集中力を保つことは難しいです。',
        exampleTranslation: '一整天保持专注很难。',
      },
    ],
    questions: [],
    shadowingText:
      '毎朝、田中さんは早く起きて、近くの公園を散歩します。彼は新鮮な空気と鳥の声が大好きです。',
    estimatedMinutes: 8,
  },

  // ============ 韩语：初级 ============
  {
    id: 'reading-kr-1',
    title: '서울의 하루',
    language: 'korean',
    level: 'beginner',
    paragraphs: [
      '매일 아침, 지민 씨는 일찍 일어나서 가까운 공원을 산책합니다. 그녀는 맑은 공기와 새들의 노래 소리를 좋아합니다. 이 시간의 공원은 아주 조용하고, 조깅하는 사람과 강아지를 산책시키는 사람이 조금 있습니다.',
      '산책 후, 지민 씨는 작은 카페에 들러서 커피 한 잔을 마십니다. 직원은 그녀의 이름을 알고, 항상 좋아하는 음료를 준비해 줍니다. 그들은 출근하기 전에 잠깐 친근한 대화를 나눕니다.',
      '지민 씨는 작은 습관이 인생에 큰 변화를 가져온다고 믿습니다. 매일 아침 자신을 위해 시간을 쓰는 것은 하루 종일 집중력을 유지하는 데 도움이 됩니다.',
    ],
    collocations: [
      {
        id: 'col-kr-1',
        phrase: '산책하다',
        meaning: '散步',
        usage: '공원을 산책하다 表示在公园散步',
        example: '아침에 공원을 산책합니다.',
        exampleTranslation: '早上在公园散步。',
      },
      {
        id: 'col-kr-2',
        phrase: '맑은 공기',
        meaning: '清新的空气',
        usage: '맑은 修饰空气、天气等，表示"清新的、晴朗的"',
        example: '맑은 공기를 마시다.',
        exampleTranslation: '呼吸清新的空气。',
      },
      {
        id: 'col-kr-3',
        phrase: '이름을 알다',
        meaning: '知道名字',
        usage: '表示对某人熟悉，知道对方的名字',
        example: '직원이 제 이름을 압니다.',
        exampleTranslation: '店员知道我的名字。',
      },
      {
        id: 'col-kr-4',
        phrase: '큰 변화',
        meaning: '巨大的变化',
        usage: '큰 + 名词，表示"大的、巨大的"',
        example: '작은 습관이 큰 변화를 가져옵니다.',
        exampleTranslation: '小习惯带来大变化。',
      },
      {
        id: 'col-kr-5',
        phrase: '집중력을 유지하다',
        meaning: '保持专注力',
        usage: '집중력을 유지하다/잃다 表示保持/失去专注',
        example: '하루 종일 집중력을 유지하기 어렵습니다.',
        exampleTranslation: '一整天保持专注很难。',
      },
    ],
    questions: [],
    shadowingText:
      '매일 아침, 지민 씨는 일찍 일어나서 가까운 공원을 산책합니다. 그녀는 맑은 공기와 새들의 노래 소리를 좋아합니다.',
    estimatedMinutes: 8,
  },

  // ============ 法语：初级 ============
  {
    id: 'reading-fr-1',
    title: 'Une matinée à Paris',
    language: 'french',
    level: 'beginner',
    paragraphs: [
      "Chaque matin, Sophie se lève tôt et fait une promenade dans le parc de la ville. Elle aime l'air frais et le chant des oiseaux dans les arbres. Le parc est généralement calme à cette heure, avec seulement quelques joggeurs et promeneurs de chiens.",
      "Après sa promenade, Sophie s'arrête dans un petit café pour prendre un café. Le barista la connaît par son nom et prépare toujours sa boisson préférée. Ils échangent quelques mots amicaux avant qu'elle ne parte au travail. Cette routine simple lui apporte un sentiment de confort et de joie.",
      "Sophie croit que les petites habitudes peuvent faire une grande différence dans la vie. Prendre du temps pour elle chaque matin l'aide à rester concentrée et productive tout au long de la journée.",
    ],
    collocations: [
      {
        id: 'col-fr-1',
        phrase: 'faire une promenade',
        meaning: '散步',
        usage: 'faire une promenade 表示散步，dans le parc 表示散步地点',
        example: 'Je fais une promenade le matin.',
        exampleTranslation: '我早上散步。',
      },
      {
        id: 'col-fr-2',
        phrase: "l'air frais",
        meaning: '新鲜空气',
        usage: 'air 表示空气，frais 表示新鲜的、凉爽的',
        example: "J'aime l'air frais du matin.",
        exampleTranslation: '我喜欢早晨的新鲜空气。',
      },
      {
        id: 'col-fr-3',
        phrase: 'connaître par son nom',
        meaning: '知道名字',
        usage: 'connaître quelqu\'un par son nom 表示知道某人的名字',
        example: 'Le patron me connaît par mon nom.',
        exampleTranslation: '老板知道我的名字。',
      },
      {
        id: 'col-fr-4',
        phrase: 'faire une grande différence',
        meaning: '产生巨大影响',
        usage: 'faire une différence 表示产生影响，grande 修饰程度',
        example: 'Les petites habitudes font une grande différence.',
        exampleTranslation: '小习惯产生大影响。',
      },
      {
        id: 'col-fr-5',
        phrase: 'rester concentrée',
        meaning: '保持专注',
        usage: 'rester + 形容词 表示"保持某种状态"',
        example: 'Il est difficile de rester concentrée toute la journée.',
        exampleTranslation: '一整天保持专注很难。',
      },
    ],
    questions: [],
    shadowingText:
      "Chaque matin, Sophie se lève tôt et fait une promenade dans le parc de la ville. Elle aime l'air frais et le chant des oiseaux dans les arbres.",
    estimatedMinutes: 8,
  },

  // ============ 西班牙语：初级 ============
  {
    id: 'reading-es-1',
    title: 'Una mañana en Madrid',
    language: 'spanish',
    level: 'beginner',
    paragraphs: [
      'Cada mañana, Carmen se levanta temprano y da un paseo por el parque de la ciudad. Le gusta el aire fresco y el canto de los pájaros en los árboles. El parque suele estar tranquilo a esta hora, con solo algunos corredores y paseadores de perros.',
      'Después de su paseo, Carmen se detiene en un pequeño café para tomar un café. El barista la conoce por su nombre y siempre prepara su bebida favorita. Intercambian unas palabras amables antes de que ella se vaya al trabajo. Esta rutina simple le da una sensación de comodidad y alegría.',
      'Carmen cree que los pequeños hábitos pueden hacer una gran diferencia en la vida. Tomarse un tiempo para sí misma cada mañana la ayuda a mantenerse concentrada y productiva durante todo el día.',
    ],
    collocations: [
      {
        id: 'col-es-1',
        phrase: 'dar un paseo',
        meaning: '散步',
        usage: 'dar un paseo por 表示在某处散步',
        example: 'Doy un paseo por el parque.',
        exampleTranslation: '我在公园散步。',
      },
      {
        id: 'col-es-2',
        phrase: 'el aire fresco',
        meaning: '新鲜空气',
        usage: 'aire 表示空气，fresco 表示新鲜的',
        example: 'Me gusta el aire fresco de la mañana.',
        exampleTranslation: '我喜欢早晨的新鲜空气。',
      },
      {
        id: 'col-es-3',
        phrase: 'conocer por su nombre',
        meaning: '知道名字',
        usage: 'conocer a alguien por su nombre 表示知道某人的名字',
        example: 'El camarero me conoce por mi nombre.',
        exampleTranslation: '服务员知道我的名字。',
      },
      {
        id: 'col-es-4',
        phrase: 'hacer una gran diferencia',
        meaning: '产生巨大影响',
        usage: 'hacer una diferencia 表示产生影响，gran 修饰程度',
        example: 'Los pequeños hábitos hacen una gran diferencia.',
        exampleTranslation: '小习惯产生大影响。',
      },
      {
        id: 'col-es-5',
        phrase: 'mantenerse concentrada',
        meaning: '保持专注',
        usage: 'mantenerse + 形容词 表示"保持某种状态"',
        example: 'Es difícil mantenerse concentrada todo el día.',
        exampleTranslation: '一整天保持专注很难。',
      },
    ],
    questions: [],
    shadowingText:
      'Cada mañana, Carmen se levanta temprano y da un paseo por el parque de la ciudad. Le gusta el aire fresco y el canto de los pájaros en los árboles.',
    estimatedMinutes: 8,
  },

  // ============ 德语：初级 ============
  {
    id: 'reading-de-1',
    title: 'Ein Morgen in Berlin',
    language: 'german',
    level: 'beginner',
    paragraphs: [
      'Jeden Morgen steht Anna früh auf und macht einen Spaziergang durch den Stadtpark. Sie liebt die frische Luft und den Gesang der Vögel in den Bäumen. Der Park ist meistens ruhig zu dieser Zeit, mit nur ein paar Joggern und Hundebesitzern.',
      'Nach ihrem Spaziergang hält Anna in einem kleinen Café, um einen Kaffee zu holen. Der Barista kennt sie mit Namen und bereitet immer ihr Lieblingsgetränk zu. Sie wechseln ein paar freundliche Worte, bevor sie zur Arbeit geht. Diese einfache Routine gibt ihr ein Gefühl von Komfort und Freude.',
      'Anna glaubt, dass kleine Gewohnheiten einen großen Unterschied im Leben machen können. Sich jeden Morgen Zeit für sich selbst zu nehmen, hilft ihr, den ganzen Tag über konzentriert und produktiv zu bleiben.',
    ],
    collocations: [
      {
        id: 'col-de-1',
        phrase: 'einen Spaziergang machen',
        meaning: '散步',
        usage: 'einen Spaziergang machen 是固定搭配，表示散步',
        example: 'Ich mache einen Spaziergang im Park.',
        exampleTranslation: '我在公园散步。',
      },
      {
        id: 'col-de-2',
        phrase: 'frische Luft',
        meaning: '新鲜空气',
        usage: 'frisch 修饰 Luft，表示新鲜的空气',
        example: 'Ich liebe die frische Luft am Morgen.',
        exampleTranslation: '我喜欢早晨的新鲜空气。',
      },
      {
        id: 'col-de-3',
        phrase: 'mit Namen kennen',
        meaning: '知道名字',
        usage: 'jemanden mit Namen kennen 表示知道某人的名字',
        example: 'Der Barista kennt mich mit Namen.',
        exampleTranslation: '咖啡师知道我的名字。',
      },
      {
        id: 'col-de-4',
        phrase: 'einen großen Unterschied machen',
        meaning: '产生巨大影响',
        usage: 'einen Unterschied machen 表示产生影响',
        example: 'Kleine Gewohnheiten machen einen großen Unterschied.',
        exampleTranslation: '小习惯产生大影响。',
      },
      {
        id: 'col-de-5',
        phrase: 'konzentriert bleiben',
        meaning: '保持专注',
        usage: 'bleiben + 形容词 表示"保持某种状态"',
        example: 'Es ist schwer, den ganzen Tag konzentriert zu bleiben.',
        exampleTranslation: '一整天保持专注很难。',
      },
    ],
    questions: [],
    shadowingText:
      'Jeden Morgen steht Anna früh auf und macht einen Spaziergang durch den Stadtpark. Sie liebt die frische Luft und den Gesang der Vögel in den Bäumen.',
    estimatedMinutes: 8,
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
