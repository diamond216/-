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
  // words on this page (lang.js). Names, roles, mottos, "about me" texts, updates, awards and the room, genre and
  // tier names are a person's or a work's own and are printed as written.
  const L = window.NestLang, tx = (k, v) => L.t(k, v);
  L.add({
    en: {
      "pf.you": "You", "pf.rank": "best rank", "pf.projects": "projects", "pf.followers": "followers", "pf.awardsN": "awards",
      "pf.settings": "Profile settings", "pf.hi": "Say hi to {name}", "pf.follow": "Follow", "pf.following": "Following", "pf.tabs": "{name}'s profile",
      "pf.t.works": "Projects", "pf.t.updates": "Updates", "pf.t.favs": "Favourites", "pf.t.about": "About",
      "pf.public": "Everyone can see this", "pf.private": "Only you can see this",
      "pf.worksH": "Projects, best rank first", "pf.lead": "{n} as lead", "pf.leadTag": "Lead", "pf.postedH": "Everything {name} has posted",
      "pf.favsH": "Favourites", "pf.change": "Change", "pf.shared": "Shared by {name}", "pf.aboutH": "About {name}",
      "pf.into": "Into", "pf.tools": "Tools", "pf.openTo": "Open to", "pf.since": "On Hamster Nest since", "pf.awards": "Awards", "pf.contact": "Contact",
      "pf.latest": "Latest from {name}", "pf.allUps": "All {n} updates", "pf.about": "About", "pf.moreAbout": "More about {name}",
      "pf.empty": "Nothing saved yet. Tap the heart on any project to keep it here.", "pf.copy": "Copy {label}",
      "pf.copied": "Copied {v}", "pf.select": "Select and copy: {v}",
      "hi.q1": "Can I try it?", "hi.q2": "Want to team up?", "hi.q3": "Can we talk about investing?", "hi.q4": "Great work, keep going",
      "hi.title": "Say hi to {name}", "hi.sub": "{name} gets it in their inbox. Hamster Hub gets a copy.", "hi.msg": "Your message",
      "hi.ph": "Hi {name}, I saw your project and…", "hi.mail": "Where can {name} reply?", "hi.notNow": "Not now", "hi.send": "Send it over",
      "hi.errMsg": "Write a line or pick one above.", "hi.errMail": "That email doesn't look right. Check it and try again.",
      "hi.sent": "Sent to {name}", "hi.sentP": "This is a prototype, so nothing actually left the page. On the real site {name} would reply to {mail}.", "hi.done": "Done",
      "set.favsQ": "Who can see your favourites?", "set.me": "Only me", "set.meNote": "The Favourites tab shows only when you're signed in.",
      "set.all": "Everyone", "set.allNote": "Anyone who opens your profile can see what you saved.", "set.show": "Show on my profile",
      "set.contact": "Contact card", "set.phone": "Phone number", "set.cancel": "Cancel", "set.save": "Save",
      "set.savedPub": "Saved. Everyone can see your favourites now.", "set.savedPriv": "Saved. Only you can see your favourites.",
    },
    th: {
      "pf.you": "คุณ", "pf.rank": "อันดับสูงสุด", "pf.projects": "โปรเจกต์", "pf.followers": "ผู้ติดตาม", "pf.awardsN": "รางวัล",
      "pf.settings": "ตั้งค่าโปรไฟล์", "pf.hi": "ทักทาย {name}", "pf.follow": "ติดตาม", "pf.following": "กำลังติดตาม", "pf.tabs": "โปรไฟล์ของ {name}",
      "pf.t.works": "โปรเจกต์", "pf.t.updates": "อัปเดต", "pf.t.favs": "รายการโปรด", "pf.t.about": "เกี่ยวกับ",
      "pf.public": "ทุกคนเห็นรายการนี้ได้", "pf.private": "เห็นได้แค่คุณคนเดียว",
      "pf.worksH": "โปรเจกต์ เรียงจากอันดับสูงสุด", "pf.lead": "เป็นหัวหน้าทีม {n} ชิ้น", "pf.leadTag": "หัวหน้าทีม", "pf.postedH": "ทุกอย่างที่ {name} ลงไว้",
      "pf.favsH": "รายการโปรด", "pf.change": "เปลี่ยน", "pf.shared": "{name} แชร์รายการนี้", "pf.aboutH": "เกี่ยวกับ {name}",
      "pf.into": "ชอบทำ", "pf.tools": "เครื่องมือ", "pf.openTo": "เปิดรับ", "pf.since": "อยู่ที่ Hamster Nest ตั้งแต่", "pf.awards": "รางวัล", "pf.contact": "ติดต่อ",
      "pf.latest": "ล่าสุดจาก {name}", "pf.allUps": "อัปเดตทั้งหมด {n} รายการ", "pf.about": "เกี่ยวกับ", "pf.moreAbout": "อ่านเพิ่มเกี่ยวกับ {name}",
      "pf.empty": "ยังไม่มีอะไรที่บันทึกไว้ กดหัวใจที่ผลงานไหนก็ได้ แล้วมันจะมาอยู่ที่นี่", "pf.copy": "คัดลอก {label}",
      "pf.copied": "คัดลอก {v} แล้ว", "pf.select": "คัดลอกเองได้เลย: {v}",
      "hi.q1": "ขอลองเล่นได้ไหม", "hi.q2": "อยากร่วมทีมด้วยกันไหม", "hi.q3": "คุยเรื่องลงทุนกันได้ไหม", "hi.q4": "ผลงานเจ๋งมาก สู้ต่อนะ",
      "hi.title": "ทักทาย {name}", "hi.sub": "ข้อความจะไปถึงกล่องข้อความของ {name} และ Hamster Hub จะได้รับสำเนาด้วย", "hi.msg": "ข้อความของคุณ",
      "hi.ph": "สวัสดี {name} ฉันเห็นผลงานของคุณแล้ว…", "hi.mail": "ให้ {name} ตอบกลับทางไหน", "hi.notNow": "ไว้ก่อน", "hi.send": "ส่งเลย",
      "hi.errMsg": "เขียนสักบรรทัด หรือเลือกข้อความด้านบนก็ได้", "hi.errMail": "อีเมลนี้ดูไม่ถูกต้อง ลองเช็กอีกรอบนะ",
      "hi.sent": "ส่งถึง {name} แล้ว", "hi.sentP": "นี่เป็นเว็บต้นแบบ เลยยังไม่มีอะไรถูกส่งออกไปจริง ๆ ในเว็บจริง {name} จะตอบกลับไปที่ {mail}", "hi.done": "เรียบร้อย",
      "set.favsQ": "ใครดูรายการโปรดของคุณได้บ้าง", "set.me": "แค่ฉันคนเดียว", "set.meNote": "แท็บรายการโปรดจะโผล่เฉพาะตอนที่คุณเข้าสู่ระบบ",
      "set.all": "ทุกคน", "set.allNote": "ใครเปิดโปรไฟล์ของคุณก็เห็นสิ่งที่คุณบันทึกไว้", "set.show": "แสดงในโปรไฟล์ของฉัน",
      "set.contact": "การ์ดติดต่อ", "set.phone": "เบอร์โทรศัพท์", "set.cancel": "ยกเลิก", "set.save": "บันทึก",
      "set.savedPub": "บันทึกแล้ว ตอนนี้ทุกคนเห็นรายการโปรดของคุณ", "set.savedPriv": "บันทึกแล้ว ตอนนี้เห็นได้แค่คุณคนเดียว",
    },
  });
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
  const monthLabel = (s) => L.th ? new Date(`1 ${s} 12:00`).toLocaleDateString("th-TH", { month: "short", year: "numeric" }) : s;   // "Nov 2025" (the joined month)
  const dateLabel = (d) => new Date(d + "T00:00:00").toLocaleDateString(L.th ? "th-TH" : "en-GB", { day: "numeric", month: "short", year: "numeric" });

  // ---------- the page ----------
  class ProfilePage {
    constructor(root) { this.root = root; this.tab = "works"; this.following = false; }
    render(person, animate = true) {
      if (this.p && this.p.name !== person.name) this.following = false;
      this.p = person; const pr = person.profile(), mine = person.works(), ups = person.updates(), own = person.name === ME && NestSession.Session.signedIn;
      this.own = own; this.followers = pr.followers;
      const best = tiers.find((t) => t.id === mine[0].w.tier), set = own ? Settings.get() : { contact: true, phone: true };
      const showFavs = own || favsPublic(person.name), favs = own ? Favs.list() : othersFavs(person.name);
      document.title = `${pr.full} · Hamster Nest`;
      this.root.innerHTML = `
        <header class="pf__band">
          <div class="pf__id">${avatar(person.name)}<div>
            <p class="pf__h">@${esc(person.handle)}${own ? `<span class="pf__you">${tx("pf.you")}</span>` : ""}</p>
            <h1 class="pf__name">${esc(pr.full)}</h1>
            <p class="pf__role">${esc(pr.role)}</p>
            <p class="pf__motto">“${esc(pr.motto)}”</p></div></div>
          <div class="pf__right">
            <ul class="pf__stats">
              <li><b style="color:${RANK_INK[best.id]}">${best.name}</b><span>${tx("pf.rank")}</span></li>
              <li><b>${mine.length}</b><span>${tx("pf.projects")}</span></li>
              <li><b class="pf__fn">${this.followers + (this.following ? 1 : 0)}</b><span>${tx("pf.followers")}</span></li>
              <li><b>${person.awards().length + mine.filter((x) => x.lead).length}</b><span>${tx("pf.awardsN")}</span></li></ul>
            <div class="pf__acts">${own
              ? `<button type="button" class="pf__btn pf__btn--line" data-act="settings">${svg("gear")}${tx("pf.settings")}</button>`
              : `<button type="button" class="pf__btn pf__btn--solid" data-act="hi">${svg("hi", "0 0 20 20")}${tx("pf.hi", { name: person.name })}</button><button type="button" class="pf__btn pf__btn--line" data-act="follow" aria-pressed="${this.following}">${tx(this.following ? "pf.following" : "pf.follow")}</button>`}</div>
          </div>
        </header>
        <nav class="pf__tabs" role="tablist" aria-label="${esc(tx("pf.tabs", { name: person.name }))}">
          ${this.tabBtn("works", `${tx("pf.t.works")} <em>${mine.length}</em>`)}${this.tabBtn("updates", `${tx("pf.t.updates")} <em>${ups.length}</em>`)}
          ${showFavs ? this.tabBtn("favs", `${tx("pf.t.favs")} <em>${favs.length}</em>${own ? `<span class="pf__vis" title="${tx(set.favs === "public" ? "pf.public" : "pf.private")}">${svg(set.favs === "public" ? "globe" : "lock")}</span>` : ""}`) : ""}
          ${this.tabBtn("about", tx("pf.t.about"))}
        </nav>
        <div class="pf__body">
          <div class="pf__main">
            <section class="pf__panel" id="tab-works" role="tabpanel" aria-labelledby="t-works">
              <div class="pf__lh"><h2>${tx("pf.worksH")}</h2><span class="pf__note">${tx("pf.lead", { n: mine.filter((x) => x.lead).length })}</span></div>
              <div class="grid pf__grid" data-works></div>
            </section>
            <section class="pf__panel" id="tab-updates" role="tabpanel" aria-labelledby="t-updates" hidden>
              <div class="pf__lh"><h2>${esc(tx("pf.postedH", { name: person.name }))}</h2></div>
              <ol class="pf__feed">${ups.map((u) => `<li><time>${esc(L.ago(u.when))}</time><span class="pf__fw" style="--ri:${RANK_INK[u.w.tier]}"><a href="project.html#${u.w.id}">${esc(u.w.name)}</a></span><div><b>${esc(u.what)}</b><p>${esc(u.more)}</p></div></li>`).join("")}</ol>
            </section>
            ${showFavs ? `<section class="pf__panel" id="tab-favs" role="tabpanel" aria-labelledby="t-favs" hidden>
              <div class="pf__lh"><h2>${tx("pf.favsH")}</h2>${own ? `<span class="pf__chip">${svg(set.favs === "public" ? "globe" : "lock")}${tx(set.favs === "public" ? "pf.public" : "pf.private")}</span><button type="button" class="pf__link" data-act="settings">${tx("pf.change")}</button>` : `<span class="pf__chip">${svg("globe")}${esc(tx("pf.shared", { name: person.name }))}</span>`}</div>
              ${this.favGroups(favs)}
            </section>` : ""}
            <section class="pf__panel" id="tab-about" role="tabpanel" aria-labelledby="t-about" hidden>
              <div class="pf__lh"><h2>${esc(tx("pf.aboutH", { name: person.name }))}</h2></div>
              <p class="pf__aboutL">${esc(pr.about)}</p>
              <dl class="pf__facts"><div><dt>${tx("pf.into")}</dt><dd>${esc(pr.into)}</dd></div><div><dt>${tx("pf.tools")}</dt><dd>${esc(pr.tools)}</dd></div><div><dt>${tx("pf.openTo")}</dt><dd>${esc(pr.open)}</dd></div><div><dt>${tx("pf.since")}</dt><dd>${esc(monthLabel(pr.joined))}</dd></div></dl>
              ${person.awards().length ? `<h3 class="pf__sub">${tx("pf.awards")}</h3><ul class="pf__aw">${person.awards().map(([a, s, , w]) => `<li><span class="medal" aria-hidden="true">★</span><span><b>${esc(a)}</b><i>${esc(s)} · <a href="project.html#${w.id}">${esc(w.name)}</a></i></span></li>`).join("")}</ul>` : ""}
            </section>
          </div>
          <aside class="pf__side">
            ${set.contact ? `<section class="box contact" aria-labelledby="ct-h"><h3 id="ct-h">${tx("pf.contact")}</h3>
              <ul>${person.contact().filter(([k]) => k !== "phone" || set.phone).map(([k, label, value, href]) => `<li><span class="cv2"><i>${tx("ct." + k)}</i>${href ? `<a href="${href}">${esc(value).replace("@", "@<wbr>")}</a>` : `<b>${esc(value)}</b>`}</span><button type="button" class="cp" data-v="${esc(value)}" aria-label="${tx("pf.copy", { label: tx("ct." + k) })}">${svg("copy")}</button></li>`).join("")}</ul>
              <p class="contact__note" role="status" aria-live="polite"></p>
              ${own ? "" : `<button type="button" class="say" data-act="hi">${esc(tx("pf.hi", { name: person.name }))}</button>`}</section>` : ""}
            <section class="box"><h3>${esc(tx("pf.latest", { name: person.name }))}</h3><ol class="pf__ups">${ups.filter((u, i, a) => a.findIndex((x) => x.what === u.what) === i).slice(0, 4).map((u) => `<li><time>${esc(L.ago(u.when))}</time><span><b>${esc(u.what)}</b><a href="project.html#${u.w.id}">${esc(u.w.name)}</a></span></li>`).join("")}</ol>
              <button type="button" class="pf__link pf__more" data-tab="updates">${tx("pf.allUps", { n: ups.length })}</button></section>
            <section class="box"><h3>${tx("pf.about")}</h3><p class="pf__about">${esc(pr.about)}</p><button type="button" class="pf__link pf__more" data-tab="about">${esc(tx("pf.moreAbout", { name: person.name }))}</button></section>
          </aside>
        </div>`;
      // tiles
      const wg = $(".pf__grid[data-works]", this.root); mine.forEach((x) => wg.appendChild(this.tile(x.w, x.role, x.lead)));
      this.root.querySelectorAll(".pf__grid[data-fav]").forEach((g) => favs.filter((f) => f.saved === g.dataset.fav).forEach((f) => { const w = works.find((x) => x.id === f.id); if (w) g.appendChild(this.tile(w)); }));
      this.root.querySelectorAll(".pf__grid").forEach((g) => new Expander(g));
      this.wire(); this.show(this.tab in { works: 1, updates: 1, favs: 1, about: 1 } && (this.tab !== "favs" || showFavs) ? this.tab : "works", false);
      if (animate && !calm) [".pf__id", ".pf__right", ".pf__tabs", ".pf__main", ".pf__side"].forEach((s, i) => { const el = $(s, this.root); el && el.animate([{ opacity: 0, transform: "translateY(12px)" }, { opacity: 1, transform: "none" }], { duration: 480, delay: i * 60, easing: E, fill: "backwards" }); });
    }
    tabBtn(id, label) { return `<button type="button" role="tab" id="t-${id}" aria-controls="tab-${id}" data-tab="${id}" aria-selected="false" tabindex="-1">${label}</button>`; }
    // grouped by the day you saved them, newest day first (like a browsing history)
    favGroups(favs) {
      if (!favs.length) return `<p class="pf__empty">${tx("pf.empty")}</p>`;
      const days = [...new Set(favs.map((f) => f.saved))].sort().reverse();
      return days.map((d) => `<div class="pf__day"><h3>${dateLabel(d)}<em>${favs.filter((f) => f.saved === d).length}</em></h3><div class="grid pf__grid" data-fav="${d}"></div></div>`).join("");
    }
    // a Browse tile; on the Works tab it also shows the rank and their part in it
    tile(w, role, lead) {
      const el = new ResultCard(w).render();
      if (role) {
        const by = $(".rc__by i", el); if (by) by.textContent = role;
        const t = tiers.find((x) => x.id === w.tier);
        $(".rc__name", el).insertAdjacentHTML("afterend", `<p class="pf__rk" style="--ri:${RANK_INK[t.id]}"><i></i>${t.name}<span>${lead ? tx("pf.leadTag") : esc(role.split(",")[0])}</span></p>`);
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
      if (f) f.addEventListener("click", () => { const on = f.getAttribute("aria-pressed") !== "true"; this.following = on; f.setAttribute("aria-pressed", on); f.textContent = tx(on ? "pf.following" : "pf.follow"); $(".pf__fn", this.root).textContent = this.followers + (on ? 1 : 0); });
      this.root.querySelectorAll(".cp").forEach((b) => b.addEventListener("click", () => {
        const note = $(".contact__note", this.root), done = (m) => { note.textContent = m; b.innerHTML = svg("ok"); b.classList.add("is-done"); };
        navigator.clipboard.writeText(b.dataset.v).then(() => done(tx("pf.copied", { v: b.dataset.v })), () => done(tx("pf.select", { v: b.dataset.v })));
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
      const quick = ["hi.q1", "hi.q2", "hi.q3", "hi.q4"], nm = esc(name);
      this.el.innerHTML = `<form class="dlg__box" role="dialog" aria-modal="true" aria-labelledby="hi-h" novalidate>
        <div class="hi__to">${avatar(name, "hi__av")}<div><h2 id="hi-h" data-i18n="hi.title" data-name="${nm}">${esc(tx("hi.title", { name }))}</h2><p data-i18n="hi.sub" data-name="${nm}">${esc(tx("hi.sub", { name }))}</p></div></div>
        <div class="hi__quick">${quick.map((q) => `<button type="button" class="hi__q" data-i18n="${q}">${tx(q)}</button>`).join("")}</div>
        <label class="hi__l" for="hi-msg" data-i18n="hi.msg">${tx("hi.msg")}</label>
        <textarea id="hi-msg" rows="4" placeholder="${esc(tx("hi.ph", { name }))}" data-i18n-attr="placeholder:hi.ph" data-name="${nm}" required></textarea>
        <label class="hi__l" for="hi-mail" data-i18n="hi.mail" data-name="${nm}">${esc(tx("hi.mail", { name }))}</label>
        <input id="hi-mail" type="email" placeholder="you@example.com" required>
        <p class="hi__err" role="alert"></p>
        <div class="dlg__acts"><button type="button" class="ghost2" data-x data-i18n="hi.notNow">${tx("hi.notNow")}</button><button type="submit" class="solid2" data-i18n="hi.send">${tx("hi.send")}</button></div></form>`;
      const f = $("form", this.el), t = $("#hi-msg", this.el);
      this.el.querySelectorAll(".hi__q").forEach((q) => q.addEventListener("click", () => { t.value = (t.value ? t.value.trimEnd() + " " : "") + q.textContent; t.focus(); }));
      $("[data-x]", this.el).addEventListener("click", () => this.close());
      f.addEventListener("submit", (e) => {
        e.preventDefault();
        const err = $(".hi__err", this.el), mail = $("#hi-mail", this.el);
        const say = (k) => { err.dataset.i18n = k; err.textContent = tx(k); };
        if (!t.value.trim()) { say("hi.errMsg"); t.focus(); return; }
        if (!mail.checkValidity()) { say("hi.errMail"); mail.focus(); return; }
        f.innerHTML = `<div class="hi__done"><span class="hi__tick">${svg("ok")}</span><h2 data-i18n="hi.sent" data-name="${nm}">${esc(tx("hi.sent", { name }))}</h2><p data-i18n="hi.sentP" data-name="${nm}" data-mail="${esc(mail.value)}">${esc(tx("hi.sentP", { name, mail: mail.value }))}</p><div class="dlg__acts"><button type="button" class="solid2" data-x data-i18n="hi.done">${tx("hi.done")}</button></div></div>`;
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
      this.el.innerHTML = `<form class="dlg__box" role="dialog" aria-modal="true" aria-labelledby="set-h"><h2 id="set-h" data-i18n="pf.settings">${tx("pf.settings")}</h2>
        <fieldset><legend data-i18n="set.favsQ">${tx("set.favsQ")}</legend>
          <label class="rad"><input type="radio" name="favs" value="private"${s.favs === "private" ? " checked" : ""}><span><b>${svg("lock")}<span data-i18n="set.me">${tx("set.me")}</span></b><i data-i18n="set.meNote">${tx("set.meNote")}</i></span></label>
          <label class="rad"><input type="radio" name="favs" value="public"${s.favs === "public" ? " checked" : ""}><span><b>${svg("globe")}<span data-i18n="set.all">${tx("set.all")}</span></b><i data-i18n="set.allNote">${tx("set.allNote")}</i></span></label></fieldset>
        <fieldset><legend data-i18n="set.show">${tx("set.show")}</legend>
          <label class="sw"><span data-i18n="set.contact">${tx("set.contact")}</span><input type="checkbox" name="contact"${s.contact ? " checked" : ""}></label>
          <label class="sw"><span data-i18n="set.phone">${tx("set.phone")}</span><input type="checkbox" name="phone"${s.phone ? " checked" : ""}></label></fieldset>
        <div class="dlg__acts"><button type="button" class="ghost2" data-x data-i18n="set.cancel">${tx("set.cancel")}</button><button type="submit" class="solid2" data-i18n="set.save">${tx("set.save")}</button></div></form>`;
      const f = $("form", this.el);
      $("[data-x]", this.el).addEventListener("click", () => this.close());
      f.addEventListener("submit", (e) => {
        e.preventDefault();
        Settings.set({ favs: f.favs.value, contact: f.contact.checked, phone: f.phone.checked });
        this.close(); page.render(page.p); toast(tx(f.favs.value === "public" ? "set.savedPub" : "set.savedPriv"));
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
    extra: [["acct.settings", "settings"]],
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
  // a language switch redraws the page where it is: same person, same tab, same scroll position
  L.addEventListener("change", () => { const y = scrollY; page.render(page.p, false); scrollTo({ top: y, behavior: "auto" }); });
  const bar = $(".gbar"), onScroll = () => bar.classList.toggle("gbar--framed", scrollY > 240);
  addEventListener("scroll", onScroll, { passive: true }); onScroll();
  window.NestFavs = Favs;
})();
