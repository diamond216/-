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

  const { SampleDetails } = window.Details;

  // words on this page (lang.js). A work's name, texts, updates, team, roles, awards, links and tags, and the room,
  // genre and tier names, are printed as written.
  const L = window.NestLang, tx = (k, v) => L.t(k, v);
  L.add({
    en: {
      "pj.back": "Back to Browse", "pj.save": "Save {name} to your favourites", "pj.unsave": "Remove {name} from your favourites",
      "pj.inFavs": "In your favourites", "pj.toFavs": "Save to favourites", "pj.gal": "Clip and pictures of {name}",
      "pj.clip": "Clip", "pj.pic": "Picture {n}", "pj.play": "Play the clip of {name}", "pj.pause": "Pause the clip of {name}",
      "pj.prev": "Previous", "pj.next": "Next", "pj.show": "Show {label}", "pj.about": "About this project",
      "pj.updates": "Updates", "pj.updatesAria": "Updates, newest first", "pj.new": "New", "pj.links": "Links", "pj.team": "Team", "pj.contact": "Contact",
      "pj.reach": "Reach {name}, who leads the team.", "pj.copy": "Copy {label}", "pj.awards": "Awards", "pj.more": "EXPLORE MORE",
      "pj.copied": "Copied {v}", "pj.select": "Select and copy: {v}",
    },
    th: {
      "pj.back": "กลับไปสำรวจผลงาน", "pj.save": "บันทึก {name} ไว้ในรายการโปรด", "pj.unsave": "เอา {name} ออกจากรายการโปรด",
      "pj.inFavs": "อยู่ในรายการโปรดแล้ว", "pj.toFavs": "บันทึกไว้ในรายการโปรด", "pj.gal": "คลิปและรูปของ {name}",
      "pj.clip": "คลิป", "pj.pic": "รูปที่ {n}", "pj.play": "เล่นคลิปของ {name}", "pj.pause": "หยุดคลิปของ {name}",
      "pj.prev": "ก่อนหน้า", "pj.next": "ถัดไป", "pj.show": "ดู{label}", "pj.about": "เกี่ยวกับผลงานนี้",
      "pj.updates": "อัปเดต", "pj.updatesAria": "อัปเดต เรียงจากใหม่สุด", "pj.new": "ใหม่", "pj.links": "ลิงก์", "pj.team": "ทีม", "pj.contact": "ติดต่อ",
      "pj.reach": "ติดต่อ {name} หัวหน้าทีมได้ที่นี่", "pj.copy": "คัดลอก {label}", "pj.awards": "รางวัล", "pj.more": "ดูผลงานอื่นเพิ่ม",
      "pj.copied": "คัดลอก {v} แล้ว", "pj.select": "คัดลอกเองได้เลย: {v}",
    },
  });

  const ICON = {
    link: '<path d="M10 14a4.5 4.5 0 006.4 0l3-3a4.5 4.5 0 00-6.4-6.4l-1.2 1.2" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><path d="M14 10a4.5 4.5 0 00-6.4 0l-3 3a4.5 4.5 0 006.4 6.4l1.2-1.2" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>',
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
    updateFig(w, i, title, alt = "") {
      if (![0, 2, 3, 6].includes(i)) return "";
      const src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(Art.draw({ ...w, scribble: "" }, i % 7));
      return `<figure class="up-fig"><img class="up-img" src="${src}" alt="${alt || title}" width="240" height="135"${i ? ' loading="lazy"' : ""} decoding="async"></figure>`;
    }
    render(w, animate = true) {
      this.w = w;
      const t = tiers.find((x) => x.id === w.tier), d = new SampleDetails(w), ink = INK[w.tier];
      const updates = d.updates(), team = d.team(), links = d.links();
      document.title = `${w.name} · Hamster Nest`;
      this.root.style.setProperty("--ri", ink);
      this.root.innerHTML = `
        <div class="pj__head">
          <a class="back" href="${NestSession.Paths.home("#browse-page")}"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M10 3L5 8l5 5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>${tx("pj.back")}</a>
          <p class="tags"><a class="tag tag--room" href="${NestSession.Paths.browse(w.room)}">${L.room(w.room)}</a><span class="tag tag--room">${L.genre(w.genre)}</span>${w.platforms.map((p) => `<span class="tag">${p}</span>`).join("")}<span class="rk"><i></i>${t.name}</span></p>
          <div class="title-row"><h1 class="title">${w.name}</h1><button type="button" class="fav" aria-pressed="false" aria-label="${tx("pj.save", { name: w.name })}"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 16.5s-6.5-3.9-6.5-8.6A3.6 3.6 0 0110 5.6a3.6 3.6 0 016.5 2.3c0 4.7-6.5 8.6-6.5 8.6z" fill="var(--fill,none)" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg></button></div>
          <p class="blurb">${w.blurb}</p>
        </div>
        <div class="pj__grid">
          <div class="pj__main">
            <div class="gal" role="region" aria-roledescription="carousel" aria-label="${tx("pj.gal", { name: w.name })}">
              <div class="gal__track" tabindex="0">${this.slides(w).map((s, i) => `<figure class="gal__slide${s.clip ? " media" : ""}" data-i="${i}" aria-label="${s.label}"><div class="cv"></div>${s.clip ? `<button type="button" class="play" aria-label="${tx("pj.play", { name: w.name })}" aria-pressed="false"><svg viewBox="0 0 24 24" aria-hidden="true"><path class="i-play" d="M8 5v14l11-7z" fill="currentColor"/><path class="i-pause" d="M7 5h4v14H7zM13 5h4v14h-4z" fill="currentColor"/></svg></button><span class="gal__kind">${tx("pj.clip")}</span>` : ""}</figure>`).join("")}</div>
              <button type="button" class="gal__nav gal__nav--prev" aria-label="${tx("pj.prev")}"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M12.5 4l-6 6 6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
              <button type="button" class="gal__nav gal__nav--next" aria-label="${tx("pj.next")}"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M7.5 4l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
              <span class="gal__count" aria-live="polite"></span>
            </div>
            <div class="thumbs">${this.slides(w).map((s, i) => `<button type="button" class="thumb" data-i="${i}" aria-label="${tx("pj.show", { label: s.label })}"><span class="cv"></span>${s.clip ? '<i aria-hidden="true">▶</i>' : ""}</button>`).join("")}</div>
            <section class="about" aria-labelledby="about-h"><h2 id="about-h">${tx("pj.about")}</h2>${d.description().map((p, i) => `<p${i ? "" : ' class="about__lead"'}>${p}</p>`).join("")}</section>
            <section class="log" aria-labelledby="log-h"><h2 id="log-h">${tx("pj.updates")} <span class="log__n">${updates.length}</span></h2><ol class="log__list" tabindex="0" aria-label="${tx("pj.updatesAria")}">${updates.map(([when, what, more], i) => `<li${i ? "" : ' class="is-new"'}><span class="log__when">${i ? "" : `<span class="log__new">${tx("pj.new")}</span>`}<time>${L.ago(when)}</time></span><div><b>${what}</b><p>${more}</p>${this.updateFig(w, i, what)}</div></li>`).join("")}</ol></section>
          </div>
          <aside class="pj__side">
            ${links.length ? `<section class="box" aria-labelledby="ln-h"><h3 id="ln-h">${tx("pj.links")}</h3><ul class="lk">${links.map(([name, url]) => `<li><a href="${url}" target="_blank" rel="noopener"><span class="ci">${svg("link")}</span><span><b>${name}</b><i>${url.replace(/^https?:\/\//, "")}</i></span></a></li>`).join("")}</ul></section>` : ""}
            <section class="box"><h3>${tx("pj.team")}</h3><ul class="team">${team.map(([n, r]) => `<li><span class="av" style="--h:${hue(n)}" aria-hidden="true">${n[0]}</span><span><a class="team__n" href="profile.html#${n.toLowerCase()}"><b>${n}</b></a><i>${r}</i></span></li>`).join("")}</ul></section>
            <section class="box contact" aria-labelledby="ct-h"><h3 id="ct-h">${tx("pj.contact")}</h3><p class="contact__who">${tx("pj.reach", { name: w.maker })}</p>
              <ul>${d.contact().map(([k, label, value, href]) => `<li><span class="ci">${svg(k)}</span><span class="cv2"><i>${tx("ct." + k)}</i>${href ? `<a href="${href}">${value.replace("@", "@<wbr>")}</a>` : `<b>${value}</b>`}</span><button type="button" class="cp" data-v="${value}" aria-label="${tx("pj.copy", { label: tx("ct." + k) })}">${svg("copy")}</button></li>`).join("")}</ul>
              <p class="contact__note" role="status" aria-live="polite"></p></section>

            <section class="box"><h3>${tx("pj.awards")}</h3><ul class="aw">${d.awards().map(([a, s, rank]) => `<li><span class="medal${rank ? " medal--rank" : ""}" aria-hidden="true">${rank ? "◆" : "★"}</span><span><b>${a}</b><i>${s}</i></span></li>`).join("")}</ul></section>
          </aside>
        </div>
        ${this.more(w)}`;
      this.favButton(w);
      this.gallery(w);
      this.scroller($(".log__list", this.root));
      this.fillMore(w);
      this.root.querySelectorAll(".cp").forEach((b) => b.addEventListener("click", () => this.copy(b)));
      if (animate && !calm) this.enter();
    }
    // heart: saves the work to your favourites (the same list the profile page reads)
    favButton(w) {
      const b = $(".fav", this.root), key = "nest-favs";
      const read = () => { try { return JSON.parse(localStorage.getItem(key)) || null; } catch (e) { return null; } };
      const seedList = () => [["wheelsense", "2026-11-23"], ["nestboard", "2026-11-23"], ["moonwheel", "2026-11-20"], ["rain-jar", "2026-11-20"], ["sunflower-bank", "2026-11-16"], ["book-loop", "2026-11-16"], ["lantern-run", "2026-11-10"]].map(([id, saved]) => ({ id, saved }));
      const paint = (on) => { b.setAttribute("aria-pressed", on); b.setAttribute("aria-label", tx(on ? "pj.unsave" : "pj.save", { name: w.name })); b.title = tx(on ? "pj.inFavs" : "pj.toFavs"); };
      paint((read() || seedList()).some((f) => f.id === w.id));
      b.addEventListener("click", () => {
        const l = read() || seedList(), on = !l.some((f) => f.id === w.id);
        try { localStorage.setItem(key, JSON.stringify(on ? [{ id: w.id, saved: new Date().toISOString().slice(0, 10) }, ...l] : l.filter((f) => f.id !== w.id))); } catch (e) {}
        paint(on); if (!calm) b.animate([{ transform: "scale(1)" }, { transform: "scale(1.25)" }, { transform: "scale(1)" }], { duration: 320, easing: "cubic-bezier(.34,1.5,.64,1)" });
      });
    }
    // the clip first, then pictures (frames of the work's art stand in for screenshots)
    slides(w) { return [{ clip: true, label: tx("pj.clip"), frame: 1 }, ...[2, 3, 4, 5].map((f, i) => ({ clip: false, label: tx("pj.pic", { n: i + 1 }), frame: f }))]; }
    gallery(w) {
      const root = $(".gal", this.root), track = $(".gal__track", root), slides = [...track.children], thumbs = [...this.root.querySelectorAll(".thumb")];
      const list = this.slides(w), bare = { ...w, scribble: "" };
      slides.forEach((s, i) => Art.fill($(".cv", s), bare, list[i].frame));
      thumbs.forEach((t, i) => Art.fill($(".cv", t), bare, list[i].frame));
      // the clip
      const clip = slides[0], play = $(".play", clip);
      this.preview = window.Previews.for(clip, bare); clip.insertBefore(clip.lastElementChild, play);
      const setPlay = (on) => { play.setAttribute("aria-pressed", on); play.setAttribute("aria-label", tx(on ? "pj.pause" : "pj.play", { name: w.name })); clip.classList.toggle("is-playing", on); on ? this.preview.start() : this.preview.stop(); };
      play.addEventListener("click", () => setPlay(play.getAttribute("aria-pressed") !== "true"));
      // moving between slides: scroll-snap does the swipe; buttons, thumbnails and arrow keys scroll to a slide
      let at = 0;
      const go = (i) => { i = Math.max(0, Math.min(slides.length - 1, i)); track.scrollTo({ left: slides[i].offsetLeft, behavior: calm ? "auto" : "smooth" }); };
      const mark = () => {
        // the slide whose left edge is nearest (a phone's track is not exactly one slide wide)
        const i = slides.reduce((best, s, k) => (Math.abs(s.offsetLeft - track.scrollLeft) < Math.abs(slides[best].offsetLeft - track.scrollLeft) ? k : best), 0);
        if (i === at && root.dataset.ready) return;
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
      return `<section class="like" aria-labelledby="like-h"><div class="like__h"><h2 id="like-h">${tx("pj.more")}</h2><span>${L.room(w.room).toUpperCase()} · ${L.genre(w.genre).toUpperCase()}</span></div><div class="grid like__g"></div></section>`;
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
      navigator.clipboard.writeText(btn.dataset.v).then(() => done(tx("pj.copied", { v: btn.dataset.v })), () => done(tx("pj.select", { v: btn.dataset.v })));
    }
    enter() {
      const E = "cubic-bezier(.2,.8,.2,1)";
      const seq = [".back", ".tags", ".title", ".blurb", ".gal", ".thumbs", ".fav", ".pj__side .box:nth-child(1)", ".pj__side .box:nth-child(2)", ".pj__side .box:nth-child(3)", ".pj__side .box:nth-child(4)", ".about", ".log"];
      seq.forEach((s, i) => { const el = $(s, this.root); el && el.animate([{ opacity: 0, transform: "translateY(14px)", filter: "blur(4px)" }, { opacity: 1, transform: "none", filter: "blur(0)" }], { duration: 520, delay: i * 55, easing: E, fill: "backwards" }); });
    }
    stop() { if (this.preview) this.preview.stop(); }
  }

  const page = new ProjectPage($("#main"));
  const show = () => {
    const [id, part] = decodeURIComponent(location.hash.slice(1)).split("&"), w = works.find((x) => x.id === id) || works[0];
    page.stop(); page.render(w);
    const log = part === "updates" && $(".log", page.root);
    scrollTo({ top: log ? log.getBoundingClientRect().top + scrollY - $(".gbar").offsetHeight - 16 : 0, behavior: calm || log ? "auto" : "smooth" });
  };
  addEventListener("hashchange", show); show();
  // a language switch redraws the page where it is: same work, same scroll position
  L.addEventListener("change", () => { const y = scrollY; page.stop(); page.render(page.w, false); scrollTo({ top: y, behavior: "auto" }); });

  // the bar turns white once you scroll past the water
  const bar = $(".gbar"), onScroll = () => bar.classList.toggle("gbar--framed", scrollY > 260);
  addEventListener("scroll", onScroll, { passive: true }); onScroll();
})();
