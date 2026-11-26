(function () {
  "use strict";
  const { works } = window.NEST;
  const { SampleDetails } = window.Details;
  const { BrowseState, SearchBar, RankMenu, RoomTabs, FilterPanel, stickTop } = window.BrowseKit;
  const $ = (s, r = document) => r.querySelector(s);
  const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const PAGE = 24;
  const DAYS = { "today": 0, "yesterday": 1, "2 days ago": 2, "3 days ago": 3, "5 days ago": 5, "last week": 7, "1 week ago": 8, "2 weeks ago": 14, "3 weeks ago": 21, "last month": 30, "2 months ago": 60 };
  const RATIOS = [[4, 5], [16, 9], null, [1, 1], [2, 3], [3, 2], [9, 16], [4, 3], null, [3, 4], [21, 9], [1, 1]];
  // words on this page (lang.js); the logs themselves (titles, texts, project names, makers) are printed as written; room labels come from L.room
  const L = window.NestLang, tx = (k, v) => L.t(k, v);
  L.add({
    en: { "dl.title": "Dev logs", "dl.lead": "What students changed in their projects lately, newest first. Sample content.", "dl.latest": "Latest logs", "dl.more": "Show more",
      "dl.none": "No logs match these filters.", "dl.noneQ": "No logs match “{q}”.", "dl.clear": "Clear", "dl.open": "Open the project's updates", "dl.image": "image" },
    th: { "dl.title": "บันทึกการพัฒนา", "dl.lead": "สิ่งที่นักเรียนแก้ไขในโปรเจกต์ช่วงนี้ ใหม่สุดอยู่บนสุด (ข้อมูลตัวอย่าง)", "dl.latest": "บันทึกล่าสุด", "dl.more": "ดูเพิ่ม",
      "dl.none": "ไม่พบบันทึกที่ตรงกับตัวกรองนี้", "dl.noneQ": "ไม่พบบันทึกที่ตรงกับ “{q}”", "dl.clear": "ล้าง", "dl.open": "เปิดอัปเดตของโปรเจกต์", "dl.image": "รูปภาพ" },
  });
  const updatesHref = (id) => NestSession.Paths.page(`project.html#${id}&updates`);

  const posts = works.flatMap((w, wi) => new SampleDetails(w).updates().slice(0, 2).map(([when, title, note], k) => ({ w, when, title, excerpt: k ? note : w.blurb, days: DAYS[when] ?? 90, order: wi * 2 + k })))
    .sort((a, b) => a.days - b.days || a.order - b.order)
    .map((p, i) => ({ ...p, ratio: RATIOS[i % RATIOS.length], frame: i % 7 }));

  const state = new BrowseState({ items: posts, of: (p) => p.w, text: (p) => `${p.title} ${p.w.name} ${p.w.maker} ${p.excerpt}` });
  let shown = PAGE;

  class Masonry {
    constructor(el) {
      this.el = el; this.w = 0;
      new ResizeObserver(() => { if (this.el.clientWidth !== this.w) this.layout(); }).observe(el);
      if (document.fonts) document.fonts.ready.then(() => this.layout());
    }
    layout() {
      const items = [...this.el.querySelectorAll(":scope > .lc")], W = this.el.clientWidth;
      this.w = W;
      if (!items.length) { this.el.style.height = ""; return; }
      const n = W >= 1000 ? 4 : W >= 700 ? 3 : 2, g = innerWidth < 600 ? 10 : innerWidth < 900 ? 16 : 20, cw = (W - g * (n - 1)) / n, h = new Array(n).fill(0);
      items.forEach((it) => { it.style.width = `${cw}px`; });
      items.forEach((it) => {
        const k = h.indexOf(Math.min(...h));
        it.style.left = `${k * (cw + g)}px`; it.style.top = `${h[k]}px`;
        h[k] += it.offsetHeight + g;
      });
      this.el.style.height = `${Math.max(...h) - g}px`;
    }
  }

  class LogFeed {
    constructor() {
      this.el = $(".ml"); this.n = $(".ml-n"); this.more = $(".dl-more"); this.grid = new Masonry(this.el);
      state.addEventListener("change", () => { shown = PAGE; this.paint(); });
      this.more.addEventListener("click", () => {
        const first = shown; shown += PAGE; this.paint();
        this.el.querySelectorAll(".lc")[first]?.focus();
      });
    }
    date(days) {
      const d = new Date(); d.setDate(d.getDate() - days);
      return { iso: d.toISOString().slice(0, 10), label: d.toLocaleDateString(L.th ? "th-TH" : "en-GB", { day: "numeric", month: "short" }) };
    }
    card(p, i) {
      const d = this.date(p.days);
      const label = `${p.title}, ${p.w.name}, ${d.label}. ${tx("dl.open")}`;
      const meta = `<span class="lc__meta"><span>${esc(p.w.name)}</span><time datetime="${d.iso}">${esc(d.label)}</time></span>`;
      const body = (top, ex) => `<span class="lc__body">${top}${meta}<span class="lc__title">${esc(p.title)}</span>${ex}<span class="lc__by">${esc(p.w.maker)}</span></span>`;
      if (!p.ratio) return `<a class="lc lc--text" href="${updatesHref(p.w.id)}" aria-label="${esc(label)}">${body(`<span class="lc__roomt">${esc(L.room(p.w.room))}</span>`, `<span class="lc__ex">${esc(p.excerpt)}</span>`)}</a>`;
      const [rw, rh] = p.ratio, hw = Math.min(1.5, Math.max(0.5, rh / rw)), iw = 600, ih = Math.round(iw * rh / rw);
      const src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(Art.draw({ ...p.w, scribble: "" }, p.frame));
      return `<a class="lc" href="${updatesHref(p.w.id)}" aria-label="${esc(label)}"><span class="lc__img" style="aspect-ratio:1 / ${hw.toFixed(3)}"><img src="${src}" alt="${esc(`${p.title}, ${tx("dl.image")}`)}" width="${iw}" height="${ih}"${i < 4 ? "" : ' loading="lazy"'} decoding="async"><span class="lc__room">${esc(p.w.room)}</span></span>${body("", "")}</a>`;
    }
    paint() {
      const pick = posts.filter((p) => state.matches(p));
      this.n.textContent = pick.length;
      this.more.hidden = pick.length <= shown;
      if (!pick.length) {
        this.el.innerHTML = `<p class="none">${esc(state.q.trim() ? tx("dl.noneQ", { q: state.q.trim() }) : tx("dl.none"))} <button type="button">${esc(tx("dl.clear"))}</button></p>`;
        $("button", this.el).addEventListener("click", () => state.set((s) => { s.q = ""; s.ranks.clear(); s.rooms.clear(); s.genres.clear(); }));
        this.el.style.height = "";
        return;
      }
      this.el.innerHTML = pick.slice(0, shown).map((p, i) => this.card(p, i)).join("");
      this.grid.layout();
    }
  }

  stickTop();
  new SearchBar(state); new RankMenu(state); new RoomTabs(state); new FilterPanel(state);
  const feed = new LogFeed();

  // lang.js writes the [data-i18n] words and the page title; the cards are drawn here
  L.addEventListener("change", () => feed.paint());
  feed.paint();
})();
