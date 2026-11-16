import type { CategoryId, HubCheckId, PlatformId, UpdateTypeId } from "@/domain";
import type { Bilingual } from "./seeds";

/**
 * The longer content behind each project page. Placeholder, like everything else in
 * the sample data. Burrow Knights follows the approved draft word for word.
 */

export interface PostSeed {
  daysAgo: number;
  type: UpdateTypeId;
  title: Bilingual;
  body: Bilingual;
  summary: Bilingual;
  hearts: number;
  replies: number;
}

export interface LedgerSeed {
  /** Mark amounts with **double stars** so they stand out. */
  earns: Bilingual;
  owners: ReadonlyArray<readonly [holder: Bilingual, percent: number]>;
  raising: readonly [baht: number, purpose: Bilingual] | null;
  spent: readonly [baht: number, note: Bilingual];
  earned: readonly [baht: number, note: Bilingual];
  checkedDaysAgo: number;
}

export interface ProjectDetailSeed {
  /** Headline and paragraph for the newest update. */
  latest: { title: Bilingual; body: Bilingual; image?: boolean };
  /** Older posts written out in full. Anything else in the history uses the wording for its type. */
  posts?: readonly PostSeed[];
  screens?: ReadonlyArray<readonly [CategoryId, string]>;
  platforms: readonly PlatformId[];
  team: Bilingual;
  /** "YYYY-MM". */
  started: string;
  ledger?: LedgerSeed;
  hub?: { summary: Bilingual; checks: readonly Exclude<HubCheckId, "recent">[] };
}

const HUB: Bilingual = { en: "Hamster Hub", th: "Hamster Hub" };
const ALL_CHECKS = ["team", "build", "money"] as const;

export interface PostWording {
  title: Bilingual;
  body: Bilingual;
}

/** Extra wordings for the kinds of post that turn up most, so a stream doesn't repeat itself. */
export const postVariants: Readonly<Partial<Record<UpdateTypeId, readonly PostWording[]>>> = {
  patch: [
    {
      title: { en: "Fewer crashes on older phones", th: "แครชน้อยลงบนมือถือรุ่นเก่า" },
      body: {
        en: "Three people wrote in about the same crash. It's fixed, and the fix is in everyone's copy now.",
        th: "มีสามคนเขียนมาบอกเรื่องแครชเดียวกัน แก้แล้ว และทุกคนได้ตัวแก้ไปแล้ว",
      },
    },
    {
      title: { en: "Tidying up after the last release", th: "เก็บงานหลังออกเวอร์ชันล่าสุด" },
      body: {
        en: "Nothing new to see. A few labels were wrong and one button did the opposite of what it said.",
        th: "ไม่มีอะไรใหม่ให้ดู แค่ป้ายบางอันผิด และมีปุ่มหนึ่งที่ทำตรงข้ามกับที่เขียนไว้",
      },
    },
  ],
  devlog: [
    {
      title: { en: "What I'd do differently", th: "ถ้าเริ่มใหม่จะทำอะไรต่างไป" },
      body: {
        en: "Two weeks in the wrong direction, written down so I don't do it again.",
        th: "สองสัปดาห์ที่เดินผิดทาง จดไว้จะได้ไม่พลาดซ้ำ",
      },
    },
    {
      title: { en: "Notes from this week's testers", th: "บันทึกจากคนทดสอบสัปดาห์นี้" },
      body: {
        en: "Five people tried it. Here's what they got stuck on, and what I changed because of it.",
        th: "มีคนลองห้าคน มาเล่าว่าติดตรงไหนกันบ้าง และเปลี่ยนอะไรไปเพราะเรื่องนั้น",
      },
    },
  ],
};

