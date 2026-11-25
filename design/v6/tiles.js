// Shared tiles: the work card (picture, name, rank flag, notify bell, details shown when opened),
// a FLIP helper, and the hover-to-expand grid behaviour. Used by browse.html and project.html.
window.Tiles = (function () {
  "use strict";
  // works from any folder (the home page lives in hero/), via session.js when it is loaded
  const projectHref = (id) => (window.NestSession ? NestSession.Paths.page(`project.html#${id}`) : `project.html#${id}`);
  const { tiers } = window.NEST;
  const $ = (s, r = document) => r.querySelector(s);
  const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const RANK_INK = { platinum: "#3550A8", diamond: "#1E93C2", gold: "#C08A12", silver: "#7A8794", bronze: "#B0602F" };
  const GEM = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.5 4h11l4.5 5.2L12 21 2 9.2z" fill="currentColor" opacity=".9"/><path d="M2 9.2h20M6.5 4L9.6 9.2 12 21l2.4-11.8L17.5 4M9.6 9.2L12 4l2.4 5.2" fill="none" stroke="rgba(0,0,0,.28)" stroke-width="1"/></svg>`;
  const BELL = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 16V11a6 6 0 1112 0v5l1.6 2.2H4.4z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M10 20.5a2 2 0 004 0" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`;
  const following = new Set();
  class ResultCard {
    constructor(w) { this.w = w; }
    render() {
      const w = this.w, t = tiers.find((x) => x.id === w.tier), a = document.createElement("article");
      a.className = "rc"; a.dataset.id = w.id; a.style.setProperty("--ri", RANK_INK[w.tier]);
      a.innerHTML = `<div class="rc__media"><a class="rc__open" href="${projectHref(w.id)}" aria-label="${w.name}, open the project"><span class="rc__pic"><span class="cv"></span></span></a>
        <span class="rc__flag" aria-hidden="true">${GEM}<b>${t.name}</b></span>
        <button type="button" class="rc__bell" aria-pressed="${following.has(w.id)}">${BELL}<span>${following.has(w.id) ? "Following" : "Notify me"}</span></button></div>
        <h3 class="rc__name" title="${w.name}">${w.name}</h3>
        <div class="rc__more" aria-hidden="true">
          <p class="rc__by"><span class="rc__av" style="--h:${[...w.maker].reduce((n, c) => n + c.charCodeAt(0), 0) % 360}">${w.maker[0]}</span>${w.maker}<i>${w.room} · ${w.genre}</i></p>
          <p class="rc__upd"><b>Updated ${w.update.when}</b>${w.update.what}</p>
          <p class="rc__desc">${w.blurb}</p>
          <span class="rc__go">Open project<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M3 9l6-6M4.5 3H9v4.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></span>
        </div>`;
      Art.fill($(".cv", a), w);
      const bell = $(".rc__bell", a);
      bell.addEventListener("click", () => {
        const on = !following.has(w.id); on ? following.add(w.id) : following.delete(w.id);
        bell.setAttribute("aria-pressed", on); $("span", bell).textContent = on ? "Following" : "Notify me";
        if (!calm) bell.animate([{ transform: "rotate(0)" }, { transform: "rotate(14deg)" }, { transform: "rotate(-10deg)" }, { transform: "rotate(5deg)" }, { transform: "rotate(0)" }], { duration: 520, easing: "ease-out" });
      });
      return a;
    }
  }

  // ---------- FLIP helper: remember where tiles were, then slide them from there to where they are now ----------
  const EASE = "cubic-bezier(.2,.8,.2,1)";
  const Flip = {
    read(grid) { return new Map([...grid.querySelectorAll(".rc")].map((c) => [c, c.getBoundingClientRect()])); },
    play(grid, before, duration = 420, except = null) {
      const anims = [];
      grid.querySelectorAll(".rc").forEach((c) => {
        const a = before.get(c); if (!a || c === except) return;
        const b = c.getBoundingClientRect(), dx = a.left - b.left, dy = a.top - b.top, sx = a.width / b.width, sy = a.height / b.height;
        if (Math.abs(dx) < 1 && Math.abs(dy) < 1 && Math.abs(sx - 1) < .01) return;
        anims.push(c.animate([{ transformOrigin: "0 0", transform: `translate(${dx}px,${dy}px) scale(${sx},${sy})` }, { transformOrigin: "0 0", transform: "none" }], { duration, easing: EASE }));
      });
      return Promise.all(anims.map((x) => x.finished.catch(() => {})));
    },
  };

  // ---------- hover to expand: rest on a tile for 0.75 s and it takes two columns and two rows; the rest move aside ----------
  const HOLD = 750;
  class Expander {
    constructor(grid) {
      this.grid = grid; this.open = null; this.timer = 0;
      // touch: a tap goes straight to the project page, so nothing expands (no hover on a phone)
      let touched = 0;
      grid.addEventListener("pointerdown", (e) => { if (e.pointerType !== "mouse") touched = performance.now(); }, true);
      const byTouch = () => performance.now() - touched < 800;
      grid.addEventListener("pointerover", (e) => {
        if (e.pointerType && e.pointerType !== "mouse") return;
        const c = e.target.closest(".rc"); if (!c || c === this.open || this.busy()) return;
        clearTimeout(this.timer);
        c.classList.add("rc--arming");
        this.timer = setTimeout(() => { c.classList.remove("rc--arming"); if (c.matches(":hover")) this.expand(c); }, HOLD);
      });
      grid.addEventListener("pointerout", (e) => {
        const c = e.target.closest(".rc"); if (!c || c.contains(e.relatedTarget)) return;
        c.classList.remove("rc--arming"); clearTimeout(this.timer);
        if (c === this.open) this.collapse();
      });
      // keyboard: focusing a tile opens it straight away
      grid.addEventListener("focusin", (e) => { const c = e.target.closest(".rc"); if (c && c !== this.open && !this.busy() && !byTouch()) this.expand(c); });
      grid.addEventListener("focusout", (e) => { if (this.open && !this.open.contains(e.relatedTarget)) this.collapse(); });
      addEventListener("resize", () => this.collapse(false));
    }
    busy() { return this.grid.classList.contains("grid--busy"); }
    cols() { return getComputedStyle(this.grid).gridTemplateColumns.split(" ").length; }
    place(c) {
      const g = this.grid.getBoundingClientRect(), r = c.getBoundingClientRect(), cs = getComputedStyle(this.grid), n = this.cols();
      const colW = (g.width + parseFloat(cs.columnGap)) / n, rowH = r.height + parseFloat(cs.rowGap);
      const col = Math.min(Math.round((r.left - g.left) / colW) + 1, n - 1), row = Math.round((r.top - g.top) / rowH) + 1;
      return `${row} / ${col} / span 2 / span 2`;
    }
    expand(c) {
      if (this.cols() < 2) return;
      const before = Flip.read(this.grid);
      if (this.open) this.unset(this.open);
      c.style.gridArea = this.place(c); c.classList.add("rc--big"); c.querySelector(".rc__more").removeAttribute("aria-hidden");
      this.open = c;
      if (calm) return;
      Flip.play(this.grid, before, 520, c);
      const a = before.get(c), b = c.getBoundingClientRect();
      // the tile grows from its own corner; the picture keeps its place while the details rise in underneath
      c.animate([{ transformOrigin: "0 0", transform: `translate(${a.left - b.left}px,${a.top - b.top}px) scale(${a.width / b.width},${a.height / b.height})` }, { transformOrigin: "0 0", transform: "none" }], { duration: 520, easing: EASE });
      [...c.querySelectorAll(".rc__more > *")].forEach((n, i) => n.animate([{ opacity: 0, transform: "translateY(10px)" }, { opacity: 1, transform: "none" }], { duration: 360, delay: 220 + i * 60, easing: EASE, fill: "backwards" }));
    }
    unset(c) { c.style.gridArea = ""; c.classList.remove("rc--big"); c.querySelector(".rc__more").setAttribute("aria-hidden", "true"); }
    collapse(animate = true) {
      clearTimeout(this.timer);
      const c = this.open; if (!c) return;
      const before = Flip.read(this.grid);
      this.unset(c); this.open = null;
      if (animate && !calm) Flip.play(this.grid, before, 460);
    }
  }


  return { ResultCard, Flip, Expander, EASE, RANK_INK };
})();
