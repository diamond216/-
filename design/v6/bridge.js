// Bridge between the hero and Browse on hero/index.html: the header turns solid once you scroll,
// in-page links glide (Scroll down, Explore projects, Browse, a room from the footer, About and Contact),
// and the hero's Sign in / profile button use the shared account menu (session.js).
(function () {
  "use strict";
  const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const header = document.querySelector(".site-header"), hero = document.getElementById("hero"), browse = document.getElementById("browse-page");
  if (!header || !hero || !browse) return;
  // clear over the hero at rest; solid as soon as the page moves, so the hero's text never runs under clear menu type
  const frame = () => header.classList.toggle("is-solid", scrollY > 24);
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

  // Sign in signs you in as Pim (prototype); the round profile button opens the account menu
  if (window.NestSession) new NestSession.AccountMenu(null, { hero: { button: header.querySelector(".profile-btn"), signIn: header.querySelector('a[data-auth="out"]') } });
})();
