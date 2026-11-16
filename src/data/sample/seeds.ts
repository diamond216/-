import type { AvatarTone, CategoryId, StageId, UpdateTypeId } from "@/domain";

/**
 * Placeholder content for the prototype. Every project, person, number and quote
 * here is made up. Times are stored as "how long ago", so the shelf always looks
 * like it was touched today, whenever you open it.
 */

export interface Bilingual {
  en: string;
  th: string;
}

export interface MakerSeed {
  id: string;
  name: string;
  nickname: Bilingual;
  role: Bilingual;
  motto: Bilingual;
  initials: string;
  tone: AvatarTone;
}

export interface UpdateSeed {
  /** Minutes before "now". */
  minutesAgo: number;
  type: UpdateTypeId;
  summary: Bilingual;
  note?: Bilingual;
  hearts: number;
  replies: number;
}

/** An older update: [days ago, type]. Its wording comes from a template for that type. */
export type HistorySeed = readonly [daysAgo: number, type: UpdateTypeId];

export interface ProjectSeed {
  id: string;
  name: string;
  category: CategoryId;
  genres: readonly string[];
  tags: readonly string[];
  stage: StageId;
  blurb: Bilingual;
  maker: string;
  openToInvestment?: boolean;
  demoUrl?: string;
  followers: number;
  quality: number;
  trust: number;
  coverColor: string;
  paused?: boolean;
  latest: UpdateSeed;
  history: readonly HistorySeed[];
}

export interface EndorsementSeed {
  id: string;
  kind: "played" | "used" | "invested" | "colleague";
  makerId?: string;
  quote: Bilingual;
  author: Bilingual;
  authorRole: Bilingual;
  projectId?: string;
  namedWithConsent: boolean;
}

const HOUR = 60;
const DAY = 24 * HOUR;

export const makerSeeds: readonly MakerSeed[] = [
  {
    id: "pim",
    name: "Pim",
    nickname: { en: "Pim", th: "พิม" },
    role: { en: "Game designer", th: "นักออกแบบเกม" },
    motto: {
      en: "A good game is one people can't help telling their friends about.",
      th: "เกมที่ดี คือเกมที่คนเล่นแล้วอยากเอาไปเล่าต่อ",
    },
    initials: "P",
    tone: "clay",
  },
  {
    id: "mind",
    name: "Mind",
    nickname: { en: "Mind", th: "มายด์" },
    role: { en: "Hardware engineer", th: "วิศวกรฮาร์ดแวร์" },
    motto: {
      en: "If it can't get through a rainy season, it isn't finished.",
      th: "ถ้ายังไม่รอดหน้าฝน ก็ยังไม่เรียกว่าเสร็จ",
    },
    initials: "M",
    tone: "moss",
  },
  {
    id: "tonkla",
    name: "Tonkla",
    nickname: { en: "Tonkla", th: "ต้นกล้า" },
    role: { en: "Web developer", th: "นักพัฒนาเว็บ" },
    motto: {
      en: "I'd rather ship something small on Friday than something big never.",
      th: "ส่งของเล็ก ๆ ทุกวันศุกร์ ดีกว่ารอของใหญ่ที่ไม่มีวันเสร็จ",
    },
    initials: "T",
    tone: "sand",
  },
  {
    id: "fahsai",
    name: "Fahsai",
    nickname: { en: "Fahsai", th: "ฟ้าใส" },
    role: { en: "Product designer", th: "นักออกแบบผลิตภัณฑ์" },
    motto: {
      en: "If my mum can't use it, I'm not done.",
      th: "ถ้าแม่ยังใช้ไม่เป็น แปลว่างานยังไม่จบ",
    },
    initials: "F",
    tone: "plum",
  },
  {
    id: "phoom",
    name: "Phoom",
    nickname: { en: "Phoom", th: "ภูมิ" },
    role: { en: "Analyst", th: "นักวิเคราะห์" },
    motto: {
      en: "Most ideas get better when you show them early.",
      th: "ไอเดียส่วนใหญ่ดีขึ้น เมื่อเอาออกมาให้คนอื่นดูตั้งแต่เนิ่น ๆ",
    },
    initials: "Ph",
    tone: "sand",
  },
];

