export type ModeCategory = "MONSTER" | "SHONEN" | "DARK" | "SPORTS" | "MYSTERY";

export interface GameModeInfo {
  id: string;
  index: string;
  name: string;
  jpTitle: string;
  category: ModeCategory;
  mechanic: "SILHOUETTE + CRY" | "MONOCHROME BLUR";
  tagline: string;
  jikanId: number | null;
  accent: string;
  softBg: string;
}

export const MODE_CATEGORIES: readonly { id: "ALL" | ModeCategory; label: string }[] = [
  { id: "ALL", label: "ทั้งหมด" },
  { id: "SHONEN", label: "Shonen" },
  { id: "DARK", label: "Dark" },
  { id: "MONSTER", label: "Monster" },
  { id: "MYSTERY", label: "Mystery" },
  { id: "SPORTS", label: "Sports" },
] as const;

export const GAME_MODES: readonly GameModeInfo[] = [
  {
    id: "pokemon",
    index: "01",
    name: "Pokémon",
    jpTitle: "ポケットモンスター",
    category: "MONSTER",
    mechanic: "SILHOUETTE + CRY",
    tagline: "ทายชื่อโปเกมอนจากเงาดำและเสียงร้องต้นฉบับกว่า 1,025 สายพันธุ์",
    jikanId: null,
    accent: "#DC2626",
    softBg: "#FEF2F2",
  },
  {
    id: "one-piece",
    index: "02",
    name: "One Piece",
    jpTitle: "ONE PIECE",
    category: "SHONEN",
    mechanic: "MONOCHROME BLUR",
    tagline: "ทดสอบความจำลูกเรือหมวกฟางและโจรสลัดแห่งแกรนด์ไลน์",
    jikanId: 21,
    accent: "#EA580C",
    softBg: "#FFF7ED",
  },
  {
    id: "naruto",
    index: "03",
    name: "Naruto",
    jpTitle: "NARUTO -ナルト-",
    category: "SHONEN",
    mechanic: "MONOCHROME BLUR",
    tagline: "เหล่านินจาแห่งโคโนฮะและแสงอุษาจากภาพเบลอขาวดำ",
    jikanId: 20,
    accent: "#D97706",
    softBg: "#FFFBEB",
  },
  {
    id: "demon-slayer",
    index: "04",
    name: "Demon Slayer",
    jpTitle: "鬼滅の刃",
    category: "SHONEN",
    mechanic: "MONOCHROME BLUR",
    tagline: "นักล่าอสูร เสาหลัก และอสูรข้างขึ้นจากดาบพิฆาตอสูร",
    jikanId: 38000,
    accent: "#059669",
    softBg: "#ECFDF5",
  },
  {
    id: "jujutsu-kaisen",
    index: "05",
    name: "Jujutsu Kaisen",
    jpTitle: "呪術廻戦",
    category: "DARK",
    mechanic: "MONOCHROME BLUR",
    tagline: "ผู้ใช้คุณไสยและคำสาประดับพิเศษจากมหาเวทย์ผนึกมาร",
    jikanId: 40748,
    accent: "#4F46E5",
    softBg: "#EEF2FF",
  },
  {
    id: "aot",
    index: "06",
    name: "Attack on Titan",
    jpTitle: "進撃の巨人",
    category: "DARK",
    mechanic: "MONOCHROME BLUR",
    tagline: "หน่วยสำรวจและผู้สืบทอดพลังไททันหลังกำแพงมาเรีย",
    jikanId: 16498,
    accent: "#57534E",
    softBg: "#F5F5F4",
  },
  {
    id: "dragon-ball",
    index: "07",
    name: "Dragon Ball",
    jpTitle: "ドラゴンボール",
    category: "SHONEN",
    mechanic: "MONOCHROME BLUR",
    tagline: "นักรบชาวไซย่าและคู่ปรับระดับจักรวาลตลอดกาล",
    jikanId: 813,
    accent: "#C2410C",
    softBg: "#FFF7ED",
  },
  {
    id: "bleach",
    index: "08",
    name: "Bleach",
    jpTitle: "BLEACH",
    category: "SHONEN",
    mechanic: "MONOCHROME BLUR",
    tagline: "ยมทูต 13 หน่วยพิทักษ์ อารันคาร์ และควินซี",
    jikanId: 269,
    accent: "#7C3AED",
    softBg: "#F5F3FF",
  },
  {
    id: "hunter-x-hunter",
    index: "09",
    name: "Hunter x Hunter",
    jpTitle: "HUNTER×HUNTER",
    category: "SHONEN",
    mechanic: "MONOCHROME BLUR",
    tagline: "ฮันเตอร์ผู้ใช้เน็นและสมาชิกกองโจรเงามายา",
    jikanId: 11061,
    accent: "#16A34A",
    softBg: "#F0FDF4",
  },
  {
    id: "mha",
    index: "10",
    name: "My Hero Academia",
    jpTitle: "僕のヒーローアカデミア",
    category: "SHONEN",
    mechanic: "MONOCHROME BLUR",
    tagline: "นักเรียนห้อง 1-A โปรฮีโร่ และสมาพันธ์วิลเลิน",
    jikanId: 31964,
    accent: "#0284C7",
    softBg: "#F0F9FF",
  },
  {
    id: "spy-xfamily",
    index: "11",
    name: "Spy x Family",
    jpTitle: "SPY×FAMILY",
    category: "MYSTERY",
    mechanic: "MONOCHROME BLUR",
    tagline: "ครอบครัวปลอมสุดป่วน สายลับ นักฆ่า และผู้มีพลังจิต",
    jikanId: 50265,
    accent: "#DB2777",
    softBg: "#FDF2F8",
  },
  {
    id: "haikyuu",
    index: "12",
    name: "Haikyuu!!",
    jpTitle: "ハイキュー!!",
    category: "SPORTS",
    mechanic: "MONOCHROME BLUR",
    tagline: "นักตบลูกยางจากคาราสึโนะและโรงเรียนคู่แข่งทั่วญี่ปุ่น",
    jikanId: 20583,
    accent: "#E11D48",
    softBg: "#FFF1F2",
  },
  {
    id: "death-note",
    index: "13",
    name: "Death Note",
    jpTitle: "デスノート",
    category: "DARK",
    mechanic: "MONOCHROME BLUR",
    tagline: "การชิงไหวชิงพริบระหว่างคิระ นักสืบ L และยมทูต",
    jikanId: 1535,
    accent: "#18181B",
    softBg: "#F4F4F5",
  },
  {
    id: "conan",
    index: "14",
    name: "Detective Conan",
    jpTitle: "名探偵コナン",
    category: "MYSTERY",
    mechanic: "MONOCHROME BLUR",
    tagline: "ยอดนักสืบจิ๋ว ขบวนการนักสืบเยาวชน และองค์กรชุดดำ",
    jikanId: 235,
    accent: "#2563EB",
    softBg: "#EFF6FF",
  },
] as const;

export type GameMode = (typeof GAME_MODES)[number]["id"];

export function isValidGameMode(value?: string | null): value is GameMode {
  return Boolean(value && GAME_MODES.some((m) => m.id === value));
}
