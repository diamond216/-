// Animations on or off, chosen on the site (owner, 25 Nov 2026): this prototype is a showcase, so motion plays by
// default even when the device asks for reduced motion; the footer's "Animations" switch turns it off.
// Load it first in <head>. It puts class "calm" on <html> when motion is off (the CSS keys its motion rules on
// html.calm / html:not(.calm)) and answers every matchMedia("(prefers-reduced-motion: ...)") in the scripts the same way.
window.NestMotion = (function () {
  "use strict";
  const KEY = "nest-motion";
  // same storage as session.js: localStorage, or window.name where a sandboxed frame blocks it
  const get = () => {
    try { const v = localStorage.getItem(KEY); if (v !== null) return v; } catch (e) {}
    try { return JSON.parse(window.name || "{}")[KEY] ?? null; } catch (e) { return null; }
  };
  const put = (v) => {
    try { localStorage.setItem(KEY, v); } catch (e) {}
    try { const o = JSON.parse(window.name || "{}"); o[KEY] = v; window.name = JSON.stringify(o); } catch (e) { window.name = JSON.stringify({ [KEY]: v }); }
  };
  const on = get() !== "off";
  document.documentElement.classList.toggle("calm", !on);

  const real = window.matchMedia.bind(window);
  window.matchMedia = (q) => {
    if (!/prefers-reduced-motion/.test(q)) return real(q);
    // look at the value after the colon: the feature name itself contains "reduce"
    const matches = /:\s*reduce\b/.test(q) ? !on : /:\s*no-preference/.test(q) ? on : true;
    return { matches, media: q, onchange: null, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {}, dispatchEvent() { return false; } };
  };

  // switching reloads the page, so every part starts again with the new choice
  return { get on() { return on; }, set(next) { put(next ? "on" : "off"); location.reload(); } };
})();
