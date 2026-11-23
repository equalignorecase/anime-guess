"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface TeaserCharacter {
  id: number;
  jpName: string;
  enName: string;
  series: string;
  accent: string;
  image: string;
}

const TEASER_CHARACTERS: TeaserCharacter[] = [
  {
    id: 25,
    jpName: "ピカチュウ",
    enName: "Pikachu",
    series: "Pokémon #025",
    accent: "#DC2626",
    image:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png",
  },
  {
    id: 6,
    jpName: "リザードン",
    enName: "Charizard",
    series: "Pokémon #006",
    accent: "#EA580C",
    image:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png",
  },
  {
    id: 94,
    jpName: "ゲンガー",
    enName: "Gengar",
    series: "Pokémon #094",
    accent: "#7C3AED",
    image:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/94.png",
  },
  {
    id: 448,
    jpName: "ルカリオ",
    enName: "Lucario",
    series: "Pokémon #448",
    accent: "#2563EB",
    image:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/448.png",
  },
  {
    id: 150,
    jpName: "ミュウツー",
    enName: "Mewtwo",
    series: "Pokémon #150",
    accent: "#DB2777",
    image:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/150.png",
  },
];

export default function HeroTeaserCard() {
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const current = TEASER_CHARACTERS[index];

  const handleNext = () => {
    setRevealed(false);
    setImageLoaded(false);
    setIndex((prev) => (prev + 1) % TEASER_CHARACTERS.length);
  };

  return (
    <div className="rounded-2xl border border-[#EAE0D0] bg-white overflow-hidden shadow-sm">
      {/* Top Game Card Bar */}
      <div className="px-5 py-3.5 border-b border-[#EAE0D0] flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: current.accent }}
          />
          <span className="font-mono text-xs font-bold text-[#09090B]">
            MINI QUIZ PREVIEW
          </span>
        </div>
        <span
          className="font-mono text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg"
          style={{
            backgroundColor: revealed ? "#ECFDF5" : "#FEF2F2",
            color: revealed ? "#059669" : "#DC2626",
          }}
        >
          {revealed ? current.enName : "WHO'S THAT?"}
        </span>
      </div>

      {/* Character Silhouette Stage */}
      <div className="relative aspect-[4/3] w-full flex items-center justify-center bg-[#FAFAFA] dot-stage overflow-hidden">
        {revealed && (
          <div
            className="absolute inset-0 pointer-events-none opacity-15"
            style={{
              background: `radial-gradient(circle at center, ${current.accent} 0%, transparent 70%)`,
            }}
          />
        )}

        <div className="relative w-48 h-48 sm:w-56 sm:h-56 transition-transform duration-500">
          {!imageLoaded && (
            <div className="absolute inset-4 rounded-2xl bg-[#EAE0D0]/70 animate-pulse" />
          )}
          <Image
            key={current.id}
            src={current.image}
            alt={revealed ? current.enName : "Mystery character silhouette"}
            fill
            priority
            sizes="240px"
            onLoad={() => setImageLoaded(true)}
            className={`object-contain transition-all duration-300 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            } ${revealed ? "reveal scale-105" : "silhouette"}`}
          />
        </div>

        {/* Bottom Floating Name Tag when Revealed */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          <span className="font-mono text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-white/90 border border-[#E4E4E7] text-[#52525B]">
            {current.series}
          </span>
          {revealed && (
            <span
              className="text-xs font-bold px-3 py-1 rounded-lg text-white shadow-xs"
              style={{ backgroundColor: current.accent }}
            >
              {current.jpName} • {current.enName}
            </span>
          )}
        </div>
      </div>

      {/* Interactive Controls */}
      <div className="p-4 border-t border-[#E4E4E7] bg-white flex items-center gap-2.5">
        <button
          type="button"
          onClick={() => setRevealed((r) => !r)}
          style={{ backgroundColor: revealed ? "#09090B" : current.accent }}
          className="flex-1 h-10 px-4 rounded-xl text-white text-xs sm:text-sm font-bold hover:opacity-90 transition-opacity cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB]"
        >
          {revealed ? "ซ่อนเงาอีกครั้ง" : "ดูเฉลยตัวนี้"}
        </button>

        <button
          type="button"
          onClick={handleNext}
          className="h-10 px-4 rounded-xl bg-[#F4F4F5] text-[#09090B] text-xs sm:text-sm font-semibold hover:bg-[#E4E4E7] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB]"
        >
          สุ่มตัวใหม่
        </button>

        <Link
          href="/play?mode=pokemon"
          className="h-10 px-3.5 rounded-xl border border-[#E4E4E7] text-[#09090B] text-xs font-bold inline-flex items-center justify-center hover:border-[#09090B] transition-colors cursor-pointer"
          title="เข้าเล่นโหมด Pokémon"
          aria-label="เข้าเล่นโหมด Pokémon"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.2}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-6-6l6 6-6 6" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
