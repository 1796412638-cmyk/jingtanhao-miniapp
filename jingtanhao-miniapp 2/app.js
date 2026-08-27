// ============================================================
// 京探号小程序 · 应用逻辑（状态管理 + 视图渲染 + 交互）
// 状态/数据/视图分离：数据来自全局 DB（mock.js），
// 异步调用走全局 api 桩（api.js）
// ============================================================

/* ---------------- 全局状态 ---------------- */
const state = {
  tab: 'home',
  aiAgentId: 'a1',
  messages: [],            // {role:'user'|'agent', text}
  favorites: [],           // ['c1','r2'] 持久化 localStorage
  routeDetail: null,       // 当前详情路线 id
  bannerIndex: 0,
};

/* ---------------- DOM 引用 ---------------- */
const $ = s => document.querySelector(s);
const mainEl = $('#appMain');
const tabBar = $('#tabBar');
const overlay = $('#detailOverlay');
const toastEl = $('#toast');

/* ---------------- 工具 ---------------- */
function esc(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
function showToast(msg) {
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toastEl.classList.remove('show'), 1800);
}
function loadFavorites() {
  try { state.favorites = JSON.parse(localStorage.getItem('jth_fav')) || []; } catch { state.favorites = []; }
}
function saveFavorites() {
  localStorage.setItem('jth_fav', JSON.stringify(state.favorites));
}
function toggleFav(key) {
  const i = state.favorites.indexOf(key);
  if (i >= 0) { state.favorites.splice(i, 1); showToast('已取消收藏'); }
  else { state.favorites.push(key); showToast('已收藏，去"我的"查看'); }
  saveFavorites();
}

// 店铺封面视觉：按店铺取渐变类 + 首字
function coverClass(shopId) {
  const map = { trt: '', qjd: 'gold', nls: 'green', wyt: '', lbj: 'gold', rfx: '', dxc: '', dls: 'gold' };
  return map[shopId] || '';
}
function coverChar(shopId) {
  const shop = getShop(shopId);
  return shop ? shop.name.charAt(0) : '铺';
}

