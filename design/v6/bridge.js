// Bridge between the hero and Browse on hero/index.html: the header turns solid after the hero,
// and "Scroll down" / "Explore projects" / Browse glide to the Browse section.
(function () {
  "use strict";
  const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const header = document.querySelector(".site-header"), hero = document.getElementById("hero"), browse = document.getElementById("browse-page");
  if (!header || !hero || !browse) return;
  // solid header as soon as the hero panel's bottom passes under it
  new IntersectionObserver(([e]) => header.classList.toggle("is-solid", !e.isIntersecting), { rootMargin: `-${header.offsetHeight}px 0px 0px 0px`, threshold: 0 }).observe(hero.querySelector(".hero-panel") || hero);
  // every link to #browse-page glides to Browse, with its heading just under the header
  document.querySelectorAll('a[href="#browse-page"]').forEach((a) => a.addEventListener("click", (e) => {
    e.preventDefault();
    scrollTo({ top: browse.getBoundingClientRect().top + scrollY - header.offsetHeight, behavior: calm ? "auto" : "smooth" });
    history.replaceState(null, "", "#browse-page");
  }));
})();
