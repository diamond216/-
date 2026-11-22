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
      Game: [["Fixed the jump that felt floaty", "Lowered gravity at the top of the jump and added coyote time."], ["Posted the two-player demo", "Both players on one keyboard, WASD and arrows."]],
      IoT: [["Swapped to a cheaper sensor", "Same readings within 2 percent, half the price."], ["First prototype on the bench", "Breadboard, a power bank and a lot of tape."]],
      Web: [["Moved to a new host", "Pages load in under a second from school Wi-Fi."], ["First version online", "Twelve classmates tried it on day one."]],
      Idea: [["Wrote the one-page plan", "Who it's for, what it costs, and what we need first."], ["Asked thirty classmates", "Twenty-one said they would join."]],
    };
    static AWARDS = [["Best of the school fair", "Science fair, Aug 2026"], ["People's pick", "Open house, Sep 2026"], ["Best newcomer", "Hamster Hub demo day, Oct 2026"]];
    constructor(w) { this.w = w; }
    team() {
      const others = [...new Set(works.filter((x) => x.room === this.w.room && x.maker !== this.w.maker).map((x) => x.maker))];
      const size = 2 + seed(this.w.id, 3), start = seed(this.w.name, others.length);
      const names = [this.w.maker, ...Array.from({ length: size - 1 }, (_, i) => others[(start + i * 3) % others.length])];
      return names.map((n, i) => [n, SampleDetails.ROLES[this.w.room][i]]);
    }
    updates() {
      const ago = ["5 days ago", "2 weeks ago"];
      return [[this.w.update.when, this.w.update.what, this.w.blurb], ...SampleDetails.MORE[this.w.room].map(([a, b], i) => [ago[i], a, b])];
    }
    awards() {
      const t = tiers.find((x) => x.id === this.w.tier);
      const extra = SampleDetails.AWARDS.filter((_, i) => (seed(this.w.id, 5) >> i) & 1).slice(0, 2);
      return [[`${t.name} rank`, `Hamster Nest, place ${tiers.indexOf(t) * 10 + this.w.place} of 50`, true], ...extra.map(([a, b]) => [a, b, false])];
    }
  }

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
        </div>
        <div class="pj__grid">
          <div class="pj__main">
            <div class="media"><div class="cv"></div><button type="button" class="play" aria-label="Play the clip of ${w.name}" aria-pressed="false"><svg viewBox="0 0 24 24" aria-hidden="true"><path class="i-play" d="M8 5v14l11-7z" fill="currentColor"/><path class="i-pause" d="M7 5h4v14H7zM13 5h4v14h-4z" fill="currentColor"/></svg></button></div>
            <section class="log" aria-labelledby="log-h"><h2 id="log-h">Updates</h2><ol>${updates.map(([when, what, more], i) => `<li${i ? "" : ' class="is-new"'}><time>${when}</time><div><b>${what}</b><p>${more}</p></div></li>`).join("")}</ol></section>
          </div>
          <aside class="pj__side">
            <section class="box"><h3>Team</h3><ul class="team">${team.map(([n, r]) => `<li><span class="av" style="--h:${hue(n)}" aria-hidden="true">${n[0]}</span><span><b>${n}</b><i>${r}</i></span></li>`).join("")}</ul><a class="say" href="#">Say hi to the team</a></section>
            <section class="box"><h3>Latest update</h3><p class="when">${updates[0][0]}</p><p class="what">${updates[0][1]}</p></section>
            <section class="box"><h3>Awards</h3><ul class="aw">${d.awards().map(([a, s, rank]) => `<li><span class="medal${rank ? " medal--rank" : ""}" aria-hidden="true">${rank ? "◆" : "★"}</span><span><b>${a}</b><i>${s}</i></span></li>`).join("")}</ul></section>
          </aside>
        </div>
        ${this.more(w)}`;
      Art.fill($(".media .cv", this.root), w, 1);
      this.root.querySelectorAll(".cl__pic").forEach((el) => Art.fill(el, works.find((x) => x.id === el.dataset.id)));
      const play = $(".play", this.root), media = $(".media", this.root);
      this.preview = window.Previews.for(media, { ...w, scribble: "" });
      media.insertBefore(media.lastElementChild, play);
      play.addEventListener("click", () => {
        const on = play.getAttribute("aria-pressed") !== "true";
        play.setAttribute("aria-pressed", on); play.setAttribute("aria-label", `${on ? "Pause" : "Play"} the clip of ${w.name}`);
        media.classList.toggle("is-playing", on); on ? this.preview.start() : this.preview.stop();
      });
      if (!calm) this.enter();
    }
    // the rest of the class: same room first, then the others, numbered like a hall of fame
    more(w) {
      const list = [...works.filter((x) => x.room === w.room && x.id !== w.id), ...works.filter((x) => x.room !== w.room)].slice(0, 10);
      return `<section class="class" aria-labelledby="class-h"><div class="class__h"><h2 id="class-h">MORE FROM THE CLASS</h2><span>HALL OF FAME · 2026</span></div>
        <div class="class__g">${list.map((x, i) => `<a class="cl" href="project.html#${x.id}" style="--ri:${INK[x.tier]}"><span class="cl__pic cv" data-id="${x.id}"></span><b>${x.name}</b><span class="cl__n">${String(i + 1).padStart(2, "0")}<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M3 9l6-6M4.5 3H9v4.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></span></a>`).join("")}</div></section>`;
    }
    enter() {
      const E = "cubic-bezier(.2,.8,.2,1)";
      const seq = [".back", ".tags", ".title", ".blurb", ".media", ".pj__side .box:nth-child(1)", ".pj__side .box:nth-child(2)", ".pj__side .box:nth-child(3)", ".log"];
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
