// 多语种发音练习数据：日语五十音 + 韩语字母（한글）
// 面向中国学习者的发音矫正数据：常见错误与矫正建议
// 数据遵循 phonetics.ts 中的 LanguagePhoneticsData / Phoneme / PhonemeGroup 接口
// 例词均选用高频真实词，便于用户对照发音

import type { Language } from '../types';
import { makeGroupFilter, type LanguagePhoneticsData, type Phoneme } from './phonetics';

// ============================================================
// 日语五十音（japanese）
// 清音 46 + 浊音/半浊音 25 + 拗音 33
// 平假名为 symbol，category 统一为 'syllable'
// ============================================================

const japaneseGroups = [
  { id: 'a-row', name: 'あ行（元音）', description: 'あ い う え お：日语五个基本元音' },
  { id: 'k-row', name: 'か行（清音）', description: 'か き く け こ：舌根清塞音 k' },
  { id: 's-row', name: 'さ行（清音）', description: 'さ し す せ そ：舌叶擦音 s/ɕ' },
  { id: 't-row', name: 'た行（清音）', description: 'た ち つ て と：舌尖塞音/塞擦音 t/tɕ/ts' },
  { id: 'n-row', name: 'な行（鼻音）', description: 'な に ぬ ね の：鼻音 n' },
  { id: 'h-row', name: 'は行（擦音）', description: 'は ひ ふ へ ほ：喉/腭/双唇擦音 h/ç/ɸ' },
  { id: 'm-row', name: 'ま行（鼻音）', description: 'ま み む め も：双唇鼻音 m' },
  { id: 'y-row', name: 'や行（半元音）', description: 'や ゆ よ：半元音 j' },
  { id: 'r-row', name: 'ら行（闪音）', description: 'ら り る れ ろ：齿龈闪音 ɾ' },
  { id: 'w-row', name: 'わ行（半元音+拨音）', description: 'わ を ん：半元音 w 与拨音 n' },
  { id: 'dakuten', name: '浊音/半浊音', description: 'が～ご、ざ～ぞ、だ～ど、ば～ぼ、ぱ～ぽ' },
  { id: 'youon', name: '拗音', description: 'きゃ～ぴょ：い段假名 + ゃゅょ 缩合' },
];

