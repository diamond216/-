// Placeholder project covers drawn as pixel SVGs, so drafts need no image files.
// Usage: <div class="cv" data-cover="bk"></div>
(function () {
  const P = {
    bk: [["dddddddddddddddd","dddd.....ddddddd","ddd..hhh..dd..dd","ddd.hhhhh.....dd","ddd.hwhwh.ddd.dd","dd..hhhhh.ddd.sd","dd..hh.hh.ddd.dd","dddd.....dddd.dd","dddddd.......ddd","dddddddddddddddd"], { d: "#5A3518", ".": "#E9B44C", h: "#FBE8BF", w: "#12241C", s: "#FF5A3C" }],
    bk0: [["dddddddddddddddd","dddddddddddddddd","dddd.....ddddddd","ddd.hhhhh.dddddd","ddd.hwhwh.dddddd","ddd.hhhhh.dddddd","dddd.....ddddddd","dddddddddddddddd","dddddddddddddddd","dddddddddddddddd"], { d: "#3B3B44", ".": "#77777F", h: "#9A9AA2", w: "#2A2A30" }],
    sd: [["oooooooooooooooo","ooooooooooyyyooo","oooooooooyyyyyoo","oooooooooyyyyyoo","oooooooooyyyyyoo","ooooooooooyyyooo","oo.o..o...o..o.o","gggggggggggggggg","gggggggggggggggg","bbbbbbbbbbbbbbbb"], { o: "#FF8A3D", y: "#FFE066", ".": "#3B2A1A", g: "#3E8E4B", b: "#2C6B38" }],
    mw: [["nnnnnnnnnnnnnnnn","nnnnnmmmmnnnnsnn","nnnnmmmmmmnnnnnn","nsnmmmmmmmmnnnnn","nnnmmmmmmmmnnnnn","nnnmmmmmmmmnnsnn","nnnnmmmmmmnnnnnn","nnnnnmmmmnnnnnnn","nnsnnnnnnnnnnnnn","nnnnnnnnnnnnnnnn"], { n: "#1B2452", m: "#E8E6D8", s: "#FFE066" }],
    tt: [["ssssssssssssssss","ssss....ssssssss","sss..ss..sss..ss","ss..ssss..s..sss","ss.sssssss..ssss","ss.ssss..sssssss","sss....ssss..sss","ssssssssss..ssss","sssssssss..sssss","ssssssssssssssss"], { s: "#2E4D6B", ".": "#F2D27A" }],
    cp: [["pppppppppppppppp","ppppppcccccppppp","pppppcccccccpppp","ppppcckcckccpppp","ppppcccccccccppp","pppcccrrrrcccppp","pppcccrrrrcccppp","ppppcccccccppppp","pppppppppppppppp","pppppppppppppppp"], { p: "#8C4A6E", c: "#F2B38A", k: "#2A1A12", r: "#E8665A" }],
  };
  function pixel(k) {
    const [rows, pal] = P[k];
    let s = `<svg viewBox="0 0 16 10" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges"><rect width="16" height="10" fill="${pal[rows[0][0]]}"/>`;
    rows.forEach((r, y) => [...r].forEach((c, x) => { if (c !== rows[0][0]) s += `<rect x="${x}" y="${y}" width="1.02" height="1.02" fill="${pal[c]}"/>`; }));
    return s + "</svg>";
  }
  function iot(bg, label) {
    let g = "";
    for (let i = 1; i < 8; i++) g += `<rect x="${i * 49}" width="1" height="220" fill="#fff" opacity=".12"/>`;
    for (let j = 1; j < 5; j++) g += `<rect y="${j * 44}" width="392" height="1" fill="#fff" opacity=".12"/>`;
    return `<svg viewBox="0 0 392 220" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg"><rect width="392" height="220" fill="${bg}"/>${g}<g fill="none" stroke="#fff" stroke-width="2"><circle cx="196" cy="110" r="70"/><circle cx="196" cy="110" r="40"/><path d="M266 110h70M40 110h86"/><rect x="336" y="84" width="60" height="52" rx="4"/></g><circle cx="196" cy="110" r="8" fill="#FFD24A"/><text x="196" y="204" text-anchor="middle" fill="#fff" font-family="Mali" font-size="14">${label}</text></svg>`;
  }
  function web(bg, acc) {
    const bars = [60, 96, 74, 120, 88, 134].map((v, i) => `<rect x="${140 + i * 34}" y="${198 - v}" width="22" height="${v}" rx="3" fill="${i === 5 ? acc : "#7C8AA0"}"/>`).join("");
    return `<svg viewBox="0 0 392 220" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg"><rect width="392" height="220" fill="${bg}"/><rect x="28" y="26" width="336" height="220" rx="10" fill="#fff"/><rect x="28" y="26" width="336" height="26" rx="10" fill="#EEF1F6"/><circle cx="43" cy="39" r="5" fill="#C3CAD6"/><circle cx="59" cy="39" r="5" fill="#C3CAD6"/><rect x="44" y="70" width="70" height="8" rx="4" fill="#16161C"/><rect x="44" y="90" width="70" height="6" rx="3" fill="#C3CAD6"/><rect x="44" y="104" width="54" height="6" rx="3" fill="#C3CAD6"/><rect x="140" y="70" width="120" height="10" rx="5" fill="#16161C"/>${bars}</svg>`;
  }
  function idea() {
    let l = "";
    for (let j = 1; j < 9; j++) l += `<rect y="${j * 24}" width="392" height="1" fill="#C9D8F2"/>`;
    return `<svg viewBox="0 0 392 220" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg"><rect width="392" height="220" fill="#F7F4EC"/>${l}<rect x="44" width="1.5" height="220" fill="#F29A9A"/><g fill="none" stroke="#3A3F4A" stroke-width="2"><circle cx="112" cy="92" r="42"/><circle cx="284" cy="92" r="42"/><circle cx="196" cy="152" r="42"/><path d="M160 91h72"/></g><g font-family="Mali" font-size="13" fill="#3A3F4A" text-anchor="middle"><text x="112" y="96">12 people</text><text x="284" y="96">one pot</text><text x="196" y="156">pays out</text></g></svg>`;
  }
  const M = {
    ws: () => iot("#0E5450", "soil probe, 2 x AA"), aq: () => iot("#1F4E79", "pond sensor"), cw: () => iot("#7A3B2E", "coop gate counter"),
    nb: () => web("#DCE3EE", "#FF6816"), kd: () => web("#DDEBE4", "#1FB5A0"), sb: idea,
  };
  document.querySelectorAll("[data-cover]").forEach((el) => {
    const k = el.dataset.cover;
    el.innerHTML = P[k] ? pixel(k) : M[k]();
  });
})();
