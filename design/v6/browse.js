// Browse page: search, rank menu, room tabs, filter panel, results grid with hover-to-expand previews.
// State lives in BrowseState; every view listens to its "change" event and redraws itself.
(function () {
  "use strict";
  const { tiers, rooms, works } = window.NEST;
  const $ = (s, r = document) => r.querySelector(s);
  const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const ROOM_NAMES = Object.keys(rooms);
  // words on Browse, also used by the Dev logs page and the home page's Browse (lang.js).
  // Room and genre labels come from L.room / L.genre; tier names and every work's own text are printed as written.
  const L = window.NestLang, tx = (k, v) => L.t(k, v);
  L.add({
    en: {
      "br.title": "Browse Hamster projects", "br.filter": "Filter", "br.filters": "Filters", "br.rooms": "Rooms", "br.rank": "Rank", "br.allRanks": "All ranks",
      "br.all": "All projects", "br.sorted": "Sorted by", "br.sort": "Sort projects", "br.s.rank": "most updates", "br.s.az": "name, A to Z", "br.s.maker": "maker, A to Z",
      "br.clearAll": "Clear all", "br.room": "Room", "br.genre": "Genre", "br.hint": "Pick a room above to see its genres.",
      "br.none": "Nothing matches that yet.", "br.clearF": "Clear the filters",
    },
    th: {
      "br.title": "สำรวจผลงานของ Hamster", "br.filter": "ตัวกรอง", "br.filters": "ตัวกรอง", "br.rooms": "ห้อง", "br.rank": "อันดับ", "br.allRanks": "ทุกอันดับ",
      "br.all": "ผลงานทั้งหมด", "br.sorted": "เรียงตาม", "br.sort": "เรียงผลงาน", "br.s.rank": "อัปเดตบ่อยสุด", "br.s.az": "ชื่อ A ถึง Z", "br.s.maker": "ผู้สร้าง A ถึง Z",
      "br.clearAll": "ล้างทั้งหมด", "br.room": "ห้อง", "br.genre": "แนว", "br.hint": "เลือกห้องด้านบนเพื่อดูแนวของห้องนั้น",
      "br.none": "ยังไม่มีผลงานที่ตรงกับที่เลือก", "br.clearF": "ล้างตัวกรอง",
    },
  });
  const RANK_INK = { platinum: "#3550A8", diamond: "#1E93C2", gold: "#C08A12", silver: "#7A8794", bronze: "#B0602F" };

  // ---------- state ----------
  class BrowseState extends EventTarget {
    constructor(o = {}) {
      super(); this.items = o.items || works; this.of = o.of || ((w) => w); this.text = o.text || ((w) => `${w.name} ${w.blurb} ${w.maker} ${w.genre} ${w.room}`);
      this.q = ""; this.tab = "All"; this.sort = "rank"; this.ranks = new Set(); this.rooms = new Set(); this.genres = new Set(); this.reveal = false; }
    set(fn) { fn(this); this.dispatchEvent(new Event("change")); }
    setTab(tab) { this.set((s) => { s.tab = tab; s.rooms.clear(); s.genres.clear(); }); }
    toggle(setName, v) { this.set((s) => { s.reveal = false; const set = s[setName]; set.has(v) ? set.delete(v) : set.add(v); if (setName === "rooms") s.dropOrphanGenres(); }); }
    // the rank menu (All ranks button) is the only thing that plays the rank reveal (owner, 26 Nov 2026);
    // ticking ranks in the filter changes the results without it
    onlyRank(id, reveal = false) { this.set((s) => { s.ranks.clear(); if (id) s.ranks.add(id); s.reveal = reveal && !!id; }); }
    clear() { this.set((s) => { s.ranks.clear(); s.rooms.clear(); s.genres.clear(); }); }
    // the rooms whose genres can be picked right now
    get genreRooms() { return this.tab === "All" ? ROOM_NAMES.filter((r) => this.rooms.has(r)) : [this.tab]; }
    dropOrphanGenres() { const ok = new Set(this.genreRooms.flatMap((r) => rooms[r])); [...this.genres].forEach((g) => !ok.has(g) && this.genres.delete(g)); }
    get active() { return this.ranks.size + this.rooms.size + this.genres.size; }
    matches(x, ignore = "") {
      const q = this.q.trim().toLowerCase(), w = this.of(x);
      if (q && !this.text(x).toLowerCase().includes(q)) return false;
      if (this.tab !== "All" && w.room !== this.tab) return false;
      if (ignore !== "ranks" && this.ranks.size && !this.ranks.has(w.tier)) return false;
      if (ignore !== "rooms" && this.tab === "All" && this.rooms.size && !this.rooms.has(w.room)) return false;
      if (ignore !== "genres" && this.genres.size && !this.genres.has(w.genre)) return false;
      return true;
    }
    count(test, ignore) { return this.items.filter((x) => this.matches(x, ignore) && test(this.of(x))).length; }
  }

  // ---------- search bar ----------
  class SearchBar {
    constructor(state, onEnter = null) {
      const hs = window.NestSession && NestSession.search; if (!hs) return;
      const input = hs.input;
      input.addEventListener("input", () => state.set((s) => (s.q = input.value)));
      state.addEventListener("change", () => { if (input.value !== state.q) { input.value = state.q; hs.paint(); } });
      hs.onSubmit = (q) => { if (onEnter) onEnter(q); };
      const q0 = new URLSearchParams(location.search).get("q");
      if (q0) { input.value = q0; hs.paint(); state.set((s) => (s.q = q0)); }
    }
  }

  // ---------- rank menu at the right end of the search bar ----------
  class RankMenu {
    constructor(state) {
      this.s = state; this.btn = $(".rank__btn"); this.menu = $(".rank__menu");
      this.btn.addEventListener("click", () => this.open(this.menu.hidden));
      document.addEventListener("click", (e) => { if (!this.menu.hidden && !e.composedPath().includes($(".rank"))) this.open(false); });
      document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !this.menu.hidden) { this.open(false); this.btn.focus(); } });
      state.addEventListener("change", () => this.paint());
      L.addEventListener("change", () => this.paint());
      this.paint();
    }
    open(on) { this.menu.hidden = !on; this.btn.setAttribute("aria-expanded", on); if (on) $("li[aria-selected='true']", this.menu)?.focus(); }
    paint() {
      const r = this.s.ranks, label = r.size === 0 ? tx("br.allRanks") : r.size === 1 ? tiers.find((t) => r.has(t.id)).name : tx("br.rank"); // two or more: no count, no name
      // one rank: its name with its gem; two or more: a plain "Rank"
      $("span", this.btn).innerHTML = r.size === 1 ? `<i class="gem-ico" style="--ri:${RANK_INK[[...r][0]]}"></i>${label}` : label;
      this.btn.style.setProperty("--ri", r.size === 1 ? RANK_INK[[...r][0]] : "currentColor");
      const opts = [{ id: "", name: tx("br.allRanks") }, ...tiers];
      this.menu.innerHTML = opts.map((t) => `<li role="option" tabindex="-1" data-id="${t.id}" aria-selected="${t.id ? r.size === 1 && r.has(t.id) : r.size === 0}">${t.id ? `<i style="--ri:${RANK_INK[t.id]}"></i>` : ""}${t.name}</li>`).join("");
      this.menu.querySelectorAll("li").forEach((li) => {
        const pick = () => { this.s.onlyRank(li.dataset.id, true); this.open(false); this.btn.focus(); };
        li.addEventListener("click", pick); li.addEventListener("keydown", (e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), pick()));
      });
    }
  }

  // ---------- dark picture tabs under the search bar ----------
  class RoomTabs {
    constructor(state) {
      this.s = state; this.el = $(".rooms");
      const cover = { All: "burrow-knights", Game: "seed-dash", Web: "nestboard", IoT: "wheelsense", Idea: "sunflower-bank" };
      ["All", "Game", "Web", "IoT", "Idea"].forEach((r) => {
        const b = document.createElement("button");
        b.type = "button"; b.className = "room"; b.dataset.room = r;
        b.innerHTML = `<span class="room__art" aria-hidden="true">${Art.draw(works.find((w) => w.id === cover[r]))}</span><span class="room__name">${r === "All" ? tx("br.all") : L.room(r)}</span>`;
        b.addEventListener("click", () => state.setTab(r));
        this.el.appendChild(b);
      });
      state.addEventListener("change", () => this.paint()); L.addEventListener("change", () => this.paint()); this.paint();
    }
    paint() {
      this.el.querySelectorAll(".room").forEach((b) => b.setAttribute("aria-pressed", b.dataset.room === this.s.tab));
      this.el.querySelectorAll(".room").forEach((b) => { $(".room__name", b).textContent = b.dataset.room === "All" ? tx("br.all") : L.room(b.dataset.room); });
    }
  }

  // ---------- filter panel: rank, then room (only under All), then genres of the chosen rooms ----------
  class FilterPanel {
    constructor(state, o = {}) {
      this.s = state; this.el = $("#fpanel"); this.btn = $(".fbtn");
      this.btn.addEventListener("click", () => this.open(this.el.hidden));
      state.addEventListener("change", () => this.paint()); L.addEventListener("change", () => this.paint()); this.paint();
      this.busy = false;
      // computers (owner, 25 Nov 2026, option B): the panel is always open, in a rail on the screen's left edge
      // that runs the height of Browse; the works go three a row. Smaller screens keep the Filter button.
      this.home = this.el.parentElement;
      this.rail = document.createElement("div"); this.rail.className = "frail";
      if (o.rail === false) { this.btn.setAttribute("aria-expanded", false); return; }
      const desk = matchMedia("(min-width: 1101px)"), place = () => this.place(desk.matches);
      desk.addEventListener("change", place); place();
    }
    place(rail) {
      window.Grid && window.Grid.collapse(false);
      if (rail) {
        this.el.closest(".br").prepend(this.rail); this.rail.append(this.el);
        this.el.hidden = false; document.body.classList.remove("has-panel"); document.body.classList.add("has-rail");
      } else {
        this.home.prepend(this.el); this.rail.remove();
        this.el.hidden = true; document.body.classList.remove("has-rail", "has-panel");
      }
      this.btn.setAttribute("aria-expanded", rail);
    }
    // Opening: the panel slides in from the left while the tiles re-flow from 4 to 3 a row (FLIP).
    // Closing: the panel slides out first, then the tiles re-flow back to 4. Each step waits on Animation.finished.
    async open(on) {
      if (this.busy || on === !this.el.hidden || document.body.classList.contains("has-rail")) return;
      this.busy = true; this.btn.setAttribute("aria-expanded", on);
      window.Grid && window.Grid.collapse(false);
      const grid = $(".grid");
      if (on) {
        const before = grid && Flip.read(grid);
        this.el.hidden = false; document.body.classList.add("has-panel");
        if (!calm) {
          await Promise.all([
            this.el.animate([{ opacity: 0, transform: "translateX(-28px)", clipPath: "inset(0 100% 0 0 round 14px)" }, { opacity: 1, transform: "none", clipPath: "inset(0 0 0 0 round 14px)" }], { duration: 460, easing: EASE }).finished,
            grid && Flip.play(grid, before, 460),
            this.stagger(),
          ]);
        }
      } else {
        if (!calm) await this.el.animate([{ opacity: 1, transform: "none", clipPath: "inset(0 0 0 0 round 14px)" }, { opacity: 0, transform: "translateX(-20px)", clipPath: "inset(0 100% 0 0 round 14px)" }], { duration: 280, easing: "cubic-bezier(.4,0,1,1)", fill: "forwards" }).finished;
        const before = grid && Flip.read(grid);
        this.el.getAnimations().forEach((a) => a.cancel());
        this.el.hidden = true; document.body.classList.remove("has-panel");
        if (!calm && grid) await Flip.play(grid, before, 460);
      }
      this.busy = false;
    }
    // the rows of the panel come in one after another
    stagger(nodes = this.el.querySelectorAll(".fp__head, section > h3, section > h4, .ck, .fp__hint")) {
      return Promise.all([...nodes].map((n, i) => n.animate([{ opacity: 0, transform: "translateX(-10px)" }, { opacity: 1, transform: "none" }], { duration: 300, delay: 60 + i * 18, easing: EASE, fill: "backwards" }).finished));
    }
    box(set, value, label, n, extra = "") {
      return `<label class="ck"><input type="checkbox" data-set="${set}" value="${value}"${this.s[set].has(value) ? " checked" : ""}>${extra}<span>${label}</span><em>${n}</em></label>`;
    }
    paint() {
      const s = this.s;
      let h = `<div class="fp__head"><h2>${tx("br.filters")}</h2><button type="button" class="fp__clear"${s.active ? "" : " disabled"}>${tx("br.clearAll")}</button></div>`;
      h += `<section><h3>${tx("br.rank")}</h3>${tiers.map((t) => this.box("ranks", t.id, t.name, s.count((w) => w.tier === t.id, "ranks"), `<i class="dot" style="--ri:${RANK_INK[t.id]}"></i>`)).join("")}</section>`;
      if (s.tab === "All") h += `<section><h3>${tx("br.room")}</h3>${ROOM_NAMES.map((r) => this.box("rooms", r, L.room(r), s.count((w) => w.room === r, "rooms"))).join("")}</section>`;
      const gr = s.genreRooms;
      h += `<section><h3>${tx("br.genre")}</h3>`;
      if (!gr.length) h += `<p class="fp__hint">${tx("br.hint")}</p>`;
      gr.forEach((r) => { h += `<div class="fp__group" data-g="${r}">${gr.length > 1 || s.tab === "All" ? `<h4>${L.room(r)}</h4>` : ""}${rooms[r].map((g) => this.box("genres", g, L.genre(g), s.count((w) => w.room === r && w.genre === g, "genres"))).join("")}</div>`; });
      h += `</section>`;
      const had = new Set([...this.el.querySelectorAll(".fp__group")].map((g) => g.dataset.g)), focused = document.activeElement && this.el.contains(document.activeElement) ? document.activeElement.value : null;
      this.el.innerHTML = h;
      if (focused) { const f = this.el.querySelector(`input[value="${focused}"]`); f && f.focus({ preventScroll: true }); }
      if (!calm && !this.el.hidden) this.el.querySelectorAll(".fp__group").forEach((g) => { if (!had.has(g.dataset.g)) this.stagger(g.children); });
      this.el.querySelectorAll("input").forEach((i) => i.addEventListener("change", () => s.toggle(i.dataset.set, i.value)));
      $(".fp__clear", this.el).addEventListener("click", () => s.clear());
      const b = $("b", this.btn); b.hidden = !s.active; b.textContent = s.active;
    }
  }

  // ---------- one result card ----------
  const PLATFORM_ICON = {
    Windows: `<path d="M2 3.5l6-.9v5.9H2zM9 2.5l7-1v7H9zM2 9.5h6v5.9l-6-.9zM9 9.5h7v7l-7-1z"/>`,
    macOS: `<path d="M11.8 2.2c.1 1-.3 1.9-.9 2.5-.6.7-1.5 1.1-2.3 1-.1-.9.3-1.8.9-2.4.6-.7 1.5-1.1 2.3-1.1zM14.6 12.4c-.4.9-.6 1.3-1.1 2.1-.7 1.1-1.7 2.4-2.9 2.4-1.1 0-1.4-.7-2.8-.7-1.5 0-1.8.7-2.9.7-1.2 0-2.1-1.2-2.8-2.3-2-3-2.2-6.6-1-8.5.9-1.3 2.2-2.1 3.5-2.1 1.3 0 2.1.7 3.2.7 1 0 1.7-.7 3.2-.7 1.1 0 2.3.6 3.2 1.7-2.8 1.5-2.3 5.6.4 6.7z"/>`,
    Web: `<circle cx="9" cy="9" r="7" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M2 9h14M9 2c2.2 2.4 2.2 11.6 0 14M9 2c-2.2 2.4-2.2 11.6 0 14" fill="none" stroke="currentColor" stroke-width="1.3"/>`,
    Android: `<path d="M4 7h10v6.5c0 .8-.7 1.5-1.5 1.5H5.5C4.7 15 4 14.3 4 13.5zM4.2 6a4.8 4.8 0 019.6 0zM6.8 4.2l-1-1.6M11.2 4.2l1-1.6" stroke="currentColor" stroke-width="1" /><circle cx="7" cy="4.6" r=".6" fill="#fff"/><circle cx="11" cy="4.6" r=".6" fill="#fff"/>`,
    iOS: `<rect x="5" y="1.5" width="8" height="15" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M8 14h2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>`,
    ESP32: `<rect x="4.5" y="4.5" width="9" height="9" rx="1" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M7 2v2.5M11 2v2.5M7 13.5V16M11 13.5V16M2 7h2.5M2 11h2.5M13.5 7H16M13.5 11H16" stroke="currentColor" stroke-width="1.4"/>`,
    Arduino: `<rect x="2" y="4" width="14" height="10" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M5 7h3M10 7h3M5 11h8" stroke="currentColor" stroke-width="1.4"/>`,
    "Raspberry Pi": `<circle cx="9" cy="10" r="5.5" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M6 3.5c1.2.2 2.2.9 3 2 .8-1.1 1.8-1.8 3-2" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>`,
    "Pitch deck": `<rect x="2" y="3" width="14" height="9" rx="1" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M9 12v3M6 16h6M5 9l2.5-2.5 2 2L13 5" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>`,
  };
  // the gem used on flags and in the player
  // tile, FLIP and hover-to-expand live in tiles.js (shared with the project page)
  const { ResultCard, Flip, Preview, EASE } = window.Tiles;

  // ---------- card motion: staggered exit and entrance, each awaited through Animation.finished ----------
  // Only cards on or near the screen get the stagger; the rest move at once so long lists stay quick.
  const CardMotion = {
    targets(grid) {
      const vh = innerHeight, cards = [...grid.querySelectorAll(".rc")];
      let k = 0;
      return cards.map((c) => { const r = c.getBoundingClientRect(), near = r.bottom > -40 && r.top < vh + 40; return { c, i: near ? Math.min(k++, 11) : -1 }; });
    },
    play(grid, frames, o) {
      const anims = this.targets(grid).map(({ c, i }) => c.animate(frames, { duration: i < 0 ? 1 : o.duration, delay: i < 0 ? 0 : i * o.step, easing: o.easing, fill: "both" }));
      return Promise.all(anims.map((a) => a.finished.catch(() => {}))).then(() => anims);
    },
    exit(grid) {
      if (calm) return this.play(grid, [{ opacity: 1 }, { opacity: 0 }], { duration: 160, step: 0, easing: "linear" });
      // each card tips back, blurs and is wiped upward, left to right along the rows
      return this.play(grid, [
        { transform: "translateY(0) scale(1)", filter: "blur(0)", clipPath: "inset(0 0 0 0 round 16px)", opacity: 1 },
        { transform: "translateY(-14px) scale(.95)", filter: "blur(2px)", clipPath: "inset(0 0 22% 0 round 16px)", opacity: 1, offset: .55 },
        { transform: "translateY(-26px) scale(.92)", filter: "blur(8px)", clipPath: "inset(0 0 100% 0 round 16px)", opacity: 0 },
      ], { duration: 460, step: 38, easing: "cubic-bezier(.55,0,.7,.4)" });
    },
    enter(grid, quick = false) {
      if (quick) return this.play(grid, [
        { transform: "translateY(14px)", filter: "blur(4px)", opacity: 0 }, { transform: "none", filter: "blur(0)", opacity: 1 },
      ], { duration: 360, step: 22, easing: "cubic-bezier(.2,.8,.2,1)" });
      if (calm) return this.play(grid, [{ opacity: 0 }, { opacity: 1 }], { duration: 200, step: 0, easing: "linear" });
      // the new set rises from below, in the direction the old one left, unblurring as its wipe opens
      return this.play(grid, [
        { transform: "translateY(34px) scale(.95)", filter: "blur(8px)", clipPath: "inset(100% 0 0 0 round 16px)", opacity: 0 },
        { transform: "translateY(6px) scale(.99)", filter: "blur(1px)", clipPath: "inset(12% 0 0 0 round 16px)", opacity: 1, offset: .6 },
        { transform: "translateY(0) scale(1)", filter: "blur(0)", clipPath: "inset(0 0 0 0 round 16px)", opacity: 1 },
      ], { duration: 620, step: 46, easing: "cubic-bezier(.2,.8,.2,1)" });
    },
  };

  // ---------- results: four to a row, three when the filter panel is open ----------
  // A rank change never repaints at once. activeRank is what is on screen; pendingRank is the latest choice.
  // Order: exit the old cards -> (one rank: the reveal covers the screen) -> swap to the latest state -> entrance -> idle.
  // Choices made meanwhile only update pendingRank; the loop takes the newest one when it reaches the swap.
  const rankKey = (s) => [...s.ranks].sort().join(",");
  class ResultGrid {
    constructor(state) {
      this.s = state; this.grid = $(".grid"); this.n = $(".count"); this.t = $(".rhead__t");
      this.activeRank = rankKey(state); this.pendingRank = this.activeRank; this.busy = false;
      this.ex = new Preview(this.grid); window.Grid = this.ex;
      state.addEventListener("change", () => this.onChange());
      L.addEventListener("change", () => { if (!this.busy) this.paint(true); });
      this.paint();
    }
    onChange() {
      this.pendingRank = rankKey(this.s);
      if (this.busy) return;                                          // the running transition reads the newest state at its swap
      if (this.pendingRank === this.activeRank) {                       // not a rank change: show it straight away, with a short rise-in
        if (this.paint() && !calm) CardMotion.enter(this.grid, true);
        return;
      }
      this.transition();
    }
    async transition() {
      this.busy = true; this.grid.classList.add("grid--busy");
      try {
        while (this.pendingRank !== this.activeRank) {
          const one = this.s.ranks.size === 1 ? [...this.s.ranks][0] : "";
          await CardMotion.exit(this.grid);                         // 1. old set leaves; it stays in the DOM until this resolves
          let revealed = "";
          if (one && this.s.reveal && window.RankReveal.has(one)) {   // 2. one rank picked from the rank menu: the reveal covers the screen
            revealed = one; await window.RankReveal.enter(one, this.tierName(one));
            const now = this.s.ranks.size === 1 ? [...this.s.ranks][0] : "";
            if (now && now !== revealed) { revealed = now; await window.RankReveal.retitle(now, this.tierName(now)); }
          }
          this.activeRank = rankKey(this.s);                          // 3. swap to whatever is chosen now
          this.paint(true);                                           //    (enter() starts in the same task, so its first frame is what paints: no flash)
          const entering = CardMotion.enter(this.grid);               // 4. new set comes in as the reveal lifts away
          await Promise.all([entering, revealed ? window.RankReveal.leave() : null]);
          this.pendingRank = rankKey(this.s);                         // 5. another choice arrived meanwhile? go round again
        }
      } finally {
        // every entrance has ended on its resting frame, which is also the card's normal style, so dropping them changes nothing
        this.grid.querySelectorAll(".rc").forEach((c) => c.getAnimations().forEach((a) => a.cancel()));
        this.busy = false; this.grid.classList.remove("grid--busy");
        this.paint();                                                // settle on the current state (also any non-rank change made meanwhile)
      }
    }
    tierName(id) { return tiers.find((t) => t.id === id).name; }
    paint(force = false) {
      if (this.ex) this.ex.collapse(false);
      const shown = sortWorks(works.filter((w) => this.s.matches(w)), this.s.sort), sig = shown.map((w) => w.id).join("|");
      if (!force && sig === this.sig && this.grid.childElementCount) return false; // same set already on screen
      this.sig = sig;
      this.n.textContent = shown.length;
      this.t.textContent = this.s.tab === "All" ? tx("br.all") : L.room(this.s.tab);
      this.grid.innerHTML = "";
      if (!shown.length) {
        this.grid.innerHTML = `<p class="none">${tx("br.none")} <button type="button">${tx("br.clearF")}</button></p>`;
        $("button", this.grid).addEventListener("click", () => { this.s.set((s) => { s.q = ""; s.ranks.clear(); s.rooms.clear(); s.genres.clear(); }); });
        return true;
      }
      shown.forEach((w) => this.grid.appendChild(new ResultCard(w).render()));
      return true;
    }
  }

  // ---------- sort ----------
  const sortWorks = (list, by) => by === "az" ? [...list].sort((a, b) => a.name.localeCompare(b.name))
    : by === "maker" ? [...list].sort((a, b) => a.maker.localeCompare(b.maker) || a.name.localeCompare(b.name)) : list;

  // ---------- page chrome: count in the heading, sort box, white frame on the bar and toolbar once they stick ----------
  class Chrome {
    constructor(state) {
      const sort = $("#sort"); sort.addEventListener("change", () => state.set((s) => (s.sort = sort.value)));
      stickTop();
    }
  }
  function stickTop() {
    const gbar = $(".gbar"), bar = gbar || $(".site-header"), top = $(".br__top"), stick = $(".br__stick") || top;
    new IntersectionObserver(([e]) => { top.classList.toggle("is-stuck", !e.isIntersecting); stick.classList.toggle("is-stuck", !e.isIntersecting); if (gbar && !gbar.classList.contains("gbar--hero")) gbar.classList.toggle("gbar--framed", !e.isIntersecting); },
      { rootMargin: `-${bar.offsetHeight + 1}px 0px 0px 0px` }).observe($(".br__sentinel"));
    const pin = () => { stick.style.top = bar.offsetHeight + "px"; document.documentElement.style.setProperty("--bar-h", bar.offsetHeight + "px"); }; pin(); addEventListener("resize", pin);
  }

  window.BrowseKit = { BrowseState, SearchBar, RankMenu, RoomTabs, FilterPanel, stickTop };
  if (!$(".grid")) return;

  const state = new BrowseState();
  new Chrome(state);
  const hero = $(".gbar--hero"), page = $("#browse-page");
  new SearchBar(state, hero && page ? () => scrollTo({ top: page.getBoundingClientRect().top + scrollY - hero.offsetHeight, behavior: calm ? "auto" : "smooth" }) : null); new RankMenu(state); new RoomTabs(state); new FilterPanel(state); new ResultGrid(state);

  // #browse-game, #browse-iot ... (footer "Rooms" links, the project page's room tag) open Browse on that room
  const fromHash = () => {
    const m = location.hash.match(/^#browse-(\w+)$/), room = m && ROOM_NAMES.find((r) => r.toLowerCase() === m[1]);
    if (room && room !== state.tab) state.setTab(room);
  };
  fromHash(); addEventListener("hashchange", fromHash);
})();
