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

  const GOOD = [
    ["name", "A name and one line", "Say what it is in one sentence a classmate would get. “Dig, fight and get lost underground with a friend” beats “An innovative co-op experience.”"],
    ["cover", "A cover that shows the real thing", "A screenshot, a photo of the gadget, or the first page of the plan. No logos on a blank background."],
    ["clip", "A short clip of someone using it", "Ten to sixty seconds. Phone video is fine. Works with a clip get far more “Say hi” messages."],
    ["team", "Everyone on the team, with a role", "“Pim, lead and game design” tells an investor who to talk to. Add teammates by name."],
    ["about", "Three short paragraphs", "How it started, what it does, what's next. Credit any art, music or code you didn't make (rule 1) and say what AI helped with (rule 8)."],
    ["link", "Something people can try", "A download, a web link, or the plan as a PDF. Early versions are welcome if they open (rule 10)."],
  ];
  const AFTER = [
    ["Hamster Hub reads it", "An admin looks at every new work within two days and checks it against the rules."],
    ["It gets a tier", "Most new works start in Bronze. Strong work can start higher. Posting updates moves it up."],
    ["Or you get a note", "If something needs to change, you get a comment and the rule it's about. Fix it and send it again; there's no limit."],
    ["Then keep it moving", "Post an update whenever something changes. Works that update often rise to the top of Browse."],
  ];

  function build() {
    el = document.createElement("div"); el.className = "dlg gd"; el.hidden = true;
    el.innerHTML = `<div class="dlg__box gd__box" role="dialog" aria-modal="true" aria-labelledby="gd-h">
      <div class="gd__top"><div><p class="gd__k">Posting guide</p><h2 id="gd-h">How to post on Hamster Nest</h2></div><button type="button" class="gd__x" aria-label="Close the guide">×</button></div>
      <nav class="gd__tabs" role="tablist">
        <button type="button" role="tab" data-g="good" aria-selected="true">A good post</button>
        <button type="button" role="tab" data-g="rules" aria-selected="false">The rules <em>${RULES.length}</em></button>
        <button type="button" role="tab" data-g="after" aria-selected="false">After you post</button></nav>
      <div class="gd__body">
        <section data-p="good" role="tabpanel"><div class="gd__ex">
            <div class="gd__card"><span class="gd__pic"><span class="cv"></span><b class="pin" data-n="2">2</b><b class="pin pin--c" data-n="3">3</b></span>
              <p class="gd__n">Burrow Knights <b class="pin pin--i" data-n="1">1</b></p><p class="gd__l">Dig, fight, and get lost underground with a friend.</p>
              <p class="gd__team"><span>P</span><span>K</span>Pim, lead · Kaew, pixel art <b class="pin pin--i" data-n="4">4</b></p>
              <p class="gd__dl">Free download · Windows, Web <b class="pin pin--i" data-n="6">6</b></p></div>
            <ol class="gd__list">${GOOD.map(([, t, d], i) => `<li><b class="pin">${i + 1}</b><div><b>${t}</b><p>${d}</p></div></li>`).join("")}</ol></div></section>
        <section data-p="rules" role="tabpanel" hidden><p class="gd__intro">Every work is checked against these. If one isn't met, an admin tells you which and what to change.</p>
          <ol class="gd__rules">${RULES.map((r) => `<li id="rule-${r.id}"><details><summary><span class="gd__no">${r.id}</span><span><b>${esc(r.title)}</b><i>${esc(r.short)}</i></span></summary>
            <div class="gd__more"><p>${esc(r.detail)}</p><p class="gd__fix"><b>If it's flagged:</b> ${esc(r.fix)}</p></div></details></li>`).join("")}</ol></section>
        <section data-p="after" role="tabpanel" hidden><ol class="gd__after">${AFTER.map(([t, d], i) => `<li><span class="gd__no">${i + 1}</span><div><b>${t}</b><p>${d}</p></div></li>`).join("")}</ol></section>
      </div>
      <div class="gd__foot"><label class="gd__hide"><input type="checkbox"> Don't open this when I start a new project</label><button type="button" class="post" data-close>Start posting</button></div></div>`;
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
  // called when someone starts a new project
  function auto() { if (!hidden()) open("good"); }
  // post.html#rules or #rule-3 opens straight to the rules
  const fromHash = () => { const m = location.hash.match(/^#rules?(?:-(\d+))?$/); if (m) open("rules", m[1]); };
  addEventListener("load", fromHash); addEventListener("hashchange", fromHash);
  return { open, auto, close };
})();
