import type { Course, Word, GrammarQuestion, SpeakingExercise, ListeningExercise } from '../types';

export const courses: Course[] = [
  {
    id: 'eng-beginner-1',
    title: '英语入门：基础词汇与对话',
    language: 'english',
    level: 'beginner',
    description: '从零开始学习英语，掌握基础词汇和日常对话，建立英语学习的坚实基础。',
    duration: 40,
    progress: 35,
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=English%20learning%20concept%20with%20books%20and%20world%20map%20warm%20colors&image_size=landscape_16_9',
    rating: 4.9,
    students: 12580,
    modules: [
      { id: 'vocab-1', title: '日常基础词汇', type: 'vocabulary', duration: 10, completed: true },
      { id: 'grammar-1', title: '基础语法', type: 'grammar', duration: 12, completed: true },
      { id: 'speaking-1', title: '日常对话', type: 'speaking', duration: 10, completed: false },
      { id: 'listening-1', title: '听力入门', type: 'listening', duration: 8, completed: false },
      { id: 'reading-1', title: '阅读理解：城市清晨', type: 'reading', duration: 8, completed: false },
    ],
  },
  {
    id: 'eng-intermediate-1',
    title: '英语进阶：商务场景应用',
    language: 'english',
    level: 'intermediate',
    description: '深入学习商务英语，掌握职场沟通技巧，提升会议和谈判能力。',
    duration: 50,
    progress: 20,
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Business%20English%20learning%20office%20meeting%20professional%20modern&image_size=landscape_16_9',
    rating: 4.8,
    students: 8920,
    modules: [
      { id: 'vocab-2', title: '商务词汇', type: 'vocabulary', duration: 12, completed: false },
      { id: 'grammar-2', title: '复杂句型', type: 'grammar', duration: 15, completed: false },
      { id: 'speaking-2', title: '商务演讲', type: 'speaking', duration: 13, completed: false },
      { id: 'listening-2', title: '商务听力', type: 'listening', duration: 10, completed: false },
      { id: 'reading-2', title: '阅读理解：高效会议', type: 'reading', duration: 12, completed: false },
    ],
  },
  {
    id: 'eng-advanced-1',
    title: '英语高级：学术写作与表达',
    language: 'english',
    level: 'advanced',
    description: '提升学术英语能力，掌握论文写作技巧，增强批判性思维表达。',
    duration: 60,
    progress: 0,
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Academic%20English%20writing%20research%20library%20scholarly%20atmosphere&image_size=landscape_16_9',
    rating: 4.7,
    students: 5640,
    modules: [
      { id: 'vocab-3', title: '学术词汇', type: 'vocabulary', duration: 15, completed: false },
      { id: 'grammar-3', title: '学术语法', type: 'grammar', duration: 18, completed: false },
      { id: 'speaking-3', title: '学术演讲', type: 'speaking', duration: 15, completed: false },
      { id: 'listening-3', title: '讲座听力', type: 'listening', duration: 12, completed: false },
      { id: 'reading-3', title: '阅读理解：AI的双刃剑', type: 'reading', duration: 15, completed: false },
    ],
  },
  {
    id: 'jp-beginner-1',
    title: '日语入门：五十音与基础会话',
    language: 'japanese',
    level: 'beginner',
    description: '系统学习五十音图，掌握基础日语会话，了解日本文化背景。',
    duration: 45,
    progress: 60,
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Japanese%20language%20learning%20kanji%20characters%20cherry%20blossom%20traditional&image_size=landscape_16_9',
    rating: 4.9,
    students: 9870,
    modules: [
      { id: 'jp-vocab-1', title: '基础词汇', type: 'vocabulary', duration: 12, completed: true },
      { id: 'jp-grammar-1', title: '基础语法', type: 'grammar', duration: 15, completed: true },
      { id: 'jp-speaking-1', title: '日常会话', type: 'speaking', duration: 10, completed: true },
      { id: 'jp-listening-1', title: '听力入门', type: 'listening', duration: 8, completed: false },
      { id: 'jp-reading-1', title: '阅读理解：日本の朝', type: 'reading', duration: 8, completed: false },
    ],
  },
  {
    id: 'jp-intermediate-1',
    title: '日语进阶：职场日语',
    language: 'japanese',
    level: 'intermediate',
    description: '学习职场日语礼仪和商务用语，提升在日本企业的沟通能力。',
    duration: 55,
    progress: 10,
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Japanese%20business%20meeting%20office%20traditional%20modern%20mix&image_size=landscape_16_9',
    rating: 4.8,
    students: 6230,
    modules: [
      { id: 'jp-vocab-2', title: '职场词汇', type: 'vocabulary', duration: 15, completed: false },
      { id: 'jp-grammar-2', title: '敬语语法', type: 'grammar', duration: 20, completed: false },
      { id: 'jp-speaking-2', title: '商务会话', type: 'speaking', duration: 12, completed: false },
      { id: 'jp-listening-2', title: '职场听力', type: 'listening', duration: 8, completed: false },
      { id: 'jp-reading-2', title: '阅读理解：日本のビジネス文化', type: 'reading', duration: 12, completed: false },
    ],
  },
  {
    id: 'kr-beginner-1',
    title: '韩语入门：韩文字母与日常对话',
    language: 'korean',
    level: 'beginner',
    description: '学习韩文字母表(Hangul)，掌握基础韩语词汇和日常对话表达。',
    duration: 40,
    progress: 0,
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Korean%20language%20learning%20hangul%20characters%20colorful%20modern&image_size=landscape_16_9',
    rating: 4.9,
    students: 7560,
    modules: [
      { id: 'kr-vocab-1', title: '基础词汇', type: 'vocabulary', duration: 10, completed: false },
      { id: 'kr-grammar-1', title: '基础语法', type: 'grammar', duration: 12, completed: false },
      { id: 'kr-speaking-1', title: '日常对话', type: 'speaking', duration: 10, completed: false },
      { id: 'kr-listening-1', title: '听力入门', type: 'listening', duration: 8, completed: false },
      { id: 'kr-reading-1', title: '阅读理解：서울의 하루', type: 'reading', duration: 8, completed: false },
    ],
  },
  {
    id: 'kr-intermediate-1',
    title: '韩语进阶：K-pop与韩剧语言',
    language: 'korean',
    level: 'intermediate',
    description: '通过K-pop歌曲和韩剧学习实用韩语，了解韩国流行文化。',
    duration: 48,
    progress: 0,
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=K-pop%20Korean%20drama%20culture%20music%20trendy%20vibrant&image_size=landscape_16_9',
    rating: 4.8,
    students: 8120,
    modules: [
      { id: 'kr-vocab-2', title: '流行词汇', type: 'vocabulary', duration: 12, completed: false },
      { id: 'kr-grammar-2', title: '实用语法', type: 'grammar', duration: 14, completed: false },
      { id: 'kr-speaking-2', title: '情景对话', type: 'speaking', duration: 12, completed: false },
      { id: 'kr-listening-2', title: '歌曲听力', type: 'listening', duration: 10, completed: false },
      { id: 'kr-reading-2', title: '阅读理解：한국의 대중문화', type: 'reading', duration: 12, completed: false },
    ],
  },
  {
    id: 'eng-master-1',
    title: '英语精通：雅思高分冲刺',
    language: 'english',
    level: 'master',
    description: '针对雅思考试的全面备考，提升听说读写四项技能，冲刺高分。',
    duration: 80,
    progress: 0,
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=IELTS%20exam%20preparation%20study%20materials%20professional%20ambitious&image_size=landscape_16_9',
    rating: 4.9,
    students: 4350,
    modules: [
      { id: 'eng-vocab-4', title: '雅思词汇', type: 'vocabulary', duration: 20, completed: false },
      { id: 'eng-grammar-4', title: '复杂语法', type: 'grammar', duration: 25, completed: false },
      { id: 'eng-speaking-4', title: '口语考试', type: 'speaking', duration: 18, completed: false },
      { id: 'eng-listening-4', title: '听力考试', type: 'listening', duration: 17, completed: false },
      { id: 'eng-reading-4', title: '阅读理解：学术阅读技巧', type: 'reading', duration: 20, completed: false },
    ],
  },
  // ============ 法语 ============
  {
    id: 'fr-beginner-1',
    title: '法语入门：发音与日常对话',
    language: 'french',
    level: 'beginner',
    description: '学习法语发音规则，掌握基础词汇和日常会话，感受浪漫法语魅力。',
    duration: 42,
    progress: 0,
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=French%20language%20learning%20Eiffel%20tower%20cafe%20romantic%20Paris&image_size=landscape_16_9',
    rating: 4.8,
    students: 6780,
    modules: [
      { id: 'fr-vocab-1', title: '基础词汇', type: 'vocabulary', duration: 10, completed: false },
      { id: 'fr-grammar-1', title: '基础语法', type: 'grammar', duration: 12, completed: false },
      { id: 'fr-speaking-1', title: '日常会话', type: 'speaking', duration: 10, completed: false },
      { id: 'fr-listening-1', title: '听力入门', type: 'listening', duration: 10, completed: false },
      { id: 'fr-reading-1', title: '阅读理解：Une matinée à Paris', type: 'reading', duration: 8, completed: false },
    ],
  },
  {
    id: 'fr-intermediate-1',
    title: '法语进阶：文化与社会',
    language: 'french',
    level: 'intermediate',
    description: '通过法国文化、电影和文学学习进阶法语，提升语言运用能力。',
    duration: 50,
    progress: 0,
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=French%20culture%20literature%20cinema%20elegant%20artistic&image_size=landscape_16_9',
    rating: 4.7,
    students: 4320,
    modules: [
      { id: 'fr-vocab-2', title: '文化词汇', type: 'vocabulary', duration: 12, completed: false },
      { id: 'fr-grammar-2', title: '进阶语法', type: 'grammar', duration: 14, completed: false },
      { id: 'fr-speaking-2', title: '情景对话', type: 'speaking', duration: 12, completed: false },
      { id: 'fr-listening-2', title: '影视听力', type: 'listening', duration: 12, completed: false },
      { id: 'fr-reading-2', title: '阅读理解：La culture française', type: 'reading', duration: 12, completed: false },
    ],
  },
  // ============ 西班牙语 ============
  {
    id: 'es-beginner-1',
    title: '西班牙语入门：基础会话',
    language: 'spanish',
    level: 'beginner',
    description: '学习西语发音和基础会话，打开通往西语世界的大门。',
    duration: 40,
    progress: 0,
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Spanish%20language%20learning%20flamenco%20sunny%20vibrant%20Spain&image_size=landscape_16_9',
    rating: 4.9,
    students: 8900,
    modules: [
      { id: 'es-vocab-1', title: '基础词汇', type: 'vocabulary', duration: 10, completed: false },
      { id: 'es-grammar-1', title: '基础语法', type: 'grammar', duration: 12, completed: false },
      { id: 'es-speaking-1', title: '日常会话', type: 'speaking', duration: 10, completed: false },
      { id: 'es-listening-1', title: '听力入门', type: 'listening', duration: 8, completed: false },
      { id: 'es-reading-1', title: '阅读理解：Una mañana en Madrid', type: 'reading', duration: 8, completed: false },
    ],
  },
  {
    id: 'es-intermediate-1',
    title: '西班牙语进阶：拉美文化',
    language: 'spanish',
    level: 'intermediate',
    description: '探索拉美文化，学习实用西语表达，提升跨文化沟通能力。',
    duration: 48,
    progress: 0,
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Latin%20America%20culture%20colorful%20music%20vibrant%20travel&image_size=landscape_16_9',
    rating: 4.8,
    students: 5600,
    modules: [
      { id: 'es-vocab-2', title: '文化词汇', type: 'vocabulary', duration: 12, completed: false },
      { id: 'es-grammar-2', title: '进阶语法', type: 'grammar', duration: 14, completed: false },
      { id: 'es-speaking-2', title: '情景对话', type: 'speaking', duration: 12, completed: false },
      { id: 'es-listening-2', title: '音乐听力', type: 'listening', duration: 10, completed: false },
      { id: 'es-reading-2', title: '阅读理解：La cultura latinoamericana', type: 'reading', duration: 12, completed: false },
    ],
  },
  // ============ 德语 ============
  {
    id: 'de-beginner-1',
    title: '德语入门：发音与基础',
    language: 'german',
    level: 'beginner',
    description: '系统学习德语发音和基础语法，掌握日常交流能力。',
    duration: 45,
    progress: 0,
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=German%20language%20learning%20Berlin%20modern%20clean%20engineering&image_size=landscape_16_9',
    rating: 4.7,
    students: 5400,
    modules: [
      { id: 'de-vocab-1', title: '基础词汇', type: 'vocabulary', duration: 12, completed: false },
      { id: 'de-grammar-1', title: '基础语法', type: 'grammar', duration: 14, completed: false },
      { id: 'de-speaking-1', title: '日常会话', type: 'speaking', duration: 10, completed: false },
      { id: 'de-listening-1', title: '听力入门', type: 'listening', duration: 9, completed: false },
      { id: 'de-reading-1', title: '阅读理解：Ein Morgen in Berlin', type: 'reading', duration: 8, completed: false },
    ],
  },
  {
    id: 'de-intermediate-1',
    title: '德语进阶：职场与留学',
    language: 'german',
    level: 'intermediate',
    description: '针对留学和职场需求，学习专业德语表达和沟通技巧。',
    duration: 55,
    progress: 0,
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=German%20business%20engineering%20university%20professional&image_size=landscape_16_9',
    rating: 4.8,
    students: 3800,
    modules: [
      { id: 'de-vocab-2', title: '专业词汇', type: 'vocabulary', duration: 14, completed: false },
      { id: 'de-grammar-2', title: '进阶语法', type: 'grammar', duration: 16, completed: false },
      { id: 'de-speaking-2', title: '商务会话', type: 'speaking', duration: 13, completed: false },
      { id: 'de-listening-2', title: '职场听力', type: 'listening', duration: 12, completed: false },
      { id: 'de-reading-2', title: '阅读理解：Die deutsche Arbeitskultur', type: 'reading', duration: 12, completed: false },
    ],
  },
  // ============ 意大利语 ============
  {
    id: 'it-beginner-1',
    title: '意大利语入门：艺术与生活',
    language: 'italian',
    level: 'beginner',
    description: '学习意大利语基础，感受艺术之国的语言魅力。',
    duration: 40,
    progress: 0,
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Italian%20language%20Rome%20art%20renaissance%20warm%20tones&image_size=landscape_16_9',
    rating: 4.8,
    students: 3200,
    modules: [
      { id: 'it-vocab-1', title: '基础词汇', type: 'vocabulary', duration: 10, completed: false },
      { id: 'it-grammar-1', title: '基础语法', type: 'grammar', duration: 12, completed: false },
      { id: 'it-speaking-1', title: '日常会话', type: 'speaking', duration: 10, completed: false },
      { id: 'it-listening-1', title: '听力入门', type: 'listening', duration: 8, completed: false },
      { id: 'it-reading-1', title: '阅读理解：Una mattina a Roma', type: 'reading', duration: 8, completed: false },
    ],
  },
  // ============ 葡萄牙语 ============
  {
    id: 'pt-beginner-1',
    title: '葡萄牙语入门：巴西风情',
    language: 'portuguese',
    level: 'beginner',
    description: '学习葡语发音和基础会话，领略巴西和葡萄牙文化。',
    duration: 42,
    progress: 0,
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Portuguese%20language%20Brazil%20carnival%20beach%20vibrant&image_size=landscape_16_9',
    rating: 4.7,
    students: 2800,
    modules: [
      { id: 'pt-vocab-1', title: '基础词汇', type: 'vocabulary', duration: 10, completed: false },
      { id: 'pt-grammar-1', title: '基础语法', type: 'grammar', duration: 12, completed: false },
      { id: 'pt-speaking-1', title: '日常会话', type: 'speaking', duration: 10, completed: false },
      { id: 'pt-listening-1', title: '听力入门', type: 'listening', duration: 10, completed: false },
      { id: 'pt-reading-1', title: '阅读理解：Uma manhã no Rio', type: 'reading', duration: 8, completed: false },
    ],
  },
  // ============ 俄语 ============
  {
    id: 'ru-beginner-1',
    title: '俄语入门：西里尔字母',
    language: 'russian',
    level: 'beginner',
    description: '学习俄语字母表和基础会话，打开东欧文化之窗。',
    duration: 45,
    progress: 0,
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Russian%20language%20Cyrillic%20Moscow%20winter%20classical&image_size=landscape_16_9',
    rating: 4.7,
    students: 3600,
    modules: [
      { id: 'ru-vocab-1', title: '基础词汇', type: 'vocabulary', duration: 12, completed: false },
      { id: 'ru-grammar-1', title: '基础语法', type: 'grammar', duration: 14, completed: false },
      { id: 'ru-speaking-1', title: '日常会话', type: 'speaking', duration: 10, completed: false },
      { id: 'ru-listening-1', title: '听力入门', type: 'listening', duration: 9, completed: false },
      { id: 'ru-reading-1', title: '阅读理解：Утро в Москве', type: 'reading', duration: 8, completed: false },
    ],
  },
  // ============ 阿拉伯语 ============
  // (已移除)
  // ============ 泰语 ============
  {
    id: 'th-beginner-1',
    title: '泰语入门：日常会话',
    language: 'thai',
    level: 'beginner',
    description: '学习泰语声调和基础会话，轻松应对泰国旅行。',
    duration: 38,
    progress: 0,
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Thai%20language%20Bangkok%20temple%20tropical%20colorful&image_size=landscape_16_9',
    rating: 4.6,
    students: 1900,
    modules: [
      { id: 'th-vocab-1', title: '基础词汇', type: 'vocabulary', duration: 10, completed: false },
      { id: 'th-grammar-1', title: '基础语法', type: 'grammar', duration: 10, completed: false },
      { id: 'th-speaking-1', title: '旅行会话', type: 'speaking', duration: 10, completed: false },
      { id: 'th-listening-1', title: '听力入门', type: 'listening', duration: 8, completed: false },
      { id: 'th-reading-1', title: '阅读理解：เช้าวันหนึ่งในกรุงเทพ', type: 'reading', duration: 8, completed: false },
    ],
  },
  // ============ 芬兰语 ============
  {
    id: 'fi-beginner-1',
    title: '芬兰语入门：北欧秘境',
    language: 'finnish',
    level: 'beginner',
    description: '学习芬兰语发音和基础会话，探索北欧设计与自然之美。',
    duration: 42,
    progress: 0,
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Finnish%20language%20Helsinki%20northern%20lights%20forest%20lake%20nordic&image_size=landscape_16_9',
    rating: 4.7,
    students: 1800,
    modules: [
      { id: 'fi-vocab-1', title: '基础词汇', type: 'vocabulary', duration: 10, completed: false },
      { id: 'fi-grammar-1', title: '基础语法', type: 'grammar', duration: 12, completed: false },
      { id: 'fi-speaking-1', title: '日常会话', type: 'speaking', duration: 10, completed: false },
      { id: 'fi-listening-1', title: '听力入门', type: 'listening', duration: 10, completed: false },
      { id: 'fi-reading-1', title: '阅读理解：Aamu Helsingissä', type: 'reading', duration: 8, completed: false },
    ],
  },
  {
    id: 'fi-intermediate-1',
    title: '芬兰语进阶：自然与文化',
    language: 'finnish',
    level: 'intermediate',
    description: '通过芬兰自然风光和设计文化学习进阶芬兰语。',
    duration: 48,
    progress: 0,
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Finland%20nature%20design%20sauna%20cabin%20nordic%20minimalist&image_size=landscape_16_9',
    rating: 4.6,
    students: 980,
    modules: [
      { id: 'fi-vocab-2', title: '文化词汇', type: 'vocabulary', duration: 12, completed: false },
      { id: 'fi-grammar-2', title: '进阶语法', type: 'grammar', duration: 12, completed: false },
      { id: 'fi-speaking-2', title: '情景对话', type: 'speaking', duration: 12, completed: false },
      { id: 'fi-listening-2', title: '自然听力', type: 'listening', duration: 12, completed: false },
      { id: 'fi-reading-2', title: '阅读理解：Suomen luonto ja kulttuuri', type: 'reading', duration: 12, completed: false },
    ],
  },
  // ============ 挪威语 ============
  {
    id: 'no-beginner-1',
    title: '挪威语入门：峡湾之国',
    language: 'norwegian',
    level: 'beginner',
    description: '学习挪威语发音和基础会话，领略峡湾与维京文化。',
    duration: 40,
    progress: 0,
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Norwegian%20language%20fjord%20mountains%20vikings%20nordic%20scenic&image_size=landscape_16_9',
    rating: 4.7,
    students: 1600,
    modules: [
      { id: 'no-vocab-1', title: '基础词汇', type: 'vocabulary', duration: 10, completed: false },
      { id: 'no-grammar-1', title: '基础语法', type: 'grammar', duration: 10, completed: false },
      { id: 'no-speaking-1', title: '日常会话', type: 'speaking', duration: 10, completed: false },
      { id: 'no-listening-1', title: '听力入门', type: 'listening', duration: 10, completed: false },
      { id: 'no-reading-1', title: '阅读理解：En morgen i Oslo', type: 'reading', duration: 8, completed: false },
    ],
  },
  {
    id: 'no-intermediate-1',
    title: '挪威语进阶：维京与现代',
    language: 'norwegian',
    level: 'intermediate',
    description: '深入了解挪威文化与社会，提升挪威语综合能力。',
    duration: 46,
    progress: 0,
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Norway%20Bergen%20cod%20oil%20modern%20society%20nordic&image_size=landscape_16_9',
    rating: 4.6,
    students: 850,
    modules: [
      { id: 'no-vocab-2', title: '社会词汇', type: 'vocabulary', duration: 12, completed: false },
      { id: 'no-grammar-2', title: '进阶语法', type: 'grammar', duration: 12, completed: false },
      { id: 'no-speaking-2', title: '情景对话', type: 'speaking', duration: 12, completed: false },
      { id: 'no-listening-2', title: '新闻听力', type: 'listening', duration: 10, completed: false },
      { id: 'no-reading-2', title: '阅读理解：Norsk kultur og samfunn', type: 'reading', duration: 12, completed: false },
    ],
  },
];

