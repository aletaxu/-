import type { GenerateParams, GeneratedContent, ThemeType, ToneType } from "./types";

// 主题×语气 文案模板库
// 占位符：{recipient} {sender} {salutation}
interface ToneBundle {
  titles: string[];
  bodies: string[];
  signatures: string[];
}

type TemplateMap = Record<ThemeType, Record<ToneType, ToneBundle>>;

const TEMPLATES: TemplateMap = {
  birthday: {
    warm: {
      titles: ["生日快乐，{recipient}", "致{recipient}的生辰", "愿你被世界温柔以待"],
      bodies: [
        "{salutation}{recipient}，又一年时光轻柔地翻过。愿你新的一岁，眼里有星光，心中有暖阳，所遇皆是温柔，所行皆化坦途。",
        "今天是属于你的日子。{salutation}{recipient}，愿岁月待你如初见，愿欢笑填满你的每一天，生日快乐。",
        "烛光摇曳间，把你一整年的辛苦都点亮成祝福。{salutation}{recipient}，愿你往后余生，皆有挚友相伴、有热爱可循。",
      ],
      signatures: ["—— 永远爱你的 {sender}", "—— {sender} 敬上", "—— 你的 {sender}"],
    },
    humor: {
      titles: ["又老了一岁啦{recipient}", "生日快乐（别哭）", "警告：{recipient}正在变老"],
      bodies: [
        "{salutation}{recipient}，恭喜你成功升级到 v{age}！本版本更新日志：皱纹+1、智慧+10、可爱值 MAX。生日快乐！",
        "今天是你生日，按规矩我必须夸你三句：好看、有钱、还能再吃一碗。{salutation}{recipient}，生日快乐！",
        "{salutation}{recipient}，听说今天有人过生日，我赶紧来蹭蛋糕。生日快乐，记得留一块给我！",
      ],
      signatures: ["—— 你的损友 {sender}", "—— {sender}（来蹭蛋糕的）", "—— {sender} 贺"],
    },
    formal: {
      titles: ["恭贺{recipient}生辰", "生日志喜", "谨祝{recipient}生辰快乐"],
      bodies: [
        "{salutation}{recipient}，值此生辰吉日，谨致以最诚挚的祝福。愿您岁岁平安，事事顺遂，前程似锦，福寿绵长。",
        "欣逢{recipient}华诞，特此致贺。愿您在新的一岁中，事业有成，阖家安康，万事胜意。",
        "{salutation}{recipient}，今日乃您生辰，谨祝身体康健，诸事顺遂，前程光明，岁月无忧。",
      ],
      signatures: ["—— {sender} 敬贺", "—— {sender} 谨上", "—— {sender} 恭祝"],
    },
    poetic: {
      titles: ["岁岁年年，{recipient}", "生辰如诗", "愿你与光阴同醉"],
      bodies: [
        "{salutation}{recipient}，愿你如三月春风，似九月秋月，岁岁年年，皆有诗与远方。生辰快乐。",
        "时光把你的名字酿成酒，今日开坛，敬你一盏。{salutation}{recipient}，愿你此生皆为少年模样。",
        "{salutation}{recipient}，愿你眼里有山河，心中有星辰，行过千山万水，归来仍是少年。生辰吉乐。",
      ],
      signatures: ["—— {sender} 题赠", "—— {sender} 谨书", "—— {sender} 寄"],
    },
    playful: {
      titles: ["嗨！{recipient}生日啦！", "Boom！生日大放送", "{recipient}的专属节日"],
      bodies: [
        "{salutation}{recipient}！今天全世界都为你打 call！蛋糕、礼物、惊喜已就位，请查收你的快乐大礼包！生日快乐鸭！",
        "叮咚！{salutation}{recipient}的生日限定版祝福已送达：好运 ×∞、快乐爆表、可爱无法挡！冲鸭！",
        "{salutation}{recipient}，今天你是主角！吃！玩！闹！把一整年的快乐都透支！生日快乐嘿嘿~",
      ],
      signatures: ["—— 你的 {sender} 鸭", "—— {sender} 比心", "—— {sender} 来啦"],
    },
  },
  invitation: {
    warm: {
      titles: ["诚邀{recipient}相聚", "一份来自{sender}的邀约", "期待与{recipient}重逢"],
      bodies: [
        "{salutation}{recipient}，许久不见，甚是想念。我们准备了一场小小的聚会，诚邀你前来，共度一段温暖的时光。",
        "{salutation}{recipient}，愿与你分享一段值得纪念的时光。届时备有清茶点心，盼你拨冗莅临，共话家常。",
        "时光匆匆，情谊未曾走远。{salutation}{recipient}，我们诚挚邀请你参加本次活动，盼相聚，盼重逢。",
      ],
      signatures: ["—— 期待你的 {sender}", "—— {sender} 敬邀", "—— {sender} 诚邀"],
    },
    humor: {
      titles: ["紧急通知：{recipient}请速到场", "{recipient}，你被邀请了！", "召唤{recipient}令"],
      bodies: [
        "{salutation}{recipient}，本次聚会主角之一（也就是你）已确认在邀请名单。缺席将触发集体失落 buff，请务必到场！",
        "{salutation}{recipient}，没你在场，聚会的笑点会少一半。来吧，拯救我们的无聊！",
        "警告：{salutation}{recipient}若不出现，本次活动将失去灵魂。请速来，否则我们将想念你到天明！",
      ],
      signatures: ["—— 呼唤你的 {sender}", "—— {sender} 求你来", "—— {sender} 邀"],
    },
    formal: {
      titles: ["谨订于{date}敬备薄酌", "诚挚邀请{recipient}莅临", "邀请函"],
      bodies: [
        "{salutation}{recipient}，兹定于{date}举办{event}，恭候{recipient}拨冗莅临，同襄盛举。",
        "敬启者{recipient}：为{event}，谨订于{date}敬备薄酌，恭候光临，共襄盛举。",
        "{salutation}{recipient}，诚挚邀请您出席{event}，时间{date}，地点{venue}。恭候您的到来。",
      ],
      signatures: ["—— {sender} 敬邀", "—— {sender} 谨订", "—— {sender} 诚邀"],
    },
    poetic: {
      titles: ["待君来", "一纸邀约，候{recipient}", "山水有相逢"],
      bodies: [
        "{salutation}{recipient}，清茶已备，只待君来。愿与你在某个午后，共话流年，共看云卷云舒。",
        "{salutation}{recipient}，山水之间，候你一程。花开有期，相聚有时，盼与你不期而遇。",
        "{salutation}{recipient}，把这一程风月留给你。愿与君把酒言欢，共醉一场人间清欢。",
      ],
      signatures: ["—— {sender} 候", "—— {sender} 谨具", "—— {sender} 望君"],
    },
    playful: {
      titles: ["Party Time！{recipient}", "{recipient}，集结令！", "快来快来{recipient}"],
      bodies: [
        "{salutation}{recipient}！超酷的活动已经上线，就差你了！准备好你的好心情，咱们不见不散！",
        "叮咚！{salutation}{recipient}，你的派对邀请函已送达！带好笑容，揣上欢乐，咱们一起嗨翻天！",
        "{salutation}{recipient}！朋友都在，零食管够，快乐加倍！就等你来啦，速速报名！",
      ],
      signatures: ["—— 你的 {sender}", "—— {sender} 呼唤", "—— {sender} 等你"],
    },
  },
  opening: {
    warm: {
      titles: ["贺{recipient}新张之喜", "恭祝开业大吉", "新程启航"],
      bodies: [
        "{salutation}{recipient}，欣闻贵店新张，特致贺意。愿生意如春日之阳，日渐升腾；客源似流水之绵，源源不绝。",
        "{salutation}{recipient}，新店启幕，万象更新。愿您事业蒸蒸日上，财源广进，前程似锦。",
        "贺{salutation}{recipient}开张大吉！愿贵店门庭若市，顾客盈门，日进斗金，宏图大展。",
      ],
      signatures: ["—— {sender} 同贺", "—— {sender} 敬贺", "—— {sender} 贺"],
    },
    humor: {
      titles: ["{recipient}终于开张啦！", "警告：{recipient}即将暴富", "贺开业（顺便蹭饭）"],
      bodies: [
        "{salutation}{recipient}，恭喜从打工人升级为老板！本朋友已备好贺词与胃口，随时来蹭饭。开业大吉！",
        "{salutation}{recipient}，听说你开店了？我第一反应是：以后有地方白吃白喝了！开张大吉，财源滚滚！",
        "{salutation}{recipient}，恭喜贵店开张！愿你数钱数到手抽筋，雇佣员工雇到忙不过来！",
      ],
      signatures: ["—— 你的 {sender}", "—— {sender} 来蹭饭", "—— {sender} 贺"],
    },
    formal: {
      titles: ["谨贺{recipient}开张之喜", "开业志庆", "恭贺新张"],
      bodies: [
        "{salutation}{recipient}，欣逢贵店开张之喜，谨致诚挚祝贺。愿贵店鸿图大展，生意兴隆，财源广进，日进斗金。",
        "敬贺{salutation}{recipient}新张：愿贵店宏图大展，骏业日新，客似云来，财源广进。",
        "{salutation}{recipient}，值此开张吉日，谨祝骏业肇兴，财源滚滚，宏图大展，事业蒸蒸日上。",
      ],
      signatures: ["—— {sender} 敬贺", "—— {sender} 谨祝", "—— {sender} 同庆"],
    },
    poetic: {
      titles: ["骏业肇兴", "新张志喜", "贺{recipient}开市"],
      bodies: [
        "{salutation}{recipient}，新张之喜，如朝阳初升。愿贵店生意如春潮涌动，财源似秋水绵长，骏业日新，宏图大展。",
        "{salutation}{recipient}，开市大吉。愿门庭若市如花似锦，财源滚滚似水东流，事业蒸蒸，岁岁丰盈。",
        "{salutation}{recipient}，新程既启，万象更新。愿贵店鸿图大展，骏业日新，财通四海，利达三江。",
      ],
      signatures: ["—— {sender} 敬贺", "—— {sender} 题贺", "—— {sender} 谨祝"],
    },
    playful: {
      titles: ["开业大吉{recipient}！", "Boom！新店上线", "{recipient}发财啦"],
      bodies: [
        "{salutation}{recipient}！恭喜开店！祝客流爆满、订单排队、数钱到手软！开业大吉，冲冲冲！",
        "叮咚！{salutation}{recipient}的发财之路今日正式启动！祝你天天爆单，月月翻倍，数钱数到笑醒！",
        "{salutation}{recipient}！新店开张，红包已备好！愿你生意红火，客源不断，一路开挂！",
      ],
      signatures: ["—— 你的 {sender}", "—— {sender} 来捧场", "—— {sender} 贺"],
    },
  },
  wedding: {
    warm: {
      titles: ["百年好合", "贺{recipient}新婚之喜", "愿得一心人"],
      bodies: [
        "{salutation}{recipient}，今天是你们大喜的日子。愿你们携手走过春夏秋冬，相看两不厌，白首不相离。新婚快乐。",
        "{salutation}{recipient}，愿你们从此以后，所有的清晨都有人问候，所有的夜晚都有人等候。百年好合，永结同心。",
        "{salutation}{recipient}，恭喜你们走进婚姻的殿堂。愿往后余生，冷暖有相知，喜乐有分享，同量天地宽，共度日月长。",
      ],
      signatures: ["—— {sender} 敬贺", "—— {sender} 诚挚祝福", "—— {sender} 贺"],
    },
    humor: {
      titles: ["终于被收编了{recipient}", "结婚警告{recipient}", "贺{recipient}跳坑"],
      bodies: [
        "{salutation}{recipient}，恭喜你成功从单身狗升级为有主之人！婚后生活请自备求生指南，生日快乐…啊不，新婚快乐！",
        "{salutation}{recipient}，终于有人把你收了？恭喜恭喜！请今后多撒狗粮，少秀恩爱（划掉）。新婚快乐！",
        "{salutation}{recipient}，结婚啦！愿你们吵架时记得是谁先求婚的，冷战时记得是谁做的饭。新婚快乐！",
      ],
      signatures: ["—— 你的 {sender}", "—— {sender} 来吃席", "—— {sender} 贺"],
    },
    formal: {
      titles: ["谨贺新婚之喜", "百年好合志庆", "恭祝{recipient}燕尔新婚"],
      bodies: [
        "{salutation}{recipient}，值此新婚大喜，谨致诚挚祝贺。愿二位百年好合，永结同心，相敬如宾，白头偕老。",
        "敬贺{salutation}{recipient}新婚之喜：愿琴瑟和鸣，枝繁叶茂，福禄双全，白首齐眉。",
        "{salutation}{recipient}，恭祝燕尔新婚。愿二位举案齐眉，相濡以沫，百年偕老，永结同心。",
      ],
      signatures: ["—— {sender} 敬贺", "—— {sender} 谨祝", "—— {sender} 贺"],
    },
    poetic: {
      titles: ["执子之手", "与子偕老", "愿作鸳鸯不羡仙"],
      bodies: [
        "{salutation}{recipient}，愿你们执子之手，与子偕老；愿岁月不负深情，时光不负相守。新婚志喜。",
        "{salutation}{recipient}，愿你们如比翼之鸟，连理之枝，朝朝暮暮，岁岁年年。百年好合。",
        "{salutation}{recipient}，愿你们以深情共白头，以温柔度春秋。山河无恙，岁月静好，新婚快乐。",
      ],
      signatures: ["—— {sender} 敬贺", "—— {sender} 谨祝", "—— {sender} 贺"],
    },
    playful: {
      titles: ["{recipient}结婚啦！", "撒糖警告{recipient}", "新婚快乐鸭"],
      bodies: [
        "{salutation}{recipient}！恭喜解锁人生新副本：婚姻模式！愿你们天天撒糖，月月甜蜜，年年幸福！",
        "叮咚！{salutation}{recipient}的婚礼邀请函已生效！准备好被幸福暴击了吗？新婚快乐，冲鸭！",
        "{salutation}{recipient}！终于等到你结婚啦！红包已就位，狗粮已备好，新婚快乐嘿嘿~",
      ],
      signatures: ["—— 你的 {sender}", "—— {sender} 比心", "—— {sender} 贺"],
    },
  },
  festival: {
    warm: {
      titles: ["节日快乐，{recipient}", "岁岁安康", "致{recipient}的节日祝福"],
      bodies: [
        "{salutation}{recipient}，又是一年佳节至，愿你平安喜乐，万事胜意。所求皆所愿，所行化坦途。",
        "{salutation}{recipient}，愿节日的灯火为你点亮欢喜，愿欢声笑语伴你左右。愿你岁岁安康，年年有余。",
        "{salutation}{recipient}，佳节相逢，万象更新。愿你心中常怀热爱，眼里常有星光，事有所成，常带笑颜。",
      ],
      signatures: ["—— 你的 {sender}", "—— {sender} 敬上", "—— {sender} 贺"],
    },
    humor: {
      titles: ["过节啦{recipient}", "节日警告：即将长胖", "贺节档{recipient}"],
      bodies: [
        "{salutation}{recipient}，节日好！本祝福已自动续费，不退货。愿你新的一年只长钱包不长肉！",
        "{salutation}{recipient}，节日快乐！愿你霉运清零，好运满格，烦恼退货，快乐包邮！",
        "{salutation}{recipient}，又到了立 flag 的日子。愿你立的全倒…啊不，全成真！节日快乐！",
      ],
      signatures: ["—— 你的 {sender}", "—— {sender} 来贺节", "—— {sender} 贺"],
    },
    formal: {
      titles: ["谨贺佳节", "恭贺{recipient}节庆", "节日志庆"],
      bodies: [
        "{salutation}{recipient}，值此佳节，谨致诚挚祝福。愿您事业有成，阖家安康，万事胜意。",
        "敬贺{salutation}{recipient}佳节：愿您福寿绵长，阖家欢乐，事业顺遂，财源广进。",
        "{salutation}{recipient}，恭祝佳节大吉。愿您岁岁平安，事事顺心，阖家幸福，万事如意。",
      ],
      signatures: ["—— {sender} 敬贺", "—— {sender} 谨祝", "—— {sender} 贺"],
    },
    poetic: {
      titles: ["岁岁年年", "佳节志喜", "愿{recipient}岁岁长安"],
      bodies: [
        "{salutation}{recipient}，愿你佳节如初春，温润如玉；似盛夏，热烈如歌；若深秋，丰盈如诗；如隆冬，沉静如雪。",
        "{salutation}{recipient}，佳节逢喜，万象更新。愿你眼里有星辰，心中有山海，岁岁常安康，年年皆胜意。",
        "{salutation}{recipient}，把旧日的风霜留在身后，把佳节的期许揣在心头。愿你岁岁长安，年年欢喜。",
      ],
      signatures: ["—— {sender} 敬贺", "—— {sender} 谨书", "—— {sender} 寄"],
    },
    playful: {
      titles: ["节日快乐{recipient}！", "Boom！佳节到", "{recipient}发财啦"],
      bodies: [
        "{salutation}{recipient}！节日快乐！祝你在这个节日里红包收到手软、好运爆表、快乐无法挡！冲鸭！",
        "叮咚！{salutation}{recipient}的节日祝福大礼包已送达：福气×∞、财运爆满、可爱值 MAX！节日快乐！",
        "{salutation}{recipient}！这个节日，愿你天天有好运、月月有惊喜、年年都发财！节日快乐嘿嘿~",
      ],
      signatures: ["—— 你的 {sender}", "—— {sender} 来贺节", "—— {sender} 比心"],
    },
  },
  thanks: {
    warm: {
      titles: ["谢谢{recipient}", "致{recipient}的感谢", "心怀感激"],
      bodies: [
        "{salutation}{recipient}，谢谢你一直以来的陪伴与帮助。有你在我身边，前行的路格外温暖。",
        "{salutation}{recipient}，千言万语，化作一句感谢。愿你被世界温柔以待，正如你温柔待我。",
        "{salutation}{recipient}，感谢你的善意与付出。这份情谊，我会珍藏在心，历久弥新。",
      ],
      signatures: ["—— 永远感激你的 {sender}", "—— {sender} 敬上", "—— {sender} 谢"],
    },
    humor: {
      titles: ["谢主隆恩{recipient}", "{recipient}你真够意思", "感谢信（别哭）"],
      bodies: [
        "{salutation}{recipient}，谢主隆恩！本小人无以为报，只能以身相许…啊不，以饭相请。改天请你吃饭！",
        "{salutation}{recipient}，感谢你的出手相救/慷慨解囊/雪中送炭（请自选）。本朋友已记下，必有回报（大概）。",
        "{salutation}{recipient}，谢谢啦！你这么够意思，我以后一定…再麻烦你。开个玩笑，真心感谢！",
      ],
      signatures: ["—— 你的 {sender}", "—— {sender} 来还债", "—— {sender} 谢"],
    },
    formal: {
      titles: ["谨致谢忱", "致{recipient}的感谢信", "诚挚致谢"],
      bodies: [
        "{salutation}{recipient}，承蒙惠助，不胜感激。特此致函，以表谢忱。愿您安康顺遂，万事如意。",
        "敬启者{salutation}{recipient}：感谢您一直以来的关照与支持。您的善意与帮助，铭感五内，永志不忘。",
        "{salutation}{recipient}，衷心感谢您的鼎力相助。此情此意，谨记于心，愿您福寿安康，诸事顺遂。",
      ],
      signatures: ["—— {sender} 敬上", "—— {sender} 谨致", "—— {sender} 谢"],
    },
    poetic: {
      titles: ["感恩有你", "致{recipient}", "铭记于心"],
      bodies: [
        "{salutation}{recipient}，山高水长，情深意重。你的善意如春风化雨，润物无声，我铭记于心。",
        "{salutation}{recipient}，感谢你赠我以星光，让我在暗夜中也能看见前路。此情此意，岁岁不忘。",
        "{salutation}{recipient}，滴水之恩，当涌泉相报。你的温柔与善意，我会用心珍藏，用一生回馈。",
      ],
      signatures: ["—— {sender} 敬上", "—— {sender} 谨书", "—— {sender} 寄"],
    },
    playful: {
      titles: ["谢谢你鸭{recipient}", "Thanks {recipient}！", "感恩有你{recipient}"],
      bodies: [
        "{salutation}{recipient}！超级感谢你的帮助！你已经成功解锁我的好人卡收藏册（限量版）！谢谢鸭！",
        "叮咚！{salutation}{recipient}的感谢信已送达：感谢值爆表、好感度满格、友谊小船永远不翻！谢谢你！",
        "{salutation}{recipient}！谢谢你这么够意思！以后有需要尽管说，本朋友随叫随到！感恩嘿~",
      ],
      signatures: ["—— 你的 {sender}", "—— {sender} 比心", "—— {sender} 谢"],
    },
  },
};

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// 洗牌（Fisher-Yates），用于让候选文案互不重复
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function fill(template: string, params: GenerateParams): string {
  return template
    .replace(/\{recipient\}/g, params.recipient || "你")
    .replace(/\{sender\}/g, params.sender || "友人")
    .replace(/\{salutation\}/g, params.salutation ? params.salutation : "")
    .replace(/\{age\}/g, String(Math.floor(Math.random() * 40 + 18)))
    .replace(/\{date\}/g, "本月底")
    .replace(/\{event\}/g, "聚会")
    .replace(/\{venue\}/g, "本处");
}

