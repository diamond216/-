// Placeholder artwork drawn as SVG, so the draft needs no image files.
// One painter per room (strategy). Each work gets a cover plus extra "frames"
// that stand in for screenshots or clip stills. Add a room: add a painter and register it.
(function () {
  "use strict";

  // Seeded random, so the same work always gets the same pictures.
  class Rng {
    constructor(seed) { this.s = [...String(seed)].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7) || 1; }
    next() { this.s = (this.s * 1664525 + 1013904223) >>> 0; return this.s / 4294967296; }
    int(n) { return Math.floor(this.next() * n); }
    pick(a) { return a[this.int(a.length)]; }
  }

  const svg = (vb, body) => `<svg viewBox="${vb}" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">${body}</svg>`;

  class GamePainter {
    static PALETTES = [
      ["#5A3518", "#E9B44C", "#FBE8BF", "#12241C", "#FF5A3C"],
      ["#1B2452", "#E8E6D8", "#FFE066", "#3A4A8C", "#FF8A3D"],
      ["#2E4D6B", "#F2D27A", "#9CC5E8", "#14263A", "#E8665A"],
      ["#8C4A6E", "#F2B38A", "#2A1A12", "#E8665A", "#FFE0C2"],
      ["#173B2C", "#8FE0C0", "#F2C14E", "#0A1F17", "#E8665A"],
      ["#3B2A55", "#C59AF2", "#FFE066", "#1A1030", "#5EF2D0"],
      ["#FF8A3D", "#FFE066", "#3B2A1A", "#3E8E4B", "#2C6B38"],
    ];
    static KEEP = { "burrow-knights": 0, "moonwheel": 1, "tunnel-tales": 2, "cheek-pouch": 3, "seed-dash": 6 };
    paint(seed, frame) {
      const r = new Rng(seed + "#" + frame), kind = r.int(3);
      // every picture of one game shares its colours, so they read as the same game
      const p = GamePainter.PALETTES[GamePainter.KEEP[seed] ?? new Rng(seed).int(GamePainter.PALETTES.length)];
      let s = `<rect width="16" height="10" fill="${p[0]}"/>`;
      const px = (x, y, c) => (s += `<rect x="${x}" y="${y}" width="1.02" height="1.02" fill="${c}"/>`);
      if (kind === 0) { // a hero sprite
        const ox = 3 + r.int(7), oy = 1 + r.int(2);
        for (let y = 0; y < 6; y++) for (let x = 0; x < 6; x++) {
          const edge = x === 0 || x === 5 || y === 0 || y === 5;
          if (edge && (x + y) % 5 === 0) continue;
          px(ox + x, oy + y, edge ? p[1] : p[2]);
        }
        px(ox + 1, oy + 2, p[3]); px(ox + 4, oy + 2, p[3]); px(ox + 2, oy + 4, p[4]); px(ox + 3, oy + 4, p[4]);
        for (let i = 0; i < 5; i++) px(r.int(16), r.int(10), p[4]);
      } else if (kind === 1) { // a landscape with a sun
        const sx = 2 + r.int(12), sy = 1 + r.int(3);
        for (let y = -2; y <= 2; y++) for (let x = -2; x <= 2; x++) if (x * x + y * y <= 5) px(sx + x, sy + y, p[2]);
        let h = 6 + r.int(2);
        for (let x = 0; x < 16; x++) { h = Math.max(5, Math.min(8, h + r.int(3) - 1)); for (let y = h; y < 10; y++) px(x, y, y === h ? p[1] : p[3]); }
        px(r.int(16), h - 1, p[4]);
      } else { // a maze
        for (let y = 1; y < 9; y++) for (let x = 1; x < 15; x++) if (r.next() < 0.42) px(x, y, p[1]);
        px(1 + r.int(14), 1 + r.int(8), p[4]); px(1 + r.int(14), 1 + r.int(8), p[2]);
      }
      return svg("0 0 16 10", `<g shape-rendering="crispEdges">${s}</g>`);
    }
  }

  class IotPainter {
    static BG = ["#0E5450", "#1F4E79", "#7A3B2E", "#33402A", "#4A2F5C", "#0F6B4A"];
    paint(seed, frame, label) {
      const r = new Rng(seed + "#" + frame), bg = IotPainter.BG[new Rng(seed).int(6)];
      let g = "";
      for (let i = 1; i < 8; i++) g += `<rect x="${i * 49}" width="1" height="220" fill="#fff" opacity=".12"/>`;
      for (let j = 1; j < 5; j++) g += `<rect y="${j * 44}" width="392" height="1" fill="#fff" opacity=".12"/>`;
      const cx = 120 + r.int(160), cy = 80 + r.int(50), rad = 34 + r.int(26);
      return svg("0 0 392 220", `<rect width="392" height="220" fill="${bg}"/>${g}<g fill="none" stroke="#fff" stroke-width="2"><circle cx="${cx}" cy="${cy}" r="${rad}"/><circle cx="${cx}" cy="${cy}" r="${rad * 0.55}"/><path d="M0 ${cy}h${cx - rad}M${cx + rad} ${cy}h${392 - cx - rad}"/></g><circle cx="${cx}" cy="${cy}" r="7" fill="#FFD24A"/><text x="196" y="200" text-anchor="middle" font-family="Mali,cursive" font-size="15" fill="#fff">${label || ""}</text>`);
    }
  }

  class WebPainter {
    static TINT = [["#DCE3EE", "#FF6816"], ["#DDEBE4", "#1FB5A0"], ["#EEE6DA", "#E8665A"], ["#E4E0F0", "#7A5AF0"], ["#E7EDD8", "#3E8E4B"]];
    paint(seed, frame) {
      const r = new Rng(seed + "#" + frame), [bg, acc] = WebPainter.TINT[new Rng(seed).int(5)];
      const bars = [0, 1, 2, 3, 4, 5].map((i) => { const v = 40 + r.int(100); return `<rect x="${140 + i * 34}" y="${198 - v}" width="22" height="${v}" rx="3" fill="${i === 5 ? acc : "#7C8AA0"}"/>`; }).join("");
      return svg("0 0 392 220", `<rect width="392" height="220" fill="${bg}"/><rect x="28" y="26" width="336" height="220" rx="10" fill="#fff"/><rect x="28" y="26" width="336" height="22" rx="10" fill="#E9EDF3"/><circle cx="44" cy="37" r="4" fill="#C9D0DA"/><circle cx="58" cy="37" r="4" fill="#C9D0DA"/><rect x="48" y="66" width="${40 + r.int(60)}" height="8" rx="4" fill="#1A1A20"/><rect x="48" y="84" width="60" height="5" rx="2.5" fill="#C9D0DA"/><rect x="48" y="96" width="44" height="5" rx="2.5" fill="#C9D0DA"/>${bars}`);
    }
  }

  class IdeaPainter {
    paint(seed, frame, label) {
      const r = new Rng(seed + "#" + frame);
      let l = "";
      for (let j = 1; j < 9; j++) l += `<rect y="${j * 24}" width="392" height="1" fill="#C9D8F2"/>`;
      const a = [90 + r.int(40), 70 + r.int(30)], b = [280 + r.int(40), 60 + r.int(40)], c = [200, 140 + r.int(20)];
      const node = ([x, y], t) => `<circle cx="${x}" cy="${y}" r="30" fill="none" stroke="#2A3550" stroke-width="2"/><text x="${x}" y="${y + 5}" text-anchor="middle" font-family="Mali,cursive" font-size="13" fill="#2A3550">${t}</text>`;
      const words = ["you", "friends", "the pot", "a shop", "a plan", "the class", "a fund", "one month"];
      return svg("0 0 392 220", `<rect width="392" height="220" fill="#F7F4EC"/>${l}<rect x="44" width="1.5" height="220" fill="#F29A9A"/><g stroke="#2A3550" stroke-width="2" fill="none"><path d="M${a[0] + 30} ${a[1]}L${b[0] - 30} ${b[1]}M${a[0] + 18} ${a[1] + 24}L${c[0] - 22} ${c[1] - 20}"/></g>${node(a, r.pick(words))}${node(b, r.pick(words))}${node(c, r.pick(words))}<text x="196" y="206" text-anchor="middle" font-family="Mali,cursive" font-size="17" fill="#159C6B">${label || ""}</text>`);
    }
  }

  // Hand-drawn covers from the earlier drafts, kept for the works that already had one.
  const HAND = {
    bk: [["dddddddddddddddd","dddd.....ddddddd","ddd..hhh..dd..dd","ddd.hhhhh.....dd","ddd.hwhwh.ddd.dd","dd..hhhhh.ddd.sd","dd..hh.hh.ddd.dd","dddd.....dddd.dd","dddddd.......ddd","dddddddddddddddd"], { d: "#5A3518", ".": "#E9B44C", h: "#FBE8BF", w: "#12241C", s: "#FF5A3C" }],
    bk0: [["dddddddddddddddd","dddddddddddddddd","dddd.....ddddddd","ddd.hhhhh.dddddd","ddd.hwhwh.dddddd","ddd.hhhhh.dddddd","dddd.....ddddddd","dddddddddddddddd","dddddddddddddddd","dddddddddddddddd"], { d: "#3B3B44", ".": "#77777F", h: "#9A9AA2", w: "#2A2A30" }],
    sd: [["oooooooooooooooo","ooooooooooyyyooo","oooooooooyyyyyoo","oooooooooyyyyyoo","oooooooooyyyyyoo","ooooooooooyyyooo","oo.o..o...o..o.o","gggggggggggggggg","gggggggggggggggg","bbbbbbbbbbbbbbbb"], { o: "#FF8A3D", y: "#FFE066", ".": "#3B2A1A", g: "#3E8E4B", b: "#2C6B38" }],
    mw: [["nnnnnnnnnnnnnnnn","nnnnnmmmmnnnnsnn","nnnnmmmmmmnnnnnn","nsnmmmmmmmmnnnnn","nnnmmmmmmmmnnnnn","nnnmmmmmmmmnnsnn","nnnnmmmmmmnnnnnn","nnnnnmmmmnnnnnnn","nnsnnnnnnnnnnnnn","nnnnnnnnnnnnnnnn"], { n: "#1B2452", m: "#E8E6D8", s: "#FFE066" }],
    tt: [["ssssssssssssssss","ssss....ssssssss","sss..ss..sss..ss","ss..ssss..s..sss","ss.sssssss..ssss","ss.ssss..sssssss","sss....ssss..sss","ssssssssss..ssss","sssssssss..sssss","ssssssssssssssss"], { s: "#2E4D6B", ".": "#F2D27A" }],
    cp: [["pppppppppppppppp","ppppppcccccppppp","pppppcccccccpppp","ppppcckcckccpppp","ppppcccccccccppp","pppcccrrrrcccppp","pppcccrrrrcccppp","ppppcccccccppppp","pppppppppppppppp","pppppppppppppppp"], { p: "#8C4A6E", c: "#F2B38A", k: "#2A1A12", r: "#E8665A" }],
  };
  const HAND_FOR = { "burrow-knights": "bk", "seed-dash": "sd", "moonwheel": "mw", "tunnel-tales": "tt", "cheek-pouch": "cp" };
  function hand(k) {
    const [rows, pal] = HAND[k];
    let s = `<rect width="16" height="10" fill="${pal[rows[0][0]]}"/>`;
    rows.forEach((r, y) => [...r].forEach((c, x) => { if (c !== rows[0][0]) s += `<rect x="${x}" y="${y}" width="1.02" height="1.02" fill="${pal[c]}"/>`; }));
    return svg("0 0 16 10", `<g shape-rendering="crispEdges">${s}</g>`);
  }

  const painters = { Game: new GamePainter(), IoT: new IotPainter(), Web: new WebPainter(), Idea: new IdeaPainter() };

  // One colour per work, taken from its own pictures. The page takes its theme from it.
  const TONE = { Idea: ["#E8665A", "#159C6B", "#3A6FD8", "#E0A030"] };
  // returns { bg, acc }: bg tints the page, acc colours buttons and labels
  function tone(work) {
    if (work.room === "Game") {
      const p = GamePainter.PALETTES[GamePainter.KEEP[work.id] ?? new Rng(work.id).int(GamePainter.PALETTES.length)];
      return { bg: p[0], acc: p[1] === "#E8E6D8" ? p[2] : p[1] };
    }
    if (work.room === "IoT") return { bg: IotPainter.BG[new Rng(work.id).int(6)], acc: "#FFD24A" };
    if (work.room === "Web") { const c = WebPainter.TINT[new Rng(work.id).int(5)][1]; return { bg: c, acc: c }; }
    const c = TONE.Idea[new Rng(work.id).int(4)];
    return { bg: c, acc: c };
  }

  window.Art = {
    tone,
    // frame 0 is the cover; frames 1..n are the extra pictures of the same work
    draw(work, frame = 0) {
      if (frame === 0 && HAND_FOR[work.id]) return hand(HAND_FOR[work.id]);
      return painters[work.room].paint(work.id, frame, work.scribble); },
    fill(el, work, frame = 0) { el.innerHTML = this.draw(work, frame); },
  };
})();
