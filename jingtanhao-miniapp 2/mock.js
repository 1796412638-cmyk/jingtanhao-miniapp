// ============================================================
// 京探号小程序 · Mock 数据（唯一数据源）
// 所有页面从这里读取数据，禁止散落硬编码
// 普通 script 方案（非 module），全局访问：DB / getShop / getContent / getRoute
// ============================================================

const DB = {
  // ---------- 老字号店铺 ----------
  shops: [
    { id: 'trt', name: '同仁堂知嘛健康', sub: '零号店', tag: '健康生活', rating: 4.9, hot: '网红打卡', img: 'assets/trt-coffee.jpg', desc: '350年药铺的自我革命：咖啡、餐饮、DIY、中医体检一站式健康生活空间。' },
    { id: 'qjd', name: '全聚德', sub: '前门店', tag: '百年烤鸭', rating: 4.8, hot: '非遗烤鸭', img: 'assets/qjd-front.jpg', desc: '150年挂炉烤鸭，从宫廷御膳到年轻人餐桌，正餐外卖小店全场景进化。' },
    { id: 'nls', name: '内联升', sub: '大栅栏店', tag: '非遗布鞋', rating: 4.7, hot: '国潮联名', img: 'assets/nls-gate.jpg', desc: '千层底布鞋变身潮流单品，与设计师、潮牌IP的联名让老手艺重获新生。' },
    { id: 'lbj', name: '六必居', sub: '前门总店', tag: '中华酱园', rating: 4.6, hot: '百年酱香', img: 'assets/lbj-shop.jpg', desc: '始于明代的酱园，黑芝麻酱、甜面酱，一口就是老北京的味道。' },
    { id: 'wyt', name: '吴裕泰', sub: '前门店', tag: '百年茶庄', rating: 4.8, hot: '茶味冰淇淋', img: 'assets/wyt-ice.jpg', desc: '128年老茶庄，茉莉花茶香飘百年，茶味冰淇淋是年轻人的第一口。' },
    { id: 'rfx', name: '瑞蚨祥', sub: '大栅栏店', tag: '丝绸布匹', rating: 4.7, hot: '中式高定', img: 'assets/rfx-gate.jpg', desc: '"瑞蚨祥"三个字就是高端丝绸的代名词，中式礼服定制界的爱马仕。' },
    { id: 'dxc', name: '稻香村', sub: '灯市口店', tag: '京味糕点', rating: 4.8, hot: '点心界顶流', img: 'assets/dxc-cake.jpg', desc: '老北京人过年必排队，枣花酥、牛舌饼，甜咸皆有，京味点心之王。' },
    { id: 'dls', name: '东来顺', sub: '王府井店', tag: '铜锅涮肉', rating: 4.7, hot: '涮肉鼻祖', img: 'assets/dls-hotpot.jpg', desc: '百年铜锅涮肉，手切鲜羊肉配麻酱，北京人冬天的仪式感。' },
  ],

  // ---------- 首页内容流（视频/音频） ----------
  contents: [
    { id: 'c1', shopId: 'trt', type: 'video', title: '同仁堂不卖药了？我在零号店待了一下午', img: 'assets/trt-coffee.jpg', duration: '8:24', plays: '12.6万', desc: '第一视角探店：咖啡、餐饮、DIY手工，彻底颠覆你对同仁堂的想象。' },
    { id: 'c2', shopId: 'qjd', type: 'video', title: '150年烤鸭店开始做外卖，是妥协还是革命？', img: 'assets/qjd-duck.jpg', duration: '9:12', plays: '8.3万', desc: '走进全聚德后厨，看一只烤鸭的仪式感如何应对快节奏时代。' },
    { id: 'c3', shopId: 'nls', type: 'audio', title: '千层底布鞋如何变成年轻人的潮鞋', img: 'assets/nls-gate.jpg', duration: '26:40', plays: '4.1万', desc: '音频深度：非遗手艺×国潮联名，一段布鞋的潮流逆袭史。' },
    { id: 'c4', shopId: 'wyt', type: 'video', title: '128年老茶庄的冰淇淋，凭什么排队两小时', img: 'assets/wyt-ice.jpg', duration: '7:36', plays: '15.2万', desc: '吴裕泰茶味冰淇淋全网爆火，老茶庄的年轻化样本。' },
    { id: 'c5', shopId: 'dxc', type: 'audio', title: '稻香村：一块点心里的老北京年味', img: 'assets/dxc-food.jpg', duration: '31:05', plays: '3.5万', desc: '音频深度：从枣花酥到牛舌饼，味蕾上的北京记忆。' },
    { id: 'c6', shopId: 'lbj', type: 'video', title: '六必居的酱缸里，藏着一部北京史', img: 'assets/lbj-shop.jpg', duration: '8:50', plays: '6.8万', desc: '走进600年酱园，闻一闻时间发酵的味道。' },
    { id: 'c7', shopId: 'dls', type: 'video', title: '铜锅涮肉：北京人冬天的最后倔强', img: 'assets/dls-hotpot.jpg', duration: '7:02', plays: '9.7万', desc: '东来顺后厨探秘，手切羊肉的刀工有多讲究。' },
    { id: 'c8', shopId: 'rfx', type: 'audio', title: '瑞蚨祥：一块丝绸的百年定力', img: 'assets/rfx-gate.jpg', duration: '24:18', plays: '2.9万', desc: '音频深度：为什么高端中式礼服，还得看瑞蚨祥。' },
  ],

  // ---------- City Walk 探店路线 ----------
  routes: [
    { id: 'r1', name: '同仁堂·健康生活探秘线', cover: 'trt', img: 'assets/trt-diy.jpg', duration: '2.5小时', price: 168, rating: 4.9, seats: 20, joined: 156,
      spots: ['知嘛健康零号店 · 咖啡与中医体验', 'DIY手工香囊工坊', '中医体质检测', '健康餐食试吃'],
      desc: '主持人带队，走进同仁堂知嘛健康零号店。品咖啡、做香囊、测体质，用2.5小时重新认识一个你从未见过的同仁堂。' },
    { id: 'r2', name: '前门·百年老字号线', cover: 'qjd', img: 'assets/qjd-front.jpg', duration: '3小时', price: 199, rating: 4.8, seats: 25, joined: 203,
      spots: ['全聚德前门店 · 烤鸭文化讲解', '六必居酱园参观', '吴裕泰茶庄品茗', '内联升布鞋体验'],
      desc: '一条线走完前门大栅栏的百年老字号。烤鸭、酱菜、香茶、布鞋，老北京的商业传奇一次看够。' },
    { id: 'r3', name: '南锣鼓巷·胡同烟火线', cover: 'hutong', img: 'assets/dxc-food.jpg', duration: '2小时', price: 128, rating: 4.7, seats: 18, joined: 98,
      spots: ['南锣鼓巷胡同漫步', '隐藏老铺探店', '京味小吃试吃', '胡同摄影打卡'],
      desc: '钻进南锣鼓巷的支线胡同，找那些藏在深处的老铺。烟火气里，才是真正的老北京。' },
    { id: 'r4', name: '琉璃厂·文房雅趣线', cover: 'liulichang', img: 'assets/rfx-gate.jpg', duration: '2.5小时', price: 148, rating: 4.8, seats: 16, joined: 76,
      spots: ['荣宝斋木版水印体验', '一得阁墨汁探秘', '古籍书店寻宝', '文房四宝DIY'],
      desc: '走进琉璃厂文化街，笔墨纸砚间体验文人的雅趣。亲手做一幅木版水印，把文化带回家。' },
    { id: 'r5', name: '什刹海·夜色美食线', cover: 'shichahai', img: 'assets/dls-hotpot.jpg', duration: '2.5小时', price: 178, rating: 4.8, seats: 20, joined: 87,
      spots: ['什刹海夜景漫步', '东来顺铜锅涮肉', '老字号甜品收官'],
      desc: '夜色下的什刹海，配一锅铜锅涮肉。京城的夜，从一顿热气腾腾的涮肉开始。' },
  ],

  // ---------- AI 掌柜角色 ----------
  aiAgents: [
    { id: 'a1', shopId: 'trt', name: '同仁堂·老掌柜', title: '知嘛健康首席导览', color: '#8B2323', greeting: '这位客官，老朽在同仁堂守了三十余年。如今店里开了咖啡馆，连我自个儿都觉新鲜。您想问点什么？' },
    { id: 'a2', shopId: 'qjd', name: '全聚德·大掌柜', title: '挂炉烤鸭传承人', color: '#B8860B', greeting: '来了您内！咱这儿的烤鸭，从选鸭到出炉，108道工序一道不能少。您想了解点什么？' },
    { id: 'a3', shopId: 'nls', name: '内联升·老师傅', title: '千层底非遗传承人', color: '#4A7C59', greeting: '做鞋四十载，一针一线都是功夫。如今这布鞋成了潮流，老朽也看不懂，但心里高兴。' },
  ],

  // ---------- AI 预设回复（关键词匹配） ----------
  aiReplies: [
    { agentId: 'a1', keywords: ['咖啡', '咖啡厅', '喝什么'], reply: '零号店的"知嘛咖啡"是老朽最得意的创新——把中草药和咖啡融合，比如陈皮拿铁、枸杞美式。年轻人爱喝，老方子也活起来了。' },
    { agentId: 'a1', keywords: ['手工', 'DIY', '香囊'], reply: '一楼的DIY工坊可以亲手做香囊、配草本茶包。很多年轻人做完发朋友圈，说是"很治愈"。老朽看着，也觉得老手艺有了新活法。' },
    { agentId: 'a1', keywords: ['地址', '怎么去', '在哪'], reply: '知嘛健康零号店在大兴区思邈路39号，同仁堂健康药业生产基地里。前店后厂，5000多平，三层楼，够您逛一下午。' },
    { agentId: 'a1', keywords: ['体检', '体质', '健康'], reply: '店里有中医体质检测，扫码就能生成个人健康报告，还能量身推荐食疗方案。老祖宗的"治未病"理念，现在用科技实现了。' },
    { agentId: 'a1', keywords: ['历史', '什么时候', '多少年'], reply: '同仁堂创立于清康熙八年，1669年，距今三百五十余年。"炮制虽繁必不敢省人工，品味虽贵必不敢减物力"——这句祖训，至今刻在店堂里。' },
    { agentId: 'a2', keywords: ['烤鸭', '怎么烤', '做法'], reply: '挂炉烤鸭，果木明火，鸭胚要经过选鸭、打气、烫皮、挂糖、晾坯、烤制等108道工序。出炉时枣红色、皮酥肉嫩，片鸭的师傅刀工讲究着呢。' },
    { agentId: 'a2', keywords: ['外卖', '小店', '创新'], reply: '时代变了，咱也学会了变通。现在全聚德有外卖、有开进商场的小店，年轻人想吃烤鸭不必非上大堂。但挂炉的规矩，一丝没变。' },
    { agentId: 'a2', keywords: ['历史', '多少年', '创立'], reply: '全聚德创立于清同治三年，1864年，杨全仁老先生在前门外肉市街挂起招牌。150多年，这只鸭子见证了北京城的变迁。' },
    { agentId: 'a3', keywords: ['联名', '潮牌', '国潮'], reply: '这几年不少设计师找上门，说要把千层底做成潮鞋。联名款一出，年轻人排队买。老手艺配新设计，这步棋，走对了。' },
    { agentId: 'a3', keywords: ['怎么做', '工序', '千层底'], reply: '千层底布鞋，光纳鞋底就有几十道工序：打袼褙、切底、包边、粘合、圈边、纳底……一针一线，一双鞋得纳两千多针。' },
    { agentId: 'a3', keywords: ['历史', '多少年'], reply: '内联升创立于清咸丰三年，1853年，专为皇亲国戚、朝中百官做朝靴。"内联升"三个字，取意"连升三级"，讨个口彩。' },
  ],
  aiFallback: '这个问题问得好，老朽得去问问当家的。您先扫码关注京探号，我记下这个问题，回头让专家给您细讲。',

  // ---------- 联名文创商品（盈利模式 · 联名分成） ----------
  products: [
    { id: 'p1', shopId: 'trt', name: '京探号×同仁堂·草本香囊DIY套装', price: 68, sales: '2.1k', tag: '爆款', img: 'assets/trt-diy.jpg',
      desc: '含香囊材料包+草本配方卡，在家也能体验同仁堂知嘛健康零号店的DIY乐趣。' },
    { id: 'p2', shopId: 'wyt', name: '京探号×吴裕泰·茶味冰淇淋兑换券', price: 19.9, sales: '5.6k', tag: '热卖', img: 'assets/wyt-ice.jpg',
      desc: '到店兑换抹茶/茉莉花茶冰淇淋一支，前门店、王府井店通用。' },
    { id: 'p3', shopId: 'nls', name: '京探号×内联升·联名千层底帆布鞋', price: 399, sales: '860', tag: '联名', img: 'assets/nls-gate.jpg',
      desc: '非遗千层底工艺×年轻帆布鞋型，国潮联名限定款。' },
    { id: 'p4', shopId: 'qjd', name: '京探号×全聚德·挂炉烤鸭礼盒', price: 288, sales: '1.2k', tag: '送礼', img: 'assets/qjd-duck.jpg',
      desc: '精选北京填鸭，果木挂炉烤制，冷链到家。' },
    { id: 'p5', shopId: 'dxc', name: '京探号×稻香村·京味点心伴手礼', price: 128, sales: '3.3k', tag: '伴手礼', img: 'assets/dxc-cake.jpg',
      desc: '枣花酥、牛舌饼、糖火烧等经典京味点心组合，送礼体面。' },
    { id: 'p6', shopId: 'lbj', name: '京探号×六必居·二八酱奶茶体验装', price: 39.9, sales: '4.8k', tag: '网红', img: 'assets/lbj-shop.jpg',
      desc: '老北京二八酱的现代表达，DIY奶茶材料包，爆款复刻。' },
  ],

  // ---------- 体验官社群 ----------
  community: {
    name: '京探号体验官群',
    members: 1280,
    desc: '一起探北京老字号：选题投票、新品试用、City Walk 优先报名、线下聚会。',
    perks: ['下期选题投票权', '新品体验官优先', 'City Walk 早鸟价', '每月线下聚会'],
  },

  // ---------- 商务合作（盈利模式 · 品牌合作） ----------
  biz: {
    title: '品牌内容合作',
    price: '2-5万/期',
    desc: '新消费品牌 × 北京老字号 联名内容定制。探铺提供策划、拍摄、全平台分发，单期触达百万级年轻用户。',
    flow: ['洽谈需求 → 定制方案', '实景拍摄+内容制作', '六大平台分发', '数据复盘+二次传播'],
    contact: '合作洽谈：business@jingtanhao.cn',
  },

  // ---------- 路线评价 ----------
  routeReviews: {
    r1: [
      { name: 'Momo_吃吃吃', avatar: 'M', rating: 5, text: '完全颠覆对同仁堂的印象！咖啡+中医体检+DIY香囊，一下午根本不够逛，带队老师讲得特别好。' },
      { name: '阿栗在北京', avatar: '栗', rating: 5, text: '第一次知道同仁堂还能这么玩，二八酱奶茶好喝，手工香囊带回家做伴手礼超有面子。' },
      { name: '胡同串子老王', avatar: '王', rating: 4, text: '内容很扎实，边逛边听历史很有意思。建议穿舒服的鞋，店很大走起来挺累的哈哈。' },
    ],
    r2: [
      { name: '烤鸭爱好者', avatar: '烤', rating: 5, text: '前门线太值了！全聚德文化讲解+六必居酱园参观+吴裕泰品茶，一条线全是干货。' },
      { name: '小鹿乱撞', avatar: '鹿', rating: 5, text: '带爸妈来的，他们比我还激动，一路讲他们年轻时的故事。老字号还是有温度。' },
      { name: '北漂第七年', avatar: '漂', rating: 4, text: '第一次认真逛大栅栏，以前都走马观花。有讲解就是不一样，推荐外地朋友来。' },
    ],
    r3: [
      { name: '胶片少女', avatar: '胶', rating: 5, text: '胡同拍照绝了！带队找的几个隐藏老铺连我这个老北京都没去过，氛围感拉满。' },
      { name: '干饭魂', avatar: '饭', rating: 4, text: '京味小吃试吃环节好评，分量足不套路。胡同里走2小时，值回票价。' },
    ],
    r4: [
      { name: '文房小生', avatar: '文', rating: 5, text: '木版水印体验太治愈了，做了一下午。琉璃厂真是文化人的快乐老家。' },
      { name: '茶烟里', avatar: '茶', rating: 5, text: '荣宝斋+一得阁+古籍书店，这条线适合安静的人，节奏舒服，讲解专业。' },
    ],
    r5: [
      { name: '夜景控', avatar: '夜', rating: 5, text: '什刹海夜景+铜锅涮肉，绝配！冬天来应该更有感觉，夏天湖边风也舒服。' },
      { name: '火锅战神', avatar: '火', rating: 5, text: '东来顺手切羊肉yyds，麻酱是灵魂。吃完沿湖散步消食，完美夜晚。' },
    ],
  },

  // ---------- 用户 ----------
  user: {
    name: '体验官·小京',
    avatar: '京',
    level: 'LV3 资深体验官',
    points: 1280,
    progress: 68,
    favorites: ['c1', 'r2'],
    orders: [
      { id: 'o1', routeId: 'r1', date: '08-12', status: '已完成' },
      { id: 'o2', routeId: 'r2', date: '08-02', status: '已完成' },
    ],
    checkins: [
      { id: 'k1', shopId: 'trt', date: '08-12', title: '同仁堂知嘛健康·探店打卡' },
      { id: 'k2', shopId: 'wyt', date: '07-28', title: '吴裕泰·茶味冰淇淋打卡' },
    ],
  },
};

// 根据店铺ID取店铺
function getShop(id) {
  return DB.shops.find(s => s.id === id) || null;
}
// 根据内容ID取内容
function getContent(id) {
  return DB.contents.find(c => c.id === id) || null;
}
// 根据路线ID取路线
function getRoute(id) {
  return DB.routes.find(r => r.id === id) || null;
}