// 根据字数裁剪或扩展正文
function adjustLength(body: string, wordCount: number): string {
  const chars = body.length;
  if (chars <= wordCount) return body;
  // 裁剪到字数附近，并在完整句子处截断
  const cut = body.slice(0, wordCount);
  const lastPunct = Math.max(cut.lastIndexOf("。"), cut.lastIndexOf("，"), cut.lastIndexOf("！"), cut.lastIndexOf("？"));
  return lastPunct > wordCount * 0.5 ? cut.slice(0, lastPunct + 1) : cut + "…";
}

export function generateContent(params: GenerateParams): GeneratedContent {
  const bundle = TEMPLATES[params.theme]?.[params.tone] ?? TEMPLATES.birthday.warm;
  const title = fill(pick(bundle.titles), params);
  let body = fill(pick(bundle.bodies), params);
  body = adjustLength(body, params.wordCount);
  const signature = fill(pick(bundle.signatures), params);
  return { title, body, signature };
}

// 生成多组互不重复的候选（供用户挑选）
export function generateCandidates(params: GenerateParams, count = 3): GeneratedContent[] {
  const bundle = TEMPLATES[params.theme]?.[params.tone] ?? TEMPLATES.birthday.warm;
  const titles = shuffle(bundle.titles);
  const bodies = shuffle(bundle.bodies);
  const sigs = shuffle(bundle.signatures);
  // 取三者长度的最小值，避免重复
  const n = Math.min(count, titles.length, bodies.length, sigs.length);
  return Array.from({ length: n }, (_, i) => {
    const body = adjustLength(fill(bodies[i], params), params.wordCount);
    return {
      title: fill(titles[i], params),
      body,
      signature: fill(sigs[i], params),
    };
  });
}
