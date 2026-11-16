import type { RelativeAge } from "./RelativeAge";

const plural = (count: number, one: string, many: string) => `${count} ${count === 1 ? one : many}`;

/**
 * Every English string in the interface. This file is also the shape the Thai
 * dictionary has to match, so a missing translation is a type error.
 */
export const en = {
  "meta.title": "Hamster Nest — work that's still moving",
  "meta.description":
    "Where people at Hamster Hub keep what they're building. Every project posts updates, and you can write to the person who made it.",

  "brand.home": "Hamster Nest home",
  "brand.by": "from Hamster Hub",
  "skip.shelf": "Skip to the projects",
  "nav.label": "Main",
  "nav.browse": "Browse",
  "nav.makers": "Makers",
  "nav.investors": "For investors",
  "nav.howWePick": "How we pick",
  "nav.post": "Post your work",
  "lang.label": "Language",
  "theme.night": "Night theme",

  "hero.count": (p: { projects: number; updates: number; days: number }) =>
    `${plural(p.projects, "project", "projects")} · ${plural(p.updates, "update", "updates")} in the last ${p.days} days`,
  "hero.title.lead": "Work that's",
  "hero.title.accent": "still moving.",
  "hero.lede":
    "Hamster Nest is where people at Hamster Hub keep what they're building: games, web apps, hardware, and ideas that aren't finished yet. Every project here posts updates as it goes. See one you like? Write to the person who made it.",
  "search.label": "What are you looking for?",
  "search.placeholder": "Try “co-op roguelike” or “soil sensor”",
  "search.submit": "Have a look",
  "search.hint": "Press / to search",
  "hero.busy": "Or start with what's been busy lately:",

  "donut.aria": (p: { updates: number; days: number; today: number; open: number; building: number; paused: number }) =>
    `${plural(p.updates, "update", "updates")} in the last ${p.days} days. ${plural(p.today, "project", "projects")} posted something today, ${p.open} more are looking for investors, ${p.building} are heads down building, and ${p.paused} are taking a break.`,
  "donut.caption": "updates this month",
  "donut.today": "posted something today",
  "donut.open": "looking for investors",
  "donut.building": "heads down, building",
  "donut.paused": "taking a break",

  "note.label": "A note from a maker",
  "note.who": (p: { role: string; years: number; projects: number }) =>
    `${p.role} · ${plural(p.years, "year", "years")} at Hamster Hub · ${plural(p.projects, "project", "projects")}`,
  "note.last": (p: { ago: string; project: string; what: string }) => `${p.ago}: ${p.project} ${p.what}`,
  "note.cta": (p: { name: string }) => `Say hi to ${p.name}`,

  "tabs.label": "Categories",
  "tabs.everything": "Everything",
  "sort.label": "Sort by",
  "sort.active": "Most active",
  "sort.newest": "Newest",
  "sort.followed": "Most followed",

  "filters.label": "Filters",
  "filters.toggle": (p: { active: number }) => (p.active > 0 ? `Filters (${p.active})` : "Filters"),
  "filters.genre": "Genre",
  "filters.allGenres": (p: { count: number }) => `All ${p.count} genres`,
  "filters.fewerGenres": "Show fewer genres",
  "filters.stage": "How far along",
  "filters.investing": "If you're investing",
  "filters.open": "Open to investment",
  "filters.hasDemo": "Has something to try",
  "filters.week": "Updated this week",
  "filters.help": "Can't find it?",
  "filters.helpLink": "Tell us what you're after",
  "filters.clear": "Clear the filters",

  "shelf.label": "Projects",
  "busiest.title": "Busiest this week",
  "busiest.sub": "Ranked by how often a project posts real updates. Post more, climb higher.",
  "busiest.link": "How ranking works",
  "fresh.title": "Fresh updates",
  "fresh.sub": (p: { scope: string; order: string }) => `${p.scope}, ${p.order}.`,
  "fresh.everyCategory": "Every category",
  "fresh.order.active": "most active first",
  "fresh.order.newest": "newest first",
  "fresh.order.followed": "most followed first",
  "results.count": (p: { count: number; text: string }) =>
    p.text
      ? `${p.count} ${p.count === 1 ? "project matches" : "projects match"} “${p.text}”.`
      : `${p.count} ${p.count === 1 ? "project matches" : "projects match"} these filters.`,
  "results.empty": "Nothing matches that yet. Try fewer words, or pick a category.",

  "card.updates": (p: { count: number }) => plural(p.count, "update", "updates"),
  "card.updatesInWindow": (p: { count: number; days: number }) =>
    `${plural(p.count, "update", "updates")} in ${p.days} days`,
  "card.strip": (p: { active: number; days: number }) => `Updated on ${p.active} of the last ${p.days} days`,
  "card.paused": "Paused",
  "card.byline": (p: { name: string; role: string }) => `, ${p.role.charAt(0).toLowerCase()}${p.role.slice(1)}`,
  "more.button": "Show me more",

  "feed.title": "Just posted",
  "feed.reactions": (p: { hearts: number; replies: number }) =>
    `${plural(p.hearts, "like", "likes")}, ${plural(p.replies, "reply", "replies")}`,
  "feed.all": "See every update",
  "feed.hub":
    "Everything here leads back to Hamster Hub. We check the work and the team before it goes up, and we write down how each project makes money.",
  "feed.hubLink": "Read how we pick",

  "trust.title": "Why you can trust what's on the shelf",
  "trust.lede":
    "We'd rather show ten projects we can stand behind than a hundred we can't. So there are a few rules.",
  "trust.cta": "Read the full checklist",
  "trust.rule1.title": "Someone here has checked it.",
  "trust.rule1.body":
    "Before a project goes up, Hamster Hub looks at the work and the team behind it. The checklist is public, so you can read exactly what we look for.",
  "trust.rule2.title": "The money part is written down.",
  "trust.rule2.body":
    "Each project says how it earns, who owns what, and whether it's raising. No digging through a pitch deck.",
  "trust.rule3.title": "You can watch it move.",
  "trust.rule3.body":
    "Projects post updates as they go. If one goes quiet, we mark it as paused instead of leaving it up looking fresh.",
  "trust.rule4.title": "It all leads back to us.",
  "trust.rule4.body":
    "Every project lists what Hamster Hub put in: people, money, or time. If it does well, you'll know where it came from.",

  "voices.title": "People who've tried things here",
  "voices.lede":
    "Players, customers, and a few investors. We only quote people who said we could use their name.",

  "makers.title": "Work at Hamster Hub? Put it on the shelf.",
  "makers.body":
    "Post what you're building, then keep posting. A short update every week or two does more than one big launch a year, and it moves you up the shelf.",
  "makers.link": "See what a good update looks like",

  "foot.label": "Footer",
  "foot.run": "Hamster Nest is run by Hamster Hub.",
  "foot.howWePick": "How we pick",
  "foot.ranking": "How ranking works",
  "foot.investors": "For investors",
  "foot.contact": "Get in touch",
  "foot.note": "Design draft · projects, names and numbers are placeholders",

  "contact.title": (p: { name: string }) => `Write to ${p.name}`,
  "contact.name": "Your name",
  "contact.reach": (p: { name: string }) => `Where can ${p.name} reach you?`,
  "contact.reachPlaceholder": "an email is fine",
  "contact.reason": "What brings you here?",
  "contact.reason.play": "I'd like to play it",
  "contact.reason.invest": "I might invest",
  "contact.reason.collaborate": "I'd like to work together",
  "contact.reason.hello": "Just saying hi",
  "contact.body": "What's on your mind?",
  "contact.bodyPlaceholder": "A couple of lines is plenty.",
  "contact.copyNote": "Hamster Hub gets a copy too, so nothing gets lost.",
  "contact.send": "Send it over",
  "contact.sending": "Sending…",
  "contact.sent": (p: { name: string }) => `Sent. ${p.name} usually writes back within a couple of days.`,
  "contact.close": "Close",
  "contact.error.badEmail": "That email doesn't look right. Mind checking it?",
  "contact.error.emptyMessage": "Looks like the message is empty. Even one line is fine.",
  "contact.error.sendFailed": "That didn't go through. Your message is still here, so try again in a moment.",

  /** "40 min ago", for cards and by-lines. */
  "time.long": (age: RelativeAge) => {
    switch (age.unit) {
      case "now":
        return "just now";
      case "minute":
        return `${age.count} min ago`;
      case "hour":
        return `${plural(age.count, "hr", "hrs")} ago`;
      case "yesterday":
        return "yesterday";
      case "day":
        return `${age.count} days ago`;
    }
  },
  /** "40 min", for the feed, where space is tight. */
  "time.short": (age: RelativeAge) => {
    switch (age.unit) {
      case "now":
        return "Just now";
      case "minute":
        return `${age.count} min`;
      case "hour":
        return plural(age.count, "hr", "hrs");
      case "yesterday":
        return "Yesterday";
      case "day":
        return `${age.count} days`;
    }
  },
  /** "2 hrs ago", at the start of a sentence. */
  "time.sentence": (age: RelativeAge) => {
    switch (age.unit) {
      case "now":
        return "Just now";
      case "minute":
        return `${age.count} min ago`;
      case "hour":
        return `${plural(age.count, "hr", "hrs")} ago`;
      case "yesterday":
        return "Yesterday";
      case "day":
        return `${age.count} days ago`;
    }
  },
};

export type Messages = typeof en;
export type MessageKey = keyof Messages;
