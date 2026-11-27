// What plays when you hover a card: a work with a video plays it,
// anything else flips through its pictures like a short clip. Used by the home and browse pages.
window.Previews = (function () {
  "use strict";
  const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
  class FramePreview {
    constructor(box, work) {
      this.work = work; this.i = 0; this.timer = 0;
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
    start() { this.v.classList.add("pv--on"); return calm ? Promise.resolve(false) : this.v.play().then(() => true, () => false); }
    stop() { this.v.pause(); this.v.classList.remove("pv--on"); }
  }
  return { for: (box, work) => (work.video ? new VideoPreview(box, work) : new FramePreview(box, work)) };
})();
