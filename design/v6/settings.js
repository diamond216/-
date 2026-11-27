(function () {
  "use strict";
  const { ic, esc, avatar, Me, theme, motion, lang, Paths } = window.NestShell;
  const { Session, Store } = window.NestSession;
  const host = document.getElementById("set");
  if (!host) return;

  const seg = (lab, key, opts, cur) => `<div class="seg" role="radiogroup" aria-labelledby="${lab}" data-seg="${key}">${opts.map(([v, l, lg]) => `<button type="button" class="chip" role="radio" data-v="${v}" aria-checked="${v === cur}" tabindex="${v === cur ? 0 : -1}"${lg ? ` lang="${lg}"` : ""}>${l}</button>`).join("")}</div>`;

  function html() {
    const pick = theme.pick;
    const themeHelp = pick === "device" ? `Follows your device. <b>${theme.device === "dark" ? "Now dark." : "Now light."}</b>` : "Saved for this browser.";
    const byDevice = motion.reduced && Store.get("nest-motion") === null;
    const animHelp = `Home video, video on project cards, and fades. ${byDevice ? "<b>Your device asks for less motion, so this started off.</b>" : "<span>Starts off when your device asks for less motion.</span>"}`;
    const u = Session.user;
    const acct = Session.signedIn
      ? `<div class="set__row"><div class="set__who">${avatar(40)}<span><b>${esc(Me.get().name || u.name)}</b><small>@${esc(u.handle)}</small></span></div><div class="set__acts"><a class="btn btn--line" href="${Paths.page(`profile.html#${u.handle}/edit`)}">Edit profile</a><button type="button" class="btn btn--ghost" data-act="logout">${ic("out")}Log out</button></div></div>`
      : `<div class="set__row"><div><h3>You are not logged in</h3><p>Log in to share what you build and edit your profile.</p></div><div class="set__acts"><button type="button" class="btn btn--line" data-in>Log in</button><button type="button" class="btn btn--ink" data-in>Sign up</button></div></div>`;
    return `<h1>Settings</h1><p class="set__lead">These settings are saved in this browser on this device.</p>
      <h2 id="h-disp">Display</h2><div class="set__box" role="group" aria-labelledby="h-disp">
        <div class="set__row stack"><div><h3 id="l-th">Theme</h3><p>${themeHelp}</p></div>${seg("l-th", "theme", [["device", "Device"], ["light", "Light"], ["dark", "Dark"]], pick)}</div>
        <div class="set__row stack"><div><h3 id="l-lang">Language</h3><p>Menus, buttons and labels. Project names and texts stay as their makers wrote them.</p></div>${seg("l-lang", "lang", [["en", "English"], ["th", "ไทย", "th"]], lang.cur)}</div>
        <div class="set__row"><div><h3 id="l-anim">Animations</h3><p>${animHelp}</p></div><button type="button" class="sw" data-sw="anim" role="switch" aria-checked="${motion.on}" aria-labelledby="l-anim"><i></i></button></div>
      </div>
      <h2 id="h-acct">Account</h2><div class="set__box" role="group" aria-labelledby="h-acct">${acct}</div>`;
  }

  const keyOf = (el) => {
    if (!el || !host.contains(el)) return null;
    if (el.matches(".seg .chip")) return `[data-seg="${el.parentElement.dataset.seg}"] [data-v="${el.dataset.v}"]`;
    if (el.matches(".sw")) return ".sw";
    return null;
  };
  function render() {
    const k = keyOf(document.activeElement);
    host.innerHTML = html();
    if (k) { const f = host.querySelector(k); if (f) f.focus(); }
  }

  const choose = (key, v) => (key === "theme" ? theme.choose(v) : lang.set(v));
  host.addEventListener("click", (e) => {
    const b = e.target.closest(".seg .chip"); if (!b) return;
    choose(b.parentElement.dataset.seg, b.dataset.v);
  });
  host.addEventListener("keydown", (e) => {
    const b = e.target.closest(".seg .chip"); if (!b) return;
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (!step) return;
    e.preventDefault();
    const all = [...b.parentElement.children], n = all[(all.indexOf(b) + step + all.length) % all.length];
    n.focus();
    choose(b.parentElement.dataset.seg, n.dataset.v);
  });

  addEventListener("nest:theme", render);
  addEventListener("nest:lang", render);
  addEventListener("nest:motion", render);
  addEventListener("nest:me", render);
  addEventListener("nest:session", () => {
    const out = document.activeElement && document.activeElement.matches && document.activeElement.matches('#set [data-act="logout"]');
    render();
    if (out) { const b = host.querySelector("[data-in]"); if (b) b.focus(); }
  });
  render();
})();
