// Tier wordmarks, after Apple's product names (MacBook Pro, iPad mini, Watch Series).
// One renderer per kind (strategy); a tier picks one in works.js with `mark`.
//   badge:  logo + heavy NAME + light TIER, in a metal gradient        (Watch Series)
//   script: one word in a handwritten gradient, the rest plain         (iPad mini)
//   split:  plain title, the line under it starts in one colour and fades into another (MacBook Pro)
window.TierMarks = (function () {
  "use strict";
  const grad = (c) => `linear-gradient(90deg,${c.join(",")})`;
  const LOGOS = {
    hamster: `<svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="9" cy="10" r="6" fill="currentColor"/><circle cx="31" cy="10" r="6" fill="currentColor"/><ellipse cx="20" cy="22" rx="16" ry="14" fill="currentColor"/><circle cx="14" cy="20" r="2.2" fill="#0B0B0F"/><circle cx="26" cy="20" r="2.2" fill="#0B0B0F"/><ellipse cx="20" cy="26" rx="2.4" ry="1.6" fill="#0B0B0F"/></svg>`,
    gem: `<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M11 6h18l8 10-17 20L3 16z" fill="currentColor"/><path d="M3 16h34M11 6l9 30 9-30M15 16l5-10 5 10" fill="none" stroke="#0B0B0F" stroke-width="1.6" stroke-linejoin="round"/></svg>`,
  };
  const kinds = {
    badge(t, m) {
      return `<h2 class="mark mark--badge" style="--ink:${grad(m.metal)}"><span class="mark__logo">${LOGOS[m.logo]}</span><b>${t.name.toUpperCase()}</b><span class="mark__light">TIER</span></h2><p class="mark__sub">${t.note}</p>`;
    },
    script(t, m) {
      const word = (s) => `<span class="mark__script" style="--ink:${grad(m.ink)}">${s}</span>`;
      const title = m.script === "tier" ? `${t.name} ${word("tier")}` : `${word(t.name)} tier`;
      return `<h2 class="mark mark--script">${title}</h2><p class="mark__sub">${t.note}</p>`;
    },
    split(t, m) {
      const rest = t.note.slice(m.lead.length).trim();
      return `<h2 class="mark mark--split">${t.name} tier</h2><p class="mark__sub mark__sub--ink"><span style="color:${m.ink[0]}">${m.lead}</span> <span class="mark__fade" style="--ink:${grad(m.ink.slice(1))}">${rest}</span></p>`;
    },
  };
  return {
    head(tier, count) {
      const m = tier.mark || { kind: "split", lead: "", ink: ["#fff", "#fff", "#fff"] };
      return `${kinds[m.kind](tier, m)}<div class="mark__acts"><a class="mark__btn" href="#">See all ${count}</a><a class="mark__btn mark__btn--line" href="#">How ranking works</a></div>`;
    },
  };
})();
