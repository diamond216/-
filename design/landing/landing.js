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

const languageSwitch = new LanguageSwitch();
document.querySelectorAll('[data-pulse]').forEach((el) => new ActivityStrip(el));

// ?lang=th and ?theme=night are handy for previews.
const params = new URLSearchParams(location.search);
if (params.get('lang') === 'th') languageSwitch.set('th');
if (params.get('theme')) document.documentElement.dataset.theme = params.get('theme');
