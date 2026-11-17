// Home v6: hero showcase, tier shelves, tier rail and hover previews.
// Data comes from works.js (window.NEST), pictures from art.js (window.Art).
(function () {
  "use strict";
  const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (sel, root = document) => root.querySelector(sel);
  const pad = (n) => String(n).padStart(2, "0");

  // ---------- previews: what plays when you hover a card ----------
  // A work with a video plays it; anything else flips through its pictures like a short clip.
  class FramePreview {
    constructor(box, work) {
      this.box = box; this.work = work; this.i = 0; this.timer = 0;
      this.layer = document.createElement("div"); this.layer.className = "pv"; box.appendChild(this.layer);
    }
    start() {
      if (calm) { Art.fill(this.layer, this.work, 1); this.layer.classList.add("pv--on"); return; }
      const step = () => { this.i = (this.i % (this.work.frames - 1)) + 1; Art.fill(this.layer, this.work, this.i); this.layer.classList.add("pv--on"); };
      step(); this.timer = setInterval(step, 700);
    }
    stop() { clearInterval(this.timer); this.layer.classList.remove("pv--on"); this.i = 0; }
  }
  class VideoPreview {
    constructor(box, work) {
      this.v = Object.assign(document.createElement("video"), { src: work.video, muted: true, loop: true, playsInline: true, preload: "none", className: "pv" });
      box.appendChild(this.v);
    }
    start() { this.v.classList.add("pv--on"); if (!calm) this.v.play().catch(() => {}); }
    stop() { this.v.pause(); this.v.classList.remove("pv--on"); }
  }
  const previewFor = (box, work) => (work.video ? new VideoPreview(box, work) : new FramePreview(box, work));

  // ---------- one card on a shelf ----------
  class WorkCard {
    constructor(work, size) { this.work = work; this.size = size; }
    render() {
      const w = this.work, a = document.createElement("a");
      a.href = "#"; a.className = `card card--${this.size}`;
      a.innerHTML = `<div class="card__pic"><div class="cv"></div><span class="card__play" aria-hidden="true"><svg viewBox="0 0 10 10"><path d="M2 1l7 4-7 4z" fill="currentColor"/></svg>Preview</span></div>
        <div class="card__txt"><strong>${w.name}</strong><p>${w.blurb}</p><span>${w.room} · ${w.genre} · by ${w.maker}</span></div>`;
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
        <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3 5h14M6 10h8M8.5 15h3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>Filters<b hidden></b></button>
        <div class="flt__box" id="flt-box" role="dialog" aria-label="Filter works" hidden><div class="flt__tabs" role="tablist"></div><div class="flt__genres"></div>
        <div class="flt__foot"><button type="button" class="flt__clear">Clear all</button><button type="button" class="b b--sm flt__show"></button></div></div></div>`);
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
      tabs.innerHTML = ["All", ...Object.keys(this.rooms)].map((r) => `<button type="button" role="tab" aria-selected="${r === f.room}" data-room="${r}">${r}</button>`).join("");
      tabs.querySelectorAll("button").forEach((b) => b.addEventListener("click", () => f.setRoom(b.dataset.room)));
      if (f.room === "All") list.innerHTML = `<p class="flt__hint">Pick a room to see its genres.</p>`;
      else {
        list.innerHTML = this.rooms[f.room].map((g) => {
          const n = this.all.filter((w) => w.room === f.room && w.genre === g).length;
          return `<label class="flt__ck"><input type="checkbox" value="${g}"${f.genres.has(g) ? " checked" : ""}><span>${g}</span><em>${n}</em></label>`;
        }).join("");
        list.querySelectorAll("input").forEach((i) => i.addEventListener("change", () => f.toggle(i.value)));
      }
      const n = this.all.filter((w) => f.matches(w)).length, badge = $("b", this.btn);
      badge.hidden = !f.active; badge.textContent = f.active;
      $(".flt__show", this.root).textContent = `Show ${n} work${n === 1 ? "" : "s"}`;
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
      s.innerHTML = `<header class="tier__head"><h2><i class="gem" aria-hidden="true"></i>${this.tier.name} tier</h2><p>${this.tier.note}</p></header><div class="tier__grid"></div>`;
      this.el = s; this.grid = $(".tier__grid", s); this.fill();
      return s;
    }
    fill() {
      const shown = this.works.filter((w) => this.filter.matches(w));
      this.grid.innerHTML = "";
      this.el.classList.toggle("tier--empty", !shown.length);
      if (!shown.length) {
        this.grid.innerHTML = `<p class="tier__none">Nothing in ${this.tier.name} matches yet. <button type="button">Clear the filters</button></p>`;
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
        a.innerHTML = `<span class="rail__bar"><i></i></span><span class="rail__name">${$("h2", s).textContent.replace(" tier", "")}</span><span class="rail__n">${pad(i + 1)}</span>`;
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
    constructor(root, works) {
      this.root = root; this.works = works; this.w = 0; this.f = 0; this.paused = false; this.busy = false;
      this.bg = $(".hero__bg", root); this.track = $(".strip__track", root); this.picker = $(".hero__pick", root);
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
      const w = this.work, t = $(".hero__text", this.root);
      if (animate && !calm) { t.classList.remove("in"); void t.offsetWidth; t.classList.add("in"); }
      $(".tag", t).textContent = `Platinum · ${w.room}`;
      $("h1", t).textContent = w.name;
      $("p", t).textContent = w.blurb;
      $(".hero__hi", t).textContent = `Say hi to ${w.maker}`;
      this.paintBg(animate); this.paintStrip();
      // the three other works, ready to pick
      this.picker.innerHTML = "";
      this.works.forEach((o, i) => {
        if (i === wi) return;
        const b = document.createElement("button");
        b.type = "button"; b.className = "pick";
        b.innerHTML = `<span class="cv"></span><span><small>Best of ${o.room}</small>${o.name}</span>`;
        Art.fill($(".cv", b), o);
        b.addEventListener("click", () => this.show(i));
        this.picker.appendChild(b);
      });
    }
    paintBg(animate) {
      const layer = document.createElement("div");
      layer.className = "hero__layer"; Art.fill(layer, this.work, this.f);
      this.bg.appendChild(layer);
      requestAnimationFrame(() => layer.classList.add("on"));
      const old = [...this.bg.children].slice(0, -1);
      setTimeout(() => old.forEach((o) => o.remove()), animate && !calm ? 900 : 0);
      $(".count b", this.root).textContent = pad(this.f + 1);
      $(".count span", this.root).textContent = pad(this.work.frames);
      $(".count i", this.root).style.setProperty("--p", (this.f + 1) / this.work.frames);
    }
    paintStrip() {
      const n = this.work.frames;
      this.track.style.transition = "none"; this.track.style.transform = "translateX(0)";
      this.track.innerHTML = "";
      for (let k = 1; k <= 4; k++) {
        const fi = (this.f + k) % n, c = document.createElement("button");
        c.type = "button"; c.className = "strip__card"; c.dataset.f = fi; c.setAttribute("aria-label", `Picture ${fi + 1} of ${n}`);
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

  // ---------- wire it up ----------
  const { tiers, rooms, works, inTier, hero } = window.NEST;
  const list = $("#tiers"), filter = new WorkFilter();
  const sections = tiers.map((t, i) => { const s = new TierShelf(t, inTier(t.id), i < 2, filter).render(); list.appendChild(s); return s; });
  new FilterPanel($(".tier__head", sections[0]), filter, rooms, works);
  const rail = new TierRail($("#rail"), sections);
  filter.addEventListener("change", () => rail.update());
  new HeroShowcase($("#hero"), hero());
})();