const japanesePhonemes: Phoneme[] = [
  // ============ あ行 元音 ============
  {
    id: 'jp-a-1', symbol: 'あ', category: 'syllable', group: 'a-row',
    description: '元音あ（ア），罗马音 a，IPA [a]。开口元音，舌位略前低，介于中文「啊」与前位之间。',
    mouthShape: '口自然张开，舌平放，嘴唇不圆',
    commonMistakes: ['发成中文「啊」过于靠后、口腔过开', '与え混淆，长短不分'],
    correctionTips: ['比中文「啊」口型略小、舌位略前', '短促清晰，一拍'],
    examples: [
      { word: 'あさ（朝）', ipa: 'asa', meaning: '早上' },
      { word: 'あお（青）', ipa: 'ao', meaning: '蓝色' },
      { word: 'あめ（雨）', ipa: 'ame', meaning: '雨' },
    ],
  },
  {
    id: 'jp-a-2', symbol: 'い', category: 'syllable', group: 'a-row',
    description: '元音い（イ），罗马音 i，IPA [i]。前高元音，比中文「衣」更松。',
    mouthShape: '嘴角略向两侧平展，舌前部抬高，唇不圆',
    commonMistakes: ['发成中文「衣」过紧过尖', '与え混淆'],
    correctionTips: ['舌头和嘴唇放松，不要刻意用力', '比中文「衣」更松更平'],
    examples: [
      { word: 'いぬ（犬）', ipa: 'inu', meaning: '狗' },
      { word: 'いえ（家）', ipa: 'ie', meaning: '家' },
      { word: 'いち（一）', ipa: 'ichi', meaning: '一' },
    ],
  },
  {
    id: 'jp-a-3', symbol: 'う', category: 'syllable', group: 'a-row',
    description: '元音う（ウ），罗马音 u，IPA [ɯ]。**不圆唇**后元音，与中文「乌」圆唇不同。',
    mouthShape: '嘴唇**不圆**、自然平展微开，舌后部抬高',
    commonMistakes: ['**发成圆唇的中文「乌」**（最常见错误）', '嘴唇撅起成圆形'],
    correctionTips: ['嘴唇放松平展，不要撅嘴', '想象发「乌」但不圆唇，嘴角略往两边'],
    examples: [
      { word: 'うみ（海）', ipa: 'umi', meaning: '海' },
      { word: 'うえ（上）', ipa: 'ue', meaning: '上面' },
      { word: 'うし（牛）', ipa: 'ushi', meaning: '牛' },
    ],
  },
  {
    id: 'jp-a-4', symbol: 'え', category: 'syllable', group: 'a-row',
    description: '元音え（エ），罗马音 e，IPA [e]。中元音，比中文「诶」更单、不双元音化。',
    mouthShape: '口半开，舌位中偏前，唇不圆',
    commonMistakes: ['发成双元音「诶」(ei)', '与あ混淆口型过大'],
    correctionTips: ['保持单一元音，不要滑向 i', '口型介于あ和い之间'],
    examples: [
      { word: 'えき（駅）', ipa: 'eki', meaning: '车站' },
      { word: 'え（絵）', ipa: 'e', meaning: '画' },
      { word: 'えだ（枝）', ipa: 'eda', meaning: '树枝' },
    ],
  },
  {
    id: 'jp-a-5', symbol: 'お', category: 'syllable', group: 'a-row',
    description: '元音お（オ），罗马音 o，IPA [o]。圆唇后元音，比中文「哦」口型更小更圆。',
    mouthShape: '嘴唇收圆略前突，口型比「哦」小',
    commonMistakes: ['发成中文「哦」过长过开', '与あ混淆'],
    correctionTips: ['嘴唇收圆收小，短促一拍', '不要拖长或滑音'],
    examples: [
      { word: 'おと（音）', ipa: 'oto', meaning: '声音' },
      { word: 'おちゃ（お茶）', ipa: 'ocha', meaning: '茶' },
      { word: 'おかね（お金）', ipa: 'okane', meaning: '钱' },
    ],
  },

  // ============ か行 清音 k ============
  {
    id: 'jp-k-1', symbol: 'か', category: 'syllable', group: 'k-row',
    description: 'か行か（カ），罗马音 ka，IPA [ka]。清辅音 k + あ。k 送气比中文「卡」弱。',
    mouthShape: '舌根抵软腭，松开同时张口发 a',
    commonMistakes: ['k 送气过强，像中文「卡」', '词中 k 浊化成 g'],
    correctionTips: ['送气比中文弱，词中位置几乎不送气', '区分词首か与词中が'],
    examples: [
      { word: 'かさ（傘）', ipa: 'kasa', meaning: '伞' },
      { word: 'かお（顔）', ipa: 'kao', meaning: '脸' },
      { word: 'かみ（紙）', ipa: 'kami', meaning: '纸' },
    ],
  },
  {
    id: 'jp-k-2', symbol: 'き', category: 'syllable', group: 'k-row',
    description: 'き（キ），罗马音 ki，IPA [ki]。清辅音 k + い，腭化。',
    mouthShape: '舌面抬高接近硬腭，嘴角略展',
    commonMistakes: ['k 送气过强', 'i 过紧成中文「衣」'],
    correctionTips: ['送气减弱', 'i 放松，唇不圆'],
    examples: [
      { word: 'き（木）', ipa: 'ki', meaning: '树' },
      { word: 'きもの（着物）', ipa: 'kimono', meaning: '和服' },
      { word: 'きた（北）', ipa: 'kita', meaning: '北' },
    ],
  },
  {
    id: 'jp-k-3', symbol: 'く', category: 'syllable', group: 'k-row',
    description: 'く（ク），罗马音 ku，IPA [kɯ]。注意 u 不圆唇。',
    mouthShape: '舌根抵软腭，唇不圆',
    commonMistakes: ['u 发成圆唇「乌」', 'k 送气过强'],
    correctionTips: ['u 不圆唇，嘴角平展', '送气弱'],
    examples: [
      { word: 'くち（口）', ipa: 'kuchi', meaning: '嘴' },
      { word: 'くも（雲）', ipa: 'kumo', meaning: '云' },
      { word: 'くつ（靴）', ipa: 'kutsu', meaning: '鞋' },
    ],
  },
  {
    id: 'jp-k-4', symbol: 'け', category: 'syllable', group: 'k-row',
    description: 'け（ケ），罗马音 ke，IPA [ke]。清辅音 k + え。',
    mouthShape: '舌根抵软腭后松开，口半开',
    commonMistakes: ['e 双元音化成「诶」', 'k 送气过强'],
    correctionTips: ['e 单一不滑音', '送气弱'],
    examples: [
      { word: 'け（毛）', ipa: 'ke', meaning: '毛发' },
      { word: 'けさ（今朝）', ipa: 'kesa', meaning: '今天早上' },
      { word: 'けいさつ（警察）', ipa: 'keisatsu', meaning: '警察' },
    ],
  },
  {
    id: 'jp-k-5', symbol: 'こ', category: 'syllable', group: 'k-row',
    description: 'こ（コ），罗马音 ko，IPA [ko]。清辅音 k + お。',
    mouthShape: '唇微圆，舌根抵软腭',
    commonMistakes: ['o 过长过开', 'k 送气过强'],
    correctionTips: ['短促一拍', '送气弱'],
    examples: [
      { word: 'こえ（声）', ipa: 'koe', meaning: '声音' },
      { word: 'こころ（心）', ipa: 'kokoro', meaning: '心' },
      { word: 'こども（子供）', ipa: 'kodomo', meaning: '孩子' },
    ],
  },

  // ============ さ行 清音 s/ɕ ============
  {
    id: 'jp-s-1', symbol: 'さ', category: 'syllable', group: 's-row',
    description: 'さ（サ），罗马音 sa，IPA [sa]。舌叶擦音 s + あ。',
    mouthShape: '舌尖接近上门齿背，气流摩擦',
    commonMistakes: ['s 过重成中文「萨」', 'a 过开'],
    correctionTips: ['s 轻短，一拍', 'a 略收'],
    examples: [
      { word: 'さかな（魚）', ipa: 'sakana', meaning: '鱼' },
      { word: 'さけ（酒）', ipa: 'sake', meaning: '酒' },
      { word: 'さむい（寒い）', ipa: 'samui', meaning: '冷' },
    ],
  },
  {
    id: 'jp-s-2', symbol: 'し', category: 'syllable', group: 's-row',
    description: 'し（シ），罗马音 shi，IPA [ɕi]。**腭化擦音 ɕ**，接近中文「西」但舌面更靠硬腭。',
    mouthShape: '舌面前部接近硬腭，唇略前突',
    commonMistakes: ['**发成中文 si（思）的 s**（最常见）', '发成过于卷舌的英语 sh'],
    correctionTips: ['舌面抬高靠近硬腭，类似「西」但更靠前', '不要用舌尖发 s'],
    examples: [
      { word: 'しお（塩）', ipa: 'shio', meaning: '盐' },
      { word: 'しか（鹿）', ipa: 'shika', meaning: '鹿' },
      { word: 'しろ（白）', ipa: 'shiro', meaning: '白' },
    ],
  },
  {
    id: 'jp-s-3', symbol: 'す', category: 'syllable', group: 's-row',
    description: 'す（ス），罗马音 su，IPA [sɯ]。擦音 s + う，u 不圆唇。',
    mouthShape: '舌尖抵下齿背，唇不圆',
    commonMistakes: ['u 圆唇成「苏」', 's 过重'],
    correctionTips: ['u 不圆唇，接近无声的弱 u', '整体轻短'],
    examples: [
      { word: 'すし（寿司）', ipa: 'sushi', meaning: '寿司' },
      { word: 'すず（鈴）', ipa: 'suzu', meaning: '铃' },
      { word: 'すいえい（水泳）', ipa: 'suiei', meaning: '游泳' },
    ],
  },
  {
    id: 'jp-s-4', symbol: 'せ', category: 'syllable', group: 's-row',
    description: 'せ（セ），罗马音 se，IPA [se]。擦音 s + え。',
    mouthShape: '舌尖抵下齿，口半开',
    commonMistakes: ['e 双元音化', 's 过重'],
    correctionTips: ['e 单一不滑音', '短促'],
    examples: [
      { word: 'せん（千）', ipa: 'sen', meaning: '千' },
      { word: 'せかい（世界）', ipa: 'sekai', meaning: '世界' },
      { word: 'せいふ（政府）', ipa: 'seifu', meaning: '政府' },
    ],
  },
  {
    id: 'jp-s-5', symbol: 'そ', category: 'syllable', group: 's-row',
    description: 'そ（ソ），罗马音 so，IPA [so]。擦音 s + お。',
    mouthShape: '唇微圆，舌尖抵下齿',
    commonMistakes: ['o 过长', 's 过重'],
    correctionTips: ['短促一拍', 's 轻'],
    examples: [
      { word: 'そら（空）', ipa: 'sora', meaning: '天空' },
      { word: 'そと（外）', ipa: 'soto', meaning: '外面' },
      { word: 'そふ（祖父）', ipa: 'sofu', meaning: '祖父' },
    ],
  },

  // ============ た行 清音 t/tɕ/ts ============
  {
    id: 'jp-t-1', symbol: 'た', category: 'syllable', group: 't-row',
    description: 'た（タ），罗马音 ta，IPA [ta]。舌尖塞音 t + あ。',
    mouthShape: '舌尖抵上齿龈，松开发 a',
    commonMistakes: ['t 送气过强成中文「塔」', '词中 t 浊化成 d'],
    correctionTips: ['送气比中文弱', '短促一拍'],
    examples: [
      { word: 'たまご（卵）', ipa: 'tamago', meaning: '鸡蛋' },
      { word: 'たけ（竹）', ipa: 'take', meaning: '竹' },
      { word: 'たかい（高い）', ipa: 'takai', meaning: '高' },
    ],
  },
  {
    id: 'jp-t-2', symbol: 'ち', category: 'syllable', group: 't-row',
    description: 'ち（チ），罗马音 chi，IPA [tɕi]。**腭化塞擦音 tɕ**，接近中文「鸡」但更轻。',
    mouthShape: '舌面前部抵硬腭，破擦成音',
    commonMistakes: ['**发成中文 qi（七）过重或英语 tʃ**', '送气过强'],
    correctionTips: ['类似「鸡」但更轻短，送气弱', '不要发成英语的 ch'],
    examples: [
      { word: 'ち（血）', ipa: 'chi', meaning: '血' },
      { word: 'ちかい（近い）', ipa: 'chikai', meaning: '近' },
      { word: 'ちず（地図）', ipa: 'chizu', meaning: '地图' },
    ],
  },
  {
    id: 'jp-t-3', symbol: 'つ', category: 'syllable', group: 't-row',
    description: 'つ（ツ），罗马音 tsu，IPA [tsɯ]。**齿龈塞擦音 ts**，u 不圆唇。',
    mouthShape: '舌尖抵上齿龈，先塞后擦',
    commonMistakes: ['**发成中文「粗」的 c 或「租」**，送气过强', 'u 圆唇'],
    correctionTips: ['先 t 后 s 一气呵成，送气弱', 'u 不圆唇'],
    examples: [
      { word: 'つき（月）', ipa: 'tsuki', meaning: '月亮' },
      { word: 'つめ（爪）', ipa: 'tsume', meaning: '指甲' },
      { word: 'つる（鶴）', ipa: 'tsuru', meaning: '鹤' },
    ],
  },
  {
    id: 'jp-t-4', symbol: 'て', category: 'syllable', group: 't-row',
    description: 'て（テ），罗马音 te，IPA [te]。塞音 t + え。',
    mouthShape: '舌尖抵上齿龈，口半开',
    commonMistakes: ['e 双元音化', 't 送气过强'],
    correctionTips: ['e 单一不滑音', '短促'],
    examples: [
      { word: 'て（手）', ipa: 'te', meaning: '手' },
      { word: 'てんき（天気）', ipa: 'tenki', meaning: '天气' },
      { word: 'てがみ（手紙）', ipa: 'tegami', meaning: '信' },
    ],
  },
  {
    id: 'jp-t-5', symbol: 'と', category: 'syllable', group: 't-row',
    description: 'と（ト），罗马音 to，IPA [to]。塞音 t + お。',
    mouthShape: '舌尖抵上齿龈，唇微圆',
    commonMistakes: ['o 过长', 't 送气过强'],
    correctionTips: ['短促一拍', '送气弱'],
    examples: [
      { word: 'とり（鳥）', ipa: 'tori', meaning: '鸟' },
      { word: 'とけい（時計）', ipa: 'tokei', meaning: '钟表' },
      { word: 'ともだち（友達）', ipa: 'tomodachi', meaning: '朋友' },
    ],
  },

  // ============ な行 鼻音 n ============
  {
    id: 'jp-n-1', symbol: 'な', category: 'syllable', group: 'n-row',
    description: 'な（ナ），罗马音 na，IPA [na]。鼻音 n + あ。',
    mouthShape: '舌尖抵上齿龈，气流从鼻腔出',
    commonMistakes: ['n 过重成中文「那」', 'a 过开'],
    correctionTips: ['轻短一拍', 'a 略收'],
    examples: [
      { word: 'なつ（夏）', ipa: 'natsu', meaning: '夏天' },
      { word: 'なみ（波）', ipa: 'nami', meaning: '波浪' },
      { word: 'なか（中）', ipa: 'naka', meaning: '里面' },
    ],
  },
  {
    id: 'jp-n-2', symbol: 'に', category: 'syllable', group: 'n-row',
    description: 'に（ニ），罗马音 ni，IPA [ɲi]。腭化鼻音。',
    mouthShape: '舌面抵硬腭，气流从鼻腔出',
    commonMistakes: ['ni 过紧成中文「泥」'],
    correctionTips: ['舌面接触硬腭，轻短'],
    examples: [
      { word: 'にわ（庭）', ipa: 'niwa', meaning: '庭院' },
      { word: 'にほん（日本）', ipa: 'nihon', meaning: '日本' },
      { word: 'に（二）', ipa: 'ni', meaning: '二' },
    ],
  },
  {
    id: 'jp-n-3', symbol: 'ぬ', category: 'syllable', group: 'n-row',
    description: 'ぬ（ヌ），罗马音 nu，IPA [nɯ]。鼻音 n + う，u 不圆唇。',
    mouthShape: '舌尖抵上齿龈，唇不圆',
    commonMistakes: ['u 圆唇成「奴」'],
    correctionTips: ['u 不圆唇'],
    examples: [
      { word: 'ぬの（布）', ipa: 'nuno', meaning: '布' },
      { word: 'ぬいぐるみ（縫いぐるみ）', ipa: 'nuigurumi', meaning: '毛绒玩具' },
    ],
  },
  {
    id: 'jp-n-4', symbol: 'ね', category: 'syllable', group: 'n-row',
    description: 'ね（ネ），罗马音 ne，IPA [ne]。鼻音 n + え。',
    mouthShape: '舌尖抵上齿龈，口半开',
    commonMistakes: ['e 双元音化'],
    correctionTips: ['e 单一不滑音'],
    examples: [
      { word: 'ねこ（猫）', ipa: 'neko', meaning: '猫' },
      { word: 'ねる（寝る）', ipa: 'neru', meaning: '睡觉' },
      { word: 'ね（根）', ipa: 'ne', meaning: '根' },
    ],
  },
  {
    id: 'jp-n-5', symbol: 'の', category: 'syllable', group: 'n-row',
    description: 'の（ノ），罗马音 no，IPA [no]。鼻音 n + お。',
    mouthShape: '舌尖抵上齿龈，唇微圆',
    commonMistakes: ['o 过长', 'no 拖音'],
    correctionTips: ['短促一拍'],
    examples: [
      { word: 'のみもの（飲み物）', ipa: 'nomimono', meaning: '饮料' },
      { word: 'のはら（野原）', ipa: 'nohara', meaning: '原野' },
      { word: 'の（野）', ipa: 'no', meaning: '田野' },
    ],
  },

  // ============ は行 擦音 h/ç/ɸ ============
  {
    id: 'jp-h-1', symbol: 'は', category: 'syllable', group: 'h-row',
    description: 'は（ハ），罗马音 ha，IPA [ha]。喉部擦音 h + あ。',
    mouthShape: '口张开，气流从声门摩擦出',
    commonMistakes: ['h 过重成中文「哈」', 'a 过开'],
    correctionTips: ['轻短，h 气流弱', '一拍'],
    examples: [
      { word: 'はな（花）', ipa: 'hana', meaning: '花' },
      { word: 'はし（橋）', ipa: 'hashi', meaning: '桥' },
      { word: 'は（歯）', ipa: 'ha', meaning: '牙' },
    ],
  },
  {
    id: 'jp-h-2', symbol: 'ひ', category: 'syllable', group: 'h-row',
    description: 'ひ（ヒ），罗马音 hi，IPA [çi]。**腭化擦音 ç**，不是英语 h。',
    mouthShape: '舌面接近硬腭，气流摩擦',
    commonMistakes: ['发成英语 h 或中文「希」的 x', '气流过强'],
    correctionTips: ['舌面靠近硬腭，发轻擦音 ç', '类似轻「希」'],
    examples: [
      { word: 'ひ（火）', ipa: 'hi', meaning: '火' },
      { word: 'ひかり（光）', ipa: 'hikari', meaning: '光' },
      { word: 'ひと（人）', ipa: 'hito', meaning: '人' },
    ],
  },
  {
    id: 'jp-h-3', symbol: 'ふ', category: 'syllable', group: 'h-row',
    description: 'ふ（フ），罗马音 fu，IPA [ɸɯ]。**双唇擦音 ɸ**，不是英语 f（唇齿）。',
    mouthShape: '双唇接近（不咬下唇），气流从双唇间摩擦，u 不圆唇',
    commonMistakes: ['**发成唇齿 f（咬下唇）**，最常见错误', 'u 圆唇'],
    correctionTips: ['不要咬下唇，用双唇轻靠拢吹气', '类似轻「夫」但唇不圆、不咬唇'],
    examples: [
      { word: 'ふゆ（冬）', ipa: 'fuyu', meaning: '冬天' },
      { word: 'ふね（船）', ipa: 'fune', meaning: '船' },
      { word: 'ふじ（富士）', ipa: 'fuji', meaning: '富士' },
    ],
  },
  {
    id: 'jp-h-4', symbol: 'へ', category: 'syllable', group: 'h-row',
    description: 'へ（ヘ），罗马音 he，IPA [he] / 词中 [çe]。注意作方向助词时读 e。',
    mouthShape: '口半开，气流轻擦',
    commonMistakes: ['e 双元音化', 'h 过重'],
    correctionTips: ['e 单一不滑音', '轻短'],
    examples: [
      { word: 'へや（部屋）', ipa: 'heya', meaning: '房间' },
      { word: 'へいわ（平和）', ipa: 'heiwa', meaning: '和平' },
      { word: 'へ（方向助词）', ipa: 'e', meaning: '往～（作助词时读 e）' },
    ],
  },
  {
    id: 'jp-h-5', symbol: 'ほ', category: 'syllable', group: 'h-row',
    description: 'ほ（ホ），罗马音 ho，IPA [ho]。喉擦音 h + お。',
    mouthShape: '唇微圆，气流轻擦',
    commonMistakes: ['o 过长', 'h 过重'],
    correctionTips: ['短促一拍', 'h 轻'],
    examples: [
      { word: 'ほし（星）', ipa: 'hoshi', meaning: '星' },
      { word: 'ほん（本）', ipa: 'hon', meaning: '书' },
      { word: 'ほね（骨）', ipa: 'hone', meaning: '骨头' },
    ],
  },

  // ============ ま行 鼻音 m ============
  {
    id: 'jp-m-1', symbol: 'ま', category: 'syllable', group: 'm-row',
    description: 'ま（マ），罗马音 ma，IPA [ma]。双唇鼻音 m + あ。',
    mouthShape: '双唇闭合，气流从鼻腔出后开唇发 a',
    commonMistakes: ['m 过重成中文「马」', 'a 过开'],
    correctionTips: ['轻短一拍', 'a 略收'],
    examples: [
      { word: 'まち（町）', ipa: 'machi', meaning: '城镇' },
      { word: 'まど（窓）', ipa: 'mado', meaning: '窗' },
      { word: 'まつ（松）', ipa: 'matsu', meaning: '松' },
    ],
  },
  {
    id: 'jp-m-2', symbol: 'み', category: 'syllable', group: 'm-row',
    description: 'み（ミ），罗马音 mi，IPA [mi]。双唇鼻音 m + い。',
    mouthShape: '双唇闭合，唇略展',
    commonMistakes: ['mi 过紧成中文「米」'],
    correctionTips: ['放松，唇不圆'],
    examples: [
      { word: 'みず（水）', ipa: 'mizu', meaning: '水' },
      { word: 'みち（道）', ipa: 'michi', meaning: '路' },
      { word: 'みぎ（右）', ipa: 'migi', meaning: '右' },
    ],
  },
  {
    id: 'jp-m-3', symbol: 'む', category: 'syllable', group: 'm-row',
    description: 'む（ム），罗马音 mu，IPA [mɯ]。鼻音 m + う，u 不圆唇。',
    mouthShape: '双唇闭合，唇不圆',
    commonMistakes: ['u 圆唇成「木」'],
    correctionTips: ['u 不圆唇'],
    examples: [
      { word: 'むし（虫）', ipa: 'mushi', meaning: '虫' },
      { word: 'むね（胸）', ipa: 'mune', meaning: '胸' },
      { word: 'むら（村）', ipa: 'mura', meaning: '村庄' },
    ],
  },
  {
    id: 'jp-m-4', symbol: 'め', category: 'syllable', group: 'm-row',
    description: 'め（メ），罗马音 me，IPA [me]。鼻音 m + え。',
    mouthShape: '双唇闭合后开，口半开',
    commonMistakes: ['e 双元音化'],
    correctionTips: ['e 单一不滑音'],
    examples: [
      { word: 'め（目）', ipa: 'me', meaning: '眼' },
      { word: 'めがね（眼鏡）', ipa: 'megane', meaning: '眼镜' },
      { word: 'めし（飯）', ipa: 'meshi', meaning: '饭' },
    ],
  },
  {
    id: 'jp-m-5', symbol: 'も', category: 'syllable', group: 'm-row',
    description: 'も（モ），罗马音 mo，IPA [mo]。鼻音 m + お。',
    mouthShape: '双唇闭合后开，唇微圆',
    commonMistakes: ['o 过长'],
    correctionTips: ['短促一拍'],
    examples: [
      { word: 'もり（森）', ipa: 'mori', meaning: '森林' },
      { word: 'もの（物）', ipa: 'mono', meaning: '东西' },
      { word: 'もち（餅）', ipa: 'mochi', meaning: '年糕' },
    ],
  },

  // ============ や行 半元音 j ============
  {
    id: 'jp-y-1', symbol: 'や', category: 'syllable', group: 'y-row',
    description: 'や（ヤ），罗马音 ya，IPA [ja]。半元音 j + あ。',
    mouthShape: '舌面接近硬腭，迅速滑向 a',
    commonMistakes: ['j 过重成中文「呀」', '拖长'],
    correctionTips: ['短促一拍', '滑音轻'],
    examples: [
      { word: 'やま（山）', ipa: 'yama', meaning: '山' },
      { word: 'やさい（野菜）', ipa: 'yasai', meaning: '蔬菜' },
      { word: 'やすい（安い）', ipa: 'yasui', meaning: '便宜' },
    ],
  },
  {
    id: 'jp-y-2', symbol: 'ゆ', category: 'syllable', group: 'y-row',
    description: 'ゆ（ユ），罗马音 yu，IPA [jɯ]。半元音 j + う，u 不圆唇。',
    mouthShape: '舌面接近硬腭，唇**不圆**',
    commonMistakes: ['u 圆唇成「优」', 'j 过重'],
    correctionTips: ['u 不圆唇', '短促一拍'],
    examples: [
      { word: 'ゆき（雪）', ipa: 'yuki', meaning: '雪' },
      { word: 'ゆび（指）', ipa: 'yubi', meaning: '手指' },
      { word: 'ゆめ（夢）', ipa: 'yume', meaning: '梦' },
    ],
  },
  {
    id: 'jp-y-3', symbol: 'よ', category: 'syllable', group: 'y-row',
    description: 'よ（ヨ），罗马音 yo，IPA [jo]。半元音 j + お。',
    mouthShape: '舌面接近硬腭，唇微圆',
    commonMistakes: ['o 过长', 'j 过重'],
    correctionTips: ['短促一拍'],
    examples: [
      { word: 'よる（夜）', ipa: 'yoru', meaning: '夜' },
      { word: 'よい（良い）', ipa: 'yoi', meaning: '好' },
      { word: 'よん（四）', ipa: 'yon', meaning: '四' },
    ],
  },

  // ============ ら行 闪音 ɾ ============
  {
    id: 'jp-r-1', symbol: 'ら', category: 'syllable', group: 'r-row',
    description: 'ら（ラ），罗马音 ra，IPA [ɾa]。**齿龈闪音 ɾ**，既不是 l 也不是 r。',
    mouthShape: '舌尖轻弹上齿龈一次，瞬即离开',
    commonMistakes: ['**发成中文 l（拉）或英语 r（卷舌）**，最常见', '舌尖停留过久'],
    correctionTips: ['舌尖轻弹齿龈一闪而过，类似美式 water 的 tt', '不要卷舌，不要贴住'],
    examples: [
      { word: 'らいおん（ライオン）', ipa: 'raion', meaning: '狮子' },
      { word: 'くらい（暗い）', ipa: 'kurai', meaning: '暗' },
      { word: 'らく（楽）', ipa: 'raku', meaning: '轻松' },
    ],
  },
  {
    id: 'jp-r-2', symbol: 'り', category: 'syllable', group: 'r-row',
    description: 'り（リ），罗马音 ri，IPA [ɾi]。闪音 + い。',
    mouthShape: '舌尖轻弹齿龈，唇略展',
    commonMistakes: ['发成 l 或 r', 'i 过紧成中文「里」'],
    correctionTips: ['闪音一触即离', 'i 放松'],
    examples: [
      { word: 'りんご（林檎）', ipa: 'ringo', meaning: '苹果' },
      { word: 'りょう（寮）', ipa: 'ryou', meaning: '宿舍' },
      { word: 'りか（理科）', ipa: 'rika', meaning: '理科' },
    ],
  },
  {
    id: 'jp-r-3', symbol: 'る', category: 'syllable', group: 'r-row',
    description: 'る（ル），罗马音 ru，IPA [ɾɯ]。闪音 + う，u 不圆唇。',
    mouthShape: '舌尖轻弹齿龈，唇不圆',
    commonMistakes: ['发成 l 或 r', 'u 圆唇'],
    correctionTips: ['闪音一触即离', 'u 不圆唇'],
    examples: [
      { word: 'るす（留守）', ipa: 'rusu', meaning: '不在家' },
      { word: 'るい（類）', ipa: 'rui', meaning: '类' },
    ],
  },
  {
    id: 'jp-r-4', symbol: 'れ', category: 'syllable', group: 'r-row',
    description: 'れ（レ），罗马音 re，IPA [ɾe]。闪音 + え。',
    mouthShape: '舌尖轻弹齿龈，口半开',
    commonMistakes: ['发成 l 或 r', 'e 双元音化'],
    correctionTips: ['闪音一触即离', 'e 单一'],
    examples: [
      { word: 'れきし（歴史）', ipa: 'rekishi', meaning: '历史' },
      { word: 'れんらく（連絡）', ipa: 'renraku', meaning: '联系' },
      { word: 'れい（例）', ipa: 'rei', meaning: '例子' },
    ],
  },
  {
    id: 'jp-r-5', symbol: 'ろ', category: 'syllable', group: 'r-row',
    description: 'ろ（ロ），罗马音 ro，IPA [ɾo]。闪音 + お。',
    mouthShape: '舌尖轻弹齿龈，唇微圆',
    commonMistakes: ['发成 l 或 r', 'o 过长'],
    correctionTips: ['闪音一触即离', '短促一拍'],
    examples: [
      { word: 'ろうそく（蝋燭）', ipa: 'rousoku', meaning: '蜡烛' },
      { word: 'ろく（六）', ipa: 'roku', meaning: '六' },
      { word: 'ろうじん（老人）', ipa: 'roujin', meaning: '老人' },
    ],
  },

  // ============ わ行 半元音 w + 拨音 ============
  {
    id: 'jp-w-1', symbol: 'わ', category: 'syllable', group: 'w-row',
    description: 'わ（ワ），罗马音 wa，IPA [wa]。半元音 w + あ。',
    mouthShape: '双唇微圆，迅速滑向 a',
    commonMistakes: ['w 过重成中文「瓦」', '拖长'],
    correctionTips: ['短促一拍', '滑音轻'],
    examples: [
      { word: 'わたし（私）', ipa: 'watashi', meaning: '我' },
      { word: 'わに（鰐）', ipa: 'wani', meaning: '鳄鱼' },
      { word: 'わかい（若い）', ipa: 'wakai', meaning: '年轻' },
    ],
  },
  {
    id: 'jp-w-2', symbol: 'を', category: 'syllable', group: 'w-row',
    description: 'を（ヲ），罗马音 o（历史上 wo），IPA [o]。**现代发音与お相同**，仅作宾格助词。',
    mouthShape: '与お相同，唇微圆',
    commonMistakes: ['**发成 wo 两个音**，与お不同', '圆唇过强'],
    correctionTips: ['现代日语を发音等同お', '只作宾格助词，一拍'],
    examples: [
      { word: '本を読む（ほんをよむ）', ipa: 'hon o yomu', meaning: '读书' },
      { word: '水を飲む（みずをのむ）', ipa: 'mizu o nomu', meaning: '喝水' },
    ],
  },
  {
    id: 'jp-w-3', symbol: 'ん', category: 'syllable', group: 'w-row',
    description: 'ん（ン），罗马音 n，IPA [n]/[m]/[ŋ]/[ɴ]（随后续音变化）。拨音，占一拍。',
    mouthShape: '口略闭，气流从鼻腔出，舌位随下一音变化',
    commonMistakes: ['发成中文鼻韵母 n/ng 不分', '不占拍子，吞掉'],
    correctionTips: ['拨音占一拍，有停顿感', '随下一音变化：前 n、中 ŋ、双唇 m'],
    examples: [
      { word: 'にほん（日本）', ipa: 'nihon', meaning: '日本' },
      { word: 'さん（三）', ipa: 'san', meaning: '三' },
      { word: 'ほん（本）', ipa: 'hon', meaning: '书' },
    ],
  },

  // ============ 浊音/半浊音 dakuten ============
  // が行 g
  {
    id: 'jp-d-1', symbol: 'が', category: 'syllable', group: 'dakuten',
    description: 'が行が（ガ），罗马音 ga，IPA [ɡa]/[ŋa]。词首 ɡ，词中常鼻化成 [ŋ]（鼻浊音）。',
    mouthShape: '舌根抵软腭，松开',
    commonMistakes: ['词中 g 不鼻化，发成硬 g', '与清音か混淆'],
    correctionTips: ['词中常发鼻浊音 ŋ', '区分浊音が与清音か'],
    examples: [
      { word: 'がっこう（学校）', ipa: 'gakkou', meaning: '学校' },
      { word: 'がいこく（外国）', ipa: 'gaikoku', meaning: '外国' },
    ],
  },
  {
    id: 'jp-d-2', symbol: 'ぎ', category: 'syllable', group: 'dakuten',
    description: 'ぎ（ギ），罗马音 gi，IPA [ɡi]/[ŋi]。腭化浊塞音。',
    mouthShape: '舌面抵硬腭，松开',
    commonMistakes: ['词中不鼻化', 'i 过紧'],
    correctionTips: ['词中可鼻化', 'i 放松'],
    examples: [
      { word: 'ぎんこう（銀行）', ipa: 'ginkou', meaning: '银行' },
      { word: 'ぎじゅつ（技術）', ipa: 'gijutsu', meaning: '技术' },
    ],
  },
  {
    id: 'jp-d-3', symbol: 'ぐ', category: 'syllable', group: 'dakuten',
    description: 'ぐ（グ），罗马音 gu，IPA [ɡɯ]。浊塞音 + う，u 不圆唇。',
    mouthShape: '舌根抵软腭，唇不圆',
    commonMistakes: ['u 圆唇成「姑」'],
    correctionTips: ['u 不圆唇'],
    examples: [
      { word: 'ぐん（群）', ipa: 'gun', meaning: '群' },
      { word: 'ぐたいてき（具体的）', ipa: 'gutaiteki', meaning: '具体的' },
    ],
  },
  {
    id: 'jp-d-4', symbol: 'げ', category: 'syllable', group: 'dakuten',
    description: 'げ（ゲ），罗马音 ge，IPA [ɡe]。浊塞音 + え。',
    mouthShape: '舌根抵软腭，口半开',
    commonMistakes: ['e 双元音化'],
    correctionTips: ['e 单一不滑音'],
    examples: [
      { word: 'げんき（元気）', ipa: 'genki', meaning: '精神/健康' },
      { word: 'げつようび（月曜日）', ipa: 'getsuyoubi', meaning: '星期一' },
    ],
  },
  {
    id: 'jp-d-5', symbol: 'ご', category: 'syllable', group: 'dakuten',
    description: 'ご（ゴ），罗马音 go，IPA [ɡo]。浊塞音 + お。',
    mouthShape: '舌根抵软腭，唇微圆',
    commonMistakes: ['o 过长'],
    correctionTips: ['短促一拍'],
    examples: [
      { word: 'ごはん（御飯）', ipa: 'gohan', meaning: '米饭/饭' },
      { word: 'ごご（午後）', ipa: 'gogo', meaning: '下午' },
    ],
  },
  // ざ行 z
  {
    id: 'jp-d-6', symbol: 'ざ', category: 'syllable', group: 'dakuten',
    description: 'ざ行ざ（ザ），罗马音 za，IPA [za]/[dza]。词首常塞擦化为 [dza]。',
    mouthShape: '舌尖抵齿龈，气流摩擦',
    commonMistakes: ['z 过重成中文「杂」', '词首塞擦化不足'],
    correctionTips: ['词首常发 dz', '短促一拍'],
    examples: [
      { word: 'ざっし（雑誌）', ipa: 'zasshi', meaning: '杂志' },
      { word: 'ざせつ（挫折）', ipa: 'zasetsu', meaning: '挫折' },
    ],
  },
  {
    id: 'jp-d-7', symbol: 'じ', category: 'syllable', group: 'dakuten',
    description: 'じ（ジ），罗马音 ji，IPA [dʑi]。浊腭化塞擦音，为ち的浊版。',
    mouthShape: '舌面抵硬腭，破擦',
    commonMistakes: ['发成中文「急」过重', '与ち浊清不分'],
    correctionTips: ['浊音对应ち的浊版，声带振动', '送气弱'],
    examples: [
      { word: 'じかん（時間）', ipa: 'jikan', meaning: '时间' },
      { word: 'じぶん（自分）', ipa: 'jibun', meaning: '自己' },
    ],
  },
  {
    id: 'jp-d-8', symbol: 'ず', category: 'syllable', group: 'dakuten',
    description: 'ず（ズ），罗马音 zu，IPA [zɯ]。u 不圆唇。',
    mouthShape: '舌尖抵齿龈，唇不圆',
    commonMistakes: ['u 圆唇成「租」', 'z 过重'],
    correctionTips: ['u 不圆唇', '短促'],
    examples: [
      { word: 'ずつう（頭痛）', ipa: 'zutsuu', meaning: '头痛' },
      { word: 'ずっと', ipa: 'zutto', meaning: '一直' },
    ],
  },
  {
    id: 'jp-d-9', symbol: 'ぜ', category: 'syllable', group: 'dakuten',
    description: 'ぜ（ゼ），罗马音 ze，IPA [ze]。',
    mouthShape: '舌尖抵齿龈，口半开',
    commonMistakes: ['e 双元音化'],
    correctionTips: ['e 单一不滑音'],
    examples: [
      { word: 'ぜひ', ipa: 'zehi', meaning: '务必' },
      { word: 'ぜんぶ（全部）', ipa: 'zenbu', meaning: '全部' },
    ],
  },
  {
    id: 'jp-d-10', symbol: 'ぞ', category: 'syllable', group: 'dakuten',
    description: 'ぞ（ゾ），罗马音 zo，IPA [zo]。',
    mouthShape: '舌尖抵齿龈，唇微圆',
    commonMistakes: ['o 过长'],
    correctionTips: ['短促一拍'],
    examples: [
      { word: 'ぞう（象）', ipa: 'zou', meaning: '大象' },
      { word: 'ぞくご（俗語）', ipa: 'zokugo', meaning: '俗语' },
    ],
  },
  // だ行 d
  {
    id: 'jp-d-11', symbol: 'だ', category: 'syllable', group: 'dakuten',
    description: 'だ行だ（ダ），罗马音 da，IPA [da]。浊塞音 d + あ。',
    mouthShape: '舌尖抵齿龈，松开',
    commonMistakes: ['d 过重成中文「达」', '词中浊化不清'],
    correctionTips: ['浊音短促，声带振动', '区分清音た与浊音だ'],
    examples: [
      { word: 'だいがく（大学）', ipa: 'daigaku', meaning: '大学' },
      { word: 'だれ（誰）', ipa: 'dare', meaning: '谁' },
    ],
  },
  {
    id: 'jp-d-12', symbol: 'ぢ', category: 'syllable', group: 'dakuten',
    description: 'ぢ（ヂ），罗马音 ji，IPA [dʑi]。现代极少用，发音同じ，多见于复合词（如 縮む ちぢむ）。',
    mouthShape: '舌面抵硬腭，破擦',
    commonMistakes: ['误用ち代替ぢ', '与ぢ/じ不分'],
    correctionTips: ['现代日语ぢ发音同じ', '主要用于复合词保留拼写'],
    examples: [
      { word: 'ちぢむ（縮む）', ipa: 'chijimu', meaning: '缩小' },
      { word: 'はなぢ（鼻血）', ipa: 'hanaji', meaning: '鼻血' },
    ],
  },
  {
    id: 'jp-d-13', symbol: 'づ', category: 'syllable', group: 'dakuten',
    description: 'づ（ヅ），罗马音 zu，IPA [zɯ]。现代极少用，发音同ず，多见于复合词（如 続く つづく）。',
    mouthShape: '舌尖抵齿龈，唇不圆',
    commonMistakes: ['误用つ代替づ', '与づ/ず不分'],
    correctionTips: ['现代日语づ发音同ず', '主要用于复合词保留拼写'],
    examples: [
      { word: 'つづく（続く）', ipa: 'tsuzuku', meaning: '继续' },
      { word: 'ゆづる（譲る）', ipa: 'yuzuru', meaning: '让' },
    ],
  },
  {
    id: 'jp-d-14', symbol: 'で', category: 'syllable', group: 'dakuten',
    description: 'で（デ），罗马音 de，IPA [de]。浊塞音 d + え。',
    mouthShape: '舌尖抵齿龈，口半开',
    commonMistakes: ['e 双元音化'],
    correctionTips: ['e 单一不滑音'],
    examples: [
      { word: 'でんわ（電話）', ipa: 'denwa', meaning: '电话' },
      { word: 'でぐち（出口）', ipa: 'deguchi', meaning: '出口' },
    ],
  },
  {
    id: 'jp-d-15', symbol: 'ど', category: 'syllable', group: 'dakuten',
    description: 'ど（ド），罗马音 do，IPA [do]。浊塞音 d + お。',
    mouthShape: '舌尖抵齿龈，唇微圆',
    commonMistakes: ['o 过长'],
    correctionTips: ['短促一拍'],
    examples: [
      { word: 'どうぶつ（動物）', ipa: 'doubutsu', meaning: '动物' },
      { word: 'どろ（泥）', ipa: 'doro', meaning: '泥' },
    ],
  },
  // ば行 b
  {
    id: 'jp-d-16', symbol: 'ば', category: 'syllable', group: 'dakuten',
    description: 'ば行ば（バ），罗马音 ba，IPA [ba]。浊双唇塞音 b + あ。',
    mouthShape: '双唇闭合，松开',
    commonMistakes: ['b 过重成中文「巴」', '与半浊音ぱ混淆'],
    correctionTips: ['浊音短促，声带振动', '区分浊音ば与半浊音ぱ'],
    examples: [
      { word: 'ばら（薔薇）', ipa: 'bara', meaning: '玫瑰' },
      { word: 'ばん（晩）', ipa: 'ban', meaning: '晚' },
    ],
  },
  {
    id: 'jp-d-17', symbol: 'び', category: 'syllable', group: 'dakuten',
    description: 'び（ビ），罗马音 bi，IPA [bi]。浊双唇塞音 b + い。',
    mouthShape: '双唇闭合，唇略展',
    commonMistakes: ['bi 过紧成中文「比」'],
    correctionTips: ['放松，唇不圆'],
    examples: [
      { word: 'びよういん（美容院）', ipa: 'biyouin', meaning: '美容院' },
      { word: 'びじゅつかん（美術館）', ipa: 'bijutsukan', meaning: '美术馆' },
    ],
  },
  {
    id: 'jp-d-18', symbol: 'ぶ', category: 'syllable', group: 'dakuten',
    description: 'ぶ（ブ），罗马音 bu，IPA [bɯ]。浊双唇塞音 b + う，u 不圆唇。',
    mouthShape: '双唇闭合，唇不圆',
    commonMistakes: ['u 圆唇成「不」'],
    correctionTips: ['u 不圆唇'],
    examples: [
      { word: 'ぶんぼうぐ（文房具）', ipa: 'bunbougu', meaning: '文具' },
      { word: 'ぶた（豚）', ipa: 'buta', meaning: '猪' },
    ],
  },
  {
    id: 'jp-d-19', symbol: 'べ', category: 'syllable', group: 'dakuten',
    description: 'べ（ベ），罗马音 be，IPA [be]。浊双唇塞音 b + え。',
    mouthShape: '双唇闭合后开，口半开',
    commonMistakes: ['e 双元音化'],
    correctionTips: ['e 单一不滑音'],
    examples: [
      { word: 'べんきょう（勉強）', ipa: 'benkyou', meaning: '学习' },
      { word: 'べんり（便利）', ipa: 'benri', meaning: '方便' },
    ],
  },
  {
    id: 'jp-d-20', symbol: 'ぼ', category: 'syllable', group: 'dakuten',
    description: 'ぼ（ボ），罗马音 bo，IPA [bo]。浊双唇塞音 b + お。',
    mouthShape: '双唇闭合后开，唇微圆',
    commonMistakes: ['o 过长'],
    correctionTips: ['短促一拍'],
    examples: [
      { word: 'ぼうし（帽子）', ipa: 'boushi', meaning: '帽子' },
      { word: 'ぼく（僕）', ipa: 'boku', meaning: '我（男性）' },
    ],
  },
  // ぱ行 p（半浊音）
  {
    id: 'jp-d-21', symbol: 'ぱ', category: 'syllable', group: 'dakuten',
    description: 'ぱ行ぱ（パ），罗马音 pa，IPA [pa]。半浊音，送气双唇塞音 p + あ。',
    mouthShape: '双唇闭合，强力松开送气',
    commonMistakes: ['与浊音ば不分', '送气不足成 ba'],
    correctionTips: ['半浊音送气强，区分ば(ba)/ぱ(pa)', '送气明显'],
    examples: [
      { word: 'パン', ipa: 'pan', meaning: '面包' },
      { word: 'パンダ', ipa: 'panda', meaning: '熊猫' },
    ],
  },
  {
    id: 'jp-d-22', symbol: 'ぴ', category: 'syllable', group: 'dakuten',
    description: 'ぴ（ピ），罗马音 pi，IPA [pi]。半浊音 p + い。',
    mouthShape: '双唇闭合，送气，唇略展',
    commonMistakes: ['送气不足成 bi'],
    correctionTips: ['送气明显'],
    examples: [
      { word: 'ピアノ', ipa: 'piano', meaning: '钢琴' },
      { word: 'ぴんく', ipa: 'pinku', meaning: '粉色' },
    ],
  },
  {
    id: 'jp-d-23', symbol: 'ぷ', category: 'syllable', group: 'dakuten',
    description: 'ぷ（プ），罗马音 pu，IPA [pɯ]。半浊音 p + う，u 不圆唇。',
    mouthShape: '双唇闭合，送气，唇不圆',
    commonMistakes: ['u 圆唇', '送气不足成 bu'],
    correctionTips: ['u 不圆唇', '送气明显'],
    examples: [
      { word: 'プール', ipa: 'puuru', meaning: '泳池' },
      { word: 'プレゼント', ipa: 'purezento', meaning: '礼物' },
    ],
  },
  {
    id: 'jp-d-24', symbol: 'ぺ', category: 'syllable', group: 'dakuten',
    description: 'ぺ（ペ），罗马音 pe，IPA [pe]。半浊音 p + え。',
    mouthShape: '双唇闭合，送气，口半开',
    commonMistakes: ['送气不足成 be', 'e 双元音化'],
    correctionTips: ['送气明显', 'e 单一不滑音'],
    examples: [
      { word: 'ペン', ipa: 'pan', meaning: '钢笔' },
      { word: 'ページ', ipa: 'peeji', meaning: '页' },
    ],
  },
  {
    id: 'jp-d-25', symbol: 'ぽ', category: 'syllable', group: 'dakuten',
    description: 'ぽ（ポ），罗马音 po，IPA [po]。半浊音 p + お。',
    mouthShape: '双唇闭合，送气，唇微圆',
    commonMistakes: ['送气不足成 bo', 'o 过长'],
    correctionTips: ['送气明显', '短促一拍'],
    examples: [
      { word: 'ポスト', ipa: 'posuto', meaning: '邮筒' },
      { word: 'ポケット', ipa: 'poketto', meaning: '口袋' },
    ],
  },

  // ============ 拗音 youon ============
  // きゃきゅきょ
  {
    id: 'jp-yo-1', symbol: 'きゃ', category: 'syllable', group: 'youon',
    description: 'きゃ（キャ），罗马音 kya，IPA [kja]。き + ゃ缩合拗音，一拍。',
    mouthShape: '舌面抬高，迅速滑向 a',
    commonMistakes: ['读成两个音节 ki-ya', 'k 送气过强'],
    correctionTips: ['一拍合成', '送气弱'],
    examples: [
      { word: 'きゃく（客）', ipa: 'kyaku', meaning: '客人' },
      { word: 'キャベツ', ipa: 'kyabetsu', meaning: '卷心菜' },
    ],
  },
  {
    id: 'jp-yo-2', symbol: 'きゅ', category: 'syllable', group: 'youon',
    description: 'きゅ（キュ），罗马音 kyu，IPA [kʲɯ]。u 不圆唇，一拍。',
    mouthShape: '舌面抬高，唇不圆',
    commonMistakes: ['读成 ki-yu', 'u 圆唇'],
    correctionTips: ['一拍合成', 'u 不圆唇'],
    examples: [
      { word: 'きゅうり（胡瓜）', ipa: 'kyuuri', meaning: '黄瓜' },
      { word: 'キューブ', ipa: 'kyuubu', meaning: '方块' },
    ],
  },
  {
    id: 'jp-yo-3', symbol: 'きょ', category: 'syllable', group: 'youon',
    description: 'きょ（キョ），罗马音 kyo，IPA [kjo]。一拍。',
    mouthShape: '舌面抬高，唇微圆',
    commonMistakes: ['读成 ki-yo'],
    correctionTips: ['一拍合成'],
    examples: [
      { word: 'きょう（今日）', ipa: 'kyou', meaning: '今天' },
      { word: 'きょねん（去年）', ipa: 'kyonen', meaning: '去年' },
    ],
  },
  // しゃしゅしょ
  {
    id: 'jp-yo-4', symbol: 'しゃ', category: 'syllable', group: 'youon',
    description: 'しゃ（シャ），罗马音 sha，IPA [ɕa]。し + ゃ，腭化擦音，一拍。',
    mouthShape: '舌面靠近硬腭，迅速滑向 a',
    commonMistakes: ['读成两个音节 shi-ya', '发成中文 sha'],
    correctionTips: ['一拍合成', '腭化 ɕ，舌面靠硬腭'],
    examples: [
      { word: 'しゃしん（写真）', ipa: 'shashin', meaning: '照片' },
      { word: 'シャツ', ipa: 'shatsu', meaning: '衬衫' },
    ],
  },
  {
    id: 'jp-yo-5', symbol: 'しゅ', category: 'syllable', group: 'youon',
    description: 'しゅ（シュ），罗马音 shu，IPA [ɕɯ]。u 不圆唇，一拍。',
    mouthShape: '舌面靠近硬腭，唇略前突、不圆',
    commonMistakes: ['读成 shi-yu', 'u 圆唇成「休」'],
    correctionTips: ['一拍合成', 'u 不圆唇'],
    examples: [
      { word: 'しゅくだい（宿題）', ipa: 'shukudai', meaning: '作业' },
      { word: 'シュガー', ipa: 'shugaa', meaning: '糖' },
    ],
  },
  {
    id: 'jp-yo-6', symbol: 'しょ', category: 'syllable', group: 'youon',
    description: 'しょ（ショ），罗马音 sho，IPA [ɕo]。一拍。',
    mouthShape: '舌面靠近硬腭，唇微圆',
    commonMistakes: ['读成 shi-yo'],
    correctionTips: ['一拍合成'],
    examples: [
      { word: 'しょうせつ（小説）', ipa: 'shousetsu', meaning: '小说' },
      { word: 'ショック', ipa: 'shokku', meaning: '冲击' },
    ],
  },
  // ちゃちゅちょ
  {
    id: 'jp-yo-7', symbol: 'ちゃ', category: 'syllable', group: 'youon',
    description: 'ちゃ（チャ），罗马音 cha，IPA [tɕa]。ち + ゃ，腭化塞擦音，一拍。',
    mouthShape: '舌面抵硬腭，破擦成音',
    commonMistakes: ['读成 chi-ya', '送气过强成中文 qia'],
    correctionTips: ['一拍合成', '送气弱'],
    examples: [
      { word: 'おちゃ（お茶）', ipa: 'ocha', meaning: '茶' },
      { word: 'チャンス', ipa: 'chansu', meaning: '机会' },
    ],
  },
  {
    id: 'jp-yo-8', symbol: 'ちゅ', category: 'syllable', group: 'youon',
    description: 'ちゅ（チュ），罗马音 chu，IPA [tɕɯ]。u 不圆唇，一拍。',
    mouthShape: '舌面抵硬腭，唇略前突、不圆',
    commonMistakes: ['读成 chi-yu', 'u 圆唇'],
    correctionTips: ['一拍合成', 'u 不圆唇'],
    examples: [
      { word: 'ちゅうい（注意）', ipa: 'chuui', meaning: '注意' },
      { word: 'チューブ', ipa: 'chuubu', meaning: '管' },
    ],
  },
  {
    id: 'jp-yo-9', symbol: 'ちょ', category: 'syllable', group: 'youon',
    description: 'ちょ（チョ），罗马音 cho，IPA [tɕo]。一拍。',
    mouthShape: '舌面抵硬腭，唇微圆',
    commonMistakes: ['读成 chi-yo'],
    correctionTips: ['一拍合成'],
    examples: [
      { word: 'ちょう（町）', ipa: 'chou', meaning: '城镇' },
      { word: 'チョコレート', ipa: 'chokoreeto', meaning: '巧克力' },
    ],
  },
  // にゃにゅにょ
  {
    id: 'jp-yo-10', symbol: 'にゃ', category: 'syllable', group: 'youon',
    description: 'にゃ（ニャ），罗马音 nya，IPA [ɲa]。に + ゃ，腭化鼻音，一拍。',
    mouthShape: '舌面抵硬腭，气流从鼻腔出',
    commonMistakes: ['读成 ni-ya'],
    correctionTips: ['一拍合成'],
    examples: [
      { word: 'にゃー（猫の鳴き声）', ipa: 'nyaa', meaning: '喵（猫叫）' },
      { word: 'ニャン', ipa: 'nyan', meaning: '喵' },
    ],
  },
  {
    id: 'jp-yo-11', symbol: 'にゅ', category: 'syllable', group: 'youon',
    description: 'にゅ（ニュ），罗马音 nyu，IPA [ɲɯ]。u 不圆唇，一拍。',
    mouthShape: '舌面抵硬腭，唇不圆',
    commonMistakes: ['读成 ni-yu', 'u 圆唇'],
    correctionTips: ['一拍合成', 'u 不圆唇'],
    examples: [
      { word: 'ニュース', ipa: 'nyuusu', meaning: '新闻' },
      { word: 'にゅういん（入院）', ipa: 'nyuuin', meaning: '住院' },
    ],
  },
  {
    id: 'jp-yo-12', symbol: 'にょ', category: 'syllable', group: 'youon',
    description: 'にょ（ニョ），罗马音 nyo，IPA [ɲo]。一拍。',
    mouthShape: '舌面抵硬腭，唇微圆',
    commonMistakes: ['读成 ni-yo'],
    correctionTips: ['一拍合成'],
    examples: [
      { word: 'にょろにょろ', ipa: 'nyoronyoro', meaning: '蜿蜒滑行（拟态）' },
      { word: 'ニョッキ', ipa: 'nyokki', meaning: '意式土豆团子' },
    ],
  },
  // ひゃひゅひょ
  {
    id: 'jp-yo-13', symbol: 'ひゃ', category: 'syllable', group: 'youon',
    description: 'ひゃ（ヒャ），罗马音 hya，IPA [ça]。ひ + ゃ，腭化擦音，一拍。',
    mouthShape: '舌面靠近硬腭，气流摩擦',
    commonMistakes: ['读成 hi-ya', '发成中文 hia'],
    correctionTips: ['一拍合成', '擦音 ç'],
    examples: [
      { word: 'ひゃく（百）', ipa: 'hyaku', meaning: '百' },
      { word: 'ひゃくぶん（百聞）', ipa: 'hyakubun', meaning: '百闻' },
    ],
  },
  {
    id: 'jp-yo-14', symbol: 'ひゅ', category: 'syllable', group: 'youon',
    description: 'ひゅ（ヒュ），罗马音 hyu，IPA [çɯ]。u 不圆唇，一拍。',
    mouthShape: '舌面靠近硬腭，唇不圆',
    commonMistakes: ['读成 hi-yu', 'u 圆唇'],
    correctionTips: ['一拍合成', 'u 不圆唇'],
    examples: [
      { word: 'ひゅうひゅう', ipa: 'hyuuhyuu', meaning: '呼呼（风声）' },
      { word: 'ヒューマン', ipa: 'hyuuman', meaning: '人类' },
    ],
  },
  {
    id: 'jp-yo-15', symbol: 'ひょ', category: 'syllable', group: 'youon',
    description: 'ひょ（ヒョ），罗马音 hyo，IPA [ço]。一拍。',
    mouthShape: '舌面靠近硬腭，唇微圆',
    commonMistakes: ['读成 hi-yo'],
    correctionTips: ['一拍合成'],
    examples: [
      { word: 'ひょう（氷/豹）', ipa: 'hyou', meaning: '冰/豹' },
      { word: 'ひょうきん（剽軽）', ipa: 'hyoukin', meaning: '滑稽' },
    ],
  },
  // みゃみゅみょ
  {
    id: 'jp-yo-16', symbol: 'みゃ', category: 'syllable', group: 'youon',
    description: 'みゃ（ミャ），罗马音 mya，IPA [mʲa]。み + ゃ，一拍。',
    mouthShape: '双唇闭合，舌面抬高',
    commonMistakes: ['读成 mi-ya'],
    correctionTips: ['一拍合成'],
    examples: [
      { word: 'ミャンマー', ipa: 'myanmaa', meaning: '缅甸' },
      { word: 'みゃく（脈）', ipa: 'myaku', meaning: '脉' },
    ],
  },
  {
    id: 'jp-yo-17', symbol: 'みゅ', category: 'syllable', group: 'youon',
    description: 'みゅ（ミュ），罗马音 myu，IPA [mʲɯ]。u 不圆唇，一拍。',
    mouthShape: '双唇闭合，唇不圆',
    commonMistakes: ['读成 mi-yu', 'u 圆唇'],
    correctionTips: ['一拍合成', 'u 不圆唇'],
    examples: [
      { word: 'ミュージカル', ipa: 'myuujikaru', meaning: '音乐剧' },
      { word: 'ミュート', ipa: 'myuuto', meaning: '静音' },
    ],
  },
  {
    id: 'jp-yo-18', symbol: 'みょ', category: 'syllable', group: 'youon',
    description: 'みょ（ミョ），罗马音 myo，IPA [mʲo]。一拍。',
    mouthShape: '双唇闭合，唇微圆',
    commonMistakes: ['读成 mi-yo'],
    correctionTips: ['一拍合成'],
    examples: [
      { word: 'みょうじ（名字）', ipa: 'myouji', meaning: '姓氏' },
      { word: 'みょうにち（明日）', ipa: 'myounichi', meaning: '明日' },
    ],
  },
  // りゃりゅりょ（闪音 ɾʲ）
  {
    id: 'jp-yo-19', symbol: 'りゃ', category: 'syllable', group: 'youon',
    description: 'りゃ（リャ），罗马音 rya，IPA [ɾʲa]。り + ゃ，闪音，一拍。',
    mouthShape: '舌尖轻弹齿龈，舌面抬高',
    commonMistakes: ['读成 ri-ya', '发成 l 或 r'],
    correctionTips: ['一拍闪音', '舌尖一弹即离'],
    examples: [
      { word: 'りゃくご（略語）', ipa: 'ryakugo', meaning: '略语' },
      { word: 'りゃくず（略図）', ipa: 'ryakuzu', meaning: '简图' },
    ],
  },
  {
    id: 'jp-yo-20', symbol: 'りゅ', category: 'syllable', group: 'youon',
    description: 'りゅ（リュ），罗马音 ryu，IPA [ɾʲɯ]。u 不圆唇，闪音，一拍。',
    mouthShape: '舌尖轻弹齿龈，唇不圆',
    commonMistakes: ['读成 ri-yu', 'u 圆唇', '发成 l 或 r'],
    correctionTips: ['一拍合成', 'u 不圆唇', '闪音一弹即离'],
    examples: [
      { word: 'りゅう（竜）', ipa: 'ryuu', meaning: '龙' },
      { word: 'りゅうがく（留学）', ipa: 'ryuugaku', meaning: '留学' },
    ],
  },
  {
    id: 'jp-yo-21', symbol: 'りょ', category: 'syllable', group: 'youon',
    description: 'りょ（リョ），罗马音 ryo，IPA [ɾʲo]。闪音，一拍。',
    mouthShape: '舌尖轻弹齿龈，唇微圆',
    commonMistakes: ['读成 ri-yo', '发成 l 或 r'],
    correctionTips: ['一拍闪音', '舌尖一弹即离'],
    examples: [
      { word: 'りょうり（料理）', ipa: 'ryouri', meaning: '料理' },
      { word: 'りょかん（旅館）', ipa: 'ryokan', meaning: '旅馆' },
    ],
  },
  // ぎゃぎゅぎょ（浊腭化）
  {
    id: 'jp-yo-22', symbol: 'ぎゃ', category: 'syllable', group: 'youon',
    description: 'ぎゃ（ギャ），罗马音 gya，IPA [ɡʲa]。ぎ + ゃ，浊腭化塞音，一拍。',
    mouthShape: '舌面抵硬腭，松开',
    commonMistakes: ['读成 gi-ya'],
    correctionTips: ['一拍合成'],
    examples: [
      { word: 'ギャグ', ipa: 'gyagu', meaning: '笑料' },
      { word: 'ギャンブル', ipa: 'gyanburu', meaning: '赌博' },
    ],
  },
  {
    id: 'jp-yo-23', symbol: 'ぎゅ', category: 'syllable', group: 'youon',
    description: 'ぎゅ（ギュ），罗马音 gyu，IPA [ɡʲɯ]。u 不圆唇，一拍。',
    mouthShape: '舌面抵硬腭，唇不圆',
    commonMistakes: ['读成 gi-yu', 'u 圆唇'],
    correctionTips: ['一拍合成', 'u 不圆唇'],
    examples: [
      { word: 'ぎゅうにゅう（牛乳）', ipa: 'gyuunyuu', meaning: '牛奶' },
      { word: 'ギュッ', ipa: 'gyu', meaning: '紧紧地（拟态）' },
    ],
  },
  {
    id: 'jp-yo-24', symbol: 'ぎょ', category: 'syllable', group: 'youon',
    description: 'ぎょ（ギョ），罗马音 gyo，IPA [ɡʲo]。一拍。',
    mouthShape: '舌面抵硬腭，唇微圆',
    commonMistakes: ['读成 gi-yo'],
    correctionTips: ['一拍合成'],
    examples: [
      { word: 'ぎょうざ（餃子）', ipa: 'gyouza', meaning: '饺子' },
      { word: 'ぎょかい（漁業界）', ipa: 'gyokai', meaning: '渔业界' },
    ],
  },
  // じゃじゅじょ（浊塞擦音）
  {
    id: 'jp-yo-25', symbol: 'じゃ', category: 'syllable', group: 'youon',
    description: 'じゃ（ジャ），罗马音 ja，IPA [dʑa]。じ + ゃ，浊塞擦音，一拍。',
    mouthShape: '舌面抵硬腭，破擦成音',
    commonMistakes: ['读成 ji-ya', '送气过强成 qia'],
    correctionTips: ['一拍浊音', '声带振动'],
    examples: [
      { word: 'ジャム', ipa: 'jamu', meaning: '果酱' },
      { word: 'じゃがいも', ipa: 'jagaimo', meaning: '土豆' },
    ],
  },
  {
    id: 'jp-yo-26', symbol: 'じゅ', category: 'syllable', group: 'youon',
    description: 'じゅ（ジュ），罗马音 ju，IPA [dʑɯ]。u 不圆唇，一拍。',
    mouthShape: '舌面抵硬腭，唇略前突、不圆',
    commonMistakes: ['读成 ji-yu', 'u 圆唇'],
    correctionTips: ['一拍合成', 'u 不圆唇'],
    examples: [
      { word: 'ジュース', ipa: 'juusu', meaning: '果汁' },
      { word: 'じゅぎょう（授業）', ipa: 'jugyou', meaning: '课' },
    ],
  },
  {
    id: 'jp-yo-27', symbol: 'じょ', category: 'syllable', group: 'youon',
    description: 'じょ（ジョ），罗马音 jo，IPA [dʑo]。一拍。',
    mouthShape: '舌面抵硬腭，唇微圆',
    commonMistakes: ['读成 ji-yo'],
    correctionTips: ['一拍合成'],
    examples: [
      { word: 'じょせい（女性）', ipa: 'josei', meaning: '女性' },
      { word: 'ジョーク', ipa: 'jooku', meaning: '玩笑' },
    ],
  },
  // びゃびゅびょ（浊双唇腭化）
  {
    id: 'jp-yo-28', symbol: 'びゃ', category: 'syllable', group: 'youon',
    description: 'びゃ（ビャ），罗马音 bya，IPA [bʲa]。び + ゃ，一拍。',
    mouthShape: '双唇闭合，舌面抬高',
    commonMistakes: ['读成 bi-ya'],
    correctionTips: ['一拍合成'],
    examples: [
      { word: 'ビャクダン（白檀）', ipa: 'byakudan', meaning: '白檀' },
      { word: 'ビャッコ（白虎）', ipa: 'byakko', meaning: '白虎' },
    ],
  },
  {
    id: 'jp-yo-29', symbol: 'びゅ', category: 'syllable', group: 'youon',
    description: 'びゅ（ビュ），罗马音 byu，IPA [bʲɯ]。u 不圆唇，一拍。',
    mouthShape: '双唇闭合，唇不圆',
    commonMistakes: ['读成 bi-yu', 'u 圆唇'],
    correctionTips: ['一拍合成', 'u 不圆唇'],
    examples: [
      { word: 'ビュッフェ', ipa: 'byuffe', meaning: '自助餐' },
      { word: 'ビューティー', ipa: 'byuutii', meaning: '美' },
    ],
  },
  {
    id: 'jp-yo-30', symbol: 'びょ', category: 'syllable', group: 'youon',
    description: 'びょ（ビョ），罗马音 byo，IPA [bʲo]。一拍。',
    mouthShape: '双唇闭合，唇微圆',
    commonMistakes: ['读成 bi-yo'],
    correctionTips: ['一拍合成'],
    examples: [
      { word: 'びょうき（病気）', ipa: 'byouki', meaning: '病' },
      { word: 'びょういん（病院）', ipa: 'byouin', meaning: '医院' },
    ],
  },
  // ぴゃぴゅぴょ（半浊音腭化，送气）
  {
    id: 'jp-yo-31', symbol: 'ぴゃ', category: 'syllable', group: 'youon',
    description: 'ぴゃ（ピャ），罗马音 pya，IPA [pʲa]。ぴ + ゃ，送气，一拍。',
    mouthShape: '双唇闭合，送气，舌面抬高',
    commonMistakes: ['读成 pi-ya', '送气不足成 bya'],
    correctionTips: ['一拍送气', '送气明显'],
    examples: [
      { word: 'はっぴゃく（八百）', ipa: 'happyaku', meaning: '八百' },
      { word: 'ピャッ', ipa: 'pya', meaning: '啪（拟声）' },
    ],
  },
  {
    id: 'jp-yo-32', symbol: 'ぴゅ', category: 'syllable', group: 'youon',
    description: 'ぴゅ（ピュ），罗马音 pyu，IPA [pʲɯ]。u 不圆唇，送气，一拍。',
    mouthShape: '双唇闭合，送气，唇不圆',
    commonMistakes: ['读成 pi-yu', 'u 圆唇', '送气不足'],
    correctionTips: ['一拍合成', 'u 不圆唇', '送气明显'],
    examples: [
      { word: 'ピュア', ipa: 'pyua', meaning: '纯粹' },
      { word: 'ピュッ', ipa: 'pyu', meaning: '嗖（拟声）' },
    ],
  },
  {
    id: 'jp-yo-33', symbol: 'ぴょ', category: 'syllable', group: 'youon',
    description: 'ぴょ（ピョ），罗马音 pyo，IPA [pʲo]。送气，一拍。',
    mouthShape: '双唇闭合，送气，唇微圆',
    commonMistakes: ['读成 pi-yo', '送气不足成 byo'],
    correctionTips: ['一拍送气', '送气明显'],
    examples: [
      { word: 'はっぴょう（発表）', ipa: 'happyou', meaning: '发表' },
      { word: 'ぴょんぴょん', ipa: 'pyonpyon', meaning: '蹦蹦跳跳（拟态）' },
    ],
  },
];

