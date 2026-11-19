// Rank reveal: when exactly one rank is chosen (from the rank menu or the filter), the page fades to that rank's colour,
// its emblem fades in with a soft flare, then its name. Two or more ranks: nothing plays. Click or Esc skips it.
// After the clip in the owner's reference (a promotion screen), reduced to the emblem and the name.
window.RankReveal = (function () {
  "use strict";
  const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
  // light, mid and dark of each rank's metal, and the colour the page fades to
  const LOOK = {
    platinum: { hi: "#E8EEFF", mid: "#8FA6EC", lo: "#2E468F", bg: "#1B2A5C" },
    diamond: { hi: "#E6FBFF", mid: "#7FD3F0", lo: "#1F79A8", bg: "#0F4A66" },
    gold: { hi: "#FFF1C2", mid: "#E9B949", lo: "#9A6510", bg: "#5A3C0E" },
    silver: { hi: "#FFFFFF", mid: "#C9D1D8", lo: "#6E7A85", bg: "#59626B" },
    bronze: { hi: "#FAD9BC", mid: "#C98451", lo: "#7A401C", bg: "#4A2A16" },
  };
  // a cut gem: top table, two upper facets, a pavilion that narrows to a point
  const emblem = (c) => `<svg viewBox="0 0 120 120" aria-hidden="true">
    <defs><linearGradient id="rvA" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c.hi}"/><stop offset=".55" stop-color="${c.mid}"/><stop offset="1" stop-color="${c.lo}"/></linearGradient>
    <linearGradient id="rvB" x1="1" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c.mid}"/><stop offset="1" stop-color="${c.lo}"/></linearGradient></defs>
    <path d="M30 22h60l22 26-52 58L8 48z" fill="url(#rvB)"/>
    <path d="M30 22h60l-12 26H42z" fill="${c.hi}" opacity=".95"/>
    <path d="M8 48h34l18 58z" fill="url(#rvA)"/>
    <path d="M42 48h36l-18 58z" fill="${c.mid}"/>
    <path d="M78 48h34L60 106z" fill="${c.lo}" opacity=".85"/>
    <path d="M30 22L8 48h34zM90 22l22 26H78z" fill="${c.mid}" opacity=".8"/>
    <path d="M30 22h60l22 26-52 58L8 48z" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="1.2" stroke-linejoin="round"/>
  </svg>`;

  class Reveal {
    constructor() {
      this.el = document.createElement("div"); this.el.className = "rv"; this.el.hidden = true;
      this.el.setAttribute("role", "status"); this.el.setAttribute("aria-live", "polite");
      this.el.innerHTML = `<div class="rv__bg"></div><div class="rv__stage"><div class="rv__flare"></div><div class="rv__gem"></div><p class="rv__name"></p></div>`;
      document.body.appendChild(this.el);
      this.el.addEventListener("click", () => this.finish());
      addEventListener("keydown", (e) => e.key === "Escape" && !this.el.hidden && this.finish());
      this.anims = [];
    }
    play(id, name) {
      const c = LOOK[id]; if (!c) return;
      this.finish(true);
      const q = (s) => this.el.querySelector(s);
      this.el.style.setProperty("--rv-bg", c.bg); this.el.style.setProperty("--rv-hi", c.hi); this.el.style.setProperty("--rv-mid", c.mid);
      q(".rv__gem").innerHTML = emblem(c); q(".rv__name").textContent = name;
      this.el.hidden = false;
      const E = "cubic-bezier(.22,.61,.36,1)", T = calm ? 0.35 : 1;
      const a = (sel, kf, o) => this.anims.push(q(sel).animate(kf.map((k) => ({ easing: E, ...k })), { fill: "both", easing: "linear", ...o, duration: o.duration * T, delay: (o.delay || 0) * T }));
      if (calm) {
        a(".rv__bg", [{ opacity: 0 }, { opacity: 1, offset: .2 }, { opacity: 1, offset: .8 }, { opacity: 0 }], { duration: 2400 });
        a(".rv__stage", [{ opacity: 0 }, { opacity: 1, offset: .2 }, { opacity: 1, offset: .8 }, { opacity: 0 }], { duration: 2400 });
      } else {
        // whole scene: in over 0.5s, holds, out over 0.6s
        a(".rv__bg", [{ opacity: 0 }, { opacity: 1, offset: .14 }, { opacity: 1, offset: .82 }, { opacity: 0 }], { duration: 3400 });
        a(".rv__stage", [{ opacity: 1 }, { opacity: 1, offset: .82 }, { opacity: 0, transform: "translateY(-6px)" }], { duration: 3400 });
        // emblem: rises out of a blur
        a(".rv__gem", [{ opacity: 0, transform: "scale(.82)", filter: "blur(10px)" }, { opacity: 1, transform: "scale(1)", filter: "blur(0)" }], { duration: 900, delay: 250 });
        // flare: a soft bloom with two thin rays, peaks as the emblem settles, then fades
        a(".rv__flare", [{ opacity: 0, transform: "scale(.4) rotate(-8deg)" }, { opacity: 1, transform: "scale(1) rotate(0deg)", offset: .45 }, { opacity: 0, transform: "scale(1.25) rotate(6deg)" }], { duration: 1300, delay: 550 });
        // name: fades up while its letters close in
        a(".rv__name", [{ opacity: 0, transform: "translateY(10px)", letterSpacing: ".42em" }, { opacity: 1, transform: "none", letterSpacing: ".18em" }], { duration: 900, delay: 950 });
      }
      Promise.all(this.anims.map((x) => x.finished)).then(() => this.finish(), () => {});
    }
    finish(quiet) { this.anims.forEach((x) => x.cancel()); this.anims = []; this.el.hidden = true; }
  }

  let r = null;
  return { play: (id, name) => (r ||= new Reveal()).play(id, name) };
})();
