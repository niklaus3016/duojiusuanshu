// Rich offline database of daily wisdom, emotional quotes, and dynamic comments based on duration.

export interface TimeQuote {
  text: string;
  author: string;
  tag: '治愈' | '文艺' | '沙雕' | '励志' | '时间';
}

export const DAILY_QUOTES: TimeQuote[] = [
  { text: "时间不是按秒流逝的，而是按我们留下的记忆流逝的。", author: "多久算数", tag: "文艺" },
  { text: "不要为过去的岁月叹息，而要为未来的日光而歌。", author: "塞涅卡", tag: "励志" },
  { text: "生活就像爆米花，时间就是那个不断摇着的温度，时机到了，自然就甜美地炸开了。", author: "佚名", tag: "沙雕" },
  { text: "愿你把时间浪费在所有美好的事物上，比如清风，比如落日，比如他/她。", author: "多久算数", tag: "治愈" },
  { text: "人生的终点都是一样的，所以请尽情享受漫长而又精彩的过程吧！", author: "多久算数", tag: "治愈" },
  { text: "你以为你只是在度过今天，实际上你在一步步雕刻着你的余生。", author: "罗曼·罗兰", tag: "励志" },
  { text: "时间过得太快，就像胡同里的猫，一眨眼就不见了。幸好，我们还能记下相遇的日子。", author: "多久算数", tag: "沙雕" },
  { text: "世界上最昂贵的奢侈品，莫过于此刻你所拥有的、不可复制的这一秒钟。", author: "时间旅人", tag: "时间" },
  { text: "在光阴的流逝中，我们慢慢懂得了：最珍贵的东西，永远是当下的温度和身边的陪伴。", author: "多久算数", tag: "治愈" },
  { text: "别回头，身后的风再大也吹不暖你；往前走，未来的日子，每一步都是新算数。", author: "多久算数", tag: "励志" },
  { text: "虚度光阴也是一种修行，前提是：虚度得很开心，且不感到后悔。", author: "生活大师", tag: "治愈" },
  { text: "如果把人生倒过来过，你一定会成为神，因为所有的坑你都了如指掌。所以，慢慢往前摸索吧。", author: "多久算数", tag: "沙雕" },
  { text: "爱情可能不讲道理，但时间会把所有道理，慢慢写进你们的白发里。", author: "多久算数", tag: "文艺" },
  { text: "总有一天，你会站在最亮的地方，活成自己曾经最渴望的模样。", author: "励志君", tag: "励志" },
  { text: "宇宙无垠，而你却在特定的一分一秒来到了这里，这是一场概率极低却无比浪漫的奇迹。", author: "星空史诗", tag: "时间" }
];

export function getRandomQuote(): TimeQuote {
  const index = Math.floor(Math.random() * DAILY_QUOTES.length);
  return DAILY_QUOTES[index];
}

