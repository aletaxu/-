import type {
  VocabTestQuestion,
  ListeningTestQuestion,
  SpeakingTestQuestion,
  AssessmentResult,
  SkillLevel,
} from '../types';

// ============ 词汇量测试题库（按难度分级 1-10）============
// 每个难度5题，共50题，测试时每个难度随机抽取2题，共20题
export const vocabTestQuestions: VocabTestQuestion[] = [
  // 难度1 - 初中基础
  { id: 'v1-1', word: 'apple', options: ['苹果', '香蕉', '橘子', '葡萄'], correctAnswer: 0, difficulty: 1 },
  { id: 'v1-2', word: 'teacher', options: ['学生', '医生', '老师', '工人'], correctAnswer: 2, difficulty: 1 },
  { id: 'v1-3', word: 'water', options: ['火', '水', '风', '土'], correctAnswer: 1, difficulty: 1 },
  { id: 'v1-4', word: 'book', options: ['书', '笔', '桌', '椅'], correctAnswer: 0, difficulty: 1 },
  { id: 'v1-5', word: 'happy', options: ['悲伤的', '快乐的', '生气的', '疲倦的'], correctAnswer: 1, difficulty: 1 },
  // 难度2 - 初中进阶
  { id: 'v2-1', word: 'beautiful', options: ['丑陋的', '美丽的', '聪明的', '勇敢的'], correctAnswer: 1, difficulty: 2 },
  { id: 'v2-2', word: 'remember', options: ['忘记', '记得', '学习', '教授'], correctAnswer: 1, difficulty: 2 },
  { id: 'v2-3', word: 'weather', options: ['天气', '季节', '温度', '气候'], correctAnswer: 0, difficulty: 2 },
  { id: 'v2-4', word: 'library', options: ['医院', '学校', '图书馆', '银行'], correctAnswer: 2, difficulty: 2 },
  { id: 'v2-5', word: 'between', options: ['在...上面', '在...之间', '在...外面', '在...下面'], correctAnswer: 1, difficulty: 2 },
  // 难度3 - 高中基础
  { id: 'v3-1', word: 'achieve', options: ['放弃', '实现', '推迟', '拒绝'], correctAnswer: 1, difficulty: 3 },
  { id: 'v3-2', word: 'environment', options: ['经济', '环境', '教育', '娱乐'], correctAnswer: 1, difficulty: 3 },
  { id: 'v3-3', word: 'necessary', options: ['可选的', '必要的', '额外的', '无关的'], correctAnswer: 1, difficulty: 3 },
  { id: 'v3-4', word: 'develop', options: ['破坏', '发展', '停止', '减少'], correctAnswer: 1, difficulty: 3 },
  { id: 'v3-5', word: 'knowledge', options: ['无知', '知识', '经验', '技能'], correctAnswer: 1, difficulty: 3 },
  // 难度4 - 高中进阶
  { id: 'v4-1', word: 'significant', options: ['微不足道的', '重要的', '常见的', '便宜的'], correctAnswer: 1, difficulty: 4 },
  { id: 'v4-2', word: 'opportunity', options: ['困难', '机会', '危险', '经验'], correctAnswer: 1, difficulty: 4 },
  { id: 'v4-3', word: 'represent', options: ['隐藏', '代表', '反对', '忽略'], correctAnswer: 1, difficulty: 4 },
  { id: 'v4-4', word: 'available', options: ['过时的', '可获得的', '禁止的', '损坏的'], correctAnswer: 1, difficulty: 4 },
  { id: 'v4-5', word: 'consider', options: ['拒绝', '考虑', '忘记', '怀疑'], correctAnswer: 1, difficulty: 4 },
  // 难度5 - 四级水平
  { id: 'v5-1', word: 'comprehensive', options: ['片面的', '综合的', '具体的', '抽象的'], correctAnswer: 1, difficulty: 5 },
  { id: 'v5-2', word: 'negotiate', options: ['战斗', '谈判', '逃跑', '投降'], correctAnswer: 1, difficulty: 5 },
  { id: 'v5-3', word: 'determine', options: ['犹豫', '决定', '放弃', '推迟'], correctAnswer: 1, difficulty: 5 },
  { id: 'v5-4', word: 'establish', options: ['拆除', '建立', '破坏', '关闭'], correctAnswer: 1, difficulty: 5 },
  { id: 'v5-5', word: 'previous', options: ['随后的', '先前的', '当前的', '未来的'], correctAnswer: 1, difficulty: 5 },
  // 难度6 - 六级水平
  { id: 'v6-1', word: 'ambiguity', options: ['清晰', '含糊', '确定', '精确'], correctAnswer: 1, difficulty: 6 },
  { id: 'v6-2', word: 'preliminary', options: ['最终的', '初步的', '详细的', '完成的'], correctAnswer: 1, difficulty: 6 },
  { id: 'v6-3', word: 'consequence', options: ['原因', '后果', '方法', '目的'], correctAnswer: 1, difficulty: 6 },
  { id: 'v6-4', word: 'emphasize', options: ['弱化', '强调', '忽略', '隐藏'], correctAnswer: 1, difficulty: 6 },
  { id: 'v6-5', word: 'fundamental', options: ['次要的', '基本的', '表面的', '附加的'], correctAnswer: 1, difficulty: 6 },
  // 难度7 - 考研/雅思
  { id: 'v7-1', word: 'ubiquitous', options: ['稀有的', '无处不在的', '过时的', '昂贵的'], correctAnswer: 1, difficulty: 7 },
  { id: 'v7-2', word: 'meticulous', options: ['粗心的', '一丝不苟的', '懒惰的', '随意的'], correctAnswer: 1, difficulty: 7 },
  { id: 'v7-3', word: 'scrutinize', options: ['忽略', '仔细审查', '赞美', '删除'], correctAnswer: 1, difficulty: 7 },
  { id: 'v7-4', word: 'plausible', options: ['不可能的', '貌似可信的', '荒谬的', '确定的'], correctAnswer: 1, difficulty: 7 },
  { id: 'v7-5', word: 'diligent', options: ['懒惰的', '勤奋的', '粗心的', '缓慢的'], correctAnswer: 1, difficulty: 7 },
  // 难度8 - 托福/GRE
  { id: 'v8-1', word: 'ephemeral', options: ['永恒的', '短暂的', '重要的', '明显的'], correctAnswer: 1, difficulty: 8 },
  { id: 'v8-2', word: 'pragmatic', options: ['理想的', '务实的', '浪漫的', '悲观的'], correctAnswer: 1, difficulty: 8 },
  { id: 'v8-3', word: 'ambiguous', options: ['明确的', '模糊的', '具体的', '清晰的'], correctAnswer: 1, difficulty: 8 },
  { id: 'v8-4', word: 'eccentric', options: ['正常的', '古怪的', '普通的', '保守的'], correctAnswer: 1, difficulty: 8 },
  { id: 'v8-5', word: 'innovative', options: ['传统的', '创新的', '过时的', '守旧的'], correctAnswer: 1, difficulty: 8 },
  // 难度9 - GRE进阶
  { id: 'v9-1', word: 'obfuscate', options: ['澄清', '混淆', '解释', '强调'], correctAnswer: 1, difficulty: 9 },
  { id: 'v9-2', word: 'recalcitrant', options: ['顺从的', '顽抗的', '友好的', '积极的'], correctAnswer: 1, difficulty: 9 },
  { id: 'v9-3', word: 'esoteric', options: ['通俗的', '深奥的', '常见的', '简单的'], correctAnswer: 1, difficulty: 9 },
  { id: 'v9-4', word: 'capricious', options: ['稳定的', '多变的', '坚定的', '可靠的'], correctAnswer: 1, difficulty: 9 },
  { id: 'v9-5', word: 'ostentatious', options: ['低调的', '炫耀的', '朴素的', '谦虚的'], correctAnswer: 1, difficulty: 9 },
  // 难度10 - 高级学术
  { id: 'v10-1', word: 'perspicacious', options: ['迟钝的', '敏锐的', '固执的', '胆小的'], correctAnswer: 1, difficulty: 10 },
  { id: 'v10-2', word: 'sesquipedalian', options: ['简短的', '冗长的', '清晰的', '简洁的'], correctAnswer: 1, difficulty: 10 },
  { id: 'v10-3', word: 'obstreperous', options: ['安静的', '吵闹的', '温顺的', '平和的'], correctAnswer: 1, difficulty: 10 },
  { id: 'v10-4', word: 'pulchritude', options: ['丑陋', '美丽', '平庸', '粗糙'], correctAnswer: 1, difficulty: 10 },
  { id: 'v10-5', word: 'quixotic', options: ['现实的', '不切实际的', '务实的', '理性的'], correctAnswer: 1, difficulty: 10 },
];

