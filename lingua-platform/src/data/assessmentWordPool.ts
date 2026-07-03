// 能力测评用的单词池 —— 按难度 1-10 分级
// 每个难度 15 个单词，测试时每个难度随机抽 2 个调用 Free Dictionary API 获取释义生成题目
//
// 难度对照：
// 1  - 初中基础 (CET 以下)
// 2  - 初中进阶
// 3  - 高中基础
// 4  - 高中进阶 / 四级起步
// 5  - 大学四级
// 6  - 大学六级
// 7  - 考研 / 雅思 6.5
// 8  - 托福 / 雅思 7+
// 9  - GRE 基础
// 10 - GRE 高级 / 学术词汇
//
// 这些单词会通过 Free Dictionary API (freedictionaryapi.com) 获取权威释义，
// 然后用释义作为选项生成选择题，确保每次题目都不同。

export const vocabWordPool: Record<number, string[]> = {
  1: [
    'apple', 'water', 'book', 'teacher', 'happy',
    'house', 'dog', 'cat', 'school', 'friend',
    'food', 'milk', 'tree', 'sun', 'mother',
  ],
  2: [
    'beautiful', 'weather', 'library', 'remember', 'between',
    'morning', 'breakfast', 'homework', 'weekend', 'holiday',
    'birthday', 'kitchen', 'garden', 'umbrella', 'calendar',
  ],
  3: [
    'achieve', 'environment', 'necessary', 'develop', 'knowledge',
    'consider', 'opportunity', 'previous', 'available', 'represent',
    'establish', 'determine', 'significant', 'comprehensive', 'negotiate',
  ],
  4: [
    'analyze', 'approach', 'concept', 'derive', 'establish',
    'factor', 'function', 'indicate', 'interpret', 'method',
    'principle', 'process', 'require', 'structure', 'theory',
  ],
  5: [
    'accommodate', 'attribute', 'benchmark', 'coherent', 'diminish',
    'endeavor', 'facilitate', 'hypothesis', 'implication', 'incorporate',
    'intrinsic', 'mitigate', 'paradigm', 'preliminary', 'subsequent',
  ],
  6: [
    'ambiguous', 'compulsory', 'consecutive', 'deteriorate', 'discrepancy',
    'eloquent', 'exquisite', 'formidable', 'futile', 'imminent',
    'meticulous', 'prevalent', 'profound', 'reluctant', 'stringent',
  ],
  7: [
    'ubiquitous', 'scrutinize', 'plausible', 'diligent', 'eloquent',
    'frugal', 'gregarious', 'hapless', 'inveterate', 'juxtapose',
    'magnanimous', 'nostalgia', 'obstinate', 'pragmatic', 'quintessential',
  ],
  8: [
    'ephemeral', 'esoteric', 'eccentric', 'ambiguous', 'capricious',
    'diatribe', 'enigma', 'fastidious', 'garrulous', 'iconoclast',
    'lassitude', 'mellifluous', 'nebulous', 'ostensible', 'perfunctory',
  ],
  9: [
    'obfuscate', 'recalcitrant', 'esoteric', 'capricious', 'ostentatious',
    'perspicacious', 'quixotic', 'recant', 'soporific', 'trenchant',
    'ubiquitous', 'venerate', 'wistful', 'zenith', 'abjure',
  ],
  10: [
    'perspicacious', 'sesquipedalian', 'obstreperous', 'pulchritude', 'quixotic',
    'obfuscate', 'magnanimous', 'sycophant', 'truculent', 'vacillate',
    'winsome', 'xenophobia', 'yokel', 'zealot', 'abrogation',
  ],
};