export const englishWords: Word[] = [
  { id: 'w1', word: 'Serendipity', meaning: '意外发现珍贵事物的运气', pronunciation: '/ˌserənˈdɪpəti/', example: 'Finding that book was pure serendipity.', difficulty: 3 },
  { id: 'w2', word: 'Ephemeral', meaning: '短暂的，瞬息的', pronunciation: '/ɪˈfemərəl/', example: 'Fame in the modern world is often ephemeral.', difficulty: 3 },
  { id: 'w3', word: 'Resilience', meaning: '恢复力，韧性', pronunciation: '/rɪˈzɪliəns/', example: 'Her resilience helped her overcome many challenges.', difficulty: 2 },
  { id: 'w4', word: 'Eloquent', meaning: '雄辩的，有说服力的', pronunciation: '/ˈeləkwənt/', example: 'He gave an eloquent speech at the conference.', difficulty: 2 },
  { id: 'w5', word: 'Meticulous', meaning: '一丝不苟的，细致的', pronunciation: '/məˈtɪkjələs/', example: 'She is meticulous about her work.', difficulty: 3 },
  { id: 'w6', word: 'Authentic', meaning: '真实的，正宗的', pronunciation: '/ɔːˈθentɪk/', example: 'This is an authentic Italian restaurant.', difficulty: 1 },
  { id: 'w7', word: 'Ambiguous', meaning: '模棱两可的，含糊的', pronunciation: '/æmˈbɪɡjuəs/', example: 'The message was deliberately ambiguous.', difficulty: 3 },
  { id: 'w8', word: 'Vibrant', meaning: '充满活力的，鲜艳的', pronunciation: '/ˈvaɪbrənt/', example: 'The city has a vibrant nightlife.', difficulty: 1 },
  { id: 'w9', word: 'Candid', meaning: '坦率的，直言不讳的', pronunciation: '/ˈkændɪd/', example: 'I appreciate your candid feedback.', difficulty: 2 },
  { id: 'w10', word: 'Nostalgia', meaning: '怀旧，乡愁', pronunciation: '/nɒˈstældʒə/', example: 'The song filled her with nostalgia.', difficulty: 2 },
];