// ============ 听力测试题库（按难度分级 1-10）============
// 每个难度3题，共30题，测试时每个难度随机抽取1题，共10题
export const listeningTestQuestions: ListeningTestQuestion[] = [
  // 难度1-2 基础日常
  { id: 'l1-1', audioText: 'Hello, my name is Tom. I am a student. I like playing football.', question: 'Tom 喜欢做什么？', options: ['打篮球', '踢足球', '打网球', '游泳'], correctAnswer: 1, difficulty: 1 },
  { id: 'l1-2', audioText: 'Good morning! Today is Monday. We have a math class at ten o\'clock.', question: '今天周几有数学课？', options: ['周一', '周二', '周三', '周五'], correctAnswer: 0, difficulty: 1 },
  { id: 'l1-3', audioText: 'My favorite color is blue. I also like green and white.', question: '说话人最喜欢的颜色是什么？', options: ['绿色', '白色', '蓝色', '红色'], correctAnswer: 2, difficulty: 1 },
  { id: 'l2-1', audioText: 'I usually get up at seven o\'clock in the morning and have breakfast with my family.', question: '说话人通常几点起床？', options: ['六点', '七点', '八点', '九点'], correctAnswer: 1, difficulty: 2 },
  { id: 'l2-2', audioText: 'There are five people in my family: my parents, my elder sister, my younger brother and me.', question: '说话人家有几口人？', options: ['三口', '四口', '五口', '六口'], correctAnswer: 2, difficulty: 2 },
  { id: 'l2-3', audioText: 'The supermarket is next to the bank. You can walk there in five minutes.', question: '超市在哪里？', options: ['银行对面', '银行旁边', '学校旁边', '医院对面'], correctAnswer: 1, difficulty: 2 },
  // 难度3-4 日常对话
  { id: 'l3-1', audioText: 'Could you tell me where the nearest post office is? I need to send a package to my friend.', question: '说话人想要做什么？', options: ['寄信', '取快递', '寄包裹', '买邮票'], correctAnswer: 2, difficulty: 3 },
  { id: 'l3-2', audioText: 'I\'d like to book a table for four at seven this evening. Do you have any available seats by the window?', question: '说话人在做什么？', options: ['买电影票', '预订餐厅', '订酒店', '挂号'], correctAnswer: 1, difficulty: 3 },
  { id: 'l3-3', audioText: 'The bus to the airport comes every twenty minutes. The last one leaves at eleven at night.', question: '去机场的巴士多久一班？', options: ['十分钟', '十五分钟', '二十分钟', '半小时'], correctAnswer: 2, difficulty: 3 },
  { id: 'l4-1', audioText: 'The weather forecast says it will rain tomorrow, so we should cancel our picnic in the park.', question: '他们明天打算做什么？', options: ['去野餐', '取消野餐', '去公园', '看天气预报'], correctAnswer: 1, difficulty: 4 },
  { id: 'l4-2', audioText: 'I have been working on this project for two weeks, but I still need another week to finish it.', question: '说话人还需要多久完成项目？', options: ['一天', '三天', '一周', '两周'], correctAnswer: 2, difficulty: 4 },
  { id: 'l4-3', audioText: 'My flight was delayed by three hours due to heavy fog, so I didn\'t arrive until midnight.', question: '航班为什么延误？', options: ['大雨', '大雾', '大雪', '大风'], correctAnswer: 1, difficulty: 4 },
  // 难度5-6 四六级短文
  { id: 'l5-1', audioText: 'The company has decided to invest more resources in research and development to stay competitive in the global market.', question: '公司决定在哪个方面投入更多资源？', options: ['市场营销', '人力资源', '研发', '客户服务'], correctAnswer: 2, difficulty: 5 },
  { id: 'l5-2', audioText: 'According to a recent survey, over seventy percent of college students prefer online shopping to visiting physical stores.', question: '调查表明多少大学生更喜欢网购？', options: ['50%', '60%', '70%', '80%'], correctAnswer: 2, difficulty: 5 },
  { id: 'l5-3', audioText: 'The professor explained that effective time management is the key to balancing academic work and extracurricular activities.', question: '教授认为平衡学业和课外活动的关键是什么？', options: ['努力学习', '时间管理', '减少活动', '制定计划'], correctAnswer: 1, difficulty: 5 },
  { id: 'l6-1', audioText: 'Despite the economic downturn, the technology sector continued to grow, with several startups achieving remarkable success in artificial intelligence.', question: '在经济下行时哪个行业持续增长？', options: ['制造业', '房地产业', '科技行业', '农业'], correctAnswer: 2, difficulty: 6 },
  { id: 'l6-2', audioText: 'The new policy requires all employees to complete at least forty hours of professional training each year to enhance their skills.', question: '新政策要求员工每年完成多少小时培训？', options: ['20小时', '30小时', '40小时', '50小时'], correctAnswer: 2, difficulty: 6 },
  { id: 'l6-3', audioText: 'Researchers have found that people who read regularly tend to have better memory and stronger analytical skills than non-readers.', question: '研究发现经常阅读的人有什么优势？', options: ['更强体力', '更好记忆力和分析能力', '更高收入', '更好社交'], correctAnswer: 1, difficulty: 6 },
  // 难度7-8 雅思托福讲座
  { id: 'l7-1', audioText: 'The phenomenon of climate change has led to unprecedented shifts in global weather patterns, resulting in more frequent extreme weather events such as hurricanes and droughts.', question: '气候变化导致了什么？', options: ['气温下降', '极端天气更频繁', '降雨增加', '风速降低'], correctAnswer: 1, difficulty: 7 },
  { id: 'l7-2', audioText: 'The lecture discussed how the industrial revolution transformed agricultural societies into urban ones, fundamentally changing social structures and economic systems.', question: '讲座提到工业革命带来了什么改变？', options: ['乡村化', '城市化', '农业化', '去工业化'], correctAnswer: 1, difficulty: 7 },
  { id: 'l7-3', audioText: 'Scientists have discovered that the migration patterns of certain bird species have shifted significantly due to rising global temperatures.', question: '什么导致鸟类迁徙模式改变？', options: ['栖息地减少', '全球变暖', '食物短缺', '天敌增多'], correctAnswer: 1, difficulty: 7 },
  { id: 'l8-1', audioText: 'The researcher\'s findings suggest that the cognitive benefits of bilingualism extend beyond language processing to include enhanced executive function and delayed onset of dementia.', question: '研究表明双语能力有什么额外好处？', options: ['提高记忆力', '增强执行力并延缓痴呆', '提高智商', '改善听力'], correctAnswer: 1, difficulty: 8 },
  { id: 'l8-2', audioText: 'The architectural innovation of the twentieth century was characterized by the integration of functional design with aesthetic considerations, moving away from pure decoration.', question: '20世纪建筑创新的特点是什么？', options: ['纯装饰', '功能与美学结合', '复古风格', '极简主义'], correctAnswer: 1, difficulty: 8 },
  { id: 'l8-3', audioText: 'Economic indicators suggest that the recovery from the recession will be gradual, with unemployment rates expected to remain elevated for the next two quarters.', question: '经济复苏的预期是怎样的？', options: ['快速复苏', '缓慢复苏', '无法复苏', '立即好转'], correctAnswer: 1, difficulty: 8 },
  // 难度9-10 高级学术
  { id: 'l9-1', audioText: 'The paradox arises when we consider that increasing automation, while boosting productivity, simultaneously exacerbates income inequality and social stratification.', question: '自动化增加带来了什么矛盾？', options: ['提高就业率', '加剧收入不平等', '降低生产力', '减少社会分层'], correctAnswer: 1, difficulty: 9 },
  { id: 'l9-2', audioText: 'The sociological research indicates that cultural homogenization, driven by globalization, threatens the preservation of indigenous traditions and local identities.', question: '全球化驱动的文化同质化威胁了什么？', options: ['经济发展', '本土传统保护', '技术进步', '国际贸易'], correctAnswer: 1, difficulty: 9 },
  { id: 'l9-3', audioText: 'The longitudinal study demonstrates that early childhood education interventions have sustained positive effects on academic achievement well into adulthood.', question: '纵向研究显示早期教育干预有什么效果？', options: ['短期效果', '持续到成年的积极影响', '无明显效果', '负面影响'], correctAnswer: 1, difficulty: 9 },
  { id: 'l10-1', audioText: 'The epistemological framework proposed by the philosopher challenges conventional wisdom by arguing that knowledge is not merely acquired through empirical observation but is constructed through social interaction.', question: '哲学家认为知识是如何获得的？', options: ['经验观察', '社会互动构建', '天赋观念', '逻辑推理'], correctAnswer: 1, difficulty: 10 },
  { id: 'l10-2', audioText: 'The ontological argument posits that existence is a predicate of perfection, a notion that has been both fiercely defended and rigorously refuted throughout the history of philosophy.', question: '本体论论证认为存在是什么？', options: ['偶然的', '完美的谓词', '幻觉', '无意义的'], correctAnswer: 1, difficulty: 10 },
  { id: 'l10-3', audioText: 'The hermeneutic approach to textual interpretation emphasizes the circular relationship between understanding the whole and comprehending its constituent parts.', question: '诠释学方法强调什么关系？', options: ['线性关系', '整体与部分的循环关系', '因果关系', '对立关系'], correctAnswer: 1, difficulty: 10 },
];

