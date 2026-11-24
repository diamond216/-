// Opening logo: HAMSTER_NEST written as one thin line, stroke by stroke, then the page shows through.
// Plays once per visit (sessionStorage). Click, Esc or reduced motion skip it. Waits on Animation.finished, no timers.
(function () {
  "use strict";
  let seen = false; try { seen = sessionStorage.getItem("nest-intro") === "1"; } catch (e) {}
  if (seen || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  try { sessionStorage.setItem("nest-intro", "1"); } catch (e) {}

  // each letter is drawn on a 60-unit cap height; w = width
  const L = {
    H: [36, "M0 0V60M0 30H36M36 0V60"],
    A: [40, "M0 60L20 0L40 60M8 37H32"],
    M: [46, "M0 60V0L23 44L46 0V60"],
    S: [34, "M33 9C29 1 18 0 12 1C3 3 0 10 2 18C5 28 31 29 33 42C35 54 25 61 15 60C7 59 2 55 0 50"],
    T: [36, "M0 0H36M18 0V60"],
    E: [30, "M30 0H0V60H30M0 30H25"],
    R: [34, "M0 60V0H19C31 0 34 8 34 15C34 23 28 30 19 30H0M17 30L34 60"],
    N: [36, "M0 60V0L36 60V0"],
    _: [42, "M0 60H42"],
  };
  const word = "HAMSTER_NEST", GAP = 22;
  let x = 0, paths = `<path d="M-160 60H-14" class="li__lead"/>`;
  [...word].forEach((ch) => { const [w, d] = L[ch]; paths += `<path d="${d}" transform="translate(${x} 0)"/>`; x += w + GAP; });
  paths += `<path d="M${x - GAP + 14} 60H${x + 140}" class="li__tail"/>`;
  const el = document.createElement("div");
  el.className = "li"; el.setAttribute("aria-hidden", "true");
  el.innerHTML = `<svg viewBox="-170 -24 ${x + 330} 108" preserveAspectRatio="xMidYMid meet"><g fill="none" stroke-linecap="round" stroke-linejoin="round">${paths}</g></svg>`;
  document.body.appendChild(el);
  document.documentElement.classList.add("li-on");

  const strokes = [...el.querySelectorAll("path")];
  strokes.forEach((p) => p.setAttribute("pathLength", "1"));
  const anims = strokes.map((p, i) => p.animate([{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }],
    { duration: i === 0 || i === strokes.length - 1 ? 520 : 560, delay: i * 115, easing: "cubic-bezier(.45,.05,.3,1)", fill: "both" }));
  const skip = () => [...anims, ...(out ? [out] : [])].forEach((a) => a.finish());
  let out = null;
  el.addEventListener("click", skip); addEventListener("keydown", (e) => e.key === "Escape" && skip());

  Promise.all(anims.map((a) => a.finished)).then(() => {
    // hold for a beat (an animation that changes nothing), then lift away and let the page through
    return el.animate([{ opacity: 1 }, { opacity: 1 }], { duration: 450 }).finished;
  }).then(() => {
    // the page underneath starts its own entrance while the line lifts away
    document.documentElement.classList.remove("li-on");
    out = el.animate([{ opacity: 1, filter: "blur(0)", transform: "scale(1)" }, { opacity: 0, filter: "blur(6px)", transform: "scale(1.04)" }],
      { duration: 700, easing: "cubic-bezier(.4,0,.2,1)", fill: "forwards" });
    return out.finished;
  }).catch(() => {}).finally(() => { el.remove(); document.documentElement.classList.remove("li-on"); });
})();