export const japanesePhoneticsData: LanguagePhoneticsData = {
  language: 'japanese' as Language,
  title: '日语五十音',
  subtitle: '清音 + 浊音/半浊音 + 拗音 · 平假名/片假名 · 录音评测 + 个性化矫正',
  type: 'syllabary',
  accents: [
    { value: 'standard', label: '🇯🇵 标准音', flag: '🇯🇵', ttsLang: 'ja-JP', recognitionLang: 'ja-JP' },
  ],
  defaultAccent: 'standard',
  groups: japaneseGroups,
  phonemes: japanesePhonemes,
  getPhonemesByGroup: makeGroupFilter(japanesePhonemes),
};

// ============================================================
// 韩语字母（korean / 한글）
// 辅音(子音) 19 + 元音(母音) 14 + 收音 7
// symbol 用韩文字母（jamo），category: 辅音 'consonant' / 元音 'vowel' / 收音 'letter'
// ============================================================

const koreanGroups = [
  { id: 'consonant', name: '辅音（자음）', description: 'ㄱ～ㅎ + 紧音 ㄲㄸㅃㅆㅉ，共 19 个' },
  { id: 'vowel', name: '元音（모음）', description: 'ㅏ～ㅣ + ㅐㅔㅒㅖ，共 14 个' },
  { id: 'batchim', name: '收音（받침）', description: '7 个代表音：ㄱ ㄴ ㄷ ㄹ ㅁ ㅂ ㅇ' },
];