/** Wording for older updates, by type. Reads as the rest of a sentence after the project's name. */
export const historyTemplates: Readonly<Record<UpdateTypeId, Bilingual>> = {
  release: { en: "shipped a new version.", th: "ปล่อยเวอร์ชันใหม่" },
  feature: { en: "added something people asked for.", th: "เพิ่มของที่มีคนขอเข้ามา" },
  milestone: { en: "reached a small milestone.", th: "ไปถึงอีกก้าวหนึ่ง" },
  demo: { en: "put up a new demo.", th: "ลงเดโมตัวใหม่" },
  "field-test": { en: "took it out for a field test.", th: "เอาออกไปทดสอบหน้างาน" },
  devlog: { en: "wrote about what changed this week.", th: "เขียนเล่าว่าสัปดาห์นี้มีอะไรเปลี่ยนไปบ้าง" },
  media: { en: "posted new screenshots.", th: "ลงภาพชุดใหม่" },
  patch: { en: "fixed a handful of small things.", th: "แก้จุดเล็ก ๆ น้อย ๆ ไปหลายจุด" },
};

export const projectSeeds: readonly ProjectSeed[] = [
  {
    id: "wheelsense",
    name: "WheelSense",
    category: "iot",
    genres: ["smart-farm"],
    tags: ["SmartFarm", "Sensor"],
    stage: "beta",
    blurb: {
      en: "A cheap wireless soil sensor for small farms. Runs for months on one battery.",
      th: "เซนเซอร์วัดความชื้นดินแบบไร้สาย ราคาไม่แรง สำหรับฟาร์มเล็ก ๆ ใช้ถ่านก้อนเดียวอยู่ได้หลายเดือน",
    },
    maker: "mind",
    followers: 264,
    quality: 0.86,
    trust: 0.9,
    coverColor: "#2f5d50",
    latest: {
      minutesAgo: 40,
      type: "release",
      summary: {
        en: "shipped firmware 0.9. The battery lasts longer now.",
        th: "ปล่อยเฟิร์มแวร์ 0.9 แบตอยู่ได้นานขึ้น",
      },
      hearts: 12,
      replies: 3,
    },
    history: [
      [1, "devlog"], [2, "patch"], [4, "field-test"], [5, "devlog"], [7, "feature"], [9, "patch"], [11, "devlog"],
      [13, "media"], [15, "field-test"], [18, "release"], [21, "devlog"], [24, "patch"], [27, "devlog"],
    ],
  },
  {
    id: "nestboard",
    name: "NestBoard",
    category: "web",
    genres: ["saas"],
    tags: ["SaaS", "Reports"],
    stage: "live",
    blurb: {
      en: "Reports for small teams who don't have an analyst.",
      th: "รายงานผลงานสำหรับทีมเล็กที่ไม่มีนักวิเคราะห์ข้อมูล",
    },
    maker: "tonkla",
    demoUrl: "#",
    followers: 301,
    quality: 0.82,
    trust: 0.84,
    coverColor: "#c9553a",
    latest: {
      minutesAgo: 1 * HOUR,
      type: "feature",
      summary: { en: "added a report page for investors.", th: "เพิ่มหน้ารายงานสำหรับนักลงทุน" },
      hearts: 7,
      replies: 2,
    },
    history: [
      [1, "patch"], [3, "devlog"], [4, "patch"], [6, "release"], [8, "devlog"], [10, "patch"], [13, "feature"],
      [16, "devlog"], [19, "patch"], [23, "devlog"], [27, "release"],
    ],
  },
  {
    id: "burrow-knights",
    name: "Burrow Knights",
    category: "game",
    genres: ["roguelike", "co-op"],
    tags: ["Roguelike", "Coop", "PixelArt"],
    stage: "beta",
    blurb: {
      en: "Dig, fight, and get lost underground with a friend.",
      th: "ขุด สู้ แล้วหลงทางใต้ดินไปกับเพื่อนอีกคน",
    },
    maker: "pim",
    openToInvestment: true,
    demoUrl: "#",
    followers: 214,
    quality: 0.84,
    trust: 0.8,
    coverColor: "#d39a2f",
    latest: {
      minutesAgo: 25,
      type: "demo",
      summary: { en: "has a two-player demo you can try.", th: "มีเดโมเล่นสองคนให้ลองแล้ว" },
      note: { en: "got a two-player demo.", th: "มีเดโมเล่นสองคนให้ลองแล้ว" },
      hearts: 31,
      replies: 9,
    },
    // The posts at 4, 9 and 14 days are written out in projectDetails.ts.
    history: [[17, "demo"], [19, "devlog"], [21, "patch"], [23, "devlog"], [25, "patch"], [27, "devlog"], [29, "patch"]],
  },
  {
    id: "pawprint",
    name: "Pawprint",
    category: "web",
    genres: ["ecommerce"],
    tags: ["Ecommerce", "Pets"],
    stage: "beta",
    blurb: {
      en: "An online shop kit for neighbourhood pet stores.",
      th: "ชุดเปิดร้านออนไลน์สำหรับร้านสัตว์เลี้ยงใกล้บ้าน",
    },
    maker: "fahsai",
    demoUrl: "#",
    followers: 173,
    quality: 0.74,
    trust: 0.72,
    coverColor: "#b9785a",
    latest: {
      minutesAgo: 3 * HOUR,
      type: "field-test",
      summary: {
        en: "started testing payments with its first shops.",
        th: "เริ่มทดสอบระบบจ่ายเงินกับร้านกลุ่มแรก",
      },
      hearts: 5,
      replies: 1,
    },
    history: [
      [2, "devlog"], [5, "feature"], [8, "patch"], [11, "devlog"], [14, "patch"], [18, "devlog"], [22, "feature"],
      [26, "devlog"],
    ],
  },
  {
    id: "seed-dash",
    name: "Seed Dash",
    category: "game",
    genres: ["casual"],
    tags: ["Casual", "Mobile"],
    stage: "live",
    blurb: {
      en: "Grab the sunflower seeds before the sun goes down.",
      th: "เก็บเมล็ดทานตะวันให้ทันก่อนพระอาทิตย์ตก",
    },
    maker: "pim",
    demoUrl: "#",
    followers: 388,
    quality: 0.78,
    trust: 0.74,
    coverColor: "#c9553a",
    latest: {
      minutesAgo: 5 * HOUR,
      type: "patch",
      summary: {
        en: "rebalanced levels 3 to 5 after players said they were too hard.",
        th: "ปรับด่าน 3 ถึง 5 ใหม่ หลังผู้เล่นบอกว่ายากเกินไป",
      },
      hearts: 9,
      replies: 4,
    },
    history: [
      [3, "devlog"], [6, "devlog"], [9, "release"], [12, "feature"], [15, "media"], [19, "patch"], [23, "devlog"],
      [27, "patch"],
    ],
  },
  {
    id: "aquanode",
    name: "AquaNode",
    category: "iot",
    genres: ["water"],
    tags: ["Water", "Sensor"],
    stage: "prototype",
    blurb: {
      en: "Tells shrimp farmers when the pond water turns.",
      th: "บอกคนเลี้ยงกุ้งให้รู้ทันทีเมื่อน้ำในบ่อเริ่มเสีย",
    },
    maker: "mind",
    openToInvestment: true,
    followers: 121,
    quality: 0.72,
    trust: 0.7,
    coverColor: "#3d5a6c",
    latest: {
      minutesAgo: 26 * HOUR,
      type: "field-test",
      summary: {
        en: "put its first prototypes in a real pond.",
        th: "เอาเครื่องต้นแบบชุดแรกไปติดตั้งในบ่อจริง",
      },
      hearts: 14,
      replies: 6,
    },
    history: [[4, "devlog"], [7, "media"], [10, "devlog"], [14, "feature"], [18, "devlog"], [22, "patch"], [26, "devlog"]],
  },
  {
    id: "sunflower-bank",
    name: "Sunflower Bank",
    category: "idea",
    genres: ["fintech"],
    tags: ["FinTech", "Savings"],
    stage: "concept",
    blurb: {
      en: "Group savings for freelancers with uneven income.",
      th: "ออมเงินเป็นกลุ่มสำหรับฟรีแลนซ์ที่รายได้ไม่แน่นอน",
    },
    maker: "phoom",
    openToInvestment: true,
    followers: 88,
    quality: 0.68,
    trust: 0.66,
    coverColor: "#d39a2f",
    latest: {
      minutesAgo: 30 * HOUR,
      type: "devlog",
      summary: {
        en: "wrote up what twelve freelancers said about saving in a group.",
        th: "สรุปสิ่งที่ฟรีแลนซ์สิบสองคนเล่าเรื่องการออมเงินเป็นกลุ่ม",
      },
      hearts: 6,
      replies: 2,
    },
    history: [[5, "devlog"], [10, "media"], [15, "devlog"], [20, "feature"], [26, "devlog"]],
  },
  {
    id: "moonwheel",
    name: "Moonwheel",
    category: "game",
    genres: ["puzzle"],
    tags: ["Puzzle", "Cozy"],
    stage: "prototype",
    blurb: {
      en: "Turn the moon, line up the light, finish before dawn.",
      th: "หมุนพระจันทร์ เรียงแสงให้ครบก่อนฟ้าสาง",
    },
    maker: "fahsai",
    demoUrl: "#",
    followers: 158,
    quality: 0.66,
    trust: 0.62,
    coverColor: "#4a5b4a",
    latest: {
      minutesAgo: 2 * DAY + 2 * HOUR,
      type: "demo",
      summary: {
        en: "put up a three-level demo. It runs in the browser.",
        th: "ลงเดโมสามด่านแรก เล่นบนเบราว์เซอร์ได้เลย",
      },
      hearts: 11,
      replies: 3,
    },
    history: [[6, "devlog"], [11, "media"], [16, "devlog"], [21, "patch"], [27, "devlog"]],
  },
  {
    id: "kernel-docs",
    name: "Kernel Docs",
    category: "web",
    genres: ["dev-tool"],
    tags: ["DevTool", "API"],
    stage: "live",
    blurb: {
      en: "Writes your API docs from the code you already have.",
      th: "เขียนเอกสาร API จากโค้ดที่คุณมีอยู่แล้ว",
    },
    maker: "tonkla",
    demoUrl: "#",
    followers: 240,
    quality: 0.7,
    trust: 0.68,
    coverColor: "#2f5d50",
    latest: {
      minutesAgo: 2 * DAY + 7 * HOUR,
      type: "patch",
      summary: {
        en: "fixed the broken links in generated pages.",
        th: "แก้ลิงก์เสียในหน้าเอกสารที่สร้างอัตโนมัติ",
      },
      hearts: 4,
      replies: 1,
    },
    history: [[8, "release"], [14, "patch"], [20, "devlog"], [26, "patch"]],
  },
  {
    id: "tunnel-tales",
    name: "Tunnel Tales",
    category: "game",
    genres: ["roguelike"],
    tags: ["Roguelike", "Story"],
    stage: "prototype",
    blurb: {
      en: "A story roguelike where every run redraws the map.",
      th: "roguelike เล่าเรื่อง ที่แผนที่เปลี่ยนใหม่ทุกครั้งที่เริ่มเล่น",
    },
    maker: "pim",
    followers: 74,
    quality: 0.6,
    trust: 0.58,
    coverColor: "#3d5a6c",
    latest: {
      minutesAgo: 3 * DAY + 3 * HOUR,
      type: "devlog",
      summary: {
        en: "showed how the map generator picks its dead ends.",
        th: "เล่าให้ฟังว่าตัวสร้างแผนที่เลือกทางตันยังไง",
      },
      hearts: 8,
      replies: 2,
    },
    history: [[9, "media"], [16, "devlog"], [25, "devlog"]],
  },
  {
    id: "cheek-pouch",
    name: "Cheek Pouch",
    category: "game",
    genres: ["casual", "co-op"],
    tags: ["Party", "Coop"],
    stage: "beta",
    blurb: {
      en: "A party game about stuffing your cheeks faster than your friends.",
      th: "เกมปาร์ตี้ แข่งกันตุนของใส่แก้มให้ไวกว่าเพื่อน",
    },
    maker: "pim",
    demoUrl: "#",
    followers: 96,
    quality: 0.58,
    trust: 0.56,
    coverColor: "#b9785a",
    latest: {
      minutesAgo: 3 * DAY + 9 * HOUR,
      type: "patch",
      summary: {
        en: "made round two shorter. Playtesters kept quitting halfway.",
        th: "ปรับรอบสองให้สั้นลง เพราะคนทดสอบเลิกเล่นกลางทางกันบ่อย",
      },
      hearts: 6,
      replies: 2,
    },
    history: [[7, "devlog"], [13, "demo"], [22, "devlog"]],
  },
  {
    id: "hayloft",
    name: "Hayloft",
    category: "web",
    genres: ["saas"],
    tags: ["SaaS", "Scheduling"],
    stage: "beta",
    blurb: {
      en: "Shift planning for cafés with more part-timers than tables.",
      th: "จัดตารางกะสำหรับคาเฟ่ที่มีพาร์ตไทม์มากกว่าโต๊ะ",
    },
    maker: "tonkla",
    openToInvestment: true,
    followers: 61,
    quality: 0.56,
    trust: 0.56,
    coverColor: "#d39a2f",
    latest: {
      minutesAgo: 4 * DAY + 2 * HOUR,
      type: "feature",
      summary: { en: "can now swap shifts from a phone.", th: "สลับกะจากมือถือได้แล้ว" },
      hearts: 5,
      replies: 1,
    },
    history: [[12, "devlog"], [21, "patch"]],
  },
  {
    id: "coop-watch",
    name: "Coop Watch",
    category: "iot",
    genres: ["smart-farm"],
    tags: ["SmartFarm", "Poultry"],
    stage: "prototype",
    blurb: {
      en: "Counts the hens back in at night and texts you if one's missing.",
      th: "นับไก่เข้าเล้าตอนค่ำ ถ้าหายไปสักตัวจะส่งข้อความบอก",
    },
    maker: "mind",
    openToInvestment: true,
    followers: 47,
    quality: 0.54,
    trust: 0.54,
    coverColor: "#c9553a",
    latest: {
      minutesAgo: 4 * DAY + 8 * HOUR,
      type: "field-test",
      summary: {
        en: "counted 40 hens right for a week straight.",
        th: "นับไก่ 40 ตัวได้ถูกติดกันทั้งสัปดาห์",
      },
      hearts: 9,
      replies: 3,
    },
    history: [[11, "devlog"], [19, "media"]],
  },
  {
    id: "pocket-grant",
    name: "Pocket Grant",
    category: "idea",
    genres: ["fintech"],
    tags: ["FinTech", "Students"],
    stage: "concept",
    blurb: {
      en: "Small grants for student projects, paid out within a week.",
      th: "ทุนก้อนเล็กสำหรับโปรเจกต์นักศึกษา อนุมัติและจ่ายภายในหนึ่งสัปดาห์",
    },
    maker: "phoom",
    openToInvestment: true,
    followers: 35,
    quality: 0.52,
    trust: 0.5,
    coverColor: "#2f5d50",
    latest: {
      minutesAgo: 6 * DAY + 4 * HOUR,
      type: "devlog",
      summary: {
        en: "talked to two universities about a pilot.",
        th: "คุยกับมหาวิทยาลัยสองแห่งเรื่องโครงการนำร่อง",
      },
      hearts: 4,
      replies: 1,
    },
    history: [[17, "devlog"]],
  },
  {
    id: "rice-route",
    name: "Rice Route",
    category: "idea",
    genres: ["logistics"],
    tags: ["Logistics", "Farming"],
    stage: "concept",
    blurb: {
      en: "Shared trucks for rice farmers who each have half a load.",
      th: "แชร์รถบรรทุกสำหรับชาวนาที่มีข้าวกันคนละครึ่งคัน",
    },
    maker: "phoom",
    openToInvestment: true,
    followers: 22,
    quality: 0.5,
    trust: 0.48,
    coverColor: "#4a5b4a",
    latest: {
      minutesAgo: 9 * DAY + 5 * HOUR,
      type: "devlog",
      summary: { en: "mapped the routes for one district.", th: "ทำแผนที่เส้นทางของอำเภอแรกเสร็จแล้ว" },
      hearts: 3,
      replies: 0,
    },
    history: [[24, "media"]],
  },
  {
    id: "night-wheel",
    name: "Night Wheel",
    category: "iot",
    genres: ["wearable"],
    tags: ["Wearable", "Pets"],
    stage: "prototype",
    blurb: {
      en: "A step counter for hamsters. Yes, really.",
      th: "เครื่องนับก้าวสำหรับแฮมสเตอร์ ใช่ เรื่องจริง",
    },
    maker: "mind",
    followers: 29,
    quality: 0.5,
    trust: 0.5,
    coverColor: "#b9785a",
    paused: true,
    latest: {
      minutesAgo: 47 * DAY,
      type: "devlog",
      summary: {
        en: "is paused while Mind works on WheelSense.",
        th: "พักไว้ก่อน ระหว่างที่มายด์ทำ WheelSense",
      },
      hearts: 7,
      replies: 2,
    },
    history: [[60, "media"]],
  },
  {
    id: "second-shelf",
    name: "Second Shelf",
    category: "idea",
    genres: ["community"],
    tags: ["Community", "Sharing"],
    stage: "concept",
    blurb: {
      en: "A lending library for tools you only need twice a year.",
      th: "ห้องสมุดยืมเครื่องมือ สำหรับของที่ใช้แค่ปีละสองครั้ง",
    },
    maker: "fahsai",
    followers: 18,
    quality: 0.48,
    trust: 0.46,
    coverColor: "#3d5a6c",
    paused: true,
    latest: {
      minutesAgo: 38 * DAY,
      type: "devlog",
      summary: {
        en: "is on hold until there's somewhere to keep the tools.",
        th: "พักไว้จนกว่าจะหาที่เก็บเครื่องมือได้",
      },
      hearts: 2,
      replies: 1,
    },
    history: [[52, "devlog"]],
  },
];

