// Top bar for the home page: logo, a black "dynamic island" with the main links, language and sign in.
// - At the top of the page the bar is clear over the hero; once you scroll it gets a white frame.
// - The island stretches open on hover and a light pill slides to the link under the pointer.
// - EN / ไทย swaps every [data-i18n] text and remembers the choice.
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
  const TEXT = {
    en: {
      "nav.browse": "Browse", "nav.about": "About", "signin": "Sign in",
      "hero.see": "See the project", "say": "“High schoolers can do all this!?”",
      "tier.all": "See all {n}", "tier.how": "How ranking works", "filters": "Filters",
    },
    th: {
      "nav.browse": "สำรวจผลงาน", "nav.about": "เกี่ยวกับเรา", "signin": "เข้าสู่ระบบ",
      "hero.see": "ดูผลงาน", "say": "“เด็ก ม.ปลาย ทำได้ขนาดนี้เลยเหรอ!?”",
      "tier.all": "ดูทั้งหมด {n} ชิ้น", "tier.how": "จัดอันดับยังไง", "filters": "ตัวกรอง",
    },
  };
  const btns = [...document.querySelectorAll(".lang-sw button")];
  function apply(lang) {
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const t = TEXT[lang][el.dataset.i18n]; if (t) el.textContent = t.replace("{n}", el.dataset.n || "");
    });
    btns.forEach((b) => b.setAttribute("aria-pressed", b.dataset.lang === lang));
    try { localStorage.setItem("nest-lang", lang); } catch (e) {}
    moveTo(home);
  }
  btns.forEach((b) => b.addEventListener("click", () => apply(b.dataset.lang)));
  let saved = "en"; try { saved = localStorage.getItem("nest-lang") || "en"; } catch (e) {}
  window.NestLang = { apply, get: () => document.documentElement.lang || "en" };
  // other scripts may add [data-i18n] after this runs; apply again once everything is in
  addEventListener("load", () => apply(saved)); apply(saved);
})();
