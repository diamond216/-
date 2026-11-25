// Hamster Nest prototype: who is signed in, the paths between pages, and the parts every page shares
// (account menu, footer, "not built yet" note). Loaded by hero/index.html and every page in design/v6/.
//   Session      sign-in state in localStorage ("nest-session"); fires "nest:session" on window when it changes
//   Paths        absolute links to pages, worked out from where this file lives, so they hold from any folder
//   AccountMenu  the avatar menu (or Log in / Sign up), one per page; pages add items with opts.extra / opts.onPick
//   Footer       the dark Hamster Hub footer, filled into <footer class="foot nest-foot">
//   gate()       swaps a page's content for a short note when it needs sign-in or the admin view
window.NestSession = (function () {
  "use strict";
  const BASE = new URL(".", document.currentScript.src);          // .../design/v6/
  const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const hue = (s) => [...s].reduce((n, c) => n + c.charCodeAt(0), 0) % 360;   // same as Person.hue in details.js

  const Paths = {
    page: (name) => new URL(name, BASE).href,
    home: (hash = "") => new URL("../../hero/index.html" + hash, BASE).href,
    browse: (room) => Paths.home(room ? `#browse-${room.toLowerCase()}` : "#browse-page"),
  };

  // the two people you can be in the prototype
  const PEOPLE = {
    maker: { name: "Pim", full: "Pim Srisuk", handle: "pim", line: "@pim" },
    admin: { name: "Arm", full: "Arm", handle: "arm", line: "Admin · Hamster Hub" },
  };

  const KEY = "nest-session";
  const Session = {
    read() { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } },
    get signedIn() { return !!this.read().in; },
    get role() { return this.read().role === "admin" ? "admin" : "maker"; },
    get user() { return PEOPLE[this.role]; },
    is(role) { return this.signedIn && this.role === role; },
    signIn(role = "maker") { this.write({ in: true, role }); },
    signOut() { this.write({}); },
    write(s) { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} dispatchEvent(new CustomEvent("nest:session")); },
  };
  addEventListener("storage", (e) => { if (e.key === KEY) dispatchEvent(new CustomEvent("nest:session")); });

  const avatar = (u, cls) => `<span class="${cls}" style="--h:${hue(u.name)}" aria-hidden="true">${esc(u.name[0])}</span>`;
  const sameDoc = (href) => { const a = new URL(href, location.href), b = new URL(location.href); return a.pathname === b.pathname && a.hash === b.hash; };

  // ---------- account menu ----------
  // new AccountMenu(slot) draws Log in / Sign up, or the avatar button and its menu, into slot (every page's .acct).
  // opts.extra = [[label, go]] adds page-only items; opts.onPick(go, event) handles them (and may handle works/favs);
  // opts.requires = true sends you home when you log out (pages that need you signed in).
  class AccountMenu {
    constructor(slot, opts = {}) {
      this.slot = slot; this.o = opts; this.wrap = this.btn = this.menu = null;
      document.addEventListener("click", (e) => { if (this.menu && !this.menu.hidden && !e.composedPath().includes(this.wrap)) this.open(false); });
      addEventListener("keydown", (e) => { if (e.key === "Escape" && this.menu && !this.menu.hidden) { this.open(false); this.btn.focus(); } });
      addEventListener("nest:session", () => this.render());
      this.render();
    }
    items() {
      const u = Session.user;
      if (Session.role === "admin") return [
        ["Review queue", Paths.page("admin.html")], ["Posting guide and rules", Paths.page("post.html#rules")], ["Browse", Paths.home("#browse-page")], "hr",
        ["Back to Pim's account", null, "maker"], "hr", ["Log out", null, "out"]];
      return [
        ["Your profile", Paths.page(`profile.html#${u.handle}`), "works"], ["Post your work", Paths.page("post.html")],
        ["Favourites", Paths.page(`profile.html#${u.handle}`), "favs"], "hr",
        ...(this.o.extra || []).map(([label, go]) => [label, null, go]),
        ["Switch to admin view", null, "admin"], "hr", ["Log out", null, "out"]];
    }
    render() {
      this.menu = null;
      if (!Session.signedIn) {
        this.slot.innerHTML = `<a class="gbtn glass" href="#" data-in>Log in</a><a class="gbtn gbtn--solid" href="#" data-in>Sign up</a>`;
        this.slot.querySelectorAll("[data-in]").forEach((a) => a.addEventListener("click", (e) => { e.preventDefault(); Session.signIn(); toast(`Signed in as ${Session.user.name}`); }));
        return;
      }
      this.slot.innerHTML = `<div class="me"><button type="button" class="me__btn" aria-haspopup="menu" aria-expanded="false" aria-label="Your account">${avatar(Session.user, "me__av")}<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M3 4.5l3 3 3-3" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></button><div class="me__menu" role="menu" hidden></div></div>`;
      this.wrap = this.slot.firstElementChild; this.btn = this.wrap.firstElementChild; this.menu = this.wrap.lastElementChild;
      this.btn.addEventListener("click", () => this.open(this.menu.hidden));
      this.fill();
    }
    fill() {
      const u = Session.user;
      let marked = false;
      this.menu.innerHTML = `<div class="me__head">${avatar(u, "me__big")}<b>${esc(u.full)}</b><i>${esc(u.line)}</i></div>` + this.items().map((it) => {
        if (it === "hr") return "<hr>";
        const [label, href, go] = it, here = href && !marked && sameDoc(href);
        if (here) marked = true;
        return href ? `<a role="menuitem" href="${href}"${go ? ` data-go="${go}"` : ""}${here ? ' aria-current="page"' : ""}>${esc(label)}</a>`
          : `<button type="button" role="menuitem" data-go="${go}">${esc(label)}</button>`;
      }).join("");
      this.menu.querySelectorAll("[data-go]").forEach((a) => a.addEventListener("click", (e) => this.pick(a.dataset.go, e)));
    }
    pick(go, e) {
      this.open(false);
      if (go === "out") { Session.signOut(); toast("Logged out"); if (this.o.requires) location.href = Paths.home(); return; }
      if (go === "admin") { Session.signIn("admin"); location.href = Paths.page("admin.html"); return; }
      if (go === "maker") { Session.signIn("maker"); location.href = Paths.page("profile.html#pim"); return; }
      if (this.o.onPick) this.o.onPick(go, e);
    }
    open(on) {
      if (!this.menu) return;
      this.menu.hidden = !on; this.btn.setAttribute("aria-expanded", on);
      if (on) {
        if (!calm) this.menu.animate([{ opacity: 0, transform: "translateY(-6px)" }, { opacity: 1, transform: "none" }], { duration: 200, easing: "cubic-bezier(.2,.8,.2,1)" });
        this.menu.querySelector("[role=menuitem]").focus();
      }
    }
  }

  // ---------- footer ----------
  const ICON = {
    fb: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-1.6 19.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.3v7A10 10 0 0 0 12 2z"/></svg>',
    line: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="15" rx="4" fill="currentColor"/><path d="M7 9v4M7 13h2.5M11.5 9v4M14 13V9l3 4V9" stroke="#111116" stroke-width="1.5" fill="none" stroke-linecap="round"/></svg>',
    tel: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1z"/></svg>',
    ig: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17.3" cy="6.7" r="1.2" fill="currentColor"/></svg>',
  };
  class Footer {
    constructor(el) {
      const col = (h, links) => `<div><h4>${h}</h4>${links.map(([t, href]) => `<a href="${href}">${t}</a>`).join("")}</div>`;
      el.id = el.id || "contact-page";
      el.innerHTML = `<div class="wrap foot__top" id="about-page">
        <div class="foot__brand"><svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="19" fill="#FFD24A"/><circle cx="11" cy="12" r="5" fill="#F2A65A"/><circle cx="29" cy="12" r="5" fill="#F2A65A"/><ellipse cx="20" cy="23" rx="13" ry="11" fill="#F2A65A"/><ellipse cx="20" cy="27" rx="9" ry="7" fill="#FBEBDD"/><circle cx="15" cy="21" r="1.8" fill="#1A1A20"/><circle cx="25" cy="21" r="1.8" fill="#1A1A20"/></svg>
          <div><strong>Hamster Hub</strong><span>a technology community</span></div></div>
        <div class="foot__contact"><small>Get in touch</small><h3>Contacts</h3><ul>
          <li>${ICON.fb}Hamster Hub</li><li>${ICON.line}@smart-school</li><li>${ICON.tel}090-060-2555</li><li>${ICON.ig}hamsterhub_ig</li></ul></div></div>
        <div class="wrap foot__links">
          ${col("Hamster Nest", [["How we pick", Paths.page("post.html#rules")], ["How ranking works", Paths.page("post.html#after")], ["For investors", "#"], ["Post your work", Paths.page("post.html")]])}
          ${col("Rooms", ["Game", "IoT", "Web", "Idea"].map((r) => [r, Paths.browse(r)]))}
          ${col("Hamster Hub", [["Home", Paths.home()], ["Course", "#"], ["Activity", "#"], ["About", "#"]])}
          ${col("Help", [["Get in touch", "#contact-page"], ["Privacy", "#"], ["Cookies", "#"]])}
        </div>
        <p class="foot__copy">© 2026 Hamster Hub. All rights reserved. Projects, names and quotes on this draft are placeholders.</p>`;
    }
  }

  // ---------- works sent from the post page, read by the admin review queue (this computer only) ----------
  const SENT = "nest-sent";
  const Submissions = {
    list() { try { return JSON.parse(localStorage.getItem(SENT)) || []; } catch (e) { return []; } },
    add(it) { const a = [it, ...this.list()].slice(0, 20); try { localStorage.setItem(SENT, JSON.stringify(a)); } catch (e) {} },
    clear() { try { localStorage.removeItem(SENT); } catch (e) {} },
  };
  // "2 min ago" for a time stamp
  const ago = (t) => { const m = Math.round((Date.now() - t) / 60000); return m < 1 ? "just now" : m < 60 ? `${m} min ago` : m < 1440 ? `${Math.round(m / 60)} h ago` : `${Math.round(m / 1440)} days ago`; };

  // ---------- small note at the bottom of the screen ----------
  function toast(msg) {
    const t = document.createElement("p"); t.className = "nest-toast"; t.setAttribute("role", "status"); t.textContent = msg; document.body.appendChild(t);
    const a = (k, o) => t.animate(k, o).finished;
    a([{ opacity: 0, transform: "translate(-50%,10px)" }, { opacity: 1, transform: "translate(-50%,0)" }], { duration: calm ? 1 : 250, fill: "forwards" })
      .then(() => a([{ opacity: 1 }, { opacity: 1 }], { duration: 2200 }))
      .then(() => a([{ opacity: 1 }, { opacity: 0 }], { duration: 300, fill: "forwards" })).then(() => t.remove());
  }
  // links to pages that don't exist yet say so instead of jumping to the top
  document.addEventListener("click", (e) => {
    const a = e.target.closest && e.target.closest('a[href="#"]');
    if (a && !a.hasAttribute("data-in")) { e.preventDefault(); toast(`"${a.textContent.trim()}" isn't built yet`); }
  });

  // ---------- pages that need you signed in, or in the admin view ----------
  function gate(main, need) {
    if (need === "admin" ? Session.is("admin") : Session.signedIn) return true;
    const admin = need === "admin";
    main.innerHTML = `<section class="gate"><span class="gate__ic" aria-hidden="true">${admin ? "★" : "✎"}</span>
      <h1>${admin ? "The review queue is for Hamster Hub admins" : "Sign in to post your work"}</h1>
      <p>${admin ? "Admins read every new work, give it a tier or send it back with a note. In this prototype you can switch to the admin view from your account menu, or here." : "Posting is free for every Hamster Hub student. Sign in and your draft is saved as you go."}</p>
      <div class="gate__acts"><button type="button" class="post">${admin ? "Switch to admin view" : "Sign in"}</button><a class="ghost3" href="${Paths.home("#browse-page")}">Back to Browse</a></div></section>`;
    main.querySelector(".gate .post").addEventListener("click", () => { Session.signIn(admin ? "admin" : "maker"); location.reload(); });
    return false;
  }

  // every page: fill the footer and the account area once the page's own scripts have run
  // (a page that needs its own menu items sets NestSession.menuOptions before then)
  const api = { Session, Paths, AccountMenu, Footer, Submissions, ago, gate, toast, hue, menuOptions: {} };
  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("footer.nest-foot").forEach((f) => new Footer(f));
    const slot = document.querySelector(".acct");
    if (slot) api.menu = new AccountMenu(slot, api.menuOptions);
  });
  return api;
})();