export const japaneseWords: Word[] = [
  { id: 'jw1', word: '幸せ', meaning: '幸福', pronunciation: 'しあわせ (shiawase)', example: '家族と過ごす時間は幸せです。', difficulty: 1 },
  { id: 'jw2', word: '絆', meaning: '羁绊，纽带', pronunciation: 'きずな (kizuna)', example: '友達同士の絆は強いです。', difficulty: 2 },
  { id: 'jw3', word: '一期一会', meaning: '一生一次的相遇', pronunciation: 'いちごいちえ (ichigo ichie)', example: '茶道の精神は一期一会です。', difficulty: 3 },
  { id: 'jw4', word: '幽玄', meaning: '深奥，玄妙', pronunciation: 'ゆうげん (yuugen)', example: '日本の美意識には幽玄があります。', difficulty: 3 },
  { id: 'jw5', word: '風情', meaning: '情趣，韵味', pronunciation: 'ふぜい (fuzei)', example: 'この街は古き良き風情があります。', difficulty: 2 },
  { id: 'jw6', word: '儚い', meaning: '虚幻的，无常的', pronunciation: 'はかない (hakanai)', example: '春の雪は儚い美しさがあります。', difficulty: 2 },
  { id: 'jw7', word: '温かみ', meaning: '温暖，亲切', pronunciation: 'あたたかみ (atatakami)', example: 'この店には温かみがあります。', difficulty: 1 },
  { id: 'jw8', word: '寂しさ', meaning: '寂寞，孤独', pronunciation: 'さびしさ (sabishisa)', example: '一人暮らしは寂しさを感じることがあります。', difficulty: 1 },
  { id: 'jw9', word: '雅', meaning: '优雅，典雅', pronunciation: 'みやび (miyabi)', example: '日本の伝統文化には雅が重んじられます。', difficulty: 2 },
  { id: 'jw10', word: '真心', meaning: '真心，诚意', pronunciation: 'まごころ (magokoro)', example: '真心を込めて仕事をします。', difficulty: 1 },
];

