// Post-your-work mockups: three layouts (pa / pb / pc), filled with a sample draft. Static: nothing submits.
(function () {
  const $ = (s, r = document) => r.querySelector(s), { works } = window.NEST;
  const me = $(".me__av"); if (me) { me.textContent = "P"; me.style.setProperty("--h", 300); }
  const draft = { name: "Lantern Run 2", line: "Carry a lantern through a cave that changes every night.", room: "Game", genre: "Roguelike", plat: ["Windows", "Web"] };
  const rooms = ["Game", "IoT", "Web", "Idea"], genres = ["Roguelike", "Puzzle", "Casual", "Co-op"], plats = ["Windows", "macOS", "Web", "Android", "iOS"];
  const seg = (list, on) => `<div class="seg2">${list.map((x) => `<button type="button" aria-pressed="${x === on}">${x}</button>`).join("")}</div>`;
  const chips = (list, on) => `<div class="chips2">${list.map((x) => `<button type="button" aria-pressed="${on.includes(x)}">${x}</button>`).join("")}</div>`;
  const f = (label, input, hint = "") => `<label class="fld"><span class="fld__l">${label}</span>${input}${hint ? `<span class="fld__h">${hint}</span>` : ""}</label>`;
  const media = `<div class="drop"><div class="drop__z"><svg viewBox="0 0 24 24"><path d="M12 16V4M7 9l5-5 5 5M4 17v3h16v-3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg><b>Drop a clip or pictures here</b><i>MP4 up to 60 s, PNG or JPG. The first one is the cover.</i></div>
    <div class="drop__list"><span class="dm dm--clip"><span class="cv" data-k="1"></span><em>Clip · 0:24</em></span><span class="dm"><span class="cv" data-k="2"></span><em>Cover</em></span><span class="dm"><span class="cv" data-k="3"></span></span><span class="dm dm--add">+</span></div></div>`;
  const team = `<ul class="tm"><li><span class="av2">P</span><b>Pim</b><input value="Lead, game design" aria-label="Pim's role"><span class="you">You</span></li><li><span class="av2" style="--h:120">B</span><b>Bas</b><input value="Programming" aria-label="Bas's role"><button class="x" aria-label="Remove Bas">×</button></li></ul><button class="add">+ Add a teammate</button>`;
  const contact = `<div class="row3">${f("Email", '<input value="pim.burrow@student.example.ac.th">')}${f("Phone", '<input value="084-133-1363">', "Optional")}${f("LINE", '<input value="@pim_burrow">', "Optional")}</div>`;
  const dl = `<div class="row2">${f("What people can download", '<input value="Free download">')}${f("File", '<span class="file"><b>lantern-run-2.zip</b><i>84 MB</i><button>Change</button></span>')}</div>`;
  const about = f("About this project", `<textarea rows="5">We started Lantern Run in a game jam and kept going. Every night the cave is different, so no two runs look the same.\n\nNext we want two players, one lantern.</textarea>`, "Three short paragraphs are plenty. Say how it started, what it does, and what's next.");
  const basics = `${f("Name", `<input value="${draft.name}">`)}${f("One line about it", `<input value="${draft.line}"><span class="cnt">56 / 80</span>`)}
    <div class="fld"><span class="fld__l">Room</span>${seg(rooms, draft.room)}</div><div class="fld"><span class="fld__l">Genre</span>${chips(genres, [draft.genre])}</div><div class="fld"><span class="fld__l">Runs on</span>${chips(plats, draft.plat)}</div>`;
  const checks = [["A name and one line", 1], ["A cover picture", 1], ["A clip or three pictures", 1], ["At least one teammate with a role", 1], ["A way to reach you", 1], ["Something to try or download", 0]];
  const checkH = `<section class="box chk"><h3>Before it goes up</h3><ul>${checks.map(([t, ok]) => `<li class="${ok ? "ok" : ""}"><i>${ok ? "✓" : ""}</i>${t}</li>`).join("")}</ul><p>Missing ones don't stop you posting. Hamster Hub checks every new work within two days.</p></section>`;
  const mode = `<div class="mode"><button aria-pressed="true">New project</button><button aria-pressed="false">Update a project</button></div>`;
  const head = `<div class="po__head"><div><a class="back" href="#"><svg viewBox="0 0 16 16"><path d="M10 3L5 8l5 5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>Back</a><h1>Post your work</h1><p>Takes about five minutes. You can save and come back.</p></div>${mode}</div>`;
  const sec = (n, t, body) => `<section class="sec2"><h2><span>${n}</span>${t}</h2>${body}</section>`;
  const actions = `<div class="po__acts"><button class="ghost3">Save for later</button><span class="saved">Saved 2 minutes ago</span><button class="post">Post it</button></div>`;
  const preview = `<section class="box pv2"><h3>How it will look</h3><div class="pv2__tile"></div><p class="pv2__n">${draft.name}</p><p class="pv2__l">${draft.line}</p><p class="pv2__t"><span>Game</span><span>Roguelike</span><span>Windows</span></p></section>`;
  // C: the project page itself, editable
  const inplace = `<div class="ip"><p class="ip__bar">Editing your project page. Click anything with a dashed line to change it.</p>
    <div class="ip__head"><p class="tags"><span class="tag tag--room ed">Game</span><span class="tag tag--room ed">Roguelike</span><span class="tag ed">Windows</span><span class="tag ed">Web</span><span class="tag tag--add">+ tag</span></p>
    <h1 class="title ed">${draft.name}</h1><p class="blurb ed">${draft.line}</p></div>
    <div class="ip__grid"><div><div class="ip__gal ed"><span class="cv" data-k="2"></span><span class="ip__drop">Drop a clip or pictures, or click to choose</span></div><div class="ip__th"><span class="cv" data-k="1"></span><span class="cv" data-k="3"></span><span class="add2">+</span></div>
      <h2 class="ip__h">About this project</h2><p class="ed ip__p">We started Lantern Run in a game jam and kept going. Every night the cave is different…</p></div>
      <aside><section class="box"><h3>Team</h3>${team}</section><section class="box"><h3>Contact</h3><p class="ed ip__c">pim.burrow@student.example.ac.th</p><p class="ed ip__c">@pim_burrow</p></section>${checkH}</aside></div>${actions}</div>`;
  $(".po").innerHTML = `
    <div class="L L--a">${head}<div class="po__grid"><div class="po__form">${sec(1, "The basics", basics)}${sec(2, "Clip and pictures", media)}${sec(3, "About it", about)}${sec(4, "Team", team)}${sec(5, "How to reach you", contact)}${sec(6, "Download", dl)}${actions}</div><aside class="po__side">${preview}${checkH}</aside></div></div>
    <div class="L L--b">${head}<ol class="steps"><li class="done"><i>✓</i>Basics</li><li class="on"><i>2</i>Clip and pictures</li><li><i>3</i>About and team</li><li><i>4</i>Contact and download</li><li><i>5</i>Check and post</li></ol>
      <div class="wiz"><div class="wiz__card">${sec(2, "Clip and pictures", media)}<p class="wiz__tip">Tip: a short clip of someone actually using it gets three times more “Say hi” messages than a screenshot.</p><div class="wiz__nav"><button class="ghost3">Back</button><span>Step 2 of 5</span><button class="post">Next: About and team</button></div></div><aside class="po__side">${preview}</aside></div></div>
    <div class="L L--c">${inplace}</div>`;
  const w = works.find((x) => x.id === "lantern-run");
  document.querySelectorAll(".cv[data-k], .pv2__tile").forEach((el) => Art.fill(el, w, +(el.dataset.k || 0)));
})();
