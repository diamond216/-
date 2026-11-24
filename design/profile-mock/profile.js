// Profile mockup: one maker (Pim), three layouts (body class pa / pb / pc). Sample data only.
(function () {
  const { works, tiers } = window.NEST, $ = (s, r = document) => r.querySelector(s);
  const INK = window.Tiles.RANK_INK, tIdx = (w) => tiers.findIndex((t) => t.id === w.tier) * 100 + w.place;
  const mine = [...works.filter((w) => w.maker === "Pim"), ...works.filter((w) => w.room === "Game" && w.maker !== "Pim").slice(2, 5)].sort((a, b) => tIdx(a) - tIdx(b));
  const favs = works.filter((w) => ["wheelsense", "nestboard", "sunflower-bank", "moonwheel", "rain-jar", "book-loop"].includes(w.id));
  const best = tiers.find((t) => t.id === mine[0].tier);
  const ups = [["yesterday", "Burrow Knights", "Added a second level"], ["5 days ago", "Cheek Pouch", "New cat that wakes up faster"], ["1 week ago", "Burrow Knights", "Fixed the jump that felt floaty"], ["2 weeks ago", "Kite Wars", "Drew the kites for the second map"]];
  const head = `<div class="pf__id"><span class="pf__av">P</span><div><p class="pf__h">@pim.makes</p><h1 class="pf__name">Pim Chaiyaporn</h1>
      <p class="pf__role">Game maker · Grade 11, Hamster Hub</p><p class="pf__motto">“Make it fun for two people first. Then make it work.”</p></div></div>`;
  const stats = `<ul class="pf__stats"><li><b>${mine.length}</b><span>works</span></li><li><b style="color:${INK[best.id]}">${best.name}</b><span>best rank</span></li><li><b>128</b><span>followers</span></li><li><b>3</b><span>awards</span></li></ul>`;
  const acts = `<div class="pf__acts"><a class="pf__hi" href="#"><svg viewBox="0 0 20 20"><path d="M3 5h14v9H8l-4 3z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>Say hi</a><button class="pf__follow">Follow</button></div>`;
  const contact = `<section class="box"><h3>Contact</h3><ul class="pf__ct"><li><i>Email</i><b>pim.burrow@student.example.ac.th</b></li><li><i>Phone</i><b>084-133-1363</b></li><li><i>LINE</i><b>@pim_burrow</b></li></ul></section>`;
  const about = `<section class="box"><h3>About Pim</h3><p class="pf__about">I make small co-op games you can play on a school laptop. I started in a game jam in grade 10 and haven't stopped. I like pixel art, cave maps and bosses that are hard but fair.</p>
      <ul class="pf__facts"><li><i>Into</i>Co-op games, pixel art, level design</li><li><i>Tools</i>Godot, Aseprite, a lot of paper</li><li><i>Open to</i>Team-ups, playtests, a summer internship</li></ul></section>`;
  const upd = `<section class="box"><h3>Latest from Pim</h3><ol class="pf__ups">${ups.map(([w, p, t]) => `<li><time>${w}</time><span><b>${t}</b><i>${p}</i></span></li>`).join("")}</ol></section>`;
  const tabs = `<nav class="pf__tabs" role="tablist"><button role="tab" aria-selected="true">Works <em>${mine.length}</em></button><button role="tab">Updates</button><button role="tab">Favourites <em>${favs.length}</em><svg class="lock" viewBox="0 0 16 16" aria-hidden="true"><rect x="3.5" y="7" width="9" height="6.5" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M5.5 7V5.5a2.5 2.5 0 015 0V7" fill="none" stroke="currentColor" stroke-width="1.4"/></svg></button><button role="tab">About</button></nav>`;
  const worksH = `<div class="pf__list"><div class="pf__lh"><h2>Works, by rank</h2><span class="pf__sort">Best rank first</span></div><div class="grid pf__grid"></div></div>`;
  const favH = `<div class="pf__list"><div class="pf__lh"><h2>Favourites</h2><span class="vis"><svg viewBox="0 0 16 16" aria-hidden="true"><rect x="3.5" y="7" width="9" height="6.5" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M5.5 7V5.5a2.5 2.5 0 015 0V7" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>Only you can see this</span><button class="pf__set">Settings</button></div><div class="grid pf__grid pf__grid--fav"></div></div>`;
  $(".pf").innerHTML = `
   <div class="L L--a"><div class="pf__band">${head}<div class="pf__right">${stats}${acts}</div></div>${tabs}<div class="pf__body"><div>${worksH}</div><aside class="pf__side">${contact}${upd}${about}</aside></div></div>
   <div class="L L--b"><div class="pf__body pf__body--b"><aside class="pf__card">${head}${stats}${acts}${contact}${about}</aside><div>${tabs}${worksH}<div class="pf__ups2">${upd}</div></div></div></div>
   <div class="L L--c"><div class="pf__cover"><div class="cv" data-id="${mine[0].id}"></div></div><div class="pf__over">${head}${acts}</div>${stats}${tabs}<div class="pf__body"><div>${favH}${worksH}</div><aside class="pf__side">${about}${contact}${upd}</aside></div></div>`;
  const { ResultCard } = window.Tiles;
  document.querySelectorAll(".pf__grid:not(.pf__grid--fav)").forEach((g) => mine.forEach((w) => g.appendChild(new ResultCard(w).render())));
  document.querySelectorAll(".pf__grid--fav").forEach((g) => favs.forEach((w) => g.appendChild(new ResultCard(w).render())));
  document.querySelectorAll(".pf__cover .cv").forEach((el) => Art.fill(el, mine[0], 2));
  // settings dialog preview (shown in the C mockup)
  document.body.insertAdjacentHTML("beforeend", `<div class="dlg" hidden><div class="dlg__box"><h2>Profile settings</h2>
    <fieldset><legend>Who can see your favourites?</legend><label class="rad"><input type="radio" name="v" checked><span><b>Only me</b><i>Your favourites stay private.</i></span></label><label class="rad"><input type="radio" name="v"><span><b>Everyone</b><i>Shown as a tab on your profile.</i></span></label></fieldset>
    <fieldset><legend>Show on my profile</legend><label class="sw"><span>Contact details</span><input type="checkbox" checked></label><label class="sw"><span>Phone number</span><input type="checkbox"></label><label class="sw"><span>Browsing history</span><input type="checkbox"></label></fieldset>
    <div class="dlg__acts"><button class="ghost2">Cancel</button><button class="solid2">Save</button></div></div></div>`);
})();
