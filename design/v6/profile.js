// Profile page: profile.html#<name>. Header on the water band, tabs (Works by rank, Updates, Favourites, About),
// side cards (Contact, Latest from them, About), Say hi and Follow, an account menu and a settings dialog.
// "You" are signed in as Pim in this prototype. Favourites and settings are kept in localStorage.
(function () {
  "use strict";
  const { works, tiers } = window.NEST;
  const { Person, seed } = window.Details;
  const { ResultCard, Expander, RANK_INK } = window.Tiles;
  const $ = (s, r = document) => r.querySelector(s);
  const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const E = "cubic-bezier(.2,.8,.2,1)";
  const ME = "Pim";
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

  // ---------- your own saved state ----------
  const Store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} },
  };
  // favourites: [{ id, saved: "YYYY-MM-DD" }]; seeded with a few so the tab is not empty
  const Favs = {
    list() { return Store.get("nest-favs", [["wheelsense", "2026-11-23"], ["nestboard", "2026-11-23"], ["moonwheel", "2026-11-20"], ["rain-jar", "2026-11-20"], ["sunflower-bank", "2026-11-16"], ["book-loop", "2026-11-16"], ["lantern-run", "2026-11-10"]].map(([id, saved]) => ({ id, saved }))); },
    has(id) { return this.list().some((f) => f.id === id); },
    toggle(id) { const l = this.list(), on = !l.some((f) => f.id === id); Store.set("nest-favs", on ? [{ id, saved: new Date().toISOString().slice(0, 10) }, ...l] : l.filter((f) => f.id !== id)); return on; },
  };
  const Settings = {
    get() { return Store.get("nest-settings", { favs: "private", contact: true, phone: true }); },
    set(v) { Store.set("nest-settings", v); },
  };
  // someone else's favourites are public or private by a fixed sample rule
  const favsPublic = (name) => (name === ME ? Settings.get().favs === "public" : seed(name, 2) === 0);
  const othersFavs = (name) => works.filter((w) => seed(w.id + name, 5) === 0).slice(0, 6).map((w, i) => ({ id: w.id, saved: ["2026-11-22", "2026-11-19", "2026-11-14"][i % 3] }));

  const ICON = {
    hi: '<path d="M3 5h14v9H8l-4 3z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/>',
    lock: '<rect x="3.5" y="7" width="9" height="6.5" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M5.5 7V5.5a2.5 2.5 0 015 0V7" fill="none" stroke="currentColor" stroke-width="1.4"/>',
    globe: '<circle cx="8" cy="8" r="5.6" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M2.5 8h11M8 2.4c1.8 2 1.8 9.2 0 11.2M8 2.4c-1.8 2-1.8 9.2 0 11.2" fill="none" stroke="currentColor" stroke-width="1.2"/>',
    copy: '<rect x="6" y="6" width="8" height="8" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M11 6V3.5a1 1 0 00-1-1H3.5a1 1 0 00-1 1V10a1 1 0 001 1H6" fill="none" stroke="currentColor" stroke-width="1.4"/>',
    ok: '<path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>',
    gear: '<circle cx="8" cy="8" r="2.2" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M8 1.8v1.6M8 12.6v1.6M1.8 8h1.6M12.6 8h1.6M3.6 3.6l1.1 1.1M11.3 11.3l1.1 1.1M3.6 12.4l1.1-1.1M11.3 4.7l1.1-1.1" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>',
  };
  const svg = (k, vb = "0 0 16 16") => `<svg viewBox="${vb}" aria-hidden="true">${ICON[k]}</svg>`;
  const avatar = (name, cls = "pf__av") => `<span class="${cls}" style="--h:${new Person(name).hue}" aria-hidden="true">${esc(name[0])}</span>`;
  const dateLabel = (d) => new Date(d + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

  // ---------- the page ----------
  class ProfilePage {
    constructor(root) { this.root = root; this.tab = "works"; }
    render(person) {
      this.p = person; const pr = person.profile(), mine = person.works(), ups = person.updates(), own = person.name === ME && NestSession.Session.signedIn;
      this.own = own; this.followers = pr.followers;
      const best = tiers.find((t) => t.id === mine[0].w.tier), set = own ? Settings.get() : { contact: true, phone: true };
      const showFavs = own || favsPublic(person.name), favs = own ? Favs.list() : othersFavs(person.name);
      document.title = `${pr.full} · Hamster Nest`;
      this.root.innerHTML = `
        <header class="pf__band">
          <div class="pf__id">${avatar(person.name)}<div>
            <p class="pf__h">@${esc(person.handle)}${own ? '<span class="pf__you">You</span>' : ""}</p>
            <h1 class="pf__name">${esc(pr.full)}</h1>
            <p class="pf__role">${esc(pr.role)}</p>
            <p class="pf__motto">“${esc(pr.motto)}”</p></div></div>
          <div class="pf__right">
            <ul class="pf__stats">
              <li><b style="color:${RANK_INK[best.id]}">${best.name}</b><span>best rank</span></li>
              <li><b>${mine.length}</b><span>projects</span></li>
              <li><b class="pf__fn">${this.followers}</b><span>followers</span></li>
              <li><b>${person.awards().length + mine.filter((x) => x.lead).length}</b><span>awards</span></li></ul>
            <div class="pf__acts">${own
              ? `<button type="button" class="pf__btn pf__btn--line" data-act="settings">${svg("gear")}Profile settings</button>`
              : `<button type="button" class="pf__btn pf__btn--solid" data-act="hi">${svg("hi", "0 0 20 20")}Say hi to ${esc(person.name)}</button><button type="button" class="pf__btn pf__btn--line" data-act="follow" aria-pressed="false">Follow</button>`}</div>
          </div>
        </header>
        <nav class="pf__tabs" role="tablist" aria-label="${esc(person.name)}'s profile">
          ${this.tabBtn("works", `Projects <em>${mine.length}</em>`)}${this.tabBtn("updates", `Updates <em>${ups.length}</em>`)}
          ${showFavs ? this.tabBtn("favs", `Favourites <em>${favs.length}</em>${own ? `<span class="pf__vis" title="${set.favs === "public" ? "Everyone can see this" : "Only you can see this"}">${svg(set.favs === "public" ? "globe" : "lock")}</span>` : ""}`) : ""}
          ${this.tabBtn("about", "About")}
        </nav>
        <div class="pf__body">
          <div class="pf__main">
            <section class="pf__panel" id="tab-works" role="tabpanel" aria-labelledby="t-works">
              <div class="pf__lh"><h2>Projects, best rank first</h2><span class="pf__note">${mine.filter((x) => x.lead).length} as lead</span></div>
              <div class="grid pf__grid" data-works></div>
            </section>
            <section class="pf__panel" id="tab-updates" role="tabpanel" aria-labelledby="t-updates" hidden>
              <div class="pf__lh"><h2>Everything ${esc(person.name)} has posted</h2></div>
              <ol class="pf__feed">${ups.map((u) => `<li><time>${esc(u.when)}</time><span class="pf__fw" style="--ri:${RANK_INK[u.w.tier]}"><a href="project.html#${u.w.id}">${esc(u.w.name)}</a></span><div><b>${esc(u.what)}</b><p>${esc(u.more)}</p></div></li>`).join("")}</ol>
            </section>
            ${showFavs ? `<section class="pf__panel" id="tab-favs" role="tabpanel" aria-labelledby="t-favs" hidden>
              <div class="pf__lh"><h2>Favourites</h2>${own ? `<span class="pf__chip">${svg(set.favs === "public" ? "globe" : "lock")}${set.favs === "public" ? "Everyone can see this" : "Only you can see this"}</span><button type="button" class="pf__link" data-act="settings">Change</button>` : `<span class="pf__chip">${svg("globe")}Shared by ${esc(person.name)}</span>`}</div>
              ${this.favGroups(favs)}
            </section>` : ""}
            <section class="pf__panel" id="tab-about" role="tabpanel" aria-labelledby="t-about" hidden>
              <div class="pf__lh"><h2>About ${esc(person.name)}</h2></div>
              <p class="pf__aboutL">${esc(pr.about)}</p>
              <dl class="pf__facts"><div><dt>Into</dt><dd>${esc(pr.into)}</dd></div><div><dt>Tools</dt><dd>${esc(pr.tools)}</dd></div><div><dt>Open to</dt><dd>${esc(pr.open)}</dd></div><div><dt>On Hamster Nest since</dt><dd>${esc(pr.joined)}</dd></div></dl>
              ${person.awards().length ? `<h3 class="pf__sub">Awards</h3><ul class="pf__aw">${person.awards().map(([a, s, , w]) => `<li><span class="medal" aria-hidden="true">★</span><span><b>${esc(a)}</b><i>${esc(s)} · <a href="project.html#${w.id}">${esc(w.name)}</a></i></span></li>`).join("")}</ul>` : ""}
            </section>
          </div>
          <aside class="pf__side">
            ${set.contact ? `<section class="box contact" aria-labelledby="ct-h"><h3 id="ct-h">Contact</h3>
              <ul>${person.contact().filter(([k]) => k !== "phone" || set.phone).map(([k, label, value, href]) => `<li><span class="cv2"><i>${label}</i>${href ? `<a href="${href}">${esc(value).replace("@", "@<wbr>")}</a>` : `<b>${esc(value)}</b>`}</span><button type="button" class="cp" data-v="${esc(value)}" aria-label="Copy ${label}">${svg("copy")}</button></li>`).join("")}</ul>
              <p class="contact__note" role="status" aria-live="polite"></p>
              ${own ? "" : `<button type="button" class="say" data-act="hi">Say hi to ${esc(person.name)}</button>`}</section>` : ""}
            <section class="box"><h3>Latest from ${esc(person.name)}</h3><ol class="pf__ups">${ups.filter((u, i, a) => a.findIndex((x) => x.what === u.what) === i).slice(0, 4).map((u) => `<li><time>${esc(u.when)}</time><span><b>${esc(u.what)}</b><a href="project.html#${u.w.id}">${esc(u.w.name)}</a></span></li>`).join("")}</ol>
              <button type="button" class="pf__link pf__more" data-tab="updates">All ${ups.length} updates</button></section>
            <section class="box"><h3>About</h3><p class="pf__about">${esc(pr.about)}</p><button type="button" class="pf__link pf__more" data-tab="about">More about ${esc(person.name)}</button></section>
          </aside>
        </div>`;
      // tiles
      const wg = $(".pf__grid[data-works]", this.root); mine.forEach((x) => wg.appendChild(this.tile(x.w, x.role, x.lead)));
      this.root.querySelectorAll(".pf__grid[data-fav]").forEach((g) => favs.filter((f) => f.saved === g.dataset.fav).forEach((f) => { const w = works.find((x) => x.id === f.id); if (w) g.appendChild(this.tile(w)); }));
      this.root.querySelectorAll(".pf__grid").forEach((g) => new Expander(g));
      this.wire(); this.show(this.tab in { works: 1, updates: 1, favs: 1, about: 1 } && (this.tab !== "favs" || showFavs) ? this.tab : "works", false);
      if (!calm) [".pf__id", ".pf__right", ".pf__tabs", ".pf__main", ".pf__side"].forEach((s, i) => { const el = $(s, this.root); el && el.animate([{ opacity: 0, transform: "translateY(12px)" }, { opacity: 1, transform: "none" }], { duration: 480, delay: i * 60, easing: E, fill: "backwards" }); });
    }
    tabBtn(id, label) { return `<button type="button" role="tab" id="t-${id}" aria-controls="tab-${id}" data-tab="${id}" aria-selected="false" tabindex="-1">${label}</button>`; }
    // grouped by the day you saved them, newest day first (like a browsing history)
    favGroups(favs) {
      if (!favs.length) return `<p class="pf__empty">Nothing saved yet. Tap the heart on any project to keep it here.</p>`;
      const days = [...new Set(favs.map((f) => f.saved))].sort().reverse();
      return days.map((d) => `<div class="pf__day"><h3>${dateLabel(d)}<em>${favs.filter((f) => f.saved === d).length}</em></h3><div class="grid pf__grid" data-fav="${d}"></div></div>`).join("");
    }
    // a Browse tile; on the Works tab it also shows the rank and their part in it
    tile(w, role, lead) {
      const el = new ResultCard(w).render();
      if (role) {
        const by = $(".rc__by i", el); if (by) by.textContent = role;
        const t = tiers.find((x) => x.id === w.tier);
        $(".rc__name", el).insertAdjacentHTML("afterend", `<p class="pf__rk" style="--ri:${RANK_INK[t.id]}"><i></i>${t.name}<span>${lead ? "Lead" : esc(role.split(",")[0])}</span></p>`);
      }
      return el;
    }
    show(tab, animate = true) {
      this.tab = tab;
      this.root.querySelectorAll('[role="tab"]').forEach((b) => { const on = b.dataset.tab === tab; b.setAttribute("aria-selected", on); b.tabIndex = on ? 0 : -1; });
      this.root.querySelectorAll(".pf__panel").forEach((p) => { const on = p.id === `tab-${tab}`; p.hidden = !on; if (on && animate && !calm) p.animate([{ opacity: 0, transform: "translateY(10px)" }, { opacity: 1, transform: "none" }], { duration: 320, easing: E }); });
    }
    wire() {
      const tabs = [...this.root.querySelectorAll('[role="tab"]')];
      tabs.forEach((b, i) => {
        b.addEventListener("click", () => this.show(b.dataset.tab));
        b.addEventListener("keydown", (e) => { const d = { ArrowRight: 1, ArrowLeft: -1 }[e.key]; if (!d) return; e.preventDefault(); const n = tabs[(i + d + tabs.length) % tabs.length]; n.focus(); this.show(n.dataset.tab); });
      });
      this.root.querySelectorAll(".pf__more").forEach((b) => b.addEventListener("click", () => { this.show(b.dataset.tab); $(".pf__tabs", this.root).scrollIntoView({ behavior: calm ? "auto" : "smooth", block: "start" }); }));
      this.root.querySelectorAll('[data-act="hi"]').forEach((b) => b.addEventListener("click", () => hello.open(this.p.name, b)));
      this.root.querySelectorAll('[data-act="settings"]').forEach((b) => b.addEventListener("click", () => settings.open(b)));
      const f = $('[data-act="follow"]', this.root);
      if (f) f.addEventListener("click", () => { const on = f.getAttribute("aria-pressed") !== "true"; f.setAttribute("aria-pressed", on); f.textContent = on ? "Following" : "Follow"; $(".pf__fn", this.root).textContent = this.followers + (on ? 1 : 0); });
      this.root.querySelectorAll(".cp").forEach((b) => b.addEventListener("click", () => {
        const note = $(".contact__note", this.root), done = (m) => { note.textContent = m; b.innerHTML = svg("ok"); b.classList.add("is-done"); };
        navigator.clipboard.writeText(b.dataset.v).then(() => done(`Copied ${b.dataset.v}`), () => done(`Select and copy: ${b.dataset.v}`));
      }));
    }
  }

  // ---------- Say hi: a short message straight to them; Hamster Hub gets a copy (decision 4) ----------
  class Hello {
    constructor() {
      this.el = document.createElement("div"); this.el.className = "dlg"; this.el.hidden = true;
      document.body.appendChild(this.el);
      this.el.addEventListener("click", (e) => { if (e.target === this.el) this.close(); });
      addEventListener("keydown", (e) => { if (e.key === "Escape" && !this.el.hidden) this.close(); });
    }
    open(name, back) {
      this.back = back;
      const quick = ["Can I try it?", "Want to team up?", "Can we talk about investing?", "Great work, keep going"];
      this.el.innerHTML = `<form class="dlg__box" role="dialog" aria-modal="true" aria-labelledby="hi-h" novalidate>
        <div class="hi__to">${avatar(name, "hi__av")}<div><h2 id="hi-h">Say hi to ${esc(name)}</h2><p>${esc(name)} gets it in their inbox. Hamster Hub gets a copy.</p></div></div>
        <div class="hi__quick">${quick.map((q) => `<button type="button" class="hi__q">${q}</button>`).join("")}</div>
        <label class="hi__l" for="hi-msg">Your message</label>
        <textarea id="hi-msg" rows="4" placeholder="Hi ${esc(name)}, I saw your project and…" required></textarea>
        <label class="hi__l" for="hi-mail">Where can ${esc(name)} reply?</label>
        <input id="hi-mail" type="email" placeholder="you@example.com" required>
        <p class="hi__err" role="alert"></p>
        <div class="dlg__acts"><button type="button" class="ghost2" data-x>Not now</button><button type="submit" class="solid2">Send it over</button></div></form>`;
      const f = $("form", this.el), t = $("#hi-msg", this.el);
      this.el.querySelectorAll(".hi__q").forEach((q) => q.addEventListener("click", () => { t.value = (t.value ? t.value.trimEnd() + " " : "") + q.textContent; t.focus(); }));
      $("[data-x]", this.el).addEventListener("click", () => this.close());
      f.addEventListener("submit", (e) => {
        e.preventDefault();
        const err = $(".hi__err", this.el), mail = $("#hi-mail", this.el);
        if (!t.value.trim()) { err.textContent = "Write a line or pick one above."; t.focus(); return; }
        if (!mail.checkValidity()) { err.textContent = "That email doesn't look right. Check it and try again."; mail.focus(); return; }
        f.innerHTML = `<div class="hi__done"><span class="hi__tick">${svg("ok")}</span><h2>Sent to ${esc(name)}</h2><p>This is a prototype, so nothing actually left the page. On the real site ${esc(name)} would reply to ${esc(mail.value)}.</p><div class="dlg__acts"><button type="button" class="solid2" data-x>Done</button></div></div>`;
        $("[data-x]", this.el).addEventListener("click", () => this.close()); $("[data-x]", this.el).focus();
      });
      this.el.hidden = false;
      if (!calm) $(".dlg__box", this.el).animate([{ opacity: 0, transform: "translateY(14px) scale(.98)" }, { opacity: 1, transform: "none" }], { duration: 300, easing: E });
      t.focus();
    }
    close() { this.el.hidden = true; if (this.back) this.back.focus(); }
  }

  // ---------- profile settings (only for your own profile) ----------
  class SettingsDialog {
    constructor() {
      this.el = document.createElement("div"); this.el.className = "dlg"; this.el.hidden = true; document.body.appendChild(this.el);
      this.el.addEventListener("click", (e) => { if (e.target === this.el) this.close(); });
      addEventListener("keydown", (e) => { if (e.key === "Escape" && !this.el.hidden) this.close(); });
    }
    open(back) {
      this.back = back; const s = Settings.get();
      this.el.innerHTML = `<form class="dlg__box" role="dialog" aria-modal="true" aria-labelledby="set-h"><h2 id="set-h">Profile settings</h2>
        <fieldset><legend>Who can see your favourites?</legend>
          <label class="rad"><input type="radio" name="favs" value="private"${s.favs === "private" ? " checked" : ""}><span><b>${svg("lock")}Only me</b><i>The Favourites tab shows only when you're signed in.</i></span></label>
          <label class="rad"><input type="radio" name="favs" value="public"${s.favs === "public" ? " checked" : ""}><span><b>${svg("globe")}Everyone</b><i>Anyone who opens your profile can see what you saved.</i></span></label></fieldset>
        <fieldset><legend>Show on my profile</legend>
          <label class="sw"><span>Contact card</span><input type="checkbox" name="contact"${s.contact ? " checked" : ""}></label>
          <label class="sw"><span>Phone number</span><input type="checkbox" name="phone"${s.phone ? " checked" : ""}></label></fieldset>
        <div class="dlg__acts"><button type="button" class="ghost2" data-x>Cancel</button><button type="submit" class="solid2">Save</button></div></form>`;
      const f = $("form", this.el);
      $("[data-x]", this.el).addEventListener("click", () => this.close());
      f.addEventListener("submit", (e) => {
        e.preventDefault();
        Settings.set({ favs: f.favs.value, contact: f.contact.checked, phone: f.phone.checked });
        this.close(); page.render(page.p); toast(f.favs.value === "public" ? "Saved. Everyone can see your favourites now." : "Saved. Only you can see your favourites.");
      });
      this.el.hidden = false;
      if (!calm) $(".dlg__box", this.el).animate([{ opacity: 0, transform: "translateY(14px) scale(.98)" }, { opacity: 1, transform: "none" }], { duration: 300, easing: E });
      $("input:checked", this.el).focus();
    }
    close() { this.el.hidden = true; if (this.back && this.back.isConnected) this.back.focus(); }
  }

  const toast = (msg) => {
    const t = document.createElement("p"); t.className = "toast"; t.setAttribute("role", "status"); t.textContent = msg; document.body.appendChild(t);
    t.animate([{ opacity: 0, transform: "translate(-50%,10px)" }, { opacity: 1, transform: "translate(-50%,0)" }], { duration: 250, easing: E, fill: "forwards" }).finished
      .then(() => t.animate([{ opacity: 1 }, { opacity: 1 }], { duration: 2600 }).finished).then(() => t.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300, fill: "forwards" }).finished).then(() => t.remove());
  };

  const page = new ProfilePage($("#main")), hello = new Hello(), settings = new SettingsDialog();
  // the shared account menu (session.js), plus Settings; Your profile / Favourites open the right tab here
  NestSession.menuOptions = {
    extra: [["Settings", "settings"]],
    onPick(go, e) {
      const me = new Person(ME);
      if (go === "settings") { e.preventDefault(); if (page.own) settings.open($(".me__btn")); else { page.tab = "works"; location.hash = me.handle; queueMicrotask(() => settings.open($(".me__btn"))); } return; }
      page.tab = go; if (location.hash.slice(1) === me.handle) { e.preventDefault(); page.show(go); $(".pf__tabs").scrollIntoView({ behavior: calm ? "auto" : "smooth" }); }
    },
  };
  addEventListener("nest:session", () => show());
  const show = () => {
    const name = Person.find(decodeURIComponent(location.hash.slice(1))) || ME;
    page.render(new Person(name)); scrollTo({ top: 0, behavior: "auto" });
  };
  addEventListener("hashchange", show); show();
  const bar = $(".gbar"), onScroll = () => bar.classList.toggle("gbar--framed", scrollY > 240);
  addEventListener("scroll", onScroll, { passive: true }); onScroll();
  window.NestFavs = Favs;
})();
