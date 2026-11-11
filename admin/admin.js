(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const nf = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 });
  const API = String((window.MK_CONFIG && window.MK_CONFIG.api) || '').trim().replace(/\/+$/, '');
  const SITE = (() => { try { const u = new URL(String((window.MK_CONFIG && window.MK_CONFIG.site) || '')); return u.protocol === 'https:' ? u.origin + '/main.html' : ''; } catch (_) { return ''; } })();
  const LISTS = window.MK_LISTS || { ICONS: {}, GOV: [], parseShip: () => [] };
  const TOK_KEY = 'mk_admin_tok', DATA_KEY = 'mk_admin_data';
  const root = document.documentElement;
  try { const th = localStorage.getItem('mk_theme'); if (th === 'light' || th === 'dark') root.setAttribute('data-theme', th); } catch (_) { }

  const ICON = {
    edit: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13.5 6.5l4 4"/></svg>',
    del: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/></svg>',
    eye: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>',
    eyeOff: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 3l18 18M10.6 5.1A10 10 0 0 1 12 5c6.4 0 10 7 10 7a17 17 0 0 1-3.2 4M6.6 6.6C3.8 8.4 2 12 2 12s3.6 7 10 7a9.6 9.6 0 0 0 5.4-1.6"/></svg>',
    box: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 7l9-4 9 4-9 4zM3 7v10l9 4 9-4V7M12 11v10"/></svg>',
    img: '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="3"/><circle cx="9" cy="10" r="2"/><path d="M21 16l-5-5-9 9"/></svg>',
    plus: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
    x: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    star: '<svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true"><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/></svg>',
    tag: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.5" cy="8.5" r="1.3"/></svg>',
    store: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9l1.5-5h13L20 9M4 9v11h16V9M4 9h16"/></svg>',
    chat: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/></svg>',
    cart: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 8h14l-1.2 12.2a1 1 0 0 1-1 .8H7.2a1 1 0 0 1-1-.8z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/></svg>',
    truck: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h11v10H3zM14 9h4l3 3.5V16h-7"/><circle cx="7" cy="17.5" r="1.8"/><circle cx="17.5" cy="17.5" r="1.8"/></svg>',
    lock: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="9.5" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',
    mega: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 10v4h3l7 4V6L7 10zM18 9a4 4 0 0 1 0 6"/></svg>'
  };

  const ERR = {
    wrong: 'اسم المستخدم أو كلمة المرور مش صح.',
    locked: 'اتعملت محاولات دخول غلط كتير. استنى 10 دقايق وجرّب تاني.',
    auth: 'خرجت من اللوحة لأن مدة الدخول خلصت. ادخل تاني.',
    busy: 'فيه حفظ تاني شغال دلوقتي. استنى ثانية وجرّب تاني.',
    name: 'لازم تكتب الاسم الأول.',
    exists: 'فيه قسم بنفس الاسم ده بالفعل.',
    has_products: 'القسم ده فيه منتجات. انقلها لقسم تاني أو احذفها الأول.',
    no_img_key: 'رفع الصور مش شغال دلوقتي، فالمنتج ما اتحفظش.',
    upload_failed: 'صورة من الصور ما اترفعتش، فالمنتج ما اتحفظش. جرّب تاني.',
    bad_image: 'صورة من الصور مش سليمة. شيلها واختار صورة تانية.',
    too_large: 'صورة من الصور كبيرة جدًا. اختار صورة أصغر.',
    not_image: 'الملف اللي اخترته مش صورة.',
    word: 'الكلمة مش مظبوطة، اكتب DELL بالحروف الكبيرة.',
    net: 'مفيش نت. اتأكد إن النت شغال وجرّب تاني.'
  };
  const errText = e => ERR[e] || 'الحفظ ما تمّش، ومفيش حاجة اتغيرت. جرّب تاني.';
  const DEV = '<span class="dev">ارجع للمطور</span>';
  const errHTML = e => `<span>${esc(errText(e))}</span>${DEV}`;
  function showErr(el, e) { el.hidden = false; el.innerHTML = errHTML(e); }

  let toastT;
  function toast(msg, ms = 2800, err) {
    const t = $('#toast'); t.classList.toggle('bad', !!err);
    if (err) t.innerHTML = errHTML(err); else t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), ms);
  }

  let token = '';
  try { const j = JSON.parse(localStorage.getItem(TOK_KEY) || 'null'); if (j && j.t && j.exp > Date.now()) token = j.t; } catch (_) { }
  const saveTok = t => { token = t; try { if (t) localStorage.setItem(TOK_KEY, JSON.stringify({ t, exp: Date.now() + 5.5 * 3600e3 })); else localStorage.removeItem(TOK_KEY); } catch (_) { } };

  async function call(op, payload, tries = 2) {
    if (!API) return { ok: false, error: 'server' };
    for (let i = 0; i < tries; i++) {
      try {
        const res = await fetch(API + '/api/admin', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'omit', mode: 'cors', body: JSON.stringify(Object.assign({ op, token }, payload || {})) });
        const j = await res.json().catch(() => null);
        if (j && typeof j === 'object') {
          if (j.error === 'auth' && op !== 'login') { onAuthLost(); }
          if (j.ok || (j.error && j.error !== 'unavailable')) return j;
        }
      } catch (_) {
        if (!navigator.onLine) return { ok: false, error: 'net' };
      }
      await new Promise(r => setTimeout(r, 700 * (i + 1)));
    }
    return { ok: false, error: 'server' };
  }

  const fail = e => toast('', 4500, e);
  let pending = 0, hadErr = false;
  function setSync() {
    const s = $('#sync'), sp = s.querySelector('span');
    if (pending > 0) { s.dataset.s = 'busy'; sp.textContent = 'بيتحفظ…'; }
    else if (hadErr) { s.dataset.s = 'err'; sp.textContent = 'في حاجة ما اتحفظتش'; }
    else { s.dataset.s = 'ok'; sp.textContent = 'كل حاجة محفوظة'; }
  }
  let chain = Promise.resolve();
  function write(op, payload) {
    pending++; hadErr = false; setSync();
    const p = chain.then(() => call(op, payload));
    chain = p.catch(() => { });
    return p.then(r => {
      pending--; if (!r.ok) hadErr = true; setSync();
      if (r.ok) cacheData();
      return r;
    });
  }
  window.addEventListener('beforeunload', e => { if (pending > 0) { e.preventDefault(); e.returnValue = ''; } });

  let D = null;
  const cacheData = () => { try { if (D) localStorage.setItem(DATA_KEY, JSON.stringify(D)); } catch (_) { } };

  function showLogin(msg) {
    $('#app').hidden = true; $('#login').hidden = false;
    const e = $('#lgErr'); e.hidden = !msg; e.innerHTML = msg ? `<span>${esc(msg)}</span>${DEV}` : '';
    setTimeout(() => $('#lgUser').focus(), 50);
  }
  function onAuthLost() {
    saveTok(''); $$('dialog[open]').forEach(d => d.close());
    showLogin(ERR.auth);
  }

  $('#lgEye').addEventListener('click', () => { const i = $('#lgPass'); i.type = i.type === 'password' ? 'text' : 'password'; });
  $('#loginForm').addEventListener('submit', async e => {
    e.preventDefault();
    const u = $('#lgUser'), p = $('#lgPass'), err = $('#lgErr'), btn = $('#lgBtn');
    [u, p].forEach(i => i.classList.toggle('bad', !i.value.trim()));
    if (!u.value.trim() || !p.value.trim()) { err.hidden = false; err.innerHTML = `<span>اكتب اسم المستخدم وكلمة المرور.</span>${DEV}`; return; }
    btn.disabled = true; btn.innerHTML = '<span class="spin"></span><span>بندخّلك…</span>';
    const r = await call('login', { user: u.value.trim(), pass: p.value }, 1);
    btn.disabled = false; btn.innerHTML = '<span>دخول</span>';
    if (!r.ok) { showErr(err, r.error); return; }
    saveTok(r.token); p.value = '';
    startApp();
  });

  $('#logout').addEventListener('click', () => {
    if (pending > 0) { toast('استنى لحد ما الحفظ يخلص.'); return; }
    saveTok(''); try { localStorage.removeItem(DATA_KEY); } catch (_) { }
    D = null; showLogin('');
  });

  let started = false;
  async function startApp() {
    $('#login').hidden = true; $('#app').hidden = false;
    if (!started) { started = true; bindApp(); }
    let cached = null;
    try { cached = JSON.parse(localStorage.getItem(DATA_KEY) || 'null'); } catch (_) { }
    if (cached && cached.products) { D = cached; renderAll(); }
    else { $('#plist').innerHTML = '<div class="sk"></div>'.repeat(5); $('#clist').innerHTML = '<div class="sk"></div>'.repeat(3); }
    const r = await call('data');
    if (r.ok) {
      if (pending === 0) { D = r.data; cacheData(); renderAll(); }
    } else if (!D) {
      $('#plist').innerHTML = `<div class="empty"><b>مش قادرين نجيب البيانات</b><p>${errHTML(r.error)}</p><button class="btn btn-ghost" type="button" id="retry">جرّب تاني</button></div>`;
      $('#retry').addEventListener('click', startApp);
    }
  }

  function renderAll() {
    $('#aStore').textContent = D.config.store_name || 'ملكة الأيفون';
    renderCatSelects(); renderProducts(); renderCats(); renderSettings(); syncGov();
  }

  const money = v => { const n = Number(v); return n > 0 ? nf.format(n) + ' ' + (D.config.currency || 'ج.م') : 'السعر عند التواصل'; };
  const numIn = v => { const s = String(v == null ? '' : v).replace(/[٠-٩]/g, d => String(d.charCodeAt(0) - 1632)).replace(/[,٬\s]/g, '').replace('٫', '.'); const n = parseFloat(s); return isFinite(n) && n > 0 ? n : ''; };

  let pq = '', pc = 'all';
  function renderCatSelects() {
    const opts = D.categories.map(c => `<option value="${esc(c.name)}">${esc(c.name)}</option>`).join('');
    $('#pcat').innerHTML = `<option value="all">كل الأقسام</option>${opts}<option value="">من غير قسم</option>`;
    $('#pcat').value = [...$('#pcat').options].some(o => o.value === pc) ? pc : 'all';
    $('#pCat').innerHTML = `<option value="">من غير قسم</option>${opts}`;
  }
  const norm = s => String(s || '').toLowerCase().replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي').trim();

  function prodRow(p) {
    const img = p.images && p.images[0];
    const pills = [!p.active ? '<span class="pill hid">مخفي</span>' : '', !p.in_stock ? '<span class="pill warn">نفد</span>' : '', p.badge ? `<span class="pill">${esc(p.badge)}</span>` : ''].join('');
    return `<article class="row${p.active ? '' : ' off'}${p._saving ? ' saving' : ''}" data-id="${esc(p.id)}">
  <div class="th">${img ? `<img src="${esc(img)}" alt="" loading="lazy" decoding="async" referrerpolicy="no-referrer">` : ICON.box}</div>
  <div class="row-t"><b>${esc(p.name)}</b><small><span class="pr">${esc(money(p.price))}</span><span>${esc(p.category || 'من غير قسم')}</span>${pills}</small></div>
  <div class="row-a">
    <button class="ib${p.active ? ' on' : ''}" type="button" data-a="vis" aria-label="${p.active ? 'إخفاء من المتجر' : 'إظهار في المتجر'}" title="${p.active ? 'ظاهر — دوس للإخفاء' : 'مخفي — دوس للإظهار'}">${p.active ? ICON.eye : ICON.eyeOff}</button>
    <button class="ib" type="button" data-a="stock" aria-label="${p.in_stock ? 'خليه نفد' : 'خليه متوفر'}" title="${p.in_stock ? 'متوفر — دوس لو نفد' : 'نفد — دوس لو رجع متوفر'}">${p.in_stock ? ICON.cart : '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M5 8h14l-1.2 12.2a1 1 0 0 1-1 .8H7.2a1 1 0 0 1-1-.8zM4 4l16 16"/></svg>'}</button>
    <button class="ib" type="button" data-a="edit" aria-label="تعديل">${ICON.edit}</button>
    <button class="ib del" type="button" data-a="del" aria-label="حذف">${ICON.del}</button>
  </div>
</article>`;
  }

  function renderProducts() {
    const q = norm(pq);
    const list = D.products.filter(p => (pc === 'all' || p.category === pc) && (!q || norm(p.name + ' ' + p.brand + ' ' + p.category).includes(q)));
    $('#cntP').textContent = D.products.length || '';
    if (!D.products.length) {
      $('#plist').innerHTML = `<div class="empty">${ICON.box}<b>لسه مفيش منتجات</b><p>دوس «منتج جديد» وضيف أول منتج في المتجر.</p></div>`;
      return;
    }
    $('#plist').innerHTML = list.length ? list.map(prodRow).join('') : '<div class="empty"><b>مفيش نتايج</b><p>جرّب كلمة تانية أو اختار «كل الأقسام».</p></div>';
  }

  function renderCats() {
    $('#cntC').textContent = D.categories.length || '';
    if (!D.categories.length) {
      $('#clist').innerHTML = `<div class="empty">${ICON.tag}<b>لسه مفيش أقسام</b><p>ضيف أقسام زي «موبايلات» و«جرابات» عشان العميل يلاقي اللي عايزه بسرعة.</p></div>`;
      return;
    }
    const count = n => D.products.filter(p => p.category === n).length;
    $('#clist').innerHTML = D.categories.map((c, i) => `<article class="row${c.active ? '' : ' off'}${c._saving ? ' saving' : ''}" data-i="${i}">
  <div class="th ic">${(LISTS.ICONS[c.icon] || {}).svg || ICON.tag}</div>
  <div class="row-t"><b>${esc(c.name)}</b><small><span>${count(c.name)} منتج</span>${c.active ? '' : '<span class="pill hid">مخفي</span>'}</small></div>
  <div class="row-a">
    <button class="ib${c.active ? ' on' : ''}" type="button" data-a="vis" aria-label="${c.active ? 'إخفاء القسم' : 'إظهار القسم'}">${c.active ? ICON.eye : ICON.eyeOff}</button>
    <button class="ib" type="button" data-a="edit" aria-label="تعديل">${ICON.edit}</button>
    <button class="ib del" type="button" data-a="del" aria-label="حذف">${ICON.del}</button>
  </div>
</article>`).join('');
  }

  const SETTINGS = [
    { t: 'بيانات المحل', i: ICON.store, f: [
      ['store_name', 'اسم المحل', 'text'], ['store_tagline', 'جملة قصيرة عن المحل', 'text'],
      ['address', 'عنوان المحل', 'text'], ['open_hours', 'مواعيد العمل', 'text'], ['currency', 'العملة', 'text']] },
    { t: 'التواصل', i: ICON.chat, f: [
      ['whatsapp_number', 'رقم الواتساب اللي بيستقبل الطلبات', 'tel', '01012345678'], ['phone', 'رقم تليفون للاتصال', 'tel', '01012345678'],
      ['facebook', 'رابط فيسبوك', 'url', 'https://facebook.com/...'], ['instagram', 'رابط إنستجرام', 'url', 'https://instagram.com/...'], ['tiktok', 'رابط تيك توك', 'url', 'https://tiktok.com/@...']] },
    { t: 'الطلبات', i: ICON.cart, f: [
      ['orders_enabled', 'استقبال الطلبات شغال', 'bool'],
      ['closed_message', 'رسالة لما الطلبات تكون متوقفة', 'area'], ['order_header', 'أول سطر في رسالة الطلب', 'text'], ['order_footer', 'آخر سطر في رسالة الطلب', 'text']] },
    { t: 'الإعلان', i: ICON.mega, f: [['announcement', 'إعلان بيظهر فوق الموقع وكمان كنافذة أول ما العميل يفتح الموقع. أول سطر هو العنوان والباقي تفاصيل. سيبه فاضي لو مش عايز إعلان', 'area']] },
    { t: 'الشريط المتحرك', i: ICON.mega, f: [['marquee', 'كل سطر جملة بتتحرك في الشريط. سيبه فاضي عشان تظهر الجمل الافتراضية', 'area']] }
  ];
  const isTrue = v => /^(true|1|yes|نعم)$/i.test(String(v).trim());
  function renderSettings() {
    const c = D.config;
    $('#setForm').innerHTML = shipCard(c) + SETTINGS.map(g => `<section class="card"><h2>${g.i}${esc(g.t)}</h2>${g.f.map(([k, l, ty, ph]) => ty === 'bool'
      ? `<label class="sw"><input type="checkbox" data-k="${k}" ${isTrue(c[k]) ? 'checked' : ''}><i></i><span>${esc(l)}</span></label>`
      : ty === 'area' ? `<label class="fld"><span class="lbl">${esc(l)}</span><textarea data-k="${k}" maxlength="500" rows="${k === 'marquee' ? 6 : 3}">${esc(c[k] || '')}</textarea></label>`
        : `<label class="fld"><span class="lbl">${esc(l)}</span><input data-k="${k}" type="${ty === 'url' ? 'url' : ty === 'tel' ? 'tel' : 'text'}" ${ty === 'tel' || ty === 'url' ? 'dir="ltr"' : ''} maxlength="500" value="${esc(c[k] || '')}" placeholder="${esc(ph || '')}"></label>`).join('')}</section>`).join('');
  }

  function shipCard(c) {
    const on = {}; LISTS.parseShip(c.shipping).forEach(x => { on[x.name] = x.fee; });
    const fresh = !String(c.shipping || '').trim();
    const rows = LISTS.GOV.map(([g]) => { const has = fresh || g in on; return `<div class="gv${has ? '' : ' off'}" data-g="${esc(g)}">
  <label class="ck"><input type="checkbox" class="gsel" aria-label="حدد ${esc(g)}"><i></i></label>
  <span class="gn">${esc(g)}</span>
  <label class="gfee-w"><input class="gfee" inputmode="decimal" maxlength="7" placeholder="0" value="${has && on[g] ? esc(on[g]) : ''}" aria-label="مصاريف الشحن لـ ${esc(g)}"><span>${esc(c.currency || 'ج.م')}</span></label>
  <label class="sw"><input type="checkbox" class="gon" ${has ? 'checked' : ''} aria-label="التوصيل لـ ${esc(g)}"><i></i></label>
</div>`; }).join('');
    return `<section class="card ship-card"><h2>${ICON.truck}الشحن والاستلام</h2>
  <label class="sw"><input type="checkbox" data-k="delivery_enabled" ${c.delivery_enabled == null || isTrue(c.delivery_enabled) ? 'checked' : ''}><i></i><span>التوصيل متاح</span></label>
  <label class="sw"><input type="checkbox" data-k="pickup_enabled" ${c.pickup_enabled == null || isTrue(c.pickup_enabled) ? 'checked' : ''}><i></i><span>الاستلام من المحل متاح</span></label>
  <p class="help">العميل بيختار المحافظة بس، ومصاريف الشحن بتتحسب لوحدها في الفاتورة. سيب السعر فاضي أو 0 لو الشحن مجاني. اقفل المفتاح جنب أي محافظة عشان متظهرش للعميل.</p>
  <div class="gv-bulk">
    <label class="ck"><input type="checkbox" id="gAll"><i></i><span>حدد الكل</span></label>
    <span class="gv-cnt" id="gCnt">مفيش محافظات محددة</span>
    <label class="gfee-w"><input id="gFee" inputmode="decimal" maxlength="7" placeholder="السعر" aria-label="سعر الشحن للمحافظات المحددة"><span>${esc(c.currency || 'ج.م')}</span></label>
    <button type="button" class="btn btn-ghost sm" data-g="fee">طبّق السعر</button>
    <button type="button" class="btn btn-ghost sm" data-g="on">إظهار</button>
    <button type="button" class="btn btn-ghost sm" data-g="off">إخفاء</button>
  </div>
  <div class="gv-list">${rows}</div>
</section>`;
  }
  function shipValue() {
    return $$('#setForm .gv').filter(r => $('.gon', r).checked).map(r => { const f = numIn($('.gfee', r).value); return r.dataset.g + '=' + (f || 0); }).join(' | ');
  }
  function syncGov() {
    const sel = $$('#setForm .gsel:checked').length, all = $$('#setForm .gsel').length;
    const ga = $('#gAll'); if (ga) { ga.checked = sel > 0 && sel === all; ga.indeterminate = sel > 0 && sel < all; }
    const gc = $('#gCnt'); if (gc) gc.textContent = sel ? `محدد ${sel} محافظة` : 'مفيش محافظات محددة';
    $$('#setForm .gv').forEach(r => { r.classList.toggle('off', !$('.gon', r).checked); r.classList.toggle('sel', $('.gsel', r).checked); });
  }

  function renderTools() {
    const T = [
      ['Dell', 'مسح كل المنتجات والأقسام', 'بيمسح كل المنتجات وكل الأقسام من المتجر مرة واحدة. الإعدادات وبيانات الدخول بتفضل زي ما هي.', true],
      ['Setup', 'تجهيز المتجر لأول مرة', 'بيجهز المتجر من الصفر بكل الأجزاء والإعدادات الأساسية.'],
      ['Update', 'تحديث المتجر', 'بيضيف أي حاجة جديدة للمتجر من غير ما يمسح أي بيانات.'],
      ['Reset', 'إرجاع أجزاء للوضع الأصلي', 'بيرجّع أجزاء معينة من المتجر زي ما كانت أول مرة.'],
      ['Translate', 'ترجمة المنتجات للإنجليزي', 'بيترجم كل المنتجات والأقسام للنسخة الإنجليزية من الموقع.'],
      ['ShowSec', 'عرض مفتاح الحماية', 'بيعرض مفتاح الحماية الخاص بالمتجر.'],
      ['RotateSec', 'تغيير مفتاح الحماية', 'بيعمل مفتاح حماية جديد للمتجر.']
    ];
    $('#tools').innerHTML = T.map(([k, t, d, on]) => `<article class="tool${on ? ' live' : ' off'}">
  <div class="tool-t"><b>${esc(t)}</b><code dir="ltr">${k}</code></div>
  <p>${esc(d)}</p>
  ${on ? `<button class="btn btn-danger" type="button" id="wipeBtn">${ICON.del}<span>تشغيل</span></button>` : `<span class="tool-lock">${ICON.lock}<span>ارجع للمطور</span></span>`}
</article>`).join('');
    $('#wipeBtn').addEventListener('click', () => { $('#wIn').value = ''; $('#wErr').hidden = true; $('#wDlg').showModal(); setTimeout(() => $('#wIn').focus(), 60); });
  }

  function bindApp() {
    renderTools();
    $('#wForm').addEventListener('submit', async e => {
      e.preventDefault();
      if ($('#wIn').value.trim() !== 'DELL') { showErr($('#wErr'), 'word'); return; }
      const btn = $('#wYes'); btn.disabled = true; btn.innerHTML = '<span class="spin"></span><span>بنمسح…</span>';
      const r = await write('wipe', { confirm: 'DELL' });
      btn.disabled = false; btn.textContent = 'امسح كل حاجة';
      if (!r.ok) { showErr($('#wErr'), r.error); return; }
      $('#wDlg').close(); D.products = []; D.categories = []; cacheData(); renderAll(); toast('كل المنتجات والأقسام اتمسحت');
    });
    $('#setForm').addEventListener('change', e => {
      if (e.target.id === 'gAll') { $$('#setForm .gsel').forEach(x => { x.checked = e.target.checked; }); }
      if (e.target.matches('.gsel,.gon,#gAll')) syncGov();
    });
    $('#setForm').addEventListener('click', e => {
      const b = e.target.closest('button[data-g]'); if (!b) return;
      const rows = $$('#setForm .gv').filter(r => $('.gsel', r).checked);
      if (!rows.length) { toast('حدد محافظة واحدة على الأقل الأول.'); return; }
      if (b.dataset.g === 'fee') { const v = $('#gFee').value.trim() === '' ? '' : numIn($('#gFee').value); rows.forEach(r => { $('.gfee', r).value = v || ''; $('.gon', r).checked = true; }); toast(`السعر اتطبق على ${rows.length} محافظة. متنساش تدوس حفظ.`); }
      else rows.forEach(r => { $('.gon', r).checked = b.dataset.g === 'on'; });
      syncGov();
    });
    const sl = $('#siteLink'); if (sl && SITE) { sl.href = SITE; sl.hidden = false; }
    $$('.tabs button').forEach(b => b.addEventListener('click', () => {
      $$('.tabs button').forEach(x => x.setAttribute('aria-selected', String(x === b)));
      $$('.panel').forEach(p => { p.hidden = p.id !== 'tab-' + b.dataset.tab; });
      scrollTo({ top: 0 });
    }));
    let qt;
    $('#pq').addEventListener('input', e => { clearTimeout(qt); qt = setTimeout(() => { pq = e.target.value; renderProducts(); }, 100); });
    $('#pcat').addEventListener('change', e => { pc = e.target.value; renderProducts(); });
    $('#newP').addEventListener('click', () => openProduct(null));
    $('#newC').addEventListener('click', () => openCat(-1));

    $('#plist').addEventListener('click', e => {
      const b = e.target.closest('button[data-a]'); if (!b) return;
      const id = b.closest('.row').dataset.id; const p = D.products.find(x => x.id === id); if (!p) return;
      const a = b.dataset.a;
      if (a === 'edit') openProduct(p);
      else if (a === 'del') ask('تحذف المنتج ده؟', `«${p.name}» هيتشال من المتجر نهائيًا.`, () => removeProduct(p));
      else if (a === 'vis' || a === 'stock') {
        const key = a === 'vis' ? 'active' : 'in_stock';
        const before = p[key]; p[key] = !before; p._saving = true; renderProducts();
        toast(a === 'vis' ? (p.active ? 'المنتج بقى ظاهر' : 'المنتج اتخفى من المتجر') : (p.in_stock ? 'المنتج بقى متوفر' : 'المنتج بقى نفد'));
        write('saveProduct', { item: pub(p) }).then(r => { p._saving = false; if (!r.ok) { p[key] = before; fail(r.error); } renderProducts(); });
      }
    });
    $('#clist').addEventListener('click', e => {
      const b = e.target.closest('button[data-a]'); if (!b) return;
      const i = Number(b.closest('.row').dataset.i); const c = D.categories[i]; if (!c) return;
      if (b.dataset.a === 'edit') openCat(i);
      else if (b.dataset.a === 'del') {
        if (D.products.some(p => p.category === c.name)) { fail('has_products'); return; }
        ask('تحذف القسم ده؟', `قسم «${c.name}» هيتشال من المتجر.`, () => {
          const idx = D.categories.indexOf(c); D.categories.splice(idx, 1); renderAll();
          write('deleteCategory', { name: c.name }).then(r => { if (!r.ok) { D.categories.splice(idx, 0, c); renderAll(); fail(r.error); } else toast('القسم اتحذف'); });
        });
      } else if (b.dataset.a === 'vis') {
        c.active = !c.active; c._saving = true; renderCats();
        write('saveCategory', { item: { old: c.name, name: c.name, active: c.active, sort: c.sort, icon: c.icon } }).then(r => { c._saving = false; if (!r.ok) { c.active = !c.active; fail(r.error); } renderCats(); });
      }
    });

    $('#saveSet').addEventListener('click', async () => {
      const values = {};
      $$('#setForm [data-k]').forEach(el => { values[el.dataset.k] = el.type === 'checkbox' ? (el.checked ? 'TRUE' : 'FALSE') : el.value.trim(); });
      values.shipping = shipValue();
      if (values.delivery_enabled === 'FALSE' && values.pickup_enabled === 'FALSE') { toast('لازم تسيب طريقة استلام واحدة على الأقل شغالة.'); return; }
      const bad = $$('#setForm input[type=url]').find(el => el.value.trim() && !/^https:\/\//i.test(el.value.trim()));
      if (bad) { bad.classList.add('bad'); bad.focus(); toast('الرابط ده مش صح. انسخ الرابط كامل من المتصفح.'); return; }
      const before = Object.assign({}, D.config);
      Object.assign(D.config, values); $('#aStore').textContent = D.config.store_name || 'ملكة الأيفون';
      toast('بنحفظ الإعدادات…');
      const r = await write('saveConfig', { values });
      if (r.ok) toast('الإعدادات اتحفظت وظهرت في المتجر'); else { D.config = before; renderSettings(); syncGov(); fail(r.error); }
    });
    $('#setForm').addEventListener('input', e => e.target.classList.remove('bad'));

    $$('dialog').forEach(d => {
      d.addEventListener('click', e => { if (e.target === d || e.target.closest('[data-close]')) d.close(); });
    });
  }

  const pub = p => ({ id: p.id, active: p.active, category: p.category, name: p.name, brand: p.brand, price: p.price, old_price: p.old_price, images: p.images, description: p.description, options: p.options, colors: p.colors, badge: p.badge, in_stock: p.in_stock, sort: p.sort });

  let askFn = null;
  function ask(title, text, fn) {
    $('#qDlgT').textContent = title; $('#qDlgP').textContent = text; askFn = fn;
    $('#qDlg').showModal();
  }
  $('#qYes').addEventListener('click', () => { $('#qDlg').close(); if (askFn) askFn(); askFn = null; });

  function removeProduct(p) {
    const idx = D.products.indexOf(p);
    const row = $(`#plist .row[data-id="${CSS.escape(p.id)}"]`);
    if (row) row.classList.add('gone');
    setTimeout(() => { D.products.splice(D.products.indexOf(p), 1); renderProducts(); }, 220);
    write('deleteProduct', { id: p.id }).then(r => {
      if (r.ok) toast('المنتج اتحذف');
      else { if (!D.products.includes(p)) D.products.splice(idx, 0, p); renderProducts(); fail(r.error); }
    });
  }

  async function shrink(file) {
    const max = 1600;
    let bmp;
    try { bmp = await createImageBitmap(file); } catch (_) {
      bmp = await new Promise((res, rej) => { const im = new Image(); im.onload = () => res(im); im.onerror = rej; im.src = URL.createObjectURL(file); });
    }
    const w0 = bmp.width, h0 = bmp.height, k = Math.min(1, max / Math.max(w0, h0));
    const cv = document.createElement('canvas'); cv.width = Math.round(w0 * k); cv.height = Math.round(h0 * k);
    cv.getContext('2d').drawImage(bmp, 0, 0, cv.width, cv.height);
    let url = cv.toDataURL('image/webp', 0.84);
    if (!url.startsWith('data:image/webp')) url = cv.toDataURL('image/jpeg', 0.86);
    return url;
  }

  function makeUploader(box) {
    let items = [];
    const fileIn = $('#fileIn');
    function render() {
      box.innerHTML = items.map((it, i) => `<div class="im${i === 0 ? ' main' : ''}${it.state === 'up' ? ' up' : ''}" data-i="${i}">
  <img src="${esc(it.preview || it.url)}" alt="" decoding="async" referrerpolicy="no-referrer">
  ${it.state === 'up' ? '<span class="ov"><span class="spin"></span></span>' : ''}
  <button type="button" class="bt mk" data-main aria-label="خليها الصورة الأساسية" title="خليها الصورة الأساسية">${ICON.star}</button>
  <button type="button" class="bt rm" data-rm aria-label="شيل الصورة">${ICON.x}</button>
  ${i === 0 ? '<span class="tag">الأساسية</span>' : ''}
</div>`).join('') + (items.length >= 10 ? '' : `<button type="button" class="addimg" data-add>${ICON.img}<span>${items.length ? 'صور تانية' : 'إضافة صور'}</span></button>`);
    }
    function add(files) {
      const all = [...files];
      const list = all.filter(f => /^image\//.test(f.type)).slice(0, 10 - items.length);
      if (all.length && !list.length) { fail('not_image'); return; }
      items.push(...list.map(f => ({ file: f, state: 'new', preview: URL.createObjectURL(f) }))); render();
    }
    let picking = false;
    box.addEventListener('click', e => {
      const t = e.target.closest('[data-add],[data-rm],[data-main]'); if (!t || box.classList.contains('lock')) return;
      const im = t.closest('.im'); const i = im ? Number(im.dataset.i) : -1;
      if (t.dataset.add != null) { picking = true; fileIn.multiple = true; fileIn.value = ''; fileIn.click(); }
      else if (t.dataset.rm != null) { const it = items.splice(i, 1)[0]; if (it && it.file && it.preview) URL.revokeObjectURL(it.preview); render(); }
      else if (t.dataset.main != null && i > 0) { items.unshift(items.splice(i, 1)[0]); render(); }
    });
    fileIn.addEventListener('change', () => { if (picking && box.isConnected && box.closest('dialog[open]')) add(fileIn.files); picking = false; });
    box.addEventListener('dragover', e => { e.preventDefault(); const a = $('.addimg', box); if (a) a.classList.add('drag'); });
    box.addEventListener('dragleave', () => { const a = $('.addimg', box); if (a) a.classList.remove('drag'); });
    box.addEventListener('drop', e => { e.preventDefault(); add(e.dataTransfer.files); });
    return {
      set(urls) { items = (urls || []).map(u => ({ url: u, state: 'ok' })); render(); },
      waiting: () => items.filter(i => i.state !== 'ok').length,
      async uploadAll(onStep) {
        const todo = items.filter(i => i.state !== 'ok');
        box.classList.add('lock');
        try {
          for (let k = 0; k < todo.length; k++) {
            const it = todo[k]; onStep(k + 1, todo.length);
            it.state = 'up'; render();
            let data;
            try { data = await shrink(it.file); } catch (_) { it.state = 'new'; render(); return { ok: false, error: 'bad_image' }; }
            const r = await write('upload', { data, name: 'mk' + Date.now().toString(36) });
            if (!r.ok || !r.url) { it.state = 'new'; render(); return { ok: false, error: r.error || 'upload_failed' }; }
            it.url = r.url; it.state = 'ok'; it.file = null; render();
          }
          return { ok: true };
        } finally { box.classList.remove('lock'); }
      },
      urls: () => items.filter(i => i.state === 'ok' && i.url).map(i => i.url)
    };
  }

  const pUp = makeUploader($('#pImgs'));

  let pickIcon = '';
  function renderIcons() {
    $('#cIcons').innerHTML = Object.keys(LISTS.ICONS).map(k => { const x = LISTS.ICONS[k]; return `<button type="button" class="ico${k === pickIcon ? ' on' : ''}" role="radio" aria-checked="${k === pickIcon}" data-ic="${k}" title="${esc(x.ar)}">${x.svg}<span>${esc(x.ar)}</span></button>`; }).join('');
  }
  $('#cIcons').addEventListener('click', e => { const b = e.target.closest('[data-ic]'); if (!b) return; pickIcon = b.dataset.ic; renderIcons(); });

  let colors = [];
  function renderColors() {
    const box = $('#pColors'), inp = $('#pColorIn');
    $$('.tg', box).forEach(x => x.remove());
    colors.forEach((c, i) => { const s = document.createElement('span'); s.className = 'tg'; s.innerHTML = `${esc(c)}<button type="button" data-ci="${i}" aria-label="شيل ${esc(c)}">${ICON.x}</button>`; box.insertBefore(s, inp); });
  }
  function pushColor() {
    const inp = $('#pColorIn');
    inp.value.split(/[,،|]+/).map(s => s.trim()).filter(Boolean).forEach(v => { if (!colors.includes(v) && colors.length < 12) colors.push(v.slice(0, 30)); });
    inp.value = ''; renderColors();
  }
  $('#pColorIn').addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ',' || e.key === '،') { e.preventDefault(); pushColor(); } else if (e.key === 'Backspace' && !e.target.value && colors.length) { colors.pop(); renderColors(); } });
  $('#pColorIn').addEventListener('blur', pushColor);
  $('#pColors').addEventListener('click', e => { const b = e.target.closest('[data-ci]'); if (b) { colors.splice(Number(b.dataset.ci), 1); renderColors(); } });

  function optRow(l, p) {
    const d = document.createElement('div'); d.className = 'opt-r';
    d.innerHTML = `<input placeholder="مثلاً: 256GB" maxlength="40" value="${esc(l || '')}" aria-label="اسم الاختيار"><input placeholder="السعر (اختياري)" inputmode="decimal" maxlength="12" value="${esc(p || '')}" aria-label="سعر الاختيار"><button type="button" class="ib del" aria-label="شيل الاختيار">${ICON.x}</button>`;
    d.querySelector('button').addEventListener('click', () => d.remove());
    $('#pOpts').appendChild(d);
    return d;
  }
  $('#addOpt').addEventListener('click', () => optRow().querySelector('input').focus());
  const parseOpts = s => String(s || '').split(/[|\n]+/).map(x => { const i = x.lastIndexOf('='); return i === -1 ? [x.trim(), ''] : [x.slice(0, i).trim(), x.slice(i + 1).trim()]; }).filter(x => x[0]);

  let editing = null;
  function openProduct(p) {
    editing = p;
    $('#pDlgT').textContent = p ? 'تعديل المنتج' : 'منتج جديد';
    $('#pName').value = p ? p.name : ''; $('#pName').classList.remove('bad'); $('#pName').nextElementSibling.hidden = true;
    $('#pCat').value = p ? p.category : (pc !== 'all' ? pc : (D.categories[0] ? D.categories[0].name : ''));
    $('#pBrand').value = p ? p.brand : '';
    $('#pPrice').value = p && p.price ? p.price : ''; $('#pOld').value = p && p.old_price ? p.old_price : '';
    $('#pDesc').value = p ? p.description : ''; $('#pBadge').value = p ? p.badge : ''; $('#pSort').value = p && p.sort !== '' ? p.sort : '';
    $('#pActive').checked = p ? p.active : true; $('#pStock').checked = p ? p.in_stock : true;
    $('#pOpts').innerHTML = ''; parseOpts(p && p.options).forEach(([l, pr]) => optRow(l, pr));
    colors = p ? String(p.colors || '').split(/[|\n,،]+/).map(s => s.trim()).filter(Boolean) : []; $('#pColorIn').value = ''; renderColors();
    pUp.set(p ? p.images : []);
    $('#pDlg').showModal(); $('.dlg-body', $('#pDlg')).scrollTop = 0;
    if (!p) setTimeout(() => $('#pName').focus(), 60);
  }

  $('#pForm').addEventListener('submit', async e => {
    e.preventDefault();
    const name = $('#pName').value.trim();
    if (!name) { $('#pName').classList.add('bad'); $('#pName').nextElementSibling.hidden = false; $('#pName').focus(); return; }
    pushColor();
    const btn = $('#pSave');
    if (btn.disabled) return;
    if (pUp.waiting()) {
      btn.disabled = true; $$('#pDlg [data-close]').forEach(b => { b.disabled = true; });
      const up = await pUp.uploadAll((k, n) => { btn.innerHTML = `<span class="spin"></span><span>${n > 1 ? `بنرفع الصور ${k} من ${n}…` : 'بنرفع الصورة…'}</span>`; });
      btn.disabled = false; btn.textContent = 'حفظ المنتج'; $$('#pDlg [data-close]').forEach(b => { b.disabled = false; });
      if (!up.ok) { fail(up.error); return; }
    }
    const item = {
      id: editing ? editing.id : '', name, category: $('#pCat').value, brand: $('#pBrand').value.trim(),
      price: numIn($('#pPrice').value), old_price: numIn($('#pOld').value), description: $('#pDesc').value.trim(),
      badge: $('#pBadge').value.trim(), sort: $('#pSort').value.trim() === '' ? '' : (Number(numIn($('#pSort').value)) || 0),
      active: $('#pActive').checked, in_stock: $('#pStock').checked, images: pUp.urls(),
      options: $$('#pOpts .opt-r').map(r => { const [a, b] = $$('input', r).map(i => i.value.trim()); const n = numIn(b); return a ? (n ? `${a.replace(/[|=]/g, ' ')}=${n}` : a.replace(/[|=]/g, ' ')) : ''; }).filter(Boolean).join(' | '),
      colors: colors.join(' | ')
    };
    $('#pDlg').close();
    let target = editing, before = null;
    if (target) { before = Object.assign({}, target); Object.assign(target, item); }
    else { target = Object.assign({ _tmp: true }, item, { id: 'tmp' + Date.now() }); D.products.unshift(target); }
    target._saving = true; renderProducts(); renderCats();
    toast(editing ? 'بنحفظ التعديل…' : 'بنضيف المنتج…', 1600);
    const r = await write('saveProduct', { item: Object.assign({}, item, { id: target._tmp ? '' : target.id }) });
    target._saving = false;
    if (r.ok) { if (target._tmp) { target.id = r.id; delete target._tmp; } cacheData(); toast(editing ? 'التعديل اتحفظ' : 'المنتج اتضاف للمتجر'); }
    else {
      if (before) Object.assign(target, before); else D.products.splice(D.products.indexOf(target), 1);
      fail(r.error);
    }
    renderProducts(); renderCats();
  });
  $('#pName').addEventListener('input', e => { e.target.classList.remove('bad'); e.target.nextElementSibling.hidden = true; });

  let catIdx = -1;
  function openCat(i) {
    catIdx = i; const c = D.categories[i];
    $('#cDlgT').textContent = c ? 'تعديل القسم' : 'قسم جديد';
    $('#cName').value = c ? c.name : ''; $('#cName').classList.remove('bad'); $('#cName').nextElementSibling.hidden = true;
    $('#cSort').value = c && c.sort !== '' ? c.sort : ''; $('#cActive').checked = c ? c.active : true;
    pickIcon = c && LISTS.ICONS[c.icon] ? c.icon : 'phone'; renderIcons();
    $('#cDlg').showModal(); if (!c) setTimeout(() => $('#cName').focus(), 60);
  }
  $('#cForm').addEventListener('submit', async e => {
    e.preventDefault();
    const name = $('#cName').value.trim();
    const ni = $('#cName');
    if (!name) { ni.classList.add('bad'); ni.nextElementSibling.hidden = false; ni.focus(); return; }
    const old = catIdx > -1 ? D.categories[catIdx].name : '';
    if (D.categories.some((c, i) => c.name === name && i !== catIdx)) { ni.classList.add('bad'); ni.nextElementSibling.hidden = false; ni.nextElementSibling.textContent = ERR.exists; return; }
    const item = { old, name, sort: $('#cSort').value.trim() === '' ? '' : (Number(numIn($('#cSort').value)) || 0), active: $('#cActive').checked, icon: pickIcon };
    $('#cDlg').close();
    const prev = catIdx > -1 ? Object.assign({}, D.categories[catIdx]) : null;
    let c;
    if (prev) { c = D.categories[catIdx]; Object.assign(c, { name, sort: item.sort, active: item.active, icon: item.icon }); if (old !== name) D.products.forEach(p => { if (p.category === old) p.category = name; }); }
    else { c = { name, sort: item.sort, active: item.active, icon: item.icon }; D.categories.push(c); }
    c._saving = true; renderAll();
    const r = await write('saveCategory', { item });
    c._saving = false;
    if (r.ok) toast(prev ? 'القسم اتحفظ' : 'القسم اتضاف');
    else {
      if (prev) { Object.assign(c, prev); if (old !== name) D.products.forEach(p => { if (p.category === name) p.category = old; }); }
      else D.categories.splice(D.categories.indexOf(c), 1);
      fail(r.error);
    }
    renderAll();
  });
  $('#cName').addEventListener('input', e => { e.target.classList.remove('bad'); e.target.nextElementSibling.hidden = true; e.target.nextElementSibling.textContent = 'اكتب اسم القسم.'; });

  if (token) startApp(); else showLogin('');
})();
