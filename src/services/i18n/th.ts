import type { Messages } from "./en";
import type { RelativeAge } from "./RelativeAge";

const THAI_DAY_WORDS: Readonly<Record<number, string>> = { 1: "หนึ่งวัน", 2: "สองวัน", 3: "สามวัน", 7: "หนึ่งสัปดาห์" };
const thaiDayWords = (days: number) => THAI_DAY_WORDS[days] ?? ` ${days} วัน`;

/** Thai for every string in en.ts. Same keys, same shapes. */
export const th: Messages = {
  "meta.title": "Hamster Nest — งานที่ยังไม่หยุดเดิน",
  "meta.description":
    "ที่ที่คนใน Hamster Hub เอาของที่กำลังทำมาวางไว้ ทุกงานมีอัปเดตให้ตามดู และทักไปคุยกับคนทำได้เลย",

  "brand.home": "หน้าแรก Hamster Nest",
  "brand.by": "จาก Hamster Hub",
  "skip.shelf": "ข้ามไปดูผลงาน",
  "skip.main": "ข้ามไปที่เนื้อหาหลัก",
  "nav.label": "เมนูหลัก",
  "nav.browse": "ดูผลงาน",
  "nav.makers": "คนทำงาน",
  "nav.investors": "สำหรับนักลงทุน",
  "nav.howWePick": "เราคัดงานยังไง",
  "nav.post": "ลงผลงานของคุณ",
  "lang.label": "ภาษา",
  "theme.night": "โหมดกลางคืน",

  "hero.count": (p) => `${p.projects} ผลงาน · ${p.updates} อัปเดตใน ${p.days} วันที่ผ่านมา`,
  "hero.title.lead": "งานที่ยัง",
  "hero.title.accent": "ไม่หยุดเดิน",
  "hero.lede":
    "Hamster Nest คือที่ที่คนใน Hamster Hub เอาของที่กำลังทำมาวางไว้ ทั้งเกม เว็บ ฮาร์ดแวร์ และไอเดียที่ยังไม่เสร็จดี ทุกงานมีอัปเดตให้ตามดูเรื่อย ๆ เจองานที่ชอบเมื่อไหร่ ทักไปคุยกับคนทำได้เลย",
  "search.label": "กำลังมองหาอะไรอยู่",
  "search.placeholder": "ลองพิมพ์ “roguelike เล่นสองคน” หรือ “เซนเซอร์วัดดิน”",
  "search.submit": "ไปดูกัน",
  "search.hint": "กด / เพื่อค้นหา",
  "hero.busy": "หรือเริ่มจากแนวที่ช่วงนี้คึกคัก:",

  "donut.aria": (p) =>
    `${p.updates} อัปเดตใน ${p.days} วันที่ผ่านมา มี ${p.today} ผลงานลงอัปเดตวันนี้ อีก ${p.open} ผลงานกำลังหานักลงทุน ${p.building} ผลงานกำลังก้มหน้าก้มตาทำ และ ${p.paused} ผลงานพักอยู่`,
  "donut.caption": "อัปเดตเดือนนี้",
  "donut.today": "ลงอัปเดตวันนี้",
  "donut.open": "กำลังหานักลงทุน",
  "donut.building": "ก้มหน้าก้มตาทำอยู่",
  "donut.paused": "พักอยู่",

  "note.label": "โน้ตจากคนทำงาน",
  "note.who": (p) => `${p.role} · อยู่ Hamster Hub มา ${p.years} ปี · ${p.projects} ผลงาน`,
  "note.last": (p) => `${p.ago}: ${p.project} ${p.what}`,
  "note.cta": (p) => `ทักไปคุยกับ${p.name}`,

  "tabs.label": "หมวดหมู่",
  "tabs.everything": "ทั้งหมด",
  "sort.label": "เรียงตาม",
  "sort.active": "อัปเดตถี่สุด",
  "sort.newest": "ใหม่ล่าสุด",
  "sort.followed": "คนติดตามมากสุด",

  "filters.label": "ตัวกรอง",
  "filters.toggle": (p) => (p.active > 0 ? `ตัวกรอง (${p.active})` : "ตัวกรอง"),
  "filters.genre": "แนว",
  "filters.allGenres": (p) => `ดูทุกแนว (${p.count})`,
  "filters.fewerGenres": "ดูน้อยลง",
  "filters.stage": "งานไปถึงไหนแล้ว",
  "filters.investing": "ถ้าคุณมาหางานลงทุน",
  "filters.open": "เปิดรับการลงทุน",
  "filters.hasDemo": "มีของให้ลองเล่น/ลองใช้",
  "filters.week": "อัปเดตในสัปดาห์นี้",
  "filters.help": "หาไม่เจอใช่ไหม",
  "filters.helpLink": "บอกเราว่ากำลังหาอะไร",
  "filters.clear": "ล้างตัวกรอง",

  "shelf.label": "ผลงาน",
  "busiest.title": "คึกคักที่สุดสัปดาห์นี้",
  "busiest.sub": "เรียงจากงานที่ลงอัปเดตจริงบ่อยที่สุด ยิ่งอัปเดตสม่ำเสมอ ยิ่งขึ้นมาอยู่ข้างบน",
  "busiest.link": "ดูวิธีจัดอันดับ",
  "fresh.title": "อัปเดตล่าสุด",
  "fresh.sub": (p) => `${p.scope} ${p.order}`,
  "fresh.everyCategory": "ทุกหมวด",
  "fresh.order.active": "เรียงจากงานที่อัปเดตถี่สุด",
  "fresh.order.newest": "เรียงจากใหม่ไปเก่า",
  "fresh.order.followed": "เรียงจากงานที่คนติดตามมากสุด",
  "results.count": (p) =>
    p.text ? `เจอ ${p.count} ผลงานที่ตรงกับ “${p.text}”` : `เจอ ${p.count} ผลงานที่ตรงกับตัวกรอง`,
  "results.empty": "ยังไม่มีงานที่ตรงกับที่หา ลองใช้คำให้น้อยลง หรือเลือกดูตามหมวด",

  "card.updates": (p) => `${p.count} อัปเดต`,
  "card.updatesInWindow": (p) => `${p.count} อัปเดตใน ${p.days} วัน`,
  "card.strip": (p) => `มีอัปเดต ${p.active} วัน จาก ${p.days} วันที่ผ่านมา`,
  "card.paused": "พักอยู่",
  "card.byline": (p) => `, ${p.role}`,
  "more.button": "ขอดูอีก",

  "feed.title": "เพิ่งลงเมื่อกี้",
  "feed.reactions": (p) => `ถูกใจ ${p.hearts} ตอบกลับ ${p.replies}`,
  "feed.all": "ดูอัปเดตทั้งหมด",
  "feed.hub":
    "ทุกงานที่นี่โยงกลับมาที่ Hamster Hub ได้ เราดูทั้งงานและทีมก่อนขึ้นชั้น และเขียนไว้ชัดเจนว่าแต่ละงานหาเงินยังไง",
  "feed.hubLink": "อ่านวิธีคัดงานของเรา",

  "trust.title": "ทำไมถึงเชื่อของบนชั้นนี้ได้",
  "trust.lede": "เราอยากโชว์สิบงานที่กล้ารับรอง มากกว่าร้อยงานที่ไม่กล้า เลยมีกติกาอยู่ไม่กี่ข้อ",
  "trust.cta": "อ่านเช็กลิสต์ฉบับเต็ม",
  "trust.rule1.title": "มีคนของเราตรวจมาแล้ว",
  "trust.rule1.body":
    "ก่อนงานไหนจะขึ้นชั้น Hamster Hub ดูทั้งตัวงานและทีมที่ทำ เช็กลิสต์เปิดให้อ่านได้ คุณจะรู้เลยว่าเราดูอะไรบ้าง",
  "trust.rule2.title": "เรื่องเงิน เขียนไว้ให้เห็น",
  "trust.rule2.body":
    "ทุกงานบอกว่าหารายได้ยังไง ใครถือส่วนไหน และกำลังระดมทุนอยู่หรือเปล่า ไม่ต้องไปขุดหาใน pitch deck",
  "trust.rule3.title": "ดูมันเดินได้ด้วยตาตัวเอง",
  "trust.rule3.body":
    "แต่ละงานลงอัปเดตไปเรื่อย ๆ ถ้างานไหนเงียบ เราจะติดป้ายว่าพักอยู่ ไม่ปล่อยให้ดูเหมือนยังสดใหม่",
  "trust.rule4.title": "ทุกงานโยงกลับมาหาเรา",
  "trust.rule4.body":
    "ทุกงานระบุว่า Hamster Hub ลงอะไรไปบ้าง จะเป็นคน เงิน หรือเวลา ถ้างานไปได้ดี คุณจะรู้ว่ามันมาจากไหน",

  "voices.title": "คนที่เคยมาลองของที่นี่",
  "voices.lede": "ผู้เล่น ลูกค้า และนักลงทุนบางคน เราอ้างคำพูดเฉพาะคนที่ยินดีให้ใส่ชื่อ",

  "makers.title": "ทำงานที่ Hamster Hub ใช่ไหม เอางานมาวางบนชั้นสิ",
  "makers.body":
    "ลงสิ่งที่กำลังทำอยู่ แล้วก็ลงต่อไปเรื่อย ๆ อัปเดตสั้น ๆ ทุกหนึ่งหรือสองสัปดาห์ ได้ผลกว่าเปิดตัวใหญ่ปีละครั้ง แถมยังดันงานคุณขึ้นไปอยู่ข้างบนด้วย",
  "makers.link": "ดูตัวอย่างอัปเดตที่ดี",

  "foot.label": "ส่วนท้าย",
  "foot.run": "Hamster Nest ดูแลโดย Hamster Hub",
  "foot.howWePick": "เราคัดงานยังไง",
  "foot.ranking": "วิธีจัดอันดับ",
  "foot.investors": "สำหรับนักลงทุน",
  "foot.contact": "ติดต่อเรา",
  "foot.note": "ฉบับร่างดีไซน์ · ผลงาน ชื่อ และตัวเลขเป็นข้อมูลสมมติ",

  "page.project.title": (p) => `${p.name} — Hamster Nest`,
  "page.maker.title": (p) => `${p.name} — Hamster Nest`,
  "crumb.label": "ตอนนี้คุณอยู่ที่",

  "project.status": (p) => `${p.count} อัปเดตใน ${p.days} วัน · ล่าสุด${p.ago}`,
  "project.quiet": "ยังไม่มีอัปเดต",
  "project.position": (p) => `อันดับ ${p.n} ของสัปดาห์นี้`,
  "project.demo": "ลองเล่นเดโม",
  "project.follow": "บอกฉันเมื่องานนี้มีอัปเดต",
  "project.following": "คุณจะได้รู้ทุกครั้งที่งานนี้มีอัปเดต",
  "project.followers": (p) => `มีคนติดตาม ${p.count} คน`,
  "stream.title": "ช่วงนี้มีอะไรเกิดขึ้นบ้าง",
  "stream.filter": "ดูเฉพาะอัปเดตบางประเภท",
  "stream.all": (p) => `ทั้งหมด ${p.count}`,
  "stream.replies": () => "ตอบกลับ",
  "stream.readReply": "อ่านและตอบกลับ",
  "stream.older": (p) => `ดูอัปเดตเก่ากว่านี้อีก ${p.count} รายการ`,
  "money.title": "เรื่องเงิน",
  "money.lead": "คนทำเป็นคนเขียน Hamster Hub เป็นคนตรวจ ถ้าตัวเลขไหนเปลี่ยน จะมีบอกไว้ในอัปเดต",
  "money.earns": "หารายได้ยังไง",
  "money.owners": "ใครถือส่วนไหน",
  "money.raising": "กำลังระดมทุนไหม",
  "money.raisingYes": (p) => `ใช่ **${p.amount}** ${p.purpose}`,
  "money.raisingNo": "ตอนนี้ยังไม่ระดมทุน",
  "money.spent": "ใช้ไปแล้ว",
  "money.earned": "หาได้แล้ว",
  "money.checked": (p) => `Hamster Hub ตรวจเมื่อ ${p.date}`,
  "money.breakdown": "ดูรายละเอียดทั้งหมด",
  "hub.title": "ส่วนที่ Hamster Hub ลงไป",
  "hub.what": "เราตรวจอะไรบ้างก่อนงานขึ้นชั้น",
  "tried.title": "ใครเคยลองแล้วบ้าง",
  "tried.lead": "คนที่เคยเล่น เคยใช้ หรือลงเงินไปแล้ว และยินดีให้เราใส่ชื่อ",
  "maker.madeBy": "ทำโดย",
  "maker.roleYears": (p) => `${p.role} · อยู่ Hamster Hub มา ${p.years} ปี`,
  "maker.replyShort": (p) => `ปกติตอบกลับภายใน${thaiDayWords(p.days)}`,
  "maker.more": (p) => `ดูเพิ่มเติมเกี่ยวกับ${p.name}`,
  "facts.title": "ข้อมูลพื้นฐาน",
  "facts.category": "หมวด",
  "facts.genre": "แนว",
  "facts.stage": "งานไปถึงไหนแล้ว",
  "facts.started": "เริ่มเมื่อ",
  "facts.platforms": "ใช้ได้บน",
  "facts.team": "ทีม",

  "profile.role": (p) => `คนทำงาน · ${p.role} · อยู่ Hamster Hub ตั้งแต่ปี ${p.year}`,
  "profile.talk": "เรื่องที่ยินดีคุยด้วย",
  "profile.topicPrefill": (p) => `เรื่อง “${p.topic}”: `,
  "profile.portrait": "รูปจะอยู่ตรงนี้",
  "profile.numbers": "เป็นตัวเลข",
  "profile.projects": () => "ผลงาน",
  "profile.updates": (p) => `อัปเดตใน ${p.days} วัน`,
  "profile.awardsCount": () => "รางวัล",
  "profile.latest": (p) => `ล่าสุดจาก${p.name}`,
  "profile.readUpdate": "อ่านอัปเดตนี้",
  "profile.posted": (p) => `ลงอัปเดต ${p.active} วัน จาก ${p.days} วันที่ผ่านมา`,
  "profile.made": (p) => `ผลงานของ${p.name}`,
  "profile.earlier": "ก่อนหน้านี้",
  "profile.status.building": "กำลังทำอยู่ตอนนี้",
  "profile.status.live": "วางขายแล้ว ยังอัปเดตอยู่",
  "profile.status.paused": "พักอยู่",
  "profile.story": "เส้นทางที่ผ่านมา",
  "profile.awards": "รางวัลและการกล่าวถึง",
  "profile.ask": (p) => `มีอะไรอยากถาม${p.name}ไหม ถามได้เลย`,
  "profile.askBody": "สองสามบรรทัดก็พอ Hamster Hub จะได้สำเนาด้วย ข้อความจะได้ไม่ตกหล่น",
  "language.th": "ไทย",
  "language.en": "อังกฤษ",
  "language.ja": "ญี่ปุ่น",
  "language.zh": "จีน",

  "contact.title": (p) => `เขียนถึง${p.name}`,
  "contact.name": "ชื่อของคุณ",
  "contact.reach": (p) => `ให้${p.name}ติดต่อกลับทางไหนดี`,
  "contact.reachPlaceholder": "อีเมลก็ได้",
  "contact.reason": "มาที่นี่เพราะอะไร",
  "contact.reason.play": "อยากลองเล่น",
  "contact.reason.invest": "อาจจะสนใจลงทุน",
  "contact.reason.collaborate": "อยากทำงานด้วยกัน",
  "contact.reason.hello": "แค่แวะมาทักทาย",
  "contact.body": "อยากบอกอะไร",
  "contact.bodyPlaceholder": "สองสามบรรทัดก็พอ",
  "contact.copyNote": "Hamster Hub จะได้สำเนาด้วย ข้อความจะได้ไม่ตกหล่น",
  "contact.send": "ส่งเลย",
  "contact.sending": "กำลังส่ง…",
  "contact.sent": (p) => `ส่งแล้ว ปกติ${p.name}จะตอบกลับภายในสองสามวัน`,
  "contact.close": "ปิด",
  "contact.error.badEmail": "อีเมลดูไม่ค่อยถูก ลองเช็กอีกทีได้ไหม",
  "contact.error.emptyMessage": "ดูเหมือนยังไม่ได้เขียนข้อความ บรรทัดเดียวก็ได้",
  "contact.error.sendFailed": "ส่งไม่ผ่าน ข้อความของคุณยังอยู่ตรงนี้ ลองอีกครั้งในอีกสักครู่",

  "time.long": (age: RelativeAge) => {
    switch (age.unit) {
      case "now":
        return "เมื่อกี้";
      case "minute":
        return `${age.count} นาทีที่แล้ว`;
      case "hour":
        return `${age.count} ชม.ที่แล้ว`;
      case "yesterday":
        return "เมื่อวาน";
      case "day":
        return `${age.count} วันที่แล้ว`;
      case "week":
        return `${age.count} สัปดาห์ที่แล้ว`;
    }
  },
  "time.short": (age: RelativeAge) => {
    switch (age.unit) {
      case "now":
        return "เมื่อกี้";
      case "minute":
        return `${age.count} นาที`;
      case "hour":
        return `${age.count} ชม.`;
      case "yesterday":
        return "เมื่อวาน";
      case "day":
        return `${age.count} วัน`;
      case "week":
        return `${age.count} สัปดาห์`;
    }
  },
  "time.sentence": (age: RelativeAge) => {
    switch (age.unit) {
      case "now":
        return "เมื่อกี้";
      case "minute":
        return `เมื่อ ${age.count} นาทีก่อน`;
      case "hour":
        return `เมื่อ ${age.count} ชั่วโมงก่อน`;
      case "yesterday":
        return "เมื่อวาน";
      case "day":
        return `เมื่อ ${age.count} วันก่อน`;
      case "week":
        return `เมื่อ ${age.count} สัปดาห์ก่อน`;
    }
  },
};
