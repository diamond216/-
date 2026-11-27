// Posting guide: a dialog with three parts (a good post, the rules, what happens after).
// Opens by itself when someone starts a new project (unless they ticked "don't show again"),
// from the "Posting guide" button any time, and on post.html#rules straight to the rules.
window.NestGuide = (function () {
  "use strict";
  const RULES = window.NestRules, $ = (s, r = document) => r.querySelector(s);
  const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const E = "cubic-bezier(.2,.8,.2,1)", KEY = "nest-guide-hide";
  const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  let el = null, back = null;

  // words in the guide (lang.js). The sample card in "A good post" is a made-up work and stays as written.
  const L = window.NestLang, tx = (k, v) => L.t(k, v);
  const GOOD = ["name", "cover", "clip", "team", "about", "link"];
  const AFTER = [1, 2, 3, 4];
  L.add({
    en: {
      "gd.k": "Posting guide", "gd.h": "How to post on Hamster Nest", "gd.close": "Close the guide",
      "gd.tGood": "A good post", "gd.tRules": "The rules", "gd.tAfter": "After you post",
      "gd.intro": "Every project is checked against these. If one isn't met, an admin tells you which and what to change.", "gd.flagged": "If it's flagged:",
      "gd.hide": "Don't open this when I start a new project", "gd.start": "Start posting",
      "gd.good.name": "A name and one line", "gd.good.name.d": "Say what it is in one sentence a classmate would get. “Dig, fight and get lost underground with a friend” beats “An innovative co-op experience.”",
      "gd.good.cover": "A cover that shows the real thing", "gd.good.cover.d": "A screenshot, a photo of the gadget, or the first page of the plan. No logos on a blank background.",
      "gd.good.clip": "A short clip of someone using it", "gd.good.clip.d": "Ten to sixty seconds. Phone video is fine. Projects with a clip get far more “Say hi” messages.",
      "gd.good.team": "Everyone on the team, with a role", "gd.good.team.d": "“Pim, lead and game design” tells an investor who to talk to. Add teammates by name.",
      "gd.good.about": "Three short paragraphs", "gd.good.about.d": "How it started, what it does, what's next. Credit any art, music or code you didn't make (rule 1) and say what AI helped with (rule 8).",
      "gd.good.link": "Something people can try", "gd.good.link.d": "A download, a web link, or the plan as a PDF. Early versions are welcome if they open (rule 10).",
      "gd.after.1": "Hamster Hub reads it", "gd.after.1.d": "An admin looks at every new project within two days and checks it against the rules.",
      "gd.after.2": "It gets a tier", "gd.after.2.d": "Most new projects start in Bronze. Strong ones can start higher. Posting updates moves it up.",
      "gd.after.3": "Or you get a note", "gd.after.3.d": "If something needs to change, you get a comment and the rule it's about. Fix it and send it again; there's no limit.",
      "gd.after.4": "Then keep it moving", "gd.after.4.d": "Post an update whenever something changes. Projects that update often rise to the top of Browse.",
    },
    th: {
      "gd.k": "คู่มือการลงผลงาน", "gd.h": "ลงผลงานบน Hamster Nest ยังไง", "gd.close": "ปิดคู่มือ",
      "gd.tGood": "ก่อนโพสต์", "gd.tRules": "กติกา", "gd.tAfter": "หลังโพสต์",
      "gd.intro": "ทุกโปรเจกต์จะถูกตรวจตามข้อเหล่านี้ ถ้าข้อไหนยังไม่ผ่าน แอดมินจะบอกว่าข้อไหน และต้องแก้อะไร", "gd.flagged": "ถ้าโดนทัก:",
      "gd.hide": "ไม่ต้องเปิดคู่มือนี้ตอนฉันเริ่มโปรเจกต์ใหม่", "gd.start": "เริ่มลงผลงาน",
      "gd.good.name": "ชื่อและคำแนะนำหนึ่งบรรทัด", "gd.good.name.d": "บอกว่ามันคืออะไรด้วยประโยคเดียวที่เพื่อนในห้องฟังแล้วเข้าใจ “Dig, fight and get lost underground with a friend” ชัดกว่า “An innovative co-op experience.” เยอะ",
      "gd.good.cover": "ภาพปกที่เป็นของจริง", "gd.good.cover.d": "ภาพหน้าจอ รูปถ่ายอุปกรณ์ หรือหน้าแรกของแผน ไม่ต้องเป็นแค่โลโก้บนพื้นว่าง ๆ",
      "gd.good.clip": "คลิปสั้น ๆ ตอนมีคนใช้งาน", "gd.good.clip.d": "สิบถึงหกสิบวินาที ถ่ายด้วยมือถือก็ได้ โปรเจกต์ที่มีคลิปจะได้ข้อความทักทายมากกว่าเยอะ",
      "gd.good.team": "ทุกคนในทีม พร้อมบทบาท", "gd.good.team.d": "“Pim, lead and game design” ช่วยให้นักลงทุนรู้ว่าควรคุยกับใคร เพิ่มเพื่อนร่วมทีมด้วยชื่อได้เลย",
      "gd.good.about": "สามย่อหน้าสั้น ๆ", "gd.good.about.d": "เริ่มต้นยังไง ทำอะไรได้ ต่อไปจะทำอะไร ใส่เครดิตภาพ เพลง หรือโค้ดที่ไม่ได้ทำเอง (ข้อ 1) และบอกว่า AI ช่วยตรงไหน (ข้อ 8)",
      "gd.good.link": "อะไรสักอย่างให้คนลองได้", "gd.good.link.d": "ไฟล์ดาวน์โหลด ลิงก์เว็บ หรือแผนเป็น PDF เวอร์ชันแรก ๆ ก็ยินดี ขอแค่เปิดได้ (ข้อ 10)",
      "gd.after.1": "Hamster Hub อ่านผลงานของคุณ", "gd.after.1.d": "แอดมินดูทุกโปรเจกต์ใหม่ภายในสองวัน และตรวจกับกติกา",
      "gd.after.2": "ได้ระดับ", "gd.after.2.d": "โปรเจกต์ใหม่ส่วนใหญ่เริ่มที่ Bronze ตัวที่แข็งแรงอาจเริ่มสูงกว่านั้น และการลงอัปเดตจะดันอันดับขึ้น",
      "gd.after.3": "หรือได้ข้อความกลับมา", "gd.after.3.d": "ถ้ามีอะไรต้องแก้ คุณจะได้ความเห็นพร้อมบอกว่าเป็นกติกาข้อไหน แก้แล้วส่งใหม่ได้ ไม่จำกัดครั้ง",
      "gd.after.4": "แล้วอัปเดตต่อเรื่อย ๆ", "gd.after.4.d": "มีอะไรเปลี่ยนก็ลงอัปเดตเลย โปรเจกต์ที่อัปเดตบ่อยจะขึ้นไปอยู่บนสุดของหน้าสำรวจ",
    },
  });
  // a rule in the current language (rules.js keeps the English text and a Thai set)
  const rule = (r) => (L.th && r.th ? { ...r, ...r.th } : r);

  function build() {
    el = document.createElement("div"); el.className = "dlg gd"; el.hidden = true;
    el.innerHTML = `<div class="dlg__box gd__box" role="dialog" aria-modal="true" aria-labelledby="gd-h">
      <div class="gd__top"><div><p class="gd__k">${tx("gd.k")}</p><h2 id="gd-h">${tx("gd.h")}</h2></div><button type="button" class="gd__x" aria-label="${tx("gd.close")}">×</button></div>
      <nav class="gd__tabs" role="tablist">
        <button type="button" role="tab" data-g="good" aria-selected="true">${tx("gd.tGood")}</button>
        <button type="button" role="tab" data-g="rules" aria-selected="false">${tx("gd.tRules")} <em>${RULES.length}</em></button>
        <button type="button" role="tab" data-g="after" aria-selected="false">${tx("gd.tAfter")}</button></nav>
      <div class="gd__body">
        <section data-p="good" role="tabpanel"><div class="gd__ex">
            <div class="gd__card"><span class="gd__pic"><span class="cv"></span><b class="pin" data-n="2">2</b><b class="pin pin--c" data-n="3">3</b></span>
              <p class="gd__n">Burrow Knights <b class="pin pin--i" data-n="1">1</b></p><p class="gd__l">Dig, fight, and get lost underground with a friend.</p>
              <p class="gd__team"><span>P</span><span>K</span>Pim, lead · Kaew, pixel art <b class="pin pin--i" data-n="4">4</b></p>
              <p class="gd__dl">Free download · Windows, Web <b class="pin pin--i" data-n="6">6</b></p></div>
            <ol class="gd__list">${GOOD.map((k, i) => `<li><b class="pin">${i + 1}</b><div><b>${tx("gd.good." + k)}</b><p>${tx("gd.good." + k + ".d")}</p></div></li>`).join("")}</ol></div></section>
        <section data-p="rules" role="tabpanel" hidden><p class="gd__intro">${tx("gd.intro")}</p>
          <ol class="gd__rules">${RULES.map(rule).map((r) => `<li id="rule-${r.id}"><details><summary><span class="gd__no">${r.id}</span><span><b>${esc(r.title)}</b><i>${esc(r.short)}</i></span></summary>
            <div class="gd__more"><p>${esc(r.detail)}</p><p class="gd__fix"><b>${tx("gd.flagged")}</b> ${esc(r.fix)}</p></div></details></li>`).join("")}</ol></section>
        <section data-p="after" role="tabpanel" hidden><ol class="gd__after">${AFTER.map((k, i) => `<li><span class="gd__no">${i + 1}</span><div><b>${tx("gd.after." + k)}</b><p>${tx("gd.after." + k + ".d")}</p></div></li>`).join("")}</ol></section>
      </div>
      <div class="gd__foot"><label class="gd__hide"><input type="checkbox"> ${tx("gd.hide")}</label><button type="button" class="post" data-close>${tx("gd.start")}</button></div></div>`;
    document.body.appendChild(el);
    const w = window.NEST.works.find((x) => x.id === "burrow-knights");
    Art.fill($(".gd__pic .cv", el), w, 2);
    el.querySelectorAll("[data-g]").forEach((b, i, all) => {
      b.addEventListener("click", () => tab(b.dataset.g));
      b.addEventListener("keydown", (e) => { const d = { ArrowRight: 1, ArrowLeft: -1 }[e.key]; if (!d) return; const n = all[(i + d + all.length) % all.length]; n.focus(); tab(n.dataset.g); });
    });
    $(".gd__x", el).addEventListener("click", close); $("[data-close]", el).addEventListener("click", close);
    el.addEventListener("click", (e) => { if (e.target === el) close(); });
    addEventListener("keydown", (e) => { if (e.key === "Escape" && !el.hidden) close(); });
    const hide = $(".gd__hide input", el); hide.checked = hidden();
    hide.addEventListener("change", () => { try { localStorage.setItem(KEY, hide.checked ? "1" : ""); } catch (e) {} });
  }
  function tab(g, rule) {
    el.querySelectorAll("[data-g]").forEach((b) => { b.setAttribute("aria-selected", b.dataset.g === g); b.tabIndex = b.dataset.g === g ? 0 : -1; });
    el.querySelectorAll("[data-p]").forEach((p) => (p.hidden = p.dataset.p !== g));
    $(".gd__body", el).scrollTop = 0;
    if (rule) { const d = $(`#rule-${rule} details`, el); if (d) { d.open = true; d.scrollIntoView({ block: "center" }); } }
  }
  function hidden() { try { return localStorage.getItem(KEY) === "1"; } catch (e) { return false; } }
  function open(which = "good", rule) {
    if (!el) build();
    back = document.activeElement; el.hidden = false; document.documentElement.classList.add("gd-on"); tab(which, rule);
    if (!calm) $(".gd__box", el).animate([{ opacity: 0, transform: "translateY(16px) scale(.98)" }, { opacity: 1, transform: "none" }], { duration: 320, easing: E });
    $(`[data-g="${which}"]`, el).focus();
  }
  function close() { if (!el || el.hidden) return; el.hidden = true; document.documentElement.classList.remove("gd-on"); if (back && back.isConnected) back.focus(); }
  // the language changed while the guide exists: build it again in the new words, on the same tab
  L.addEventListener("change", () => {
    if (!el) return;
    const was = !el.hidden, on = $("[data-g][aria-selected='true']", el)?.dataset.g || "good", scroll = $(".gd__body", el).scrollTop;
    el.remove(); el = null; build(); tab(on); $(".gd__body", el).scrollTop = scroll;
    if (was) { el.hidden = false; $(`[data-g="${on}"]`, el).focus(); }
  });
  // called when someone starts a new project
  function auto() { if (!hidden()) open("good"); }
  // post.html#rules or #rule-3 opens straight to the rules
  // post.html#after opens "After you post" (the footer's "How ranking works")
  const fromHash = () => { const m = location.hash.match(/^#rules?(?:-(\d+))?$/); if (m) open("rules", m[1]); else if (location.hash === "#after") open("after"); };
  addEventListener("load", fromHash); addEventListener("hashchange", fromHash);
  return { open, auto, close };
})();
