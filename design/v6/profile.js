(function () {
  "use strict";
  const { works, tiers } = window.NEST;
  const { Person } = window.Details;
  const { ic, esc, wb, thai, Follows, Paths, avatar, SIL } = window.NestShell;
  const { Store } = window.NestSession;
  const { card, wireCards } = window.NestFeed;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const ME = "Pim";
  const isPhone = () => innerWidth < 900;
  const People = {
    KEY: "nest-follow-people",
    list() { try { return JSON.parse(Store.get(this.KEY)) || []; } catch (e) { return []; } },
    has(n) { return this.list().includes(n); },
    toggle(n) { const l = this.list(), on = !l.includes(n); Store.set(this.KEY, JSON.stringify(on ? [n, ...l] : l.filter((x) => x !== n))); return on; },
  };
  const DAYS = { today: 0, yesterday: 1, "2 days ago": 2, "3 days ago": 3, "5 days ago": 5, "last week": 7, "1 week ago": 8, "2 weeks ago": 14, "3 weeks ago": 21, "last month": 30, "2 months ago": 60 };
  const dday = (when) => { if (!(when in DAYS)) return ""; const d = new Date(); d.setDate(d.getDate() - DAYS[when]); return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" }); };
  const SORTS = [["rank", "Best rank"], ["az", "Name A to Z"], ["new", "Newest update"]];
  const ORDER = Object.keys(DAYS);

  class ProfilePage {
    constructor(root) { this.root = root; this.sort = "rank"; }
    render(p, tab) {
      this.p = p;
      const pr = p.profile(), ws = p.works(), own = p.name === ME && window.NestSession.Session.signedIn, ups = p.updates(), ch = p.contact().filter(([k]) => k !== "phone");
      const followers = pr.followers + (People.has(p.name) ? 1 : 0), on = People.has(p.name);
      this.ch = ch;
      const tabs = [["projects", "Projects", ws.length], ["devlogs", "Dev logs", ups.length], ...(own ? [["following", "Following", Follows.list().length]] : []), ["about", "About", null]];
      if (!tabs.some(([k]) => k === tab)) tab = "projects";
      this.tab = tab;
      const pic = own ? avatar(96, `Profile picture of ${pr.full}`) : `<span class="av av--96 av--none" aria-hidden="true">${SIL}</span>`;
      document.title = `${pr.full} · Hamster Nest`;
      this.root.innerHTML = `<div class="banner" aria-hidden="true">${window.Art.draw(ws[0].w, 3)}</div>
        <div class="phd">${pic}<div><h1>${esc(pr.full)}</h1><div class="sub">@${esc(p.handle)} · ${ws.length} projects · ${ups.length} dev logs · <span class="fcount">${followers}</span> followers</div><div class="bio">${esc(pr.about)}</div>
        <div class="acts">${own ? `<a class="btn btn--line" href="${Paths.page("post.html")}">${ic("plus")}Post a project</a>` : `<button type="button" class="btn btn--acc" data-act="pfollow" aria-pressed="${on}">${ic("follow")}<span>${on ? "Following" : "Follow"}</span></button>`}${ch.length ? `<button type="button" class="btn btn--line" data-act="contact" aria-haspopup="dialog" aria-expanded="false">${ic("mail")}Contact</button>` : ""}</div></div></div>
        <nav class="tabs" role="tablist" aria-label="${esc(p.name)}'s profile">${tabs.map(([k, l, n]) => `<a role="tab" id="tab-${k}" href="#${p.handle}/${k}" aria-selected="${k === tab}" aria-controls="panel"${k === tab ? "" : ' tabindex="-1"'}>${l}${n === null ? "" : ` <span class="cnt">${n}</span>`}</a>`).join("")}</nav>
        <div id="panel" role="tabpanel" aria-labelledby="tab-${tab}"></div>`;
      this.panel();
    }
    panel() {
      const p = this.p, el = $("#panel"), ws = p.works(), pr = p.profile();
      if (this.tab === "projects") {
        const list = [...ws].sort(this.sort === "az" ? (a, b) => a.w.name.localeCompare(b.w.name) : this.sort === "new" ? (a, b) => ORDER.indexOf(a.w.update.when) - ORDER.indexOf(b.w.update.when) : () => 0);
        el.innerHTML = `<div class="sh" style="margin-top:16px"><h2 class="vh">Projects</h2><span class="n">${ws.length} projects · ${ws.filter((x) => x.lead).length} as lead</span><span class="tools"><span>Sort</span><select aria-label="Sort projects">${SORTS.map(([v, l]) => `<option value="${v}"${v === this.sort ? " selected" : ""}>${l}</option>`).join("")}</select></span></div><div class="grid" style="--cols:${isPhone() ? 1 : 4}">${list.map((x, i) => card(x.w, i)).join("")}</div>`;
      } else if (this.tab === "devlogs") {
        const ups = p.updates();
        el.innerHTML = `<section class="ups" aria-labelledby="pl-h"><h2 id="pl-h" class="vh">Dev logs</h2><ol>${ups.map((u, i) => `<li><span>${i ? "" : '<span class="new">new</span>'}<time><span class="dd">${dday(u.when)}</span>${esc(u.when)}</time></span><div><b><a href="${Paths.page(`project.html#${u.w.id}&updates`)}">${esc(u.what)}</a></b><p>${esc(u.w.name)} · ${esc(u.more)}</p></div></li>`).join("")}</ol></section>`;
      } else if (this.tab === "following") {
        const fol = Follows.list().map((id) => works.find((w) => w.id === id)).filter(Boolean);
        el.innerHTML = `<div class="sh" style="margin-top:16px"><h2 class="vh">Following</h2><span class="n">${fol.length} ${fol.length === 1 ? "project" : "projects"}</span></div>${fol.length ? `<div class="grid" style="--cols:${isPhone() ? 1 : 4}">${fol.map((w, i) => card(w, i)).join("")}</div>` : '<p class="empty">Follow a project to see it here</p>'}`;
      } else {
        const aw = p.awards();
        el.innerHTML = `<div class="desc" style="max-width:720px"><h2 class="dh">About ${esc(p.name)}</h2><p>${esc(pr.about)}</p><p><b>Into</b> ${esc([].concat(pr.into).join(", "))}</p><p><b>Tools</b> ${esc([].concat(pr.tools).join(", "))}</p><p><b>Open to</b> ${esc(pr.open)}</p><p><b>Joined</b> ${esc(pr.joined)}</p></div>${aw.length ? `<section class="box" style="max-width:720px;margin-top:24px;border:0"><h3>Awards</h3>${aw.map(([a, s, , w]) => `<div class="tm" style="display:block"><b>${esc(a)}</b><br><span>${esc(s)} · ${esc(w.name)}</span></div>`).join("")}</section>` : ""}`;
      }
      thai(el);
    }
    contactRows() { return this.ch.map(([, k, v]) => `<div class="crow"><b>${esc(k)}</b><span>${wb(v)}</span><button type="button" class="cp" data-v="${esc(v)}">${ic("copy")}<span>Copy</span></button></div>`).join(""); }
    closeContact(focus = true) {
      const b = $('[data-act="contact"][aria-expanded="true"]');
      $$(".cpop, .sheet, .sheet-scrim").forEach((e) => e.remove());
      $$('[data-act="contact"]').forEach((x) => x.setAttribute("aria-expanded", "false"));
      if (b && focus) b.focus();
    }
    openContact(btn) {
      const open = btn.getAttribute("aria-expanded") === "true";
      this.closeContact(false);
      if (open) { btn.focus(); return; }
      btn.setAttribute("aria-expanded", "true");
      if (isPhone()) {
        document.body.insertAdjacentHTML("beforeend", `<div class="sheet-scrim"></div><div class="sheet" role="dialog" aria-modal="true" aria-labelledby="cs-h"><div class="grab"></div><h4 id="cs-h" style="margin:0 0 4px;font:600 16px/1.3 var(--f)">Contact ${esc(this.p.name)}</h4>${this.contactRows()}<button type="button" class="btn btn--line" data-act="cclose" style="width:100%;margin-top:12px">Close</button></div>`);
        $(".sheet-scrim").addEventListener("click", () => this.closeContact());
      } else btn.closest(".acts").insertAdjacentHTML("beforeend", `<span class="cpop" role="dialog" aria-modal="false" aria-labelledby="cp-h"><h4 id="cp-h">Contact ${esc(this.p.name)}</h4><button type="button" class="x" data-act="cclose" aria-label="Close">${ic("x")}</button>${this.contactRows()}</span>`);
      const f = $(".cpop .cp, .sheet .cp"); if (f) f.focus();
    }
    wire() {
      wireCards(this.root, "Profile");
      document.addEventListener("click", (e) => {
        const b = e.target.closest("[data-act], .cp");
        if (!b) { if ($(".cpop") && !e.target.closest(".cpop")) this.closeContact(false); return; }
        if (b.matches(".cp")) { const done = () => { $("span", b).textContent = "Copied"; setTimeout(() => { if (b.isConnected) $("span", b).textContent = "Copy"; }, 1600); }; (navigator.clipboard ? navigator.clipboard.writeText(b.dataset.v) : Promise.reject()).then(done, done); return; }
        const a = b.dataset.act;
        if (a === "pfollow") { const on = People.toggle(this.p.name); b.setAttribute("aria-pressed", String(on)); $("span", b).textContent = on ? "Following" : "Follow"; $(".fcount").textContent = this.p.profile().followers + (on ? 1 : 0); }
        else if (a === "contact") this.openContact(b);
        else if (a === "cclose") this.closeContact();
      });
      this.root.addEventListener("change", (e) => { if (e.target.matches(".sh select")) { this.sort = e.target.value; this.panel(); } });
      this.root.addEventListener("keydown", (e) => {
        const t = e.target.closest('[role="tab"]'); if (!t || !["ArrowRight", "ArrowLeft"].includes(e.key)) return;
        const all = $$('[role="tab"]', this.root), i = all.indexOf(t), n = all[(i + (e.key === "ArrowRight" ? 1 : -1) + all.length) % all.length];
        e.preventDefault(); n.focus(); n.click();
      });
      addEventListener("keydown", (e) => { if (e.key === "Escape" && $(".cpop, .sheet")) this.closeContact(); });
      addEventListener("nest:follows", () => { if (this.p) this.render(this.p, this.tab); });
    }
  }

  const page = new ProfilePage($("#prof"));
  page.wire();
  const show = () => {
    const [h, tab] = decodeURIComponent(location.hash.slice(1)).split("/");
    const name = Person.find(h) || ME, same = page.p && page.p.name === name;
    page.closeContact(false);
    if (same) { page.tab = tab || "projects"; page.render(page.p, page.tab); const t = $(`#tab-${page.tab}`); if (t && document.activeElement && document.activeElement.matches('[role="tab"]')) t.focus(); }
    else { page.render(new Person(name), tab || "projects"); scrollTo({ top: 0, behavior: "auto" }); }
  };
  addEventListener("hashchange", show); addEventListener("nest:session", () => { if (page.p) page.render(page.p, page.tab); }); show();
})();
