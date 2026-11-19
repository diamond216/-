// Rank reveal: the page fades to a rank's colour, its gem rises out of a blur with a soft flare, then its name.
// Split into steps that each return a Promise resolved by the animations' own `finished`, so the caller can
// change the data while the screen is covered:  await enter(id)  ->  swap data  ->  await leave().
window.RankReveal = (function () {
  "use strict";
  const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const E = "cubic-bezier(.22,.61,.36,1)";
  const LOOK = {
    platinum: { hi: "#E8EEFF", mid: "#8FA6EC", lo: "#2E468F", bg: "#1B2A5C" },
    diamond: { hi: "#E6FBFF", mid: "#7FD3F0", lo: "#1F79A8", bg: "#0F4A66" },
    gold: { hi: "#FFF1C2", mid: "#E9B949", lo: "#9A6510", bg: "#5A3C0E" },
    silver: { hi: "#FFFFFF", mid: "#C9D1D8", lo: "#6E7A85", bg: "#59626B" },
    bronze: { hi: "#FAD9BC", mid: "#C98451", lo: "#7A401C", bg: "#4A2A16" },
  };
  const emblem = (c) => `<svg viewBox="0 0 120 120" aria-hidden="true">
    <defs><linearGradient id="rvA" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c.hi}"/><stop offset=".55" stop-color="${c.mid}"/><stop offset="1" stop-color="${c.lo}"/></linearGradient>
    <linearGradient id="rvB" x1="1" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c.mid}"/><stop offset="1" stop-color="${c.lo}"/></linearGradient></defs>
    <path d="M30 22h60l22 26-52 58L8 48z" fill="url(#rvB)"/><path d="M30 22h60l-12 26H42z" fill="${c.hi}" opacity=".95"/>
    <path d="M8 48h34l18 58z" fill="url(#rvA)"/><path d="M42 48h36l-18 58z" fill="${c.mid}"/>
    <path d="M78 48h34L60 106z" fill="${c.lo}" opacity=".85"/><path d="M30 22L8 48h34zM90 22l22 26H78z" fill="${c.mid}" opacity=".8"/>
    <path d="M30 22h60l22 26-52 58L8 48z" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="1.2" stroke-linejoin="round"/></svg>`;

  class Reveal {
    constructor() {
      this.el = document.createElement("div"); this.el.className = "rv"; this.el.hidden = true;
      this.el.setAttribute("role", "status"); this.el.setAttribute("aria-live", "polite");
      this.el.innerHTML = `<div class="rv__bg"></div><div class="rv__stage"><div class="rv__flare"></div><div class="rv__gem"></div><p class="rv__name"></p></div>`;
      document.body.appendChild(this.el);
      this.anims = []; this.skip = false;
      // click or Esc: jump every running step to its end (the caller's promises still resolve in order)
      const skip = () => { this.skip = true; this.anims.forEach((a) => a.finish()); };
      this.el.addEventListener("click", skip);
      addEventListener("keydown", (e) => e.key === "Escape" && !this.el.hidden && skip());
    }
    q(s) { return this.el.querySelector(s); }
    run(list) {
      // list: [selector, keyframes, {duration, delay}]; resolves when every animation has finished
      const made = list.map(([sel, kf, o]) => {
        const a = this.q(sel).animate(kf.map((k) => ({ easing: E, ...k })), { fill: "forwards", easing: "linear", duration: calm ? Math.min(o.duration, 250) : o.duration, delay: calm ? 0 : o.delay || 0 });
        if (this.skip) a.finish();
        return a;
      });
      this.anims = made;
      return Promise.all(made.map((a) => a.finished.catch(() => {}))).then(() => {});
    }
    paint(id, name) {
      const c = LOOK[id];
      this.el.style.setProperty("--rv-bg", c.bg); this.el.style.setProperty("--rv-hi", c.hi); this.el.style.setProperty("--rv-mid", c.mid);
      this.q(".rv__gem").innerHTML = emblem(c); this.q(".rv__name").textContent = name; this.id = id;
    }
    enter(id, name) {
      this.skip = false; this.paint(id, name); this.el.hidden = false;
      const steps = [
        [".rv__bg", [{ opacity: 0 }, { opacity: 1 }], { duration: 480 }],
        [".rv__stage", [{ opacity: 1, transform: "none" }, { opacity: 1, transform: "none" }], { duration: 1 }],
        [".rv__gem", [{ opacity: 0, transform: "scale(.82)", filter: "blur(10px)" }, { opacity: 1, transform: "scale(1)", filter: "blur(0)" }], { duration: 900, delay: 250 }],
        [".rv__flare", [{ opacity: 0, transform: "scale(.4) rotate(-8deg)" }, { opacity: 1, transform: "scale(1) rotate(0deg)", offset: .45 }, { opacity: 0, transform: "scale(1.25) rotate(6deg)" }], { duration: 1300, delay: 550 }],
        [".rv__name", [{ opacity: 0, transform: "translateY(10px)", letterSpacing: ".42em" }, { opacity: 1, transform: "none", letterSpacing: ".18em" }], { duration: 900, delay: 950 }],
      ];
      return this.run(calm ? steps.filter((s) => s[0] !== ".rv__flare") : steps);
    }
    // the choice changed to another single rank while the reveal was up: swap emblem and name in place
    async retitle(id, name) {
      if (id === this.id) return;
      await this.run([[".rv__gem", [{ opacity: 1, filter: "blur(0)" }, { opacity: 0, filter: "blur(8px)" }], { duration: 220 }], [".rv__name", [{ opacity: 1 }, { opacity: 0 }], { duration: 220 }]]);
      this.paint(id, name);
      await this.run([[".rv__gem", [{ opacity: 0, transform: "scale(.9)", filter: "blur(8px)" }, { opacity: 1, transform: "scale(1)", filter: "blur(0)" }], { duration: 420 }], [".rv__name", [{ opacity: 0, transform: "translateY(8px)" }, { opacity: 1, transform: "none" }], { duration: 420, delay: 120 }]]);
    }
    // a short hold (an animation that changes nothing, so its end is the clock), then the scene lifts away
    async leave() {
      await this.run([[".rv__stage", [{ opacity: 1 }, { opacity: 1 }], { duration: 700 }]]);
      await this.run([
        [".rv__stage", [{ opacity: 1, transform: "none" }, { opacity: 0, transform: "translateY(-10px) scale(.98)" }], { duration: 520 }],
        [".rv__bg", [{ opacity: 1 }, { opacity: 0 }], { duration: 640, delay: 80 }],
      ]);
      this.el.hidden = true; this.anims.forEach((a) => a.cancel()); this.anims = [];
    }
  }

  let r = null;
  const get = () => (r ||= new Reveal());
  return { has: (id) => !!LOOK[id], enter: (id, name) => get().enter(id, name), retitle: (id, name) => get().retitle(id, name), leave: () => get().leave() };
})();