export const endorsementSeeds: readonly EndorsementSeed[] = [
  {
    id: "voice-publisher",
    kind: "played",
    quote: {
      en: "I played the Burrow Knights demo on a Friday and wrote to Pim on Monday. She'd already fixed the bug I found.",
      th: "ผมเล่นเดโม Burrow Knights วันศุกร์ แล้วเขียนไปหาพิมวันจันทร์ ปรากฏว่าบั๊กที่ผมเจอ เธอแก้ไปแล้ว",
    },
    author: { en: "Placeholder name", th: "ชื่อตัวอย่าง" },
    authorRole: { en: "indie publisher", th: "ผู้จัดจำหน่ายเกมอินดี้" },
    projectId: "burrow-knights",
    namedWithConsent: true,
  },
  {
    id: "voice-angel",
    kind: "invested",
    projectId: "burrow-knights",
    quote: {
      en: "The update log told me more than the pitch did.",
      th: "ประวัติอัปเดตบอกอะไรผมได้มากกว่าตัว pitch เสียอีก",
    },
    author: { en: "Placeholder name", th: "ชื่อตัวอย่าง" },
    authorRole: { en: "angel investor", th: "นักลงทุนอิสระ" },
    namedWithConsent: true,
  },
  {
    id: "voice-farmer",
    kind: "used",
    projectId: "wheelsense",
    quote: {
      en: "I stopped walking the rows at six every morning. The phone tells me which corner is dry.",
      th: "ผมเลิกเดินดูแปลงตอนหกโมงเช้าทุกวันแล้ว มือถือบอกเองว่ามุมไหนดินแห้ง",
    },
    author: { en: "Placeholder name", th: "ชื่อตัวอย่าง" },
    authorRole: { en: "durian farmer", th: "เจ้าของสวนทุเรียน" },
    namedWithConsent: true,
  },
  {
    id: "voice-team-lead",
    kind: "used",
    projectId: "nestboard",
    quote: {
      en: "Our Monday meeting got twenty minutes shorter. Nobody has to make the slides any more.",
      th: "ประชุมวันจันทร์สั้นลงยี่สิบนาที ไม่ต้องมีใครมานั่งทำสไลด์อีกแล้ว",
    },
    author: { en: "Placeholder name", th: "ชื่อตัวอย่าง" },
    authorRole: { en: "team lead at a logistics startup", th: "หัวหน้าทีมในสตาร์ทอัพขนส่ง" },
    namedWithConsent: true,
  },
  {
    id: "voice-player",
    kind: "played",
    projectId: "seed-dash",
    quote: {
      en: "I play it on the bus. Level four still beats me, but less often now.",
      th: "เล่นบนรถเมล์ประจำ ด่านสี่ยังแพ้อยู่ แต่แพ้น้อยลงแล้ว",
    },
    author: { en: "Placeholder name", th: "ชื่อตัวอย่าง" },
    authorRole: { en: "player", th: "ผู้เล่น" },
    namedWithConsent: true,
  },
  {
    id: "voice-shrimp",
    kind: "invested",
    projectId: "aquanode",
    quote: {
      en: "I lost a pond to bad water two years ago. I'd pay for this before it's finished.",
      th: "เมื่อสองปีก่อนผมเสียบ่อไปหนึ่งบ่อเพราะน้ำเสีย ของแบบนี้ผมยอมจ่ายตั้งแต่ยังทำไม่เสร็จ",
    },
    author: { en: "Placeholder name", th: "ชื่อตัวอย่าง" },
    authorRole: { en: "shrimp farmer and small investor", th: "คนเลี้ยงกุ้งและนักลงทุนรายย่อย" },
    namedWithConsent: true,
  },
  {
    id: "voice-anon",
    kind: "played",
    projectId: "moonwheel",
    quote: { en: "Lovely, but level three needs a hint.", th: "น่ารักมาก แต่ด่านสามควรมีคำใบ้" },
    author: { en: "Unnamed tester", th: "ผู้ทดสอบไม่ประสงค์ออกนาม" },
    authorRole: { en: "playtester", th: "ผู้ทดสอบ" },
    // Didn't agree to be named, so this one never shows.
    namedWithConsent: false,
  },
  {
    id: "voice-producer",
    kind: "colleague",
    makerId: "pim",
    quote: {
      en: "Pim sends a build every Friday whether it's ready or not. That's why her games get good.",
      th: "พิมส่งบิลด์ทุกวันศุกร์ ไม่ว่าจะพร้อมหรือไม่ นั่นแหละคือเหตุผลที่เกมของเธอออกมาดี",
    },
    author: { en: "Placeholder name", th: "ชื่อตัวอย่าง" },
    authorRole: { en: "producer at Hamster Hub", th: "โปรดิวเซอร์ที่ Hamster Hub" },
    namedWithConsent: true,
  },
  {
    id: "voice-ops",
    kind: "colleague",
    makerId: "mind",
    quote: {
      en: "Mind will drive three hours to see why one sensor went quiet. Usually it's a snail.",
      th: "มายด์ยอมขับรถสามชั่วโมงเพื่อไปดูว่าทำไมเซนเซอร์ตัวเดียวเงียบไป ส่วนใหญ่ก็เพราะหอยทาก",
    },
    author: { en: "Placeholder name", th: "ชื่อตัวอย่าง" },
    authorRole: { en: "operations at Hamster Hub", th: "ฝ่ายปฏิบัติการที่ Hamster Hub" },
    namedWithConsent: true,
  },
  {
    id: "voice-tonkla",
    kind: "colleague",
    makerId: "tonkla",
    quote: {
      en: "Ask Tonkla for a feature on Monday and you'll usually have a smaller, better one by Friday.",
      th: "ขอฟีเจอร์กับต้นกล้าวันจันทร์ ส่วนใหญ่วันศุกร์จะได้ของที่เล็กกว่าแต่ดีกว่ากลับมา",
    },
    author: { en: "Placeholder name", th: "ชื่อตัวอย่าง" },
    authorRole: { en: "finance at Hamster Hub", th: "ฝ่ายการเงินที่ Hamster Hub" },
    namedWithConsent: true,
  },
];
