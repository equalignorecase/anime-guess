# AniGuess

เกมทายชื่อตัวละครอนิเมะและโปเกมอนจากเงาและภาพเบลอ พัฒนาด้วย Next.js 16 (App Router) และ Tailwind CSS v4

## ฟีเจอร์หลัก

- **14 หมวดหมู่ซีรีส์ดัง**: Pokémon, One Piece, Naruto, Demon Slayer, Jujutsu Kaisen, Attack on Titan, Dragon Ball, Bleach, Hunter x Hunter, My Hero Academia, Spy x Family, Haikyuu!!, Death Note และ Detective Conan
- **ระบบทาย 2 รูปแบบ**:
  - **Pokémon**: ทายจากเงาดำ (Silhouette) พร้อมปุ่มฟังเสียงร้องต้นฉบับ (Cry)
  - **อนิเมะ 13 เรื่อง**: ทายจากภาพเบลอขาวดำ (Monochrome Blur)
- **พิมพ์ตอบได้ทั้ง 2 ภาษา**: รองรับทั้งชื่อภาษาญี่ปุ่น (Kanji / Kana) และภาษาอังกฤษ/โรมันจิ พร้อมระบบ Autocomplete ระหว่างพิมพ์
- **คำใบ้และสถิติสูงสุด**: แลก 1 คะแนน Streak เพื่อดูคำใบ้ และบันทึกสถิติสูงสุด (Best Record) แยกตามหมวดหมู่ใน `localStorage`
- **Mini Quiz บนหน้าแรก**: ทดลองทายเงาตัวละครและกรองดูหมวดหมู่ตามประเภท (Shonen, Dark, Monster, Mystery, Sports)

## เทคโนโลยีที่ใช้

- **Framework**: Next.js 16.2.3 (App Router, Turbopack)
- **UI & Styling**: React 19, Tailwind CSS v4, `next/font/google` (`Noto Sans Thai`, `Plus Jakarta Sans`, `JetBrains Mono`)
- **APIs**:
  - [PokéAPI](https://pokeapi.co/) สำหรับข้อมูล ภาพ และเสียงร้องโปเกมอน
  - [AniList GraphQL API](https://anilist.gitbook.io/anilist-apiv2-docs/) ผ่าน Next.js Route Handler (`/api/anime-characters`) และ Server Component (`app/lib/animeCovers.ts`)

## การติดตั้งและรันโปรเจกต์

1. ติดตั้ง dependencies:

```bash
npm install
```

2. รันเซิร์ฟเวอร์สำหรับพัฒนา:

```bash
npm run dev
```

เปิดเบราว์เซอร์ไปที่ [http://localhost:3000](http://localhost:3000)

3. คำสั่งตรวจสอบและ Build สำหรับ Production:

```bash
npm run lint
npm run build
npm run start
```

## โครงสร้างไฟล์สำคัญ

- `app/page.tsx` — หน้าแรก (Hero, วิธีเล่น 3 ขั้นตอน, สารบัญ 14 เรื่อง)
- `app/components/HeroTeaserCard.tsx` — มินิการ์ดเงาตัวละครตัวอย่างบนหน้าแรก
- `app/components/ModeCatalog.tsx` — ตัวกรองหมวดหมู่และการ์ด 14 เรื่อง
- `app/play/page.tsx` & `app/play/PlayClient.tsx` — หน้าเล่นเกมทายตัวละคร
- `app/api/anime-characters/route.ts` — API Proxy สำหรับดึงตัวละครจาก AniList
- `app/data/modes.ts` — ข้อมูลและธีมสีประจำทั้ง 14 หมวดหมู่