export const koreanWords: Word[] = [
  { id: 'kw1', word: '사랑', meaning: '爱', pronunciation: 'sarang', example: '나는 너를 사랑해.', difficulty: 1 },
  { id: 'kw2', word: '인연', meaning: '缘分', pronunciation: 'inyeon', example: '우리는 좋은 인연을 맺었어.', difficulty: 2 },
  { id: 'kw3', word: '정감', meaning: '感情，情谊', pronunciation: 'jeonggam', example: '오랜 친구와의 정감이 깊다.', difficulty: 2 },
  { id: 'kw4', word: '아름다움', meaning: '美丽', pronunciation: 'areumdaum', example: '이 세상은 아름다움이 가득하다.', difficulty: 1 },
  { id: 'kw5', word: '기쁨', meaning: '喜悦', pronunciation: 'gippeum', example: '성공의 기쁨을 함께 나누자.', difficulty: 1 },
  { id: 'kw6', word: '열정', meaning: '热情', pronunciation: 'yeoljeong', example: '그녀는 열정적으로 일한다.', difficulty: 1 },
  { id: 'kw7', word: '평화', meaning: '和平', pronunciation: 'pyeonghwa', example: '우리 모두 평화를 원한다.', difficulty: 1 },
  { id: 'kw8', word: '희망', meaning: '希望', pronunciation: 'huimang', example: '희망을 잃지 마라.', difficulty: 1 },
  { id: 'kw9', word: '용기', meaning: '勇气', pronunciation: 'yonggi', example: '용기를 내어 시도해보자.', difficulty: 1 },
  { id: 'kw10', word: '자유', meaning: '自由', pronunciation: 'jayu', example: '자유는 소중한 것이다.', difficulty: 1 },
];

