(function () {
  "use strict";
  const { works } = window.NEST;
  const { SampleDetails } = window.Details;
  const { esc, Paths, thai, lang } = window.NestShell;
  const DAYS = { "today": 0, "yesterday": 1, "2 days ago": 2, "3 days ago": 3, "5 days ago": 5, "last week": 7, "1 week ago": 8, "2 weeks ago": 14, "3 weeks ago": 21, "last month": 30, "2 months ago": 60 };
  const RATIOS = [[4, 5], [9, 16], null, [1, 1], [2, 3], [3, 2], [16, 9], [3, 4], null, [4, 3], [1, 1], [5, 4]];
  const TEXT = {
    en: { title: "Dev logs", open: "Open the project's updates", image: "image" },
    th: { title: "บันทึกการพัฒนา", open: "เปิดอัปเดตของโปรเจกต์", image: "รูปภาพ" },
  };
  const t = () => TEXT[lang.cur];
  const seen = new Set();
  const posts = works.flatMap((w, wi) => new SampleDetails(w).updates().slice(0, 2).map(([when, title, note], k) => ({ w, when, title, excerpt: k ? note : w.blurb, days: DAYS[when] ?? 90, order: wi * 2 + k })))
    .sort((a, b) => a.days - b.days || a.order - b.order)
    .filter((p) => !seen.has(p.title) && seen.add(p.title))
    .map((p, i) => ({ ...p, ratio: RATIOS[i % RATIOS.length], frame: i % 7 }));

  const href = (id) => Paths.page(`project.html#${id}&updates`);
  const html = (p, i) => {
    const meta = `<span class="lc__meta">${esc(p.w.name)} · ${esc(p.w.maker)} · ${esc(p.when)}</span>`;
    const label = `${p.title}, ${p.w.name}, ${p.when}. ${t().open}`;
    if (!p.ratio) return `<a class="lc lc--text" href="${href(p.w.id)}" aria-label="${esc(label)}"><span class="tag">${esc(p.w.room)}</span><span class="lc__title">${esc(p.title)}</span><span class="lc__ex">${esc(p.excerpt)}</span>${meta}</a>`;
    const [rw, rh] = p.ratio, hw = Math.min(1.5, Math.max(0.5, rh / rw)), iw = 600, ih = Math.round((iw * rh) / rw);
    const src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(window.Art.draw({ ...p.w, scribble: "" }, p.frame));
    return `<a class="lc" href="${href(p.w.id)}" aria-label="${esc(label)}"><span class="lc__pic" style="aspect-ratio:1 / ${hw.toFixed(3)}"><img src="${src}" alt="${esc(`${p.title}, ${t().image}`)}" width="${iw}" height="${ih}"${i < 5 ? "" : ' loading="lazy"'} decoding="async" style="display:block;width:100%;height:100%;object-fit:cover"></span><span class="lc__title">${esc(p.title)}</span>${meta}</a>`;
  };
  const colsFor = () => { const w = innerWidth; return w >= 1280 ? 5 : w >= 900 ? 4 : w >= 600 ? 3 : 2; };
  let last = [];
  function render(host, list) {
    last = list;
    const n = colsFor();
    host.innerHTML = Array.from({ length: n }, () => '<div class="mas__col"></div>').join("");
    const cols = [...host.children];
    list.forEach((p, i) => {
      const c = cols.reduce((a, b) => (b.offsetHeight < a.offsetHeight ? b : a));
      c.insertAdjacentHTML("beforeend", html(p, i));
    });
    thai(host);
  }
  let n0 = colsFor();
  addEventListener("resize", () => { const n = colsFor(); if (n !== n0) { n0 = n; const h = document.querySelector(".mas"); if (h && last.length) render(h, last); } });
  document.getElementById("feed").addEventListener("click", (e) => { if (e.target.closest("a.lc")) { try { sessionStorage.setItem("nest-from", "Dev logs"); } catch (x) {} } });
  NestFeed.mount(document.getElementById("feed"), {
    title: () => t().title, h: "h1", from: "Dev logs", items: posts, of: (p) => p.w,
    text: (p) => `${p.title} ${p.w.name} ${p.w.maker} ${p.excerpt}`, noun: ["log", "logs"], listClass: "mas", noRank: true,
    per: () => (innerWidth < 900 ? 10 : 24), render,
  });
})();
