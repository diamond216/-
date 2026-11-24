const KEY = 'hamster-nest-sound';
const FADE_MS = 1200;
const VOLUME = { normal: 0.45, quiet: 0.16 };

const here = (file) => new URL(`../assets/audio/${file}`, import.meta.url).href;

export async function initSound(opts = {}) {
  const fadeMs = opts.fadeMs ?? FADE_MS;
  const store = (() => { try { return opts.storage ?? localStorage; } catch { return null; } })();
  const read = () => { try { return store?.getItem(KEY); } catch { return null; } };
  const write = (v) => { try { store?.setItem(KEY, v); } catch { } };

  let enabled = read() === 'on';
  let gestured = false;
  let hidden = document.hidden;
  const listeners = new Set();

  const audio = new Audio();
  audio.loop = true;
  audio.preload = 'auto';
  audio.volume = 0;
  const sources = opts.sources ?? [{ src: here('underwater-loop.ogg'), type: 'audio/ogg; codecs="vorbis"' }, { src: here('underwater-loop.m4a'), type: 'audio/mp4' }];
  const playable = sources.find((s) => audio.canPlayType(s.type)) ?? sources[sources.length - 1];
  audio.src = playable.src;

  const heroVideo = opts.heroVideo === undefined ? document.querySelector('#hero-video') : opts.heroVideo;
  const baseVolume = () => (heroVideo && heroVideo.paused ? VOLUME.quiet : VOLUME.normal);
  const audible = () => enabled && gestured && !hidden;

  let target = 0, raf = 0, from = 0, t0 = 0;
  function ramp(now) {
    const k = Math.min(1, (now - t0) / fadeMs);
    audio.volume = Math.max(0, Math.min(1, from + (target - from) * k));
    if (k < 1) { raf = requestAnimationFrame(ramp); return; }
    raf = 0;
    if (target === 0 && !audio.paused) audio.pause();
  }
  function fadeTo(v) {
    if (v === target && (raf || audio.volume === v)) return;
    target = v; from = audio.volume; t0 = performance.now();
    cancelAnimationFrame(raf); raf = requestAnimationFrame(ramp);
  }

  function apply() {
    if (audible()) {
      if (audio.paused) audio.play().catch(() => { });
      fadeTo(baseVolume());
    } else if (!audio.paused || audio.volume > 0) {
      fadeTo(0);
    }
  }

  const unlock = () => { if (gestured) return; gestured = true; for (const e of GESTURES) removeEventListener(e, unlock, true); apply(); };
  const GESTURES = ['pointerdown', 'keydown', 'click'];
  for (const e of GESTURES) addEventListener(e, unlock, true);

  const onVisibility = () => { hidden = document.hidden; apply(); };
  document.addEventListener('visibilitychange', onVisibility);
  const onVideo = () => { if (audible()) fadeTo(baseVolume()); };
  heroVideo?.addEventListener('play', onVideo);
  heroVideo?.addEventListener('pause', onVideo);

  const api = {
    get enabled() { return enabled; },
    get playing() { return !audio.paused && audio.volume > 0; },
    toggle() {
      enabled = !enabled;
      write(enabled ? 'on' : 'off');
      if (enabled) gestured = gestured || true;
      apply();
      for (const cb of [...listeners]) cb(enabled);
    },

    on(type, cb) {
      if (type !== 'change') throw new Error(`unknown event "${type}"`);
      listeners.add(cb);
      return () => listeners.delete(cb);
    },

    state() { return { enabled, gestured, hidden, paused: audio.paused, volume: audio.volume, target, src: audio.currentSrc || audio.src, stored: read() }; },
    destroy() {
      cancelAnimationFrame(raf); audio.pause(); audio.removeAttribute('src');
      for (const e of GESTURES) removeEventListener(e, unlock, true);
      document.removeEventListener('visibilitychange', onVisibility);
      heroVideo?.removeEventListener('play', onVideo); heroVideo?.removeEventListener('pause', onVideo);
      listeners.clear();
    },
  };
  return api;
}
