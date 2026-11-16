// Screenshot tool used for every visual check in this project.
//
//   node tools/shots.cjs <url-or-file> <out-dir> [--name=home] [--widths=1440,390] [--variants=day-en,night-en,day-th]
//                        [--scale=1] [--motion] [--clip=x,y,w,h]
//
// <url-or-file>: http://localhost:3000/projects/burrow-knights/  or  design/project/index.html
// Variants map to the query strings the drafts and the app both understand: ?theme=night, ?lang=th.
// Reduced motion is on by default so shots are stable; pass --motion to see the end state of animations.
// Uses the pre-installed Playwright: never run `playwright install`.
const { chromium } = require("playwright");
const { mkdirSync } = require("node:fs");
const { resolve } = require("node:path");

(async () => {

const [, , target, outDir = "shots", ...rest] = process.argv;
if (!target) {
  console.error("usage: node tools/shots.cjs <url-or-file> <out-dir> [--name=] [--widths=] [--variants=] [--scale=] [--motion] [--clip=]");
  process.exit(1);
}
const flag = (key, fallback) => rest.find((a) => a.startsWith(`--${key}=`))?.split("=")[1] ?? fallback;
const name = flag("name", "page");
const widths = flag("widths", "1440").split(",").map(Number);
const variants = flag("variants", "day-en").split(",");
const scale = Number(flag("scale", "1"));
const motion = rest.includes("--motion");
const clip = flag("clip", null)?.split(",").map(Number);
const QUERY = { "day-en": "", "night-en": "?theme=night", "day-th": "?lang=th", "night-th": "?theme=night&lang=th" };

const base = /^https?:/.test(target) ? target : "file://" + resolve(target);
mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch();
for (const width of widths) {
  for (const variant of variants) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, deviceScaleFactor: scale, reducedMotion: motion ? "no-preference" : "reduce" });
    page.on("pageerror", (e) => console.log(`[${variant}@${width}] page error: ${e.message}`));
    await page.goto(base + (QUERY[variant] ?? ""), { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    if (motion) {
      // Scroll through once so scroll-triggered reveals run, then come back up.
      await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)); } scrollTo(0, 0); });
      await page.waitForTimeout(2500);
    } else await page.waitForTimeout(400);
    const file = `${outDir}/${name}-${variant}-${width}${scale > 1 ? "@2x" : ""}.png`;
    await page.screenshot({ path: file, fullPage: true, ...(clip ? { clip: { x: clip[0], y: clip[1], width: clip[2], height: clip[3] } } : {}) });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
    console.log(`${file}  height=${await page.evaluate(() => document.documentElement.scrollHeight)}${overflow ? "  HORIZONTAL OVERFLOW" : ""}`);
    await page.close();
  }
}
await browser.close();
})();