export const frenchWords: Word[] = [
  { id: 'fw1', word: 'Bonjour', meaning: '你好', pronunciation: '/bɔ̃.ʒuʁ/', example: 'Bonjour, comment allez-vous ?', difficulty: 1 },
  { id: 'fw2', word: 'Merci', meaning: '谢谢', pronunciation: '/mɛʁ.si/', example: 'Merci beaucoup pour votre aide.', difficulty: 1 },
  { id: 'fw3', word: 'Amour', meaning: '爱', pronunciation: '/a.muʁ/', example: "L'amour est universel.", difficulty: 1 },
  { id: 'fw4', word: 'Liberté', meaning: '自由', pronunciation: '/li.bɛʁ.te/', example: 'Liberté, égalité, fraternité.', difficulty: 2 },
  { id: 'fw5', word: 'Bonheur', meaning: '幸福', pronunciation: '/bɔ.nœʁ/', example: 'Le bonheur est simple.', difficulty: 2 },
  { id: 'fw6', word: 'Élégant', meaning: '优雅的', pronunciation: '/e.le.ɡɑ̃/', example: "Elle est très élégante ce soir.", difficulty: 2 },
  { id: 'fw7', word: 'Fromage', meaning: '奶酪', pronunciation: '/fʁɔ.maʒ/', example: "J'aime le fromage français.", difficulty: 1 },
  { id: 'fw8', word: 'Voyage', meaning: '旅行', pronunciation: '/vwa.jaʒ/', example: 'Bon voyage !', difficulty: 1 },
  { id: 'fw9', word: 'Rêve', meaning: '梦想', pronunciation: '/ʁɛv/', example: 'Fais de beaux rêves.', difficulty: 2 },
  { id: 'fw10', word: 'Magnifique', meaning: '壮丽的', pronunciation: '/ma.ɲi.fik/', example: 'La vue est magnifique.', difficulty: 2 },
];

