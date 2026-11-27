(function () {
  "use strict";
  const { works } = window.NEST;
  const { ic, esc, Paths, thai } = window.NestShell;
  const $ = (s, r = document) => r.querySelector(s);
  const pick = (id) => works.find((w) => w.id === id);
  const SLIDES = [
    { room: "Game", title: "RE//SLASH", text: "Fast first-person hack-and-slash: parry everything, go Slash Mode with the katana, keep your momentum.", by: "by Phoom.x, PetePeachPeat, Dnsw", href: "https://phoomx.itch.io/reslash", ext: true, img: new URL("../../hero/assets/reslash/reslash-1920.jpg", document.currentScript.src).href, alt: "RE//SLASH: a sword fighter mid-slash in a neon arena" },
    ...["burrow-knights", "wheelsense", "nestboard"].map(pick).filter(Boolean).map((w) => ({ room: w.room, title: w.name, text: w.blurb, by: `by ${w.maker}`, href: Paths.page(`project.html#${w.id}`), art: w })),
  ];
  const hero = $("#hero"); if (!hero) return;
  const video = $("video", hero);
  let cur = 0;
  function paint() {
    const s = SLIDES[cur];
    const img = $(".hero__img", hero);
    img.innerHTML = s.img ? `<img src="${s.img}" alt="${esc(s.alt)}" style="width:100%;height:100%;object-fit:cover;display:block">` : `<span role="img" aria-label="${esc(s.title)}" style="display:block;width:100%;height:100%">${window.Art.draw({ ...s.art, scribble: "" }, 0)}</span>`;
    const svg = $("svg", img); if (svg) { svg.setAttribute("preserveAspectRatio", "xMidYMid slice"); svg.style.cssText = "width:100%;height:100%;display:block"; }
    $(".hero__in", hero).innerHTML = `<span class="tag">${esc(s.room)}</span><h2>${esc(s.title)}</h2><p>${esc(s.text)}</p><span class="hero__by">${esc(s.by)}</span><div class="hero__acts"><a class="btn" style="background:#fff;color:#1F1B16" href="${s.href}"${s.ext ? ' target="_blank" rel="noopener" aria-label="See the project: ' + esc(s.title) + ' (opens in a new tab)"' : ""}>See the project</a><a class="btn" style="background:none;border-color:rgba(255,255,255,.5);color:#fff" href="${Paths.page("browse.html")}">Browse projects</a></div>`;
    hero.querySelectorAll(".hero__dots button").forEach((b, i) => (i === cur ? b.setAttribute("aria-current", "true") : b.removeAttribute("aria-current")));
    thai(hero);
  }
  const motionOn = () => !document.documentElement.classList.contains("calm");
  const rm = matchMedia("(prefers-reduced-motion: reduce)");
  function swap() {
    hero.querySelectorAll(".hero__ghost").forEach((g) => g.remove());
    if (motionOn() && !rm.matches) {
      const g = document.createElement("div");
      g.className = "hero__ghost"; g.setAttribute("aria-hidden", "true"); g.inert = true;
      g.append($(".hero__img", hero).cloneNode(true), $(".hero__in", hero).cloneNode(true));
      $(".hero__in", hero).after(g);
      g.addEventListener("animationend", () => g.remove());
      setTimeout(() => g.remove(), 600);
    }
    paint();
  }
  $(".hero__dots", hero).innerHTML = SLIDES.map((s, i) => `<button type="button" aria-label="Show ${esc(s.title)}"><i></i></button>`).join("");
  $(".hero__dots", hero).addEventListener("click", (e) => { const b = e.target.closest("button"); if (!b) return; cur = [...b.parentElement.children].indexOf(b); swap(); });
  const go = (d) => { cur = (cur + d + SLIDES.length) % SLIDES.length; swap(); };
  hero.querySelectorAll(".hero__side").forEach((b) => { b.innerHTML = ic(+b.dataset.go < 0 ? "back" : "next"); b.addEventListener("click", () => go(+b.dataset.go)); });
  let sx = null, sy = 0;
  hero.addEventListener("touchstart", (e) => { const t = e.touches[0]; sx = t.clientX; sy = t.clientY; }, { passive: true });
  hero.addEventListener("touchend", (e) => {
    if (sx === null) return;
    const t = e.changedTouches[0], dx = t.clientX - sx, dy = t.clientY - sy; sx = null;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) go(dx < 0 ? 1 : -1);
  }, { passive: true });
  const pauseBtn = $(".hero__pause", hero);
  const setPause = () => { const playing = video && !video.paused; pauseBtn.innerHTML = ic(playing ? "pause" : "play"); pauseBtn.setAttribute("aria-label", playing ? "Pause background video" : "Play background video"); };
  pauseBtn.addEventListener("click", () => { if (!video) return; if (video.paused) video.play().catch(() => {}); else video.pause(); setPause(); });
  if (video) {
    video.addEventListener("play", setPause); video.addEventListener("pause", setPause);
    if (motionOn()) video.play().catch(() => {});
    addEventListener("nest:motion", (e) => { if (!e.detail.on) video.pause(); });
  }
  paint(); setPause();
  NestFeed.mount(document.getElementById("feed"), { title: "Projects", h: "h2", from: "Home", per: () => (innerWidth < 900 ? 3 : 12), onSubmit: (q) => { if (q) location.href = Paths.page(`browse.html?q=${encodeURIComponent(q)}`); } });
})();
