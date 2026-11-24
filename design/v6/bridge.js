// Bridge between the hero and Browse on hero/index.html: the header turns solid once you scroll,
// and "Scroll down" / "Explore projects" / Browse glide to the Browse section.
(function () {
  "use strict";
  const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const header = document.querySelector(".site-header"), hero = document.getElementById("hero"), browse = document.getElementById("browse-page");
  if (!header || !hero || !browse) return;
  // clear over the hero at rest; solid as soon as the page moves, so the hero's text never runs under clear menu type
  const frame = () => header.classList.toggle("is-solid", scrollY > 24);
  addEventListener("scroll", frame, { passive: true }); frame();
  // every link to #browse-page glides to Browse, with its heading just under the header
  document.querySelectorAll('a[href="#browse-page"]').forEach((a) => a.addEventListener("click", (e) => {
    e.preventDefault();
    scrollTo({ top: browse.getBoundingClientRect().top + scrollY - header.offsetHeight, behavior: calm ? "auto" : "smooth" });
    history.replaceState(null, "", "#browse-page");
  }));
})();
