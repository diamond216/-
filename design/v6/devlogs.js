(function () {
  "use strict";
  const { works } = window.NEST;
  const { SampleDetails } = window.Details;
  const { BrowseState, SearchBar, RankMenu, RoomTabs, FilterPanel, ActiveChips, stickTop } = window.BrowseKit;
  const $ = (s, r = document) => r.querySelector(s);
  const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const PAGE = 24;
  const DAYS = { "today": 0, "yesterday": 1, "2 days ago": 2, "3 days ago": 3, "5 days ago": 5, "last week": 7, "1 week ago": 8, "2 weeks ago": 14, "3 weeks ago": 21, "last month": 30, "2 months ago": 60 };
  const RATIOS = [[4, 5], [16, 9], null, [1, 1], [2, 3], [3, 2], [9, 16], [4, 3], null, [3, 4], [21, 9], [1, 1]];
  const TEXT = {
    en: { title: "Dev logs", lead: "What students changed in their projects lately, newest first. Sample content.", latest: "Latest logs", more: "Show more", search: "Search logs, projects and makers", searchLabel: "Search dev logs", none: (q) => q ? `No logs match “${q}”.` : "No logs match these filters.", clear: "Clear", open: "Open the project's updates", image: "image" },
    th: { title: "บันทึกการพัฒนา", lead: "สิ่งที่นักเรียนเปลี่ยนในโปรเจกต์ช่วงนี้ ใหม่สุดก่อน (ข้อมูลตัวอย่าง)", latest: "บันทึกล่าสุด", more: "ดูเพิ่ม", search: "ค้นหาบันทึก โปรเจกต์ และผู้สร้าง", searchLabel: "ค้นหาบันทึกการพัฒนา", none: (q) => q ? `ไม่พบบันทึกที่ตรงกับ “${q}”` : "ไม่พบบันทึกที่ตรงกับตัวกรองนี้", clear: "ล้าง", open: "เปิดอัปเดตของโปรเจกต์", image: "รูปภาพ" },
  };
  const updatesHref = (id) => NestSession.Paths.page(`project.html#${id}&updates`);

  const posts = works.flatMap((w, wi) => new SampleDetails(w).updates().slice(0, 2).map(([when, title, note], k) => ({ w, when, title, excerpt: k ? note : w.blurb, days: DAYS[when] ?? 90, order: wi * 2 + k })))
    .sort((a, b) => a.days - b.days || a.order - b.order)
    .map((p, i) => ({ ...p, ratio: RATIOS[i % RATIOS.length], frame: i % 7 }));

  const state = new BrowseState({ items: posts, of: (p) => p.w, text: (p) => `${p.title} ${p.w.name} ${p.w.maker} ${p.excerpt}` });
  let lang = "en", shown = PAGE;

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
      const n = W >= 1120 ? 4 : W >= 700 ? 3 : 2, g = innerWidth < 600 ? 10 : innerWidth < 900 ? 16 : 20, cw = (W - g * (n - 1)) / n, h = new Array(n).fill(0);
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
      return { iso: d.toISOString().slice(0, 10), label: d.toLocaleDateString(lang === "th" ? "th-TH" : "en-GB", { day: "numeric", month: "short" }) };
    }
    card(p, i) {
      const t = TEXT[lang], d = this.date(p.days);
      const label = `${p.title}, ${p.w.name}, ${d.label}. ${t.open}`;
      const meta = `<span class="lc__meta"><span>${esc(p.w.name)}</span><time datetime="${d.iso}">${esc(d.label)}</time></span>`;
      const body = (top, ex) => `<span class="lc__body">${top}${meta}<span class="lc__title">${esc(p.title)}</span>${ex}<span class="lc__by">${esc(p.w.maker)}</span></span>`;
      if (!p.ratio) return `<a class="lc lc--text" href="${updatesHref(p.w.id)}" aria-label="${esc(label)}">${body(`<span class="lc__roomt">${esc(p.w.room)}</span>`, `<span class="lc__ex">${esc(p.excerpt)}</span>`)}</a>`;
      const [rw, rh] = p.ratio, hw = Math.min(1.5, Math.max(0.5, rh / rw)), iw = 600, ih = Math.round(iw * rh / rw);
      const src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(Art.draw({ ...p.w, scribble: "" }, p.frame));
      return `<a class="lc" href="${updatesHref(p.w.id)}" aria-label="${esc(label)}"><span class="lc__img" style="aspect-ratio:1 / ${hw.toFixed(3)}"><img src="${src}" alt="${esc(`${p.title}, ${t.image}`)}" width="${iw}" height="${ih}"${i < 4 ? "" : ' loading="lazy"'} decoding="async"><span class="lc__room">${esc(p.w.room)}</span></span>${body("", "")}</a>`;
    }
    paint() {
      const t = TEXT[lang], pick = posts.filter((p) => state.matches(p));
      this.n.textContent = pick.length;
      this.more.hidden = pick.length <= shown;
      if (!pick.length) {
        this.el.innerHTML = `<p class="none">${esc(t.none(state.q.trim()))} <button type="button">${esc(t.clear)}</button></p>`;
        $("button", this.el).addEventListener("click", () => state.set((s) => { s.q = ""; s.ranks.clear(); s.rooms.clear(); s.genres.clear(); }));
        this.el.style.height = "";
        return;
      }
      this.el.innerHTML = pick.slice(0, shown).map((p, i) => this.card(p, i)).join("");
      this.grid.layout();
    }
  }

  stickTop();
  new ActiveChips(state); new SearchBar(state); new RankMenu(state); new RoomTabs(state); new FilterPanel(state, { rail: false });
  const feed = new LogFeed();

  function applyLang(next) {
    lang = next === "th" ? "th" : "en";
    const t = TEXT[lang];
    document.documentElement.lang = lang;
    document.title = `${t.title} · Hamster Nest`;
    document.querySelectorAll("[data-t]").forEach((el) => { el.textContent = t[el.dataset.t]; });
    const q = $("#q"); q.placeholder = t.search; q.setAttribute("aria-label", t.searchLabel);
    document.querySelectorAll(".glang button").forEach((b) => b.setAttribute("aria-pressed", String((b.textContent.trim() === "ไทย") === (lang === "th"))));
    try { localStorage.setItem("nest-lang", lang); } catch (e) {}
    feed.paint();
  }
  document.querySelectorAll(".glang button").forEach((b) => b.addEventListener("click", () => applyLang(b.textContent.trim() === "ไทย" ? "th" : "en")));

  let saved = "en"; try { saved = localStorage.getItem("nest-lang") || "en"; } catch (e) {}
  applyLang(saved);
})();