// Generate category-specific, duration-aware comments with various styles
export function generateDurationVibeText(
  type: 'life' | 'love' | 'marriage' | 'countdown' | 'custom',
  days: number,
  style: 'healing' | 'literary' | 'funny' | 'inspiring'
): string {
  if (type === 'life') {
    const years = Math.floor(days / 365);
    if (style === 'healing') {
      if (years < 10) return "童年是梦里的纯真音符，每一秒都在无忧无虑地歌唱，愿你永远保持这颗赤子之心。";
      if (years < 20) return "正青春的你，宛如雨后新笋，朝气蓬勃。来到这个世界的这几千个昼夜，每一天都是你的主场。";
      if (years < 30) return "在这个世界探索了二十多个年头，或许有些迷茫，但请相信，所有的努力与坚持都在悄悄为你铺路。";
      if (years < 50) return "光阴沉淀了智慧，也温柔了岁月。走过了人生的黄金岁月，未来的风景依然值得你满怀期待。";
      return "岁月是首悠长的歌，而你已谱写了半生的精彩乐章。愿未来的光阴，依旧有茶、有酒、有清风。";
    }
    if (style === 'literary') {
      return `在这颗蓝色星球上，你已经留下了 ${days} 组独一无二的足迹。星河运转，而你的生命正在盛开。`;
    }
    if (style === 'funny') {
      return `你已经在地球上白吃白喝了 ${days} 天，地球居然没有收你房租，简直赚翻了！`;
    }
    // inspiring
    return `生命的厚度由你走过的路决定。这 ${days} 天的酸甜苦辣，是你最坚实的行囊，去创造更多精彩吧！`;
  }

  if (type === 'love') {
    if (days < 30) {
      if (style === 'healing') return "刚刚开始的旅程，连心跳的频率都是新鲜而甜蜜的。愿这份悸动在柴米油盐中愈发醇厚。";
      if (style === 'literary') return "两颗行星在浩瀚星海中相撞，擦出了专属于你们的初萌火花。";
      if (style === 'funny') return "恭喜进入‘连对方呼吸都觉得可爱’的体验卡期限，请珍惜这段时光！";
      return "最好的相遇，是在对的时间。从零开始，让我们用脚步量度余生的距离。";
    }
    if (days < 365) {
      if (style === 'healing') return "数百个日夜的相伴，你们见证了彼此最真实的一面，愿理解与包容常驻心间。";
      if (style === 'literary') return "草在结它的种子，风在摇它的叶子，你们站着不说话，就十分美好。";
      if (style === 'funny') return "在一起这么久，竟然还没想掐死对方，绝对是真爱无疑了！";
      return "每一次心手相牵的时刻，都是在岁月的画布上添一笔最绚烂的爱情色彩。";
    }
    // Long term love
    if (style === 'healing') return `相伴 ${days} 天，你们的默契早已超越了言语，成为彼此生命中最温暖的港湾。`;
    if (style === 'literary') return `红尘滚滚，而你们已携手看过了 ${Math.floor(days/365)} 载春秋。在时间的洪流里，有你便是不朽。`;
    if (style === 'funny') return `不知不觉竟然已经‘互相折磨’了这么久，看来这辈子你们是逃不出彼此的五指山了！`;
    return `能够长久相伴的，不是轰轰烈烈的大事，而是这 ${days} 天里重复的温热和无尽的守护。`;
  }

  if (type === 'marriage') {
    if (days < 365) {
      if (style === 'healing') return "新婚的甜蜜铺满了生活的每一个角落，从此一屋、两人、三餐、四季，稳稳的幸福。";
      if (style === 'literary') return "琴瑟和鸣，鸾凤和声。领证只是瞬间，相守却是余生的漫长誓言。";
      if (style === 'funny') return "正式迈入‘合法合规、有证驾驶’的柴米油盐大军，从此财政大权要上交啦！";
      return "结发为夫妻，恩爱两不疑。用生活的画笔，绘出专属于你们小家庭的宏伟蓝图。";
    }
    if (style === 'healing') return `婚姻是两个独立灵魂的相依。在携手度过的 ${days} 天里，你们把誓言兑现成了生活最真实的温度。`;
    if (style === 'literary') return `执子之手，与子偕老。在这 ${Math.floor(days/365)} 年的婚姻旅途中，每一天都是岁月的温情赠礼。`;
    if (style === 'funny') return `风雨同舟了 ${days} 天，经历了多少次‘洗碗大战’，依然稳如泰山，给你们点个赞！`;
    return `不仅是爱人，更是岁月中同甘共苦的战友。致敬携手走过的岁月，期待下一段金秋旅程。`;
  }

  if (type === 'countdown') {
    if (days === 0) return "就是今天！准备好迎接属于你的闪耀时刻了吗？加油！";
    if (days < 7) {
      if (style === 'healing') return "终点就在眼前，最后的冲刺虽然有些辛苦，但成功后的风景绝对值得所有付出。";
      if (style === 'literary') return "破晓将至，黑暗正在退散。静候那一缕曙光照亮你所有的坚持。";
      if (style === 'funny') return "大考/大日子即将来临，深呼吸，千万别在这个时候把准考证或者钥匙锁在家里！";
      return "乾坤未定，你我皆是黑马。在这最后几天，请拼尽全力，不留遗憾。";
    }
    if (style === 'healing') return `距离那个期待已久的日子还有 ${days} 天，保持节奏，每一天的沉淀都在缩短梦想与现实的距离。`;
    if (style === 'literary') return `期盼如同埋藏在雪地下的种子，这 ${days} 天的等待，是为了春天到来时最绚烂的绽放。`;
    if (style === 'funny') return `别数了别数了，还有 ${days} 天呢！赶紧该吃吃该睡睡，时间会自己走完的。`;
    return `坚定的信念是通往目的地的唯一路标。这 ${days} 天的倒数，是见证你自律与成长的倒计时。`;
  }

  // Custom or general
  if (days < 0) {
    return "那是在未来的远方，一个还未抵达的时间地标。带着期盼，我们慢慢走去。";
  }
  if (style === 'healing') return `在时间的坐标轴上，这两个点相隔了 ${days} 天。感谢有这番记录，让漫长光阴有了具象的刻度。`;
  if (style === 'literary') return `一万年太久，只争朝夕。而此刻我们算出了 ${days} 天的距离，这是时间最精确的呢喃。`;
  if (style === 'funny') return `时间差竟然是 ${days} 天！这能买多少杯奶茶，能刷多少个短视频啊，真是一笔巨款。`;
  return `所有的数字，都在诠释着生命流逝的节奏。记录下这 ${days} 天，让我们更清醒、更有底气地生活。`;
}
