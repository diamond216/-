window.NestShell = (function () {
  "use strict";
  const { Session, Store, Paths, toast } = window.NestSession;
  const { works } = window.NEST;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const body = document.body, root = document.documentElement;
  const page = body.dataset.page || "";
  const detail = ["project", "profile", "post"].includes(page);
  const I = {
    menu: '<path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
    browse: '<rect x="4" y="4" width="7" height="7" rx="1.6" fill="none" stroke="currentColor" stroke-width="1.7"/><rect x="13" y="4" width="7" height="7" rx="1.6" fill="none" stroke="currentColor" stroke-width="1.7"/><rect x="4" y="13" width="7" height="7" rx="1.6" fill="none" stroke="currentColor" stroke-width="1.7"/><rect x="13" y="13" width="7" height="7" rx="1.6" fill="none" stroke="currentColor" stroke-width="1.7"/>',
    logs: '<path d="M6 4h9l3 3v13H6z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M9 11h6M9 15h6M9 8h3" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>',
    about: '<circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M12 11v5M12 8h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    follow: '<path d="M6 19V6a1 1 0 011-1h10a1 1 0 011 1v13l-6-3.5z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/>',
    home: '<path d="M4 11l8-6 8 6v8a1 1 0 01-1 1h-4v-5h-6v5H5a1 1 0 01-1-1z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/>',
    search: '<circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M16 16l4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
    link: '<path d="M10 14a4 4 0 005.7 0l3-3a4 4 0 00-5.7-5.7l-1 1M14 10a4 4 0 00-5.7 0l-3 3a4 4 0 005.7 5.7l1-1" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>',
    play: '<path d="M8 5v14l11-7z" fill="currentColor"/>',
    back: '<path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>',
    next: '<path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>',
    filter: '<path d="M4 7h16M7 12h10M10 17h4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
    pause: '<path d="M8 6h3v12H8zM13 6h3v12h-3z" fill="currentColor"/>',
    plus: '<path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/>',
    copy: '<rect x="8" y="8" width="11" height="11" rx="2" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M16 8V6a1 1 0 00-1-1H6a1 1 0 00-1 1v9a1 1 0 001 1h2" fill="none" stroke="currentColor" stroke-width="1.7"/>',
    mail: '<path d="M4 6.5h16v11H4z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M4.5 7l7.5 6 7.5-6" fill="none" stroke="currentColor" stroke-width="1.7"/>',
    alert: '<circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M12 7.5v5.5M12 16h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    lamp: '<path d="M9 18h6M10 21h4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M12 3a6 6 0 00-3.6 10.8c.6.5 1 1.2 1 2V16h5.2v-.2c0-.8.4-1.5 1-2A6 6 0 0012 3z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>',
    x: '<path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
  };
  const ic = (k, cls = "ico") => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true">${I[k]}</svg>`;
  const MARK = '<svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="9" cy="10" r="6" fill="#F2A65A"/><circle cx="31" cy="10" r="6" fill="#F2A65A"/><circle cx="9" cy="10" r="3" fill="#F7C9A8"/><circle cx="31" cy="10" r="3" fill="#F7C9A8"/><ellipse cx="20" cy="22" rx="16" ry="14" fill="#F2A65A"/><ellipse cx="20" cy="27" rx="11" ry="9" fill="#FBEBDD"/><circle cx="14" cy="20" r="2" fill="#1A1A20"/><circle cx="26" cy="20" r="2" fill="#1A1A20"/><ellipse cx="20" cy="25" rx="2" ry="1.4" fill="#E8665A"/></svg>';
  const SIL = '<svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="15" r="7" fill="var(--sil)"/><path d="M6 38c1.6-8.4 7.2-13 14-13s12.4 4.6 14 13z" fill="var(--sil)"/></svg>';
  const AVATAR_WORK = "cheek-pouch";
  const avatar = (size, label = "") => {
    const w = window.NEST.byId && window.NEST.byId(AVATAR_WORK), pic = w && window.Art ? window.Art.draw(w, 0) : SIL;
    return `<span class="av av--${size}${w ? "" : " av--none"}"${label ? ` role="img" aria-label="${esc(label)}"` : ' aria-hidden="true"'}>${pic}</span>`;
  };
  const wb = (s) => esc(s).replace(s.includes("@") ? /@/ : /([\/.])/g, s.includes("@") ? "@<wbr>" : "$1<wbr>");
  const thai = (root2 = document) => $$(".pc__name,.pc__by,.lc__title,.lc__ex,.sl b,.si span,.wt h1,.pv h4,.pv p,.pitch,.tmn", root2).forEach((e) => { if (/[฀-๿]/.test(e.textContent)) e.lang = "th"; });

  const Follows = {
    KEY: "nest-follows",
    list() {
      try { const v = JSON.parse(Store.get(this.KEY)); if (Array.isArray(v)) return v; } catch (e) {}
      let seed = ["burrow-knights", "bus-ping", "nestboard", "lantern-run", "rain-jar"];
      try { const f = JSON.parse(Store.get("nest-favs")); if (Array.isArray(f) && f.length) seed = f.map((x) => (Array.isArray(x) ? x[0] : x.id)).filter(Boolean); } catch (e) {}
      return seed.filter((id) => works.some((w) => w.id === id));
    },
    has(id) { return this.list().includes(id); },
    toggle(id) {
      const l = this.list(), on = !l.includes(id);
      Store.set(this.KEY, JSON.stringify(on ? [id, ...l] : l.filter((x) => x !== id)));
      dispatchEvent(new CustomEvent("nest:follows", { detail: { id, on } }));
      return on;
    },
    isNew(w) { return ["today", "yesterday"].includes(w.update.when); },
  };

  const theme = {
    get dark() { return root.dataset.theme === "dark"; },
    set(dark) {
      root.dataset.theme = dark ? "dark" : "light";
      try { localStorage.setItem("nest-theme", dark ? "dark" : "light"); } catch (e) {}
      $$(".thm").forEach((b) => b.setAttribute("aria-pressed", String(dark)));
      $$(".sw[data-sw=theme]").forEach((b) => b.setAttribute("aria-checked", String(dark)));
    },
  };
  const motion = {
    reduced: matchMedia("(prefers-reduced-motion: reduce)").matches,
    get on() { const v = Store.get("nest-motion"); return v === null ? !this.reduced : v === "on"; },
    apply() {
      const on = this.on;
      root.classList.toggle("calm", !on);
      $$(".sw[data-sw=anim]").forEach((b) => b.setAttribute("aria-checked", String(on)));
      dispatchEvent(new CustomEvent("nest:motion", { detail: { on } }));
    },
    toggle() { Store.set("nest-motion", this.on ? "off" : "on"); this.apply(); },
  };
  const lang = {
    get cur() { return root.lang === "th" ? "th" : "en"; },
    set(l) {
      try { localStorage.setItem("nest-lang", l); } catch (e) {}
      const hook = document.querySelector(`#lang-menu [data-lang="${l}"]`);
      if (hook) hook.click(); else root.lang = l;
      paintLang();
      dispatchEvent(new CustomEvent("nest:lang", { detail: { lang: l } }));
    },
  };
  const paintLang = () => $$(".lang").forEach((g) => $$("button", g).forEach((b) => b.setAttribute("aria-pressed", String((b.dataset.lang || "en") === lang.cur))));
  const langGroup = () => `<div class="lang" role="group" aria-label="Language"><button type="button" data-lang="en" aria-pressed="true">EN</button><button type="button" data-lang="th" aria-pressed="false" lang="th">ไทย</button></div>`;

  function topBar() {
    const tb = $("#tb"); if (!tb) return;
    const signed = Session.signedIn, u = Session.user;
    tb.innerHTML = `
      <div class="tb__l"><button type="button" class="ibtn" data-act="menu" aria-label="Menu" aria-expanded="false" aria-controls="side">${ic("menu")}</button><a class="mark" href="${Paths.home()}" aria-label="Hamster Nest home">${MARK}<span class="mark__w">Hamster Nest</span></a></div>
      <form class="srch" role="search" action="${Paths.page("browse.html")}"><svg class="ico" viewBox="0 0 24 24" aria-hidden="true" style="width:18px;height:18px;color:var(--t3)">${I.search}</svg><input type="search" name="q" placeholder="Search" aria-label="Search Hamster Nest" autocomplete="off"><kbd aria-hidden="true">/</kbd></form>
      <div class="tb__r"><button type="button" class="ibtn ph-only" data-act="search" aria-label="Search">${ic("search")}</button>${signed ? `<button type="button" class="ibtn ph-only acct-ph" data-act="acct" aria-haspopup="menu" aria-expanded="false" aria-label="Account menu, ${esc(u.name)}">${avatar(32)}</button>` : ""}${langGroup()}<button type="button" class="ibtn thm" aria-pressed="${theme.dark}" aria-label="Dark theme" title="Dark theme">${ic("lamp")}</button>${signed ? `<a class="btn btn--line" href="${Paths.page("post.html")}">${ic("plus")}Build</a><span class="acct-wrap"><button type="button" class="acct" data-act="acct" aria-haspopup="menu" aria-expanded="false" aria-label="Account menu, ${esc(u.name)}">${avatar(32)}</button></span>` : `<a class="btn btn--ghost" href="#" data-in>Log in</a><a class="btn btn--ink" href="#" data-in>Sign up</a>`}</div>
      <div class="srch-row"><button type="button" class="ibtn" data-act="search-close" aria-label="Close search">${ic("back")}</button><form class="srch" role="search" action="${Paths.page("browse.html")}"><input type="search" name="q" placeholder="Search" aria-label="Search Hamster Nest" autocomplete="off"><button type="button" class="ibtn" data-act="search-clear" style="width:30px;height:30px" aria-label="Clear">${ic("x")}</button></form></div>`;
  }

  function sideMenu() {
    const side = $("#side"); if (!side) return;
    const cur = { home: "home", browse: "browse", devlogs: "logs" }[page] || "";
    const signed = Session.signedIn, u = Session.user;
    const fol = Follows.list().map((id) => works.find((w) => w.id === id)).filter(Boolean);
    const si = (k, label, href) => `<a class="si" href="${href}"${cur === k ? ' aria-current="page"' : ""}>${ic(k)}<span>${label}</span></a>`;
    const rooms = ["Game", "IoT", "Web", "Idea"];
    side.innerHTML = `
      <div class="drawer-head"><button type="button" class="ibtn" data-act="menu-close" aria-label="Close menu">${ic("menu")}</button><span class="mark">${MARK}</span></div>
      ${signed ? `<div class="dacct"><div class="who"><a href="${Paths.page(`profile.html#${u.handle}`)}">${avatar(40)}<span><b>${esc(u.name)}</b><small>View your profile</small></span></a><button type="button" class="btn btn--line" data-act="logout">Log out</button></div><a class="btn btn--line post" href="${Paths.page("post.html")}">${ic("plus")}Build</a><hr></div>` : ""}
      ${si("home", "Home", Paths.home())}${si("browse", "Browse", Paths.page("browse.html"))}${si("logs", "Dev logs", Paths.page("devlogs.html"))}${si("about", "About", Paths.home("#about"))}
      <div class="full-only"><hr><h4>Following</h4>
        ${fol.length ? fol.slice(0, 5).map((w) => `<a class="si" href="${Paths.page(`project.html#${w.id}`)}"><span class="thumb" aria-hidden="true">${window.Art ? window.Art.draw(w) : ""}</span><span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(w.name)}</span>${Follows.isNew(w) ? '<small class="nw"><span class="vh">, </span>new<span class="vh"> update</span></small>' : ""}</a>`).join("") : `<p class="side__foot" style="margin-top:0">Follow a project to see it here</p>`}
        <a class="si" href="${Paths.page(`profile.html#${u.handle}/following`)}">${ic("follow")}<span>All followed (${fol.length})</span></a>
        <hr><h4>Rooms</h4>
        ${rooms.map((r) => `<a class="si" href="${Paths.page(`browse.html?room=${r}`)}"><span>${r}</span><small>${works.filter((w) => w.room === r).length}</small></a>`).join("")}
        <div class="drawer-extra"><hr><div style="display:flex;gap:10px;align-items:center;padding:4px 12px">${langGroup()}</div><div class="drow"><span id="thm-l">Dark theme</span><button type="button" class="sw" data-sw="theme" role="switch" aria-checked="${theme.dark}" aria-labelledby="thm-l"><i></i></button></div>${signed ? "" : `<div style="display:flex;gap:8px;padding:12px"><a class="btn btn--line" href="#" data-in style="flex:1">Log in</a><a class="btn btn--acc" href="#" data-in style="flex:1">Sign up</a></div>`}</div></div>`;
  }

  function tabs() {
    const t = $(".tabs2"); if (!t) return;
    t.innerHTML = `<a href="${Paths.page("browse.html")}"${page === "browse" ? ' aria-current="page"' : ""}>Browse</a><a href="${Paths.page("devlogs.html")}"${page === "devlogs" ? ' aria-current="page"' : ""}>Dev logs</a>`;
  }

  function footer() {
    const main = $("#main"); if (!main || $(".ft", main)) return;
    main.insertAdjacentHTML("beforeend", `<footer class="ft" id="about"><div class="ft__brand">${MARK}<span><b>Hamster Nest</b><small>by Hamster Hub, a technology community</small></span></div><div class="ft__c"><h4>Contacts</h4><dl><dt>Facebook</dt><dd><a href="https://www.facebook.com/" target="_blank" rel="noopener" aria-label="Facebook: Hamster Hub (opens in a new tab)">Hamster Hub</a></dd><dt>LINE</dt><dd><a href="https://line.me/R/ti/p/@smart-school" target="_blank" rel="noopener" aria-label="LINE: @smart-school (opens in a new tab)">@smart-school</a></dd><dt>Phone</dt><dd><a href="tel:0900602555" aria-label="Phone: 090-060-2555">090-060-2555</a></dd><dt>Instagram</dt><dd><a href="https://www.instagram.com/hamsterhub_ig" target="_blank" rel="noopener" aria-label="Instagram: hamsterhub_ig (opens in a new tab)">hamsterhub_ig</a></dd></dl></div><div class="ft__a"><span id="anim-l">Animations</span><button type="button" class="sw" data-sw="anim" role="switch" aria-checked="${motion.on}" aria-labelledby="anim-l"><i></i></button></div><p class="ft__note">Projects, names and numbers on this page are sample data.</p></footer>`);
  }

  let mode = "";
  let expanded = null;
  function layout() {
    const w = innerWidth, ph = w < 900;
    body.classList.toggle("ph", ph); body.classList.toggle("dk", !ph);
    body.classList.toggle("detail", detail);
    body.classList.toggle("signed", Session.signedIn);
    const stored = Store.get("nest-menu");
    let m;
    if (ph || page === "project") m = "none";
    else if (w >= 1280) m = (expanded ?? stored !== "mini") ? "full" : "mini";
    else m = expanded ? "full" : "mini";
    if (body.classList.contains("m-drawer")) return;
    mode = m;
    body.classList.toggle("m-mini", m === "mini");
    body.classList.toggle("m-none", m === "none");
  }

  let lastFocus = null;
  function openDrawer() {
    lastFocus = document.activeElement;
    body.classList.add("m-drawer"); body.classList.remove("m-none", "m-mini");
    const sc = document.createElement("div"); sc.className = "d-scrim"; sc.addEventListener("click", closeDrawer); body.append(sc);
    $$('[data-act="menu"]').forEach((b) => b.setAttribute("aria-expanded", "true"));
    const first = $('#side [data-act="menu-close"]'); if (first) first.focus();
  }
  function closeDrawer() {
    if (!body.classList.contains("m-drawer")) return;
    body.classList.remove("m-drawer"); $$(".d-scrim").forEach((e) => e.remove());
    $$('[data-act="menu"]').forEach((b) => b.setAttribute("aria-expanded", "false"));
    layout();
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  function toggleMenu() {
    const w = innerWidth;
    if (w < 900 || page === "project") return body.classList.contains("m-drawer") ? closeDrawer() : openDrawer();
    if (w >= 1280) { const full = mode === "full"; expanded = !full; Store.set("nest-menu", full ? "mini" : "full"); }
    else expanded = mode !== "full";
    layout();
    dispatchEvent(new Event("resize"));
  }

  const acctMenu = () => {
    let m = $(".acct-menu"); if (m) return m;
    const u = Session.user;
    m = document.createElement("div"); m.className = "acct-menu"; m.setAttribute("role", "menu"); m.hidden = true;
    m.innerHTML = `<a role="menuitem" href="${Paths.page(`profile.html#${u.handle}`)}">Your profile</a><a role="menuitem" href="${Paths.page("post.html")}">Build</a><a role="menuitem" href="${Paths.page(`profile.html#${u.handle}/following`)}">Following</a><hr><button type="button" role="menuitem" data-act="logout">Log out</button>`;
    return m;
  };
  function toggleAcct(btn) {
    const m = acctMenu(), host = btn.closest(".acct-wrap") || btn.parentElement;
    if (m.parentElement !== host) host.append(m);
    const open = m.hidden; m.hidden = !open;
    $$('[data-act="acct"]').forEach((b) => b.setAttribute("aria-expanded", String(open && b === btn)));
    if (open) { const f = $("a, button", m); if (f) f.focus(); }
  }

  const search = { input: null, alt: null, onSubmit: null, paint() { if (this.alt && this.alt.value !== this.input.value) this.alt.value = this.input.value; } };
  function wireSearch() {
    const forms = $$(".tb form.srch"); if (!forms.length) return;
    search.input = $("input", forms[0]); search.alt = forms[1] ? $("input", forms[1]) : null;
    if (search.alt) search.alt.addEventListener("input", () => { search.input.value = search.alt.value; search.input.dispatchEvent(new Event("input", { bubbles: true })); });
    search.input.addEventListener("input", () => search.paint());
    forms.forEach((f) => f.addEventListener("submit", (e) => {
      e.preventDefault();
      const q = search.input.value.trim();
      if (search.onSubmit) return search.onSubmit(q);
      if (q) location.href = Paths.page(`browse.html?q=${encodeURIComponent(q)}`);
    }));
    [search.input, search.alt].filter(Boolean).forEach((inp) => inp.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      e.stopPropagation();
      if (inp.value) { search.input.value = ""; search.paint(); search.input.dispatchEvent(new Event("input", { bubbles: true })); }
      else if (body.classList.contains("srch-open")) closeSearch(); else inp.blur();
    }));
    const q0 = new URLSearchParams(location.search).get("q");
    if (q0 && !search.input.value) { search.input.value = q0; search.paint(); }
  }
  function openSearch() { body.classList.add("srch-open"); if (search.alt) search.alt.focus(); }
  function closeSearch() { body.classList.remove("srch-open"); const b = $('[data-act="search"]'); if (b) b.focus(); }

  let lastY = scrollY;
  function onScroll() {
    if (body.classList.contains("ph")) {
      const y = scrollY, down = y > lastY && y > 60;
      if (Math.abs(y - lastY) > 4) body.classList.toggle("scr-down", down);
      lastY = y;
    } else body.classList.remove("scr-down");
  }

  function wire() {
    document.addEventListener("click", (e) => {
      const t = e.target.closest("[data-act],[data-in],.thm,.sw,.lang button");
      if (!t) {
        const m = $(".acct-menu"); if (m && !m.hidden && !e.target.closest(".acct-menu")) { m.hidden = true; $$('[data-act="acct"]').forEach((b) => b.setAttribute("aria-expanded", "false")); }
        return;
      }
      if (t.matches("[data-in]")) { e.preventDefault(); Session.signIn(); toast(`Signed in as ${Session.user.name}`); return; }
      if (t.matches(".thm")) return theme.set(!theme.dark);
      if (t.matches(".sw[data-sw=theme]")) return theme.set(!theme.dark);
      if (t.matches(".sw[data-sw=anim]")) return motion.toggle();
      if (t.matches(".lang button")) return lang.set(t.dataset.lang || "en");
      const a = t.dataset.act;
      if (a === "menu") toggleMenu();
      else if (a === "menu-close") closeDrawer();
      else if (a === "search") openSearch();
      else if (a === "search-close") closeSearch();
      else if (a === "search-clear") { search.input.value = ""; search.paint(); search.input.dispatchEvent(new Event("input", { bubbles: true })); if (search.alt) search.alt.focus(); }
      else if (a === "acct") toggleAcct(t);
      else if (a === "logout") { Session.signOut(); toast("Logged out"); }
    });
    addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        if (body.classList.contains("m-drawer")) { closeDrawer(); return; }
        const m = $(".acct-menu"); if (m && !m.hidden) { m.hidden = true; const b = $('[data-act="acct"][aria-expanded="true"]'); if (b) { b.setAttribute("aria-expanded", "false"); b.focus(); } }
      }
      if (e.key === "Tab" && body.classList.contains("m-drawer")) {
        const f = $$("#side a[href], #side button").filter((x) => x.offsetParent !== null);
        if (!f.length) return;
        if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
      }
      const a = document.activeElement, typing = a && (a.isContentEditable || /^(INPUT|SELECT|TEXTAREA)$/.test(a.tagName));
      if (e.key === "/" && !typing && !e.ctrlKey && !e.metaKey && !e.altKey && search.input) {
        e.preventDefault();
        if (body.classList.contains("ph")) openSearch(); else { search.input.focus(); search.input.select(); }
      }
    });
    addEventListener("resize", layout);
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("nest:session", () => { render(); });
    addEventListener("nest:follows", () => sideMenu());
    addEventListener("storage", (e) => { if (e.key === "nest-theme" && e.newValue) theme.set(e.newValue === "dark"); });
  }

  function render() {
    const keep = search.input ? search.input.value : "";
    topBar(); sideMenu(); tabs(); layout(); wireSearch();
    if (keep) { search.input.value = keep; search.paint(); }
    paintLang(); thai();
  }

  try { const l = localStorage.getItem("nest-lang"); if (l === "th" && !document.querySelector("#lang-menu")) root.lang = "th"; } catch (e) {}
  render(); footer(); motion.apply(); wire();
  if (window.NestSession) window.NestSession.search = search;
  return { I, ic, MARK, SIL, avatar, esc, wb, thai, Follows, theme, motion, lang, search, Paths, closeDrawer, layout };
})();