// ============ 口语测试题库（按难度分级 1-10）============
// 每个难度3题，共30题，测试时每个难度随机抽取1题，共10题
export const speakingTestQuestions: SpeakingTestQuestion[] = [
  { id: 's1-1', text: 'Hello, how are you?', difficulty: 1 },
  { id: 's1-2', text: 'Nice to meet you.', difficulty: 1 },
  { id: 's1-3', text: 'What is your name?', difficulty: 1 },
  { id: 's2-1', text: 'I would like a cup of coffee, please.', difficulty: 2 },
  { id: 's2-2', text: 'Can you help me with this?', difficulty: 2 },
  { id: 's2-3', text: 'It is a beautiful day today.', difficulty: 2 },
  { id: 's3-1', text: 'What time does the train leave for London?', difficulty: 3 },
  { id: 's3-2', text: 'I think we should go to the cinema tonight.', difficulty: 3 },
  { id: 's3-3', text: 'Could you please tell me the way to the station?', difficulty: 3 },
  { id: 's4-1', text: 'I have been studying English for three years.', difficulty: 4 },
  { id: 's4-2', text: 'She told me that she would arrive at the airport by noon.', difficulty: 4 },
  { id: 's4-3', text: 'The meeting was postponed because of the bad weather.', difficulty: 4 },
  { id: 's5-1', text: 'The conference will be held at the convention center next week.', difficulty: 5 },
  { id: 's5-2', text: 'I am looking forward to working with you on this project.', difficulty: 5 },
  { id: 's5-3', text: 'The results of the experiment exceeded our initial expectations.', difficulty: 5 },
  { id: 's6-1', text: 'Recent studies have shown that regular exercise can significantly improve mental health.', difficulty: 6 },
  { id: 's6-2', text: 'The government has implemented new policies to address the growing environmental concerns.', difficulty: 6 },
  { id: 's6-3', text: 'Students who participate in extracurricular activities tend to perform better academically.', difficulty: 6 },
  { id: 's7-1', text: 'The implementation of sustainable development requires cooperation between governments and corporations.', difficulty: 7 },
  { id: 's7-2', text: 'Cultural diversity enriches our society by bringing different perspectives and experiences together.', difficulty: 7 },
  { id: 's7-3', text: 'The rapid advancement of technology has fundamentally transformed how we communicate and work.', difficulty: 7 },
  { id: 's8-1', text: 'The intricate relationship between economic growth and environmental conservation remains a subject of intense debate among scholars.', difficulty: 8 },
  { id: 's8-2', text: 'Globalization has created unprecedented opportunities for international trade while also presenting significant challenges.', difficulty: 8 },
  { id: 's8-3', text: 'The discrepancy between theoretical models and empirical data warrants further investigation into the underlying assumptions.', difficulty: 8 },
  { id: 's9-1', text: 'Notwithstanding the preliminary nature of these findings, the implications for future research are profound and far-reaching.', difficulty: 9 },
  { id: 's9-2', text: 'The juxtaposition of contrasting methodologies highlights the inherent complexity of conducting interdisciplinary research.', difficulty: 9 },
  { id: 's9-3', text: 'Prevailing economic paradigms may prove inadequate when confronted with the unprecedented challenges of the twenty-first century.', difficulty: 9 },
  { id: 's10-1', text: 'The juxtaposition of contradictory philosophical paradigms necessitates a nuanced understanding of the underlying epistemological assumptions.', difficulty: 10 },
  { id: 's10-2', text: 'The hermeneutic circularity inherent in textual interpretation underscores the inexorable subjectivity of the interpretive endeavor.', difficulty: 10 },
  { id: 's10-3', text: 'The teleological implications of evolutionary theory continue to provoke vigorous discourse within both scientific and philosophical communities.', difficulty: 10 },
];

