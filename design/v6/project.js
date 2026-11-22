// Project page. Reads the work's id from the URL hash (project.html#burrow-knights), so "More from the class"
// can move between works without a reload. Team, roles, awards and older updates are sample data built from the work.
(function () {
  "use strict";
  const { works, tiers } = window.NEST;
  const $ = (s, r = document) => r.querySelector(s);
  const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const INK = { platinum: "#3550A8", diamond: "#1E93C2", gold: "#C08A12", silver: "#7A8794", bronze: "#B0602F" };
  const hue = (s) => [...s].reduce((n, c) => n + c.charCodeAt(0), 0) % 360;
  const seed = (s, n) => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7) % n;

  // ---------- sample details, one place to swap for real data later ----------
  class SampleDetails {
    static ROLES = {
      Game: ["Lead, game design", "Programming", "Pixel art, animation", "Sound and music"],
      IoT: ["Lead, hardware", "Firmware", "Case design, 3D print", "Field testing"],
      Web: ["Lead, product", "Front end", "Back end, database", "Design"],
      Idea: ["Lead, the plan", "Money and numbers", "Talking to people", "Poster and pitch"],
    };
    static MORE = {
      Game: [["Fixed the jump that felt floaty", "Lowered gravity at the top of the jump and added coyote time."], ["Posted the two-player demo", "Both players on one keyboard, WASD and arrows."], ["New tileset for the caves", "Kaew redrew every rock so the two worlds look different."], ["Playtest at lunch", "Fourteen people played; most got stuck on the same ladder, so we moved it."], ["Music for the first level", "A short loop that speeds up when the lava rises."], ["First build that runs", "One room, one enemy, and a jump that felt wrong."]],
      IoT: [["Swapped to a cheaper sensor", "Same readings within 2 percent, half the price."], ["First prototype on the bench", "Breadboard, a power bank and a lot of tape."], ["Messages in Thai", "Alerts now come in Thai or English."], ["Survived a week of rain", "No water inside the case after seven days outdoors."], ["Battery test", "Two AA cells lasted 16 days with a reading every ten minutes."], ["Parts list posted", "Everything costs under 600 baht."]],
      Web: [["Moved to a new host", "Pages load in under a second from school Wi-Fi."], ["First version online", "Twelve classmates tried it on day one."], ["Search that understands Thai", "Typing part of a word now finds it."], ["Bigger buttons on phones", "Tested with the oldest phone in the class."], ["Teachers can post too", "A teacher account with its own page."], ["Wrote the help page", "Five questions people asked most."]],
      Idea: [["Wrote the one-page plan", "Who it's for, what it costs, and what we need first."], ["Asked thirty classmates", "Twenty-one said they would join."], ["Talked to the school office", "They said yes to a trial if a teacher signs."], ["Made the poster", "Put up in the canteen and on the class chat."], ["Ran the numbers again", "It still works if only eight people join."], ["The idea, on a napkin", "Where it all started, at lunch."]],
    };
    static AWARDS = [["Best of the school fair", "Science fair, Aug 2026"], ["People's pick", "Open house, Sep 2026"], ["Best newcomer", "Hamster Hub demo day, Oct 2026"]];
    constructor(w) { this.w = w; }
    // what you can take home: label, detail, button word
    download() {
      return { Game: ["Free download", `${this.w.platforms.join(", ")} · 84 MB`], IoT: ["Code and case files", "ZIP · 2.1 MB"], Web: ["Source code", "ZIP · 640 KB"], Idea: ["The plan, as a PDF", "PDF · 1.2 MB"] }[this.w.room];
    }
    // a few paragraphs about the work, written the way a student would put it
    description() {
      const W = this.w, D = {
        Game: [`We started ${W.name} in a two-week game jam and kept going because people kept asking for the next level.`, "It runs on a school laptop without a graphics card, and two people can play on one keyboard.", "Next we want to add a level editor so the class can make their own maps."],
        IoT: [`${W.name} began as a science project and is now running every day.`, "The board is an ESP32 in a 3D-printed case. It sends a reading every ten minutes and a message when something is off.", "We are looking for a second place to test it before we make ten more."],
        Web: [`${W.name} is a small site we built because we needed it ourselves.`, "It works on old phones and slow school Wi-Fi, and it needs no sign-up to read.", "Teachers asked for a version for their own classes, so that is what we are building next."],
        Idea: [`${W.name} is still an idea, but a tested one.`, "We ran a one-week trial with friends and wrote down what worked and what didn't.", "We need one teacher or adult to back it before we try it with a whole class."],
      }[W.room];
      return D;                                               // the one-line blurb is already under the title
    }
    // how to reach the lead maker; sample values on reserved domains and a made-up number
    contact() {
      const h = this.w.maker.toLowerCase(), n = String(1000 + seed(this.w.id, 9000)).padStart(4, "0");
      return [
        ["email", "Email", `${h}.${this.w.id.split("-")[0]}@student.example.ac.th`, `mailto:${h}.${this.w.id.split("-")[0]}@student.example.ac.th`],
        ["phone", "Phone", `08${seed(this.w.name, 10)}-${String(100 + seed(h, 900))}-${n}`, null],
        ["line", "LINE", `@${h}_${this.w.id.split("-")[0]}`, null],
      ];
    }
    team() {
      const others = [...new Set(works.filter((x) => x.room === this.w.room && x.maker !== this.w.maker).map((x) => x.maker))];
      const size = 2 + seed(this.w.id, 3), start = seed(this.w.name, others.length);
      const names = [this.w.maker, ...Array.from({ length: size - 1 }, (_, i) => others[(start + i * 3) % others.length])];
      return names.map((n, i) => [n, SampleDetails.ROLES[this.w.room][i]]);
    }
    updates() {
      const ago = ["5 days ago", "1 week ago", "2 weeks ago", "3 weeks ago", "last month", "2 months ago"];
      const NOTE = { Game: "New caves, a new boss, and a checkpoint just before it.", IoT: "Lighter, sealed against rain, and the antenna now sits outside the box.",
        Web: "Every page got lighter: the home page went from 2 MB to 300 KB.", Idea: "We counted who came back in week two: eight out of ten." };
      return [[this.w.update.when, this.w.update.what, NOTE[this.w.room]], ...SampleDetails.MORE[this.w.room].map(([a, b], i) => [ago[i], a, b])];
    }
    awards() {
      const t = tiers.find((x) => x.id === this.w.tier);
      const extra = SampleDetails.AWARDS.filter((_, i) => (seed(this.w.id, 5) >> i) & 1).slice(0, 2);
      return [[`${t.name} rank`, `Hamster Nest, place ${tiers.indexOf(t) * 10 + this.w.place} of 50`, true], ...extra.map(([a, b]) => [a, b, false])];
    }
  }

  const ICON = {
    email: '<path d="M3 6.5h18v11H3z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M3.5 7l8.5 6.5L20.5 7" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/>',
    phone: '<path d="M7 3.5h3l1.5 4-2 1.3a10 10 0 005.7 5.7l1.3-2 4 1.5v3a2 2 0 01-2.2 2A16 16 0 015 5.7 2 2 0 017 3.5z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/>',
    line: '<path d="M12 4C7 4 3 7.2 3 11.1c0 3.5 3.1 6.4 7.4 7l-.5 2.4 3.4-2.3c4.3-.5 7.7-3.5 7.7-7.1C21 7.2 17 4 12 4z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/>',
    ig: '<rect x="4" y="4" width="16" height="16" rx="5" fill="none" stroke="currentColor" stroke-width="1.7"/><circle cx="12" cy="12" r="3.6" fill="none" stroke="currentColor" stroke-width="1.7"/><circle cx="16.8" cy="7.2" r="1" fill="currentColor"/>',
    copy: '<rect x="8" y="8" width="12" height="12" rx="2" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M16 8V5a1 1 0 00-1-1H5a1 1 0 00-1 1v10a1 1 0 001 1h3" fill="none" stroke="currentColor" stroke-width="1.7"/>',
    ok: '<path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
  };
  const svg = (k) => `<svg viewBox="0 0 24 24" aria-hidden="true">${ICON[k]}</svg>`;

  // ---------- page ----------
  class ProjectPage {
    constructor(root) { this.root = root; this.preview = null; }
    render(w) {
      const t = tiers.find((x) => x.id === w.tier), d = new SampleDetails(w), ink = INK[w.tier];
      const updates = d.updates(), team = d.team();
      document.title = `${w.name} · Hamster Nest`;
      this.root.style.setProperty("--ri", ink);
      this.root.innerHTML = `
        <div class="pj__head">
          <a class="back" href="browse.html"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M10 3L5 8l5 5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>Back to Browse</a>
          <p class="tags"><a class="tag tag--room" href="browse.html">${w.room}</a><span class="tag tag--room">${w.genre}</span>${w.platforms.map((p) => `<span class="tag">${p}</span>`).join("")}<span class="rk"><i></i>${t.name}</span></p>
          <h1 class="title">${w.name}</h1>
          <p class="blurb">${w.blurb}</p>
          <div class="dl"><span><b>${d.download()[0]}</b><i>${d.download()[1]}</i></span><a class="dl__btn" href="#" download><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 3v10M5.5 8.5L10 13l4.5-4.5M4 16.5h12" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg>Download</a></div>
        </div>
        <div class="pj__grid">
          <div class="pj__main">
            <div class="gal" role="region" aria-roledescription="carousel" aria-label="Clip and pictures of ${w.name}">
              <div class="gal__track" tabindex="0">${this.slides(w).map((s, i) => `<figure class="gal__slide${s.clip ? " media" : ""}" data-i="${i}" aria-label="${s.label}"><div class="cv"></div>${s.clip ? `<button type="button" class="play" aria-label="Play the clip of ${w.name}" aria-pressed="false"><svg viewBox="0 0 24 24" aria-hidden="true"><path class="i-play" d="M8 5v14l11-7z" fill="currentColor"/><path class="i-pause" d="M7 5h4v14H7zM13 5h4v14h-4z" fill="currentColor"/></svg></button><span class="gal__kind">Clip</span>` : ""}</figure>`).join("")}</div>
              <button type="button" class="gal__nav gal__nav--prev" aria-label="Previous"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M12.5 4l-6 6 6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
              <button type="button" class="gal__nav gal__nav--next" aria-label="Next"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M7.5 4l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
              <span class="gal__count" aria-live="polite"></span>
            </div>
            <div class="thumbs">${this.slides(w).map((s, i) => `<button type="button" class="thumb" data-i="${i}" aria-label="Show ${s.label}"><span class="cv"></span>${s.clip ? '<i aria-hidden="true">▶</i>' : ""}</button>`).join("")}</div>
            <section class="about" aria-labelledby="about-h"><h2 id="about-h">About this project</h2>${d.description().map((p, i) => `<p${i ? "" : ' class="about__lead"'}>${p}</p>`).join("")}</section>
            <section class="log" aria-labelledby="log-h"><h2 id="log-h">Updates <span class="log__n">${updates.length}</span></h2><ol class="log__list" tabindex="0" aria-label="Updates, newest first">${updates.map(([when, what, more], i) => `<li${i ? "" : ' class="is-new"'}><time>${when}</time><div><b>${what}</b><p>${more}</p></div></li>`).join("")}</ol></section>
          </div>
          <aside class="pj__side">
            <section class="box"><h3>Team</h3><ul class="team">${team.map(([n, r]) => `<li><span class="av" style="--h:${hue(n)}" aria-hidden="true">${n[0]}</span><span><b>${n}</b><i>${r}</i></span></li>`).join("")}</ul><a class="say" href="#">Say hi to the team</a></section>
            <section class="box contact" aria-labelledby="ct-h"><h3 id="ct-h">Contact</h3><p class="contact__who">Reach ${w.maker}, who leads the team.</p>
              <ul>${d.contact().map(([k, label, value, href]) => `<li><span class="ci">${svg(k)}</span><span class="cv2"><i>${label}</i>${href ? `<a href="${href}">${value.replace("@", "@<wbr>")}</a>` : `<b>${value}</b>`}</span><button type="button" class="cp" data-v="${value}" aria-label="Copy ${label}">${svg("copy")}</button></li>`).join("")}</ul>
              <p class="contact__note" role="status" aria-live="polite"></p></section>

            <section class="box"><h3>Awards</h3><ul class="aw">${d.awards().map(([a, s, rank]) => `<li><span class="medal${rank ? " medal--rank" : ""}" aria-hidden="true">${rank ? "◆" : "★"}</span><span><b>${a}</b><i>${s}</i></span></li>`).join("")}</ul></section>
          </aside>
        </div>
        ${this.more(w)}`;
      this.gallery(w);
      this.scroller($(".log__list", this.root));
      this.fillMore(w);
      this.root.querySelectorAll(".cp").forEach((b) => b.addEventListener("click", () => this.copy(b)));
      if (!calm) this.enter();
    }
    // the clip first, then pictures (frames of the work's art stand in for screenshots)
    slides(w) { return [{ clip: true, label: "Clip", frame: 1 }, ...[2, 3, 4, 5].map((f, i) => ({ clip: false, label: `Picture ${i + 1}`, frame: f }))]; }
    gallery(w) {
      const root = $(".gal", this.root), track = $(".gal__track", root), slides = [...track.children], thumbs = [...this.root.querySelectorAll(".thumb")];
      const list = this.slides(w), bare = { ...w, scribble: "" };
      slides.forEach((s, i) => Art.fill($(".cv", s), bare, list[i].frame));
      thumbs.forEach((t, i) => Art.fill($(".cv", t), bare, list[i].frame));
      // the clip
      const clip = slides[0], play = $(".play", clip);
      this.preview = window.Previews.for(clip, bare); clip.insertBefore(clip.lastElementChild, play);
      const setPlay = (on) => { play.setAttribute("aria-pressed", on); play.setAttribute("aria-label", `${on ? "Pause" : "Play"} the clip of ${w.name}`); clip.classList.toggle("is-playing", on); on ? this.preview.start() : this.preview.stop(); };
      play.addEventListener("click", () => setPlay(play.getAttribute("aria-pressed") !== "true"));
      // moving between slides: scroll-snap does the swipe; buttons, thumbnails and arrow keys scroll to a slide
      let at = 0;
      const go = (i) => { i = Math.max(0, Math.min(slides.length - 1, i)); track.scrollTo({ left: slides[i].offsetLeft, behavior: calm ? "auto" : "smooth" }); };
      const mark = () => {
        const i = Math.round(track.scrollLeft / track.clientWidth); if (i === at && root.dataset.ready) return;
        at = i; root.dataset.ready = 1;
        thumbs.forEach((t, k) => t.setAttribute("aria-current", k === i));
        $(".gal__count", root).textContent = `${i + 1} / ${slides.length}`;
        $(".gal__nav--prev", root).disabled = i === 0; $(".gal__nav--next", root).disabled = i === slides.length - 1;
        if (i !== 0 && play.getAttribute("aria-pressed") === "true") setPlay(false);   // leaving the clip pauses it
        thumbs[i].scrollIntoView({ block: "nearest", inline: "nearest", behavior: calm ? "auto" : "smooth" });
      };
      track.addEventListener("scroll", () => requestAnimationFrame(mark), { passive: true });
      $(".gal__nav--prev", root).addEventListener("click", () => go(at - 1));
      $(".gal__nav--next", root).addEventListener("click", () => go(at + 1));
      thumbs.forEach((t, i) => t.addEventListener("click", () => go(i)));
      track.addEventListener("keydown", (e) => { if (e.key === "ArrowRight") { e.preventDefault(); go(at + 1); } if (e.key === "ArrowLeft") { e.preventDefault(); go(at - 1); } });
      mark();
    }
    // a scrolling list shows a fade at whichever end still has more
    scroller(el) {
      const set = () => {
        el.classList.toggle("has-more-below", el.scrollTop + el.clientHeight < el.scrollHeight - 2);
        el.classList.toggle("has-more-above", el.scrollTop > 2);
      };
      el.addEventListener("scroll", set, { passive: true }); addEventListener("resize", set); set();
    }
    // works that share this one's room, genre or platforms, most alike first
    similar(w) {
      const score = (x) => (x.room === w.room ? 4 : 0) + (x.genre === w.genre ? 3 : 0) + x.platforms.filter((p) => w.platforms.includes(p)).length;
      return works.filter((x) => x.id !== w.id).map((x) => [x, score(x)]).filter(([, s]) => s > 0)
        .sort((a, b) => b[1] - a[1] || tiers.findIndex((t) => t.id === a[0].tier) - tiers.findIndex((t) => t.id === b[0].tier)).slice(0, 10).map(([x]) => x);
    }
    more(w) {
      return `<section class="like" aria-labelledby="like-h"><div class="like__h"><h2 id="like-h">EXPLORE MORE</h2><span>${w.room.toUpperCase()} · ${w.genre.toUpperCase()}</span></div><div class="grid like__g"></div></section>`;
    }
    fillMore(w) {
      const g = $(".like__g", this.root), { ResultCard, Expander } = window.Tiles;
      this.similar(w).forEach((x) => g.appendChild(new ResultCard(x).render()));
      if (this.ex) this.ex.collapse(false);
      this.ex = new Expander(g);
    }
    copy(btn) {
      const note = $(".contact__note", this.root), done = (msg) => { note.textContent = msg; btn.innerHTML = svg("ok"); btn.classList.add("is-done");
        btn.animate([{ transform: "scale(.8)" }, { transform: "scale(1)" }], { duration: 220, easing: "cubic-bezier(.34,1.5,.64,1)" }).finished.then(() => btn.animate([{ opacity: 1 }, { opacity: 1 }], { duration: 1600 }).finished).then(() => { btn.innerHTML = svg("copy"); btn.classList.remove("is-done"); }); };
      navigator.clipboard.writeText(btn.dataset.v).then(() => done(`Copied ${btn.dataset.v}`), () => done(`Select and copy: ${btn.dataset.v}`));
    }
    enter() {
      const E = "cubic-bezier(.2,.8,.2,1)";
      const seq = [".back", ".tags", ".title", ".blurb", ".gal", ".thumbs", ".dl", ".pj__side .box:nth-child(1)", ".pj__side .box:nth-child(2)", ".pj__side .box:nth-child(3)", ".about", ".log"];
      seq.forEach((s, i) => { const el = $(s, this.root); el && el.animate([{ opacity: 0, transform: "translateY(14px)", filter: "blur(4px)" }, { opacity: 1, transform: "none", filter: "blur(0)" }], { duration: 520, delay: i * 55, easing: E, fill: "backwards" }); });
    }
    stop() { if (this.preview) this.preview.stop(); }
  }

  const page = new ProjectPage($("#main"));
  const show = () => {
    const id = decodeURIComponent(location.hash.slice(1)), w = works.find((x) => x.id === id) || works[0];
    page.stop(); page.render(w);
    scrollTo({ top: 0, behavior: calm ? "auto" : "smooth" });
  };
  addEventListener("hashchange", show); show();

  // the bar turns white once you scroll past the water
  const bar = $(".gbar"), onScroll = () => bar.classList.toggle("gbar--framed", scrollY > 260);
  addEventListener("scroll", onScroll, { passive: true }); onScroll();
})();
