// Bridge between the hero and Browse on hero/index.html: the glass top bar turns white once you scroll,
// in-page links glide (Scroll down, Explore projects, Browse, a room from the footer, About and Contact),
// and EN / ไทย switch the hero's language (app.js does the work through the hidden first header).
// The account area in the bar is the shared one (session.js fills .acct).
(function () {
  "use strict";
  const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const header = document.querySelector(".gbar--hero"), hero = document.getElementById("hero"), browse = document.getElementById("browse-page");
  if (!header || !hero || !browse) return;
  // glass over the hero at rest; white as soon as the page moves, so the hero's text never runs under the menu
  const frame = () => header.classList.toggle("gbar--framed", scrollY > 24);
  addEventListener("scroll", frame, { passive: true }); frame();

  // where a hash on this page lands: Browse (#browse-page, #browse-game ...) or the footer (#about-page, #contact-page)
  const target = (hash) => (/^#browse(-\w+)?$/.test(hash) ? browse : /^#(about|contact)-page$/.test(hash) ? document.querySelector(".nest-foot") : null);
  const glide = (hash, smooth = true) => {
    const t = target(hash); if (!t) return;
    const y = t.getBoundingClientRect().top + scrollY - (t === browse ? header.offsetHeight : 0);
    scrollTo({ top: Math.min(y, document.documentElement.scrollHeight - innerHeight), behavior: calm || !smooth ? "auto" : "smooth" });
  };
  document.addEventListener("click", (e) => {
    const a = e.target.closest && e.target.closest("a[href]"); if (!a) return;
    const url = new URL(a.href, location.href);
    const doc = (u) => u.pathname.replace(/index\.html$/, "");   // hero/ and hero/index.html are the same page
    if (doc(url) !== doc(location) || !target(url.hash)) return;
    e.preventDefault();
    if (url.hash !== location.hash) { history.replaceState(null, "", url.hash); dispatchEvent(new HashChangeEvent("hashchange")); }
    glide(url.hash);
  });
  // arriving from another page with a hash (e.g. a room link in the project page's footer)
  addEventListener("load", () => { if (target(location.hash)) glide(location.hash, false); });

  // EN / ไทย: press the matching item of the hero's own language menu, so app.js translates the page
  const langs = [...header.querySelectorAll("[data-set-lang]")];
  const showLang = () => langs.forEach((b) => b.setAttribute("aria-pressed", b.dataset.setLang === (document.documentElement.lang === "th" ? "th" : "en")));
  langs.forEach((b) => b.addEventListener("click", () => { document.querySelector(`#lang-menu [data-lang="${b.dataset.setLang}"]`)?.click(); showLang(); }));
  addEventListener("load", showLang); showLang();
})();