// 听力测试用的句子池 —— 按难度 1-10 分级
// 每个难度 6 句，测试时每个难度随机抽 1 句，调用 TTS 播放
// 听力题的选项由本地题库提供（API 没有合适的中文听力题数据）
export const listeningSentencePool: Record<number, string[]> = {
  1: [
    'Hello, my name is Tom. I am a student. I like playing football.',
    'Good morning! Today is Monday. We have a math class at ten o\'clock.',
    'My favorite color is blue. I also like green and white.',
    'There are five people in my family: my parents, my sister, my brother and me.',
    'I usually get up at seven o\'clock and have breakfast with my family.',
    'The supermarket is next to the bank. You can walk there in five minutes.',
  ],
  2: [
    'I\'d like to book a table for four at seven this evening.',
    'Could you tell me where the nearest post office is? I need to send a package.',
    'The bus to the airport comes every twenty minutes.',
    'I usually go to the gym three times a week to stay healthy.',
    'The weather forecast says it will rain tomorrow, so we should cancel our picnic.',
    'My flight was delayed by three hours due to heavy fog.',
  ],
  3: [
    'The professor explained that effective time management is the key to balancing academic work.',
    'I have been working on this project for two weeks, but I still need another week.',
    'According to a recent survey, over seventy percent of college students prefer online shopping.',
    'The new policy requires all employees to complete at least forty hours of training each year.',
    'Researchers have found that people who read regularly tend to have better memory.',
    'The company has decided to invest more resources in research and development.',
  ],
  4: [
    'Despite the economic downturn, the technology sector continued to grow rapidly.',
    'Scientists have discovered that the migration patterns of certain bird species have shifted.',
    'The lecture discussed how the industrial revolution transformed agricultural societies into urban ones.',
    'The phenomenon of climate change has led to unprecedented shifts in global weather patterns.',
    'The architectural innovation of the twentieth century was characterized by functional design.',
    'Economic indicators suggest that the recovery from the recession will be gradual.',
  ],
  5: [
    'The researcher\'s findings suggest that the cognitive benefits of bilingualism extend beyond language processing.',
    'The paradox arises when we consider that increasing automation simultaneously exacerbates income inequality.',
    'The sociological research indicates that cultural homogenization threatens the preservation of indigenous traditions.',
    'The longitudinal study demonstrates that early childhood education interventions have sustained positive effects.',
    'The epistemological framework proposed by the philosopher challenges conventional wisdom about knowledge.',
    'The ontological argument posits that existence is a predicate of perfection.',
  ],
};

// 每个难度对应的听力问题模板（关键词+正确答案+干扰项）
// 由于听力需要中文选项，这里保留本地数据结构
export interface ListeningTemplate {
  audioText: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

// 口语测试用的句子池 —— 按难度 1-10 分级
// 每个难度 4 句，测试时每个难度随机抽 1 句供跟读
export const speakingSentencePool: Record<number, string[]> = {
  1: [
    'Hello, how are you today?',
    'Nice to meet you. My name is John.',
    'What is your favorite color?',
    'I would like a cup of coffee, please.',
  ],
  2: [
    'Can you help me with this problem?',
    'It is a beautiful day today, isn\'t it?',
    'I usually go to the gym after work.',
    'What time does the movie start?',
  ],
  3: [
    'I have been learning English for three years.',
    'Could you please explain this concept to me?',
    'The weather has been unusually warm this week.',
    'I am looking forward to the summer vacation.',
  ],
  4: [
    'The conference will be held in Shanghai next month.',
    'Recent studies have shown that exercise improves mental health.',
    'I am writing to inquire about the job opportunity.',
    'The project requires careful planning and execution.',
  ],
  5: [
    'The implementation of this policy will benefit future generations.',
    'I am looking forward to working with you on this project.',
    'The results of the experiment exceeded our initial expectations.',
    'Her presentation highlighted the importance of sustainable development.',
  ],
  6: [
    'Recent studies have shown that regular exercise can significantly improve mental health.',
    'The government has implemented new policies to address environmental concerns.',
    'Students who participate in extracurricular activities tend to perform better academically.',
    'The discrepancy between theory and practice requires further investigation.',
  ],
  7: [
    'The implementation of sustainable development requires cooperation between governments and corporations.',
    'Cultural diversity enriches our society by bringing different perspectives together.',
    'The rapid advancement of technology has fundamentally transformed how we communicate.',
    'Notwithstanding the challenges, the researchers remained optimistic about the outcome.',
  ],
  8: [
    'The intricate relationship between economic growth and environmental conservation remains a subject of debate.',
    'Globalization has created unprecedented opportunities for international trade while presenting significant challenges.',
    'The discrepancy between theoretical models and empirical data warrants further investigation.',
    'The paradigm shift in scientific thinking has opened up new avenues of research.',
  ],
  9: [
    'Notwithstanding the preliminary nature of these findings, the implications for future research are profound.',
    'The juxtaposition of contrasting methodologies highlights the inherent complexity of interdisciplinary research.',
    'Prevailing economic paradigms may prove inadequate when confronted with unprecedented challenges.',
    'The empirical evidence substantiates the theoretical framework proposed by the researchers.',
  ],
  10: [
    'The juxtaposition of contradictory philosophical paradigms necessitates a nuanced understanding of epistemological assumptions.',
    'The hermeneutic circularity inherent in textual interpretation underscores the inexorable subjectivity of interpretation.',
    'The teleological implications of evolutionary theory continue to provoke vigorous discourse within scientific communities.',
    'The ontological presuppositions underlying contemporary metaphysics warrant a critical reexamination.',
  ],
};

// 获取所有难度等级
export const getAllDifficultyLevels = (): number[] => {
  return Object.keys(vocabWordPool).map(Number).sort((a, b) => a - b);
};
