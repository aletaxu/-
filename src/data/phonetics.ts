// 英语音标数据：IPA 国际音标
// 区分英音（RP）和美音（GA），含发音要领、口型、例词
// 配合 PhoneticsPage 实现发音评测与矫正
//
// 数据来源：Cambridge/Longman 公开词典的 IPA 标注规范
// 例词均选用高频词，便于用户对照发音

export type PhonemeCategory = 'vowel' | 'consonant' | 'diphthong';

export interface PhonemeExample {
  word: string;            // 例词
  ipa: string;             // 例词中该音标的 IPA（含重音符号）
  meaning: string;         // 中文释义
}

export interface Phoneme {
  id: string;
  symbol: string;          // IPA 符号
  category: PhonemeCategory;
  // 英音/美音对照：相同音位的两种记法（多数一致，少数有差异）
  british?: string;        // 英音 IPA（与 symbol 不同时填）
  american?: string;       // 美音 IPA（与 symbol 不同时填）
  description: string;     // 发音要领（中文）
  mouthShape: string;      // 口型描述
  commonMistakes: string[]; // 中国学习者常见错误
  correctionTips: string[]; // 矫正建议
  examples: PhonemeExample[];
  // 分类标签：用于按组练习（短元音/长元音/双元音/清辅音/浊辅音等）
  group: string;
}

