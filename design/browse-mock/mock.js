// Static mockup: fills the tiles, room tabs and filter panel from the sample data. No real filtering.
(function () {
  const { works, tiers } = window.NEST, $ = (s) => document.querySelector(s);
  const INK = { platinum: "#3550A8", diamond: "#1E93C2", gold: "#C08A12", silver: "#7A8794", bronze: "#B0602F" };
  const GEM = '<svg viewBox="0 0 24 24"><path d="M6.5 4h11l4.5 5.2L12 21 2 9.2z" fill="currentColor"/></svg>';
  const BELL = '<svg viewBox="0 0 24 24"><path d="M6 16V11a6 6 0 1112 0v5l1.6 2.2H4.4z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M10 20.5a2 2 0 004 0" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
  const n = +(new URLSearchParams(location.search).get("n") || 12);
  $(".grid").innerHTML = works.slice(0, n).map((w) => {
    const t = tiers.find((x) => x.id === w.tier);
    return `<article class="tile" style="--ri:${INK[w.tier]}"><div class="tile__media"><div class="cv" data-id="${w.id}"></div>
      <span class="flag">${GEM}<b>${t.name}</b></span><span class="bell">${BELL}Notify me</span></div>
      <div class="tile__meta"><h3>${w.name}</h3><span class="by">${w.maker}</span><span class="chip">${t.name}</span></div></article>`;
  }).join("");
  document.querySelectorAll(".tile .cv").forEach((el) => Art.fill(el, works.find((w) => w.id === el.dataset.id)));
  const cover = { "All work": "burrow-knights", Game: "seed-dash", Web: "nestboard", IoT: "wheelsense", Idea: "sunflower-bank" };
  $(".rooms").innerHTML = Object.entries(cover).map(([r, id], i) => `<span class="room${i ? "" : " on"}"><span class="art">${Art.draw(works.find((w) => w.id === id))}</span><b>${r}</b></span>`).join("");
  const box = (l, c, on) => `<label class="ck"><i class="${on ? "on" : ""}"></i>${l}<em>${c}</em></label>`;
  $(".panel").innerHTML = `<h4>Rank</h4>${tiers.map((t, i) => box(`<s style="--ri:${INK[t.id]}"></s>${t.name}`, 10, i === 2)).join("")}
    <h4>Room</h4>${["Game", "IoT", "Web", "Idea"].map((r, i) => box(r, [15, 15, 10, 10][i], i === 0)).join("")}
    <h4>Genre · Game</h4>${["Roguelike", "Puzzle", "Casual", "Co-op"].map((g, i) => box(g, [2, 2, 8, 3][i], i === 3)).join("")}`;
})();

// ---- tile -> player morph (mockup of the proposed transition) ----
window.Morph = (function () {
  const E = "cubic-bezier(.2,.8,.2,1)";
  let open = null;
  function target() { const w = Math.min(1100, innerWidth * 0.84), h = w * 9 / 16; return { x: (innerWidth - w) / 2, y: (innerHeight - h) / 2 - 16, w, h }; }
  async function show(tile) {
    const src = tile.querySelector(".tile__media"), r = src.getBoundingClientRect(), t = target(), w = window.NEST.works.find((x) => x.id === tile.querySelector(".cv").dataset.id);
    const el = document.createElement("div"); el.className = "ply";
    el.innerHTML = `<div class="ply__scrim"></div><div class="ply__pic">${tile.querySelector(".cv").innerHTML}<p class="ply__line">${w.blurb}</p><span class="ply__full"><svg viewBox="0 0 24 24"><path d="M14 4h6v6M20 4l-8.5 8.5M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>View full</span></div><p class="ply__name">${w.name}</p>`;
    document.body.appendChild(el);
    const pic = el.querySelector(".ply__pic"), name = el.querySelector(".ply__name");
    Object.assign(pic.style, { left: t.x + "px", top: t.y + "px", width: t.w + "px", height: t.h + "px" });
    Object.assign(name.style, { left: t.x + "px", top: t.y + t.h + 16 + "px" });
    src.style.visibility = "hidden";
    const sx = r.width / t.w, sy = r.height / t.h;
    // the picture travels from the tile, its corners and scale settling as it lands; the grid sinks back a little
    const fly = pic.animate([{ transformOrigin: "0 0", transform: `translate(${r.left - t.x}px,${r.top - t.y}px) scale(${sx},${sy})`, borderRadius: `${8 / sx}px / ${8 / sy}px` }, { transformOrigin: "0 0", transform: "none", borderRadius: "16px" }], { duration: 620, easing: E, fill: "both" });
    el.querySelector(".ply__scrim").animate([{ opacity: 0 }, { opacity: 1 }], { duration: 450, easing: "ease-out", fill: "both" });
    document.querySelector(".sheet").animate([{ transform: "none", filter: "none" }, { transform: "scale(.985)", filter: "saturate(.8)" }], { duration: 620, easing: E, fill: "both" });
    await fly.finished;
    pic.style.setProperty("--fade", 1);
    el.querySelector(".ply__line").animate([{ opacity: 0, transform: "translateY(8px)" }, { opacity: 1, transform: "none" }], { duration: 380, easing: E, fill: "both" });
    el.querySelector(".ply__full").animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300, delay: 120, fill: "both" });
    name.animate([{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], { duration: 380, delay: 80, easing: E, fill: "both" });
    open = { el, src, r, t, pic };
  }
  async function hide() {
    if (!open) return; const { el, src, t, pic } = open; const r = src.getBoundingClientRect(), sx = r.width / t.w, sy = r.height / t.h;
    pic.style.setProperty("--fade", 0);
    el.querySelectorAll(".ply__line,.ply__full,.ply__name").forEach((x) => x.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 160, fill: "both" }));
    el.querySelector(".ply__scrim").animate([{ opacity: 1 }, { opacity: 0 }], { duration: 420, fill: "both" });
    document.querySelector(".sheet").animate([{ transform: "scale(.985)" }, { transform: "none" }], { duration: 520, easing: E, fill: "both" });
    await pic.animate([{ transformOrigin: "0 0", transform: "none", borderRadius: "16px" }, { transformOrigin: "0 0", transform: `translate(${r.left - t.x}px,${r.top - t.y}px) scale(${sx},${sy})`, borderRadius: `${8 / sx}px / ${8 / sy}px` }], { duration: 520, easing: E, fill: "both" }).finished;
    src.style.visibility = ""; el.remove(); open = null;
  }
  return { show, hide };
})();