// ============ 随机抽题工具函数 ============

// Fisher-Yates 洗牌算法
export const shuffle = <T,>(arr: T[]): T[] => {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

// 从指定难度中随机抽取题目
const pickByDifficulty = <T extends { difficulty: number }>(questions: T[], perDifficulty: number): T[] => {
  const result: T[] = [];
  for (let d = 1; d <= 10; d++) {
    const pool = questions.filter(q => q.difficulty === d);
    const picked = shuffle(pool).slice(0, perDifficulty);
    result.push(...picked);
  }
  return shuffle(result);
};

// 打乱词汇题选项，同步更新正确答案索引
const shuffleVocabOptions = (question: VocabTestQuestion): VocabTestQuestion => {
  const correctOption = question.options[question.correctAnswer];
  const shuffledOptions = shuffle(question.options);
  const newCorrectIndex = shuffledOptions.indexOf(correctOption);
  return { ...question, options: shuffledOptions, correctAnswer: newCorrectIndex };
};

// 打乱听力题选项，同步更新正确答案索引
const shuffleListenOptions = (question: ListeningTestQuestion): ListeningTestQuestion => {
  const correctOption = question.options[question.correctAnswer];
  const shuffledOptions = shuffle(question.options);
  const newCorrectIndex = shuffledOptions.indexOf(correctOption);
  return { ...question, options: shuffledOptions, correctAnswer: newCorrectIndex };
};

/**
 * 生成一套随机词汇测试题
 * 每个难度随机抽2题，共20题，选项也打乱
 */
export const generateVocabQuestions = (): VocabTestQuestion[] => {
  return pickByDifficulty(vocabTestQuestions, 2).map(shuffleVocabOptions);
};

/**
 * 生成一套随机听力测试题
 * 每个难度随机抽1题，共10题，选项也打乱
 */
export const generateListeningQuestions = (): ListeningTestQuestion[] => {
  return pickByDifficulty(listeningTestQuestions, 1).map(shuffleListenOptions);
};

/**
 * 生成一套随机口语测试题
 * 每个难度随机抽1题，共10题
 */
export const generateSpeakingQuestions = (): SpeakingTestQuestion[] => {
  return pickByDifficulty(speakingTestQuestions, 1);
};

// ============ 根据测试结果计算能力等级 ============

export const calculateVocabLevel = (correctCount: number, totalCount: number): SkillLevel => {
  const ratio = correctCount / totalCount;
  const level = Math.max(1, Math.min(10, Math.ceil(ratio * 10)));
  return level as SkillLevel;
};

export const calculateListeningLevel = (correctCount: number, totalCount: number): SkillLevel => {
  const ratio = correctCount / totalCount;
  const level = Math.max(1, Math.min(10, Math.ceil(ratio * 10)));
  return level as SkillLevel;
};

export const calculateSpeakingLevel = (avgScore: number): SkillLevel => {
  const level = Math.max(1, Math.min(10, Math.ceil(avgScore / 10)));
  return level as SkillLevel;
};

// 根据词汇等级估算词汇量
export const estimateVocabSize = (vocabLevel: SkillLevel): number => {
  const mapping: Record<number, number> = {
    1: 300,
    2: 800,
    3: 1500,
    4: 2500,
    5: 4000,
    6: 5500,
    7: 7000,
    8: 9000,
    9: 12000,
    10: 15000,
  };
  return mapping[vocabLevel] || 500;
};

export const createAssessmentResult = (
  vocabCorrect: number,
  vocabTotal: number,
  listeningCorrect: number,
  listeningTotal: number,
  speakingAvgScore: number
): AssessmentResult => {
  const vocabularyLevel = calculateVocabLevel(vocabCorrect, vocabTotal);
  const listeningLevel = calculateListeningLevel(listeningCorrect, listeningTotal);
  const speakingLevel = calculateSpeakingLevel(speakingAvgScore);
  return {
    vocabularyLevel,
    listeningLevel,
    speakingLevel,
    estimatedVocabSize: estimateVocabSize(vocabularyLevel),
    completedAt: new Date().toISOString(),
  };
};
