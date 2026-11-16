import { Genre } from "@/domain";

/**
 * Genre definitions. The order here is the order the filter list shows them in.
 * To add a genre: add a line here, then use its id on a project.
 */
export const sampleGenres: readonly Genre[] = [
  new Genre("roguelike", "Roguelike", "game", ["rogue-lite", "dungeon"]),
  new Genre("puzzle", "Puzzle", "game", ["ปริศนา"]),
  new Genre("casual", "Casual", "game", ["party", "เล่นง่าย"]),
  new Genre("co-op", "Co-op", "game", ["coop", "multiplayer", "two-player", "เล่นสองคน", "เล่นกับเพื่อน"]),
  new Genre("saas", "SaaS", "web", ["software", "subscription"]),
  new Genre("dev-tool", "Dev tool", "web", ["devtool", "developer", "นักพัฒนา"]),
  new Genre("smart-farm", "Smart farm", "iot", ["agritech", "farm", "ฟาร์ม", "เกษตร"]),
  new Genre("fintech", "FinTech", "idea", ["finance", "money", "การเงิน"]),
  new Genre("ecommerce", "Ecommerce", "web", ["shop", "store", "ร้านออนไลน์"]),
  new Genre("water", "Water", "iot", ["pond", "น้ำ"]),
  new Genre("wearable", "Wearable", "iot", ["tracker"]),
  new Genre("community", "Community", "idea", ["sharing", "ชุมชน"]),
  new Genre("logistics", "Logistics", "idea", ["transport", "ขนส่ง"]),
];
