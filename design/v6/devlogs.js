(function () {
  "use strict";
  const { works } = window.NEST;
  const { SampleDetails } = window.Details;
  const $ = (s, r = document) => r.querySelector(s);
  const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const PAGE = 24;
  const DAYS = { "today": 0, "yesterday": 1, "2 days ago": 2, "3 days ago": 3, "5 days ago": 5, "last week": 7, "1 week ago": 8, "2 weeks ago": 14, "3 weeks ago": 21, "last month": 30, "2 months ago": 60 };
  const TEXT = {
    en: { title: "Dev logs", lead: "What students changed in their projects lately, newest first. Sample content.", All: "All", Game: "Game", IoT: "IoT", Web: "Web", Idea: "Idea", more: "Show more", room: "Room", count: (n) => `${n} dev logs`, open: "Open project", by: "by" },
    th: { title: "บันทึกการพัฒนา", lead: "สิ่งที่นักเรียนเปลี่ยนในโปรเจกต์ช่วงนี้ ใหม่สุดก่อน (ข้อมูลตัวอย่าง)", All: "ทั้งหมด", Game: "เกม", IoT: "IoT", Web: "เว็บ", Idea: "ไอเดีย", more: "ดูเพิ่ม", room: "หมวด", count: (n) => `${n} บันทึก`, open: "เปิดโปรเจกต์", by: "โดย" },
  };
  const projectHref = (id) => NestSession.Paths.page(`project.html#${id}`);

  const posts = works.flatMap((w, wi) => new SampleDetails(w).updates().slice(0, 2).map(([when, title, note], k) => ({ w, when, title, excerpt: k ? note : w.blurb, days: DAYS[when] ?? 90, order: wi * 2 + k })))
    .sort((a, b) => a.days - b.days || a.order - b.order);

  const state = { room: "All", shown: PAGE, lang: "en" };
  const list = $(".dl-list"), more = $(".dl-more"), count = $(".dl-count");

  const dateOf = (days) => {
    const d = new Date(); d.setDate(d.getDate() - days);
    return { iso: d.toISOString().slice(0, 10), label: d.toLocaleDateString(state.lang === "th" ? "th-TH" : "en-GB", { day: "numeric", month: "short", year: "numeric" }) };
  };

  function render() {
    const t = TEXT[state.lang];
    const pick = posts.filter((p) => state.room === "All" || p.w.room === state.room);
    list.innerHTML = pick.slice(0, state.shown).map((p) => {
      const d = dateOf(p.days);
      return `<li class="dl-item"><a class="dl-card" href="${projectHref(p.w.id)}" aria-label="${esc(p.title)}, ${esc(p.w.name)}, ${esc(d.label)}. ${esc(t.open)}">
        <span class="dl-cover" aria-hidden="true"><span class="cv"></span></span>
        <span class="dl-text">
          <span class="dl-meta"><b>${esc(p.w.name)}</b><i>${esc(t[p.w.room])}</i><time datetime="${d.iso}">${esc(d.label)}</time></span>
          <span class="dl-title">${esc(p.title)}</span>
          <span class="dl-excerpt">${esc(p.excerpt)}</span>
          <span class="dl-by">${esc(t.by)} ${esc(p.w.maker)}</span>
        </span></a></li>`;
    }).join("");
    list.querySelectorAll(".dl-item").forEach((li, i) => window.Art.fill(li.querySelector(".cv"), pick[i].w));
    count.textContent = t.count(pick.length);
    more.hidden = pick.length <= state.shown;
  }

  function applyLang(lang) {
    state.lang = lang === "th" ? "th" : "en";
    const t = TEXT[state.lang];
    document.documentElement.lang = state.lang;
    document.title = `${t.title} · Hamster Nest`;
    document.querySelectorAll("[data-t]").forEach((el) => { el.textContent = t[el.dataset.t]; });
    $(".dl-rooms").setAttribute("aria-label", t.room);
    document.querySelectorAll(".glang button").forEach((b) => b.setAttribute("aria-pressed", String((b.textContent.trim() === "ไทย") === (state.lang === "th"))));
    try { localStorage.setItem("nest-lang", state.lang); } catch (e) {}
    render();
  }

  document.querySelectorAll(".dl-rooms button").forEach((b) => b.addEventListener("click", () => {
    state.room = b.dataset.room; state.shown = PAGE;
    document.querySelectorAll(".dl-rooms button").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    render();
  }));
  more.addEventListener("click", () => {
    const first = state.shown; state.shown += PAGE; render();
    list.children[first]?.querySelector("a")?.focus();
  });
  document.querySelectorAll(".glang button").forEach((b) => b.addEventListener("click", () => applyLang(b.textContent.trim() === "ไทย" ? "th" : "en")));

  let saved = "en"; try { saved = localStorage.getItem("nest-lang") || "en"; } catch (e) {}
  applyLang(saved);
})();
