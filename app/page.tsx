import Link from "next/link";
import { Metadata } from "next";
import { GAME_MODES } from "./data/modes";
import { getModeCovers } from "./lib/animeCovers";
import ModeCatalog from "./components/ModeCatalog";
import HeroTeaserCard from "./components/HeroTeaserCard";
import ThemeToggle from "./components/ThemeToggle";

export const metadata: Metadata = {
  title: "AniGuess | เกมทายตัวละครอนิเมะและโปเกมอน",
  description:
    "ท้าทายความจำแฟนพันธุ์แท้อนิเมะ ทายชื่อตัวละครจากเงาและภาพเบลอ 14 เรื่องดัง ทั้ง Pokémon, One Piece, Naruto และอีกมากมาย",
};

export default async function LandingPage() {
  const covers = await getModeCovers();

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFDF7] dark:bg-[#12100E] text-[#181411] dark:text-[#F5EFE6]">
      {/* Header */}
      <header className="border-b border-[#EAE0D0] dark:border-[#2E2924] bg-[#FFFDF7]/90 dark:bg-[#12100E]/90 sticky top-0 z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-4">
          <Link
            href="/"
            className="flex items-center gap-2.5 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#EA580C]"
          >
            <span className="w-7 h-7 rounded-lg bg-[#EA580C] text-white flex items-center justify-center font-mono text-xs font-bold shadow-xs">
              A
            </span>
            <span className="font-bold text-xl tracking-tight text-[#181411] dark:text-[#F5EFE6]">
              AniGuess
            </span>
            <span className="hidden sm:inline-block font-mono text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-md bg-[#FFF7ED] dark:bg-[#25211D] border border-[#FED7AA] dark:border-[#EA580C]/40 text-[#C2410C] dark:text-[#FB923C] font-semibold">
              14 Series
            </span>
          </Link>

          <nav className="flex items-center gap-3 sm:gap-4">
            <a
              href="#modes"
              className="text-sm font-medium text-[#645B52] dark:text-[#A89F94] hover:text-[#181411] dark:hover:text-[#F5EFE6] transition-colors hidden sm:inline cursor-pointer"
            >
              เลือกเรื่องทั้งหมด
            </a>
            <ThemeToggle />
            <Link
              href="/play"
              className="px-4 sm:px-5 py-2 rounded-xl bg-[#EA580C] text-white text-sm font-semibold hover:bg-[#C2410C] transition-colors shadow-xs cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EA580C]"
            >
              เริ่มเล่นเลย
            </Link>
          </nav>
        </div>
      </header>

      {/* Anime Game Lobby Hero */}
      <main className="flex-1 relative">
        <section className="relative border-b border-[#EAE0D0] dark:border-[#2E2924] bg-white dark:bg-[#1B1815] overflow-hidden">
          {/* Manga Speedlines + Screentone Background */}
          <div
            className="absolute inset-0 manga-speedlines pointer-events-none opacity-85"
            aria-hidden="true"
          />
          <div
            className="absolute inset-y-0 right-0 w-full lg:w-1/2 manga-screentone pointer-events-none opacity-90"
            style={{
              maskImage: "radial-gradient(ellipse at 75% 45%, black 20%, transparent 75%)",
              WebkitMaskImage: "radial-gradient(ellipse at 75% 45%, black 20%, transparent 75%)",
            }}
            aria-hidden="true"
          />

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-12 sm:py-16 lg:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
              {/* Left Column */}
              <div className="lg:col-span-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FFF7ED] dark:bg-[#25211D] border border-[#FED7AA] dark:border-[#EA580C]/40 text-[#C2410C] dark:text-[#FB923C] text-xs font-semibold mb-6">
                  <span className="w-2 h-2 rounded-full bg-[#EA580C]" />
                  <span>14 เรื่องดัง • รองรับชื่อญี่ปุ่น &amp; อังกฤษ</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-[#181411] dark:text-[#F5EFE6] mb-5">
                  ทายชื่อตัวละคร
                  <span className="block text-[#EA580C] mt-1">
                    จากเงาและภาพเบลอ
                  </span>
                </h1>

                <p className="text-base sm:text-lg text-[#645B52] dark:text-[#A89F94] max-w-xl leading-relaxed mb-8">
                  ท้าทายความจำสายอนิเมะและโปเกมอน ลองกดดูตัวอย่างเงาด้านข้างหรือเลือกเรื่องที่ชอบด้านล่างเพื่อเริ่มเก็บสตรีคได้เลย
                </p>

                <div className="flex flex-wrap items-center gap-3.5 mb-8">
                  <Link
                    href="/play"
                    className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-[#EA580C] text-white font-bold text-base hover:bg-[#C2410C] transition-colors shadow-sm cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EA580C]"
                  >
                    <span>เข้าเล่นทันที</span>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 12h14m-6-6l6 6-6 6"
                      />
                    </svg>
                  </Link>

                  <a
                    href="#modes"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white dark:bg-[#25211D] border border-[#EAE0D0] dark:border-[#2E2924] text-[#181411] dark:text-[#F5EFE6] font-bold text-base hover:border-[#EA580C]/50 hover:bg-[#FFF7ED]/60 dark:hover:bg-[#2E2924] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EA580C]"
                  >
                    <span>ดูทั้ง 14 เรื่อง</span>
                  </a>
                </div>

                {/* 14-Series Color Spectrum */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5" aria-hidden="true">
                    {GAME_MODES.map((m) => (
                      <span
                        key={m.id}
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: m.accent }}
                        title={m.name}
                      />
                    ))}
                  </div>
                  <span className="font-mono text-xs text-[#645B52] dark:text-[#A89F94]">
                    Pokémon • One Piece • Bleach • JJK &amp; more
                  </span>
                </div>
              </div>

              {/* Right Column: Interactive Mini Quiz Preview */}
              <div className="lg:col-span-6">
                <HeroTeaserCard />
              </div>
            </div>
          </div>
        </section>

        {/* How to Play: 3 Steps */}
        <section className="border-b border-[#EAE0D0] dark:border-[#2E2924] bg-[#FFFDF7] dark:bg-[#12100E]">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 sm:py-16">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-[#EA580C] font-semibold mb-2">
                  <span className="w-2 h-2 rounded-full bg-[#EA580C]" />
                  HOW TO PLAY
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#181411] dark:text-[#F5EFE6]">
                  เล่นง่ายใน 3 ขั้นตอน
                </h2>
              </div>
              <p className="text-sm text-[#645B52] dark:text-[#A89F94]">
                พร้อมระบบบันทึกสถิติสูงสุดแยกตามเรื่องอัตโนมัติ
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
              <div className="rounded-2xl border border-[#EAE0D0] dark:border-[#2E2924] bg-white dark:bg-[#1B1815] p-6 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-[#FFF7ED] dark:bg-[#25211D] text-[#EA580C]">
                    STEP 01
                  </span>
                  <svg
                    className="w-5 h-5 text-[#EA580C]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#181411] dark:text-[#F5EFE6] mb-1.5">
                    เลือกเรื่องที่ถนัด
                  </h3>
                  <p className="text-sm text-[#645B52] dark:text-[#A89F94] leading-relaxed">
                    เลือกจาก 14 ซีรีส์ดัง ทั้ง Pokémon (เงาดำ + เสียงร้อง) และอนิเมะอีก 13 เรื่อง (ภาพเบลอ)
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-[#EAE0D0] dark:border-[#2E2924] bg-white dark:bg-[#1B1815] p-6 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-[#EFF6FF] dark:bg-[#1E293B] text-[#2563EB] dark:text-[#60A5FA]">
                    STEP 02
                  </span>
                  <svg
                    className="w-5 h-5 text-[#2563EB] dark:text-[#60A5FA]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#181411] dark:text-[#F5EFE6] mb-1.5">
                    พิมพ์ทายได้ 2 ภาษา
                  </h3>
                  <p className="text-sm text-[#645B52] dark:text-[#A89F94] leading-relaxed">
                    รองรับทั้งชื่อภาษาญี่ปุ่นและอังกฤษ/โรมันจิ พร้อมตัวช่วย Autocomplete ระหว่างพิมพ์
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-[#EAE0D0] dark:border-[#2E2924] bg-white dark:bg-[#1B1815] p-6 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-[#ECFDF5] dark:bg-[#064E3B]/50 text-[#059669] dark:text-[#34D399]">
                    STEP 03
                  </span>
                  <svg
                    className="w-5 h-5 text-[#059669] dark:text-[#34D399]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#181411] dark:text-[#F5EFE6] mb-1.5">
                    สะสมสตรีค &amp; ใช้คำใบ้
                  </h3>
                  <p className="text-sm text-[#645B52] dark:text-[#A89F94] leading-relaxed">
                    ตอบถูกต่อเนื่องเพื่อทำลายสถิติสูงสุดของแต่ละเรื่อง หรือกดดูคำใบ้ (-1 สตรีค) เมื่อเจอตัวหิน
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Poster Lobby Catalog */}
        <div className="relative">
          <div
            className="absolute inset-0 manga-screentone pointer-events-none opacity-65"
            aria-hidden="true"
          />
          <div className="relative z-10">
            <ModeCatalog covers={covers} />
          </div>
        </div>
      </main>

      {/* Clean Footer */}
      <footer className="border-t border-[#EAE0D0] dark:border-[#2E2924] bg-white dark:bg-[#1B1815]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-xs text-[#645B52] dark:text-[#A89F94]">
          <span>AniGuess — Anime &amp; Pokémon Quiz</span>
          <span>Powered by PokéAPI &amp; AniList</span>
        </div>
      </footer>
    </div>
  );
}
