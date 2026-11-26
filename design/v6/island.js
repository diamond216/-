// Top bar for the home page: logo, a black "dynamic island" with the main links, language and sign in.
// - At the top of the page the bar is clear over the hero; once you scroll it gets a white frame.
// - The island stretches open on hover and a light pill slides to the link under the pointer.
// - EN / ไทย (lang.js) swaps every [data-i18n] text and remembers the choice.
(function () {
  "use strict";
  const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const bar = document.querySelector(".isl-bar"), island = document.querySelector(".island");
  if (!bar) return;

  // white frame once the page has moved
  const onScroll = () => bar.classList.toggle("isl-bar--framed", scrollY > 8);
  addEventListener("scroll", onScroll, { passive: true }); onScroll();

  // the pill follows the pointer, and rests on the current page's link
  const pill = island.querySelector(".island__pill"), links = [...island.querySelectorAll("a")];
  const home = island.querySelector("a[aria-current]") || null;
  const moveTo = (a) => {
    if (!a) { pill.style.opacity = "0"; return; }
    pill.style.opacity = "1"; pill.style.width = a.offsetWidth + "px"; pill.style.transform = `translateX(${a.offsetLeft}px)`;
  };
  links.forEach((a) => { a.addEventListener("pointerenter", () => moveTo(a)); a.addEventListener("focus", () => moveTo(a)); });
  island.addEventListener("pointerleave", () => moveTo(home));
  addEventListener("load", () => moveTo(home)); moveTo(home);
  if (calm) island.classList.add("island--calm");

  // ---------- language ----------
  // lang.js does the switching; the island's links change width with the words, so the pill moves again
  NestLang.addEventListener("change", () => moveTo(home));
})();
