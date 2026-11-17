import type { RelativeAge } from "./RelativeAge";

const plural = (count: number, one: string, many: string) => `${count} ${count === 1 ? one : many}`;
const DAY_WORDS: Readonly<Record<number, string>> = { 1: "a day", 2: "two days", 3: "three days", 7: "a week" };
const dayWords = (days: number) => DAY_WORDS[days] ?? `${days} days`;

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
  "skip.main": "Skip to the main content",
  "nav.label": "Main",
  "nav.browse": "Browse",
  "nav.makers": "Makers",
  "nav.investors": "For investors",
  "nav.howWePick": "How we pick",
  "nav.post": "Post your work",
  "lang.label": "Language",
  "theme.night": "Night theme",

  "hero.title.lead": "Work that's",
  "hero.title.accent": "still moving.",
  "hero.highlights": "Highlights · picked from this week's busiest",
  "hero.reel.label": "Highlighted projects",
  "hero.look": "Take a look",
  "hero.prev": "Previous project",
  "hero.next": "Next project",

  "browse.title": "Browse",
  "browse.sub": (p: { count: number }) => `${plural(p.count, "project", "projects")}. Search, or pick a category.`,
  "browse.busy": "Busy lately:",
  "search.label": "What are you looking for?",
  "search.placeholder": "Try “co-op roguelike” or “soil sensor”",
  "search.submit": "Have a look",
  "search.hint": "Press / to search",

  "donut.aria": (p: { updates: number; days: number; today: number; open: number; building: number; paused: number }) =>
    `${plural(p.updates, "update", "updates")} in the last ${p.days} days. ${plural(p.today, "project", "projects")} posted something today, ${p.open} more are looking for investors, ${p.building} are heads down building, and ${p.paused} are taking a break.`,
  "donut.caption": "updates this month",
  "donut.today": "posted something today",
  "donut.open": "looking for investors",
  "donut.building": "heads down, building",
  "donut.paused": "taking a break",

  "note.who": (p: { role: string; years: number; projects: number }) =>
    `${p.role} · ${plural(p.years, "year", "years")} at Hamster Hub · ${plural(p.projects, "project", "projects")}`,
  "note.last": (p: { ago: string; project: string; what: string }) => `${p.ago}: ${p.project} ${p.what}`,
  "note.cta": (p: { name: string }) => `Say hi to ${p.name}`,
  "note.behind": "The maker behind it",
  "note.also": (p: { names: string[]; more: number }) => {
    const list =
      p.more > 0
        ? `${p.names.join(", ")} and ${p.more} more`
        : p.names.length > 1
          ? `${p.names.slice(0, -1).join(", ")} and ${p.names.at(-1)}`
          : p.names[0];
    return `Also building: ${list}`;
  },

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

  "page.project.title": (p: { name: string }) => `${p.name} — Hamster Nest`,
  "page.maker.title": (p: { name: string }) => `${p.name} — Hamster Nest`,
  "crumb.label": "You are here",

  "project.status": (p: { count: number; days: number; ago: string }) =>
    `${plural(p.count, "update", "updates")} in ${p.days} days · last one ${p.ago}`,
  "project.quiet": "No updates yet",
  "project.position": (p: { n: number }) => `No. ${p.n} this week`,
  "project.demo": "Try the demo",
  "project.follow": "Tell me when this updates",
  "project.following": "You'll hear when this updates",
  "project.followers": (p: { count: number }) => `${p.count} ${p.count === 1 ? "person follows" : "people follow"} this`,
  "stream.title": "What's been happening",
  "stream.filter": "Show updates of one kind",
  "stream.all": (p: { count: number }) => `All ${p.count}`,
  "stream.replies": (p: { count: number }): string => (p.count === 1 ? "reply" : "replies"),
  "stream.readReply": "Read and reply",
  "stream.older": (p: { count: number }) => `Show ${p.count} older ${p.count === 1 ? "update" : "updates"}`,
  "money.title": "The money part",
  "money.lead": "Written by the maker, checked by Hamster Hub. If a number changes, it shows up in the updates.",
  "money.earns": "How it earns",
  "money.owners": "Who owns what",
  "money.raising": "Is it raising?",
  "money.raisingYes": (p: { amount: string; purpose: string }) => `Yes. **${p.amount}** ${p.purpose}`,
  "money.raisingNo": "Not right now.",
  "money.spent": "Spent so far",
  "money.earned": "Earned so far",
  "money.checked": (p: { date: string }) => `Checked by Hamster Hub on ${p.date}.`,
  "money.breakdown": "See the full breakdown",
  "hub.title": "Hamster Hub's part in this",
  "hub.what": "What we check before a project goes up",
  "tried.title": "Who's tried it",
  "tried.lead": "People who played it, used it, or put money in, and said we could name them.",
  "maker.madeBy": "Made by",
  "maker.roleYears": (p: { role: string; years: number }) => `${p.role} · ${plural(p.years, "year", "years")} at Hamster Hub`,
  "maker.replyShort": (p: { days: number }) => `Usually writes back within ${dayWords(p.days)}`,
  "maker.more": (p: { name: string }) => `More about ${p.name}`,
  "facts.title": "The basics",
  "facts.category": "Category",
  "facts.genre": "Genre",
  "facts.stage": "How far along",
  "facts.started": "Started",
  "facts.platforms": "Runs on",
  "facts.team": "Team",

  "profile.role": (p: { role: string; year: number }) => `Maker · ${p.role} · At Hamster Hub since ${p.year}`,
  "profile.talk": "Things I'm happy to talk about",
  "profile.topicPrefill": (p: { topic: string }) => `About “${p.topic}”: `,
  "profile.portrait": "Photo goes here",
  "profile.numbers": "In numbers",
  "profile.projects": (p: { count: number }): string => (p.count === 1 ? "project" : "projects"),
  "profile.updates": (p: { days: number }) => `updates in ${p.days} days`,
  "profile.awardsCount": (p: { count: number }): string => (p.count === 1 ? "award" : "awards"),
  "profile.latest": (p: { name: string }) => `Latest from ${p.name}`,
  "profile.readUpdate": "Read the update",
  "profile.posted": (p: { active: number; days: number }) => `Posted on ${p.active} of the last ${p.days} days`,
  "profile.made": (p: { name: string }) => `What ${p.name}'s made`,
  "profile.earlier": "Earlier",
  "profile.status.building": "Working on it now",
  "profile.status.live": "Out now, still patched",
  "profile.status.paused": "Taking a break",
  "profile.story": "How I got here",
  "profile.awards": "Awards and mentions",
  "profile.ask": (p: { name: string }) => `Got a question for ${p.name}? Ask it.`,
  "profile.askBody": "A couple of lines is plenty. Hamster Hub gets a copy too, so nothing gets lost.",
  "language.th": "Thai",
  "language.en": "English",
  "language.ja": "Japanese",
  "language.zh": "Chinese",

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
      case "week":
        return `${plural(age.count, "week", "weeks")} ago`;
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
      case "week":
        return plural(age.count, "wk", "wks");
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
      case "week":
        return `${plural(age.count, "week", "weeks")} ago`;
    }
  },
  // ---- v2: home and rooms ----
  "nav.about": "About Hamster Hub",
  "skip.rooms": "Skip to the four rooms",
  "say.title.first": "“High schoolers",
  "say.title.second": "can do all this!?”",
  "say.lede":
    "They can, and they did. Everything on Hamster Nest was made by students at Hamster Hub, and they're still working on it. Look around, then say hi to whoever made the thing you like.",

  "best.label": "The best project from each room",
  "best.of": (p: { room: string }) => `Best of ${p.room}`,
  "best.newToday": (p: { room: string }) => `New today in ${p.room}`,
  "best.in": (p: { room: string }) => `Best of ${p.room} right now`,
  "best.news": (p: { title: string; blurb: string }) => `${p.title}. ${p.blurb}`,
  "best.see": "See the project",
  "best.by": (p: { name: string }) => `by ${p.name}`,

  "rooms.title": "Four rooms",
  "rooms.lede": "Each kind of work has its own room. Walk into one to see everything in it.",
  "room.game.line": "Things you can play right now.",
  "room.game.all": "See all games",
  "room.game.lede": "Things you can play right now, made by students at Hamster Hub.",
  "room.game.search": "Search games, makers or tags",
  "room.game.everything": "All games",
  "room.game.postTitle": "Made a game at Hamster Hub?",
  "room.game.postBody": "If people can play it, it belongs in this room.",
  "room.game.postCta": "Post your game",
  "room.iot.line": "Gadgets that sense, count and switch things on.",
  "room.iot.all": "See all IoT",
  "room.iot.lede": "Gadgets that sense, count and switch things on, built and tested by students.",
  "room.iot.search": "Search gadgets, makers or tags",
  "room.iot.everything": "All IoT",
  "room.iot.postTitle": "Built a gadget at Hamster Hub?",
  "room.iot.postBody": "If it's out of the box and running, it belongs in this room.",
  "room.iot.postCta": "Post your gadget",
  "room.web.line": "Sites and tools people already use.",
  "room.web.all": "See all web",
  "room.web.lede": "Sites and tools people already use, made by students at Hamster Hub.",
  "room.web.search": "Search sites, makers or tags",
  "room.web.everything": "All web",
  "room.web.postTitle": "Shipped a site at Hamster Hub?",
  "room.web.postBody": "If people can open it and use it, it belongs in this room.",
  "room.web.postCta": "Post your site",
  "room.idea.line": "Plans looking for their first believer.",
  "room.idea.all": "See all ideas",
  "room.idea.lede": "Plans looking for their first believer.",
  "room.idea.search": "Search ideas, makers or tags",
  "room.idea.everything": "All ideas",
  "room.idea.postTitle": "Got an idea at Hamster Hub?",
  "room.idea.postBody": "If you can explain it and you've started testing it, it belongs in this room.",
  "room.idea.postCta": "Post your idea",
  "room.filters": "Narrow this room down",
  "room.demo": "Has a demo",
  "room.sort": "Recently updated first",
  "room.side.stage": "Stage",
  "room.side.investors": "For investors",
  "room.week": "Updated in the last 7 days",
  "room.clear": "Clear filters",
  "room.flow.title": "Flowing strongest this week",
  "room.flow.sub": "The projects that post updates most often come first.",
  "room.flow.rank": (p: { position: number }) => `No. ${p.position} this week`,
  "room.latest.title": "Latest updates",
  "room.latest.count": (p: { scope: string; count: number }) => `${p.scope}, ${plural(p.count, "project", "projects")}`,
  "room.empty": "Nothing in this room matches that yet. Try fewer words or clear the filters.",
  "page.room.title": (p: { room: string }) => `${p.room} | Hamster Nest`,

  "progress.title": "Before and now",
  "progress.lede": "Makers post a new photo whenever something changes. Yellow means it changed today.",
  "progress.before": "Before",
  "when.today": "Today",
  "when.yesterday": "Yesterday",
  "when.thisWeek": "This week",
  "when.thisMonth": "This month",
  "when.earlier": "A while ago",

  "about.title": "Who's behind this",
  "about.lede": "Hamster Hub is a technology community for students. Hamster Nest is where their best work goes on show.",
  "about.cta": "Read how we pick projects",
  "post.title.first": "At Hamster Hub?",
  "post.title.second": "Put your work up.",
  "post.body": "Post what you're building, then keep adding photos as it changes.",
  "foot.hub": "A technology community",
  "foot.contacts": "Facebook, Instagram, phone",
  "foot.placeholders": "Projects, names and quotes on this site are placeholders.",
};

export type Messages = typeof en;
export type MessageKey = keyof Messages;
