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
      const r = this.s.ranks, label = r.size === 0 ? "All ranks" : r.size === 1 ? tiers.find((t) => r.has(t.id)).name : `${r.size} ranks`;
      // one rank: its name with its gem; two or more: just the count
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
  class ResultCard {
    constructor(w) { this.w = w; }
    render() {
      const w = this.w, t = tiers.find((x) => x.id === w.tier), a = document.createElement("a");
      a.href = "#"; a.className = "rc"; a.dataset.id = w.id; a.style.setProperty("--ri", RANK_INK[w.tier]);
      a.innerHTML = `<div class="rc__pic"><div class="cv"></div><p class="rc__line"><svg viewBox="0 0 10 10" aria-hidden="true"><path d="M2 1l7 4-7 4z" fill="currentColor"/></svg><span>${w.blurb}</span></p></div>
        <div class="rc__txt">
          <div class="rc__title"><strong>${w.name}</strong><span class="rc__rank">${t.name}</span></div>
          <p class="rc__desc">${w.blurb}</p>
          <p class="rc__by">${w.maker}</p>
          <p class="rc__tag">${w.room} · ${w.genre}</p>
          <p class="rc__plat">${w.platforms.map((p) => `<svg viewBox="0 0 18 18" role="img" aria-label="${p}"><title>${p}</title><g fill="currentColor">${PLATFORM_ICON[p]}</g></svg>`).join("")}</p>
        </div>`;
      Art.fill($(".cv", a), w);
      this.preview = window.Previews.for($(".rc__pic", a), w);
      a._card = this;
      return a;
    }
  }

  // ---------- results in rows of four: hovering a card widens it and slides the rest of its row aside ----------
  class ResultGrid {
    constructor(state) {
      this.s = state; this.grid = $(".grid"); this.n = $(".results__n");
      state.addEventListener("change", () => this.paint());
      this.paint();
    }
    paint() {
      const shown = works.filter((w) => this.s.matches(w));
      this.n.textContent = `${shown.length} work${shown.length === 1 ? "" : "s"}`;
      this.grid.innerHTML = "";
      if (!shown.length) {
        this.grid.innerHTML = `<p class="none">Nothing matches that yet. <button type="button">Clear the filters</button></p>`;
        $("button", this.grid).addEventListener("click", () => { $("#q").value = ""; $(".sbar__clear").hidden = true; this.s.set((s) => { s.q = ""; s.ranks.clear(); s.rooms.clear(); s.genres.clear(); }); });
        return;
      }
      for (let i = 0; i < shown.length; i += 4) {
        const row = document.createElement("div"); row.className = "row";
        shown.slice(i, i + 4).forEach((w) => {
          const card = new ResultCard(w), el = card.render();
          const on = () => { row.classList.add("row--open"); el.classList.add("rc--open"); card.preview.start(); };
          const off = () => { row.classList.remove("row--open"); el.classList.remove("rc--open"); card.preview.stop(); };
          el.addEventListener("pointerenter", on); el.addEventListener("pointerleave", off);
          el.addEventListener("focus", on); el.addEventListener("blur", off);
          row.appendChild(el);
        });
        // keep the last row's cards the same width as the rest
        for (let k = row.children.length; k < 4; k++) row.insertAdjacentHTML("beforeend", '<span class="rc rc--gap" aria-hidden="true"></span>');
        this.grid.appendChild(row);
      }
    }
  }

  const state = new BrowseState();
  new SearchBar(state); new RankMenu(state); new RoomTabs(state); new FilterPanel(state); new ResultGrid(state);
})();
