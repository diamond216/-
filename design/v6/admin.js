// Admin review queue (layout A, chosen 24 Nov 2026). Left: works waiting, approved or turned down. Right: the work,
// the screening checks, then Approve (with a tier) or Reject (a comment is required; pick the rules it breaks).
// Decisions are kept in localStorage so a refresh keeps them; "Reset the sample queue" brings the queue back.
(function () {
  "use strict";
  const { works, tiers } = window.NEST;
  const { Person } = window.Details;
  const RULES = window.NestRules;
  const INK = window.Tiles.RANK_INK;
  const $ = (s, r = document) => r.querySelector(s);
  const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const E = "cubic-bezier(.2,.8,.2,1)";
  const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const ADMIN = "Arm";                                        // the signed-in admin in this prototype

  // ---------- sample submissions: new versions of existing works, so each has pictures ----------
  const SAMPLE = [
    ["lantern-run-2", "Lantern Run 2", "lantern-run", "Pond", ["Pond", "Fern"], "2 h ago", "A cave that changes every night, now for two players with one lantern.", "We built the first Lantern Run in a jam. This one adds a second player and a new boss. The music is from a free pack (credited below).", "https://example.itch.io/lantern-run-2"],
    ["bus-ping-mini", "Bus Ping Mini", "bus-ping", "Ice", ["Ice", "Joy"], "5 h ago", "A keyring that buzzes when your bus is two stops away.", "Same idea as Bus Ping, small enough for a bag. It uses the school's open bus data.", ""],
    ["homework-radar-teachers", "Homework Radar for Teachers", "homework-radar", "Nine", ["Nine"], "yesterday", "Teachers post homework once; every class sees it on one page.", "Teachers asked for their own view. They can post to many classes at once.", "https://example.github.io/radar"],
    ["snack-fund-plus", "Snack Fund Plus", "snack-fund", "Gift", ["Gift", "May"], "yesterday", "Save for the class party, and bet on who brings the best snack.", "Everyone puts in 20 baht a week. The best snack each Friday wins the pot.", ""],
    ["frog-hop-online", "Frog Hop Online", "frog-hop", "Ming", ["Ming"], "2 days ago", "Get the frog home, now against friends online.", "Online play with up to four friends. Art taken from a popular frog game.", "https://example.itch.io/frog-hop-online"],
    ["rain-jar-3", "Rain Jar v3", "rain-jar", "Win", ["Win", "Ohm"], "3 days ago", "Measures the rain on the roof and posts it to the class chat.", "New case, longer battery life, and a chart of the month.", ""],
  ];
  const CHECKS = ["Everyone on the team is a Hamster Hub member", "It works as the one line says", "The clip or pictures show the real thing", "No one else's art, music or code without credit", "There's a way to reach the team"];
  const KEY = "nest-admin-decisions";
  const Decisions = {
    all() { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } },
    set(id, d) { const a = this.all(); a[id] = d; try { localStorage.setItem(KEY, JSON.stringify(a)); } catch (e) {} },
    drop(id) { const a = this.all(); delete a[id]; try { localStorage.setItem(KEY, JSON.stringify(a)); } catch (e) {} },
    clear() { try { localStorage.removeItem(KEY); } catch (e) {} },
  };
  // two sample items arrive already decided, so the other tabs aren't empty
  const SEEDED = { "rain-jar-3": { status: "approved", tier: "gold", by: "Arm", when: "yesterday" },
    "snack-fund-plus": { status: "rejected", rules: [7], note: "Betting on snacks with real money counts as a money game. Keep the saving part and drop the bet, then send it again.", by: "Arm", when: "yesterday" } };

  class Queue {
    constructor() {
      // works sent from the post page come first (newest on top); their pictures stay on the maker's computer,
      // so the queue shows a work from the same room and genre in their place
      const sent = NestSession.Submissions.list().map((s) => ({ ...s, sent: NestSession.ago(s.at), mine: true,
        base: works.find((w) => w.room === s.room && w.genre === s.genre) || works.find((w) => w.room === s.room) || works[0] }));
      this.items = [...sent, ...SAMPLE.map(([id, name, base, maker, team, sent, line, about, link]) => ({ id, name, base: works.find((w) => w.id === base), maker, team, sent, line, about, link }))];
    }
    status(it) { return (Decisions.all()[it.id] || SEEDED[it.id] || { status: "waiting" }); }
    by(st) { return this.items.filter((it) => this.status(it).status === st); }
  }

  class AdminPage {
    constructor(root) { this.root = root; this.q = new Queue(); this.tab = "waiting"; this.sel = null; this.render(); }
    render() {
      const waiting = this.q.by("waiting");
      this.root.innerHTML = `
        <div class="ad__head"><div><p class="ad__kicker">Admin</p><h1>Review queue</h1><p>Approve new works and give each a tier, or turn them down with a reason. Every decision is saved with your name.</p></div>
          <ul class="ad__stats"><li><b>${waiting.length}</b><span>waiting</span></li><li><b>${this.q.by("approved").length}</b><span>approved</span></li><li><b>${this.q.by("rejected").length}</b><span>turned down</span></li></ul></div>
        <nav class="atabs" role="tablist" aria-label="Queue">${[["waiting", "Waiting"], ["approved", "Approved"], ["rejected", "Turned down"]].map(([id, l]) =>
          `<button type="button" role="tab" data-tab="${id}" aria-selected="${this.tab === id}">${l} <em>${this.q.by(id).length}</em></button>`).join("")}
          <button type="button" class="pf__link ad__reset">Reset the sample queue</button></nav>
        <div class="ad__split"><ol class="aql" aria-label="Works"></ol><div class="adt" aria-live="polite"></div></div>`;
      this.root.querySelectorAll("[data-tab]").forEach((b) => b.addEventListener("click", () => { this.tab = b.dataset.tab; this.sel = null; this.render(); }));
      $(".ad__reset", this.root).addEventListener("click", () => { Decisions.clear(); NestSession.Submissions.clear(); this.tab = "waiting"; this.sel = null; this.render(); toast("The sample queue is back to how it started."); });
      this.list();
    }
    list() {
      const items = this.q.by(this.tab), ol = $(".aql", this.root);
      if (!this.sel || !items.some((i) => i.id === this.sel)) this.sel = items[0]?.id || null;
      ol.innerHTML = items.length ? items.map((it) => {
        const s = this.q.status(it);
        return `<li><button type="button" class="aq" data-id="${it.id}" aria-current="${it.id === this.sel}"><span class="cv" data-id="${it.base.id}"></span>
          <span class="aq__t"><b>${esc(it.name)}</b><i>${it.base.room} · ${it.base.genre} · ${esc(it.maker)}</i></span>
          <span class="aq__s">${s.status === "approved" ? `<span class="st st--approved" style="--ri:${INK[s.tier]}"><i></i>${tiers.find((t) => t.id === s.tier).name}</span>` : s.status === "rejected" ? `<span class="st st--rejected">Turned down</span>` : `<span class="st st--new">New</span>`}<time>${esc(it.sent)}</time></span></button></li>`;
      }).join("") : `<li class="aq__empty">${this.tab === "waiting" ? "Nothing waiting. Nice work." : "Nothing here yet."}</li>`;
      ol.querySelectorAll(".cv").forEach((el) => Art.fill(el, works.find((w) => w.id === el.dataset.id)));
      ol.querySelectorAll(".aq").forEach((b) => b.addEventListener("click", () => { this.sel = b.dataset.id; ol.querySelectorAll(".aq").forEach((x) => x.setAttribute("aria-current", x === b)); this.detail(); }));
      this.detail();
    }
    detail() {
      const box = $(".adt", this.root), it = this.q.items.find((i) => i.id === this.sel);
      if (!it) { box.innerHTML = `<p class="adt__empty">Pick a work on the left.</p>`; return; }
      const s = this.q.status(it), w = it.base;
      box.innerHTML = `
        <div class="adt__head"><div><p class="adt__meta">${it.room || w.room} · ${it.genre || w.genre} · sent ${esc(it.sent)} by <a href="profile.html#${it.maker.toLowerCase()}">${esc(it.maker)}</a></p><h2>${esc(it.name)}</h2><p class="adt__line">${esc(it.line)}</p></div>
          ${it.link ? `<a class="ghost3 sm" href="${esc(it.link)}" target="_blank" rel="noopener">Open their link ↗</a>` : `<span class="adt__nolink">No link to try</span>`}</div>
        <div class="adt__gal"><span class="cv" data-k="1"></span><span class="cv" data-k="2"></span><span class="cv" data-k="3"></span></div>
        <div class="adt__info"><section><h3>About, as they wrote it</h3><p>${esc(it.about)}</p></section>
          <section><h3>Team</h3><ul class="adt__team">${it.team.map((n) => `<li><span class="av3" style="--h:${new Person(n).hue}">${esc(n[0])}</span><a href="profile.html#${n.toLowerCase()}">${esc(n)}</a></li>`).join("")}</ul></section></div>
        ${s.status === "waiting" ? this.decide(it) : this.record(it, s)}`;
      box.querySelectorAll(".adt__gal .cv").forEach((el) => Art.fill(el, { ...w, scribble: "" }, +el.dataset.k));
      if (!calm) box.animate([{ opacity: 0, transform: "translateY(8px)" }, { opacity: 1, transform: "none" }], { duration: 260, easing: E });
      if (s.status === "waiting") this.wireDecide(box, it);
      else $(".adt__undo", box)?.addEventListener("click", () => { Decisions.drop(it.id); this.tab = "waiting"; this.sel = it.id; this.render(); toast(`${it.name} is back in the waiting list.`); });
    }
    decide(it) {
      return `<div class="adt__cols">
          <section><h3>Screening checks</h3><ul class="ach">${CHECKS.map((c, i) => `<li><label><input type="checkbox" data-c="${i}"><span>${c}</span></label></li>`).join("")}</ul>
            <p class="hint">Ticks are for you. They don't block a decision.</p></section>
          <section class="dec"><div class="dec__tabs" role="radiogroup" aria-label="Decision">
              <button type="button" role="radio" aria-checked="true" data-d="approve">Approve</button><button type="button" role="radio" aria-checked="false" data-d="reject">Reject</button></div>
            <div class="dec__p" data-p="approve"><h3>Tier</h3>
              <div class="tp" role="radiogroup" aria-label="Tier">${tiers.map((t) => `<button type="button" role="radio" aria-checked="${t.id === "bronze"}" data-t="${t.id}" style="--ri:${INK[t.id]}"><i></i>${t.name}</button>`).join("")}</div>
              <p class="hint">New works usually start in Bronze and climb as they post updates. Pick higher for work that's already strong.</p>
              <label class="fld"><span class="fld__l">Note to the team <em>Optional</em></span><textarea name="anote" rows="3" placeholder="Something they did well, or one thing to try next."></textarea></label>
              <div class="adt__acts"><button type="button" class="post" data-go="approve">Approve as <span>Bronze</span></button></div></div>
            <div class="dec__p" data-p="reject" hidden><h3>Which rules does it break?</h3>
              <ul class="rl">${RULES.map((r) => `<li><label><input type="checkbox" value="${r.id}"><span><b>${r.id}. ${esc(r.title)}</b><i>${esc(r.short)}</i></span></label></li>`).join("")}</ul>
              <label class="fld"><span class="fld__l">Comment to the team <em>Required</em></span><textarea name="rnote" rows="4" required placeholder="Say what to change so it can go up. Be kind; they're students."></textarea><span class="fld__h rmin"></span></label>
              <div class="rprev" hidden><h3>What ${esc(it.maker)} will see</h3><div class="rprev__b"></div></div>
              <div class="adt__acts"><button type="button" class="post post--red" data-go="reject" disabled>Reject and send</button></div></div>
          </section></div>`;
    }
    wireDecide(box, it) {
      let mode = "approve", tier = "bronze";
      const pane = (d) => box.querySelectorAll(".dec__p").forEach((p) => (p.hidden = p.dataset.p !== d));
      box.querySelectorAll("[data-d]").forEach((b) => b.addEventListener("click", () => { mode = b.dataset.d; box.querySelectorAll("[data-d]").forEach((x) => x.setAttribute("aria-checked", x === b)); pane(mode); if (mode === "reject") $('[name="rnote"]', box).focus(); }));
      box.querySelectorAll("[data-t]").forEach((b) => b.addEventListener("click", () => {
        tier = b.dataset.t; box.querySelectorAll("[data-t]").forEach((x) => x.setAttribute("aria-checked", x === b));
        const go = $('[data-go="approve"]', box); $("span", go).textContent = tiers.find((t) => t.id === tier).name; go.style.setProperty("--ri", INK[tier]);
      }));
      // rejection: a comment is always required; ticking a rule adds its suggested fix to the comment
      const note = $('[name="rnote"]', box), rej = $('[data-go="reject"]', box), min = 15;
      const refresh = () => {
        // only the admin's own words count: lines added by ticking a rule don't
        const picked = [...box.querySelectorAll(".rl input:checked")].map((i) => RULES.find((r) => r.id === +i.value));
        const own = note.value.split("\n").filter((l) => !/^Rule \d+: /.test(l)).join(" ").trim(), len = own.length;
        rej.disabled = len < min; $(".rmin", box).textContent = len < min ? `Write at least ${min} characters in your own words (${len} so far). Ticked rules don't count.` : "";
        rej.textContent = picked.length ? `Reject under rule ${picked.map((r) => r.id).join(", ")}` : "Reject and send";
        const pv = $(".rprev", box); pv.hidden = len < min && !picked.length;
        $(".rprev__b", box).innerHTML = `<p><b>${esc(it.name)} wasn't approved yet.</b></p>${picked.map((r) => `<p class="rprev__r">Rule ${r.id}: ${esc(r.title)}</p>`).join("")}<p>${esc(note.value.trim() || "…")}</p><p class="rprev__f">Fix it and send it again from your project. <a href="post.html#rules" target="_blank" rel="noopener">Read the rules</a></p>`;
      };
      box.querySelectorAll(".rl input").forEach((i) => i.addEventListener("change", () => {
        const r = RULES.find((x) => x.id === +i.value), line = `Rule ${r.id}: ${r.fix}`;
        if (i.checked && !note.value.includes(line)) note.value = (note.value.trim() ? note.value.trim() + "\n" : "") + line;
        if (!i.checked) note.value = note.value.split("\n").filter((l) => l !== line).join("\n");
        refresh();
      }));
      note.addEventListener("input", refresh); refresh();
      $('[data-go="approve"]', box).addEventListener("click", () => this.done(it, { status: "approved", tier, note: $('[name="anote"]', box).value.trim(), by: ADMIN, when: "just now" }));
      rej.addEventListener("click", () => { if (rej.disabled) { note.focus(); return; } this.done(it, { status: "rejected", rules: [...box.querySelectorAll(".rl input:checked")].map((i) => +i.value), note: note.value.trim(), by: ADMIN, when: "just now" }); });
    }
    record(it, s) {
      const t = s.tier && tiers.find((x) => x.id === s.tier);
      return `<div class="rec rec--${s.status}"><h3>${s.status === "approved" ? "Approved" : "Turned down"} by ${esc(s.by)}, ${esc(s.when)}</h3>
        ${t ? `<p class="rec__tier" style="--ri:${INK[t.id]}"><i></i>${t.name} tier</p>` : ""}
        ${s.rules && s.rules.length ? `<ul class="rec__rules">${s.rules.map((id) => { const r = RULES.find((x) => x.id === id); return `<li>Rule ${r.id}: ${esc(r.title)}</li>`; }).join("")}</ul>` : ""}
        ${s.note ? `<p class="rec__note">${esc(s.note).replace(/\n/g, "<br>")}</p>` : ""}
        <button type="button" class="pf__link adt__undo">Move back to waiting</button></div>`;
    }
    done(it, d) {
      Decisions.set(it.id, d);
      const next = this.q.by("waiting")[0];
      this.sel = next ? next.id : null; this.render();
      toast(d.status === "approved" ? `${it.name} approved as ${tiers.find((t) => t.id === d.tier).name}.` : `${it.name} turned down. ${it.maker} gets your comment.`, () => { Decisions.drop(it.id); this.sel = it.id; this.render(); });
    }
  }

  // a short message at the foot of the screen, with an optional Undo
  function toast(msg, undo) {
    document.querySelectorAll(".toast").forEach((t) => t.remove());
    const t = document.createElement("p"); t.className = "toast"; t.setAttribute("role", "status");
    t.innerHTML = `<span>${esc(msg)}</span>${undo ? '<button type="button">Undo</button>' : ""}`; document.body.appendChild(t);
    if (undo) $("button", t).addEventListener("click", () => { undo(); t.remove(); });
    const a = t.animate([{ opacity: 0, transform: "translate(-50%,10px)" }, { opacity: 1, transform: "translate(-50%,0)" }], { duration: 250, easing: E, fill: "forwards" });
    a.finished.then(() => t.animate([{ opacity: 1 }, { opacity: 1 }], { duration: undo ? 5000 : 2600 }).finished).then(() => t.isConnected && t.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300, fill: "forwards" }).finished).then(() => t.remove()).catch(() => {});
  }

  // the review queue needs the admin view; logging out from here takes you home (session.js)
  NestSession.menuOptions = { requires: true };
  if (NestSession.gate($("#main"), "admin")) new AdminPage($("#main"));
  const bar = $(".gbar"), onScroll = () => bar.classList.toggle("gbar--framed", scrollY > 160);
  addEventListener("scroll", onScroll, { passive: true }); onScroll();
})();
