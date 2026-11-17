// Tier wordmarks, after Apple product names (Watch Series, iPad mini, MacBook Pro). No subtitle, no logo.
// One renderer per kind (strategy); a tier picks one in works.js with `mark`.
//   badge:  heavy NAME + light TIER in one metal gradient   (Watch Series)
//   script: the tier name handwritten in a gradient + "tier" (iPad mini)
//   ink:    the tier name in a colour gradient + "tier"      (MacBook Pro's coloured line)
window.TierMarks = (function () {
  "use strict";
  const grad = (c) => `linear-gradient(90deg,${c.join(",")})`;
  const kinds = {
    badge: (t, m) => `<h2 class="mark mark--badge" style="--ink:${grad(m.metal)}"><b>${t.name.toUpperCase()}</b><span class="mark__light">TIER</span></h2>`,
    script: (t, m) => `<h2 class="mark mark--script"><span class="mark__script" style="--ink:${grad(m.ink)}">${t.name}</span> tier</h2>`,
    ink: (t, m) => `<h2 class="mark mark--ink"><span class="mark__fade" style="--ink:${grad(m.ink)}">${t.name}</span> tier</h2>`,
  };
  return {
    head(tier, count) {
      const m = tier.mark || { kind: "ink", ink: ["#fff", "#fff"] };
      return `${kinds[m.kind](tier, m)}<div class="mark__acts"><a class="mark__btn" href="#">See all ${count}</a><a class="mark__btn mark__btn--line" href="#">How ranking works</a></div>`;
    },
  };
})();
