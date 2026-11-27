window.NestFeed = (function () {
  "use strict";
  const { works, tiers } = window.NEST;
  const { ic, esc, Follows, thai, Paths, search } = window.NestShell;
  const { BrowseState, sortWorks } = window.BrowseKit;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const RC = { platinum: "var(--plat)", diamond: "var(--dia)", gold: "var(--gold)", silver: "var(--silver)", bronze: "var(--bronze)" };
  const ROOMS = ["Game", "IoT", "Web", "Idea"];
  const tierName = (id) => tiers.find((t) => t.id === id).name;
  const isPhone = () => innerWidth < 900;
  const fine = matchMedia("(hover: hover) and (pointer: fine)");

  const card = (w, i, opts = {}) => {
    const name = opts.name || w.name, rank = opts.noRank ? "new, not ranked yet" : tierName(w.tier);
    const flag = opts.noRank ? `<span class="pc__rank">New · not ranked yet</span>` : `<span class="pc__rank"><i style="background:${RC[w.tier]}"></i>${tierName(w.tier)}</span>`;
    const on = Follows.has(w.id);
    const fol = opts.noFollow ? "" : `<button type="button" class="pc__follow" data-follow="${w.id}" aria-pressed="${on}" aria-label="Follow ${esc(name)}">${ic("follow")}<span class="fl">${on ? "Following" : "Follow"}</span></button>`;
    const href = opts.href || Paths.page(`project.html#${w.id}`);
    return `<div class="pc" data-id="${w.id}"><a class="pc__link" href="${href}"><span class="pc__pic" aria-hidden="true">${window.Art.draw(w, (opts.frame ?? i) % 7)}${flag}</span>
      <span class="pc__row"><h3 class="pc__name">${esc(name)}<span class="vh">, ${rank}</span></h3><span class="tag">${esc(opts.room || w.room)}</span></span>
      <span class="pc__by">${esc(opts.maker || w.maker)}</span><span class="pc__upd">${esc(opts.upd || `Updated ${w.update.when}`)}</span></a>${fol}</div>`;
  };

  function wireCards(grid, from) {
    grid.addEventListener("click", (e) => {
      const f = e.target.closest("[data-follow]");
      if (f) {
        e.preventDefault();
        const on = Follows.toggle(f.dataset.follow);
        $$(`[data-follow="${f.dataset.follow}"]`).forEach((b) => { b.setAttribute("aria-pressed", String(on)); const l = $(".fl", b); if (l) l.textContent = on ? "Following" : "Follow"; });
        return;
      }
      if (e.target.closest(".pc__link") && from) { try { sessionStorage.setItem("nest-from", from); } catch (x) {} }
    });
    let timer = 0, cur = null;
    const hide = () => { clearTimeout(timer); if (cur) { cur.classList.remove("is-hover", "pv-l"); const p = $(".pv", cur); if (p) p.remove(); } cur = null; };
    const show = (c) => {
      const w = works.find((x) => x.id === c.dataset.id); if (!w) return;
      const pic = $(".pc__pic", c);
      document.body.style.setProperty("--pich", pic.offsetHeight + "px"); document.body.style.setProperty("--colw", pic.offsetWidth + "px");
      const r = c.getBoundingClientRect(), room = r.right + 16 + r.width <= grid.getBoundingClientRect().right + 2;
      c.classList.add("is-hover"); c.classList.toggle("pv-l", !room);
      c.insertAdjacentHTML("beforeend", `<span class="pv" aria-hidden="true"><h4>${esc(w.name)}</h4><p>${esc(w.blurb)}</p><span class="upd" style="display:block"><b>Updated ${esc(w.update.when)}</b>${esc(w.update.what)}</span></span>`);
      thai(c);
    };
    grid.addEventListener("pointerover", (e) => {
      if (e.pointerType !== "mouse" || !fine.matches) return;
      const c = e.target.closest(".pc"); if (!c || c === cur) return;
      hide(); cur = c; timer = setTimeout(() => { if (cur === c) show(c); }, 500);
    });
    grid.addEventListener("pointerout", (e) => { const c = e.target.closest(".pc"); if (c && c === cur && !c.contains(e.relatedTarget)) hide(); });
    addEventListener("scroll", hide, { passive: true });
    addEventListener("keydown", (e) => { if (e.key === "Escape") hide(); });
    return { hide };
  }

  function mount(host, cfg) {
    const state = new BrowseState();
    const from = cfg.from || "Browse";
    const per = () => (cfg.per ? cfg.per() : isPhone() ? 8 : 16);
    let shown = per(), panel = false;
    host.innerHTML = `<div class="chips" role="toolbar" aria-label="Rooms and filters"></div><div class="fp-host"></div>
      <div class="sh"><${cfg.h} class="sh__t"></${cfg.h}>${cfg.h === "h1" ? '<h2 class="vh">Projects</h2>' : ""}<span class="n" aria-live="polite"></span><span class="sort-host"></span></div>
      <div class="grid"></div><div class="more" hidden><button type="button" class="btn btn--line">Show more</button></div>`;
    const chipsEl = $(".chips", host), fpHost = $(".fp-host", host), grid = $(".grid", host), more = $(".more", host);
    const hv = wireCards(grid, from);

    const roomCount = (r) => (r === "All" ? works.length : works.filter((w) => w.room === r).length);
    function chips() {
      const ph = isPhone();
      chipsEl.innerHTML = `<button type="button" class="chip ${ph ? "chip--fbtn" : "chip--filter"}" data-c="filters" aria-expanded="${panel}" aria-controls="fpanel">${ic("filter")}Filters${state.active ? `<span class="cc">${state.active}</span>` : ""}</button>${ph ? "" : '<span class="chip-sep" aria-hidden="true"></span>'}
        ${["All", ...ROOMS].map((r) => `<button type="button" class="chip" data-room="${r}" aria-pressed="${state.tab === r}">${r === "All" ? (ph ? "All" : "All projects") : r}${ph ? "" : `<span class="cc">${roomCount(r)}</span>`}</button>`).join("")}
        ${ph ? "" : `<span class="chip-sep rk" aria-hidden="true"></span>${tiers.map((t) => `<button type="button" class="chip rk" data-rank="${t.id}" aria-pressed="${state.ranks.has(t.id)}"><span class="rdot" style="background:${RC[t.id]}"></span>${t.name}</button>`).join("")}`}`;
    }
    const cnt = (key, test, ignore) => state.count(test, ignore);
    const top = (arr) => { const m = {}; arr.forEach((k) => (m[k] = (m[k] || 0) + 1)); return Object.entries(m).sort((x, y) => y[1] - x[1]).slice(0, 6).map(([k]) => k); };
    function panelHTML() {
      const g = (h, set, rows) => `<div><h3>${h}</h3>${rows.map(([v, label, n]) => `<label class="ck"><input type="checkbox" data-set="${set}" value="${esc(v)}"${state[set].has(v) ? " checked" : ""}><span>${esc(label)}</span><small>${n}</small></label>`).join("")}</div>`;
      const total = works.filter((w) => state.matches(w)).length;
      return `<section class="fpanel" id="fpanel" role="region" aria-label="Filters"><div class="fp__cols">
        ${g("Rank", "ranks", tiers.map((t) => [t.id, t.name, cnt("ranks", (w) => w.tier === t.id, "ranks")]))}
        ${g("Room", "rooms", ROOMS.map((r) => [r, r, cnt("rooms", (w) => w.room === r, "rooms")]))}
        ${g("Genre", "genres", top(works.map((w) => w.genre)).map((x) => [x, x, cnt("genres", (w) => w.genre === x, "genres")]))}
        ${g("Runs on", "plats", top(works.flatMap((w) => w.platforms)).map((x) => [x, x, cnt("plats", (w) => w.platforms.includes(x), "plats")]))}
        </div><div class="fp__bar"><button type="button" class="btn btn--ghost" data-c="clear">Clear all</button><button type="button" class="btn btn--ink" data-c="show">Show ${total} projects</button></div></section>`;
    }
    function paintPanel() {
      $$(".sheet,.sheet-scrim").forEach((e) => e.remove());
      fpHost.innerHTML = "";
      if (!panel) return;
      if (isPhone()) {
        document.body.insertAdjacentHTML("beforeend", `<div class="sheet-scrim" data-c="close"></div><div class="sheet" role="dialog" aria-modal="true" aria-label="Filters"><div class="grab"></div>${panelHTML().replace('class="fpanel"', 'class="fpanel" style="display:block;border:0;padding:0;margin:0"').replace('class="fp__cols"', 'class="fp__cols" style="grid-template-columns:1fr 1fr;gap:16px"')}</div>`);
        const sh = $(".sheet"); wirePanel(sh); $(".sheet-scrim").addEventListener("click", () => setPanel(false));
        const f = $("input", sh); if (f) f.focus();
      } else { fpHost.innerHTML = panelHTML(); wirePanel(fpHost); }
    }
    function wirePanel(root) {
      root.addEventListener("change", (e) => { const i = e.target.closest("input[data-set]"); if (i) state.toggle(i.dataset.set, i.value); });
      root.addEventListener("click", (e) => { const b = e.target.closest("[data-c]"); if (!b) return; if (b.dataset.c === "clear") state.clear(); if (b.dataset.c === "show") setPanel(false); });
    }
    function setPanel(on) { panel = on; chips(); paintPanel(); if (!on) { const b = $('[data-c="filters"]', chipsEl); if (b) b.focus(); } }

    function sortHTML() {
      const opts = [["rank", "Most updates"], ["az", "Name A to Z"], ["maker", "Maker A to Z"]];
      return isPhone() ? `<span class="tools"><span>Sort</span><select aria-label="Sort projects">${opts.map(([v, l]) => `<option value="${v}"${state.sort === v ? " selected" : ""}>${l}</option>`).join("")}</select></span>`
        : `<div class="sortt" role="group" aria-label="Sort projects">${opts.map(([v, l]) => `<button type="button" data-sort="${v}" aria-pressed="${state.sort === v}">${l}</button>`).join("")}</div>`;
    }
    function paint() {
      hv.hide();
      const q = state.q.trim(), list = sortWorks(works.filter((w) => state.matches(w)), state.sort);
      const sh = $(".sh", host); sh.classList.toggle("res", !!q);
      $(".sh__t", host).textContent = q ? `Results for “${q}”` : cfg.title;
      $(".n", host).textContent = `${list.length} ${list.length === 1 ? "project" : "projects"}`;
      $(".sort-host", host).innerHTML = sortHTML();
      grid.style.setProperty("--cols", cfg.cols ? cfg.cols() : "");
      grid.innerHTML = list.length ? list.slice(0, shown).map((w, i) => card(w, i)).join("") : `<p class="empty" style="grid-column:1/-1">No projects match “${esc(q || "these filters")}”<button type="button" class="btn btn--line" data-c="reset">Clear</button></p>`;
      more.hidden = list.length <= shown;
      thai(grid);
      if (panel && !isPhone()) { fpHost.innerHTML = panelHTML(); wirePanel(fpHost); }
    }

    chipsEl.addEventListener("click", (e) => {
      const b = e.target.closest("button"); if (!b) return;
      if (b.dataset.c === "filters") return setPanel(!panel);
      if (b.dataset.room) state.setTab(b.dataset.room);
      if (b.dataset.rank) state.toggle("ranks", b.dataset.rank);
    });
    host.addEventListener("click", (e) => {
      const s = e.target.closest("[data-sort]"); if (s) state.set((x) => (x.sort = s.dataset.sort));
      if (e.target.closest('[data-c="reset"]')) { state.set((x) => { x.q = ""; x.ranks.clear(); x.rooms.clear(); x.genres.clear(); x.plats.clear(); }); if (search.input) { search.input.value = ""; search.paint(); } }
    });
    host.addEventListener("change", (e) => { if (e.target.matches(".sort-host select")) state.set((x) => (x.sort = e.target.value)); });
    $("button", more).addEventListener("click", () => { const first = shown; shown += per(); paint(); const c = $$(".pc__link", grid)[first]; if (c) c.focus(); });
    state.addEventListener("change", () => { shown = per(); chips(); paint(); });

    if (search.input) {
      search.input.addEventListener("input", () => state.set((s) => (s.q = search.input.value)));
      search.onSubmit = cfg.onSubmit || null;
    }
    const P = new URLSearchParams(location.search);
    if (P.get("q")) state.q = P.get("q");
    const room = P.get("room") || ((location.hash.match(/^#browse-(\w+)$/) || [])[1] || "");
    const R = ROOMS.find((r) => r.toLowerCase() === room.toLowerCase()); if (R) state.tab = R;
    let wasPhone = isPhone();
    addEventListener("resize", () => { if (isPhone() !== wasPhone) { wasPhone = isPhone(); chips(); paintPanel(); paint(); } });
    chips(); paint();
    return { state, paint };
  }

  return { mount, card, wireCards, RC, tierName };
})();
