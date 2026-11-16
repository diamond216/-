// Small enhancements for the landing draft: language switch and the 30-day activity strip.

class LanguageSwitch {
  constructor(root = document) {
    this.root = root;
    this.buttons = [...root.querySelectorAll('[data-lang]')];
    this.textNodes = [...root.querySelectorAll('[data-th]')];
    this.placeholders = [...root.querySelectorAll('[data-th-placeholder]')];
    // English lives in the markup; remember it so we can switch back.
    this.textNodes.forEach((el) => (el.dataset.en = el.innerHTML));
    this.placeholders.forEach((el) => (el.dataset.enPlaceholder = el.placeholder));
    this.buttons.forEach((b) => b.addEventListener('click', () => this.set(b.dataset.lang)));
  }

  set(lang) {
    document.documentElement.lang = lang;
    this.textNodes.forEach((el) => (el.innerHTML = el.dataset[lang]));
    this.placeholders.forEach((el) => (el.placeholder = lang === 'th' ? el.dataset.thPlaceholder : el.dataset.enPlaceholder));
    this.buttons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
  }
}

// Turns data-pulse="1010…" (one digit per day, oldest first) into a row of ticks.
class ActivityStrip {
  constructor(el) {
    const days = [...el.dataset.pulse];
    const active = days.filter((d) => d === '1').length;
    el.setAttribute('role', 'img');
    el.setAttribute('aria-label', `Updated on ${active} of the last ${days.length} days`);
    el.append(...days.map((d) => Object.assign(document.createElement('i'), { className: d === '1' ? 'on' : '' })));
  }
}

// The hero instrument: one tick per update in the last 30 days, the ones from today in the accent colour.
// Static here; the real build drives it from project data and animates it with anime.js.
class UpdateWheel {
  static NS = 'http://www.w3.org/2000/svg';

  constructor(svg, { total = 312, today = 9, open = 21, paused = 3, ticks = 132 } = {}) {
    this.svg = svg;
    this.cx = 260;
    this.cy = 210;
    this.stats = { total, today, open, paused };
    this.ticks = ticks;
    this.draw();
  }

  el(name, attrs = {}, text) {
    const node = document.createElementNS(UpdateWheel.NS, name);
    Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
    if (text) node.textContent = text;
    return node;
  }

  point(radius, degrees) {
    const a = (degrees * Math.PI) / 180;
    return [this.cx + radius * Math.cos(a), this.cy + radius * Math.sin(a)];
  }

  draw() {
    const { cx, cy } = this;
    const ring = this.el('g', { class: 'wheel__ring' });
    let seed = 7;
    const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    const every = Math.floor(this.ticks / this.stats.today);
    for (let i = 0; i < this.ticks; i++) {
      const today = i % every === 3;
      const [x1, y1] = this.point(168, (i / this.ticks) * 360);
      const [x2, y2] = this.point(168 + (today ? 24 : 5 + rand() * 13), (i / this.ticks) * 360);
      ring.append(this.el('line', { x1, y1, x2, y2, class: today ? 'w-tick w-tick--today' : 'w-tick' }));
    }
    for (let i = 0; i < 8; i++) {
      const [x1, y1] = this.point(56, i * 45);
      const [x2, y2] = this.point(158, i * 45);
      ring.append(this.el('line', { x1, y1, x2, y2, class: 'w-line' }));
    }
    const [ax, ay] = this.point(158, -100);
    const [bx, by] = this.point(158, -38);
    this.svg.append(
      this.el('circle', { cx, cy, r: 158, class: 'w-line' }),
      this.el('circle', { cx, cy, r: 112, class: 'w-line', 'stroke-dasharray': '2 7' }),
      ring,
      this.el('path', { d: `M${ax} ${ay} A158 158 0 0 1 ${bx} ${by}`, class: 'w-arc' }),
      this.el('circle', { cx, cy, r: 56, class: 'w-hub' }),
      this.el('text', { x: cx, y: cy + 6, class: 'w-num' }, String(this.stats.total)),
      this.el('text', { x: cx, y: cy + 24, class: 'w-cap' }, 'UPDATES / 30 DAYS'),
      ...this.callout(-140, [96, 44], 8, 'start', `${String(this.stats.today).padStart(2, '0')} UPDATED TODAY`),
      ...this.callout(180, [70, 210], 8, 'start', `${String(this.stats.paused).padStart(2, '0')} PAUSED`),
      ...this.callout(-42, [420, 44], 474, 'end', `${this.stats.open} OPEN TO INVESTMENT`),
    );
  }

  // A leader line from the ring out to a mono label, like a technical drawing.
  callout(degrees, [kx, ky], endX, anchor, label) {
    const [x, y] = this.point(196, degrees);
    return [
      this.el('polyline', { points: `${x},${y} ${kx},${ky} ${endX},${ky}`, class: 'w-lead' }),
      this.el('text', { x: endX, y: ky - 7, class: 'w-label', 'text-anchor': anchor }, label),
    ];
  }
}

const languageSwitch = new LanguageSwitch();
const wheel = document.getElementById('wheel');
if (wheel) new UpdateWheel(wheel);
document.querySelectorAll('[data-pulse]').forEach((el) => new ActivityStrip(el));

// ?lang=th and ?theme=night are handy for previews.
const params = new URLSearchParams(location.search);
if (params.get('lang') === 'th') languageSwitch.set('th');
if (params.get('theme')) document.documentElement.dataset.theme = params.get('theme');