export const spanishWords: Word[] = [
  { id: 'sw1', word: 'Hola', meaning: '你好', pronunciation: '/ˈo.la/', example: '¡Hola! ¿Cómo estás?', difficulty: 1 },
  { id: 'sw2', word: 'Gracias', meaning: '谢谢', pronunciation: '/ˈɡɾa.sjas/', example: 'Muchas gracias por todo.', difficulty: 1 },
  { id: 'sw3', word: 'Amor', meaning: '爱', pronunciation: '/aˈmoɾ/', example: 'El amor todo lo puede.', difficulty: 1 },
  { id: 'sw4', word: 'Familia', meaning: '家庭', pronunciation: '/faˈmi.lja/', example: 'Mi familia es muy unida.', difficulty: 1 },
  { id: 'sw5', word: 'Viaje', meaning: '旅行', pronunciation: '/ˈbja.xe/', example: 'Hicimos un viaje increíble.', difficulty: 2 },
  { id: 'sw6', word: 'Comida', meaning: '食物', pronunciation: '/koˈmi.ða/', example: 'La comida está deliciosa.', difficulty: 1 },
  { id: 'sw7', word: 'Música', meaning: '音乐', pronunciation: '/ˈmu.si.ka/', example: 'Me encanta la música latina.', difficulty: 1 },
  { id: 'sw8', word: 'Sueño', meaning: '梦想', pronunciation: '/ˈswe.ɲo/', example: 'Cumplí mi sueño.', difficulty: 2 },
  { id: 'sw9', word: 'Libertad', meaning: '自由', pronunciation: '/li.βeɾˈtað/', example: 'La libertad es importante.', difficulty: 2 },
  { id: 'sw10', word: 'Hermoso', meaning: '美丽的', pronunciation: '/eɾˈmo.so/', example: 'Qué día más hermoso.', difficulty: 2 },
];

export const germanWords: Word[] = [
  { id: 'dw1', word: 'Hallo', meaning: '你好', pronunciation: '/ˈhalo/', example: 'Hallo, wie geht es dir?', difficulty: 1 },
  { id: 'dw2', word: 'Danke', meaning: '谢谢', pronunciation: '/ˈdaŋkə/', example: 'Danke für deine Hilfe.', difficulty: 1 },
  { id: 'dw3', word: 'Liebe', meaning: '爱', pronunciation: '/ˈliːbə/', example: 'Liebe geht durch den Magen.', difficulty: 1 },
  { id: 'dw4', word: 'Freiheit', meaning: '自由', pronunciation: '/ˈfʁaɪ̯haɪ̯t/', example: 'Freiheit ist ein hohes Gut.', difficulty: 2 },
  { id: 'dw5', word: 'Reise', meaning: '旅行', pronunciation: '/ˈʁaɪ̯zə/', example: 'Gute Reise!', difficulty: 1 },
  { id: 'dw6', word: 'Musik', meaning: '音乐', pronunciation: '/muˈziːk/', example: 'Ich höre gerne Musik.', difficulty: 1 },
  { id: 'dw7', word: 'Traum', meaning: '梦想', pronunciation: '/tʁaʊ̯m/', example: 'Ich habe einen Traum.', difficulty: 2 },
  { id: 'dw8', word: 'Wunder', meaning: '奇迹', pronunciation: '/ˈvʊndɐ/', example: 'Es ist ein Wunder.', difficulty: 2 },
  { id: 'dw9', word: 'Heimat', meaning: '故乡', pronunciation: '/ˈhaɪ̯maːt/', example: 'Meine Heimat ist schön.', difficulty: 2 },
  { id: 'dw10', word: 'Kraft', meaning: '力量', pronunciation: '/kʁaft/', example: 'Gib nicht auf, habe Kraft.', difficulty: 2 },
];

export const italianWords: Word[] = [
  { id: 'iw1', word: 'Ciao', meaning: '你好/再见', pronunciation: '/tʃao/', example: 'Ciao, come stai?', difficulty: 1 },
  { id: 'iw2', word: 'Grazie', meaning: '谢谢', pronunciation: '/ˈɡrat.tsje/', example: 'Grazie mille!', difficulty: 1 },
  { id: 'iw3', word: 'Amore', meaning: '爱', pronunciation: '/aˈmo.re/', example: "L'amore è bello.", difficulty: 1 },
  { id: 'iw4', word: 'Famiglia', meaning: '家庭', pronunciation: '/faˈmiʎ.ʎa/', example: 'La mia famiglia è grande.', difficulty: 2 },
  { id: 'iw5', word: 'Cucina', meaning: '厨房/烹饪', pronunciation: '/kuˈtʃi.na/', example: 'La cucina italiana è famosa.', difficulty: 1 },
  { id: 'iw6', word: 'Bellezza', meaning: '美丽', pronunciation: '/belˈlet.tsːa/', example: 'Che bellezza!', difficulty: 2 },
  { id: 'iw7', word: 'Sogno', meaning: '梦想', pronunciation: '/ˈsoɲ.ɲo/', example: 'Ho un sogno.', difficulty: 2 },
  { id: 'iw8', word: 'Viaggio', meaning: '旅行', pronunciation: '/viˈad.dʒo/', example: 'Buon viaggio!', difficulty: 2 },
  { id: 'iw9', word: 'Musica', meaning: '音乐', pronunciation: '/ˈmu.zi.ka/', example: 'La musica mi piace.', difficulty: 1 },
  { id: 'iw10', word: 'Arte', meaning: '艺术', pronunciation: '/ˈar.te/', example: "L'arte italiana è famosa.", difficulty: 2 },
];

export const portugueseWords: Word[] = [
  { id: 'pw1', word: 'Olá', meaning: '你好', pronunciation: '/oˈla/', example: 'Olá, tudo bem?', difficulty: 1 },
  { id: 'pw2', word: 'Obrigado', meaning: '谢谢', pronunciation: '/obɾiˈɡadu/', example: 'Muito obrigado pela ajuda.', difficulty: 1 },
  { id: 'pw3', word: 'Amor', meaning: '爱', pronunciation: '/aˈmoɾ/', example: 'O amor é lindo.', difficulty: 1 },
  { id: 'pw4', word: 'Família', meaning: '家庭', pronunciation: '/faˈmiʎɐ/', example: 'Minha família é unida.', difficulty: 1 },
  { id: 'pw5', word: 'Praia', meaning: '海滩', pronunciation: '/ˈpɾajɐ/', example: 'Vamos à praia.', difficulty: 1 },
  { id: 'pw6', word: 'Música', meaning: '音乐', pronunciation: '/ˈmuzikɐ/', example: 'A música brasileira é animada.', difficulty: 1 },
  { id: 'pw7', word: 'Sonho', meaning: '梦想', pronunciation: '/ˈsoɲu/', example: 'Realizei meu sonho.', difficulty: 2 },
  { id: 'pw8', word: 'Viagem', meaning: '旅行', pronunciation: '/viˈaʒẽj/', example: 'Boa viagem!', difficulty: 2 },
  { id: 'pw9', word: 'Alegria', meaning: '快乐', pronunciation: '/aleˈɡɾiɐ/', example: 'Sinto muita alegria.', difficulty: 2 },
  { id: 'pw10', word: 'Beleza', meaning: '美丽', pronunciation: '/beˈlezɐ/', example: 'Que beleza de paisagem.', difficulty: 2 },
];