export const phonemes: Phoneme[] = [
  // ============ 单元音 · 短元音 ============
  {
    id: 'p-01',
    symbol: '/ɪ/',
    category: 'vowel',
    group: '短元音',
    description: '短促的 i 音，舌尖抵下齿，嘴唇微开，肌肉放松',
    mouthShape: '口微张，嘴角略向两边平展，比 /iː/ 更松',
    commonMistakes: [
      '发成中文「衣」的音，过于紧绷',
      '与 /iː/ 混淆，不分长短',
      '发成 /e/ 或 /ə/',
    ],
    correctionTips: [
      '放松舌头和嘴唇，不要刻意用力',
      '比 /iː/ 短一半，口型更小',
      '练习 ship / sheep 的最小对立对',
    ],
    examples: [
      { word: 'ship', ipa: '/ʃɪp/', meaning: '船' },
      { word: 'big', ipa: '/bɪɡ/', meaning: '大的' },
      { word: 'sit', ipa: '/sɪt/', meaning: '坐' },
      { word: 'give', ipa: '/ɡɪv/', meaning: '给' },
    ],
  },
  {
    id: 'p-02',
    symbol: '/e/',
    category: 'vowel',
    group: '短元音',
    description: '短促的 e 音，口型比 /ɪ/ 略大',
    mouthShape: '口半开，嘴角平展',
    commonMistakes: [
      '发成中文「诶」的二合元音',
      '与 /ɪ/ 混淆',
    ],
    correctionTips: [
      '保持单一元音，不要滑动',
      '口型介于 /ɪ/ 和 /æ/ 之间',
    ],
    examples: [
      { word: 'bed', ipa: '/bed/', meaning: '床' },
      { word: 'red', ipa: '/red/', meaning: '红色的' },
      { word: 'pen', ipa: '/pen/', meaning: '钢笔' },
      { word: 'head', ipa: '/hed/', meaning: '头' },
    ],
  },
  {
    id: 'p-03',
    symbol: '/æ/',
    category: 'vowel',
    group: '短元音',
    description: 'a 的开音，口型较大，介于 /e/ 和 /ɑː/ 之间',
    mouthShape: '口大开，嘴角向两边拉，像微笑',
    commonMistakes: [
      '发成 /e/，口型不够大',
      '发成 /aɪ/，加入了滑音',
    ],
    correctionTips: [
      '刻意张大嘴巴，两指能竖着放进嘴里',
      '保持口型稳定，不要滑动',
    ],
    examples: [
      { word: 'cat', ipa: '/kæt/', meaning: '猫' },
      { word: 'bad', ipa: '/bæd/', meaning: '坏的' },
      { word: 'man', ipa: '/mæn/', meaning: '男人' },
      { word: 'hat', ipa: '/hæt/', meaning: '帽子' },
    ],
  },
  {
    id: 'p-04',
    symbol: '/ʌ/',
    category: 'vowel',
    group: '短元音',
    description: '短促的 a 音，口型中性，舌头居中',
    mouthShape: '口半开，嘴唇自然放松',
    commonMistakes: [
      '发成 /ɑː/，过长',
      '发成中文「啊」',
    ],
    correctionTips: [
      '短促有力，一闪而过',
      '比 /ɑː/ 口型小、更靠前',
    ],
    examples: [
      { word: 'cup', ipa: '/kʌp/', meaning: '杯子' },
      { word: 'but', ipa: '/bʌt/', meaning: '但是' },
      { word: 'sun', ipa: '/sʌn/', meaning: '太阳' },
      { word: 'love', ipa: '/lʌv/', meaning: '爱' },
    ],
  },
  {
    id: 'p-05',
    symbol: '/ʊ/',
    category: 'vowel',
    group: '短元音',
    description: '短促的 u 音，嘴唇微圆',
    mouthShape: '嘴唇略圆，比 /uː/ 更松',
    commonMistakes: [
      '发成 /uː/，过长',
      '发成中文「乌」',
    ],
    correctionTips: [
      '短促，嘴唇不要突出',
      '练习 full / fool 的最小对立对',
    ],
    examples: [
      { word: 'book', ipa: '/bʊk/', meaning: '书' },
      { word: 'good', ipa: '/ɡʊd/', meaning: '好的' },
      { word: 'put', ipa: '/pʊt/', meaning: '放' },
      { word: 'look', ipa: '/lʊk/', meaning: '看' },
    ],
  },
  {
    id: 'p-06',
    symbol: '/ə/',
    category: 'vowel',
    group: '短元音',
    description: '中央元音（schwa），最常见，发音最弱',
    mouthShape: '嘴唇完全放松，口型中性',
    commonMistakes: [
      '按照拼写发音，重读了弱读 syllable',
      '不知道弱读规则',
    ],
    correctionTips: [
      '所有非重读的元音都可弱化为 /ə/',
      '练习 about /əˈbaʊt/ 的第一个 a',
    ],
    examples: [
      { word: 'about', ipa: '/əˈbaʊt/', meaning: '关于' },
      { word: 'sofa', ipa: '/ˈsoʊfə/', meaning: '沙发' },
      { word: 'teacher', ipa: '/ˈtiːtʃər/', meaning: '老师' },
      { word: 'open', ipa: '/ˈoʊpən/', meaning: '打开' },
    ],
  },

  // ============ 单元音 · 长元音 ============
  {
    id: 'p-07',
    symbol: '/iː/',
    category: 'vowel',
    group: '长元音',
    description: '长 i 音，嘴角向两边拉，肌肉紧张',
    mouthShape: '口微张，嘴角用力向两边拉，像微笑',
    commonMistakes: [
      '不够长，与 /ɪ/ 不分',
      '发成中文「衣」，不够紧张',
    ],
    correctionTips: [
      '刻意拉长，约为 /ɪ/ 的两倍',
      '嘴角用力向两边拉，微笑状',
    ],
    examples: [
      { word: 'sheep', ipa: '/ʃiːp/', meaning: '羊' },
      { word: 'see', ipa: '/siː/', meaning: '看见' },
      { word: 'green', ipa: '/ɡriːn/', meaning: '绿色的' },
      { word: 'tree', ipa: '/triː/', meaning: '树' },
    ],
  },
  {
    id: 'p-08',
    symbol: '/ɑː/',
    category: 'vowel',
    group: '长元音',
    british: '/ɑː/',
    american: '/ɑr/',  // 美音在 r 前卷舌
    description: '长 a 音，口大开，舌头后缩',
    mouthShape: '口大开，嘴唇自然放松',
    commonMistakes: [
      '发成 /æ/，口型不够大',
      '美音中漏掉卷舌 r',
    ],
    correctionTips: [
      '口型比 /æ/ 更大更圆',
      '美音中带 r 的要卷舌（car /kɑr/）',
    ],
    examples: [
      { word: 'car', ipa: '/kɑː/', meaning: '汽车' },
      { word: 'far', ipa: '/fɑːr/', meaning: '远的' },
      { word: 'father', ipa: '/ˈfɑːðər/', meaning: '父亲' },
      { word: 'ask', ipa: '/ɑːsk/', meaning: '问' },
    ],
  },
  {
    id: 'p-09',
    symbol: '/ɔː/',
    category: 'vowel',
    group: '长元音',
    british: '/ɔː/',
    american: '/ɔr/',
    description: '长 o 音，嘴唇圆',
    mouthShape: '嘴唇圆撮，向前突出',
    commonMistakes: [
      '发成 /əʊ/ 双元音',
      '不够长',
    ],
    correctionTips: [
      '保持单一元音，不滑动',
      '嘴唇圆撮向前',
    ],
    examples: [
      { word: 'door', ipa: '/dɔːr/', meaning: '门' },
      { word: 'law', ipa: '/lɔː/', meaning: '法律' },
      { word: 'more', ipa: '/mɔːr/', meaning: '更多' },
      { word: 'talk', ipa: '/tɔːk/', meaning: '谈话' },
    ],
  },
  {
    id: 'p-10',
    symbol: '/uː/',
    category: 'vowel',
    group: '长元音',
    description: '长 u 音，嘴唇圆撮向前',
    mouthShape: '嘴唇圆撮向前突出',
    commonMistakes: [
      '不够长',
      '发成中文「乌」，不够前',
    ],
    correctionTips: [
      '刻意拉长',
      '嘴唇向前突出，比中文「乌」更前',
    ],
    examples: [
      { word: 'food', ipa: '/fuːd/', meaning: '食物' },
      { word: 'blue', ipa: '/bluː/', meaning: '蓝色的' },
      { word: 'moon', ipa: '/muːn/', meaning: '月亮' },
      { word: 'school', ipa: '/skuːl/', meaning: '学校' },
    ],
  },
  {
    id: 'p-11',
    symbol: '/ɜː/',
    category: 'vowel',
    group: '长元音',
    british: '/ɜː/',
    american: '/ɜr/',  // 美音卷舌
    description: '中央长元音，舌头居中，嘴唇不圆',
    mouthShape: '嘴唇自然放松，略开',
    commonMistakes: [
      '美音中漏掉卷舌 r',
      '发成 /ɔː/',
    ],
    correctionTips: [
      '美音中必须卷舌（bird /bɜrd/）',
      '英音不卷舌，纯元音',
    ],
    examples: [
      { word: 'bird', ipa: '/bɜːd/', meaning: '鸟' },
      { word: 'word', ipa: '/wɜːd/', meaning: '单词' },
      { word: 'her', ipa: '/hɜːr/', meaning: '她的' },
      { word: 'learn', ipa: '/lɜːn/', meaning: '学习' },
    ],
  },

  // ============ 双元音 ============
  {
    id: 'p-12',
    symbol: '/eɪ/',
    category: 'diphthong',
    group: '双元音',
    description: '由 /e/ 滑向 /ɪ/',
    mouthShape: '从半开到微合，嘴角向两边',
    commonMistakes: [
      '发成单元音 /e/',
      '滑动不够',
    ],
    correctionTips: [
      '明显滑动，从 /e/ 到 /ɪ/',
      '结尾嘴角向两边拉',
    ],
    examples: [
      { word: 'day', ipa: '/deɪ/', meaning: '白天' },
      { word: 'name', ipa: '/neɪm/', meaning: '名字' },
      { word: 'make', ipa: '/meɪk/', meaning: '制作' },
      { word: 'say', ipa: '/seɪ/', meaning: '说' },
    ],
  },
  {
    id: 'p-13',
    symbol: '/aɪ/',
    category: 'diphthong',
    group: '双元音',
    description: '由 /ɑː/ 滑向 /ɪ/',
    mouthShape: '从大开到微合',
    commonMistakes: [
      '发成中文「爱」，起点太靠前',
      '滑动方向不对',
    ],
    correctionTips: [
      '起点是后 a（/ɑː/），不是前 a',
      '滑动到 /ɪ/，不是 /iː/',
    ],
    examples: [
      { word: 'my', ipa: '/maɪ/', meaning: '我的' },
      { word: 'time', ipa: '/taɪm/', meaning: '时间' },
      { word: 'like', ipa: '/laɪk/', meaning: '喜欢' },
      { word: 'high', ipa: '/haɪ/', meaning: '高的' },
    ],
  },
  {
    id: 'p-14',
    symbol: '/ɔɪ/',
    category: 'diphthong',
    group: '双元音',
    description: '由 /ɔː/ 滑向 /ɪ/',
    mouthShape: '从圆到展',
    commonMistakes: [
      '发成 /oʊ/ + /i/',
      '起点不够圆',
    ],
    correctionTips: [
      '起点是圆唇 /ɔː/',
      '滑动到 /ɪ/',
    ],
    examples: [
      { word: 'boy', ipa: '/bɔɪ/', meaning: '男孩' },
      { word: 'toy', ipa: '/tɔɪ/', meaning: '玩具' },
      { word: 'enjoy', ipa: '/ɪnˈdʒɔɪ/', meaning: '享受' },
      { word: 'oil', ipa: '/ɔɪl/', meaning: '油' },
    ],
  },
  {
    id: 'p-15',
    symbol: '/aʊ/',
    category: 'diphthong',
    group: '双元音',
    description: '由 /ɑː/ 滑向 /ʊ/',
    mouthShape: '从大开到圆',
    commonMistakes: [
      '发成中文「奥」',
      '终点不够圆',
    ],
    correctionTips: [
      '终点是圆唇 /ʊ/',
      '从后 a 开始',
    ],
    examples: [
      { word: 'now', ipa: '/naʊ/', meaning: '现在' },
      { word: 'house', ipa: '/haʊs/', meaning: '房子' },
      { word: 'how', ipa: '/haʊ/', meaning: '如何' },
      { word: 'cow', ipa: '/kaʊ/', meaning: '奶牛' },
    ],
  },
  {
    id: 'p-16',
    symbol: '/əʊ/',
    category: 'diphthong',
    group: '双元音',
    british: '/əʊ/',
    american: '/oʊ/',  // 美音起点更高
    description: '由 /ə/ 滑向 /ʊ/（英音），或 /o/ 滑向 /ʊ/（美音）',
    mouthShape: '从中到圆',
    commonMistakes: [
      '发成单元音 /ɔː/',
      '英美音起点不分',
    ],
    correctionTips: [
      '英音起点是 /ə/（较松）',
      '美音起点是 /o/（较高较紧）',
    ],
    examples: [
      { word: 'go', ipa: '/ɡoʊ/', meaning: '去' },
      { word: 'no', ipa: '/noʊ/', meaning: '不' },
      { word: 'home', ipa: '/hoʊm/', meaning: '家' },
      { word: 'phone', ipa: '/foʊn/', meaning: '电话' },
    ],
  },
  {
    id: 'p-17',
    symbol: '/ɪə/',
    category: 'diphthong',
    group: '双元音',
    british: '/ɪə/',
    american: '/ɪr/',  // 美音卷舌
    description: '由 /ɪ/ 滑向 /ə/（英音），美音卷舌',
    mouthShape: '从展到中',
    commonMistakes: [
      '美音漏卷舌',
      '英音不够滑动',
    ],
    correctionTips: [
      '美音中 here /hɪr/ 必须卷舌',
      '英音 here /hɪə/ 不卷舌',
    ],
    examples: [
      { word: 'here', ipa: '/hɪər/', meaning: '这里' },
      { word: 'near', ipa: '/nɪər/', meaning: '近的' },
      { word: 'idea', ipa: '/aɪˈdɪə/', meaning: '主意' },
      { word: 'beer', ipa: '/bɪər/', meaning: '啤酒' },
    ],
  },
  {
    id: 'p-18',
    symbol: '/eə/',
    category: 'diphthong',
    group: '双元音',
    british: '/eə/',
    american: '/er/',
    description: '由 /e/ 滑向 /ə/（英音），美音卷舌',
    mouthShape: '从半开到中',
    commonMistakes: [
      '美音漏卷舌',
      '发成 /eɪ/',
    ],
    correctionTips: [
      '美音中 hair /her/ 卷舌',
      '英音 hair /heə/ 滑动',
    ],
    examples: [
      { word: 'hair', ipa: '/heər/', meaning: '头发' },
      { word: 'care', ipa: '/keər/', meaning: '关心' },
      { word: 'air', ipa: '/eər/', meaning: '空气' },
      { word: 'where', ipa: '/weər/', meaning: '哪里' },
    ],
  },
  {
    id: 'p-19',
    symbol: '/ʊə/',
    category: 'diphthong',
    group: '双元音',
    british: '/ʊə/',
    american: '/ʊr/',
    description: '由 /ʊ/ 滑向 /ə/（英音），美音卷舌',
    mouthShape: '从圆到中',
    commonMistakes: [
      '美音漏卷舌',
      '逐渐消失，被 /ɔːr/ 替代',
    ],
    correctionTips: [
      '美音中 tour /tʊr/ 卷舌',
      '现代英音也常合并到 /ɔː/',
    ],
    examples: [
      { word: 'tour', ipa: '/tʊər/', meaning: '旅行' },
      { word: 'pure', ipa: '/pjʊər/', meaning: '纯的' },
      { word: 'sure', ipa: '/ʃʊər/', meaning: '确定的' },
      { word: 'cure', ipa: '/kjʊər/', meaning: '治愈' },
    ],
  },

  // ============ 辅音 · 清辅音/浊辅音成对 ============
  {
    id: 'p-20',
    symbol: '/p/',
    category: 'consonant',
    group: '清辅音',
    description: '双唇紧闭，气流冲开，声带不振动',
    mouthShape: '双唇紧闭，突然放开',
    commonMistakes: [
      '发成中文「坡」，加了元音',
      '送气不足',
    ],
    correctionTips: [
      '末尾不要加元音 /ə/',
      '词首要送气（放一张纸在嘴前会动）',
    ],
    examples: [
      { word: 'pen', ipa: '/pen/', meaning: '钢笔' },
      { word: 'cup', ipa: '/kʌp/', meaning: '杯子' },
      { word: 'put', ipa: '/pʊt/', meaning: '放' },
      { word: 'stop', ipa: '/stɒp/', meaning: '停止' },
    ],
  },
  {
    id: 'p-21',
    symbol: '/b/',
    category: 'consonant',
    group: '浊辅音',
    description: '与 /p/ 口型相同，但声带振动',
    mouthShape: '双唇紧闭，突然放开',
    commonMistakes: [
      '清浊不分，与 /p/ 混',
      '末尾加元音',
    ],
    correctionTips: [
      '摸喉咙，感受声带振动',
      '词末不送气，只振动',
    ],
    examples: [
      { word: 'book', ipa: '/bʊk/', meaning: '书' },
      { word: 'cab', ipa: '/kæb/', meaning: '出租车' },
      { word: 'big', ipa: '/bɪɡ/', meaning: '大的' },
      { word: 'lab', ipa: '/læb/', meaning: '实验室' },
    ],
  },
  {
    id: 'p-22',
    symbol: '/t/',
    category: 'consonant',
    group: '清辅音',
    description: '舌尖抵上齿龈，气流冲开',
    mouthShape: '舌尖抵上齿龈，突然放开',
    commonMistakes: [
      '发成中文「特」',
      '美音 flap T（water 中 /t/ 变 /d/）不会',
    ],
    correctionTips: [
      '末尾不加元音',
      '美音中两元音间 /t/ 变轻 /d/（water /ˈwɔːdər/）',
    ],
    examples: [
      { word: 'ten', ipa: '/ten/', meaning: '十' },
      { word: 'cat', ipa: '/kæt/', meaning: '猫' },
      { word: 'water', ipa: '/ˈwɔːtər/', meaning: '水' },
      { word: 'time', ipa: '/taɪm/', meaning: '时间' },
    ],
  },
  {
    id: 'p-23',
    symbol: '/d/',
    category: 'consonant',
    group: '浊辅音',
    description: '与 /t/ 口型相同，声带振动',
    mouthShape: '舌尖抵上齿龈，突然放开',
    commonMistakes: [
      '与 /t/ 清浊不分',
      '末尾加元音',
    ],
    correctionTips: [
      '摸喉咙感受振动',
      '词末只振动不送气',
    ],
    examples: [
      { word: 'day', ipa: '/deɪ/', meaning: '白天' },
      { word: 'bed', ipa: '/bed/', meaning: '床' },
      { word: 'dog', ipa: '/dɒɡ/', meaning: '狗' },
      { word: 'red', ipa: '/red/', meaning: '红色的' },
    ],
  },
  {
    id: 'p-24',
    symbol: '/k/',
    category: 'consonant',
    group: '清辅音',
    description: '舌后部抵软腭，气流冲开',
    mouthShape: '舌后部抵软腭，突然放开',
    commonMistakes: [
      '发成中文「克」',
      '送气不足',
    ],
    correctionTips: [
      '末尾不加元音',
      '词首送气',
    ],
    examples: [
      { word: 'key', ipa: '/kiː/', meaning: '钥匙' },
      { word: 'book', ipa: '/bʊk/', meaning: '书' },
      { word: 'cat', ipa: '/kæt/', meaning: '猫' },
      { word: 'school', ipa: '/skuːl/', meaning: '学校' },
    ],
  },
  {
    id: 'p-25',
    symbol: '/ɡ/',
    category: 'consonant',
    group: '浊辅音',
    description: '与 /k/ 口型相同，声带振动',
    mouthShape: '舌后部抵软腭，突然放开',
    commonMistakes: [
      '与 /k/ 清浊不分',
      '发成中文「哥」',
    ],
    correctionTips: [
      '摸喉咙感受振动',
      '末尾不加元音',
    ],
    examples: [
      { word: 'go', ipa: '/ɡoʊ/', meaning: '去' },
      { word: 'big', ipa: '/bɪɡ/', meaning: '大的' },
      { word: 'dog', ipa: '/dɒɡ/', meaning: '狗' },
      { word: 'girl', ipa: '/ɡɜːl/', meaning: '女孩' },
    ],
  },
  {
    id: 'p-26',
    symbol: '/f/',
    category: 'consonant',
    group: '清辅音',
    description: '上齿咬下唇，气流摩擦',
    mouthShape: '上齿轻咬下唇内侧',
    commonMistakes: [
      '咬得太重或不咬',
      '发成中文「夫」',
    ],
    correctionTips: [
      '上齿轻触下唇内侧',
      '气流持续摩擦，不要爆破',
    ],
    examples: [
      { word: 'food', ipa: '/fuːd/', meaning: '食物' },
      { word: 'five', ipa: '/faɪv/', meaning: '五' },
      { word: 'coffee', ipa: '/ˈkɒfi/', meaning: '咖啡' },
      { word: 'laugh', ipa: '/lɑːf/', meaning: '笑' },
    ],
  },
  {
    id: 'p-27',
    symbol: '/v/',
    category: 'consonant',
    group: '浊辅音',
    description: '与 /f/ 口型相同，声带振动',
    mouthShape: '上齿轻咬下唇内侧',
    commonMistakes: [
      '与 /f/ 不分（中国学习者最常见错误）',
      '发成 /w/',
    ],
    correctionTips: [
      '摸喉咙，必须振动',
      '上齿一定要接触下唇',
    ],
    examples: [
      { word: 'very', ipa: '/ˈveri/', meaning: '非常' },
      { word: 'love', ipa: '/lʌv/', meaning: '爱' },
      { word: 'five', ipa: '/faɪv/', meaning: '五' },
      { word: 'live', ipa: '/lɪv/', meaning: '生活' },
    ],
  },
  {
    id: 'p-28',
    symbol: '/θ/',
    category: 'consonant',
    group: '清辅音',
    description: '舌尖伸出到上下齿之间，气流摩擦',
    mouthShape: '舌尖伸出齿间',
    commonMistakes: [
      '发成 /s/（最常见错误）',
      '发成 /f/',
    ],
    correctionTips: [
      '舌尖必须伸出齿间',
      '对着镜子看，能看到舌尖',
    ],
    examples: [
      { word: 'think', ipa: '/θɪŋk/', meaning: '思考' },
      { word: 'three', ipa: '/θriː/', meaning: '三' },
      { word: 'bath', ipa: '/bɑːθ/', meaning: '洗澡' },
      { word: 'mouth', ipa: '/maʊθ/', meaning: '嘴' },
    ],
  },
  {
    id: 'p-29',
    symbol: '/ð/',
    category: 'consonant',
    group: '浊辅音',
    description: '与 /θ/ 口型相同，声带振动',
    mouthShape: '舌尖伸出齿间',
    commonMistakes: [
      '发成 /z/ 或 /d/',
      '发成 /v/',
    ],
    correctionTips: [
      '舌尖伸出齿间，摸喉咙振动',
      '与 /θ/ 是清浊对立',
    ],
    examples: [
      { word: 'this', ipa: '/ðɪs/', meaning: '这个' },
      { word: 'the', ipa: '/ðə/', meaning: '定冠词' },
      { word: 'mother', ipa: '/ˈmʌðər/', meaning: '母亲' },
      { word: 'they', ipa: '/ðeɪ/', meaning: '他们' },
    ],
  },
  {
    id: 'p-30',
    symbol: '/s/',
    category: 'consonant',
    group: '清辅音',
    description: '舌尖抵下齿龈，气流从舌面通过摩擦',
    mouthShape: '齿闭合，嘴角向两边',
    commonMistakes: [
      '发成中文「斯」，加了元音',
      '与 /θ/ 混',
    ],
    correctionTips: [
      '舌尖不要伸出齿间',
      '末尾不加元音',
    ],
    examples: [
      { word: 'sun', ipa: '/sʌn/', meaning: '太阳' },
      { word: 'see', ipa: '/siː/', meaning: '看见' },
      { word: 'bus', ipa: '/bʌs/', meaning: '公交车' },
      { word: 'class', ipa: '/klɑːs/', meaning: '班级' },
    ],
  },
  {
    id: 'p-31',
    symbol: '/z/',
    category: 'consonant',
    group: '浊辅音',
    description: '与 /s/ 口型相同，声带振动',
    mouthShape: '齿闭合，嘴角向两边',
    commonMistakes: [
      '与 /s/ 清浊不分',
      '发成 /dz/',
    ],
    correctionTips: [
      '摸喉咙振动',
      '与 /s/ 是清浊对立',
    ],
    examples: [
      { word: 'zoo', ipa: '/zuː/', meaning: '动物园' },
      { word: 'is', ipa: '/ɪz/', meaning: '是' },
      { word: 'busy', ipa: '/ˈbɪzi/', meaning: '忙的' },
      { word: 'noise', ipa: '/nɔɪz/', meaning: '噪音' },
    ],
  },
  {
    id: 'p-32',
    symbol: '/ʃ/',
    category: 'consonant',
    group: '清辅音',
    description: '舌前部抬向硬腭，气流摩擦',
    mouthShape: '双唇前突，齿近合',
    commonMistakes: [
      '发成中文「诗」',
      '与 /s/ 混',
    ],
    correctionTips: [
      '嘴唇前突圆化',
      '舌面更靠近硬腭',
    ],
    examples: [
      { word: 'she', ipa: '/ʃiː/', meaning: '她' },
      { word: 'ship', ipa: '/ʃɪp/', meaning: '船' },
      { word: 'fish', ipa: '/fɪʃ/', meaning: '鱼' },
      { word: 'wish', ipa: '/wɪʃ/', meaning: '希望' },
    ],
  },
  {
    id: 'p-33',
    symbol: '/ʒ/',
    category: 'consonant',
    group: '浊辅音',
    description: '与 /ʃ/ 口型相同，声带振动',
    mouthShape: '双唇前突，齿近合',
    commonMistakes: [
      '与 /ʃ/ 清浊不分',
      '发成 /dʒ/',
    ],
    correctionTips: [
      '摸喉咙振动',
      '常见于 measure, vision 等',
    ],
    examples: [
      { word: 'measure', ipa: '/ˈmeʒər/', meaning: '测量' },
      { word: 'vision', ipa: '/ˈvɪʒn/', meaning: '视力' },
      { word: 'pleasure', ipa: '/ˈpleʒər/', meaning: '快乐' },
      { word: 'garage', ipa: '/ɡəˈrɑːʒ/', meaning: '车库' },
    ],
  },
  {
    id: 'p-34',
    symbol: '/tʃ/',
    category: 'consonant',
    group: '清辅音',
    description: '/t/ 与 /ʃ/ 的结合，先塞后擦',
    mouthShape: '舌尖抵齿龈，双唇前突',
    commonMistakes: [
      '发成中文「吃」',
      '送气过多',
    ],
    correctionTips: [
      '是 /t/ + /ʃ/ 的合成',
      '末尾不加元音',
    ],
    examples: [
      { word: 'chair', ipa: '/tʃeər/', meaning: '椅子' },
      { word: 'church', ipa: '/tʃɜːtʃ/', meaning: '教堂' },
      { word: 'watch', ipa: '/wɒtʃ/', meaning: '观看' },
      { word: 'change', ipa: '/tʃeɪndʒ/', meaning: '改变' },
    ],
  },
  {
    id: 'p-35',
    symbol: '/dʒ/',
    category: 'consonant',
    group: '浊辅音',
    description: '/d/ 与 /ʒ/ 的结合，先塞后擦',
    mouthShape: '舌尖抵齿龈，双唇前突',
    commonMistakes: [
      '与 /tʃ/ 清浊不分',
      '发成中文「之」',
    ],
    correctionTips: [
      '是 /d/ + /ʒ/ 的合成',
      '摸喉咙振动',
    ],
    examples: [
      { word: 'job', ipa: '/dʒɒb/', meaning: '工作' },
      { word: 'judge', ipa: '/dʒʌdʒ/', meaning: '判断' },
      { word: 'age', ipa: '/eɪdʒ/', meaning: '年龄' },
      { word: 'bridge', ipa: '/brɪdʒ/', meaning: '桥' },
    ],
  },
  {
    id: 'p-36',
    symbol: '/h/',
    category: 'consonant',
    group: '清辅音',
    description: '气流从声门通过，无摩擦部位',
    mouthShape: '口自然张开',
    commonMistakes: [
      '发成中文「喝」，有摩擦部位',
      '过于用力',
    ],
    correctionTips: [
      '只是呼出的气流，无摩擦',
      '轻而短',
    ],
    examples: [
      { word: 'house', ipa: '/haʊs/', meaning: '房子' },
      { word: 'hot', ipa: '/hɒt/', meaning: '热的' },
      { word: 'happy', ipa: '/ˈhæpi/', meaning: '快乐的' },
      { word: 'head', ipa: '/hed/', meaning: '头' },
    ],
  },
  {
    id: 'p-37',
    symbol: '/m/',
    category: 'consonant',
    group: '鼻音',
    description: '双唇紧闭，气流从鼻腔出',
    mouthShape: '双唇紧闭',
    commonMistakes: [
      '末尾吞掉（cam 发成 ca）',
      '不够长',
    ],
    correctionTips: [
      '词末要持续（came /keɪm/ 的 m 要有长度）',
      '双唇始终紧闭',
    ],
    examples: [
      { word: 'man', ipa: '/mæn/', meaning: '男人' },
      { word: 'time', ipa: '/taɪm/', meaning: '时间' },
      { word: 'name', ipa: '/neɪm/', meaning: '名字' },
      { word: 'moon', ipa: '/muːn/', meaning: '月亮' },
    ],
  },
  {
    id: 'p-38',
    symbol: '/n/',
    category: 'consonant',
    group: '鼻音',
    description: '舌尖抵上齿龈，气流从鼻腔出',
    mouthShape: '舌尖抵上齿龈',
    commonMistakes: [
      '与 /ŋ/ 混（in / ing 不分）',
      '末尾吞掉',
    ],
    correctionTips: [
      '舌尖抵上齿龈（前鼻音）',
      '与 /ŋ/（后鼻音）区分',
    ],
    examples: [
      { word: 'no', ipa: '/noʊ/', meaning: '不' },
      { word: 'sun', ipa: '/sʌn/', meaning: '太阳' },
      { word: 'run', ipa: '/rʌn/', meaning: '跑' },
      { word: 'nine', ipa: '/naɪn/', meaning: '九' },
    ],
  },
  {
    id: 'p-39',
    symbol: '/ŋ/',
    category: 'consonant',
    group: '鼻音',
    description: '舌后部抵软腭，气流从鼻腔出',
    mouthShape: '口微张，舌后部抬向软腭',
    commonMistakes: [
      '与 /n/ 混（中国学习者常见）',
      '发成 /nɡ/（多加 g）',
    ],
    correctionTips: [
      '舌后部抬起，不是舌尖',
      '末尾不加 /ɡ/',
    ],
    examples: [
      { word: 'sing', ipa: '/sɪŋ/', meaning: '唱歌' },
      { word: 'long', ipa: '/lɒŋ/', meaning: '长的' },
      { word: 'thing', ipa: '/θɪŋ/', meaning: '事情' },
      { word: 'morning', ipa: '/ˈmɔːnɪŋ/', meaning: '早晨' },
    ],
  },
  {
    id: 'p-40',
    symbol: '/l/',
    category: 'consonant',
    group: '舌侧音',
    description: '舌尖抵上齿龈，气流从舌两侧出',
    mouthShape: '舌尖抵上齿龈',
    commonMistakes: [
      '词末 dark l 不会发（发成中文「欧」）',
      '与 /n/ 混',
    ],
    correctionTips: [
      '词首 clear l：舌尖抵齿龈',
      '词末 dark l：舌后部抬起（milk /mɪlk/）',
    ],
    examples: [
      { word: 'love', ipa: '/lʌv/', meaning: '爱' },
      { word: 'milk', ipa: '/mɪlk/', meaning: '牛奶' },
      { word: 'feel', ipa: '/fiːl/', meaning: '感觉' },
      { word: 'long', ipa: '/lɒŋ/', meaning: '长的' },
    ],
  },
  {
    id: 'p-41',
    symbol: '/r/',
    category: 'consonant',
    group: '舌卷音',
    description: '舌尖卷起不接触上腭，声带振动',
    mouthShape: '舌尖向上卷起，双唇微突',
    commonMistakes: [
      '发成中文「日」或 /l/',
      '英音中不该卷舌的卷了',
    ],
    correctionTips: [
      '舌尖不接触上腭',
      '英音中只有 r 后才卷舌，car 不卷（英音）',
    ],
    examples: [
      { word: 'red', ipa: '/red/', meaning: '红色的' },
      { word: 'very', ipa: '/ˈveri/', meaning: '非常' },
      { word: 'right', ipa: '/raɪt/', meaning: '对的' },
      { word: 'three', ipa: '/θriː/', meaning: '三' },
    ],
  },
  {
    id: 'p-42',
    symbol: '/j/',
    category: 'consonant',
    group: '半元音',
    description: '舌前部抬向硬腭，气流通过，声带振动',
    mouthShape: '舌前部抬向硬腭，双唇展开',
    commonMistakes: [
      '发成 /dʒ/（yes 发成 jes）',
      '过于用力',
    ],
    correctionTips: [
      '是半元音，短暂滑动',
      '不要爆破',
    ],
    examples: [
      { word: 'yes', ipa: '/jes/', meaning: '是的' },
      { word: 'year', ipa: '/jɪər/', meaning: '年' },
      { word: 'you', ipa: '/juː/', meaning: '你' },
      { word: 'yellow', ipa: '/ˈjeləʊ/', meaning: '黄色的' },
    ],
  },
  {
    id: 'p-43',
    symbol: '/w/',
    category: 'consonant',
    group: '半元音',
    description: '双唇圆撮，舌后部抬向软腭',
    mouthShape: '双唇圆撮前突',
    commonMistakes: [
      '发成 /v/',
      '不够圆',
    ],
    correctionTips: [
      '双唇圆撮，不是咬唇',
      '短暂滑动到后续元音',
    ],
    examples: [
      { word: 'we', ipa: '/wiː/', meaning: '我们' },
      { word: 'water', ipa: '/ˈwɔːtər/', meaning: '水' },
      { word: 'want', ipa: '/wɒnt/', meaning: '想要' },
      { word: 'window', ipa: '/ˈwɪndəʊ/', meaning: '窗户' },
    ],
  },
];

