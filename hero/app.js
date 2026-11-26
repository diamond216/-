(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const rootEl = document.documentElement;
  const motionOk = matchMedia('(prefers-reduced-motion: no-preference)');
  const reduced = !motionOk.matches;
  const saveData = !!(navigator.connection && navigator.connection.saveData);

  // Words for this page. Shared ones (nav, sign in, footer) are in design/v6/lang.js.
  // A work's own text (RE//SLASH, its description and makers) is not translated; its room label comes from NestLang.room.
  NestLang.add({
    en: {
      title: 'Hamster Nest',
      description: 'Hamster Nest shows student projects in games, websites and IoT. Browse the projects and get in touch with the students who made it.',
      brandTop: 'Hamster Nest, back to top',
      contact: 'Contact',
      'hero.by': 'by',
      'hero.browseSection': 'Browse projects',
      chooseLang: 'Choose language',
      langLabel: 'Language: {name}',
      profile: 'My profile',
      h1: 'Hamster Nest: student projects',
      featured: 'Featured projects',
      slides: 'Slides',
      slideGroup: '{n} of {total}',
      slideAnnounce: '{n} of {total}: {title}',
      projectTitle: 'Project title {n}',
      projectDesc: 'Placeholder description: a short line or two about the project and the student team behind it.',
      viewReslash: 'View this project: RE//SLASH (opens in a new tab)',
      goToProject: 'Go to project {n}: Project title {n}',
      prev: 'Previous project',
      next: 'Next project',
      chooseProject: 'Choose a project',
      playVideo: 'Play background video',
      pauseVideo: 'Pause background video',
      soundLabel: 'Ocean ambience sound',
      soundToastOn: 'Ocean ambience · On',
      soundToastOff: 'Ocean ambience · Off',
      soundHint: 'Tap to hear',
      explore: 'Explore projects',
      scrollDown: 'Scroll down',
      viewThisProject: 'View this project',
    },
    th: {
      title: 'Hamster Nest',
      description: 'Hamster Nest รวมโปรเจกต์ของนักเรียนด้านเกม เว็บไซต์ และ IoT ดูผลงานแล้วติดต่อคนที่สร้างได้เลย',
      brandTop: 'Hamster Nest กลับไปด้านบน',
      chooseLang: 'เลือกภาษา',
      contact: 'ติดต่อ',
      'hero.by': 'โดย',
      'hero.browseSection': 'สำรวจผลงาน',
      langLabel: 'ภาษา: {name}',
      profile: 'โปรไฟล์ของฉัน',
      h1: 'Hamster Nest: โปรเจกต์ของนักเรียน',
      featured: 'โปรเจกต์แนะนำ',
      slides: 'สไลด์',
      slideGroup: '{n} จาก {total}',
      slideAnnounce: '{n} จาก {total}: {title}',
      projectTitle: 'ชื่อโปรเจกต์ {n}',
      projectDesc: 'ข้อความตัวอย่าง: คำอธิบายสั้น ๆ หนึ่งหรือสองบรรทัดเกี่ยวกับโปรเจกต์และทีมนักเรียนผู้สร้าง',
      viewReslash: 'ดูโปรเจกต์นี้: RE//SLASH (เปิดในแท็บใหม่)',
      goToProject: 'ไปที่โปรเจกต์ {n}: ชื่อโปรเจกต์ {n}',
      prev: 'โปรเจกต์ก่อนหน้า',
      next: 'โปรเจกต์ถัดไป',
      chooseProject: 'เลือกโปรเจกต์',
      playVideo: 'เล่นวิดีโอพื้นหลัง',
      pauseVideo: 'หยุดวิดีโอพื้นหลังชั่วคราว',
      soundLabel: 'เสียงบรรยากาศทะเล',
      soundToastOn: 'เสียงบรรยากาศทะเล · เปิด',
      soundToastOff: 'เสียงบรรยากาศทะเล · ปิด',
      soundHint: 'แตะเพื่อฟังเสียง',
      explore: 'สำรวจโปรเจกต์',
      scrollDown: 'เลื่อนลง',
      viewThisProject: 'ดูโปรเจกต์นี้',
    },
  });
  const LANG_NAMES = { th: 'ภาษาไทย', en: 'English' };
  const t = (key, vars) => NestLang.t(key, vars);
  const langListeners = [];

  if (!Object.hasOwn(HTMLElement.prototype, 'popover')) {
    const css = document.createElement('link'); css.rel = 'stylesheet'; css.href = 'assets/vendor/popover-polyfill.css'; document.head.append(css);
    import('./assets/vendor/popover-polyfill.js').catch(() => {});
  }

  const heroVideo = $('#hero-video');
  if (reduced) { heroVideo.removeAttribute('autoplay'); heroVideo.pause(); }

  const posterEl = $('.hero-poster');
  const artEl = $('#hero-art'), artImg = artEl.querySelector('img');
  const markReady = (el) => el.classList.add('is-ready');
  [[posterEl, posterEl], [artImg, artEl]].forEach(([img, el]) => {
    if (img.complete) markReady(el);
    else { img.addEventListener('load', () => markReady(el)); img.addEventListener('error', () => markReady(el)); }
  });

  $$('[popovertarget]').forEach((btn) => {
    const pop = document.getElementById(btn.getAttribute('popovertarget'));
    if (pop) pop.addEventListener('toggle', (e) => btn.setAttribute('aria-expanded', String(e.newState === 'open')));
  });
  $$('.btn-rainbow').forEach((b) => b.classList.add('is-away'));

  const langBtn = $('#lang-btn');
  const langMenu = $('#lang-menu');

  // NestLang has already written every [data-i18n] text; this adds what only this page knows
  function applyLang() {
    const lang = NestLang.get();
    document.title = t('title');
    $('meta[name="description"]').setAttribute('content', t('description'));
    $$('[data-lang]', langMenu).forEach((i) => (i.dataset.lang === lang ? i.setAttribute('aria-current', 'true') : i.removeAttribute('aria-current')));
    $('use', langBtn).setAttribute('href', lang === 'th' ? '#flag-th' : '#flag-gb');
    langBtn.setAttribute('aria-label', t('langLabel', { name: LANG_NAMES[lang] }));
    langListeners.forEach((fn) => fn());
  }
  NestLang.addEventListener('change', applyLang);
  $$('[data-lang]', langMenu).forEach((item) => {
    item.addEventListener('click', () => {
      NestLang.set(item.dataset.lang);
      langMenu.hidePopover();
      langBtn.focus();
    });
  });

  const island = $('#island');
  const soundBtn = $('#sound-btn');
  const soundToast = $('#sound-toast');
  const soundStatus = $('#sound-status');
  let sound = { enabled: (() => { try { return localStorage.getItem('hamster-nest-sound') === 'on'; } catch { return false; } })(), playing: false, toggle() {}, on() {} };
  let toastTimer = 0;
  let userToggled = false;
  let soundGestured = false;
  const renderSound = () => {
    soundBtn.setAttribute('aria-checked', String(!!sound.enabled));
    soundToast.textContent = t(sound.enabled ? 'soundToastOn' : 'soundToastOff');
    if (!sound.enabled) rootEl.removeAttribute('data-sound-wait');
  };
  const showToast = () => {
    island.setAttribute('data-toast', '');
    soundStatus.textContent = soundToast.textContent;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { island.removeAttribute('data-toast'); soundStatus.textContent = ''; }, 1500);
  };
  const onSoundChange = () => { renderSound(); if (userToggled) { userToggled = false; showToast(); } };
  const bindSound = (next) => {
    sound = next;
    sound.on('change', onSoundChange);
    if (sound.enabled && !sound.playing && !soundGestured) rootEl.dataset.soundWait = '';
    else rootEl.removeAttribute('data-sound-wait');
    renderSound();
  };
  bindSound(sound);
  langListeners.push(renderSound);
  soundBtn.addEventListener('click', () => {
    userToggled = true;
    sound.toggle();
    setTimeout(() => { if (userToggled) onSoundChange(); }, 60);
  });
  const firstGesture = () => { soundGestured = true; setTimeout(() => rootEl.removeAttribute('data-sound-wait'), 700); };
  ['pointerdown', 'keydown'].forEach((ev) => addEventListener(ev, firstGesture, { once: true, capture: true }));
  import('./sound/sound.js').then(async (m) => { bindSound(await m.initSound()); }).catch(() => { });

  const pauseBtn = $('#hero-pause');
  let userPaused = reduced || saveData;
  let heroStarted = false;
  function setPauseUI() {
    const playing = !heroVideo.paused;
    pauseBtn.dataset.state = playing ? 'playing' : 'paused';
    pauseBtn.setAttribute('aria-label', t(playing ? 'pauseVideo' : 'playVideo'));
  }
  async function playHero() {
    heroStarted = true;
    try { await heroVideo.play(); } catch { }
    setPauseUI();
  }
  function startHero() { if (!userPaused) playHero(); }
  heroVideo.addEventListener('playing', () => { heroVideo.classList.add('is-playing'); setPauseUI(); heroProgress.start(); });
  heroVideo.addEventListener('pause', setPauseUI);
  pauseBtn.addEventListener('click', () => { if (heroVideo.paused) { userPaused = false; playHero(); } else { userPaused = true; heroVideo.pause(); } });
  setPauseUI();
  langListeners.push(setPauseUI);

  const track = $('#hero-track');
  const slides = $$('.slide', track);
  const dotsEl = $('#hero-dots');
  const status = $('#hero-status');
  const last = slides.length - 1;
  let current = 0;
  const heroProgress = (() => {
    let raf = 0, prev = 0;
    const bar = (j) => dots[j].firstElementChild;
    const frac = () => (heroVideo.duration > 0 ? Math.min(1, heroVideo.currentTime / heroVideo.duration) : 0);
    function tick() {
      raf = 0;
      if (heroVideo.paused) return;
      const now = heroVideo.currentTime;
      const wrapped = now < prev - heroVideo.duration * 0.5;
      prev = now;
      if (wrapped && !reduced && !busy) goTo(current === last ? 0 : current + 1);
      else bar(current).style.setProperty('--p', (reduced ? 1 : frac()).toFixed(4));
      raf = requestAnimationFrame(tick);
    }
    return {
      paint() { dots.forEach((d, j) => bar(j).style.setProperty('--p', j === current ? (reduced ? 1 : frac()).toFixed(4) : 0)); },
      changed() {
        prev = 0;
        if (heroVideo.readyState > 0 && heroVideo.currentTime > 0.5) { try { heroVideo.currentTime = 0; } catch {} }
      },
      start() { if (!raf && !heroVideo.paused) { prev = heroVideo.currentTime; raf = requestAnimationFrame(tick); } },
    };
  })();
  const dots = slides.map((slide, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.append(document.createElement('i'));
    b.addEventListener('click', () => goTo(i));
    dotsEl.append(b);
    return b;
  });
  const relabelSlider = () => {
    dots.forEach((b, i) => b.setAttribute('aria-label', t('goToProject', { n: i + 1 })));
    slides.forEach((sl, i) => sl.setAttribute('aria-label', t('slideGroup', { n: i + 1, total: slides.length })));
  };
  langListeners.push(relabelSlider);
  relabelSlider();
  const indexFromScroll = () => Math.min(last, Math.max(0, Math.round(track.scrollLeft / track.clientWidth)));
  let target = 0;
  let busy = false;
  let debounceTimer = 0;
  let safetyTimer = 0;
  function markCurrent(i) {
    const changed = i !== current;
    current = i; $('#hero-frame').dataset.slide = i;
    if (changed) heroProgress.changed();
    heroProgress.paint();
    dots.forEach((d, j) => (j === i ? d.setAttribute('aria-current', 'true') : d.removeAttribute('aria-current')));
  }
  function syncInert(i) { slides.forEach((s, j) => { s.inert = j !== i; }); }
  syncInert(0);
  function settled(force) {
    if (busy && !force && Math.abs(track.scrollLeft - target * track.clientWidth) > 2) return;
    clearTimeout(safetyTimer);
    busy = false;
    target = indexFromScroll();
    markCurrent(target);
    syncInert(target);
    status.textContent = t('slideAnnounce', { n: target + 1, total: slides.length, title: $('h2', slides[target]).textContent });
  }
  function goTo(i) {
    const far = Math.abs(i - target) > 1;
    busy = true; target = i; markCurrent(i); slides[i].inert = false;
    clearTimeout(safetyTimer); safetyTimer = setTimeout(() => settled(true), 2500);
    if (far && motionOk.matches) {
      track.classList.add('is-jumping');
      setTimeout(() => {
        track.style.scrollBehavior = 'auto';
        track.scrollTo({ left: i * track.clientWidth, behavior: 'auto' });
        track.style.scrollBehavior = '';
        requestAnimationFrame(() => track.classList.remove('is-jumping'));
      }, 170);
    } else {
      track.scrollTo({ left: i * track.clientWidth, behavior: motionOk.matches ? 'smooth' : 'auto' });
    }
  }
  $$('.hero-arrow').forEach((btn) => btn.addEventListener('click', () => {
    const step = btn.dataset.direction === 'next' ? 1 : -1;
    const next = target + step;
    goTo(next > last ? 0 : next < 0 ? last : next);
  }));
  track.addEventListener('keydown', (e) => {
    if (e.target !== track || e.altKey || e.ctrlKey || e.metaKey) return;
    const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const next = target + d;
    goTo(next > last ? 0 : next < 0 ? last : next);
  });
  let sraf = 0;
  track.addEventListener('scroll', () => {
    if (!busy) { cancelAnimationFrame(sraf); sraf = requestAnimationFrame(() => markCurrent(indexFromScroll())); }
    clearTimeout(debounceTimer); debounceTimer = setTimeout(() => settled(), 160);
  }, { passive: true });
  addEventListener('resize', () => { track.scrollTo({ left: current * track.clientWidth, behavior: 'auto' }); });
  markCurrent(0);

  applyLang();
  startHero();
})();