export const russianWords: Word[] = [
  { id: 'rw1', word: 'Привет', meaning: '你好', pronunciation: 'privet', example: 'Привет, как дела?', difficulty: 1 },
  { id: 'rw2', word: 'Спасибо', meaning: '谢谢', pronunciation: 'spasibo', example: 'Спасибо за помощь.', difficulty: 1 },
  { id: 'rw3', word: 'Любовь', meaning: '爱', pronunciation: 'lyubov', example: 'Любовь побеждает всё.', difficulty: 2 },
  { id: 'rw4', word: 'Свобода', meaning: '自由', pronunciation: 'svoboda', example: 'Свобода важна.', difficulty: 2 },
  { id: 'rw5', word: 'Семья', meaning: '家庭', pronunciation: "sem'ya", example: 'Моя семья большая.', difficulty: 1 },
  { id: 'rw6', word: 'Музыка', meaning: '音乐', pronunciation: 'muzyka', example: 'Я люблю музыку.', difficulty: 1 },
  { id: 'rw7', word: 'Мечта', meaning: '梦想', pronunciation: "mechta", example: 'Моя мечта сбылась.', difficulty: 2 },
  { id: 'rw8', word: 'Путешествие', meaning: '旅行', pronunciation: "puteshestviye", example: 'Путешествие было замечательным.', difficulty: 3 },
  { id: 'rw9', word: 'Дружба', meaning: '友谊', pronunciation: "druzhba", example: 'Дружба важна.', difficulty: 2 },
  { id: 'rw10', word: 'Счастье', meaning: '幸福', pronunciation: "schast'ye", example: 'Желаю тебе счастья.', difficulty: 2 },
];

export const arabicWords: Word[] = [];

export const thaiWords: Word[] = [
  { id: 'tw1', word: 'สวัสดี', meaning: '你好', pronunciation: 'sawatdee', example: 'สวัสดีครับ', difficulty: 1 },
  { id: 'tw2', word: 'ขอบคุณ', meaning: '谢谢', pronunciation: 'khob khun', example: 'ขอบคุณมาก', difficulty: 1 },
  { id: 'tw3', word: 'รัก', meaning: '爱', pronunciation: 'rak', example: 'ฉันรักคุณ', difficulty: 1 },
  { id: 'tw4', word: 'อาหาร', meaning: '食物', pronunciation: 'ahan', example: 'อาหารอร่อย', difficulty: 1 },
  { id: 'tw5', word: 'ทะเล', meaning: '海', pronunciation: 'thale', example: 'ไปเที่ยวทะเล', difficulty: 1 },
  { id: 'tw6', word: 'เพลง', meaning: '歌曲', pronunciation: 'phleng', example: 'เพลงนี้ดี', difficulty: 2 },
  { id: 'tw7', word: 'ฝัน', meaning: '梦想', pronunciation: 'fan', example: 'ฝันใหญ่', difficulty: 2 },
  { id: 'tw8', word: 'เพื่อน', meaning: '朋友', pronunciation: 'phuean', example: 'เพื่อนสนิท', difficulty: 1 },
  { id: 'tw9', word: 'สวย', meaning: '美丽', pronunciation: 'suai', example: 'สวยมาก', difficulty: 1 },
  { id: 'tw10', word: 'วัด', meaning: '寺庙', pronunciation: 'wat', example: 'ไปวัด', difficulty: 2 },
];

export const finnishWords: Word[] = [
  { id: 'fiw1', word: 'Hei', meaning: '你好', pronunciation: '/hei/', example: 'Hei, miten menee?', difficulty: 1 },
  { id: 'fiw2', word: 'Kiitos', meaning: '谢谢', pronunciation: '/ˈkiːtos/', example: 'Kiitos paljon.', difficulty: 1 },
  { id: 'fiw3', word: 'Rakkaus', meaning: '爱', pronunciation: '/ˈrakːaus/', example: 'Rakkaus on kaunista.', difficulty: 2 },
  { id: 'fiw4', word: 'Perhe', meaning: '家庭', pronunciation: '/ˈperhe/', example: 'Minun perheeni on iso.', difficulty: 2 },
  { id: 'fiw5', word: 'Ruoka', meaning: '食物', pronunciation: '/ˈruo̯ka/', example: 'Ruoka on hyvää.', difficulty: 1 },
  { id: 'fiw6', word: 'Musiikki', meaning: '音乐', pronunciation: '/ˈmusiːkːi/', example: 'Rakastan musiikkia.', difficulty: 2 },
  { id: 'fiw7', word: 'Unelma', meaning: '梦想', pronunciation: '/ˈunelma/', example: 'Unelmani toteutui.', difficulty: 2 },
  { id: 'fiw8', word: 'Matka', meaning: '旅行', pronunciation: '/ˈmatka/', example: 'Matka oli upea.', difficulty: 2 },
  { id: 'fiw9', word: 'Ystävä', meaning: '朋友', pronunciation: '/ˈystæʋæ/', example: 'Hän on hyvä ystävä.', difficulty: 2 },
  { id: 'fiw10', word: 'Kaunis', meaning: '美丽', pronunciation: '/ˈkɑu̯nis/', example: 'Maisema on kaunis.', difficulty: 2 },
];