/** What a title and paragraph say when nobody wrote one specially. */
export const postTemplates: Readonly<Record<UpdateTypeId, PostWording>> = {
  release: {
    title: { en: "A new version is out", th: "เวอร์ชันใหม่ออกแล้ว" },
    body: {
      en: "This one fixes the things people wrote in about most. The full list is in the notes.",
      th: "รอบนี้แก้เรื่องที่คนเขียนมาบอกบ่อยที่สุด รายละเอียดทั้งหมดอยู่ในบันทึก",
    },
  },
  feature: {
    title: { en: "Something people asked for", th: "ของที่มีคนขอมา" },
    body: {
      en: "A few of you asked for this, so it's in now. Tell us if it works the way you hoped.",
      th: "มีหลายคนขอเรื่องนี้มา ตอนนี้ใส่ให้แล้ว ลองใช้แล้วบอกหน่อยว่าตรงกับที่คิดไว้ไหม",
    },
  },
  milestone: {
    title: { en: "A small milestone", th: "ก้าวเล็ก ๆ อีกก้าว" },
    body: {
      en: "Not a big launch, but worth writing down. More on what's next soon.",
      th: "ไม่ใช่การเปิดตัวใหญ่ แต่ก็ควรจดไว้ เดี๋ยวจะมาเล่าต่อว่าจะทำอะไรต่อ",
    },
  },
  demo: {
    title: { en: "A new demo to try", th: "มีเดโมใหม่ให้ลอง" },
    body: {
      en: "There's a fresh build up. It's short, and some of it is rough. Tell us what breaks.",
      th: "ลงบิลด์ใหม่ไว้แล้ว สั้น ๆ และยังหยาบอยู่บ้าง เจออะไรพังบอกได้เลย",
    },
  },
  "field-test": {
    title: { en: "Out in the real world", th: "ออกไปลองของจริง" },
    body: {
      en: "We took it out of the office for a few days. Here's what held up and what didn't.",
      th: "เอาออกไปใช้นอกออฟฟิศอยู่หลายวัน มาเล่าว่าอะไรรอด อะไรไม่รอด",
    },
  },
  devlog: {
    title: { en: "What changed this week", th: "สัปดาห์นี้มีอะไรเปลี่ยน" },
    body: {
      en: "A short note on what got done, what got dropped, and why.",
      th: "เล่าสั้น ๆ ว่าทำอะไรเสร็จ ตัดอะไรทิ้ง และทำไม",
    },
  },
  media: {
    title: { en: "New pictures", th: "ภาพชุดใหม่" },
    body: {
      en: "A few new screenshots of where things are now.",
      th: "ภาพหน้าจอใหม่ไม่กี่ภาพ ให้เห็นว่าตอนนี้งานไปถึงไหนแล้ว",
    },
  },
  patch: {
    title: { en: "Small fixes", th: "แก้จุดเล็ก ๆ" },
    body: {
      en: "A handful of small fixes. Nothing new, just fewer things going wrong.",
      th: "แก้จุดเล็ก ๆ ไปหลายจุด ไม่มีอะไรใหม่ แค่พังน้อยลง",
    },
  },
};

