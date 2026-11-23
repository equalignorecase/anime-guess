"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { GAME_MODES, MODE_CATEGORIES, type ModeCategory } from "../data/modes";
import type { AnimeCoverData } from "../lib/animeCovers";

interface ModeCatalogProps {
  covers: Record<string, AnimeCoverData>;
}

export default function ModeCatalog({ covers }: ModeCatalogProps) {
  const [selectedCategory, setSelectedCategory] = useState<"ALL" | ModeCategory>("ALL");

  const filteredModes =
    selectedCategory === "ALL"
      ? GAME_MODES
      : GAME_MODES.filter((m) => m.category === selectedCategory);

  return (
    <section id="modes" className="max-w-7xl mx-auto px-4 sm:px-8 py-14 sm:py-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-[#EA580C] font-semibold mb-2">
            <span className="w-2 h-2 rounded-full bg-[#EA580C]" />
            ANIME GAME LOBBY
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#181411] dark:text-[#F5EFE6]">
            เลือกเรื่องที่อยากท้าทาย
          </h2>
        </div>

        {/* Category Filter Pills */}
        <div
          className="flex flex-wrap gap-2"
          role="tablist"
          aria-label="กรองตามหมวดหมู่"
        >
          {MODE_CATEGORIES.map((cat) => {
            const active = selectedCategory === cat.id;
            const count =
              cat.id === "ALL"
                ? GAME_MODES.length
                : GAME_MODES.filter((m) => m.category === cat.id).length;

            return (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 border focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EA580C] ${
                  active
                    ? "bg-[#EA580C] text-white border-[#EA580C] shadow-xs"
                    : "bg-white dark:bg-[#1B1815] text-[#645B52] dark:text-[#A89F94] border-[#EAE0D0] dark:border-[#2E2924] hover:border-[#EA580C]/40 hover:text-[#181411] dark:hover:text-[#F5EFE6]"
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`font-mono text-[10px] ${
                    active ? "text-orange-100" : "text-[#9A8F82]"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Anime Poster Lobby Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
        {filteredModes.map((m) => {
          const cover = covers[m.id]?.coverUrl;
          const isPokemon = m.id === "pokemon";

          return (
            <Link
              key={m.id}
              href={`/play?mode=${m.id}`}
              className="group bg-white dark:bg-[#1B1815] rounded-2xl border border-[#EAE0D0] dark:border-[#2E2924] p-4 flex gap-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:border-[#EA580C]/40 dark:hover:border-[#EA580C]/60 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EA580C]"
            >
              {/* Left Poster Thumbnail */}
              <div
                className="relative w-24 sm:w-28 aspect-[3/4] shrink-0 rounded-xl overflow-hidden border border-[#E4E4E7] dark:border-[#2E2924]"
                style={{ backgroundColor: m.softBg }}
              >
                {cover ? (
                  <Image
                    src={cover}
                    alt={m.name}
                    fill
                    sizes="120px"
                    className={`${
                      isPokemon ? "object-contain p-2.5" : "object-cover"
                    } transition-transform duration-300 group-hover:scale-105`}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-mono text-lg font-bold" style={{ color: m.accent }}>
                    {m.index}
                  </div>
                )}
                <span
                  className="absolute top-1.5 left-1.5 font-mono text-[10px] font-bold px-1.5 py-0.5 rounded-md text-white shadow-xs"
                  style={{ backgroundColor: m.accent }}
                >
                  {m.index}
                </span>
              </div>

              {/* Right Series Details */}
              <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span
                      className="font-mono text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md truncate"
                      style={{ backgroundColor: m.softBg, color: m.accent }}
                    >
                      {m.mechanic === "SILHOUETTE + CRY" ? "เงา + เสียง" : "ภาพเบลอ"}
                    </span>
                    <span className="font-mono text-[10px] text-[#71717A] shrink-0">
                      {m.category}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[#181411] dark:text-[#F5EFE6] group-hover:text-[#EA580C] transition-colors truncate">
                    {m.name}
                  </h3>
                  <p className="font-mono text-[11px] text-[#71717A] dark:text-[#A89F94] truncate mb-2">
                    {m.jpTitle}
                  </p>
                  <p className="text-xs sm:text-sm text-[#52525B] dark:text-[#A89F94] leading-relaxed line-clamp-2">
                    {m.tagline}
                  </p>
                </div>

                <div className="flex items-center justify-end pt-2">
                  <span
                    className="inline-flex items-center gap-1 text-xs font-bold transition-transform group-hover:translate-x-0.5"
                    style={{ color: m.accent }}
                  >
                    <span>เข้าเล่น</span>
                    <svg
                      className="w-3.5 h-3.5"
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
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
