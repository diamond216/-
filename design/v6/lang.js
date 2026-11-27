// One language switch for every page of the prototype (EN / ไทย).
//   NestLang.add({ en: {...}, th: {...} })   a page or part registers its own words (keys are "part.thing")
//   NestLang.t("key", { n: 3 })               the text in the current language; {n} is filled from the vars
//   NestLang.ago("5 days ago")                a sample "when" in the current language
//   NestLang.set("th")                        switch: remembers the choice, redraws every [data-i18n] and fires "change"
//   NestLang.addEventListener("change", fn)   parts that draw their own text in JS redraw here
// In HTML:  data-i18n="key" sets the text, data-i18n-attr="aria-label:key,placeholder:key" sets attributes,
//           data-n="3" fills {n}; a button with data-set-lang="th" switches (its aria-pressed follows the language).
//   NestLang.room("IoT") / NestLang.genre("Smart farm")   the label for a room or genre name (the one table below);
//                                                         the name itself stays the key for filters, URLs and lookups
// Never translated (the works and their names): project names and texts, makers, teams, mottos, awards, comments
// and tier names (Platinum ... Bronze). They are not put through t(); they are printed as written.
// The choice lives in localStorage "nest-lang" (the old hero key "hamster-nest-lang" is read once as a fallback).
// Load this first in <head>: it sets <html lang> before the page paints.
window.NestLang = (function () {
  "use strict";
  const KEY = "nest-lang", OLD_KEY = "hamster-nest-lang";
  const clean = (v) => (v === "th" ? "th" : "en");

  class Lang extends EventTarget {
    constructor() {
      super();
      this.words = { en: {}, th: {} };
      this.code = this.stored();
      document.documentElement.lang = this.code;
      addEventListener("storage", (e) => { if (e.key === KEY && e.newValue && clean(e.newValue) !== this.code) this.set(e.newValue, false); });
      document.addEventListener("click", (e) => {
        const b = e.target.closest && e.target.closest("[data-set-lang]");
        if (b) this.set(b.dataset.setLang);
      });
      const ready = () => this.apply();
      document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", ready) : ready();
    }
    // the saved choice; the old hero key is read once and moved to the new one
    stored() {
      try {
        const now = localStorage.getItem(KEY);
        if (now) return clean(now);
        const old = localStorage.getItem(OLD_KEY);
        if (old) { localStorage.setItem(KEY, clean(old)); return clean(old); }
      } catch (e) {}
      return "en";
    }
    get th() { return this.code === "th"; }
    get() { return this.code; }
    add(dict) { ["en", "th"].forEach((c) => Object.assign(this.words[c], dict[c] || {})); return this; }
    t(key, vars = {}) {
      const s = this.words[this.code][key] ?? this.words.en[key] ?? key;
      return s.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "");
    }
    // the label for a room or genre name; a name with no entry is printed as it came
    room(name) { return this.name("room", name); }
    genre(name) { return this.name("genre", name); }
    name(kind, name) { return this.words[this.code][`${kind}.${name}`] ?? name; }
    // "5 days ago", "last week", "yesterday" ...; anything it does not know is printed as it came
    ago(when) {
      if (!this.th) return when;
      const m = /^(\d+) (day|week|month)s? ago$/.exec(when);
      if (m) return this.t(`ago.${m[2]}`, { n: m[1] });
      const k = { "today": "today", "yesterday": "yesterday", "last week": "lastWeek", "last month": "lastMonth" }[when];
      return k ? this.t(`ago.${k}`) : when;
    }
    set(next, save = true) {
      this.code = clean(next);
      if (save) { try { localStorage.setItem(KEY, this.code); } catch (e) {} }
      this.apply();
      this.dispatchEvent(new Event("change"));
    }
    // writes the current language into everything under root that carries data-i18n / data-i18n-attr
    apply(root = document) {
      document.documentElement.lang = this.code;
      root.querySelectorAll("[data-i18n]").forEach((el) => { el.textContent = this.t(el.dataset.i18n, el.dataset); });
      root.querySelectorAll("[data-i18n-attr]").forEach((el) => el.dataset.i18nAttr.split(",").forEach((pair) => {
        const [attr, key] = pair.split(":"); el.setAttribute(attr, this.t(key, el.dataset));
      }));
      document.querySelectorAll("[data-set-lang]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.setLang === this.code)));
    }
  }

  const lang = new Lang();

  // ---------- room and genre names: the one table every page reads (English names are the keys used by filters and data) ----------
  lang.add({
    th: {
      "room.Game": "เกม", "room.Web": "เว็บ", "room.IoT": "ไอโอที", "room.Idea": "ไอเดีย",
      "genre.Roguelike": "Roguelike", "genre.Puzzle": "ปริศนา", "genre.Casual": "เล่นสบาย ๆ", "genre.Co-op": "เล่นเป็นทีม",
      "genre.Smart farm": "ฟาร์มอัจฉริยะ", "genre.Water": "น้ำ", "genre.Wearable": "อุปกรณ์สวมใส่", "genre.Smart home": "บ้านอัจฉริยะ",
      "genre.SaaS": "SaaS", "genre.Ecommerce": "ร้านค้าออนไลน์", "genre.Dev tool": "เครื่องมือนักพัฒนา", "genre.School": "โรงเรียน",
      "genre.Fintech": "ฟินเทค", "genre.Logistics": "โลจิสติกส์", "genre.Community": "ชุมชน",
    },
  });
  // English prints the name as it is (so data-i18n="room.Game" works too)
  lang.add({ en: Object.fromEntries(Object.keys(lang.words.th).filter((k) => /^(room|genre)\./.test(k)).map((k) => [k, k.replace(/^\w+\./, "")])) });

  // ---------- words every page shares: the bar, the account menu, the footer, "not built yet" notes ----------
  lang.add({
    en: {
      "title.browse": "Browse · Hamster Nest", "title.devlogs": "Dev logs · Hamster Nest", "title.post": "Post your project · Hamster Nest",
      "nav.aria": "Main", "nav.browse": "Browse", "nav.devlogs": "Dev logs", "nav.about": "About",
      "brand.home": "Hamster Nest home",
      "search.ph": "Search projects, dev logs and makers", "search.short": "Search", "search.aria": "Search Hamster Nest", "search.clear": "Clear the search",
      "lang.aria": "Language",
      "acct.signin": "Sign in", "acct.login": "Log in", "acct.signup": "Sign up", "acct.either": "Log in or sign up", "acct.account": "Your account",
      "acct.profile": "Your profile", "acct.post": "Post your project", "acct.favs": "Favourites", "acct.logout": "Log out", "acct.settings": "Settings",
      "toast.in": "Signed in as {name}", "toast.out": "Logged out", "toast.soon": "\"{label}\" isn't built yet",
      "gate.title": "Sign in to post your project", "gate.text": "Posting is free for every Hamster Hub student. Sign in and your draft is saved as you go.", "gate.back": "Back to Browse",
      "foot.tag": "a technology community", "foot.touch": "Get in touch", "foot.contacts": "Contacts",
      "foot.anim": "Animations", "foot.on": "On", "foot.off": "Off",
      "foot.how": "How we pick", "foot.rank": "How ranking works", "foot.invest": "For investors", "foot.post": "Post your work",
      "foot.rooms": "Rooms", "foot.help": "Help", "foot.home": "Home", "foot.course": "Course", "foot.activity": "Activity",
      "foot.privacy": "Privacy", "foot.cookies": "Cookies",
      "foot.copy": "© 2026 Hamster Hub. All rights reserved. Projects, names and quotes on this draft are placeholders.",
      "ct.email": "Email", "ct.phone": "Phone", "ct.line": "LINE",
      "ago.today": "today", "ago.yesterday": "yesterday", "ago.lastWeek": "last week", "ago.lastMonth": "last month",
      "ago.day": "{n} days ago", "ago.week": "{n} weeks ago", "ago.month": "{n} months ago",
    },
    th: {
      "title.browse": "สำรวจผลงาน · Hamster Nest", "title.devlogs": "บันทึกการพัฒนา · Hamster Nest", "title.post": "ลงผลงานของคุณ · Hamster Nest",
      "nav.aria": "เมนูหลัก", "nav.browse": "สำรวจผลงาน", "nav.devlogs": "บันทึกการพัฒนา", "nav.about": "เกี่ยวกับ",
      "brand.home": "Hamster Nest หน้าแรก",
      "search.ph": "ค้นหาโปรเจกต์ บันทึก และผู้สร้าง", "search.short": "ค้นหา", "search.aria": "ค้นหาใน Hamster Nest", "search.clear": "ล้างคำค้นหา",
      "lang.aria": "ภาษา",
      "acct.signin": "เข้าสู่ระบบ", "acct.login": "เข้าสู่ระบบ", "acct.signup": "สมัครสมาชิก", "acct.either": "เข้าสู่ระบบหรือสมัครสมาชิก", "acct.account": "บัญชีของคุณ",
      "acct.profile": "โปรไฟล์ของคุณ", "acct.post": "ลงผลงานของคุณ", "acct.favs": "รายการโปรด", "acct.logout": "ออกจากระบบ", "acct.settings": "ตั้งค่า",
      "toast.in": "เข้าสู่ระบบเป็น {name} แล้ว", "toast.out": "ออกจากระบบแล้ว", "toast.soon": "“{label}” ยังไม่เปิดให้ใช้",
      "gate.title": "เข้าสู่ระบบก่อนลงผลงาน", "gate.text": "นักเรียน Hamster Hub ลงผลงานได้ฟรีทุกคน เข้าสู่ระบบแล้วร่างของคุณจะถูกบันทึกให้ระหว่างที่เขียน", "gate.back": "กลับไปสำรวจผลงาน",
      "foot.tag": "ชุมชนคนรักเทคโนโลยี", "foot.touch": "ติดต่อเรา", "foot.contacts": "ช่องทางติดต่อ",
      "foot.anim": "แอนิเมชัน", "foot.on": "เปิด", "foot.off": "ปิด",
      "foot.how": "เราเลือกผลงานยังไง", "foot.rank": "จัดอันดับยังไง", "foot.invest": "สำหรับนักลงทุน", "foot.post": "ลงผลงานของคุณ",
      "foot.rooms": "ห้อง", "foot.help": "ช่วยเหลือ", "foot.home": "หน้าแรก", "foot.course": "คอร์สเรียน", "foot.activity": "กิจกรรม",
      "foot.privacy": "ความเป็นส่วนตัว", "foot.cookies": "คุกกี้",
      "foot.copy": "© 2026 Hamster Hub สงวนลิขสิทธิ์ โปรเจกต์ ชื่อ และคำพูดในหน้าตัวอย่างนี้เป็นข้อมูลสมมติ",
      "ct.email": "อีเมล", "ct.phone": "โทรศัพท์", "ct.line": "LINE",
      "ago.today": "วันนี้", "ago.yesterday": "เมื่อวาน", "ago.lastWeek": "สัปดาห์ที่แล้ว", "ago.lastMonth": "เดือนที่แล้ว",
      "ago.day": "{n} วันก่อน", "ago.week": "{n} สัปดาห์ก่อน", "ago.month": "{n} เดือนก่อน",
    },
  });
  return lang;
})();