export const projectDetails: Readonly<Record<string, ProjectDetailSeed>> = {
  "burrow-knights": {
    latest: {
      title: { en: "The two-player demo is up", th: "เดโมเล่นสองคนมาแล้ว" },
      body: {
        en: "You can dig with a friend now, on one keyboard or online. It's rough. The camera gets confused when you split up, and moles sometimes fall through the floor. Play it and tell me what breaks.",
        th: "ตอนนี้ขุดกับเพื่อนได้แล้ว จะเล่นคีย์บอร์ดเดียวกันหรือออนไลน์ก็ได้ ยังหยาบอยู่นะ กล้องจะงงเวลาแยกกันเดิน และบางทีตัวตุ่นก็ร่วงทะลุพื้น ลองเล่นแล้วบอกหน่อยว่าอะไรพัง",
      },
      image: true,
    },
    posts: [
      {
        daysAgo: 4,
        type: "devlog",
        title: { en: "Why I threw away the first cave generator", th: "ทำไมถึงทิ้งตัวสร้างถ้ำตัวแรก" },
        body: {
          en: "The old caves looked great in screenshots and were boring to walk through. Every tunnel led somewhere, so nothing felt like a find. The new one leaves dead ends on purpose.",
          th: "ถ้ำแบบเก่าถ่ายรูปออกมาสวย แต่เดินแล้วน่าเบื่อ ทุกอุโมงค์พาไปที่ไหนสักแห่งเสมอ เลยไม่มีอะไรให้รู้สึกว่าเจอของ ตัวใหม่จงใจเหลือทางตันไว้",
        },
        summary: { en: "explained why the first cave generator went in the bin.", th: "เล่าว่าทำไมตัวสร้างถ้ำตัวแรกถึงโดนทิ้ง" },
        hearts: 18,
        replies: 4,
      },
      {
        daysAgo: 9,
        type: "patch",
        title: { en: "0.4.2: moles hit less hard", th: "0.4.2: ตุ่นตีเบาลง" },
        body: {
          en: "Playtesters kept dying in the first two minutes. Mole damage is down by a third and you start with one more torch.",
          th: "คนทดสอบตายกันในสองนาทีแรกตลอด เลยลดแรงตีของตุ่นลงหนึ่งในสาม และให้คบเพลิงเพิ่มตอนเริ่มอีกหนึ่งอัน",
        },
        summary: { en: "made the moles hit less hard.", th: "ทำให้ตุ่นตีเบาลง" },
        hearts: 9,
        replies: 2,
      },
      {
        daysAgo: 14,
        type: "milestone",
        title: { en: "A hundred people have played it", th: "มีคนเล่นครบร้อยคนแล้ว" },
        body: {
          en: "Most of them found it through Hamster Hub's Friday playtests. The typical run lasts 14 minutes. The longest was 2 hours 10, by someone who says they weren't even trying.",
          th: "ส่วนใหญ่มาจากรอบเล่นทดสอบวันศุกร์ของ Hamster Hub รอบหนึ่งปกติเล่นกันราว 14 นาที นานสุดคือ 2 ชั่วโมง 10 นาที คนเล่นบอกว่าไม่ได้ตั้งใจเล่นนานขนาดนั้นเลย",
        },
        summary: { en: "passed a hundred players.", th: "มีคนเล่นครบร้อยคน" },
        hearts: 40,
        replies: 11,
      },
    ],
    screens: [
      ["game", "#c9553a"],
      ["idea", "#4a5b4a"],
      ["iot", "#3d5a6c"],
    ],
    platforms: ["windows", "browser"],
    team: { en: "Pim and one artist", th: "พิมกับนักวาดอีกหนึ่งคน" },
    started: "2026-02",
    ledger: {
      earns: {
        en: "You buy it once. Planned price **฿259**. No ads, no loot boxes.",
        th: "ซื้อครั้งเดียวจบ ตั้งใจขายราคา **฿259** ไม่มีโฆษณา ไม่มีกล่องสุ่ม",
      },
      owners: [
        [{ en: "Pim", th: "พิม" }, 60],
        [HUB, 40],
      ],
      raising: [1_500_000, { en: "to pay two people full-time for a year.", th: "เพื่อจ้างคนสองคนทำเต็มเวลาหนึ่งปี" }],
      spent: [320_000, { en: "all of it from Hamster Hub.", th: "มาจาก Hamster Hub ทั้งหมด" }],
      earned: [0, { en: "It isn't on sale yet.", th: "ยังไม่ได้เริ่มขาย" }],
      checkedDaysAgo: 13,
    },
    hub: {
      summary: {
        en: "Hamster Hub has put in two people part-time, ฿320,000, and a desk since January. Pim pitched it at an internal demo day, and it passed our review in March.",
        th: "Hamster Hub ลงคนสองคนแบบพาร์ตไทม์ เงิน ฿320,000 และโต๊ะทำงานหนึ่งตัวตั้งแต่เดือนมกราคม พิมเอางานนี้มาเสนอในวันเดโมภายใน และผ่านการรีวิวของเราเมื่อเดือนมีนาคม",
      },
      checks: ALL_CHECKS,
    },
  },
  wheelsense: {
    latest: {
      title: { en: "Firmware 0.9: the battery lasts longer", th: "เฟิร์มแวร์ 0.9: แบตอยู่ได้นานขึ้น" },
      body: {
        en: "The sensor now sleeps between readings instead of waiting with the radio on. On our test farm that took one battery from five weeks to about four months.",
        th: "ตอนนี้เซนเซอร์จะหลับระหว่างรอบวัด แทนที่จะเปิดวิทยุรอไว้ตลอด ที่ฟาร์มทดสอบ ถ่านก้อนเดียวจากเดิมอยู่ได้ห้าสัปดาห์ ตอนนี้อยู่ได้ราวสี่เดือน",
      },
      image: true,
    },
    platforms: ["device", "line"],
    team: { en: "Mind and two farmers who test it", th: "มายด์กับเกษตรกรอีกสองคนที่ช่วยทดสอบ" },
    started: "2025-09",
    ledger: {
      earns: {
        en: "You buy the sensor for **฿690**, then pay **฿49** a month for the readings on your phone.",
        th: "ซื้อเซนเซอร์ตัวละ **฿690** แล้วจ่ายเดือนละ **฿49** เพื่อดูค่าบนมือถือ",
      },
      owners: [
        [{ en: "Mind", th: "มายด์" }, 55],
        [HUB, 45],
      ],
      raising: [2_000_000, { en: "for the first factory run of 3,000 sensors.", th: "สำหรับการผลิตล็อตแรก 3,000 ตัว" }],
      spent: [410_000, { en: "mostly parts and trips to the test farms.", th: "ส่วนใหญ่เป็นค่าชิ้นส่วนและค่าเดินทางไปฟาร์มทดสอบ" }],
      earned: [38_000, { en: "from 52 sensors sold to early farms.", th: "จากเซนเซอร์ 52 ตัวที่ขายให้ฟาร์มกลุ่มแรก" }],
      checkedDaysAgo: 20,
    },
    hub: {
      summary: {
        en: "Hamster Hub has put in ฿410,000, a bench in the hardware room, and help finding farms to test with.",
        th: "Hamster Hub ลงเงิน ฿410,000 ให้ที่ในห้องฮาร์ดแวร์ และช่วยหาฟาร์มมาร่วมทดสอบ",
      },
      checks: ALL_CHECKS,
    },
  },
  nestboard: {
    latest: {
      title: { en: "A report page for investors", th: "หน้ารายงานสำหรับนักลงทุน" },
      body: {
        en: "You can now share one page with an investor that shows revenue, costs and runway, and nothing else. It updates itself every Monday.",
        th: "ตอนนี้แชร์หน้าเดียวให้นักลงทุนดูได้แล้ว มีแค่รายได้ ค่าใช้จ่าย และเงินที่เหลือพอใช้ได้อีกกี่เดือน อัปเดตเองทุกวันจันทร์",
      },
    },
    platforms: ["browser"],
    team: { en: "Tonkla, on his own", th: "ต้นกล้าทำคนเดียว" },
    started: "2025-06",
    ledger: {
      earns: {
        en: "A monthly plan at **฿390** per team. The first month is free.",
        th: "จ่ายรายเดือนทีมละ **฿390** เดือนแรกใช้ฟรี",
      },
      owners: [
        [{ en: "Tonkla", th: "ต้นกล้า" }, 70],
        [HUB, 30],
      ],
      raising: null,
      spent: [140_000, { en: "mostly servers and one designer for a month.", th: "ส่วนใหญ่เป็นค่าเซิร์ฟเวอร์ และค่าจ้างนักออกแบบหนึ่งเดือน" }],
      earned: [96_000, { en: "from 41 paying teams so far.", th: "จากทีมที่จ่ายเงินแล้ว 41 ทีม" }],
      checkedDaysAgo: 25,
    },
    hub: {
      summary: {
        en: "Hamster Hub covers the servers and lets Tonkla spend Fridays on it. Six of our own teams use it.",
        th: "Hamster Hub ออกค่าเซิร์ฟเวอร์ และให้ต้นกล้าใช้วันศุกร์ทำงานนี้ได้ ทีมในบริษัทเราเองก็ใช้อยู่หกทีม",
      },
      checks: ALL_CHECKS,
    },
  },
  pawprint: {
    latest: {
      title: { en: "Testing payments with the first shops", th: "เริ่มทดสอบระบบจ่ายเงินกับร้านแรก ๆ" },
      body: {
        en: "Three pet shops in Bang Na are taking real orders this week. So far the hard part isn't paying, it's getting shop owners to upload photos.",
        th: "ร้านสัตว์เลี้ยงสามร้านแถวบางนาเริ่มรับออร์เดอร์จริงสัปดาห์นี้ ที่ยากตอนนี้ไม่ใช่เรื่องจ่ายเงิน แต่เป็นการชวนเจ้าของร้านมาอัปโหลดรูปสินค้า",
      },
    },
    platforms: ["browser", "line"],
    team: { en: "Fahsai and one developer", th: "ฟ้าใสกับนักพัฒนาอีกหนึ่งคน" },
    started: "2026-01",
    ledger: {
      earns: {
        en: "Shops pay **3%** of each order. No monthly fee.",
        th: "ร้านจ่าย **3%** ของแต่ละออร์เดอร์ ไม่มีค่ารายเดือน",
      },
      owners: [
        [{ en: "Fahsai", th: "ฟ้าใส" }, 50],
        [{ en: "Ploy, developer", th: "พลอย นักพัฒนา" }, 20],
        [HUB, 30],
      ],
      raising: [800_000, { en: "to sign up fifty shops before the rainy season.", th: "เพื่อชวนร้านมาใช้ให้ได้ห้าสิบร้านก่อนหน้าฝน" }],
      spent: [180_000, { en: "from Hamster Hub.", th: "มาจาก Hamster Hub" }],
      earned: [2_400, { en: "in fees from the first test orders.", th: "เป็นค่าธรรมเนียมจากออร์เดอร์ทดสอบแรก ๆ" }],
      checkedDaysAgo: 9,
    },
    hub: {
      summary: {
        en: "Hamster Hub put in ฿180,000 and introduced Fahsai to the shops she's testing with.",
        th: "Hamster Hub ลงเงิน ฿180,000 และแนะนำร้านที่ฟ้าใสใช้ทดสอบอยู่ตอนนี้ให้",
      },
      checks: ALL_CHECKS,
    },
  },
  "seed-dash": {
    latest: {
      title: { en: "Levels 3 to 5 are easier now", th: "ด่าน 3 ถึง 5 ง่ายขึ้นแล้ว" },
      body: {
        en: "Players said the middle of the game was where they gave up. The sun sets a little slower now, and there are more seeds near the start of each level.",
        th: "ผู้เล่นบอกว่าช่วงกลางเกมคือจุดที่ถอดใจกัน ตอนนี้พระอาทิตย์ตกช้าลงนิดหนึ่ง และมีเมล็ดเยอะขึ้นตรงต้นด่าน",
      },
    },
    platforms: ["android", "ios"],
    team: { en: "Pim, on her own", th: "พิมทำคนเดียว" },
    started: "2025-04",
    ledger: {
      earns: {
        en: "Free to play. **฿35** takes the ads away for good.",
        th: "เล่นฟรี จ่าย **฿35** ครั้งเดียวเพื่อปิดโฆษณาถาวร",
      },
      owners: [
        [{ en: "Pim", th: "พิม" }, 50],
        [HUB, 50],
      ],
      raising: null,
      spent: [60_000, { en: "mostly sound and store fees.", th: "ส่วนใหญ่เป็นค่าเสียงและค่าธรรมเนียมสโตร์" }],
      earned: [118_000, { en: "from ads and 2,100 ad-free upgrades.", th: "จากโฆษณาและการซื้อปิดโฆษณา 2,100 ครั้ง" }],
      checkedDaysAgo: 30,
    },
    hub: {
      summary: {
        en: "Hamster Hub paid for the sound and the store accounts. It made its money back in five months.",
        th: "Hamster Hub ออกค่าเสียงและค่าบัญชีสโตร์ให้ ได้ทุนคืนภายในห้าเดือน",
      },
      checks: ALL_CHECKS,
    },
  },
  aquanode: {
    latest: {
      title: { en: "The first prototypes are in a real pond", th: "เครื่องต้นแบบลงบ่อจริงแล้ว" },
      body: {
        en: "Two units are floating in a shrimp pond in Chachoengsao. They've sent a reading every ten minutes for a day, and one has already warned about low oxygen at 4 a.m.",
        th: "ลอยอยู่ในบ่อกุ้งที่ฉะเชิงเทราสองเครื่อง ส่งค่ามาทุกสิบนาทีครบหนึ่งวันแล้ว และเครื่องหนึ่งก็เตือนว่าออกซิเจนต่ำไปแล้วหนึ่งครั้งตอนตีสี่",
      },
      image: true,
    },
    platforms: ["device", "line"],
    team: { en: "Mind and a shrimp farmer who advises", th: "มายด์กับคนเลี้ยงกุ้งที่มาเป็นที่ปรึกษา" },
    started: "2026-05",
    ledger: {
      earns: {
        en: "Rent a unit for **฿250** a month per pond, alerts included.",
        th: "เช่าเครื่องบ่อละ **฿250** ต่อเดือน รวมการแจ้งเตือนแล้ว",
      },
      owners: [
        [{ en: "Mind", th: "มายด์" }, 60],
        [HUB, 40],
      ],
      raising: [1_200_000, { en: "to build fifty units and test them through one season.", th: "เพื่อทำเครื่องห้าสิบเครื่องแล้วทดสอบให้ครบหนึ่งฤดู" }],
      spent: [95_000, { en: "on parts and two trips to the farm.", th: "เป็นค่าชิ้นส่วนและค่าเดินทางไปฟาร์มสองรอบ" }],
      earned: [0, { en: "Nothing's for rent yet.", th: "ยังไม่ได้เปิดให้เช่า" }],
      checkedDaysAgo: 6,
    },
    hub: {
      summary: {
        en: "Hamster Hub put in ฿95,000 and the same hardware bench WheelSense uses.",
        th: "Hamster Hub ลงเงิน ฿95,000 และให้ใช้โต๊ะฮาร์ดแวร์ตัวเดียวกับ WheelSense",
      },
      checks: ["team", "money"],
    },
  },
  "sunflower-bank": {
    latest: {
      title: { en: "What twelve freelancers said about saving", th: "ฟรีแลนซ์สิบสองคนเล่าเรื่องการออมเงิน" },
      body: {
        en: "Most of them already save in a group with friends, on paper or in a chat. Nobody wanted an app that holds their money. They wanted one that keeps the group honest.",
        th: "ส่วนใหญ่ออมเป็นกลุ่มกับเพื่อนอยู่แล้ว จดในกระดาษหรือในแชต ไม่มีใครอยากได้แอปที่ถือเงินไว้ให้ อยากได้แอปที่ช่วยให้ทุกคนในกลุ่มตรงไปตรงมามากกว่า",
      },
    },
    platforms: ["line"],
    team: { en: "Phoom, on his own", th: "ภูมิทำคนเดียว" },
    started: "2026-08",
    ledger: {
      earns: {
        en: "Not decided. The likely plan is **฿29** a month per group.",
        th: "ยังไม่ได้ตัดสินใจ ที่น่าจะเป็นคือกลุ่มละ **฿29** ต่อเดือน",
      },
      owners: [
        [{ en: "Phoom", th: "ภูมิ" }, 80],
        [HUB, 20],
      ],
      raising: [300_000, { en: "to build a first version and try it with five groups.", th: "เพื่อทำเวอร์ชันแรกแล้วลองกับห้ากลุ่ม" }],
      spent: [12_000, { en: "on coffee and train tickets for interviews.", th: "เป็นค่ากาแฟและค่ารถไฟไปสัมภาษณ์คน" }],
      earned: [0, { en: "There's nothing to sell yet.", th: "ยังไม่มีอะไรให้ขาย" }],
      checkedDaysAgo: 11,
    },
    hub: {
      summary: {
        en: "Hamster Hub gives Phoom one day a week for this, and put him in touch with the freelancers he interviewed.",
        th: "Hamster Hub ให้ภูมิใช้เวลาหนึ่งวันต่อสัปดาห์ทำงานนี้ และช่วยแนะนำฟรีแลนซ์ที่เขาไปสัมภาษณ์",
      },
      checks: ["team", "money"],
    },
  },
  moonwheel: {
    latest: {
      title: { en: "A three-level demo, in the browser", th: "เดโมสามด่าน เล่นบนเบราว์เซอร์" },
      body: {
        en: "The first three levels are up. They're the easy ones. If you finish them in under five minutes, I'd like to hear how.",
        th: "ลงสามด่านแรกไว้แล้ว เป็นด่านง่าย ถ้าใครผ่านได้ในห้านาที อยากรู้ว่าทำยังไง",
      },
      image: true,
    },
    platforms: ["browser"],
    team: { en: "Fahsai, on her own", th: "ฟ้าใสทำคนเดียว" },
    started: "2026-06",
    ledger: {
      earns: {
        en: "Probably a one-off price of about **฿150**. Not decided.",
        th: "น่าจะขายครั้งเดียวราว **฿150** ยังไม่ได้ตัดสินใจ",
      },
      owners: [
        [{ en: "Fahsai", th: "ฟ้าใส" }, 70],
        [HUB, 30],
      ],
      raising: null,
      spent: [20_000, { en: "on music.", th: "เป็นค่าเพลง" }],
      earned: [0, { en: "It isn't on sale.", th: "ยังไม่ได้ขาย" }],
      checkedDaysAgo: 18,
    },
    hub: {
      summary: {
        en: "Hamster Hub paid for the music and lets Fahsai use the Friday playtests.",
        th: "Hamster Hub ออกค่าเพลง และให้ฟ้าใสใช้รอบเล่นทดสอบวันศุกร์ได้",
      },
      checks: ["team", "build"],
    },
  },
  "kernel-docs": {
    latest: {
      title: { en: "Broken links in generated pages are fixed", th: "แก้ลิงก์เสียในหน้าที่สร้างอัตโนมัติแล้ว" },
      body: {
        en: "If two functions had the same name in different files, the link went to the wrong one. It picks the right file now.",
        th: "ถ้ามีฟังก์ชันชื่อเดียวกันอยู่คนละไฟล์ ลิงก์จะพาไปผิดตัว ตอนนี้เลือกไฟล์ถูกแล้ว",
      },
    },
    platforms: ["browser", "mac", "windows"],
    team: { en: "Tonkla, on his own", th: "ต้นกล้าทำคนเดียว" },
    started: "2024-11",
    ledger: {
      earns: {
        en: "Free for open source. **฿990** a year for a company.",
        th: "ใช้ฟรีสำหรับโอเพนซอร์ส บริษัทจ่ายปีละ **฿990**",
      },
      owners: [
        [{ en: "Tonkla", th: "ต้นกล้า" }, 60],
        [HUB, 40],
      ],
      raising: null,
      spent: [30_000, { en: "on servers over two years.", th: "เป็นค่าเซิร์ฟเวอร์ตลอดสองปี" }],
      earned: [54_000, { en: "from 55 company licences.", th: "จากไลเซนส์บริษัท 55 ใบ" }],
      checkedDaysAgo: 40,
    },
    hub: {
      summary: {
        en: "Hamster Hub covers the servers. Most of our own code is documented with it.",
        th: "Hamster Hub ออกค่าเซิร์ฟเวอร์ให้ โค้ดส่วนใหญ่ของบริษัทเราก็ใช้ตัวนี้เขียนเอกสาร",
      },
      checks: ALL_CHECKS,
    },
  },
  "tunnel-tales": {
    latest: {
      title: { en: "How the map picks its dead ends", th: "แผนที่เลือกทางตันยังไง" },
      body: {
        en: "Every run, the map hides a story room behind a dead end. Here's how it decides which dead end is worth walking down.",
        th: "ทุกรอบที่เล่น แผนที่จะซ่อนห้องเล่าเรื่องไว้หลังทางตันหนึ่งทาง มาเล่าว่ามันตัดสินยังไงว่าทางตันไหนควรค่าแก่การเดินเข้าไป",
      },
    },
    platforms: ["windows"],
    team: { en: "Pim, on Fridays", th: "พิมทำทุกวันศุกร์" },
    started: "2026-07",
    ledger: {
      earns: {
        en: "Not decided. It may end up inside Burrow Knights.",
        th: "ยังไม่ได้ตัดสินใจ อาจจะกลายเป็นส่วนหนึ่งของ Burrow Knights",
      },
      owners: [
        [{ en: "Pim", th: "พิม" }, 100],
      ],
      raising: null,
      spent: [0, { en: "It's all Pim's spare time.", th: "ใช้แต่เวลาว่างของพิม" }],
      earned: [0, { en: "There's nothing to sell.", th: "ยังไม่มีอะไรให้ขาย" }],
      checkedDaysAgo: 22,
    },
  },
  "cheek-pouch": {
    latest: {
      title: { en: "Round two is shorter now", th: "รอบสองสั้นลงแล้ว" },
      body: {
        en: "Playtesters kept quitting halfway through round two. It's ninety seconds now instead of three minutes, and nobody has quit since.",
        th: "คนทดสอบเลิกเล่นกลางรอบสองกันบ่อย ตอนนี้เหลือเก้าสิบวินาทีจากเดิมสามนาที ตั้งแต่นั้นยังไม่มีใครเลิกกลางทางเลย",
      },
    },
    platforms: ["windows", "mac"],
    team: { en: "Pim and a sound designer", th: "พิมกับคนทำเสียงอีกหนึ่งคน" },
    started: "2026-04",
    ledger: {
      earns: {
        en: "You buy it once for **฿179**, and up to four friends play on one copy.",
        th: "ซื้อครั้งเดียว **฿179** เพื่อนเล่นด้วยได้อีกถึงสี่คนในก๊อปปี้เดียว",
      },
      owners: [
        [{ en: "Pim", th: "พิม" }, 65],
        [HUB, 35],
      ],
      raising: null,
      spent: [45_000, { en: "on sound.", th: "เป็นค่าเสียง" }],
      earned: [0, { en: "It isn't on sale yet.", th: "ยังไม่ได้เริ่มขาย" }],
      checkedDaysAgo: 27,
    },
    hub: {
      summary: {
        en: "Hamster Hub paid for the sound designer and runs the playtests.",
        th: "Hamster Hub ออกค่าจ้างคนทำเสียง และจัดรอบเล่นทดสอบให้",
      },
      checks: ["team", "build"],
    },
  },
  hayloft: {
    latest: {
      title: { en: "Swap shifts from your phone", th: "สลับกะจากมือถือได้แล้ว" },
      body: {
        en: "Staff can offer a shift, someone else takes it, and the manager gets one tap to say yes. No more swapping in the group chat.",
        th: "พนักงานปล่อยกะได้ อีกคนรับไป แล้วผู้จัดการกดยืนยันครั้งเดียว ไม่ต้องแลกกะกันในแชตกลุ่มอีกแล้ว",
      },
    },
    platforms: ["browser", "line"],
    team: { en: "Tonkla and a café owner who tests it", th: "ต้นกล้ากับเจ้าของคาเฟ่ที่ช่วยทดสอบ" },
    started: "2026-03",
    ledger: {
      earns: {
        en: "**฿199** a month per café, however many staff.",
        th: "คาเฟ่ละ **฿199** ต่อเดือน ไม่จำกัดจำนวนพนักงาน",
      },
      owners: [
        [{ en: "Tonkla", th: "ต้นกล้า" }, 60],
        [HUB, 40],
      ],
      raising: [500_000, { en: "to hire a second developer for a year.", th: "เพื่อจ้างนักพัฒนาเพิ่มอีกหนึ่งคนเป็นเวลาหนึ่งปี" }],
      spent: [25_000, { en: "on servers.", th: "เป็นค่าเซิร์ฟเวอร์" }],
      earned: [7_800, { en: "from the first eight cafés.", th: "จากคาเฟ่แปดร้านแรก" }],
      checkedDaysAgo: 15,
    },
    hub: {
      summary: {
        en: "Hamster Hub covers the servers and introduced Tonkla to the cafés downstairs.",
        th: "Hamster Hub ออกค่าเซิร์ฟเวอร์ และแนะนำต้นกล้าให้รู้จักคาเฟ่ชั้นล่าง",
      },
      checks: ALL_CHECKS,
    },
  },
  "coop-watch": {
    latest: {
      title: { en: "Forty hens, counted right all week", th: "นับไก่สี่สิบตัวถูกทั้งสัปดาห์" },
      body: {
        en: "The camera over the coop door got the count right every night for seven nights. Last week it thought a cat was a hen, so this is progress.",
        th: "กล้องเหนือประตูเล้านับถูกทุกคืนติดกันเจ็ดคืน สัปดาห์ก่อนยังนับแมวเป็นไก่อยู่เลย ถือว่าดีขึ้นเยอะ",
      },
      image: true,
    },
    platforms: ["device", "line"],
    team: { en: "Mind, on Fridays", th: "มายด์ทำทุกวันศุกร์" },
    started: "2026-08",
    ledger: {
      earns: {
        en: "A one-off **฿1,290** for the camera kit. No monthly fee.",
        th: "จ่ายครั้งเดียว **฿1,290** สำหรับชุดกล้อง ไม่มีค่ารายเดือน",
      },
      owners: [
        [{ en: "Mind", th: "มายด์" }, 70],
        [HUB, 30],
      ],
      raising: [400_000, { en: "for a first batch of 300 kits.", th: "สำหรับการผลิตชุดแรก 300 ชุด" }],
      spent: [18_000, { en: "on cameras and a lot of chicken feed.", th: "เป็นค่ากล้องและค่าอาหารไก่อีกไม่น้อย" }],
      earned: [0, { en: "Nothing's for sale yet.", th: "ยังไม่ได้เริ่มขาย" }],
      checkedDaysAgo: 8,
    },
    hub: {
      summary: {
        en: "Hamster Hub put in ฿18,000 for parts.",
        th: "Hamster Hub ลงเงิน ฿18,000 เป็นค่าชิ้นส่วน",
      },
      checks: ["team", "money"],
    },
  },
  "pocket-grant": {
    latest: {
      title: { en: "Two universities want to try it", th: "มหาวิทยาลัยสองแห่งอยากลอง" },
      body: {
        en: "Both said the hard part of student grants is the paperwork, not the money. The pilot would pay out ten grants of ฿5,000 each.",
        th: "ทั้งสองแห่งบอกว่าทุนนักศึกษายากที่เอกสาร ไม่ใช่ที่เงิน โครงการนำร่องจะให้ทุนสิบทุน ทุนละ ฿5,000",
      },
    },
    platforms: ["browser"],
    team: { en: "Phoom, on his own", th: "ภูมิทำคนเดียว" },
    started: "2026-09",
    ledger: {
      earns: {
        en: "Universities would pay **5%** on top of each grant.",
        th: "มหาวิทยาลัยจ่ายเพิ่ม **5%** จากแต่ละทุน",
      },
      owners: [
        [{ en: "Phoom", th: "ภูมิ" }, 80],
        [HUB, 20],
      ],
      raising: [250_000, { en: "to run the pilot with one university.", th: "เพื่อทำโครงการนำร่องกับมหาวิทยาลัยหนึ่งแห่ง" }],
      spent: [0, { en: "So far it's only meetings.", th: "ตอนนี้มีแค่การนัดคุย" }],
      earned: [0, { en: "There's nothing to sell yet.", th: "ยังไม่มีอะไรให้ขาย" }],
      checkedDaysAgo: 12,
    },
  },
  "rice-route": {
    latest: {
      title: { en: "Routes for the first district", th: "เส้นทางของอำเภอแรก" },
      body: {
        en: "We drew every route a rice truck takes out of one district in Suphan Buri. Two in three trips leave half empty.",
        th: "วาดทุกเส้นทางที่รถขนข้าววิ่งออกจากอำเภอหนึ่งในสุพรรณบุรี สองในสามเที่ยววิ่งออกไปทั้งที่ยังว่างครึ่งคัน",
      },
      image: true,
    },
    platforms: ["line"],
    team: { en: "Phoom and a trucking cooperative", th: "ภูมิกับสหกรณ์รถบรรทุก" },
    started: "2026-07",
  },
  "night-wheel": {
    latest: {
      title: { en: "Paused for now", th: "พักไว้ก่อน" },
      body: {
        en: "Night Wheel is on hold while Mind works on WheelSense. The step counter works. The app for it doesn't yet.",
        th: "Night Wheel พักไว้ก่อน ระหว่างที่มายด์ทำ WheelSense ตัวนับก้าวใช้ได้แล้ว แต่แอปยังไม่เสร็จ",
      },
    },
    platforms: ["device"],
    team: { en: "Mind, in spare time", th: "มายด์ทำตอนว่าง" },
    started: "2025-11",
  },
  "second-shelf": {
    latest: {
      title: { en: "On hold until there's a place for the tools", th: "พักไว้จนกว่าจะมีที่เก็บเครื่องมือ" },
      body: {
        en: "People liked the idea. Nobody had a spare room. This will wait until there's somewhere to keep the drills.",
        th: "คนชอบไอเดียนี้ แต่ไม่มีใครมีห้องว่าง เลยต้องรอจนกว่าจะมีที่เก็บสว่าน",
      },
    },
    platforms: ["line"],
    team: { en: "Fahsai, in spare time", th: "ฟ้าใสทำตอนว่าง" },
    started: "2025-10",
  },
};