const koreanPhonemes: Phoneme[] = [
  // ============ 辅音 자음 ============
  {
    id: 'ko-c-1', symbol: 'ㄱ', category: 'consonant', group: 'consonant',
    description: 'ㄱ（기역 giyeok），松音。词首近 k（轻送气），词中近 g。罗马字 g/k。',
    mouthShape: '舌根抵软腭，松开',
    commonMistakes: ['词首送气过强成中文「卡」', '与送气音ㅋ、紧音ㄲ不分'],
    correctionTips: ['松音送气最弱，介于 k/g 之间', '对比 ㅋ(强送气)/ㄱ(弱)/ㄲ(紧)'],
    examples: [
      { word: '가다', ipa: 'gada', meaning: '去' },
      { word: '가을', ipa: 'gaeul', meaning: '秋天' },
      { word: '고기', ipa: 'gogi', meaning: '肉' },
    ],
  },
  {
    id: 'ko-c-2', symbol: 'ㄴ', category: 'consonant', group: 'consonant',
    description: 'ㄴ（니은 nieun），鼻音 n。罗马字 n。',
    mouthShape: '舌尖抵上齿龈，气流从鼻腔出',
    commonMistakes: ['n/ng 不分（受汉语影响）'],
    correctionTips: ['舌尖抵齿龈，发前鼻音'],
    examples: [
      { word: '나무', ipa: 'namu', meaning: '树' },
      { word: '나비', ipa: 'nabi', meaning: '蝴蝶' },
      { word: '눈', ipa: 'nun', meaning: '雪/眼' },
    ],
  },
  {
    id: 'ko-c-3', symbol: 'ㄷ', category: 'consonant', group: 'consonant',
    description: 'ㄷ（디귿 digeut），松音。词首近 t，词中近 d。罗马字 d/t。',
    mouthShape: '舌尖抵上齿龈，松开',
    commonMistakes: ['词首送气过强成中文「他」', '与ㅌ/ㄸ不分'],
    correctionTips: ['松音送气弱', '对比 ㅌ(送气)/ㄷ(弱)/ㄸ(紧)'],
    examples: [
      { word: '다리', ipa: 'dari', meaning: '腿/桥' },
      { word: '도서관', ipa: 'doseogwan', meaning: '图书馆' },
      { word: '돌', ipa: 'dol', meaning: '石头' },
    ],
  },
  {
    id: 'ko-c-4', symbol: 'ㄹ', category: 'consonant', group: 'consonant',
    description: 'ㄹ（리을 rieul），闪音/边音。**词首近闪音 r [ɾ]，词中/收音近 l**，介于 l 和 r 之间。',
    mouthShape: '舌尖轻弹齿龈',
    commonMistakes: ['**发成纯 l 或纯 r**，最常见', '与中文 l/r 混淆'],
    correctionTips: ['词首像短促的 r（舌尖弹一下）', '词中/收音像 l，不同于日语的纯闪音'],
    examples: [
      { word: '라면', ipa: 'ramyeon', meaning: '拉面' },
      { word: '사랑', ipa: 'sarang', meaning: '爱' },
      { word: '나라', ipa: 'nara', meaning: '国家' },
    ],
  },
  {
    id: 'ko-c-5', symbol: 'ㅁ', category: 'consonant', group: 'consonant',
    description: 'ㅁ（미음 mieum），双唇鼻音 m。罗马字 m。',
    mouthShape: '双唇闭合，气流从鼻腔出',
    commonMistakes: ['收音时与 ng 混'],
    correctionTips: ['双唇鼻音，闭合双唇'],
    examples: [
      { word: '마음', ipa: 'maeum', meaning: '心' },
      { word: '바다', ipa: 'bada', meaning: '海' },
      { word: '문', ipa: 'mun', meaning: '门' },
    ],
  },
  {
    id: 'ko-c-6', symbol: 'ㅂ', category: 'consonant', group: 'consonant',
    description: 'ㅂ（비읍 bieup），松音。词首近 p（弱送气），词中近 b。罗马字 b/p。',
    mouthShape: '双唇闭合，松开',
    commonMistakes: ['词首送气过强成中文「怕」', '与ㅍ/ㅃ不分'],
    correctionTips: ['松音送气弱', '对比 ㅍ(送气)/ㅂ(弱)/ㅃ(紧)'],
    examples: [
      { word: '바다', ipa: 'bada', meaning: '海' },
      { word: '보라', ipa: 'bora', meaning: '紫色' },
      { word: '방', ipa: 'bang', meaning: '房间' },
    ],
  },
  {
    id: 'ko-c-7', symbol: 'ㅅ', category: 'consonant', group: 'consonant',
    description: 'ㅅ（시옷 siot），松音擦音 s。罗马字 s。',
    mouthShape: '舌尖接近上门齿背',
    commonMistakes: ['s 过重成中文「撒」', '与紧音ㅆ不分'],
    correctionTips: ['轻擦', '对比 ㅆ(紧)/ㅅ(松)'],
    examples: [
      { word: '사과', ipa: 'sagwa', meaning: '苹果' },
      { word: '소', ipa: 'so', meaning: '牛' },
      { word: '숲', ipa: 'sup', meaning: '森林' },
    ],
  },
  {
    id: 'ko-c-8', symbol: 'ㅇ', category: 'consonant', group: 'consonant',
    description: 'ㅇ（이응 ieung）。**作首音时不发音**（占位），作收音时发 [ŋ] ng。',
    mouthShape: '首音不发音，舌位直接接元音',
    commonMistakes: ['**作首音时发成 ng 或 n**，最常见', '误把 아 读成 nga'],
    correctionTips: ['首音ㅇ完全不发音，直接发元音', '只有收音位置才发 ng'],
    examples: [
      { word: '아이', ipa: 'ai', meaning: '孩子' },
      { word: '언니', ipa: 'eonni', meaning: '姐姐（女称）' },
      { word: '이름', ipa: 'ireum', meaning: '名字' },
    ],
  },
  {
    id: 'ko-c-9', symbol: 'ㅈ', category: 'consonant', group: 'consonant',
    description: 'ㅈ（지읒 jieut），松音塞擦音。词首近 ch（弱送气），词中近 j。罗马字 j。',
    mouthShape: '舌面抵硬腭，破擦成音',
    commonMistakes: ['词首送气过强成中文「恰」', '与ㅊ/ㅉ不分'],
    correctionTips: ['松音送气弱', '对比 ㅊ(送气)/ㅈ(弱)/ㅉ(紧)'],
    examples: [
      { word: '자동차', ipa: 'jadongcha', meaning: '汽车' },
      { word: '지도', ipa: 'jido', meaning: '地图' },
      { word: '잠', ipa: 'jam', meaning: '觉' },
    ],
  },
  {
    id: 'ko-c-10', symbol: 'ㅊ', category: 'consonant', group: 'consonant',
    description: 'ㅊ（치읓 chieut），送气音 ch。罗马字 ch。',
    mouthShape: '舌面抵硬腭，强送气破擦',
    commonMistakes: ['送气不足成 ㅈ'],
    correctionTips: ['强送气，对比 ㅈ/ㅊ'],
    examples: [
      { word: '차', ipa: 'cha', meaning: '茶/车' },
      { word: '춤', ipa: 'chum', meaning: '舞' },
      { word: '친구', ipa: 'chingu', meaning: '朋友' },
    ],
  },
  {
    id: 'ko-c-11', symbol: 'ㅋ', category: 'consonant', group: 'consonant',
    description: 'ㅋ（키읔 kieuk），送气音 k。罗马字 k。',
    mouthShape: '舌根抵软腭，强送气',
    commonMistakes: ['送气不足成 ㄱ'],
    correctionTips: ['强送气，对比 ㄱ/ㅋ'],
    examples: [
      { word: '코', ipa: 'ko', meaning: '鼻子' },
      { word: '카메라', ipa: 'kamera', meaning: '相机' },
      { word: '키', ipa: 'ki', meaning: '身高/钥匙' },
    ],
  },
  {
    id: 'ko-c-12', symbol: 'ㅌ', category: 'consonant', group: 'consonant',
    description: 'ㅌ（티읕 tieut），送气音 t。罗马字 t。',
    mouthShape: '舌尖抵齿龈，强送气',
    commonMistakes: ['送气不足成 ㄷ'],
    correctionTips: ['强送气，对比 ㄷ/ㅌ'],
    examples: [
      { word: '타다', ipa: 'tada', meaning: '乘坐' },
      { word: '토요일', ipa: 'toyoil', meaning: '星期六' },
      { word: '태양', ipa: 'taeyang', meaning: '太阳' },
    ],
  },
  {
    id: 'ko-c-13', symbol: 'ㅍ', category: 'consonant', group: 'consonant',
    description: 'ㅍ（피읖 pieup），送气音 p。罗马字 p。',
    mouthShape: '双唇闭合，强送气',
    commonMistakes: ['送气不足成 ㅂ'],
    correctionTips: ['强送气，对比 ㅂ/ㅍ'],
    examples: [
      { word: '파', ipa: 'pa', meaning: '葱' },
      { word: '포도', ipa: 'podo', meaning: '葡萄' },
      { word: '편지', ipa: 'pyeonji', meaning: '信' },
    ],
  },
  {
    id: 'ko-c-14', symbol: 'ㅎ', category: 'consonant', group: 'consonant',
    description: 'ㅎ（히읗 hieut），喉擦音 h。罗马字 h。',
    mouthShape: '气流从声门摩擦',
    commonMistakes: ['h 过重成中文「哈」', '与松音不分'],
    correctionTips: ['轻擦，气流弱'],
    examples: [
      { word: '하늘', ipa: 'haneul', meaning: '天空' },
      { word: '하다', ipa: 'hada', meaning: '做' },
      { word: '호수', ipa: 'hosu', meaning: '湖' },
    ],
  },
  {
    id: 'ko-c-15', symbol: 'ㄲ', category: 'consonant', group: 'consonant',
    description: 'ㄲ（쌍기역 ssang-giyeok），**紧音**。舌根紧绷，几乎不送气，声门紧张。罗马字 kk。',
    mouthShape: '舌根紧抵软腭，肌肉紧张',
    commonMistakes: ['**与松音ㄱ不分**（中国学习者最难点）', '发成送气音ㅋ'],
    correctionTips: ['紧音 = 喉部紧张、不送气、短促有力', '对比 ㅋ(送气)/ㄱ(松)/ㄲ(紧)'],
    examples: [
      { word: '꼬리', ipa: 'kkori', meaning: '尾巴' },
      { word: '꼬마', ipa: 'kkoma', meaning: '小孩' },
      { word: '꽃', ipa: 'kkot', meaning: '花' },
    ],
  },
  {
    id: 'ko-c-16', symbol: 'ㄸ', category: 'consonant', group: 'consonant',
    description: 'ㄸ（쌍디귿 ssang-digeut），紧音 tt。罗马字 tt。',
    mouthShape: '舌尖紧抵齿龈，肌肉紧张',
    commonMistakes: ['与松音ㄷ不分'],
    correctionTips: ['紧音短促紧张不送气', '对比 ㅌ(送气)/ㄷ(松)/ㄸ(紧)'],
    examples: [
      { word: '또', ipa: 'tto', meaning: '又' },
      { word: '떡', ipa: 'tteok', meaning: '年糕' },
      { word: '땀', ipa: 'ttam', meaning: '汗' },
    ],
  },
  {
    id: 'ko-c-17', symbol: 'ㅃ', category: 'consonant', group: 'consonant',
    description: 'ㅃ（쌍비읍 ssang-bieup），紧音 pp。罗马字 pp。',
    mouthShape: '双唇紧闭，肌肉紧张',
    commonMistakes: ['与松音ㅂ不分'],
    correctionTips: ['紧音不送气紧张', '对比 ㅍ(送气)/ㅂ(松)/ㅃ(紧)'],
    examples: [
      { word: '빠르다', ipa: 'ppareuda', meaning: '快' },
      { word: '빵', ipa: 'ppang', meaning: '面包' },
      { word: '뽀뽀', ipa: 'ppoppo', meaning: '亲亲' },
    ],
  },
  {
    id: 'ko-c-18', symbol: 'ㅆ', category: 'consonant', group: 'consonant',
    description: 'ㅆ（쌍시옷 ssang-siot），紧音 ss。罗马字 ss。',
    mouthShape: '舌尖紧抵齿背，肌肉紧张',
    commonMistakes: ['与松音ㅅ不分'],
    correctionTips: ['紧音紧张，摩擦更强烈', '对比 ㅆ(紧)/ㅅ(松)'],
    examples: [
      { word: '쓰다', ipa: 'sseuda', meaning: '写/用/苦' },
      { word: '쌀', ipa: 'ssal', meaning: '米' },
      { word: '씨', ipa: 'ssi', meaning: '种子' },
    ],
  },
  {
    id: 'ko-c-19', symbol: 'ㅉ', category: 'consonant', group: 'consonant',
    description: 'ㅉ（쌍지읒 ssang-jieut），紧音 jj。罗马字 jj。',
    mouthShape: '舌面紧抵硬腭，肌肉紧张',
    commonMistakes: ['与松音ㅈ不分'],
    correctionTips: ['紧音紧张，破擦更强烈', '对比 ㅊ(送气)/ㅈ(松)/ㅉ(紧)'],
    examples: [
      { word: '짜다', ipa: 'jjada', meaning: '咸' },
      { word: '짜장면', ipa: 'jjajangmyeon', meaning: '炸酱面' },
      { word: '찌개', ipa: 'jjigae', meaning: '汤锅' },
    ],
  },

  // ============ 元音（모음） ko-v-1 ~ ko-v-14 ============
  {
    id: 'ko-v-1', symbol: 'ㅏ', category: 'vowel', group: 'vowel',
    description: 'ㅏ（아），罗马字 a，IPA [a]。开口前元音，比中文「啊」略靠前。',
    mouthShape: '口自然张开，舌平放，唇不圆',
    commonMistakes: ['发成中文「啊」过于靠后'],
    correctionTips: ['舌位略前，口型适中', '短促清晰'],
    examples: [
      { word: '아이', ipa: 'ai', meaning: '孩子' },
      { word: '바다', ipa: 'bada', meaning: '海' },
      { word: '아버지', ipa: 'abeoji', meaning: '父亲' },
    ],
  },
  {
    id: 'ko-v-2', symbol: 'ㅑ', category: 'vowel', group: 'vowel',
    description: 'ㅑ（야），罗马字 ya，IPA [ja]。半元音 j + ㅏ。',
    mouthShape: '由 i 滑向 a，唇由展到开',
    commonMistakes: ['滑音不明显成单元音'],
    correctionTips: ['明显由 i 滑向 a', '一气呵成'],
    examples: [
      { word: '야구', ipa: 'yagu', meaning: '棒球' },
      { word: '야채', ipa: 'yachae', meaning: '蔬菜' },
      { word: '야외', ipa: 'yaoe', meaning: '野外' },
    ],
  },
  {
    id: 'ko-v-3', symbol: 'ㅓ', category: 'vowel', group: 'vowel',
    description: 'ㅓ（어），罗马字 eo，IPA [ʌ]。**开口比ㅏ小**的中后元音，唇不圆。',
    mouthShape: '口半开，舌位略后，唇不圆',
    commonMistakes: ['**发成与ㅏ相同的开口元音**（最常见）', '发成圆唇音'],
    correctionTips: ['**开口比ㅏ小，舌位略后**', '唇不圆，口型半开'],
    examples: [
      { word: '어머니', ipa: 'eomeoni', meaning: '母亲' },
      { word: '선생님', ipa: 'seonsaengnim', meaning: '老师' },
      { word: '어디', ipa: 'eodi', meaning: '哪里' },
    ],
  },
  {
    id: 'ko-v-4', symbol: 'ㅕ', category: 'vowel', group: 'vowel',
    description: 'ㅕ（여），罗马字 yeo，IPA [jʌ]。半元音 j + ㅓ。',
    mouthShape: '由 i 滑向 ʌ，唇由展到半开',
    commonMistakes: ['与ㅑ混淆，起点不对'],
    correctionTips: ['滑向 ㅓ（开口比 a 小）', '注意终点口型'],
    examples: [
      { word: '여자', ipa: 'yeoja', meaning: '女子' },
      { word: '여행', ipa: 'yeohaeng', meaning: '旅行' },
      { word: '교실', ipa: 'gyosil', meaning: '教室（含ㅕ）' },
    ],
  },
  {
    id: 'ko-v-5', symbol: 'ㅗ', category: 'vowel', group: 'vowel',
    description: 'ㅗ（오），罗马字 o，IPA [o]。圆唇后元音，口型比中文「哦」更小更圆。',
    mouthShape: '嘴唇收圆略前突，口型小',
    commonMistakes: ['发成中文「哦」过长过开'],
    correctionTips: ['嘴唇收圆收小', '短促清晰'],
    examples: [
      { word: '오이', ipa: 'oi', meaning: '黄瓜' },
      { word: '소녀', ipa: 'sonyeo', meaning: '少女' },
      { word: '오빠', ipa: 'oppa', meaning: '哥哥（女称）' },
    ],
  },
  {
    id: 'ko-v-6', symbol: 'ㅛ', category: 'vowel', group: 'vowel',
    description: 'ㅛ（요），罗马字 yo，IPA [jo]。半元音 j + ㅗ。',
    mouthShape: '由 i 滑向 o，唇由展到圆',
    commonMistakes: ['滑音不明显'],
    correctionTips: ['明显由 i 滑向 o', '终点圆唇'],
    examples: [
      { word: '요리', ipa: 'yori', meaning: '料理' },
      { word: '교회', ipa: 'gyohoe', meaning: '教会' },
      { word: '소요', ipa: 'soyo', meaning: '消耗' },
    ],
  },
  {
    id: 'ko-v-7', symbol: 'ㅜ', category: 'vowel', group: 'vowel',
    description: 'ㅜ（우），罗马字 u，IPA [u]。圆唇后元音，比中文「乌」更前更紧。',
    mouthShape: '嘴唇圆撮前突，舌后部抬高',
    commonMistakes: ['发成松散的中文「乌」'],
    correctionTips: ['嘴唇圆撮前突', '比中文「乌」更前更紧'],
    examples: [
      { word: '우유', ipa: 'uyu', meaning: '牛奶' },
      { word: '누나', ipa: 'nuna', meaning: '姐姐（男称）' },
      { word: '우산', ipa: 'usan', meaning: '伞' },
    ],
  },
  {
    id: 'ko-v-8', symbol: 'ㅠ', category: 'vowel', group: 'vowel',
    description: 'ㅠ（유），罗马字 yu，IPA [ju]。半元音 j + ㅜ。',
    mouthShape: '由 i 滑向 u，唇由展到圆',
    commonMistakes: ['滑音不明显'],
    correctionTips: ['明显由 i 滑向 u', '终点圆唇前突'],
    examples: [
      { word: '유리', ipa: 'yuri', meaning: '玻璃' },
      { word: '학교', ipa: 'hakgyo', meaning: '学校' },
      { word: '우유', ipa: 'uyu', meaning: '牛奶（含ㅠ）' },
    ],
  },
  {
    id: 'ko-v-9', symbol: 'ㅡ', category: 'vowel', group: 'vowel',
    description: 'ㅡ（으），罗马字 eu，IPA [ɯ]。**不圆唇后元音**，与中文「乌」圆唇完全不同。',
    mouthShape: '嘴唇**不圆**、自然平展微开，舌后部抬高',
    commonMistakes: ['**发成圆唇的中文「乌」**（最常见）', '嘴唇撅起成圆形'],
    correctionTips: ['嘴唇放松平展，不要撅嘴', '想象发「乌」但不圆唇，嘴角略往两边'],
    examples: [
      { word: '으아', ipa: 'ueua', meaning: '呻吟声' },
      { word: '그', ipa: 'geu', meaning: '他' },
      { word: '쓰다', ipa: 'sseuda', meaning: '写/用' },
    ],
  },
  {
    id: 'ko-v-10', symbol: 'ㅣ', category: 'vowel', group: 'vowel',
    description: 'ㅣ（이），罗马字 i，IPA [i]。前高元音，比中文「衣」更松。',
    mouthShape: '嘴角略向两侧平展，舌前部抬高，唇不圆',
    commonMistakes: ['发成中文「衣」过紧过尖'],
    correctionTips: ['舌头和嘴唇放松', '比中文「衣」更松更平'],
    examples: [
      { word: '이름', ipa: 'ireum', meaning: '名字' },
      { word: '시계', ipa: 'sigye', meaning: '钟表' },
      { word: '비', ipa: 'bi', meaning: '雨' },
    ],
  },
  {
    id: 'ko-v-11', symbol: 'ㅐ', category: 'vowel', group: 'vowel',
    description: 'ㅐ（애），罗马字 ae，IPA [ɛ]。中前元音，开口比ㅔ略大。',
    mouthShape: '口半开，舌位前中，唇不圆',
    commonMistakes: ['与ㅔ混淆不分（现代韩语已合并）', '发成双元音'],
    correctionTips: ['理论开口比ㅔ略大', '单一元音不滑音', '现代口语中ㅐ/ㅔ同音，但拼写仍区分'],
    examples: [
      { word: '애인', ipa: 'aein', meaning: '爱人' },
      { word: '내일', ipa: 'naeil', meaning: '明天' },
      { word: '개', ipa: 'gae', meaning: '狗' },
    ],
  },
  {
    id: 'ko-v-12', symbol: 'ㅔ', category: 'vowel', group: 'vowel',
    description: 'ㅔ（에），罗马字 e，IPA [e]。中前元音，开口比ㅐ略小。',
    mouthShape: '口半开略小，舌位前中，唇不圆',
    commonMistakes: ['与ㅐ混淆', '发成双元音「诶」'],
    correctionTips: ['理论开口比ㅐ略小', '单一元音不滑音'],
    examples: [
      { word: '에너지', ipa: 'enerji', meaning: '能量' },
      { word: '세상', ipa: 'sesang', meaning: '世界' },
      { word: '네', ipa: 'ne', meaning: '是/你' },
    ],
  },
  {
    id: 'ko-v-13', symbol: 'ㅒ', category: 'vowel', group: 'vowel',
    description: 'ㅒ（얘），罗马字 yae，IPA [jɛ]。半元音 j + ㅐ。',
    mouthShape: '由 i 滑向 ɛ，唇由展到半开',
    commonMistakes: ['与ㅖ混淆', '滑音不明显'],
    correctionTips: ['明显由 i 滑向 ɛ', '现代口语多与ㅖ同音'],
    examples: [
      { word: '얘기', ipa: 'yaegi', meaning: '故事/话' },
      { word: '쟤', ipa: 'jae', meaning: '那孩子' },
    ],
  },
  {
    id: 'ko-v-14', symbol: 'ㅖ', category: 'vowel', group: 'vowel',
    description: 'ㅖ（예），罗马字 ye，IPA [je]。半元音 j + ㅔ。',
    mouthShape: '由 i 滑向 e，唇由展到半开',
    commonMistakes: ['与ㅒ混淆', '滑音不明显'],
    correctionTips: ['明显由 i 滑向 e', '现代口语多与ㅒ同音'],
    examples: [
      { word: '예의', ipa: 'yeui', meaning: '礼仪' },
      { word: '예쁘다', ipa: 'yeppeuda', meaning: '漂亮' },
      { word: '예감', ipa: 'yegam', meaning: '预感' },
    ],
  },

  // ============ 收音（받침） ko-b-1 ~ ko-b-7 ============
  // 韩语虽有 27 个理论收音，但实际只发 7 个代表音
  {
    id: 'ko-b-1', symbol: 'ㄱ', category: 'letter', group: 'batchim',
    description: '收音 ㄱ，IPA [k]。词尾不发 g 而发不送气清音 k，似堵住气流。',
    mouthShape: '舌根抵软腭，气流被堵住后不发爆破',
    commonMistakes: ['发成有声的「克」', '送气过强'],
    correctionTips: ['只堵气不爆破，无声', '不要加元音', ' ㄲ/ㅋ/ㄳ/ㄺ 收音同 ㄱ'],
    examples: [
      { word: '국', ipa: 'guk', meaning: '汤' },
      { word: '부엌', ipa: 'bu-eok', meaning: '厨房' },
      { word: '밖', ipa: 'bak', meaning: '外面' },
    ],
  },
  {
    id: 'ko-b-2', symbol: 'ㄴ', category: 'letter', group: 'batchim',
    description: '收音 ㄴ，IPA [n]。前鼻音，气流从鼻腔出。',
    mouthShape: '舌尖抵上齿龈，气流从鼻腔出',
    commonMistakes: ['发成后鼻音 ng', '鼻音过重'],
    correctionTips: ['前鼻音，舌尖抵上齿龈', 'ㄴ/ㄵ/ㄶ 收音同 ㄴ'],
    examples: [
      { word: '안', ipa: 'an', meaning: '内' },
      { word: '눈', ipa: 'nun', meaning: '眼/雪' },
      { word: '한', ipa: 'han', meaning: '一（量词）' },
    ],
  },
  {
    id: 'ko-b-3', symbol: 'ㄷ', category: 'letter', group: 'batchim',
    description: '收音 ㄷ，IPA [t]。词尾不发 d 而发不送气清音 t，似堵住气流。',
    mouthShape: '舌尖抵上齿龈，气流被堵住后不发爆破',
    commonMistakes: ['发成有声的「德」', '送气过强成 ㅌ'],
    correctionTips: ['只堵气不爆破，无声', '不要加元音', 'ㄷ/ㅅ/ㅈ/ㅊ/ㅌ/ㅆ 收音同 ㄷ'],
    examples: [
      { word: '굿', ipa: 'gut', meaning: '巫祭' },
      { word: '있다', ipa: 'itda', meaning: '有/在' },
      { word: '밭', ipa: 'bat', meaning: '田' },
    ],
  },
  {
    id: 'ko-b-4', symbol: 'ㄹ', category: 'letter', group: 'batchim',
    description: '收音 ㄹ，IPA [l]。**收音位置发成清晰的边音 l**，与词首闪音 ɾ 不同。',
    mouthShape: '舌尖抵上齿龈，气流从舌两侧出',
    commonMistakes: ['**收音仍发成闪音 ɾ**', '与词首 ㄹ 混淆'],
    correctionTips: ['收音 ㄹ 发成清晰的 l', '词首 ㄹ 才是闪音 ɾ', 'ㄹ/ㄼ/ㄽ/ㄾ/ㄿ 收音同 ㄹ'],
    examples: [
      { word: '달', ipa: 'dal', meaning: '月亮' },
      { word: '물', ipa: 'mul', meaning: '水' },
      { word: '삶', ipa: 'sam', meaning: '生活（实际收音 ㄹ）' },
    ],
  },
  {
    id: 'ko-b-5', symbol: 'ㅁ', category: 'letter', group: 'batchim',
    description: '收音 ㅁ，IPA [m]。双唇鼻音，气流从鼻腔出。',
    mouthShape: '双唇紧闭，气流从鼻腔出',
    commonMistakes: ['发成 n', '双唇未闭合'],
    correctionTips: ['双唇紧闭发 m', 'ㅁ/ㄻ 收音同 ㅁ'],
    examples: [
      { word: '남', ipa: 'nam', meaning: '别人' },
      { word: '감', ipa: 'gam', meaning: '柿子' },
      { word: '밤', ipa: 'bam', meaning: '栗子/夜' },
    ],
  },
  {
    id: 'ko-b-6', symbol: 'ㅂ', category: 'letter', group: 'batchim',
    description: '收音 ㅂ，IPA [p]。词尾不发 b 而发不送气清音 p，双唇紧闭。',
    mouthShape: '双唇紧闭，气流被堵住后不发爆破',
    commonMistakes: ['发成有声的「不」', '送气过强成 ㅍ'],
    correctionTips: ['双唇紧闭不爆破，无声', '不要加元音', 'ㅂ/ㅍ/ㄼ/ㅄ 收音同 ㅂ'],
    examples: [
      { word: '밥', ipa: 'bap', meaning: '饭' },
      { word: '앞', ipa: 'ap', meaning: '前' },
      { word: '덮다', ipa: 'deopda', meaning: '盖（含收音 ㅂ）' },
    ],
  },
  {
    id: 'ko-b-7', symbol: 'ㅇ', category: 'letter', group: 'batchim',
    description: '收音 ㅇ，IPA [ŋ]。**作收音时发后鼻音 ng**，与词首不发音完全不同。',
    mouthShape: '舌根抵软腭，气流从鼻腔出',
    commonMistakes: ['**收音 ㅇ 也不发音**（最常见）', '发成 n'],
    correctionTips: ['**词首 ㅇ 不发音，收音 ㅇ 发 ng**', '后鼻音，舌根抵软腭'],
    examples: [
      { word: '강', ipa: 'gang', meaning: '江' },
      { word: '방', ipa: 'bang', meaning: '房间' },
      { word: '공원', ipa: 'gongwon', meaning: '公园' },
    ],
  },
];

// ============================================================
// 韩语字母发音数据导出
// ============================================================
export const koreanPhoneticsData: LanguagePhoneticsData = {
  language: 'korean' as Language,
  title: '韩语字母',
  subtitle: '辅音(子音) + 元音(母音) + 收音 · 한글 · 录音评测 + 个性化矫正',
  type: 'alphabet',
  accents: [{ value: 'standard', label: '🇰🇷 标准音', flag: '🇰🇷', ttsLang: 'ko-KR', recognitionLang: 'ko-KR' }],
  defaultAccent: 'standard',
  groups: koreanGroups,
  phonemes: koreanPhonemes,
  getPhonemesByGroup: makeGroupFilter(koreanPhonemes),
};