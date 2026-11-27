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

  // words on this page (lang.js). Names, the draft's own text and platform names are printed as written; room and genre labels come from L.room / L.genre.
  const L = window.NestLang, tx = (k, v) => L.t(k, v);
  L.add({
    en: {
      "po.back": "Your profile", "po.title": "Post your project", "po.lead": "Takes about five minutes. Everything saves as you go, so you can leave and come back.",
      "po.guide": "Posting guide and rules", "po.modeAria": "What are you posting?", "po.mNew": "New project", "po.mUpd": "Update a project",
      "po.s1": "The basics", "po.name": "Name", "po.req": "Required", "po.opt": "Optional", "po.namePh": "What is it called?", "po.line": "One line about it",
      "po.linePh": "What does it do, in one sentence?", "po.lineH": "This shows under the name everywhere: on Browse, on your profile and on the project page.",
      "po.room": "Room", "po.genre": "Genre", "po.pickOne": "Pick one or two", "po.roomFirst": "Pick a room first.", "po.runs": "Runs on", "po.shared": "Shared as",
      "po.s2": "Clip and pictures", "po.s3": "About it", "po.aboutL": "About this project", "po.aboutPh": "How did it start? What does it do? What's next?",
      "po.aboutH": "Three short paragraphs are plenty. Leave a blank line between them.", "po.s4": "Team", "po.s5": "How to reach you",
      "po.reachH": "From your profile. Change them here for this project only.", "po.showPhone": "Show my phone number on this project",
      "po.s6": "Something to try", "po.btnLabel": "Button label", "po.btnPh": "Free download", "po.link": "Link", "po.linkPh": "https://… (itch.io, Google Drive, GitHub)",
      "po.tryH": "A link to where people can play, download or read it. Leave it empty if there's nothing to try yet.",
      "po.u1": "Which project?", "po.lastUpd": "{tier} · last update {when}", "po.u2": "What changed?", "po.uTitle": "Title", "po.uTitlePh": "e.g. Added a second level",
      "po.uText": "A few words about it", "po.uTextPh": "What's new, and what should people try first?", "po.u3": "Show it",
      "po.save": "Save for later", "po.reset": "Start over", "po.resetSure": "Click again to clear everything", "po.post": "Post it",
      "po.preview": "Preview", "po.how": "How it will look", "po.before": "Before it goes up",
      "po.chkNote": "Only the ones marked required stop you posting. Hamster Hub reads every new project within two days against <a href=\"#rules\" class=\"rules-link\">the rules</a>.",
      "po.saved0": "Saved just now", "po.savedS": "Saved {n} seconds ago", "po.savedM": "Saved {n} min ago",
      "po.draft": "Your draft is back. Pictures and clips aren't kept in a draft, so add them again.", "po.twoGenres": "Two genres at most. Untick one first.",
      "po.done": "done", "po.notYet": "not yet",
      "ck.name": "A name and one line", "ck.room": "A room", "ck.cover": "A cover picture", "ck.clip": "A clip, or three pictures", "ck.about": "A few words about it",
      "ck.roles": "Everyone on the team has a role", "ck.reach": "A way to reach you", "ck.try": "Something to try",
      "ck.pick": "Pick the project", "ck.utitle": "A title for the update", "ck.utext": "A few words about it", "ck.upic": "A picture or a clip",
      "pv.updIn": "In the Updates list of {name}", "pv.yourTitle": "Your title", "pv.fewWords": "A few words about it.", "pv.tile": "On Browse the tile now says",
      "pv.pickLeft": "Pick a project on the left to see the update here.", "pv.cover": "Your cover goes here", "pv.new": "New",
      "pv.name": "Your project's name", "pv.line": "One line about it",
      "po.almost": "Almost there. Still needed: {list}.", "po.updPosted": "Update posted to {name}", "po.queued": "{name} is in the queue",
      "po.updP": "It shows at the top of the project's Updates, and the project moves up in its rank for posting something new.",
      "po.newP": "Hamster Hub reads every new project within two days. Once it's up, it starts in Bronze and climbs as you post updates.",
      "po.proto": "This is a prototype, so nothing was sent.", "po.toProfile": "Go to your profile", "po.again": "Post something else",
      "md.drop": "Drop a clip or pictures here, or <u>choose files</u>", "md.hint": "MP4 or WebM up to {clip} seconds, PNG or JPG. Up to {files}. The first one is the cover.",
      "md.list": "Your clip and pictures, in order", "md.skipped": "Some files were skipped: only pictures and clips can go here.", "md.fit": "Only {files} fit. The first {room} were added.",
      "md.long": "{name} is {sec} seconds. Keep clips under {max}; the page will only play the start.",
      "md.coverClip": "Cover · Clip", "md.cover": "Cover", "md.clip": "Clip", "md.earlier": "Move {name} earlier", "md.makeCover": "Make {name} the cover", "md.later": "Move {name} later", "md.remove": "Remove {name}",
      "tm.you": "You", "tm.roleOther": "What do they do?", "tm.roleYou": "What do you do? e.g. Lead, game design", "tm.role": "{name}'s role", "tm.remove": "Remove {name}",
      "tm.add": "Add a teammate", "tm.addPh": "Add a teammate by name", "tm.addBtn": "Add", "tm.hint": "People on Hamster Nest get a link to their profile. Anyone else is listed by name.", "tm.already": "Already on the team",
    },
    th: {
      "po.back": "โปรไฟล์ของคุณ", "po.title": "ลงผลงานของคุณ", "po.lead": "ใช้เวลาราวห้านาที ทุกอย่างบันทึกให้ระหว่างที่เขียน ออกไปแล้วกลับมาต่อได้",
      "po.guide": "คู่มือการลงผลงานและกติกา", "po.modeAria": "คุณจะลงอะไร", "po.mNew": "โปรเจกต์ใหม่", "po.mUpd": "อัปเดตโปรเจกต์เดิม",
      "po.s1": "ข้อมูลพื้นฐาน", "po.name": "ชื่อ", "po.req": "จำเป็น", "po.opt": "ไม่บังคับ", "po.namePh": "ผลงานนี้ชื่ออะไร", "po.line": "แนะนำสั้น ๆ หนึ่งบรรทัด",
      "po.linePh": "มันทำอะไรได้ บอกเป็นประโยคเดียว", "po.lineH": "บรรทัดนี้จะแสดงใต้ชื่อทุกที่ ทั้งหน้าสำรวจ โปรไฟล์ของคุณ และหน้าผลงาน",
      "po.room": "ห้อง", "po.genre": "แนว", "po.pickOne": "เลือกหนึ่งหรือสองแนว", "po.roomFirst": "เลือกห้องก่อนนะ", "po.runs": "ใช้งานได้บน", "po.shared": "แชร์ในรูปแบบ",
      "po.s2": "คลิปและรูปภาพ", "po.s3": "เล่าเกี่ยวกับผลงาน", "po.aboutL": "เกี่ยวกับผลงานนี้", "po.aboutPh": "เริ่มต้นยังไง ทำอะไรได้ แล้วจะทำอะไรต่อ",
      "po.aboutH": "สามย่อหน้าสั้น ๆ ก็พอ เว้นบรรทัดว่างระหว่างย่อหน้า", "po.s4": "ทีม", "po.s5": "ติดต่อคุณได้ทางไหน",
      "po.reachH": "ดึงมาจากโปรไฟล์ของคุณ แก้ตรงนี้ได้เฉพาะโปรเจกต์นี้", "po.showPhone": "แสดงเบอร์โทรของฉันในโปรเจกต์นี้",
      "po.s6": "สิ่งที่ให้คนลอง", "po.btnLabel": "ข้อความบนปุ่ม", "po.btnPh": "ดาวน์โหลดฟรี", "po.link": "ลิงก์", "po.linkPh": "https://… (itch.io, Google Drive, GitHub)",
      "po.tryH": "ลิงก์ไปยังที่ที่คนเล่น ดาวน์โหลด หรืออ่านได้ ถ้ายังไม่มีอะไรให้ลอง เว้นว่างไว้ก็ได้",
      "po.u1": "อัปเดตโปรเจกต์ไหน", "po.lastUpd": "{tier} · อัปเดตล่าสุด {when}", "po.u2": "มีอะไรเปลี่ยนไป", "po.uTitle": "หัวข้อ", "po.uTitlePh": "เช่น เพิ่มด่านที่สอง",
      "po.uText": "เล่าสั้น ๆ", "po.uTextPh": "มีอะไรใหม่ และอยากให้คนลองอะไรก่อน", "po.u3": "โชว์ให้ดู",
      "po.save": "เก็บไว้ก่อน", "po.reset": "เริ่มใหม่", "po.resetSure": "กดอีกครั้งเพื่อล้างทั้งหมด", "po.post": "ลงเลย",
      "po.preview": "ตัวอย่าง", "po.how": "หน้าตาจะเป็นแบบนี้", "po.before": "ก่อนขึ้นเว็บ",
      "po.chkNote": "เฉพาะข้อที่ระบุว่าจำเป็นเท่านั้นที่ขวางการลงผลงาน Hamster Hub จะอ่านทุกโปรเจกต์ใหม่ภายในสองวัน และตรวจกับ<a href=\"#rules\" class=\"rules-link\">กติกา</a>",
      "po.saved0": "เพิ่งบันทึก", "po.savedS": "บันทึกเมื่อ {n} วินาทีที่แล้ว", "po.savedM": "บันทึกเมื่อ {n} นาทีที่แล้ว",
      "po.draft": "ร่างของคุณกลับมาแล้ว รูปและคลิปไม่ถูกเก็บไว้ในร่าง ต้องเพิ่มใหม่อีกครั้ง", "po.twoGenres": "เลือกได้สูงสุดสองแนว ยกเลิกอันหนึ่งก่อนนะ",
      "po.done": "เสร็จแล้ว", "po.notYet": "ยังไม่เสร็จ",
      "ck.name": "ชื่อและคำแนะนำหนึ่งบรรทัด", "ck.room": "ห้อง", "ck.cover": "รูปปก", "ck.clip": "คลิป หรือรูปสามรูป", "ck.about": "เล่าสั้น ๆ เกี่ยวกับผลงาน",
      "ck.roles": "ทุกคนในทีมมีบทบาท", "ck.reach": "ช่องทางติดต่อคุณ", "ck.try": "สิ่งที่ให้คนลอง",
      "ck.pick": "เลือกโปรเจกต์", "ck.utitle": "หัวข้อของอัปเดต", "ck.utext": "เล่าสั้น ๆ", "ck.upic": "รูปหรือคลิป",
      "pv.updIn": "ในรายการอัปเดตของ {name}", "pv.yourTitle": "หัวข้อของคุณ", "pv.fewWords": "เล่าสั้น ๆ ตรงนี้", "pv.tile": "บนหน้าสำรวจ การ์ดจะขึ้นว่า",
      "pv.pickLeft": "เลือกโปรเจกต์ทางซ้าย แล้วดูอัปเดตตรงนี้ได้เลย", "pv.cover": "รูปปกของคุณจะอยู่ตรงนี้", "pv.new": "ใหม่",
      "pv.name": "ชื่อโปรเจกต์ของคุณ", "pv.line": "แนะนำสั้น ๆ หนึ่งบรรทัด",
      "po.almost": "ใกล้เสร็จแล้ว ยังขาด: {list}", "po.updPosted": "ลงอัปเดตให้ {name} แล้ว", "po.queued": "{name} เข้าคิวแล้ว",
      "po.updP": "อัปเดตนี้จะขึ้นบนสุดของรายการอัปเดตของโปรเจกต์ และโปรเจกต์จะขยับอันดับขึ้นเพราะมีของใหม่",
      "po.newP": "Hamster Hub จะอ่านทุกโปรเจกต์ใหม่ภายในสองวัน พอขึ้นเว็บแล้วจะเริ่มที่ Bronze และไต่อันดับขึ้นเมื่อคุณลงอัปเดต",
      "po.proto": "นี่เป็นเว็บต้นแบบ จึงยังไม่มีอะไรถูกส่งไป", "po.toProfile": "ไปที่โปรไฟล์ของคุณ", "po.again": "ลงอย่างอื่นอีก",
      "md.drop": "ลากคลิปหรือรูปมาวางที่นี่ หรือ<u>เลือกไฟล์</u>", "md.hint": "MP4 หรือ WebM ยาวไม่เกิน {clip} วินาที, PNG หรือ JPG ใส่ได้สูงสุด {files} ไฟล์ ไฟล์แรกจะเป็นปก",
      "md.list": "คลิปและรูปของคุณ เรียงตามลำดับ", "md.skipped": "มีบางไฟล์ถูกข้าม ใส่ได้เฉพาะรูปและคลิป", "md.fit": "ใส่ได้แค่ {files} ไฟล์ เพิ่มให้ {room} ไฟล์แรก",
      "md.long": "{name} ยาว {sec} วินาที ขอให้คลิปสั้นกว่า {max} วินาที หน้าเว็บจะเล่นแค่ช่วงต้น",
      "md.coverClip": "ปก · คลิป", "md.cover": "ปก", "md.clip": "คลิป", "md.earlier": "เลื่อน {name} ขึ้นก่อน", "md.makeCover": "ตั้ง {name} เป็นปก", "md.later": "เลื่อน {name} ไปหลัง", "md.remove": "เอา {name} ออก",
      "tm.you": "คุณ", "tm.roleOther": "เขาทำหน้าที่อะไร", "tm.roleYou": "หน้าที่ของคุณ", "tm.role": "บทบาทของ {name}", "tm.remove": "เอา {name} ออก",
      "tm.add": "เพิ่มเพื่อนร่วมทีม", "tm.addPh": "เพิ่มเพื่อนร่วมทีมด้วยชื่อ", "tm.addBtn": "เพิ่ม", "tm.hint": "คนที่อยู่บน Hamster Nest จะมีลิงก์ไปโปรไฟล์ ส่วนคนอื่นจะแสดงเป็นชื่อเฉย ๆ", "tm.already": "อยู่ในทีมแล้ว",
    },
  });

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
    constructor(root, onChange, keep = null) {
      this.root = root; this.items = keep ? keep.items : []; this.nk = keep ? keep.nk : null; this.onChange = onChange;
      root.innerHTML = `<div class="drop" tabindex="0" role="button" aria-describedby="drop-h">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 16V4M7 9l5-5 5 5M4 17v3h16v-3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
          <b>${tx("md.drop")}</b><i id="drop-h">${tx("md.hint", { clip: LIMITS.clip, files: LIMITS.files })}</i>
          <input type="file" accept="image/*,video/*" multiple hidden></div>
        <ol class="mlist" aria-label="${tx("md.list")}"></ol><p class="mnote" role="status" aria-live="polite"></p>`;
      const drop = $(".drop", root), input = $("input", root);
      drop.addEventListener("click", () => input.click());
      drop.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); input.click(); } });
      input.addEventListener("change", () => { this.add([...input.files]); input.value = ""; });
      ["dragenter", "dragover"].forEach((t) => drop.addEventListener(t, (e) => { e.preventDefault(); drop.classList.add("is-over"); }));
      ["dragleave", "drop"].forEach((t) => drop.addEventListener(t, () => drop.classList.remove("is-over")));
      drop.addEventListener("drop", (e) => { e.preventDefault(); this.add([...e.dataTransfer.files]); });
      this.paint(); if (this.nk) this.note(...this.nk);
    }
    // a note under the drop box; kept as a key so it is written again when the language changes
    note(key, vars) { this.nk = [key, vars]; $(".mnote", this.root).textContent = tx(key, vars); }
    add(files) {
      const ok = files.filter((f) => /^(image|video)\//.test(f.type));
      if (ok.length < files.length) this.note("md.skipped");
      const room = LIMITS.files - this.items.length;
      if (ok.length > room) this.note("md.fit", { files: LIMITS.files, room });
      ok.slice(0, Math.max(0, room)).forEach((f) => {
        const it = { url: URL.createObjectURL(f), video: f.type.startsWith("video/"), name: f.name, dur: null };
        this.items.push(it);
        if (it.video) {
          const v = document.createElement("video"); v.preload = "metadata"; v.src = it.url;
          v.addEventListener("loadedmetadata", () => { it.dur = v.duration; if (v.duration > LIMITS.clip) this.note("md.long", { name: f.name, sec: Math.round(v.duration), max: LIMITS.clip }); this.paint(); this.onChange(); });
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
          <span class="mi__tag">${i === 0 ? tx(it.video ? "md.coverClip" : "md.cover") : it.video ? `${tx("md.clip")}${it.dur ? ` · ${time(it.dur)}` : ""}` : `#${i + 1}`}</span>
          <span class="mi__acts">
            <button type="button" data-a="left" aria-label="${esc(tx("md.earlier", { name: it.name }))}"${i === 0 ? " disabled" : ""}>‹</button>
            ${i ? `<button type="button" data-a="cover" aria-label="${esc(tx("md.makeCover", { name: it.name }))}">${tx("md.cover")}</button>` : ""}
            <button type="button" data-a="right" aria-label="${esc(tx("md.later", { name: it.name }))}"${i === this.items.length - 1 ? " disabled" : ""}>›</button>
            <button type="button" data-a="x" aria-label="${esc(tx("md.remove", { name: it.name }))}">×</button></span></li>`).join("")
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
          <input type="text" value="${esc(m.role)}" placeholder="${tx(i ? "tm.roleOther" : "tm.roleYou")}" aria-label="${esc(tx("tm.role", { name: m.name }))}" data-i="${i}">
          ${m.you ? `<span class="you">${tx("tm.you")}</span>` : `<button type="button" class="x" data-i="${i}" aria-label="${esc(tx("tm.remove", { name: m.name }))}">×</button>`}</li>`).join("")}</ul>
        <div class="tm__add"><label class="sr" for="tm-name">${tx("tm.add")}</label><input id="tm-name" list="tm-people" placeholder="${tx("tm.addPh")}" autocomplete="off"><datalist id="tm-people">${this.people.map((n) => `<option value="${n}">`).join("")}</datalist><button type="button" class="add">${tx("tm.addBtn")}</button></div>
        <p class="fld__h">${tx("tm.hint")}</p>`;
      this.root.querySelectorAll(".tm input").forEach((i) => i.addEventListener("input", () => { t[+i.dataset.i].role = i.value; this.onChange(); }));
      this.root.querySelectorAll(".x").forEach((b) => b.addEventListener("click", () => { t.splice(+b.dataset.i, 1); this.paint(); this.onChange(); }));
      const n = $("#tm-name", this.root), add = () => {
        const name = n.value.trim().replace(/^\w/, (c) => c.toUpperCase()); if (!name) return;
        if (t.some((m) => m.name.toLowerCase() === name.toLowerCase())) { n.setCustomValidity(tx("tm.already")); n.reportValidity(); return; }
        t.push({ name, role: "" }); this.paint(); this.onChange(); $(".tm li:last-child input", this.root).focus();
      };
      $(".add", this.root).addEventListener("click", add);
      n.addEventListener("keydown", (e) => { n.setCustomValidity(""); if (e.key === "Enter") { e.preventDefault(); add(); } });
    }
  }

  // ---------- the page ----------
  class PostPage {
    constructor(root) { this.root = root; this.d = Draft.load(); this.finished = null; this.render(); }
    // buttons that act like radio (one) or checkboxes (many)
    choice(name, options, picked, many, label = (o) => o) {   // option values stay the English names; label() is what shows (rooms and genres: L.room / L.genre)
      return `<div class="${many ? "chips2" : "seg2"}" role="${many ? "group" : "radiogroup"}" aria-labelledby="${name}-l" data-name="${name}">${options.map((o) =>
        `<button type="button" role="${many ? "checkbox" : "radio"}" aria-checked="${many ? picked.includes(o) : picked === o}" data-v="${esc(o)}">${esc(label(o))}</button>`).join("")}</div>`;
    }
    render(keep = null) {
      const d = this.d, mine = ME.works().filter((x) => x.lead);
      this.finished = null;
      this.root.innerHTML = `
        <div class="po__head"><div><a class="back" href="profile.html#pim"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M10 3L5 8l5 5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>${tx("po.back")}</a>
          <h1>${tx("po.title")}</h1><p>${tx("po.lead")}</p></div>
          <div class="po__headr"><button type="button" class="ghost3 sm guide-btn" data-act="guide"><svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true"><path d="M3 2.5h6.5l3.5 3.5v7.5H3z M9.5 2.5V6H13" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><path d="M5.5 9h5M5.5 11.5h3.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>${tx("po.guide")}</button>
          <div class="mode" role="radiogroup" aria-label="${tx("po.modeAria")}"><button type="button" role="radio" data-mode="new" aria-checked="${d.mode === "new"}">${tx("po.mNew")}</button><button type="button" role="radio" data-mode="update" aria-checked="${d.mode === "update"}">${tx("po.mUpd")}</button></div></div></div>
        <div class="po__grid">
          <form class="po__form" novalidate>
            <div class="m-new">
              <section class="sec2" id="s-basics"><h2><span>1</span>${tx("po.s1")}</h2>
                <label class="fld"><span class="fld__l">${tx("po.name")} <em>${tx("po.req")}</em></span><input name="name" maxlength="${LIMITS.name}" value="${esc(d.name)}" placeholder="${tx("po.namePh")}" required><span class="cnt" data-for="name"></span></label>
                <label class="fld"><span class="fld__l">${tx("po.line")} <em>${tx("po.req")}</em></span><input name="line" maxlength="${LIMITS.line}" value="${esc(d.line)}" placeholder="${tx("po.linePh")}" required><span class="cnt" data-for="line"></span><span class="fld__h">${tx("po.lineH")}</span></label>
                <div class="fld"><span class="fld__l" id="room-l">${tx("po.room")} <em>${tx("po.req")}</em></span>${this.choice("room", Object.keys(rooms), d.room, false, (o) => L.room(o))}</div>
                <div class="fld" id="genre-f"></div>
                <div class="fld" id="plat-f"></div>
              </section>
              <section class="sec2" id="s-media"><h2><span>2</span>${tx("po.s2")}</h2><div id="media"></div></section>
              <section class="sec2" id="s-about"><h2><span>3</span>${tx("po.s3")}</h2>
                <label class="fld"><span class="fld__l">${tx("po.aboutL")}</span><textarea name="about" rows="6" maxlength="${LIMITS.about}" placeholder="${tx("po.aboutPh")}">${esc(d.about)}</textarea><span class="cnt cnt--b" data-for="about"></span><span class="fld__h">${tx("po.aboutH")}</span></label></section>
              <section class="sec2" id="s-team"><h2><span>4</span>${tx("po.s4")}</h2><div id="team"></div></section>
              <section class="sec2" id="s-contact"><h2><span>5</span>${tx("po.s5")}</h2>
                <p class="fld__h fld__h--top">${tx("po.reachH")}</p>
                <div class="row3"><label class="fld"><span class="fld__l">${tx("ct.email")}</span><input type="email" name="email" value="${esc(d.contact.email)}"></label>
                  <label class="fld"><span class="fld__l">${tx("ct.phone")}</span><input type="tel" name="phone" value="${esc(d.contact.phone)}"></label>
                  <label class="fld"><span class="fld__l">${tx("ct.line")}</span><input name="lineid" value="${esc(d.contact.line)}"></label></div>
                <label class="sw sw--inline"><span>${tx("po.showPhone")}</span><input type="checkbox" name="showPhone"${d.contact.showPhone ? " checked" : ""}></label></section>
              <section class="sec2" id="s-dl"><h2><span>6</span>${tx("po.s6")} <em class="opt">${tx("po.opt")}</em></h2>
                <div class="row2"><label class="fld"><span class="fld__l">${tx("po.btnLabel")}</span><input name="dlLabel" value="${esc(d.dl.label)}" placeholder="${tx("po.btnPh")}"></label>
                  <label class="fld"><span class="fld__l">${tx("po.link")}</span><input type="url" name="dlLink" value="${esc(d.dl.link)}" placeholder="${tx("po.linkPh")}"></label></div>
                <p class="fld__h">${tx("po.tryH")}</p></section>
            </div>
            <div class="m-update">
              <section class="sec2"><h2><span>1</span>${tx("po.u1")}</h2>
                <div class="pick">${mine.map(({ w }) => `<label class="pick__i"><input type="radio" name="uwork" value="${w.id}"${d.update.work === w.id ? " checked" : ""}><span class="pick__pic cv" data-id="${w.id}"></span><span><b>${esc(w.name)}</b><i>${esc(tx("po.lastUpd", { tier: tiers.find((t) => t.id === w.tier).name, when: L.ago(w.update.when) }))}</i></span></label>`).join("")}</div></section>
              <section class="sec2"><h2><span>2</span>${tx("po.u2")}</h2>
                <label class="fld"><span class="fld__l">${tx("po.uTitle")} <em>${tx("po.req")}</em></span><input name="utitle" maxlength="60" value="${esc(d.update.title)}" placeholder="${tx("po.uTitlePh")}"><span class="cnt" data-for="utitle"></span></label>
                <label class="fld"><span class="fld__l">${tx("po.uText")}</span><textarea name="utext" rows="4" maxlength="400" placeholder="${tx("po.uTextPh")}">${esc(d.update.text)}</textarea><span class="cnt cnt--b" data-for="utext"></span></label></section>
              <section class="sec2"><h2><span>3</span>${tx("po.u3")} <em class="opt">${tx("po.opt")}</em></h2><div id="umedia"></div></section>
            </div>
            <p class="po__err" role="alert"></p>
            <div class="po__acts"><button type="button" class="ghost3" data-act="save">${tx("po.save")}</button><span class="saved" aria-live="polite"></span><button type="button" class="pf__link" data-act="reset">${tx("po.reset")}</button><button type="submit" class="post">${tx("po.post")}</button></div>
          </form>
          <aside class="po__side">
            <section class="box pv2" aria-label="${tx("po.preview")}"><h3>${tx("po.how")}</h3><div class="pv2__body"></div></section>
            <section class="box chk"><h3>${tx("po.before")}</h3><ul></ul><p>${tx("po.chkNote")}</p></section>
          </aside>
        </div>`;
      this.media = new MediaField($("#media", this.root), () => this.update(), keep && keep.media);
      this.umedia = new MediaField($("#umedia", this.root), () => this.update(), keep && keep.umedia);
      this.team = new TeamField($("#team", this.root), d, () => this.update());
      this.root.querySelectorAll(".pick__pic").forEach((el) => Art.fill(el, works.find((w) => w.id === el.dataset.id)));
      this.paintRoomParts(); this.wire(); this.update(false);
      // a restored draft has its words but not its files (they stay on your computer)
      if (d.savedAt && (d.name || d.update.title) && !keep) { const m = d.mode === "update" ? this.umedia : this.media; m.note("po.draft"); }
    }
    // genre and platforms depend on the room
    paintRoomParts() {
      const d = this.d, g = $("#genre-f", this.root), p = $("#plat-f", this.root);
      if (!d.room) { g.innerHTML = `<span class="fld__l">${tx("po.genre")}</span><p class="fld__h">${tx("po.roomFirst")}</p>`; p.innerHTML = ""; return; }
      d.genres = d.genres.filter((x) => rooms[d.room].includes(x)); d.platforms = d.platforms.filter((x) => PLATFORMS[d.room].includes(x));
      g.innerHTML = `<span class="fld__l" id="genres-l">${tx("po.genre")} <em>${tx("po.pickOne")}</em></span>${this.choice("genres", rooms[d.room], d.genres, true, (o) => L.genre(o))}`;
      p.innerHTML = `<span class="fld__l" id="platforms-l">${tx(d.room === "Idea" ? "po.shared" : "po.runs")}</span>${this.choice("platforms", PLATFORMS[d.room], d.platforms, true)}`;
      this.wireChoices(g); this.wireChoices(p);
      if (!calm) [g, p].forEach((el) => el.animate([{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], { duration: 260, easing: E }));
    }
    wireChoices(scope) {
      scope.querySelectorAll("[data-name]").forEach((grp) => grp.querySelectorAll("button").forEach((b) => b.addEventListener("click", () => {
        const name = grp.dataset.name, v = b.dataset.v, d = this.d;
        if (name === "room") { d.room = d.room === v ? "" : v; grp.querySelectorAll("button").forEach((x) => x.setAttribute("aria-checked", x.dataset.v === d.room)); this.paintRoomParts(); }
        else if (name === "genres" && !d.genres.includes(v) && d.genres.length >= 2) { this.flash(grp, tx("po.twoGenres")); return; }
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
      $('[data-act="reset"]', this.root).addEventListener("click", () => { if (this.armed) { Draft.clear(); this.d = Draft.blank(); this.render(); scrollTo({ top: 0 }); return; } this.armed = true; const b = $('[data-act="reset"]', this.root); b.textContent = tx("po.resetSure"); setTimeout(() => { this.armed = false; b.textContent = tx("po.reset"); }, 2500); });
      f.addEventListener("submit", (e) => { e.preventDefault(); this.submit(); });
    }
    stamp(now) {
      const s = $(".saved", this.root); if (!this.d.savedAt) { s.textContent = ""; return; }
      const sec = Math.round((Date.now() - this.d.savedAt) / 1000);
      s.textContent = now || sec < 10 ? tx("po.saved0") : sec < 60 ? tx("po.savedS", { n: sec }) : tx("po.savedM", { n: Math.round(sec / 60) });
    }
    // what each mode needs; "req" ones stop posting
    checks() {
      const d = this.d;
      if (d.mode === "update") return [
        ["ck.pick", !!d.update.work, true], ["ck.utitle", d.update.title.trim().length > 2, true],
        ["ck.utext", d.update.text.trim().length > 10, false], ["ck.upic", this.umedia.items.length > 0, false]];
      return [
        ["ck.name", d.name.trim() && d.line.trim(), true], ["ck.room", !!d.room, true], ["ck.cover", !!this.media.cover, true],
        ["ck.clip", this.media.hasClip || this.media.items.length >= 3, false], ["ck.about", d.about.trim().length > 40, false],
        ["ck.roles", d.team.every((m) => m.role.trim()), false], ["ck.reach", !!(d.contact.email || d.contact.line), false], ["ck.try", !!d.dl.link, false]];
    }
    update(save = true) {
      const d = this.d;
      this.root.classList.toggle("is-update", d.mode === "update");
      // counters
      this.root.querySelectorAll(".cnt").forEach((c) => { const i = $(`[name="${c.dataset.for}"]`, this.root); c.textContent = `${i.value.length} / ${i.maxLength}`; c.classList.toggle("is-near", i.value.length > i.maxLength * 0.9); });
      // checklist
      const ch = this.checks(), done = ch.filter((c) => c[1]).length;
      $(".chk ul", this.root).innerHTML = ch.map(([t, ok, req]) => `<li class="${ok ? "ok" : ""}"><i aria-hidden="true">${ok ? "✓" : ""}</i><span>${tx(t)}${req ? ` <em>${tx("po.req")}</em>` : ""}</span><span class="sr">${tx(ok ? "po.done" : "po.notYet")}</span></li>`).join("");
      // the "still needed" line goes away as soon as nothing required is missing
      if (!ch.some((c) => c[2] && !c[1])) { $(".po__err", this.root).textContent = ""; this.err = false; }
      $(".chk h3", this.root).innerHTML = `${tx("po.before")} <span class="chk__n">${done} / ${ch.length}</span>`;
      this.preview();
      if (save) { Draft.save(d); this.stamp(true); }
      else this.stamp();
    }
    preview() {
      const d = this.d, body = $(".pv2__body", this.root);
      if (d.mode === "update") {
        const w = works.find((x) => x.id === d.update.work), cover = this.umedia.cover;
        body.innerHTML = w ? `<p class="pv2__k">${esc(tx("pv.updIn", { name: w.name }))}</p><div class="pv2__upd"><time>${L.ago("today")}</time><div><b>${esc(d.update.title || tx("pv.yourTitle"))}</b><p>${esc(d.update.text || tx("pv.fewWords"))}</p></div></div>
            ${cover ? `<div class="pv2__pic">${cover.video ? `<video src="${cover.url}" muted autoplay loop playsinline></video>` : `<img src="${cover.url}" alt="">`}</div>` : ""}
            <p class="pv2__k">${tx("pv.tile")}</p><p class="pv2__u"><span>${esc(tx("rc.updated", { when: L.ago("today") }))}</span>${esc(d.update.title || tx("pv.yourTitle"))}</p>`
          : `<p class="pv2__empty">${tx("pv.pickLeft")}</p>`;
        return;
      }
      const cover = this.media.cover, tags = [d.room && L.room(d.room), ...d.genres.map((g) => L.genre(g)), ...d.platforms].filter(Boolean);
      body.innerHTML = `<div class="pv2__tile">${cover ? (cover.video ? `<video src="${cover.url}" muted autoplay loop playsinline></video>` : `<img src="${cover.url}" alt="">`) : `<span class="pv2__ph">${tx("pv.cover")}</span>`}<span class="pv2__new">${tx("pv.new")}</span></div>
        <p class="pv2__n">${esc(d.name || tx("pv.name"))}</p><p class="pv2__l">${esc(d.line || tx("pv.line"))}</p>
        ${tags.length ? `<p class="pv2__t">${tags.map((t, i) => `<span${i === 0 ? ' class="is-room"' : ""}>${esc(t)}</span>`).join("")}</p>` : ""}
        ${d.team.length ? `<p class="pv2__team">${d.team.map((m) => `<span class="av3" style="--h:${new Person(m.name).hue}" title="${esc(m.name)}">${esc(m.name[0])}</span>`).join("")}<i>${d.team.map((m) => esc(m.name)).join(", ")}</i></p>` : ""}`;
    }
    submit() {
      const ch = this.checks(), miss = ch.filter((c) => c[2] && !c[1]), err = $(".po__err", this.root), d = this.d;
      this.root.querySelectorAll(".is-bad").forEach((x) => x.classList.remove("is-bad"));
      if (miss.length) {
        this.err = true; err.textContent = this.missingText(miss);
        const map = d.mode === "update" ? { "ck.pick": ".pick", "ck.utitle": '[name="utitle"]' } : { "ck.name": d.name.trim() ? '[name="line"]' : '[name="name"]', "ck.room": '[data-name="room"]', "ck.cover": "#media .drop" };
        const first = $(map[miss[0][0]], this.root);
        if (first) { first.closest(".fld, .sec2")?.classList.add("is-bad"); first.scrollIntoView({ behavior: calm ? "auto" : "smooth", block: "center" }); (first.matches("input,[tabindex]") ? first : first.querySelector("button,input"))?.focus({ preventScroll: true }); }
        return;
      }
      err.textContent = "";
      this.finished = { mode: d.mode, name: d.name, work: d.update.work };
      const box = this.paintDone();
      if (!calm) box.animate([{ opacity: 0, transform: "translateY(12px)" }, { opacity: 1, transform: "none" }], { duration: 400, easing: E });
      Draft.clear();
      $('[data-act="again"]', box).addEventListener("click", () => { this.d = Draft.blank(); this.render(); scrollTo({ top: 0 }); });
      scrollTo({ top: 0, behavior: calm ? "auto" : "smooth" });
    }
    missingText(miss) { return tx("po.almost", { list: miss.map((m) => tx(m[0]).toLowerCase()).join(L.th ? " · " : ", ") }); }
    // the "it's in" screen, drawn from what was posted, so a language switch can draw it again
    paintDone() {
      const f = this.finished, w = works.find((x) => x.id === f.work);
      const box = $(".po__grid", this.root);
      box.innerHTML = `<section class="done" role="status"><span class="hi__tick"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
        <h2>${f.mode === "update" ? esc(tx("po.updPosted", { name: w.name })) : esc(tx("po.queued", { name: f.name }))}</h2>
        <p>${tx(f.mode === "update" ? "po.updP" : "po.newP")}</p>
        <p class="done__note">${tx("po.proto")}</p>
        <div class="dlg__acts"><a class="ghost3" href="profile.html#pim">${tx("po.toProfile")}</a><button type="button" class="post" data-act="again">${tx("po.again")}</button></div></section>`;
      return box;
    }
    // the language changed: draw the page again in the new words; the draft, the files and the scroll stay
    relabel() {
      const y = scrollY, keep = { media: this.media, umedia: this.umedia };
      if (this.finished) { const box = this.paintDone(); $('[data-act="again"]', box).addEventListener("click", () => { this.d = Draft.blank(); this.render(); scrollTo({ top: 0 }); }); return; }
      this.render(keep); scrollTo({ top: y, behavior: "auto" });
      const miss = this.checks().filter((c) => c[2] && !c[1]);
      if (this.err && miss.length) $(".po__err", this.root).textContent = this.missingText(miss);
    }
  }

  // posting needs you signed in; logging out from here takes you home (session.js)
  NestSession.menuOptions = { requires: true };
  if (NestSession.gate($("#main"))) {
    const page = new PostPage($("#main"));
    L.addEventListener("change", () => page.relabel());
    // starting a new project opens the guide (unless they asked us not to, or a link points at the guide)
    if (page.d.mode === "new" && !/^#(rules?|after)/.test(location.hash)) window.NestGuide.auto();
    setInterval(() => page.stamp(), 15000);
  }
  const bar = $(".gbar"), onScroll = () => bar.classList.toggle("gbar--framed", scrollY > 160);
  addEventListener("scroll", onScroll, { passive: true }); onScroll();
})();
