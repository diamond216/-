import type { LanguageId, RecognitionKind } from "@/domain";
import type { Bilingual } from "./seeds";

/** The personal part of each maker's profile. Pim follows the approved draft word for word. */
export interface MakerStorySeed {
  joinedYear: number;
  intro: Bilingual;
  description: Bilingual;
  talkTopics: readonly Bilingual[];
  replyDays: number;
  languages: readonly LanguageId[];
  portraitCaption?: Bilingual;
  timeline: ReadonlyArray<readonly [year: number, text: Bilingual]>;
  recognitions: ReadonlyArray<readonly [year: number, title: Bilingual, from: Bilingual, kind: RecognitionKind]>;
  earlier: ReadonlyArray<readonly [year: number, name: Bilingual, note: Bilingual]>;
}

const NEST: Bilingual = { en: "Hamster Nest", th: "Hamster Nest" };

export const makerStories: Readonly<Record<string, MakerStorySeed>> = {
  pim: {
    joinedYear: 2023,
    intro: {
      en: "I make small games about digging, getting lost, and finding your way back. Right now that's Burrow Knights. I post what I'm working on most weeks, including the parts that didn't work.",
      th: "ฉันทำเกมเล็ก ๆ เกี่ยวกับการขุด การหลงทาง และการหาทางกลับ ตอนนี้ก็คือ Burrow Knights ฉันลงอัปเดตงานที่ทำอยู่แทบทุกสัปดาห์ รวมถึงส่วนที่ทำแล้วไม่เวิร์กด้วย",
    },
    description: {
      en: "Pim makes small games about digging and getting lost. See what she's working on and say hi.",
      th: "พิมทำเกมเล็ก ๆ เกี่ยวกับการขุดและการหลงทาง มาดูว่าเธอกำลังทำอะไรอยู่ แล้วทักไปคุยได้เลย",
    },
    talkTopics: [
      { en: "Publishing Burrow Knights", th: "การวางขาย Burrow Knights" },
      { en: "Co-op on one keyboard", th: "เกมเล่นสองคนบนคีย์บอร์ดเดียว" },
      { en: "Running playtests with strangers", th: "การจัดเล่นทดสอบกับคนแปลกหน้า" },
      { en: "Finding a pixel artist", th: "การหานักวาดพิกเซลอาร์ต" },
    ],
    replyDays: 2,
    languages: ["th", "en"],
    portraitCaption: { en: "Photo goes here · Pim at a Friday playtest", th: "รูปจะอยู่ตรงนี้ · พิมในรอบเล่นทดสอบวันศุกร์" },
    timeline: [
      [2021, { en: "Studied computer science in Chiang Mai. Spent more time at game jams than in lectures.", th: "เรียนวิทยาการคอมพิวเตอร์ที่เชียงใหม่ ใช้เวลาอยู่ในงานเกมแจมมากกว่าในห้องเรียน" }],
      [2023, { en: "Joined Hamster Hub as a QA tester. Most of my bug reports were about jumping.", th: "เข้า Hamster Hub ในตำแหน่งผู้ทดสอบ รายงานบั๊กส่วนใหญ่เป็นเรื่องการกระโดด" }],
      [2024, { en: "Moved over to design. Made Nibble in one weekend and didn't sleep much.", th: "ย้ายมาทำดีไซน์ ทำ Nibble เสร็จในสุดสัปดาห์เดียวแบบแทบไม่ได้นอน" }],
      [2025, { en: "Tunnel Tactics came out, the first game with my name on it.", th: "Tunnel Tactics ออกวางขาย เป็นเกมแรกที่มีชื่อฉันอยู่บนนั้น" }],
      [2026, { en: "Started Burrow Knights. Hamster Hub backed it in March.", th: "เริ่มทำ Burrow Knights และ Hamster Hub ลงทุนให้เมื่อเดือนมีนาคม" }],
    ],
    recognitions: [
      [2025, { en: "Best feel", th: "เกมที่เล่นแล้วรู้สึกดีที่สุด" }, { en: "Hamster Hub Winter Jam", th: "Hamster Hub Winter Jam" }, "award"],
      [2025, { en: "Picked for the shelf, twice", th: "ได้ขึ้นชั้นสองครั้ง" }, NEST, "award"],
      [2024, { en: "Finalist", th: "เข้ารอบสุดท้าย" }, { en: "Placeholder student game award", th: "รางวัลเกมนักศึกษา (ชื่อตัวอย่าง)" }, "mention"],
    ],
    earlier: [
      [2025, { en: "Tunnel Tactics", th: "Tunnel Tactics" }, { en: "Turn-based digging game. Shipped, 4,200 plays.", th: "เกมขุดแบบผลัดกันเดิน วางขายแล้ว มีคนเล่น 4,200 ครั้ง" }],
      [2024, { en: "Nibble", th: "Nibble" }, { en: "Made in a weekend jam. Won “Best feel”.", th: "ทำในงานแจมสุดสัปดาห์ ได้รางวัล “เล่นแล้วรู้สึกดีที่สุด”" }],
      [2023, { en: "400 bug reports", th: "รายงานบั๊ก 400 ฉบับ" }, { en: "Not a game, but it's where I learned what breaks.", th: "ไม่ใช่เกม แต่เป็นที่ที่ทำให้รู้ว่าอะไรพังได้บ้าง" }],
    ],
  },
  mind: {
    joinedYear: 2022,
    intro: {
      en: "I build small, cheap sensors for farms that can't afford big ones. Most of my week is soldering, and the rest is driving out to see whether last week's soldering survived the rain.",
      th: "ผมทำเซนเซอร์ตัวเล็ก ราคาถูก ให้ฟาร์มที่ซื้อของแพงไม่ไหว สัปดาห์หนึ่งส่วนใหญ่หมดไปกับการบัดกรี ที่เหลือคือขับรถไปดูว่างานบัดกรีเมื่อสัปดาห์ก่อนรอดฝนไหม",
    },
    description: {
      en: "Mind builds cheap sensors for small farms. See what he's working on and say hi.",
      th: "มายด์ทำเซนเซอร์ราคาถูกสำหรับฟาร์มเล็ก มาดูว่าเขากำลังทำอะไรอยู่ แล้วทักไปคุยได้เลย",
    },
    talkTopics: [
      { en: "Batteries that last a season", th: "ถ่านที่อยู่ได้ทั้งฤดู" },
      { en: "Selling to farmers", th: "การขายของให้เกษตรกร" },
      { en: "Making hardware in small batches", th: "การผลิตฮาร์ดแวร์ทีละน้อย" },
    ],
    replyDays: 3,
    languages: ["th", "en"],
    portraitCaption: { en: "Photo goes here · Mind at the test farm", th: "รูปจะอยู่ตรงนี้ · มายด์ที่ฟาร์มทดสอบ" },
    timeline: [
      [2019, { en: "Studied electrical engineering in Khon Kaen. Grew up on a cassava farm.", th: "เรียนวิศวกรรมไฟฟ้าที่ขอนแก่น โตมาในไร่มันสำปะหลัง" }],
      [2022, { en: "Joined Hamster Hub to fix the office's smart lights. They still flicker.", th: "เข้า Hamster Hub มาซ่อมไฟอัจฉริยะในออฟฟิศ ตอนนี้ก็ยังกะพริบอยู่" }],
      [2025, { en: "Started WheelSense after his dad's water pump ran dry for a week.", th: "เริ่มทำ WheelSense หลังจากปั๊มน้ำที่บ้านทำงานแห้งไปทั้งสัปดาห์" }],
      [2026, { en: "Took AquaNode and Coop Watch on as well. Sleeps less.", th: "รับ AquaNode กับ Coop Watch มาทำเพิ่ม นอนน้อยลง" }],
    ],
    recognitions: [
      [2026, { en: "Picked for the shelf", th: "ได้ขึ้นชั้น" }, NEST, "award"],
      [2025, { en: "Mentioned in a farming magazine", th: "ได้ลงในนิตยสารเกษตร" }, { en: "Placeholder magazine", th: "นิตยสาร (ชื่อตัวอย่าง)" }, "mention"],
    ],
    earlier: [
      [2023, { en: "Office lights", th: "ไฟออฟฟิศ" }, { en: "They mostly work.", th: "ส่วนใหญ่ใช้ได้" }],
    ],
  },
  tonkla: {
    joinedYear: 2024,
    intro: {
      en: "I make plain web tools for small teams. If a tool needs a training session, I've built it wrong. I ship something most Fridays, even if it's small.",
      th: "ผมทำเครื่องมือบนเว็บแบบเรียบ ๆ ให้ทีมเล็ก ถ้าเครื่องมือไหนต้องมีคนมาสอนใช้ แปลว่าผมทำพลาด ผมส่งงานแทบทุกวันศุกร์ ถึงจะเป็นของชิ้นเล็กก็ตาม",
    },
    description: {
      en: "Tonkla makes plain web tools for small teams. See what he's working on and say hi.",
      th: "ต้นกล้าทำเครื่องมือบนเว็บสำหรับทีมเล็ก มาดูว่าเขากำลังทำอะไรอยู่ แล้วทักไปคุยได้เลย",
    },
    talkTopics: [
      { en: "Pricing a small SaaS", th: "การตั้งราคา SaaS เล็ก ๆ" },
      { en: "Reports nobody reads", th: "รายงานที่ไม่มีใครอ่าน" },
      { en: "Shipping on Fridays", th: "การส่งงานทุกวันศุกร์" },
    ],
    replyDays: 1,
    languages: ["th", "en"],
    timeline: [
      [2020, { en: "Built his first website for his mum's noodle shop.", th: "ทำเว็บไซต์แรกให้ร้านก๋วยเตี๋ยวของแม่" }],
      [2024, { en: "Joined Hamster Hub as a web developer. Wrote Kernel Docs in his first month.", th: "เข้า Hamster Hub เป็นนักพัฒนาเว็บ เขียน Kernel Docs ตั้งแต่เดือนแรก" }],
      [2025, { en: "Started NestBoard because our own reports were a mess.", th: "เริ่มทำ NestBoard เพราะรายงานของบริษัทเองยุ่งเหยิง" }],
    ],
    recognitions: [
      [2025, { en: "Picked for the shelf", th: "ได้ขึ้นชั้น" }, NEST, "award"],
    ],
    earlier: [
      [2020, { en: "Noodle shop website", th: "เว็บไซต์ร้านก๋วยเตี๋ยว" }, { en: "Still online. Still takes orders.", th: "ยังออนไลน์อยู่ ยังรับออร์เดอร์อยู่" }],
    ],
  },
  fahsai: {
    joinedYear: 2024,
    intro: {
      en: "I design things for people who don't like apps. My test is simple: if my mum can't use it without calling me, it isn't done.",
      th: "ฉันออกแบบของให้คนที่ไม่ชอบแอป วิธีทดสอบง่าย ๆ คือ ถ้าแม่ใช้เองไม่ได้โดยไม่โทรหาฉัน แปลว่างานยังไม่เสร็จ",
    },
    description: {
      en: "Fahsai designs things for people who don't like apps. See what she's working on and say hi.",
      th: "ฟ้าใสออกแบบของให้คนที่ไม่ชอบแอป มาดูว่าเธอกำลังทำอะไรอยู่ แล้วทักไปคุยได้เลย",
    },
    talkTopics: [
      { en: "Shops that sell on LINE", th: "ร้านที่ขายของผ่านไลน์" },
      { en: "Puzzle design", th: "การออกแบบปริศนา" },
    ],
    replyDays: 2,
    languages: ["th", "en", "ja"],
    timeline: [
      [2022, { en: "Studied design in Bangkok and drew packaging for snacks.", th: "เรียนออกแบบที่กรุงเทพฯ และออกแบบบรรจุภัณฑ์ขนม" }],
      [2024, { en: "Joined Hamster Hub. Redesigned the canteen's ordering screen first.", th: "เข้า Hamster Hub งานแรกคือออกแบบจอสั่งอาหารในโรงอาหารใหม่" }],
      [2026, { en: "Started Pawprint and Moonwheel in the same month, on purpose.", th: "เริ่มทำ Pawprint กับ Moonwheel ในเดือนเดียวกัน แบบตั้งใจ" }],
    ],
    recognitions: [],
    earlier: [],
  },
  phoom: {
    joinedYear: 2025,
    intro: {
      en: "I look at how money moves for people who don't have much of it. Most of my ideas start as a spreadsheet and a lot of interviews.",
      th: "ผมสนใจว่าเงินไหลยังไงสำหรับคนที่มีไม่มาก ไอเดียส่วนใหญ่ของผมเริ่มจากสเปรดชีตหนึ่งไฟล์กับการสัมภาษณ์คนอีกเยอะ ๆ",
    },
    description: {
      en: "Phoom works on money ideas for people who don't have much of it. See what he's working on and say hi.",
      th: "ภูมิทำไอเดียเรื่องเงินสำหรับคนที่มีไม่มาก มาดูว่าเขากำลังทำอะไรอยู่ แล้วทักไปคุยได้เลย",
    },
    talkTopics: [
      { en: "Group savings", th: "การออมเงินเป็นกลุ่ม" },
      { en: "Student grants", th: "ทุนนักศึกษา" },
    ],
    replyDays: 2,
    languages: ["th"],
    timeline: [
      [2024, { en: "Finished an economics degree with a thesis on rotating savings groups.", th: "จบเศรษฐศาสตร์ ทำวิทยานิพนธ์เรื่องการเล่นแชร์" }],
      [2025, { en: "Joined Hamster Hub as an analyst.", th: "เข้า Hamster Hub ในตำแหน่งนักวิเคราะห์" }],
    ],
    recognitions: [],
    earlier: [],
  },
};
