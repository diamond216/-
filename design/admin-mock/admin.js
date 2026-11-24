// Admin review mockups: A inbox + detail, B board, C table. Static sample queue.
(function () {
  const $ = (s, r = document) => r.querySelector(s), { works, tiers } = window.NEST, INK = window.Tiles.RANK_INK;
  const me = $(".me__av"); if (me) { me.textContent = "A"; me.style.setProperty("--h", 200); }
  const Q = [["Lantern Run 2", "lantern-run", "Pond", "Game · Roguelike", "2 h ago", "new", 5], ["Bus Ping Mini", "bus-ping", "Ice", "IoT · Wearable", "5 h ago", "new", 4], ["Homework Radar for Teachers", "homework-radar", "Nine", "Web · School", "yesterday", "new", 5],
    ["Snack Fund Plus", "snack-fund", "Gift", "Idea · Fintech", "yesterday", "changes", 3], ["Frog Hop Online", "frog-hop", "Ming", "Game · Casual", "2 days ago", "new", 2], ["Rain Jar v3", "rain-jar", "Win", "IoT · Water", "3 days ago", "approved", 5]];
  const CH = ["Everyone on the team is a Hamster Hub member", "It works as the one line says", "Clip or pictures show the real thing", "No one else's art, music or code without credit", "A way to reach the team"];
  const st = { new: "New", changes: "Needs changes", approved: "Approved" };
  const cover = (id, k = 0) => `<span class="cv" data-id="${id}" data-k="${k}"></span>`;
  const tierPick = (on) => `<div class="tp">${tiers.map((t) => `<button aria-pressed="${t.id === on}" style="--ri:${INK[t.id]}"><i></i>${t.name}</button>`).join("")}</div>`;
  const checks = (n) => `<ul class="ach">${CH.map((c, i) => `<li class="${i < n ? "ok" : ""}"><i>${i < n ? "✓" : ""}</i>${c}</li>`).join("")}</ul>`;
  const detail = (q) => `<div class="adt"><div class="adt__head"><div><p class="adt__meta">${q[3]} · sent ${q[4]} by <b>${q[2]}</b></p><h2>${q[0]}</h2><p class="adt__line">${works.find((w) => w.id === q[1]).blurb}</p></div><span class="st st--${q[5]}">${st[q[5]]}</span></div>
    <div class="adt__gal">${cover(q[1], 1)}${cover(q[1], 2)}${cover(q[1], 3)}</div>
    <div class="adt__cols"><section><h3>Screening checks</h3>${checks(q[6])}</section><section><h3>Tier</h3>${tierPick("bronze")}<p class="hint">New works usually start in Bronze. Pick higher for work that's already strong.</p>
    <h3 class="mt">Note to the team</h3><textarea rows="3">Lovely clip. Could you credit the music track in About?</textarea></section></div>
    <div class="adt__acts"><button class="ghost3">Ask for changes</button><button class="ghost3 rej">Turn down</button><button class="post">Approve as Bronze</button></div></div>`;
  const filt = `<div class="atabs"><button aria-pressed="true">New <em>4</em></button><button>Needs changes <em>1</em></button><button>Approved <em>1</em></button><button>All works <em>50</em></button></div>`;
  const head = `<div class="ad__head"><div><p class="ad__kicker">Admin</p><h1>Review queue</h1><p>Approve new works and place them in a tier. Every decision is logged with your name.</p></div><ul class="ad__stats"><li><b>4</b><span>waiting</span></li><li><b>1.2 days</b><span>average wait</span></li><li><b>12</b><span>approved this week</span></li></ul></div>`;
  const row = (q, i) => `<li class="aq${i === 0 ? " on" : ""}">${cover(q[1])}<div><b>${q[0]}</b><i>${q[3]} · ${q[2]}</i></div><span class="st st--${q[5]}">${st[q[5]]}</span><time>${q[4]}</time></li>`;
  const board = ["new", "changes", "approved"].map((s) => `<div class="col"><h3>${st[s]} <em>${Q.filter((q) => q[5] === s).length}</em></h3>${Q.filter((q) => q[5] === s).map((q) => `<div class="kc">${cover(q[1])}<b>${q[0]}</b><i>${q[3]} · ${q[2]} · ${q[4]}</i><span class="kc__ch">${q[6]} / 5 checks</span></div>`).join("")}</div>`).join("");
  const table = `<table class="at"><thead><tr><th><input type="checkbox"></th><th>Work</th><th>Room</th><th>Sent</th><th>Checks</th><th>Tier</th><th></th></tr></thead><tbody>${Q.map((q) => `<tr><td><input type="checkbox"></td><td class="at__w">${cover(q[1])}<span><b>${q[0]}</b><i>by ${q[2]}</i></span></td><td>${q[3]}</td><td>${q[4]}</td><td><span class="bar"><i style="width:${q[6] * 20}%"></i></span>${q[6]}/5</td><td><select>${tiers.map((t) => `<option${t.id === "bronze" ? " selected" : ""}>${t.name}</option>`).join("")}</select></td><td>${q[5] === "approved" ? '<span class="st st--approved">Approved</span>' : '<button class="post sm">Approve</button>'}</td></tr>`).join("")}</tbody></table><div class="bulk">2 selected <button class="ghost3">Approve as Bronze</button><button class="ghost3">Ask for changes</button></div>`;
  $(".ad").innerHTML = `${head}
    <div class="L L--a">${filt}<div class="ad__split"><ol class="aql">${Q.filter((q) => q[5] !== "approved").map(row).join("")}</ol>${detail(Q[0])}</div></div>
    <div class="L L--b">${filt}<div class="board">${board}</div><div class="drawer">${detail(Q[1])}</div></div>
    <div class="L L--c">${filt}${table}</div>`;
  document.querySelectorAll(".cv[data-id]").forEach((el) => Art.fill(el, works.find((w) => w.id === el.dataset.id), +el.dataset.k));
})();
