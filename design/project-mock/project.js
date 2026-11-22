// Project page mockup. One work, three layouts (body class pa / pb / pc). Sample team, roles and awards.
(function () {
  const { works, tiers } = window.NEST, $ = (s, r = document) => r.querySelector(s);
  const w = works.find((x) => x.id === "burrow-knights"), t = tiers.find((x) => x.id === w.tier);
  const INK = { platinum: "#3550A8", diamond: "#1E93C2", gold: "#C08A12", silver: "#7A8794", bronze: "#B0602F" };
  const team = [[w.maker, "Lead, game design"], ["Bas", "Programming"], ["Kaew", "Pixel art, animation"], ["Ton", "Sound and music"]];
  const awards = [["Platinum", "Hamster Nest rank, Nov 2026"], ["Best co-op game", "School game jam 2026"], ["People's pick", "Open house, Sep 2026"]];
  const updates = [["yesterday", "Added a second level", "The caves under the school now have their own boss. Two players can split up for the first time."],
    ["5 days ago", "Fixed the jump that felt floaty", "Lowered gravity at the top of the jump and added coyote time."],
    ["2 weeks ago", "Posted the two-player demo", "Both players on one keyboard, WASD and arrows."]];
  const hue = (s) => [...s].reduce((n, c) => n + c.charCodeAt(0), 0) % 360;
  const av = (n) => `<span class="av" style="--h:${hue(n)}">${n[0]}</span>`;
  const tags = [w.room, w.genre, ...w.platforms];
  const more = works.filter((x) => x.room === "Game" && x.id !== w.id).slice(0, 9);

  const head = `<a class="back" href="#"><svg viewBox="0 0 16 16"><path d="M10 3L5 8l5 5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>Back to Browse</a>
    <p class="tags">${tags.map((x, i) => `<span class="tag${i < 2 ? " tag--room" : ""}">${x}</span>`).join("")}<span class="rk" style="--ri:${INK[w.tier]}">◆ ${t.name}</span></p>
    <h1 class="title">${w.name}</h1><p class="blurb">${w.blurb}</p>`;
  const media = `<div class="media"><div class="cv"></div><span class="play"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z" fill="currentColor"/></svg></span></div>`;
  const teamH = `<section class="box"><h3>Team</h3><ul class="team">${team.map(([n, r]) => `<li>${av(n)}<span><b>${n}</b><i>${r}</i></span></li>`).join("")}</ul><a class="say">Say hi to the team</a></section>`;
  const updH = `<section class="box"><h3>Latest update</h3><p class="when">${updates[0][0]}</p><p class="what">${updates[0][1]}</p><p class="more-u">${updates[0][2]}</p></section>`;
  const awH = `<section class="box"><h3>Awards</h3><ul class="aw">${awards.map(([a, s], i) => `<li><span class="medal${i ? "" : " medal--rank"}" style="--ri:${INK[w.tier]}">${i ? "★" : "◆"}</span><span><b>${a}</b><i>${s}</i></span></li>`).join("")}</ul></section>`;
  const logH = `<section class="log"><h2>Updates</h2><ol>${updates.map(([d, a, b]) => `<li><time>${d}</time><div><b>${a}</b><p>${b}</p></div></li>`).join("")}</ol></section>`;
  const moreH = `<section class="class"><div class="class__h"><h2>MORE FROM THE CLASS</h2><span>HALL OF FAME · 2026</span></div>
    <div class="class__g">${more.map((x, i) => `<a class="cl"><div class="cl__pic cv" data-id="${x.id}"></div><b>${x.name}</b><span>${String(i + 2).padStart(2, "0")} ↗</span></a>`).join("")}</div></section>`;

  $(".pj").innerHTML = `
    <div class="L L--a"><div class="band2">${head}</div><div class="grid2"><div>${media}${logH}</div><aside>${teamH}${updH}${awH}</aside></div></div>
    <div class="L L--b"><div class="split">${media}<div class="side">${head}${teamH}${updH}${awH}</div></div>${logH}</div>
    <div class="L L--c"><div class="poster">${media}<div class="poster__t">${head}</div></div><div class="cols">${teamH}${updH}${awH}</div>${logH}</div>
    ${moreH}`;
  document.querySelectorAll(".media .cv").forEach((el) => Art.fill(el, w, 1));
  document.querySelectorAll(".cl__pic").forEach((el) => Art.fill(el, works.find((x) => x.id === el.dataset.id)));
})();
