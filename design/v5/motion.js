// Parallax background (scroll + pointer) and tilt on room tiles. Skipped when reduced motion is on.
(function () {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const layers = [...document.querySelectorAll(".bgfx__l")].map((el) => ({ el, d: +el.dataset.depth }));
  let tx = 0, ty = 0, cx = 0, cy = 0;
  addEventListener("pointermove", (e) => { tx = e.clientX / innerWidth - 0.5; ty = e.clientY / innerHeight - 0.5; });
  (function frame() {
    cx += (tx - cx) * 0.06; cy += (ty - cy) * 0.06;
    const s = scrollY;
    for (const { el, d } of layers) el.style.transform = `translate3d(${-cx * 80 * d}px, ${-s * d * 0.35 - cy * 80 * d}px, 0)`;
    requestAnimationFrame(frame);
  })();
  document.querySelectorAll(".tile").forEach((t) => {
    t.addEventListener("pointermove", (e) => {
      const r = t.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      t.style.setProperty("--mx", x * 100 + "%"); t.style.setProperty("--my", y * 100 + "%");
      t.style.setProperty("--ry", (x - 0.5) * 8 + "deg"); t.style.setProperty("--rx", (0.5 - y) * 6 + "deg");
    });
    t.addEventListener("pointerleave", () => { t.style.setProperty("--rx", "0deg"); t.style.setProperty("--ry", "0deg"); });
  });
})();