/* ---------------- 视图渲染 ---------------- */
function renderHome(data) {
  const { banners, contents, hotShops } = data;
  const fav = state.favorites;

  const bannerHtml = banners.map((b, i) => {
    const shop = getShop(b.shopId);
    return `<div class="banner ${shop && shop.img ? 'photo' : ''}" data-banner="${i}" style="${shop && shop.img ? `background-image:url('${shop.img}')` : ''}">
      <div class="banner-deco">${esc(shop ? shop.name.charAt(0) : '')}</div>
      <div class="banner-text">
        <h3>${esc(b.title)}</h3>
        <p>${esc(b.sub)}</p>
      </div>
    </div>`;
  }).join('');

  const contentCards = contents.slice(0, 6).map((c, i) => {
    const shop = getShop(c.shopId);
    const isFav = fav.includes(c.id);
    return `<div class="content-card" data-content="${c.id}" style="animation-delay:${i * 60}ms">
      <div class="cc-cover ${coverClass(c.shopId)} ${c.img ? 'photo' : ''}" style="${c.img ? `background-image:url('${c.img}')` : ''}">
        <span class="cc-char">${esc(shop ? shop.name.charAt(0) : '')}</span>
        <span class="cc-type">
          ${c.type === 'video'
            ? '<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="6 3 20 12 6 21 6 3"/></svg>'
            : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/></svg>'}
        </span>
        <span class="cc-dur">${esc(c.duration)}</span>
      </div>
      <div class="cc-body">
        <h4>${esc(c.title)}</h4>
        <div class="cc-meta">
          <span class="plays">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
            ${esc(c.plays)}
          </span>
          <span>${esc(shop ? shop.name : '')}</span>
          <span style="margin-left:auto;cursor:pointer" class="fav-btn" data-fav="${c.id}">
            ${isFav
              ? '<svg viewBox="0 0 24 24" fill="#B3261E" stroke="#B3261E" stroke-width="2" width="14" height="14"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>'
              : '<svg viewBox="0 0 24 24" fill="none" stroke="#b9b2a6" stroke-width="2" width="14" height="14"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>'}
          </span>
        </div>
      </div>
    </div>`;
  }).join('');

  const quickEntries = [
    { key: 'ai', label: 'AI掌柜', color: '#8B2323,#c0392b', icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3z"/></svg>' },
    { key: 'routes', label: 'City Walk', color: '#4A7C59,#5da371', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>' },
    { key: 'mall', label: '联名文创', color: '#B8860B,#d4a017', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/></svg>' },
    { key: 'community', label: '体验官', color: '#2B5C8A,#3a78b0', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>' },
  ];
  const quickRow = quickEntries.map(q => `
    <div class="quick-item" data-goto="${q.key}">
      <div class="qi-icon" style="background:linear-gradient(135deg,${q.color})">${q.icon}</div>
      <p>${q.label}</p>
    </div>`).join('');

  const view = $('#view-home');
  view.innerHTML = `
    <div class="home-head">
      <div class="logo"><span class="excl">!</span>京探号</div>
      <div class="search-bar">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        搜索老字号、路线、内容…
      </div>
    </div>

    <div class="banner-wrap">
      <div class="banner-track">${bannerHtml}</div>
      <div class="banner-dots">${banners.map((_, i) => `<i class="${i === 0 ? 'on' : ''}" data-dot="${i}"></i>`).join('')}</div>
    </div>

    <div class="section-title">探索京探号 <span class="more" data-goto-routes>看路线 ›</span></div>
    <div class="quick-row">${quickRow}</div>

    <div class="section-title">今日推荐 <span class="more" data-goto-routes>全部 ›</span></div>
    <div class="content-list">${contentCards}</div>
  `;

  // 绑定首页事件（见事件委托区，统一在 appBind 处理）
}

function renderAI() {
  const agents = DB.aiAgents;
  const cur = agents.find(a => a.id === state.aiAgentId);
  const shop = getShop(cur.shopId);

  const agentChips = agents.map(a => {
    const s = getShop(a.shopId);
    return `<div class="agent-chip ${a.id === state.aiAgentId ? 'active' : ''}" data-agent="${a.id}">
      <span class="avatar photo" style="background-image:url('${s.img}')"></span>
      <span>${esc(a.name)}</span>
    </div>`;
  }).join('');

  // 首次进入且无消息时，插入掌柜问候语
  if (state.messages.length === 0) {
    state.messages.push({ role: 'agent', text: cur.greeting });
  }

  const messagesHtml = state.messages.map((m, i) => {
    if (m.role === 'agent') {
      const a = DB.aiAgents.find(x => x.id === state.aiAgentId);
      const s = getShop(a.shopId);
      return `<div class="msg agent" data-idx="${i}">
        <span class="avatar photo" style="background-image:url('${s.img}')"></span>
        <div class="bubble">${esc(m.text)}</div>
      </div>`;
    }
    return `<div class="msg user" data-idx="${i}">
      <span class="avatar" style="background:#8a8378">京</span>
      <div class="bubble">${esc(m.text)}</div>
    </div>`;
  }).join('');

  const prompts = ['你们店有什么新玩法？', '怎么去？在哪儿？', '有什么历史故事？', '有什么值得买的？'];

  const abilities = [
    { label: 'AI问答', icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3z"/></svg>' },
    { label: '个性推荐', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>' },
    { label: '新品共创', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>' },
    { label: '探店向导', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>' },
  ];

  const view = $('#view-ai');
  view.innerHTML = `
    <div class="ai-head">
      <div class="ai-title"><span class="spark"><svg viewBox="0 0 24 24" fill="currentColor"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3z"/></svg></span>
        京探号 · AI老掌柜
      </div>
      <div class="ai-abilities">
        ${abilities.map(a => `<span class="ai-ability" data-ability="${a.label}">${a.icon}${a.label}</span>`).join('')}
      </div>
      <div class="agent-scroll">${agentChips}</div>
    </div>

    <div class="chat-wrap" id="chatWrap">${messagesHtml}</div>

    <div class="quick-prompts">
      ${prompts.map(p => `<span class="prompt" data-prompt="${esc(p)}">${esc(p)}</span>`).join('')}
    </div>

    <div class="chat-input-row">
      <button class="chat-voice" id="chatVoice">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
      </button>
      <input type="text" id="chatInput" placeholder="问问${esc(cur.name.replace('·', ''))}…" maxlength="60">
      <button class="chat-send" id="chatSend">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
      </button>
    </div>
  `;

  // 滚动到底部
  requestAnimationFrame(() => {
    mainEl.scrollTop = mainEl.scrollHeight;
    const wrap = $('#chatWrap');
    if (wrap) wrap.scrollIntoView({ block: 'end' });
  });
}

function renderRoutes() {
  const fav = state.favorites;
  const cards = DB.routes.map((r, i) => {
    const isFav = fav.includes(r.id);
    return `<div class="route-card" data-route="${r.id}" style="animation-delay:${i * 60}ms">
      <div class="route-cover ${coverClass(r.cover)} ${r.img ? 'photo' : ''}" style="${r.img ? `background-image:url('${r.img}')` : ''}">
        <span class="rc-char">${esc(r.name.charAt(0))}</span>
        <span class="rc-tag">${esc(r.spots.length)}个打卡点</span>
        <span class="rc-dur"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>${esc(r.duration)}</span>
      </div>
      <div class="route-body">
        <h4>${esc(r.name)}</h4>
        <div class="route-stats">
          <span class="rating"><svg viewBox="0 0 24 24" fill="currentColor" width="13" height="13"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>${r.rating}</span>
          <span>已出发 ${r.joined} 人</span>
          <span>余 ${r.seats} 席</span>
          <span style="margin-left:auto;cursor:pointer;display:flex" class="fav-btn" data-fav="${r.id}">
            ${isFav
              ? '<svg viewBox="0 0 24 24" fill="#B3261E" stroke="#B3261E" stroke-width="2" width="15" height="15"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>'
              : '<svg viewBox="0 0 24 24" fill="none" stroke="#b9b2a6" stroke-width="2" width="15" height="15"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>'}
          </span>
        </div>
        <div class="route-price-row">
          <span class="route-price">¥${r.price}<small> /人</small></span>
          <button class="route-join" data-join="${r.id}">立即报名</button>
        </div>
      </div>
    </div>`;
  }).join('');

  const view = $('#view-routes');
  view.innerHTML = `
    <div class="ai-head">
      <div class="ai-title">探铺 City Walk 路线</div>
      <div class="search-bar" style="margin-bottom:6px">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        搜索路线、目的地…
      </div>
    </div>
    <div class="route-list">${cards}</div>
  `;
}

function renderMine() {
  const u = DB.user;
  const favContents = state.favorites
    .map(id => getContent(id) || getRoute(id))
    .filter(Boolean);

  const checkinHtml = u.checkins.map(k => {
    const shop = getShop(k.shopId);
    return `<div class="ml-item">
      <div class="ml-cover" style="background-image:url('${shop.img}')"></div>
      <span class="ml-label">${esc(k.title)}</span>
      <span class="ml-sub">${esc(k.date)}</span>
      <span class="chev"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg></span>
    </div>`;
  }).join('');

  const favHtml = favContents.length === 0
    ? `<div class="empty"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg><br>还没有收藏，去首页逛逛吧</div>`
    : favContents.map(f => {
        const name = f.title || f.name;
        const img = f.img;
        return `<div class="ml-item" ${f.title ? `data-content="${f.id}"` : `data-route="${f.id}"`}>
          <div class="ml-cover" style="background-image:url('${img}')"></div>
          <span class="ml-label">${esc(name)}</span>
          <span class="chev"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg></span>
        </div>`;
      }).join('');

  const view = $('#view-mine');
  view.innerHTML = `
    <div class="mine-head">
      <div class="mine-avatar">${esc(u.avatar)}</div>
      <div class="mine-info">
        <h3>${esc(u.name)}</h3>
        <div class="level">${esc(u.level)} · 距升级还差 ${100 - u.progress} 分</div>
        <div class="level-bar"><i style="width:${u.progress}%"></i></div>
      </div>
      <div class="mine-points">
        <div class="num">${u.points}</div>
        <div class="lbl">积分</div>
      </div>
    </div>

    <div class="mine-grid">
      <div class="mg-item" data-goto="orders"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M13 5v2"/><path d="M13 17v2"/><path d="M13 11v2"/></svg><p>我的订单</p></div>
      <div class="mg-item" data-goto="fav"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg><p>我的收藏</p></div>
      <div class="mg-item" data-goto="checkin"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg><p>打卡足迹</p></div>
      <div class="mg-item" data-goto="mall"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/></svg><p>联名文创</p></div>
    </div>

    <div class="section-title" id="favSection">我的收藏</div>
    <div class="mine-list">${favHtml}</div>

    <div class="section-title" id="checkinSection">打卡足迹</div>
    <div class="mine-list">${checkinHtml || '<div class="empty">还没有打卡记录</div>'}</div>

    <div class="section-title">更多服务</div>
    <div class="mine-list">
      <div class="ml-item" data-goto="video"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg><span class="ml-label">京探号视频号</span><span class="chev"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg></span></div>
      <div class="ml-item" data-goto="audio"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/></svg><span class="ml-label">京探号音频播客</span><span class="chev"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg></span></div>
      <div class="ml-item" data-goto="biz"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 21h18"/><path d="M5 21V7l7-4 7 4v14"/><path d="M9 9h1"/><path d="M9 12h1"/><path d="M9 15h1"/><path d="M14 9h1"/><path d="M14 12h1"/><path d="M14 15h1"/></svg><span class="ml-label">品牌内容合作</span><span class="ml-sub">TO B 招商</span><span class="chev"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg></span></div>
      <div class="ml-item" data-goto="level"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/><path d="m9 12 2 2 4-4"/></svg><span class="ml-label">体验官等级说明</span><span class="chev"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg></span></div>
      <div class="ml-item" data-goto="setting"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg><span class="ml-label">账号与设置</span><span class="chev"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg></span></div>
    </div>
  `;
}

// 滚动到收藏区 / 打卡区
function scrollToFav() {
  const el = $('#favSection');
  if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
}
function scrollToCheckin() {
  const el = $('#checkinSection');
  if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
}

/* ---------------- 详情覆盖层 ---------------- */
async function openRouteDetail(id) {
  const r = getRoute(id);
  if (!r) return;
  const shop = getShop(r.cover) || { name: r.name };

  // 体验官评价
  const reviews = (DB.routeReviews && DB.routeReviews[id]) || [];
  const reviewsHtml = reviews.length
    ? `<div class="section-title" style="margin-left:0">体验官评价</div>` + reviews.map(rev => `
        <div class="review-card">
          <div class="review-head">
            <span class="review-avatar">${esc(rev.avatar)}</span>
            <span class="rn">${esc(rev.name)}</span>
            <span class="review-stars">${[1,2,3,4,5].map(n => `<svg viewBox="0 0 24 24" fill="${n <= rev.rating ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.5" class="${n <= rev.rating ? '' : 'off'}"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`).join('')}</span>
          </div>
          <p class="review-text">${esc(rev.text)}</p>
        </div>`).join('')
    : '';

  // 相关路线（排除当前）
  const recRoutes = DB.routes.filter(x => x.id !== id).slice(0, 3);
  const recRoutesHtml = recRoutes.map(rec => `
    <div class="rec-route" data-route="${rec.id}">
      <div class="rr-cover" style="background-image:url('${rec.img}')"></div>
      <div class="rr-body">
        <h6>${esc(rec.name)}</h6>
        <span>¥${rec.price}/人</span>
      </div>
    </div>`).join('');

  overlay.innerHTML = `
    <div class="detail-hero ${coverClass(r.cover)} ${r.img ? 'photo' : ''}" style="${r.img ? `background-image:url('${r.img}')` : ''}">
      <span class="dh-char">${esc(r.name.charAt(0))}</span>
      <button class="detail-back" id="detailBack">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
      </button>
    </div>
    <div class="detail-body">
      <h2>${esc(r.name)}</h2>
      <div class="route-stats">
        <span class="rating"><svg viewBox="0 0 24 24" fill="currentColor" width="13" height="13"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>${r.rating}</span>
        <span>${esc(r.duration)}</span>
        <span>已出发 ${r.joined} 人 · 余 ${r.seats} 席</span>
      </div>
      <p class="detail-desc">${esc(r.desc)}</p>
      <div class="section-title" style="margin-left:0">路线亮点</div>
      <div class="detail-spots">
        ${r.spots.map((s, i) => `<div class="detail-spot"><span class="ds-num">${i + 1}</span>${esc(s)}</div>`).join('')}
      </div>

      ${reviewsHtml}

      <div class="section-title" style="margin-left:0">相关路线</div>
      <div class="rec-route-row">${recRoutesHtml}</div>
    </div>
    <div class="detail-cta">
      <div class="dc-info">
        <div class="price">¥${r.price}<small style="font-size:12px;color:var(--text-sub)"> /人</small></div>
        <div class="sub">含讲解导览 · 体验物料 · 伴手礼</div>
      </div>
      <button class="btn-primary" id="detailJoin">立即报名</button>
    </div>
  `;
  overlay.classList.add('open');

  $('#detailBack').addEventListener('click', closeDetail);
  $('#detailJoin').addEventListener('click', async e => {
    e.stopPropagation();
    const btn = e.currentTarget;
    btn.disabled = true; btn.textContent = '报名中…';
    const res = await api.joinRoute(id);
    btn.disabled = false;
    if (res.code === 0) {
      showToast('报名成功！已为你保留席位');
      btn.textContent = '✓ 已报名';
      const r2 = getRoute(id);
      if (r2) { renderRoutes(); }
    } else {
      btn.textContent = '立即报名';
      showToast(res.msg);
    }
  });
}
function closeDetail() {
  overlay.classList.remove('open');
  overlay.innerHTML = '';
}

/* ---------------- 内容详情覆盖层 ---------------- */
function openContentDetail(id) {
  const c = getContent(id);
  if (!c) return;
  const shop = getShop(c.shopId) || { name: '老字号' };
  const isFav = state.favorites.includes(c.id);

  // 相关推荐：同店铺优先，其次其他内容
  const recs = DB.contents.filter(x => x.id !== c.id)
    .sort((a, b) => (b.shopId === c.shopId) - (a.shopId === c.shopId))
    .slice(0, 3);

  const recHtml = recs.map(rec => {
    const rs = getShop(rec.shopId);
    return `<div class="cd-rec-item" data-content="${rec.id}">
      <div class="cd-rec-cover" style="background-image:url('${rec.img}')"></div>
      <div class="cd-rec-body">
        <h5>${esc(rec.title)}</h5>
        <span>${esc(rs ? rs.name : '')} · ${esc(rec.duration)}</span>
      </div>
    </div>`;
  }).join('');

  const playIcon = c.type === 'video'
    ? '<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="6 3 20 12 6 21 6 3"/></svg>'
    : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/></svg>';

  overlay.innerHTML = `
    <div class="content-detail">
      <div class="cd-player" style="background-image:url('${c.img}')">
        <button class="cd-back" id="cdBack">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
        </button>
        <div class="cd-play" id="cdPlay">${playIcon}</div>
        <div class="cd-progress"><i></i></div>
      </div>
      <div class="cd-body">
        <h2 class="cd-title">${esc(c.title)}</h2>
        <div class="cd-meta">
          <span class="tag ${c.type === 'audio' ? 'gold' : ''}">${c.type === 'video' ? '视频' : '音频'}</span>
          <span>${esc(shop.name)}</span>
          <span>${esc(c.plays)} 播放</span>
          <span>${esc(c.duration)}</span>
        </div>
        <p class="cd-desc">${esc(c.desc)}</p>
        <div class="section-title" style="margin-left:0">相关推荐</div>
        ${recHtml}
      </div>
      <div class="cd-cta">
        <button class="btn-ghost" id="cdFav" style="${isFav ? 'background:var(--primary-light)' : ''}">
          <svg viewBox="0 0 24 24" fill="${isFav ? '#B3261E' : 'none'}" stroke="${isFav ? '#B3261E' : 'currentColor'}" stroke-width="2" width="15" height="15"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
          ${isFav ? '已收藏' : '收藏'}
        </button>
        <button class="btn-primary" id="cdCheckin">去打卡</button>
      </div>
    </div>
  `;
  overlay.classList.add('open');

  $('#cdBack').addEventListener('click', closeDetail);
  $('#cdPlay').addEventListener('click', e => {
    e.stopPropagation();
    showToast(c.type === 'video' ? '视频播放：Demo 演示片段（占位）' : '音频播放：节目完整版（占位）');
  });
  $('#cdFav').addEventListener('click', () => {
    toggleFav(c.id);
    openContentDetail(c.id); // 重渲染收藏状态
  });
  $('#cdCheckin').addEventListener('click', () => {
    closeDetail();
    switchTab('routes');
    showToast('去「路线」报名，实地打卡吧！');
  });
}

/* ---------------- 通用子页面（商城/订单/社群/商务） ---------------- */
function pageShell(title, sub, bodyHtml, backAction) {
  overlay.innerHTML = `
    <div class="simple-page">
      <div class="page-head">
        <button class="ph-back" id="pageBack">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
        </button>
        <h3>${esc(title)}</h3>
        ${sub ? `<span class="ph-sub">${esc(sub)}</span>` : ''}
      </div>
      <div class="page-body">${bodyHtml}</div>
    </div>
  `;
  overlay.classList.add('open');
  $('#pageBack').addEventListener('click', backAction || closeDetail);
  return overlay;
}

/* 文创商城 */
function openMall() {
  const cards = DB.products.map((p, i) => `
    <div class="mall-item" data-product="${p.id}" style="animation-delay:${i * 50}ms">
      <div class="mall-cover" style="background-image:url('${p.img}')">
        <span class="m-tag ${p.tag === '热卖' || p.tag === '网红' ? 'gold' : ''}">${esc(p.tag)}</span>
      </div>
      <div class="mall-body">
        <h5>${esc(p.name)}</h5>
        <span class="m-price">¥${p.price}<small> 起</small></span>
        <span class="m-sales">已售${esc(p.sales)}</span>
      </div>
    </div>`).join('');
  pageShell('京探号·联名文创', '老字号联名 · 买得到的好物', `<div class="mall-grid">${cards}</div>`);
}

/* 产品详情 */
function openProductDetail(id) {
  const p = DB.products.find(x => x.id === id);
  if (!p) return;
  const shop = getShop(p.shopId) || { name: '老字号' };
  pageShell('商品详情', '', `
    <div class="pd-hero" style="background-image:url('${p.img}')"></div>
    <div class="pd-body">
      <h2>${esc(p.name)}</h2>
      <div class="pd-price">¥${p.price}<small> 已售${esc(p.sales)}</small></div>
      <p class="pd-desc">${esc(p.desc)}</p>
      <div class="section-title" style="margin-left:0">联名店铺</div>
      <div class="search-item" data-goto-ai>
        <div class="si-cover" style="background-image:url('${shop.img}')"></div>
        <div class="si-info"><h5>${esc(shop.name)}</h5><p>${esc(shop.tag)} · ${esc(shop.sub)}</p></div>
        <span class="si-tag">去问问AI掌柜</span>
      </div>
    </div>
    <div class="pd-cta">
      <button class="btn-primary" id="pdBuy">立即购买</button>
    </div>`);
  $('#pdBuy').addEventListener('click', () => showToast('购买流程开发中（演示）'));
}

/* 我的订单 */
function openOrders() {
  const u = DB.user;
  const list = u.orders.map(o => {
    const r = getRoute(o.routeId);
    if (!r) return '';
    return `<div class="order-card">
      <div class="order-cover" style="background-image:url('${r.img}')"></div>
      <div class="order-info">
        <h5>${esc(r.name)}</h5>
        <p>${esc(o.date)} 出发 · ¥${r.price}/人 · 1人</p>
      </div>
      <span class="order-status">${esc(o.status)}</span>
    </div>`;
  }).join('');
  pageShell('我的订单', `${u.orders.length} 笔`, list || '<div class="empty">还没有订单，去路线页看看吧</div>');
}

/* 体验官社群 */
function openCommunity() {
  const cm = DB.community;
  pageShell('京探号体验官', `${cm.members} 位体验官`, `
    <div class="community-card">
      <h3>${esc(cm.name)}</h3>
      <div class="cm-members">${cm.members} 位体验官已加入</div>
      <p class="cm-desc">${esc(cm.desc)}</p>
    </div>
    <div class="section-title" style="margin-left:0">体验官权益</div>
    <div class="perk-grid">
      ${cm.perks.map((p, i) => `<div class="perk-item">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/><path d="m9 12 2 2 4-4"/></svg>
        ${esc(p)}</div>`).join('')}
    </div>
    <img src="assets/qr-community.png" alt="体验官群二维码" style="width:150px;height:150px;border-radius:12px;display:block;margin:0 auto 12px;border:1px solid var(--border)">
    <p class="qr-note">扫码加入体验官群，解锁全部权益（二维码可替换为真实群码）</p>
    <button class="btn-primary" style="width:100%" id="cmJoin">加入体验官</button>`);
  $('#cmJoin').addEventListener('click', () => {
    showToast('已提交申请，等待审核');
    setTimeout(() => {
      const u = DB.user;
      if (!u.joined) { u.joined = true; u.points += 100; }
    }, 300);
  });
}

/* 视频号 / 音频播客 内容列表 */
function openMedia(type) {
  const isVideo = type === 'video';
  const list = DB.contents.filter(c => c.type === type);
  const rows = list.map((c, i) => {
    const shop = getShop(c.shopId);
    return `<div class="cd-rec-item" data-content="${c.id}" style="animation-delay:${i * 50}ms">
      <div class="cd-rec-cover" style="background-image:url('${c.img}')"></div>
      <div class="cd-rec-body">
        <h5>${esc(c.title)}</h5>
        <span>${esc(shop ? shop.name : '')} · ${esc(c.duration)} · ${esc(c.plays)}播放</span>
      </div>
    </div>`;
  }).join('');
  pageShell(isVideo ? '京探号·视频号' : '京探号·音频播客', isVideo ? `${list.length} 期视频` : `${list.length} 期音频`, `
    <p style="font-size:13px;color:var(--text-sub);line-height:1.8;margin-bottom:12px">
      ${isVideo
        ? '每期一家老字号，第一视角探店体验，大屏+网端同步播出。'
        : '每期20-30分钟深度对谈，讲透品牌故事与商业洞察，音频端同步上线。'}
    </p>
    ${rows}`);
}

/* 商务合作 */
function openBiz() {
  const b = DB.biz;
  pageShell('品牌内容合作', 'TO B', `
    <div class="biz-hero">
      <h3>${esc(b.title)}</h3>
      <div class="biz-price">${esc(b.price)} / 期</div>
      <p>${esc(b.desc)}</p>
    </div>
    <div class="section-title" style="margin-left:0">合作流程</div>
    <div class="biz-flow">
      ${b.flow.map((f, i) => `<div class="biz-step"><span class="bs-num">${i + 1}</span>${esc(f)}</div>`).join('')}
    </div>
    <div class="section-title" style="margin-left:0">联系我们</div>
    <div class="biz-contact">${esc(b.contact)}</div>`);
}

/* ---------------- 搜索覆盖层 ---------------- */
function openSearch() {
  $('#searchOverlay').classList.add('open');
  const input = $('#searchInput');
  input.value = '';
  input.focus();
  renderSearch('');
}
function closeSearch() {
  $('#searchOverlay').classList.remove('open');
}
function renderSearch(kw) {
  const body = $('#searchBody');
  const q = kw.trim().toLowerCase();
  if (!q) {
    body.innerHTML = `
      <div class="section-title" style="margin-left:0">热门搜索</div>
      <div class="search-hot">
        ${['同仁堂', '全聚德', '内联升', '吴裕泰', 'City Walk', '冰淇淋', '烤鸭', '布鞋'].map(h => `<span class="hot" data-hot="${esc(h)}">${esc(h)}</span>`).join('')}
      </div>
      <div class="section-title" style="margin-left:0">大家都在找</div>
      <div class="search-item" data-goto-ai>
        <div class="si-cover" style="background:linear-gradient(135deg,#8B2323,#c0392b)"><svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3z"/></svg></div>
        <div class="si-info"><h5>问问 AI 老掌柜</h5><p>同仁堂、全聚德、内联升三位掌柜在线答疑</p></div>
        <span class="si-tag">AI</span>
      </div>`;
    return;
  }

  // 内容匹配
  const cMatch = DB.contents.filter(c =>
    c.title.toLowerCase().includes(q) ||
    (getShop(c.shopId) && getShop(c.shopId).name.toLowerCase().includes(q)));
  // 路线匹配
  const rMatch = DB.routes.filter(r => r.name.toLowerCase().includes(q));
  // 店铺匹配
  const sMatch = DB.shops.filter(s => s.name.toLowerCase().includes(q) || s.tag.includes(kw));

  const item = (img, title, sub, tag, click) => `
    <div class="search-item" ${click}>
      <div class="si-cover" style="background-image:url('${img}')"></div>
      <div class="si-info"><h5>${esc(title)}</h5><p>${esc(sub)}</p></div>
      ${tag ? `<span class="si-tag">${tag}</span>` : ''}
    </div>`;

  let html = '';
  if (sMatch.length) {
    html += `<div class="search-group-title">老字号（${sMatch.length}）</div>` +
      sMatch.map(s => item(s.img, s.name, s.tag + ' · ' + s.sub, '店铺', `data-goto-ai`)).join('');
  }
  if (cMatch.length) {
    html += `<div class="search-group-title">内容（${cMatch.length}）</div>` +
      cMatch.map(c => item(c.img, c.title, (getShop(c.shopId) || {}).name + ' · ' + c.duration, c.type === 'video' ? '视频' : '音频', `data-content="${c.id}"`)).join('');
  }
  if (rMatch.length) {
    html += `<div class="search-group-title">路线（${rMatch.length}）</div>` +
      rMatch.map(r => item(r.img, r.name, '¥' + r.price + ' · ' + r.duration + ' · 已出发' + r.joined + '人', 'City Walk', `data-route="${r.id}"`)).join('');
  }
  if (!html) {
    html = `<div class="empty"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg><br>没有找到「${esc(kw)}」相关的内容<br>换个关键词试试，或去问问 AI 掌柜</div>`;
  }
  body.innerHTML = html;
}

/* ---------------- Tab 切换 ---------------- */
function switchTab(tab) {
  state.tab = tab;
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  const el = $('#view-' + tab);
  if (el) el.classList.add('active');
  document.querySelectorAll('.tab-item').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
  mainEl.scrollTop = 0;
  if (tab === 'ai') renderAI();
}

/* ---------------- 数据加载 + 首次渲染 ---------------- */
async function init() {
  loadFavorites();
  const { data } = await api.fetchHome();
  renderHome(data);
  renderRoutes();
  renderMine();
  renderAI();
  switchTab('home');
  bindGlobal();
  startBanner(data.banners.length);
  // 强制滚动到顶部（多重保险，防止浏览器恢复滚动位置）
  function forceTop() {
    mainEl.scrollTop = 0;
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }
  forceTop();
  setTimeout(forceTop, 0);
  setTimeout(forceTop, 100);
  setTimeout(forceTop, 300);
  setTimeout(forceTop, 600);
}

// 页面显示时也强制回顶（防止浏览器缓存滚动位置）
window.addEventListener('pageshow', () => {
  if (mainEl) mainEl.scrollTop = 0;
  window.scrollTo(0, 0);
});

/* ---------------- 全局事件绑定（事件委托） ---------------- */
function bindGlobal() {
  // Tab 切换
  tabBar.addEventListener('click', e => {
    const item = e.target.closest('.tab-item');
    if (item) switchTab(item.dataset.tab);
  });

  // 搜索栏点击 → 打开搜索
  mainEl.addEventListener('click', e => {
    if (e.target.closest('.search-bar')) openSearch();
  });

  // 搜索覆盖层事件
  const searchOverlay = $('#searchOverlay');
  const searchInput = $('#searchInput');
  searchInput.addEventListener('input', () => renderSearch(searchInput.value));
  $('#searchCancel').addEventListener('click', closeSearch);
  searchOverlay.addEventListener('click', e => {
    const hot = e.target.closest('.search-hot .hot');
    if (hot) { searchInput.value = hot.dataset.hot; renderSearch(hot.dataset.hot); return; }
    const sc = e.target.closest('[data-content]');
    if (sc) { closeSearch(); openContentDetail(sc.dataset.content); return; }
    const sr = e.target.closest('[data-route]');
    if (sr) { closeSearch(); openRouteDetail(sr.dataset.route); return; }
    const sai = e.target.closest('[data-goto-ai]');
    if (sai) { closeSearch(); switchTab('ai'); return; }
  });

  // 详情覆盖层内：相关路线 / 相关推荐 / 商品 / 去AI 点击（覆盖层不在主容器内，需单独委托）
  overlay.addEventListener('click', e => {
    const rr = e.target.closest('.rec-route');
    if (rr) { openRouteDetail(rr.dataset.route); return; }
    const cr = e.target.closest('.cd-rec-item');
    if (cr) { openContentDetail(cr.dataset.content); return; }
    const pr = e.target.closest('[data-product]');
    if (pr) { openProductDetail(pr.dataset.product); return; }
    const sai = e.target.closest('[data-goto-ai]');
    if (sai) { closeDetail(); switchTab('ai'); return; }
  });

  // 主容器事件委托
  mainEl.addEventListener('click', async e => {
    // 收藏
    const favBtn = e.target.closest('.fav-btn');
    if (favBtn) {
      e.stopPropagation();
      toggleFav(favBtn.dataset.fav);
      const tab = state.tab;
      if (tab === 'home') { const { data } = await api.fetchHome(); renderHome(data); }
      if (tab === 'routes') renderRoutes();
      return;
    }
    // 内容卡片 → 详情
    const contentCard = e.target.closest('[data-content]');
    if (contentCard && contentCard.dataset.content) {
      openContentDetail(contentCard.dataset.content);
      return;
    }
    // 路线卡片 → 详情
    const routeCard = e.target.closest('[data-route]');
    if (routeCard && routeCard.dataset.route) {
      openRouteDetail(routeCard.dataset.route);
      return;
    }
    // 立即报名
    const joinBtn = e.target.closest('[data-join]');
    if (joinBtn) {
      e.stopPropagation();
      const r = getRoute(joinBtn.dataset.join);
      if (r) openRouteDetail(r.id);
      return;
    }
    // 首页快捷入口 → AI
    const gotoAI = e.target.closest('[data-goto-ai]');
    if (gotoAI) { switchTab('ai'); return; }
    const gotoRoutes = e.target.closest('[data-goto-routes]');
    if (gotoRoutes) { switchTab('routes'); return; }
    // 首页四大快捷入口
    const goto = e.target.closest('[data-goto]');
    if (goto) {
      const k = goto.dataset.goto;
      if (k === 'ai') switchTab('ai');
      else if (k === 'routes') switchTab('routes');
      else if (k === 'mall') openMall();
      else if (k === 'community') openCommunity();
      else if (k === 'biz') openBiz();
      else if (k === 'orders') openOrders();
      else if (k === 'video') openMedia('video');
      else if (k === 'audio') openMedia('audio');
      else if (k === 'level') showToast('体验官等级：消费+打卡+分享赚积分升级');
      else if (k === 'setting') showToast('账号与设置（Demo 占位）');
      else if (k === 'fav') scrollToFav();
      else if (k === 'checkin') scrollToCheckin();
      return;
    }
    // banner → 去AI掌柜页
    const bannerEl = e.target.closest('[data-banner]');
    if (bannerEl) { switchTab('ai'); return; }
    // 我的收藏项 → 对应详情
    const favRoute = e.target.closest('.mine-list [data-route]');
    if (favRoute) { openRouteDetail(favRoute.dataset.route); return; }
  });

  // AI 掌柜页事件（渲染后绑定）
  document.addEventListener('click', async e => {
    // 掌柜角色切换
    const chip = e.target.closest('.agent-chip');
    if (chip) {
      state.aiAgentId = chip.dataset.agent;
      state.messages = [];
      renderAI();
      return;
    }
    // AI 能力标签
    const ability = e.target.closest('[data-ability]');
    if (ability) {
      showToast(`「${ability.dataset.ability}」功能演示中，敬请期待`);
      return;
    }
    // 语音输入
    const voice = e.target.closest('#chatVoice');
    if (voice) {
      showToast('语音输入开发中，先试试打字吧');
      return;
    }
    // 预设问题
    const prompt = e.target.closest('.prompt');
    if (prompt) {
      sendMessage(prompt.dataset.prompt);
      return;
    }
    // 发送按钮
    const send = e.target.closest('#chatSend');
    if (send) {
      const input = $('#chatInput');
      const text = input.value.trim();
      if (text) { input.value = ''; sendMessage(text); }
    }
  });

  // 输入框回车发送
  document.addEventListener('keydown', e => {
    if (e.key === 'Enter' && state.tab === 'ai') {
      const input = $('#chatInput');
      if (input) {
        const text = input.value.trim();
        if (text) { input.value = ''; sendMessage(text); }
      }
    }
  });
}

/* ---------------- AI 对话 ---------------- */
async function sendMessage(text) {
  state.messages.push({ role: 'user', text });
  renderAI();
  // 显示 typing
  const chatWrap = $('#chatWrap');
  const typing = document.createElement('div');
  typing.className = 'msg agent typing';
  const agent = DB.aiAgents.find(a => a.id === state.aiAgentId);
  const shop = getShop(agent.shopId);
  typing.innerHTML = `<span class="avatar photo" style="background-image:url('${shop.img}')"></span><div class="bubble"><i></i><i></i><i></i></div>`;
  chatWrap.appendChild(typing);
  mainEl.scrollTop = mainEl.scrollHeight;

  const res = await api.askAI(state.aiAgentId, text);
  state.messages.push({ role: 'agent', text: res.data.reply });
  renderAI();
}

/* ---------------- Banner 轮播 ---------------- */
function startBanner(count) {
  if (count < 2) return;
  clearInterval(startBanner._t);
  startBanner._t = setInterval(() => {
    state.bannerIndex = (state.bannerIndex + 1) % count;
    const track = document.querySelector('.banner-track');
    const dots = document.querySelectorAll('.banner-dots i');
    if (!track) return;
    track.style.transition = 'transform .4s ease';
    track.style.transform = `translateX(-${state.bannerIndex * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('on', i === state.bannerIndex));
  }, 3500);
}

/* ---------------- 启动 ---------------- */
init();