// ============ 分组（用于按组练习） ============
export const phonemeGroups: { id: string; name: string; description: string }[] = [
  { id: 'short-vowel', name: '短元音', description: '/ɪ/ /e/ /æ/ /ʌ/ /ʊ/ /ə/' },
  { id: 'long-vowel', name: '长元音', description: '/iː/ /ɑː/ /ɔː/ /uː/ /ɜː/' },
  { id: 'diphthong', name: '双元音', description: '/eɪ/ /aɪ/ /ɔɪ/ /aʊ/ /əʊ/ /ɪə/ /eə/ /ʊə/' },
  { id: 'plosive', name: '爆破音', description: '/p/ /b/ /t/ /d/ /k/ /ɡ/' },
  { id: 'fricative', name: '摩擦音', description: '/f/ /v/ /θ/ /ð/ /s/ /z/ /ʃ/ /ʒ/ /h/' },
  { id: 'affricate', name: '破擦音', description: '/tʃ/ /dʒ/' },
  { id: 'nasal', name: '鼻音', description: '/m/ /n/ /ŋ/' },
  { id: 'approximant', name: '舌侧音/半元音', description: '/l/ /r/ /j/ /w/' },
];

// group → Phoneme[] 映射
export const getPhonemesByGroup = (groupId: string): Phoneme[] => {
  // 按 phoneme id 精确筛选
  const idMap: Record<string, string[]> = {
    'short-vowel': ['p-01', 'p-02', 'p-03', 'p-04', 'p-05', 'p-06'],
    'long-vowel': ['p-07', 'p-08', 'p-09', 'p-10', 'p-11'],
    'diphthong': ['p-12', 'p-13', 'p-14', 'p-15', 'p-16', 'p-17', 'p-18', 'p-19'],
    'plosive': ['p-20', 'p-21', 'p-22', 'p-23', 'p-24', 'p-25'],
    'fricative': ['p-26', 'p-27', 'p-28', 'p-29', 'p-30', 'p-31', 'p-32', 'p-33', 'p-36'],
    'affricate': ['p-34', 'p-35'],
    'nasal': ['p-37', 'p-38', 'p-39'],
    'approximant': ['p-40', 'p-41', 'p-42', 'p-43'],
  };
  const ids = idMap[groupId] || [];
  return phonemes.filter(p => ids.includes(p.id));
};

// 英美音差异对照（重点提示）
export const britishAmericanDifferences: {
  phonemeId: string;
  british: string;
  american: string;
  note: string;
}[] = [
  { phonemeId: 'p-08', british: '/ɑː/', american: '/ɑr/', note: '美音在 r 前卷舌（car, far）' },
  { phonemeId: 'p-09', british: '/ɔː/', american: '/ɔr/', note: '美音在 r 前卷舌（door, more）' },
  { phonemeId: 'p-11', british: '/ɜː/', american: '/ɜr/', note: '美音必卷舌（bird, word）' },
  { phonemeId: 'p-16', british: '/əʊ/', american: '/oʊ/', note: '美音起点更高更紧（go, no）' },
  { phonemeId: 'p-17', british: '/ɪə/', american: '/ɪr/', note: '美音卷舌（here, near）' },
  { phonemeId: 'p-18', british: '/eə/', american: '/er/', note: '美音卷舌（hair, care）' },
  { phonemeId: 'p-19', british: '/ʊə/', american: '/ʊr/', note: '美音卷舌（tour, pure）' },
];
