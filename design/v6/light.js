// A soft light follows the pointer; every card's shadow turns away from it.
// Sets --lx/--ly (light position) and --sx/--sy (shadow offset) on the root. Off when reduced motion is on.
(function () {
  "use strict";
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const root = document.documentElement.style;
  let tx = innerWidth * 0.7, ty = innerHeight * 0.25, x = tx, y = ty, moving = true;
  addEventListener("pointermove", (e) => { tx = e.clientX; ty = e.clientY; moving = true; }, { passive: true });
  (function frame() {
    if (moving) {
      x += (tx - x) * 0.12; y += (ty - y) * 0.12;
      root.setProperty("--lx", x.toFixed(0) + "px"); root.setProperty("--ly", y.toFixed(0) + "px");
      const dx = (x / innerWidth - 0.5) * -2, dy = (y / innerHeight - 0.5) * -2;
      root.setProperty("--sx", (dx * 18).toFixed(1) + "px"); root.setProperty("--sy", (14 + dy * 14).toFixed(1) + "px");
      if (Math.abs(tx - x) < 0.5 && Math.abs(ty - y) < 0.5) moving = false;
    }
    requestAnimationFrame(frame);
  })();
})();
