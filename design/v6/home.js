// Home v6: hero showcase, tier shelves, tier rail and hover previews.
// Data comes from works.js (window.NEST), pictures from art.js (window.Art).
(function () {
  "use strict";
  const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (sel, root = document) => root.querySelector(sel);
  const pad = (n) => String(n).padStart(2, "0");

  // words on this page (lang.js); tier names and every work's own text are printed as written; room and genre labels come from L.room / L.genre
  const L = window.NestLang, t = (k, v) => L.t(k, v);
  L.add({
    en: {
      "home.see": "See the project", "home.say": "“High schoolers can do all this!?”", "home.statement": "Statement",
      "home.heroAria": "Best of the Platinum tier", "home.prev": "Previous work", "home.next": "Next work", "home.tiers": "Tiers",
      "tier.all": "See all {n}", "tier.how": "How ranking works", "filters": "Filters",
      "home.hi": "Say hi to {name}", "home.work": "{name}, work {i} of {n}", "home.pic": "Picture {i} of {n}", "home.preview": "Preview",
      "home.f.aria": "Filter works", "home.f.all": "All", "home.f.hint": "Pick a room to see its genres.", "home.f.clear": "Clear all",
      "home.f.show1": "Show {n} work", "home.f.showN": "Show {n} works",
      "home.none": "Nothing in {tier} matches yet.", "home.clearF": "Clear the filters",
    },
    th: {
      "home.see": "ดูผลงาน", "home.say": "“เด็ก ม.ปลาย ทำได้ขนาดนี้เลยเหรอ!?”", "home.statement": "ข้อความเด่น",
      "home.heroAria": "ผลงานเด่นของระดับ Platinum", "home.prev": "ผลงานก่อนหน้า", "home.next": "ผลงานถัดไป", "home.tiers": "ระดับ",
      "tier.all": "ดูทั้งหมด {n} ชิ้น", "tier.how": "จัดอันดับยังไง", "filters": "ตัวกรอง",
      "home.hi": "ทักทาย {name}", "home.work": "{name} ผลงานที่ {i} จาก {n}", "home.pic": "รูปที่ {i} จาก {n}", "home.preview": "ดูตัวอย่าง",
      "home.f.aria": "กรองผลงาน", "home.f.all": "ทั้งหมด", "home.f.hint": "เลือกห้องเพื่อดูแนวของห้องนั้น", "home.f.clear": "ล้างทั้งหมด",
      "home.f.show1": "ดูผลงาน {n} ชิ้น", "home.f.showN": "ดูผลงาน {n} ชิ้น",
      "home.none": "ยังไม่มีผลงานใน {tier} ที่ตรงกับตัวกรอง", "home.clearF": "ล้างตัวกรอง",
    },
  });

  const previewFor = window.Previews.for; // shared with the browse page (preview.js)

  // ---------- one card on a shelf ----------
  class WorkCard {
    constructor(work, size) { this.work = work; this.size = size; }
    render() {
      const w = this.work, a = document.createElement("a");
      a.href = "#"; a.className = `card card--${this.size}`;
      a.innerHTML = `<div class="card__pic"><div class="cv"></div><span class="card__play" aria-hidden="true"><svg viewBox="0 0 10 10"><path d="M2 1l7 4-7 4z" fill="currentColor"/></svg>${t("home.preview")}</span></div>
        <div class="card__txt"><strong>${w.name}</strong><span>${L.room(w.room)} · ${L.genre(w.genre)}</span></div>`;
      Art.fill($(".cv", a), w);
      const pv = previewFor($(".card__pic", a), w);
      a.addEventListener("pointerenter", () => pv.start());
      a.addEventListener("pointerleave", () => pv.stop());
      a.addEventListener("focus", () => pv.start());
      a.addEventListener("blur", () => pv.stop());
      return a;
    }
  }

  // ---------- filter: one room at a time, any of its genres ----------
  // Owns the state; shelves and the panel listen to "change".
  class WorkFilter extends EventTarget {
    constructor() { super(); this.room = "All"; this.genres = new Set(); }
    setRoom(room) { this.room = room; this.genres.clear(); this.emit(); }
    toggle(genre) { this.genres.has(genre) ? this.genres.delete(genre) : this.genres.add(genre); this.emit(); }
    clear() { this.room = "All"; this.genres.clear(); this.emit(); }
    get active() { return (this.room === "All" ? 0 : 1) + this.genres.size; }
    matches(w) { return (this.room === "All" || w.room === this.room) && (!this.genres.size || this.genres.has(w.genre)); }
    emit() { this.dispatchEvent(new Event("change")); }
  }

  // The Filters button beside the Platinum title, and the box it opens.
  class FilterPanel {
    constructor(host, filter, rooms, allWorks) {
      this.f = filter; this.rooms = rooms; this.all = allWorks;
      host.insertAdjacentHTML("beforeend", `<div class="flt"><button type="button" class="flt__btn" aria-expanded="false" aria-controls="flt-box">
        <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3 5h14M6 10h8M8.5 15h3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg><span data-i18n="filters">Filters</span><b hidden></b></button>
        <div class="flt__box" id="flt-box" role="dialog" aria-label="${t("home.f.aria")}" data-i18n-attr="aria-label:home.f.aria" hidden><div class="flt__tabs" role="tablist"></div><div class="flt__genres"></div>
        <div class="flt__foot"><button type="button" class="flt__clear" data-i18n="home.f.clear">${t("home.f.clear")}</button><button type="button" class="b b--sm flt__show"></button></div></div></div>`);
      this.root = $(".flt", host); this.btn = $(".flt__btn", this.root); this.box = $(".flt__box", this.root);
      this.btn.addEventListener("click", () => this.open(this.box.hidden));
      $(".flt__clear", this.root).addEventListener("click", () => filter.clear());
      $(".flt__show", this.root).addEventListener("click", () => { this.open(false); $("#tiers").scrollIntoView({ behavior: calm ? "auto" : "smooth" }); });
      document.addEventListener("click", (e) => { if (!this.box.hidden && !e.composedPath().includes(this.root)) this.open(false); });
      document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !this.box.hidden) { this.open(false); this.btn.focus(); } });
      filter.addEventListener("change", () => this.paint());
      this.paint();
    }
    open(on) { this.box.hidden = !on; this.btn.setAttribute("aria-expanded", on); }
    paint() {
      const f = this.f, tabs = $(".flt__tabs", this.root), list = $(".flt__genres", this.root);
      tabs.innerHTML = ["All", ...Object.keys(this.rooms)].map((r) => `<button type="button" role="tab" aria-selected="${r === f.room}" data-room="${r}">${r === "All" ? t("home.f.all") : L.room(r)}</button>`).join("");
      tabs.querySelectorAll("button").forEach((b) => b.addEventListener("click", () => f.setRoom(b.dataset.room)));
      if (f.room === "All") list.innerHTML = `<p class="flt__hint">${t("home.f.hint")}</p>`;
      else {
        list.innerHTML = this.rooms[f.room].map((g) => {
          const n = this.all.filter((w) => w.room === f.room && w.genre === g).length;
          return `<label class="flt__ck"><input type="checkbox" value="${g}"${f.genres.has(g) ? " checked" : ""}><span>${L.genre(g)}</span><em>${n}</em></label>`;
        }).join("");
        list.querySelectorAll("input").forEach((i) => i.addEventListener("change", () => f.toggle(i.value)));
      }
      const n = this.all.filter((w) => f.matches(w)).length, badge = $("b", this.btn);
      badge.hidden = !f.active; badge.textContent = f.active;
      $(".flt__show", this.root).textContent = t(n === 1 ? "home.f.show1" : "home.f.showN", { n });
    }
  }

  // ---------- a tier section ----------
  class TierShelf {
    constructor(tier, works, featured, filter) {
      this.tier = tier; this.works = works; this.featured = featured; this.filter = filter;
      filter.addEventListener("change", () => this.fill());
    }
    render() {
      const s = document.createElement("section");
      s.className = `tier${this.featured ? " tier--big" : ""}`; s.id = this.tier.id;
      s.style.setProperty("--tc", this.tier.color);
      s.dataset.name = this.tier.name;
      s.innerHTML = `<header class="tier__head tier__head--mark">${TierMarks.head(this.tier, this.works.length)}</header><div class="tier__grid"></div>`;
      this.el = s; this.grid = $(".tier__grid", s); this.fill();
      return s;
    }
    fill() {
      const shown = this.works.filter((w) => this.filter.matches(w));
      this.grid.innerHTML = "";
      this.el.classList.toggle("tier--empty", !shown.length);
      if (!shown.length) {
        this.grid.innerHTML = `<p class="tier__none">${t("home.none", { tier: this.tier.name })} <button type="button">${t("home.clearF")}</button></p>`;
        $("button", this.grid).addEventListener("click", () => this.filter.clear());
        return;
      }
      shown.forEach((w, i) => this.grid.appendChild(new WorkCard(w, this.featured && i === 0 ? "feat" : "std").render()));
    }
  }

  // ---------- the rail on the left that fills as you scroll ----------
  class TierRail {
    constructor(rail, sections) {
      this.sections = sections;
      this.items = sections.map((s, i) => {
        const a = document.createElement("a");
        a.href = "#" + s.id; a.className = "rail__item"; a.style.setProperty("--tc", s.style.getPropertyValue("--tc"));
        a.innerHTML = `<span class="rail__bar"><i></i></span><span class="rail__name">${s.dataset.name}</span><span class="rail__n">${pad(i + 1)}</span>`;
        rail.appendChild(a); return a;
      });
      addEventListener("scroll", () => this.update(), { passive: true });
      addEventListener("resize", () => this.update());
      this.update();
    }
    update() {
      const line = scrollY + innerHeight * 0.45;
      let active = 0;
      this.sections.forEach((s, i) => {
        const top = s.offsetTop, h = s.offsetHeight, f = Math.max(0, Math.min(1, (line - top) / h));
        this.items[i].style.setProperty("--fill", f.toFixed(3));
        if (line >= top) active = i;
      });
      this.items.forEach((a, i) => a.toggleAttribute("aria-current", i === active));
    }
  }

  // ---------- hero: one work on show, its pictures slide by as cards ----------
  class HeroShowcase {
    constructor(root, works, onWork = () => {}) {
      this.root = root; this.works = works; this.onWork = onWork; this.w = 0; this.f = 0; this.paused = false; this.busy = false;
      this.bg = $(".hero__bg", root); this.track = $(".strip__track", root); this.dots = $(".hero__dots", root);
      root.querySelectorAll(".hero__arrow").forEach((b) => b.addEventListener("click", () => this.show((this.w + +b.dataset.step + this.works.length) % this.works.length)));
      root.addEventListener("pointerenter", () => (this.paused = true));
      root.addEventListener("pointerleave", () => (this.paused = false));
      root.addEventListener("focusin", () => (this.paused = true));
      root.addEventListener("focusout", () => (this.paused = false));
      $(".strip", root).addEventListener("click", (e) => { const c = e.target.closest(".strip__card"); if (c) this.goFrame(+c.dataset.f); });
      this.show(0, false);
      if (!calm) setInterval(() => !this.paused && !document.hidden && this.next(), 3600);
    }
    get work() { return this.works[this.w]; }
    show(wi, animate = true) {
      this.w = wi; this.f = 0;
      this.onWork(this.work);
      const w = this.work, t = $(".hero__text", this.root);
      if (animate && !calm) { t.classList.remove("in"); void t.offsetWidth; t.classList.add("in"); }
      $("h1", t).textContent = w.name;
      $("p", t).textContent = w.blurb;
      $(".hero__hi", t).textContent = L.t("home.hi", { name: w.maker });
      this.paintBg(animate); this.paintStrip();
      this.dots.innerHTML = this.works.map((_, i) => `<i${i === wi ? ' class="on"' : ""}></i>`).join("");
      this.root.setAttribute("aria-label", L.t("home.work", { name: w.name, i: wi + 1, n: this.works.length }));
    }
    // the language changed: only the words move, not the pictures
    relabel() {
      const w = this.work;
      $(".hero__hi", this.root).textContent = L.t("home.hi", { name: w.maker });
      this.root.setAttribute("aria-label", L.t("home.work", { name: w.name, i: this.w + 1, n: this.works.length }));
      this.track.querySelectorAll(".strip__card").forEach((c) => c.setAttribute("aria-label", L.t("home.pic", { i: +c.dataset.f + 1, n: w.frames })));
    }
    paintBg(animate) {
      const layer = document.createElement("div");
      layer.className = "hero__layer"; Art.fill(layer, this.work, this.f);
      this.bg.appendChild(layer);
      requestAnimationFrame(() => layer.classList.add("on"));
      const old = [...this.bg.children].slice(0, -1);
      setTimeout(() => old.forEach((o) => o.remove()), animate && !calm ? 900 : 0);
    }
    paintStrip() {
      const n = this.work.frames;
      this.track.style.transition = "none"; this.track.style.transform = "translateX(0)";
      this.track.innerHTML = "";
      for (let k = 1; k <= 4; k++) {
        const fi = (this.f + k) % n, c = document.createElement("button");
        c.type = "button"; c.className = "strip__card"; c.dataset.f = fi; c.setAttribute("aria-label", L.t("home.pic", { i: fi + 1, n }));
        Art.fill(c, this.work, fi); this.track.appendChild(c);
      }
    }
    next() { this.goFrame((this.f + 1) % this.work.frames, true); }
    goFrame(fi, slide = false) {
      if (this.busy || fi === this.f) return;
      this.f = fi; this.paintBg(true);
      if (!slide || calm) { this.paintStrip(); return; }
      // slide the strip one card to the left, then rebuild it from the new frame
      this.busy = true;
      const step = this.track.firstElementChild.offsetWidth + 16;
      this.track.style.transition = "transform .7s cubic-bezier(.6,0,.2,1)";
      this.track.style.transform = `translateX(${-step}px)`;
      setTimeout(() => { this.paintStrip(); this.busy = false; }, 720);
    }
  }

  // ---------- the page colour: the work on show in the hero, then each tier's colour ----------
  class Ambience {
    constructor(hero, sections, tiers) {
      this.hero = hero; this.sections = sections; this.tiers = tiers; this.heroTone = { bg: "#0B0B0F", acc: "#F5F5F7" };
      addEventListener("scroll", () => this.update(), { passive: true });
    }
    setHeroTone(c) { this.heroTone = c; this.update(); }
    update() {
      const line = scrollY + innerHeight * 0.45;
      let tone = this.heroTone.bg, acc = this.heroTone.acc;
      // in the tier area the colour is painted on the page itself (TierBackdrop), so the fixed layer goes dark
      this.sections.forEach((s, i) => { if (line >= s.offsetTop) { tone = "#0B0B0F"; acc = this.tiers[i].color; } });
      const r = document.documentElement.style;
      r.setProperty("--tone", tone); r.setProperty("--acc", acc);
    }
  }

  // ---------- tier colours painted down the page, each fading into the next as you scroll ----------
  class TierBackdrop {
    constructor(shelf, sections, tiers) {
      this.shelf = shelf; this.sections = sections; this.tiers = tiers;
      this.el = document.createElement("div"); this.el.className = "tierbg"; this.el.setAttribute("aria-hidden", "true");
      document.body.appendChild(this.el);
      const redo = () => this.paint();
      addEventListener("resize", redo); addEventListener("load", redo);
      new ResizeObserver(redo).observe(shelf);
      this.paint();
    }
    paint() {
      const top = this.shelf.offsetTop - 260, h = this.shelf.offsetHeight + 520;
      const pct = (y) => (((y - top) / h) * 100).toFixed(2) + "%";
      const col = (c) => `color-mix(in oklab, ${c} 34%, transparent)`;
      const stops = ["transparent 0%"];
      this.sections.forEach((s, i) => {
        const c = col(this.tiers[i].color);
        stops.push(`${c} ${pct(s.offsetTop + 120)}`, `${c} ${pct(s.offsetTop + s.offsetHeight * 0.55)}`);
      });
      stops.push("transparent 100%");
      Object.assign(this.el.style, { top: top + "px", height: h + "px", background: `linear-gradient(180deg, ${stops.join(", ")})` });
    }
  }

  // ---------- wire it up ----------
  const { tiers, rooms, works, inTier, hero } = window.NEST;
  const list = $("#tiers"), filter = new WorkFilter();
  const sections = tiers.map((t, i) => { const s = new TierShelf(t, inTier(t.id), true, filter).render(); list.appendChild(s); return s; });
  new FilterPanel($(".tier__head", sections[0]), filter, rooms, works);
  const rail = new TierRail($("#rail"), sections);
  filter.addEventListener("change", () => rail.update());
  new TierBackdrop($(".shelf"), sections, tiers);
  const amb = new Ambience($("#hero"), sections, tiers);
  const showcase = new HeroShowcase($("#hero"), hero(), (w) => amb.setHeroTone(Art.tone(w)));
  L.addEventListener("change", () => { showcase.relabel(); filter.emit(); });
})();
