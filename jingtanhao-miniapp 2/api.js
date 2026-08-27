// ============================================================
// 京探号小程序 · API 桩（stub）
// 函数签名 = 未来真实 API 的形状；当前返回 mock，带模拟延迟
// 后续接后端时，仅需替换函数内部实现，保持签名不变
// 普通 script 方案（非 module），全局访问：api 对象
// ============================================================

const delay = ms => new Promise(res => setTimeout(res, ms));

const api = {
  // GET /api/home
  // 返回首页聚合数据：轮播 + 推荐内容 + 快捷入口
  // TODO: replace with fetch('/api/home')
  async fetchHome() {
    await delay(350);
    return {
      code: 0,
      data: {
        banners: [
          { id: 'b1', shopId: 'trt', title: '同仁堂知嘛健康零号店', sub: '350年药铺的新活法' },
          { id: 'b2', shopId: 'nls', title: '内联升×国潮联名', sub: '千层底布鞋成潮鞋' },
          { id: 'b3', shopId: 'wyt', title: '吴裕泰茶味冰淇淋', sub: '128年老茶庄的爆款' },
        ],
        contents: DB.contents,
        hotShops: DB.shops.slice(0, 4),
      },
    };
  },

  // GET /api/contents
  // 返回全部内容列表
  // TODO: replace with fetch('/api/contents')
  async fetchContents() {
    await delay(300);
    return { code: 0, data: DB.contents };
  },

  // GET /api/routes
  // 返回 City Walk 路线列表
  // TODO: replace with fetch('/api/routes')
  async fetchRoutes() {
    await delay(300);
    return { code: 0, data: DB.routes };
  },

  // GET /api/routes/:id
  // 返回路线详情
  // TODO: replace with fetch(`/api/routes/${id}`)
  async fetchRouteDetail(id) {
    await delay(250);
    return { code: 0, data: getRoute(id) };
  },

  // POST /api/ai/ask  { agentId, prompt }
  // 返回 AI 掌柜的回复（当前为关键词匹配的预设回复）
  // TODO: replace with real LLM call: fetch('/api/ai/ask', {method:'POST', body:{agentId, prompt}})
  async askAI(agentId, prompt) {
    await delay(700); // 模拟模型思考延迟，让 loading 可见
    const pool = DB.aiReplies.filter(r => r.agentId === agentId);
    const hit = pool.find(r => r.keywords.some(k => prompt.includes(k)));
    return { code: 0, data: { reply: hit ? hit.reply : DB.aiFallback } };
  },

  // POST /api/routes/:id/join  { seats }
  // 报名 City Walk；返回剩余名额（mock：最多报3人）
  // TODO: replace with fetch(`/api/routes/${id}/join`, {method:'POST'})
  async joinRoute(id, seats = 1) {
    await delay(500);
    const r = getRoute(id);
    if (!r) return { code: 1, msg: '路线不存在' };
    if (r.seats - seats < 0) return { code: 1, msg: '名额不足' };
    r.seats -= seats;
    r.joined += seats;
    return { code: 0, msg: '报名成功', data: { remaining: r.seats } };
  },
};
