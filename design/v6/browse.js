// Browse page: search, rank menu, room tabs, filter panel, results grid with hover-to-expand previews.
// State lives in BrowseState; every view listens to its "change" event and redraws itself.
(function () {
  "use strict";
  const { tiers, rooms, works } = window.NEST;
  const $ = (s, r = document) => r.querySelector(s);
  const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const ROOM_NAMES = Object.keys(rooms);
  const RANK_INK = { platinum: "#3550A8", diamond: "#1E93C2", gold: "#C08A12", silver: "#7A8794", bronze: "#B0602F" };

  // ---------- state ----------
  class BrowseState extends EventTarget {
    constructor() { super(); this.q = ""; this.tab = "All"; this.ranks = new Set(); this.rooms = new Set(); this.genres = new Set(); }
    set(fn) { fn(this); this.dispatchEvent(new Event("change")); }
    setTab(tab) { this.set((s) => { s.tab = tab; s.rooms.clear(); s.genres.clear(); }); }
    toggle(setName, v) { this.set((s) => { const set = s[setName]; set.has(v) ? set.delete(v) : set.add(v); if (setName === "rooms") s.dropOrphanGenres(); }); }
    onlyRank(id) { this.set((s) => { s.ranks.clear(); if (id) s.ranks.add(id); }); }
    clear() { this.set((s) => { s.ranks.clear(); s.rooms.clear(); s.genres.clear(); }); }
    // the rooms whose genres can be picked right now
    get genreRooms() { return this.tab === "All" ? ROOM_NAMES.filter((r) => this.rooms.has(r)) : [this.tab]; }
    dropOrphanGenres() { const ok = new Set(this.genreRooms.flatMap((r) => rooms[r])); [...this.genres].forEach((g) => !ok.has(g) && this.genres.delete(g)); }
    get active() { return this.ranks.size + this.rooms.size + this.genres.size; }
    matches(w, ignore = "") {
      const q = this.q.trim().toLowerCase();
      if (q && !`${w.name} ${w.blurb} ${w.maker} ${w.genre} ${w.room}`.toLowerCase().includes(q)) return false;
      if (this.tab !== "All" && w.room !== this.tab) return false;
      if (ignore !== "ranks" && this.ranks.size && !this.ranks.has(w.tier)) return false;
      if (ignore !== "rooms" && this.tab === "All" && this.rooms.size && !this.rooms.has(w.room)) return false;
      if (ignore !== "genres" && this.genres.size && !this.genres.has(w.genre)) return false;
      return true;
    }
    count(test, ignore) { return works.filter((w) => this.matches(w, ignore) && test(w)).length; }
  }

  // ---------- search bar ----------
  class SearchBar {
    constructor(state) {
      const input = $("#q"), clear = $(".sbar__clear");
      input.addEventListener("input", () => { state.set((s) => (s.q = input.value)); clear.hidden = !input.value; });
      clear.addEventListener("click", () => { input.value = ""; clear.hidden = true; state.set((s) => (s.q = "")); input.focus(); });
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
      this.paint();
    }
    open(on) { this.menu.hidden = !on; this.btn.setAttribute("aria-expanded", on); if (on) $("li[aria-selected='true']", this.menu)?.focus(); }
    paint() {
      const r = this.s.ranks, label = r.size === 0 ? "All ranks" : r.size === 1 ? tiers.find((t) => r.has(t.id)).name : "Rank"; // two or more: no count, no name
      // one rank: its name with its gem; two or more: a plain "Rank"
      $("span", this.btn).innerHTML = r.size === 1 ? `<i class="gem-ico" style="--ri:${RANK_INK[[...r][0]]}"></i>${label}` : label;
      this.btn.style.setProperty("--ri", r.size === 1 ? RANK_INK[[...r][0]] : "currentColor");
      const opts = [{ id: "", name: "All ranks" }, ...tiers];
      this.menu.innerHTML = opts.map((t) => `<li role="option" tabindex="-1" data-id="${t.id}" aria-selected="${t.id ? r.size === 1 && r.has(t.id) : r.size === 0}">${t.id ? `<i style="--ri:${RANK_INK[t.id]}"></i>` : ""}${t.name}</li>`).join("");
      this.menu.querySelectorAll("li").forEach((li) => {
        const pick = () => { this.s.onlyRank(li.dataset.id); this.open(false); this.btn.focus(); };
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
        b.innerHTML = `<span class="room__art" aria-hidden="true">${Art.draw(works.find((w) => w.id === cover[r]))}</span><span class="room__name">${r === "All" ? "All work" : r}</span>`;
        b.addEventListener("click", () => state.setTab(r));
        this.el.appendChild(b);
      });
      state.addEventListener("change", () => this.paint()); this.paint();
    }
    paint() { this.el.querySelectorAll(".room").forEach((b) => b.setAttribute("aria-pressed", b.dataset.room === this.s.tab)); }
  }

  // ---------- filter panel: rank, then room (only under All), then genres of the chosen rooms ----------
  class FilterPanel {
    constructor(state) {
      this.s = state; this.el = $("#fpanel"); this.btn = $(".fbtn");
      this.btn.addEventListener("click", () => this.open(this.el.hidden));
      state.addEventListener("change", () => this.paint()); this.paint();
    }
    open(on) { this.el.hidden = !on; this.btn.setAttribute("aria-expanded", on); document.body.classList.toggle("has-panel", on); }
    box(set, value, label, n, extra = "") {
      return `<label class="ck"><input type="checkbox" data-set="${set}" value="${value}"${this.s[set].has(value) ? " checked" : ""}>${extra}<span>${label}</span><em>${n}</em></label>`;
    }
    paint() {
      const s = this.s;
      let h = `<div class="fp__head"><h2>Filters</h2><button type="button" class="fp__clear"${s.active ? "" : " disabled"}>Clear all</button></div>`;
      h += `<section><h3>Rank</h3>${tiers.map((t) => this.box("ranks", t.id, t.name, s.count((w) => w.tier === t.id, "ranks"), `<i class="dot" style="--ri:${RANK_INK[t.id]}"></i>`)).join("")}</section>`;
      if (s.tab === "All") h += `<section><h3>Room</h3>${ROOM_NAMES.map((r) => this.box("rooms", r, r, s.count((w) => w.room === r, "rooms"))).join("")}</section>`;
      const gr = s.genreRooms;
      h += `<section><h3>Genre</h3>`;
      if (!gr.length) h += `<p class="fp__hint">Pick a room above to see its genres.</p>`;
      gr.forEach((r) => { h += `${gr.length > 1 || s.tab === "All" ? `<h4>${r}</h4>` : ""}${rooms[r].map((g) => this.box("genres", g, g, s.count((w) => w.room === r && w.genre === g, "genres"))).join("")}`; });
      h += `</section>`;
      this.el.innerHTML = h;
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
  const GEM = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.5 4h11l4.5 5.2L12 21 2 9.2z" fill="currentColor" opacity=".9"/><path d="M2 9.2h20M6.5 4L9.6 9.2 12 21l2.4-11.8L17.5 4M9.6 9.2L12 4l2.4 5.2" fill="none" stroke="rgba(0,0,0,.28)" stroke-width="1"/></svg>`;
  const BELL = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 16V11a6 6 0 1112 0v5l1.6 2.2H4.4z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M10 20.5a2 2 0 004 0" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`;
  const following = new Set();
  class ResultCard {
    constructor(w, onOpen) { this.w = w; this.onOpen = onOpen; }
    render() {
      const w = this.w, t = tiers.find((x) => x.id === w.tier), a = document.createElement("article");
      a.className = "rc"; a.dataset.id = w.id; a.style.setProperty("--ri", RANK_INK[w.tier]);
      a.innerHTML = `<div class="rc__media"><button type="button" class="rc__open" aria-label="Play ${w.name}"><span class="rc__pic"><span class="cv"></span></span></button>
        <span class="rc__flag" aria-hidden="true">${GEM}<b>${t.name}</b></span>
        <button type="button" class="rc__bell" aria-pressed="${following.has(w.id)}">${BELL}<span>${following.has(w.id) ? "Following" : "Notify me"}</span></button></div>
        <h3 class="rc__name" title="${w.name}">${w.name}</h3>`;
      Art.fill($(".cv", a), w);
      $(".rc__open", a).addEventListener("click", () => this.onOpen(w));
      const bell = $(".rc__bell", a);
      bell.addEventListener("click", () => {
        const on = !following.has(w.id); on ? following.add(w.id) : following.delete(w.id);
        bell.setAttribute("aria-pressed", on); $("span", bell).textContent = on ? "Following" : "Notify me";
        bell.animate([{ transform: "rotate(0)" }, { transform: "rotate(14deg)" }, { transform: "rotate(-10deg)" }, { transform: "rotate(5deg)" }, { transform: "rotate(0)" }], { duration: 520, easing: "ease-out" });
      });
      return a;
    }
  }

  // ---------- player: a work's clip in a box, not full screen, with "View full" to its page ----------
  class Player {
    constructor() {
      this.el = document.createElement("div"); this.el.className = "pl"; this.el.hidden = true;
      this.el.setAttribute("role", "dialog"); this.el.setAttribute("aria-modal", "true");
      this.el.innerHTML = `<div class="pl__scrim"></div><div class="pl__box"><div class="pl__clip"><div class="cv"></div><p class="pl__line"></p><a class="pl__full" href="#"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 4h6v6M20 4l-8.5 8.5M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>View full</span></a></div>
        <button type="button" class="pl__x" aria-label="Close">&times;</button>

        <p class="pl__title"></p></div>`;
      document.body.appendChild(this.el);
      $(".pl__scrim", this.el).addEventListener("click", () => this.close());
      $(".pl__x", this.el).addEventListener("click", () => this.close());
      addEventListener("keydown", (e) => {
        if (this.el.hidden) return;
        if (e.key === "Escape") this.close();
      });
    }
    open(list, w) {
      this.list = list; this.i = list.indexOf(w); this.back = document.activeElement;
      this.el.hidden = false; document.documentElement.classList.add("pl-on");
      this.show(0);
      if (!calm) {
        $(".pl__scrim", this.el).animate([{ opacity: 0 }, { opacity: 1 }], { duration: 260, easing: "ease-out" });
        $(".pl__box", this.el).animate([{ opacity: 0, transform: "translateY(18px) scale(.97)" }, { opacity: 1, transform: "none" }], { duration: 380, easing: "cubic-bezier(.2,.8,.2,1)" });
      }
      $(".pl__x", this.el).focus();
    }
    async show(dir) {
      const w = this.list[this.i], clip = $(".pl__clip", this.el);
      if (dir && !calm) await clip.animate([{ opacity: 1, transform: "none" }, { opacity: 0, transform: `translateY(${-dir * 30}px)` }], { duration: 180, easing: "ease-in", fill: "forwards" }).finished;
      if (this.preview) this.preview.stop();
      clip.querySelectorAll(".pv").forEach((p) => p.remove());
      Art.fill($(".cv", clip), w);
      $(".pl__line", this.el).textContent = w.blurb;
      $(".pl__title", this.el).innerHTML = `<b>${w.name}</b><span>${w.maker} · ${w.room} · ${w.genre}</span>`;
      $(".pl__full", this.el).setAttribute("aria-label", `View ${w.name} in full`);
      this.preview = window.Previews.for(clip, w); clip.insertBefore(clip.lastElementChild, $(".pl__line", clip)); this.preview.start();
      clip.getAnimations().forEach((a) => a.cancel());
      if (dir && !calm) clip.animate([{ opacity: 0, transform: `translateY(${dir * 30}px)` }, { opacity: 1, transform: "none" }], { duration: 260, easing: "cubic-bezier(.2,.8,.2,1)" });
    }
    async close() {
      if (this.el.hidden) return;
      if (!calm) await Promise.all([
        $(".pl__box", this.el).animate([{ opacity: 1, transform: "none" }, { opacity: 0, transform: "translateY(12px) scale(.98)" }], { duration: 200, easing: "ease-in", fill: "forwards" }).finished,
        $(".pl__scrim", this.el).animate([{ opacity: 1 }, { opacity: 0 }], { duration: 220, fill: "forwards" }).finished,
      ]);
      if (this.preview) this.preview.stop();
      this.el.getAnimations({ subtree: true }).forEach((a) => a.cancel());
      this.el.hidden = true; document.documentElement.classList.remove("pl-on");
      if (this.back) this.back.focus();
    }
  }
  const player = new Player();

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
    enter(grid) {
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
      this.s = state; this.grid = $(".grid"); this.n = $(".results__n");
      this.activeRank = rankKey(state); this.pendingRank = this.activeRank; this.busy = false;
      state.addEventListener("change", () => this.onChange());
      this.paint();
    }
    onChange() {
      this.pendingRank = rankKey(this.s);
      if (this.busy) return;                                          // the running transition reads the newest state at its swap
      if (this.pendingRank === this.activeRank) { this.paint(); return; } // not a rank change: show it straight away
      this.transition();
    }
    async transition() {
      this.busy = true; this.grid.classList.add("grid--busy");
      try {
        while (this.pendingRank !== this.activeRank) {
          const one = this.s.ranks.size === 1 ? [...this.s.ranks][0] : "";
          await CardMotion.exit(this.grid);                         // 1. old set leaves; it stays in the DOM until this resolves
          let revealed = "";
          if (one && window.RankReveal.has(one)) {                    // 2. a single rank: the reveal covers the screen
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
      const shown = works.filter((w) => this.s.matches(w)), sig = shown.map((w) => w.id).join("|");
      if (!force && sig === this.sig && this.grid.childElementCount) return; // same set already on screen
      this.sig = sig;
      this.n.textContent = `${shown.length} work${shown.length === 1 ? "" : "s"}`;
      this.grid.innerHTML = "";
      if (!shown.length) {
        this.grid.innerHTML = `<p class="none">Nothing matches that yet. <button type="button">Clear the filters</button></p>`;
        $("button", this.grid).addEventListener("click", () => { $("#q").value = ""; $(".sbar__clear").hidden = true; this.s.set((s) => { s.q = ""; s.ranks.clear(); s.rooms.clear(); s.genres.clear(); }); });
        return;
      }
      shown.forEach((w) => this.grid.appendChild(new ResultCard(w, (x) => player.open(shown, x)).render()));
    }
  }

  const state = new BrowseState();
  new SearchBar(state); new RankMenu(state); new RoomTabs(state); new FilterPanel(state); new ResultGrid(state);
})();