export const norwegianWords: Word[] = [
  { id: 'now1', word: 'Hei', meaning: '你好', pronunciation: '/hei/', example: 'Hei, hvordan går det?', difficulty: 1 },
  { id: 'now2', word: 'Takk', meaning: '谢谢', pronunciation: '/takː/', example: 'Takk for hjelpen.', difficulty: 1 },
  { id: 'now3', word: 'Kjærlighet', meaning: '爱', pronunciation: '/ˈçæːɾliːheːt/', example: 'Kjærligheten er sterk.', difficulty: 2 },
  { id: 'now4', word: 'Familie', meaning: '家庭', pronunciation: '/faˈmiːljə/', example: 'Familien min er stor.', difficulty: 2 },
  { id: 'now5', word: 'Mat', meaning: '食物', pronunciation: '/mɑːt/', example: 'Maten er deilig.', difficulty: 1 },
  { id: 'now6', word: 'Musikk', meaning: '音乐', pronunciation: '/mʉˈsɪkː/', example: 'Jeg liker musikk.', difficulty: 2 },
  { id: 'now7', word: 'Drøm', meaning: '梦想', pronunciation: '/drœm/', example: 'Drømmen min ble virkelighet.', difficulty: 2 },
  { id: 'now8', word: 'Reise', meaning: '旅行', pronunciation: '/ˈɾæjsə/', example: 'Reisen var fantastisk.', difficulty: 2 },
  { id: 'now9', word: 'Venn', meaning: '朋友', pronunciation: '/ʋɛnː/', example: 'Han er en god venn.', difficulty: 1 },
  { id: 'now10', word: 'Vakker', meaning: '美丽', pronunciation: '/ˈʋakːəɾ/', example: 'Naturen er vakker.', difficulty: 2 },
];

export const vietnameseWords: Word[] = [];
export const indonesianWords: Word[] = [];
export const hindiWords: Word[] = [];
export const turkishWords: Word[] = [];

export const grammarQuestions: GrammarQuestion[] = [
  {
    id: 'g1',
    question: 'She ___ to the gym every morning.',
    options: ['go', 'goes', 'going', 'went'],
    correctAnswer: 1,
    explanation: '主语是第三人称单数(She)，谓语动词需要加s/es。',
  },
  {
    id: 'g2',
    question: 'If I ___ rich, I would travel the world.',
    options: ['am', 'was', 'were', 'be'],
    correctAnswer: 2,
    explanation: '这是虚拟语气，与现在事实相反，条件句中用were。',
  },
  {
    id: 'g3',
    question: 'The book ___ by many students.',
    options: ['reads', 'read', 'is read', 'reading'],
    correctAnswer: 2,
    explanation: '这是被动语态，结构是be + 过去分词。',
  },
  {
    id: 'g4',
    question: 'I have been learning English ___ five years.',
    options: ['since', 'for', 'in', 'during'],
    correctAnswer: 1,
    explanation: 'for + 时间段，since + 时间点。',
  },
  {
    id: 'g5',
    question: 'Neither the teacher nor the students ___ prepared.',
    options: ['was', 'were', 'is', 'are'],
    correctAnswer: 1,
    explanation: 'neither...nor...遵循就近原则，students是复数，所以用were。',
  },
];

export const speakingExercises: SpeakingExercise[] = [
  { id: 's1', text: 'Good morning! How are you today?' },
  { id: 's2', text: 'I would like to order a coffee, please.' },
  { id: 's3', text: 'Could you tell me where the nearest station is?' },
  { id: 's4', text: 'Nice to meet you. My name is John.' },
  { id: 's5', text: 'I really enjoy learning new languages.' },
];

export const listeningExercises: ListeningExercise[] = [
  {
    id: 'l1',
    title: 'Daily Conversation',
    transcript: 'A: Good morning, Sarah! How was your weekend? B: Hi Mike! It was great. I went hiking with my friends. A: That sounds fun! Where did you go? B: We went to the mountains north of the city. The view was amazing. A: I should go there sometime. B: You definitely should! We saw some beautiful waterfalls.',
    questions: [
      { id: 'lq1', question: 'What did Sarah do over the weekend?', options: ['She stayed at home', 'She went hiking', 'She visited her family', 'She studied'], correctAnswer: 1 },
      { id: 'lq2', question: 'Where did Sarah go hiking?', options: ['To the beach', 'To the mountains', 'To the park', 'To the forest'], correctAnswer: 1 },
      { id: 'lq3', question: 'What did they see?', options: ['Animals', 'Waterfalls', 'Birds', 'Lakes'], correctAnswer: 1 },
    ],
  },
  {
    id: 'l2',
    title: 'Weather Report',
    transcript: 'Good evening, this is your weather report. Tomorrow will be sunny with a high of 25 degrees Celsius. In the afternoon, there might be some light clouds, but no rain is expected. The wind will be light from the east. Perfect weather for outdoor activities! Don\'t forget to wear sunscreen.',
    questions: [
      { id: 'lq4', question: 'What will the weather be like tomorrow?', options: ['Rainy', 'Cloudy', 'Sunny', 'Stormy'], correctAnswer: 2 },
      { id: 'lq5', question: 'What is the expected high temperature?', options: ['20°C', '25°C', '30°C', '35°C'], correctAnswer: 1 },
      { id: 'lq6', question: 'What advice is given?', options: ['Bring an umbrella', 'Wear sunscreen', 'Stay indoors', 'Wear a coat'], correctAnswer: 1 },
    ],
  },
];

export const getCourseById = (id: string): Course | undefined => {
  return courses.find(course => course.id === id);
};

export const getCoursesByLanguage = (language: string): Course[] => {
  if (language === 'all') return courses;
  return courses.filter(course => course.language === language);
};

export const getCoursesByLevel = (level: string): Course[] => {
  if (level === 'all') return courses;
  return courses.filter(course => course.level === level);
};

export const getWordsByLanguage = (language: string): Word[] => {
  switch (language) {
    case 'english':
      return englishWords;
    case 'japanese':
      return japaneseWords;
    case 'korean':
      return koreanWords;
    case 'french':
      return frenchWords;
    case 'spanish':
      return spanishWords;
    case 'german':
      return germanWords;
    case 'italian':
      return italianWords;
    case 'portuguese':
      return portugueseWords;
    case 'russian':
      return russianWords;
    case 'thai':
      return thaiWords;
    case 'finnish':
      return finnishWords;
    case 'norwegian':
      return norwegianWords;
    default:
      return englishWords;
  }
};
