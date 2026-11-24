// Post your work (layout A, chosen 24 Nov 2026). Two modes: a new project, or an update to one you already posted.
// One long form on the left, a live preview and a checklist on the right. Every field works in the prototype:
// pictures and clips load from your computer, can be reordered and made the cover; the draft saves itself.
// Nothing is sent anywhere: "Post it" shows what would happen. Signed in as Pim.
(function () {
  "use strict";
  const { works, tiers, rooms } = window.NEST;
  const { Person, SampleDetails } = window.Details;
  const $ = (s, r = document) => r.querySelector(s);
  const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const E = "cubic-bezier(.2,.8,.2,1)";
  const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const ME = new Person("Pim");
  const PLATFORMS = { Game: ["Windows", "macOS", "Linux", "Web", "Android", "iOS"], IoT: ["ESP32", "Arduino", "Raspberry Pi", "Android", "iOS"], Web: ["Web", "Android", "iOS"], Idea: ["Pitch deck", "Poster", "Web"] };
  const LIMITS = { name: 40, line: 80, about: 900, files: 8, clip: 60 };

  // ---------- the draft: one plain object, saved after every change ----------
  class Draft {
    static KEY = "nest-post-draft";
    static blank() {
      const c = ME.contact();
      return { mode: "new", name: "", line: "", room: "", genres: [], platforms: [], about: "",
        team: [{ name: ME.name, role: "", you: true }],
        contact: { email: c[0][2], phone: c[1][2], line: c[2][2], showPhone: true },
        dl: { label: "", link: "" }, update: { work: "", title: "", text: "" }, savedAt: null };
    }
    static load() { try { return { ...Draft.blank(), ...JSON.parse(localStorage.getItem(Draft.KEY)) }; } catch (e) { return Draft.blank(); } }
    static save(d) { d.savedAt = Date.now(); try { localStorage.setItem(Draft.KEY, JSON.stringify(d)); } catch (e) {} }
    static clear() { try { localStorage.removeItem(Draft.KEY); } catch (e) {} }
  }

  // ---------- pictures and clips: load, reorder, make cover, remove ----------
  // Files live only in this tab (object URLs); a saved draft keeps the words, not the files.
  class MediaField {
    constructor(root, onChange) {
      this.root = root; this.items = []; this.onChange = onChange;
      root.innerHTML = `<div class="drop" tabindex="0" role="button" aria-describedby="drop-h">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 16V4M7 9l5-5 5 5M4 17v3h16v-3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
          <b>Drop a clip or pictures here, or <u>choose files</u></b><i id="drop-h">MP4 or WebM up to ${LIMITS.clip} seconds, PNG or JPG. Up to ${LIMITS.files}. The first one is the cover.</i>
          <input type="file" accept="image/*,video/*" multiple hidden></div>
        <ol class="mlist" aria-label="Your clip and pictures, in order"></ol><p class="mnote" role="status" aria-live="polite"></p>`;
      const drop = $(".drop", root), input = $("input", root);
      drop.addEventListener("click", () => input.click());
      drop.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); input.click(); } });
      input.addEventListener("change", () => { this.add([...input.files]); input.value = ""; });
      ["dragenter", "dragover"].forEach((t) => drop.addEventListener(t, (e) => { e.preventDefault(); drop.classList.add("is-over"); }));
      ["dragleave", "drop"].forEach((t) => drop.addEventListener(t, () => drop.classList.remove("is-over")));
      drop.addEventListener("drop", (e) => { e.preventDefault(); this.add([...e.dataTransfer.files]); });
      this.paint();
    }
    note(t) { $(".mnote", this.root).textContent = t; }
    add(files) {
      const ok = files.filter((f) => /^(image|video)\//.test(f.type));
      if (ok.length < files.length) this.note("Some files were skipped: only pictures and clips can go here.");
      const room = LIMITS.files - this.items.length;
      if (ok.length > room) this.note(`Only ${LIMITS.files} fit. The first ${room} were added.`);
      ok.slice(0, Math.max(0, room)).forEach((f) => {
        const it = { url: URL.createObjectURL(f), video: f.type.startsWith("video/"), name: f.name, dur: null };
        this.items.push(it);
        if (it.video) {
          const v = document.createElement("video"); v.preload = "metadata"; v.src = it.url;
          v.addEventListener("loadedmetadata", () => { it.dur = v.duration; if (v.duration > LIMITS.clip) this.note(`${f.name} is ${Math.round(v.duration)} seconds. Keep clips under ${LIMITS.clip}; the page will only play the start.`); this.paint(); this.onChange(); });
        }
      });
      this.paint(); this.onChange();
    }
    move(i, to) { if (to < 0 || to >= this.items.length) return; const [it] = this.items.splice(i, 1); this.items.splice(to, 0, it); this.paint(); this.onChange(); }
    remove(i) { URL.revokeObjectURL(this.items[i].url); this.items.splice(i, 1); this.paint(); this.onChange(); }
    paint() {
      const list = $(".mlist", this.root), time = (s) => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, "0")}`;
      list.innerHTML = this.items.map((it, i) => `<li class="mi" draggable="true" data-i="${i}">
          ${it.video ? `<video src="${it.url}" muted preload="metadata"></video>` : `<img src="${it.url}" alt="">`}
          <span class="mi__tag">${i === 0 ? (it.video ? "Cover · Clip" : "Cover") : it.video ? `Clip${it.dur ? ` · ${time(it.dur)}` : ""}` : `#${i + 1}`}</span>
          <span class="mi__acts">
            <button type="button" data-a="left" aria-label="Move ${esc(it.name)} earlier"${i === 0 ? " disabled" : ""}>‹</button>
            ${i ? `<button type="button" data-a="cover" aria-label="Make ${esc(it.name)} the cover">Cover</button>` : ""}
            <button type="button" data-a="right" aria-label="Move ${esc(it.name)} later"${i === this.items.length - 1 ? " disabled" : ""}>›</button>
            <button type="button" data-a="x" aria-label="Remove ${esc(it.name)}">×</button></span></li>`).join("")
;
      list.querySelectorAll("[data-a]").forEach((b) => b.addEventListener("click", () => {
        const i = +b.closest(".mi").dataset.i, a = b.dataset.a;
        if (a === "left") this.move(i, i - 1); if (a === "right") this.move(i, i + 1); if (a === "cover") this.move(i, 0); if (a === "x") this.remove(i);
      }));
      // drag to reorder
      list.querySelectorAll(".mi[draggable]").forEach((li) => {
        li.addEventListener("dragstart", (e) => { this.dragFrom = +li.dataset.i; li.classList.add("is-drag"); e.dataTransfer.effectAllowed = "move"; });
        li.addEventListener("dragend", () => li.classList.remove("is-drag"));
        li.addEventListener("dragover", (e) => { if (this.dragFrom != null) e.preventDefault(); });
        li.addEventListener("drop", (e) => { e.preventDefault(); e.stopPropagation(); if (this.dragFrom != null) this.move(this.dragFrom, +li.dataset.i); this.dragFrom = null; });
      });
      this.root.classList.toggle("has-items", this.items.length > 0);
    }
    get cover() { return this.items[0] || null; }
    get hasClip() { return this.items.some((it) => it.video); }
  }

  // ---------- team: you are always first; add people by name, give everyone a role ----------
  class TeamField {
    constructor(root, draft, onChange) {
      this.root = root; this.d = draft; this.onChange = onChange;
      this.people = Person.all().filter((n) => n !== ME.name).sort();
      this.paint();
    }
    paint() {
      const t = this.d.team;
      this.root.innerHTML = `<ul class="tm">${t.map((m, i) => `<li>
          <span class="av2" style="--h:${new Person(m.name).hue}" aria-hidden="true">${esc(m.name[0])}</span><b>${esc(m.name)}</b>
          <input type="text" value="${esc(m.role)}" placeholder="${i ? "What do they do?" : "What do you do? e.g. Lead, game design"}" aria-label="${esc(m.name)}'s role" data-i="${i}">
          ${m.you ? '<span class="you">You</span>' : `<button type="button" class="x" data-i="${i}" aria-label="Remove ${esc(m.name)}">×</button>`}</li>`).join("")}</ul>
        <div class="tm__add"><label class="sr" for="tm-name">Add a teammate</label><input id="tm-name" list="tm-people" placeholder="Add a teammate by name" autocomplete="off"><datalist id="tm-people">${this.people.map((n) => `<option value="${n}">`).join("")}</datalist><button type="button" class="add">Add</button></div>
        <p class="fld__h">People on Hamster Nest get a link to their profile. Anyone else is listed by name.</p>`;
      this.root.querySelectorAll(".tm input").forEach((i) => i.addEventListener("input", () => { t[+i.dataset.i].role = i.value; this.onChange(); }));
      this.root.querySelectorAll(".x").forEach((b) => b.addEventListener("click", () => { t.splice(+b.dataset.i, 1); this.paint(); this.onChange(); }));
      const n = $("#tm-name", this.root), add = () => {
        const name = n.value.trim().replace(/^\w/, (c) => c.toUpperCase()); if (!name) return;
        if (t.some((m) => m.name.toLowerCase() === name.toLowerCase())) { n.setCustomValidity("Already on the team"); n.reportValidity(); return; }
        t.push({ name, role: "" }); this.paint(); this.onChange(); $(".tm li:last-child input", this.root).focus();
      };
      $(".add", this.root).addEventListener("click", add);
      n.addEventListener("keydown", (e) => { n.setCustomValidity(""); if (e.key === "Enter") { e.preventDefault(); add(); } });
    }
  }

  // ---------- the page ----------
  class PostPage {
    constructor(root) { this.root = root; this.d = Draft.load(); this.render(); }
    // buttons that act like radio (one) or checkboxes (many)
    choice(name, options, picked, many) {
      return `<div class="${many ? "chips2" : "seg2"}" role="${many ? "group" : "radiogroup"}" aria-labelledby="${name}-l" data-name="${name}">${options.map((o) =>
        `<button type="button" role="${many ? "checkbox" : "radio"}" aria-checked="${many ? picked.includes(o) : picked === o}" data-v="${esc(o)}">${esc(o)}</button>`).join("")}</div>`;
    }
    render() {
      const d = this.d, mine = ME.works().filter((x) => x.lead);
      this.root.innerHTML = `
        <div class="po__head"><div><a class="back" href="profile.html#pim"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M10 3L5 8l5 5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>Your profile</a>
          <h1>Post your work</h1><p>Takes about five minutes. Everything saves as you go, so you can leave and come back.</p></div>
          <div class="po__headr"><button type="button" class="ghost3 sm guide-btn" data-act="guide"><svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true"><path d="M3 2.5h6.5l3.5 3.5v7.5H3z M9.5 2.5V6H13" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><path d="M5.5 9h5M5.5 11.5h3.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>Posting guide and rules</button>
          <div class="mode" role="radiogroup" aria-label="What are you posting?"><button type="button" role="radio" data-mode="new" aria-checked="${d.mode === "new"}">New project</button><button type="button" role="radio" data-mode="update" aria-checked="${d.mode === "update"}">Update a project</button></div></div></div>
        <div class="po__grid">
          <form class="po__form" novalidate>
            <div class="m-new">
              <section class="sec2" id="s-basics"><h2><span>1</span>The basics</h2>
                <label class="fld"><span class="fld__l">Name <em>Required</em></span><input name="name" maxlength="${LIMITS.name}" value="${esc(d.name)}" placeholder="What is it called?" required><span class="cnt" data-for="name"></span></label>
                <label class="fld"><span class="fld__l">One line about it <em>Required</em></span><input name="line" maxlength="${LIMITS.line}" value="${esc(d.line)}" placeholder="What does it do, in one sentence?" required><span class="cnt" data-for="line"></span><span class="fld__h">This shows under the name everywhere: on Browse, on your profile and on the project page.</span></label>
                <div class="fld"><span class="fld__l" id="room-l">Room <em>Required</em></span>${this.choice("room", Object.keys(rooms), d.room, false)}</div>
                <div class="fld" id="genre-f"></div>
                <div class="fld" id="plat-f"></div>
              </section>
              <section class="sec2" id="s-media"><h2><span>2</span>Clip and pictures</h2><div id="media"></div></section>
              <section class="sec2" id="s-about"><h2><span>3</span>About it</h2>
                <label class="fld"><span class="fld__l">About this project</span><textarea name="about" rows="6" maxlength="${LIMITS.about}" placeholder="How did it start? What does it do? What's next?">${esc(d.about)}</textarea><span class="cnt cnt--b" data-for="about"></span><span class="fld__h">Three short paragraphs are plenty. Leave a blank line between them.</span></label></section>
              <section class="sec2" id="s-team"><h2><span>4</span>Team</h2><div id="team"></div></section>
              <section class="sec2" id="s-contact"><h2><span>5</span>How to reach you</h2>
                <p class="fld__h fld__h--top">From your profile. Change them here for this project only.</p>
                <div class="row3"><label class="fld"><span class="fld__l">Email</span><input type="email" name="email" value="${esc(d.contact.email)}"></label>
                  <label class="fld"><span class="fld__l">Phone</span><input type="tel" name="phone" value="${esc(d.contact.phone)}"></label>
                  <label class="fld"><span class="fld__l">LINE</span><input name="lineid" value="${esc(d.contact.line)}"></label></div>
                <label class="sw sw--inline"><span>Show my phone number on this project</span><input type="checkbox" name="showPhone"${d.contact.showPhone ? " checked" : ""}></label></section>
              <section class="sec2" id="s-dl"><h2><span>6</span>Something to try <em class="opt">Optional</em></h2>
                <div class="row2"><label class="fld"><span class="fld__l">Button label</span><input name="dlLabel" value="${esc(d.dl.label)}" placeholder="Free download"></label>
                  <label class="fld"><span class="fld__l">Link</span><input type="url" name="dlLink" value="${esc(d.dl.link)}" placeholder="https://… (itch.io, Google Drive, GitHub)"></label></div>
                <p class="fld__h">A link to where people can play, download or read it. Leave it empty if there's nothing to try yet.</p></section>
            </div>
            <div class="m-update">
              <section class="sec2"><h2><span>1</span>Which project?</h2>
                <div class="pick">${mine.map(({ w }) => `<label class="pick__i"><input type="radio" name="uwork" value="${w.id}"${d.update.work === w.id ? " checked" : ""}><span class="pick__pic cv" data-id="${w.id}"></span><span><b>${esc(w.name)}</b><i>${tiers.find((t) => t.id === w.tier).name} · last update ${esc(w.update.when)}</i></span></label>`).join("")}</div></section>
              <section class="sec2"><h2><span>2</span>What changed?</h2>
                <label class="fld"><span class="fld__l">Title <em>Required</em></span><input name="utitle" maxlength="60" value="${esc(d.update.title)}" placeholder="e.g. Added a second level"><span class="cnt" data-for="utitle"></span></label>
                <label class="fld"><span class="fld__l">A few words about it</span><textarea name="utext" rows="4" maxlength="400" placeholder="What's new, and what should people try first?">${esc(d.update.text)}</textarea><span class="cnt cnt--b" data-for="utext"></span></label></section>
              <section class="sec2"><h2><span>3</span>Show it <em class="opt">Optional</em></h2><div id="umedia"></div></section>
            </div>
            <p class="po__err" role="alert"></p>
            <div class="po__acts"><button type="button" class="ghost3" data-act="save">Save for later</button><span class="saved" aria-live="polite"></span><button type="button" class="pf__link" data-act="reset">Start over</button><button type="submit" class="post">Post it</button></div>
          </form>
          <aside class="po__side">
            <section class="box pv2" aria-label="Preview"><h3>How it will look</h3><div class="pv2__body"></div></section>
            <section class="box chk"><h3>Before it goes up</h3><ul></ul><p>Only the ones marked required stop you posting. Hamster Hub reads every new work within two days against <a href="#rules" class="rules-link">the rules</a>.</p></section>
          </aside>
        </div>`;
      this.media = new MediaField($("#media", this.root), () => this.update());
      this.umedia = new MediaField($("#umedia", this.root), () => this.update());
      this.team = new TeamField($("#team", this.root), d, () => this.update());
      this.root.querySelectorAll(".pick__pic").forEach((el) => Art.fill(el, works.find((w) => w.id === el.dataset.id)));
      this.paintRoomParts(); this.wire(); this.update(false);
      // a restored draft has its words but not its files (they stay on your computer)
      if (d.savedAt && (d.name || d.update.title)) { const m = d.mode === "update" ? this.umedia : this.media; m.note("Your draft is back. Pictures and clips aren't kept in a draft, so add them again."); }
    }
    // genre and platforms depend on the room
    paintRoomParts() {
      const d = this.d, g = $("#genre-f", this.root), p = $("#plat-f", this.root);
      if (!d.room) { g.innerHTML = `<span class="fld__l">Genre</span><p class="fld__h">Pick a room first.</p>`; p.innerHTML = ""; return; }
      d.genres = d.genres.filter((x) => rooms[d.room].includes(x)); d.platforms = d.platforms.filter((x) => PLATFORMS[d.room].includes(x));
      g.innerHTML = `<span class="fld__l" id="genres-l">Genre <em>Pick one or two</em></span>${this.choice("genres", rooms[d.room], d.genres, true)}`;
      p.innerHTML = `<span class="fld__l" id="platforms-l">${d.room === "Idea" ? "Shared as" : "Runs on"}</span>${this.choice("platforms", PLATFORMS[d.room], d.platforms, true)}`;
      this.wireChoices(g); this.wireChoices(p);
      if (!calm) [g, p].forEach((el) => el.animate([{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], { duration: 260, easing: E }));
    }
    wireChoices(scope) {
      scope.querySelectorAll("[data-name]").forEach((grp) => grp.querySelectorAll("button").forEach((b) => b.addEventListener("click", () => {
        const name = grp.dataset.name, v = b.dataset.v, d = this.d;
        if (name === "room") { d.room = d.room === v ? "" : v; grp.querySelectorAll("button").forEach((x) => x.setAttribute("aria-checked", x.dataset.v === d.room)); this.paintRoomParts(); }
        else if (name === "genres" && !d.genres.includes(v) && d.genres.length >= 2) { this.flash(grp, "Two genres at most. Untick one first."); return; }
        else { const set = d[name]; set.includes(v) ? set.splice(set.indexOf(v), 1) : set.push(v); b.setAttribute("aria-checked", set.includes(v)); }
        this.update();
      })));
    }
    flash(el, msg) { const h = el.previousElementSibling; const old = h.innerHTML; h.innerHTML = `${old.split("<em")[0]}<em class="warn">${msg}</em>`; setTimeout(() => (h.innerHTML = old), 1800); }
    wire() {
      const f = $("form", this.root), d = this.d;
      $('[data-act="guide"]', this.root).addEventListener("click", () => window.NestGuide.open());
      $(".rules-link", this.root).addEventListener("click", (e) => { e.preventDefault(); window.NestGuide.open("rules"); });
      this.root.querySelectorAll(".mode [data-mode]").forEach((b) => b.addEventListener("click", () => { if (b.dataset.mode === "new" && d.mode !== "new") window.NestGuide.auto(); d.mode = b.dataset.mode; this.root.querySelectorAll(".mode [data-mode]").forEach((x) => x.setAttribute("aria-checked", x === b)); this.update(); }));
      this.wireChoices($("#s-basics", this.root));
      f.addEventListener("input", (e) => {
        const n = e.target.name; if (!n) return;
        const v = e.target.type === "checkbox" ? e.target.checked : e.target.value;
        if (n in d && typeof d[n] === "string") d[n] = v;
        if (n === "email") d.contact.email = v; if (n === "phone") d.contact.phone = v; if (n === "lineid") d.contact.line = v; if (n === "showPhone") d.contact.showPhone = v;
        if (n === "dlLabel") d.dl.label = v; if (n === "dlLink") d.dl.link = v;
        if (n === "uwork") d.update.work = v; if (n === "utitle") d.update.title = v; if (n === "utext") d.update.text = v;
        e.target.closest(".fld")?.classList.remove("is-bad");
        this.update();
      });
      f.addEventListener("change", (e) => { if (e.target.name === "uwork") { d.update.work = e.target.value; this.update(); } });
      // textareas grow with what you write
      f.querySelectorAll("textarea").forEach((t) => { const fit = () => { t.style.height = "auto"; t.style.height = t.scrollHeight + 2 + "px"; }; t.addEventListener("input", fit); fit(); });
      $('[data-act="save"]', this.root).addEventListener("click", () => { Draft.save(d); this.stamp(true); });
      $('[data-act="reset"]', this.root).addEventListener("click", () => { if (this.armed) { Draft.clear(); this.d = Draft.blank(); this.render(); scrollTo({ top: 0 }); return; } this.armed = true; const b = $('[data-act="reset"]', this.root); b.textContent = "Click again to clear everything"; setTimeout(() => { this.armed = false; b.textContent = "Start over"; }, 2500); });
      f.addEventListener("submit", (e) => { e.preventDefault(); this.submit(); });
    }
    stamp(now) {
      const s = $(".saved", this.root); if (!this.d.savedAt) { s.textContent = ""; return; }
      const sec = Math.round((Date.now() - this.d.savedAt) / 1000);
      s.textContent = now || sec < 10 ? "Saved just now" : sec < 60 ? `Saved ${sec} seconds ago` : `Saved ${Math.round(sec / 60)} min ago`;
    }
    // what each mode needs; "req" ones stop posting
    checks() {
      const d = this.d;
      if (d.mode === "update") return [
        ["Pick the project", !!d.update.work, true], ["A title for the update", d.update.title.trim().length > 2, true],
        ["A few words about it", d.update.text.trim().length > 10, false], ["A picture or a clip", this.umedia.items.length > 0, false]];
      return [
        ["A name and one line", d.name.trim() && d.line.trim(), true], ["A room", !!d.room, true], ["A cover picture", !!this.media.cover, true],
        ["A clip, or three pictures", this.media.hasClip || this.media.items.length >= 3, false], ["A few words about it", d.about.trim().length > 40, false],
        ["Everyone on the team has a role", d.team.every((m) => m.role.trim()), false], ["A way to reach you", !!(d.contact.email || d.contact.line), false], ["Something to try", !!d.dl.link, false]];
    }
    update(save = true) {
      const d = this.d;
      this.root.classList.toggle("is-update", d.mode === "update");
      // counters
      this.root.querySelectorAll(".cnt").forEach((c) => { const i = $(`[name="${c.dataset.for}"]`, this.root); c.textContent = `${i.value.length} / ${i.maxLength}`; c.classList.toggle("is-near", i.value.length > i.maxLength * 0.9); });
      // checklist
      const ch = this.checks(), done = ch.filter((c) => c[1]).length;
      $(".chk ul", this.root).innerHTML = ch.map(([t, ok, req]) => `<li class="${ok ? "ok" : ""}"><i aria-hidden="true">${ok ? "✓" : ""}</i><span>${t}${req ? ' <em>Required</em>' : ""}</span><span class="sr">${ok ? "done" : "not yet"}</span></li>`).join("");
      // the "still needed" line goes away as soon as nothing required is missing
      if (!ch.some((c) => c[2] && !c[1])) $(".po__err", this.root).textContent = "";
      $(".chk h3", this.root).innerHTML = `Before it goes up <span class="chk__n">${done} / ${ch.length}</span>`;
      this.preview();
      if (save) { Draft.save(d); this.stamp(true); }
      else this.stamp();
    }
    preview() {
      const d = this.d, body = $(".pv2__body", this.root);
      if (d.mode === "update") {
        const w = works.find((x) => x.id === d.update.work), cover = this.umedia.cover;
        body.innerHTML = w ? `<p class="pv2__k">In the Updates list of ${esc(w.name)}</p><div class="pv2__upd"><time>today</time><div><b>${esc(d.update.title || "Your title")}</b><p>${esc(d.update.text || "A few words about it.")}</p></div></div>
            ${cover ? `<div class="pv2__pic">${cover.video ? `<video src="${cover.url}" muted autoplay loop playsinline></video>` : `<img src="${cover.url}" alt="">`}</div>` : ""}
            <p class="pv2__k">On Browse the tile now says</p><p class="pv2__u"><span>Updated today</span>${esc(d.update.title || "Your title")}</p>`
          : `<p class="pv2__empty">Pick a project on the left to see the update here.</p>`;
        return;
      }
      const cover = this.media.cover, tags = [d.room, ...d.genres, ...d.platforms].filter(Boolean);
      body.innerHTML = `<div class="pv2__tile">${cover ? (cover.video ? `<video src="${cover.url}" muted autoplay loop playsinline></video>` : `<img src="${cover.url}" alt="">`) : `<span class="pv2__ph">Your cover goes here</span>`}<span class="pv2__new">New</span></div>
        <p class="pv2__n">${esc(d.name || "Your project's name")}</p><p class="pv2__l">${esc(d.line || "One line about it")}</p>
        ${tags.length ? `<p class="pv2__t">${tags.map((t, i) => `<span${i === 0 ? ' class="is-room"' : ""}>${esc(t)}</span>`).join("")}</p>` : ""}
        ${d.team.length ? `<p class="pv2__team">${d.team.map((m) => `<span class="av3" style="--h:${new Person(m.name).hue}" title="${esc(m.name)}">${esc(m.name[0])}</span>`).join("")}<i>${d.team.map((m) => esc(m.name)).join(", ")}</i></p>` : ""}`;
    }
    submit() {
      const ch = this.checks(), miss = ch.filter((c) => c[2] && !c[1]), err = $(".po__err", this.root), d = this.d;
      this.root.querySelectorAll(".is-bad").forEach((x) => x.classList.remove("is-bad"));
      if (miss.length) {
        err.textContent = `Almost there. Still needed: ${miss.map((m) => m[0].toLowerCase()).join(", ")}.`;
        const map = d.mode === "update" ? { "Pick the project": ".pick", "A title for the update": '[name="utitle"]' } : { "A name and one line": d.name.trim() ? '[name="line"]' : '[name="name"]', "A room": '[data-name="room"]', "A cover picture": "#media .drop" };
        const first = $(map[miss[0][0]], this.root);
        if (first) { first.closest(".fld, .sec2")?.classList.add("is-bad"); first.scrollIntoView({ behavior: calm ? "auto" : "smooth", block: "center" }); (first.matches("input,[tabindex]") ? first : first.querySelector("button,input"))?.focus({ preventScroll: true }); }
        return;
      }
      err.textContent = "";
      const w = works.find((x) => x.id === d.update.work);
      const box = $(".po__grid", this.root);
      box.innerHTML = `<section class="done" role="status"><span class="hi__tick"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
        <h2>${d.mode === "update" ? `Update posted to ${esc(w.name)}` : `${esc(d.name)} is in the queue`}</h2>
        <p>${d.mode === "update" ? "It shows at the top of the project's Updates, and the project moves up in its rank for posting something new." : "Hamster Hub reads every new work within two days. Once it's up, it starts in Bronze and climbs as you post updates."}</p>
        <p class="done__note">This is a prototype, so nothing was sent.</p>
        <div class="dlg__acts"><a class="ghost3" href="profile.html#pim">Go to your profile</a><button type="button" class="post" data-act="again">Post something else</button></div></section>`;
      if (!calm) box.animate([{ opacity: 0, transform: "translateY(12px)" }, { opacity: 1, transform: "none" }], { duration: 400, easing: E });
      Draft.clear();
      $('[data-act="again"]', box).addEventListener("click", () => { this.d = Draft.blank(); this.render(); scrollTo({ top: 0 }); });
      scrollTo({ top: 0, behavior: calm ? "auto" : "smooth" });
    }
  }

  // ---------- account menu (a smaller copy of the profile page's) ----------
  function accountMenu() {
    const btn = $(".me__btn"), menu = $(".me__menu"), pr = ME.profile();
    $(".me__av").outerHTML = `<span class="me__av" style="--h:${ME.hue}" aria-hidden="true">${ME.name[0]}</span>`;
    menu.innerHTML = `<div class="me__head"><span class="me__big" style="--h:${ME.hue}">${ME.name[0]}</span><b>${esc(pr.full)}</b><i>@${ME.handle}</i></div>
      <a role="menuitem" href="profile.html#${ME.handle}">Your profile</a><a role="menuitem" href="post.html" aria-current="page">Post your work</a><a role="menuitem" href="profile.html#${ME.handle}">Favourites</a><hr><a role="menuitem" href="#">Log out</a>`;
    const open = (on) => { menu.hidden = !on; btn.setAttribute("aria-expanded", on); if (on) menu.querySelector("[role=menuitem]").focus(); };
    btn.addEventListener("click", () => open(menu.hidden));
    document.addEventListener("click", (e) => { if (!menu.hidden && !e.composedPath().includes($(".me"))) open(false); });
    addEventListener("keydown", (e) => { if (e.key === "Escape" && !menu.hidden) { open(false); btn.focus(); } });
  }

  accountMenu();
  const page = new PostPage($("#main"));
  // starting a new project opens the guide (unless they asked us not to, or a link points at the rules)
  if (page.d.mode === "new" && !/^#rules?/.test(location.hash)) window.NestGuide.auto();
  setInterval(() => page.stamp(), 15000);
  const bar = $(".gbar"), onScroll = () => bar.classList.toggle("gbar--framed", scrollY > 160);
  addEventListener("scroll", onScroll, { passive: true }); onScroll();
})();
