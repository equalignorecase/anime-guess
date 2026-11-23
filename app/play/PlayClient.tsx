"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { GAME_MODES, type GameMode } from "../data/modes";
import ThemeToggle from "../components/ThemeToggle";

interface NameOption {
  primary: string;
  secondary?: string;
  aliases: string[];
}

interface GameEntry {
  id: number;
  name: string;
  jpName: string;
  enName?: string;
  aliases: string[];
  image: string;
  latestCry?: string;
  hint?: string;
}

interface AnimeCharacterItem {
  id: number;
  role: string;
  favorites: number;
  name: string;
  jpName: string;
  image: string;
}

interface PokemonNameEntry {
  language: { name: string };
  name: string;
}

interface PokemonTypeEntry {
  type: { name: string };
}

function buildAnimeAliases(name: string, kanji?: string | null): string[] {
  const aliases = new Set<string>();
  const trimmed = name.trim();
  if (trimmed) {
    aliases.add(trimmed.toLowerCase());
    if (trimmed.includes(",")) {
      const parts = trimmed.split(",").map((p) => p.trim()).filter(Boolean);
      if (parts.length === 2) {
        aliases.add(`${parts[1]} ${parts[0]}`.toLowerCase());
      }
    }
  }
  if (kanji?.trim()) {
    aliases.add(kanji.trim().toLowerCase());
  }
  return Array.from(aliases);
}

function formatDisplayEnglishName(name: string): string {
  if (!name.includes(",")) return name;
  const parts = name.split(",").map((p) => p.trim()).filter(Boolean);
  return parts.length === 2 ? `${parts[1]} ${parts[0]}` : name;
}

export default function PlayClient({ initialMode }: { initialMode: GameMode }) {
  const [mode, setMode] = useState<GameMode>(initialMode);
  const [entry, setEntry] = useState<GameEntry | null>(null);
  const [guess, setGuess] = useState("");
  const [status, setStatus] = useState<"guessing" | "revealed" | "loading">("loading");
  const [streak, setStreak] = useState(0);

  const initialScores = GAME_MODES.reduce(
    (acc, curr) => ({ ...acc, [curr.id]: 0 }),
    {} as Record<GameMode, number>
  );
  const [highScore, setHighScore] = useState<Record<GameMode, number>>(initialScores);

  const [message, setMessage] = useState("");
  const [messageTone, setMessageTone] = useState<"neutral" | "success" | "error">("neutral");
  const [shake, setShake] = useState(false);
  const [allNames, setAllNames] = useState<NameOption[]>([]);
  const [suggestions, setSuggestions] = useState<NameOption[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const activeModeRef = useRef<GameMode>(mode);
  const pokemonNamesCacheRef = useRef<NameOption[] | null>(null);
  const animeCacheRef = useRef<Record<string, AnimeCharacterItem[]>>({});
  const inFlightAnimeRef = useRef<Record<string, Promise<AnimeCharacterItem[]>>>({});
  const currentModeInfo = GAME_MODES.find((m) => m.id === mode) || GAME_MODES[0];

  useEffect(() => {
    activeModeRef.current = mode;
  }, [mode]);

  // Load high scores from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("pokemon-highscores-vfinal-extend");
      if (saved) {
        setHighScore((prev) => ({ ...prev, ...JSON.parse(saved) }));
      }
    } catch {
      // Ignore malformed storage
    }
  }, []);

  // Persist high scores
  useEffect(() => {
    try {
      localStorage.setItem("pokemon-highscores-vfinal-extend", JSON.stringify(highScore));
    } catch {
      // Ignore storage quota errors
    }
  }, [highScore]);

  // Preload Pokémon autocomplete pool once
  useEffect(() => {
    if (mode !== "pokemon") return;
    if (pokemonNamesCacheRef.current) {
      setAllNames(pokemonNamesCacheRef.current);
      return;
    }

    let cancelled = false;
    const loadPokemonPool = async () => {
      try {
        const res = await Promise.all(
          Array.from({ length: 151 }, (_, i) =>
            fetch(`https://pokeapi.co/api/v2/pokemon-species/${i + 1}`).then((r) => r.json())
          )
        );
        if (cancelled) return;
        const options: NameOption[] = res.map((sData) => {
          const jpEntry = sData.names?.find((n: PokemonNameEntry) => n.language.name === "ja-Hrkt");
          const enEntry = sData.names?.find((n: PokemonNameEntry) => n.language.name === "en");
          const jp = jpEntry ? jpEntry.name : sData.name;
          const en = enEntry ? enEntry.name : sData.name;
          return {
            primary: jp,
            secondary: en,
            aliases: Array.from(
              new Set([jp.toLowerCase(), en.toLowerCase(), String(sData.name).toLowerCase()])
            ),
          };
        });
        pokemonNamesCacheRef.current = options;
        if (activeModeRef.current === "pokemon") {
          setAllNames(options);
        }
      } catch (e) {
        console.error(e);
      }
    };
    loadPokemonPool();
    return () => {
      cancelled = true;
    };
  }, [mode]);

  const loadAnimeCharacters = useCallback(async (targetMode: GameMode, malId: number) => {
    const cached = animeCacheRef.current[targetMode];
    if (cached) return cached;

    const existingPromise = inFlightAnimeRef.current[targetMode];
    if (existingPromise) return existingPromise;

    const requestPromise = (async (): Promise<AnimeCharacterItem[]> => {
      const res = await fetch(`/api/anime-characters?malId=${malId}`);
      if (!res.ok) {
        throw new Error(`Anime API error: ${res.status}`);
      }

      const json = await res.json();
      const chars: AnimeCharacterItem[] = Array.isArray(json?.characters)
        ? json.characters
        : [];

      if (chars.length === 0) {
        throw new Error("No valid characters found");
      }

      animeCacheRef.current[targetMode] = chars;
      return chars;
    })();

    inFlightAnimeRef.current[targetMode] = requestPromise;
    try {
      return await requestPromise;
    } finally {
      delete inFlightAnimeRef.current[targetMode];
    }
  }, []);

  const playCry = (url?: string) => {
    if (mode === "pokemon" && url) {
      const audio = new Audio(url);
      audio.volume = 0.4;
      audio.play().catch((e) => console.log("Audio play blocked", e));
    }
  };

  const fetchRandomEntry = useCallback(
    async (currentMode: GameMode) => {
      setStatus("loading");
      setEntry(null);
      setImageLoaded(false);
      setMessage("");
      setMessageTone("neutral");
      setGuess("");
      setSuggestions([]);
      setShowSuggestions(false);
      setShowHint(false);
      setHintUsed(false);

      try {
        if (currentMode === "pokemon") {
          const randomId = Math.floor(Math.random() * 1025) + 1;
          const [pRes, sRes] = await Promise.all([
            fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`),
            fetch(`https://pokeapi.co/api/v2/pokemon-species/${randomId}`),
          ]);
          if (!pRes.ok || !sRes.ok) throw new Error("PokéAPI error");
          const pData = await pRes.json();
          const sData = await sRes.json();
          if (activeModeRef.current !== currentMode) return;

          const jpEntry = sData.names?.find((n: PokemonNameEntry) => n.language.name === "ja-Hrkt");
          const enEntry = sData.names?.find((n: PokemonNameEntry) => n.language.name === "en");
          const jpName: string = jpEntry ? jpEntry.name : pData.name;
          const enName: string = enEntry ? enEntry.name : pData.name;
          const aliases = Array.from(
            new Set([jpName.toLowerCase(), enName.toLowerCase(), String(pData.name).toLowerCase()])
          );

          setEntry({
            id: pData.id,
            name: jpName,
            jpName,
            enName,
            aliases,
            image: pData.sprites.other["official-artwork"].front_default || pData.sprites.front_default,
            latestCry: pData.cries?.latest || "",
            hint: `ธาตุ: ${pData.types?.map((t: PokemonTypeEntry) => t.type.name).join(", ")} | สีหลัก: ${sData.color?.name || "ลึกลับ"}`,
          });

          setAllNames((prev) =>
            prev.some((item) => item.primary === jpName)
              ? prev
              : [...prev, { primary: jpName, secondary: enName, aliases }]
          );
        } else {
          const modeInfo = GAME_MODES.find((m) => m.id === currentMode);
          if (!modeInfo?.jikanId) throw new Error("Invalid Mode");

          const chars = await loadAnimeCharacters(currentMode, modeInfo.jikanId);
          if (activeModeRef.current !== currentMode) return;

          const options: NameOption[] = chars.map((c) => {
            const jp = c.jpName;
            const en = formatDisplayEnglishName(c.name);
            return {
              primary: jp,
              secondary: jp !== en ? en : undefined,
              aliases: buildAnimeAliases(c.name, c.jpName),
            };
          });
          setAllNames(options);

          const rand = chars[Math.floor(Math.random() * chars.length)];
          const jpName = rand.jpName;
          const enName = formatDisplayEnglishName(rand.name);
          const hintText = `บทบาท: ${rand.role === "Main" ? "ตัวละครหลัก" : "ตัวละครสมทบ"}\nยอดคนโปรด: ${rand.favorites.toLocaleString()} คน\nอักษรขึ้นต้น: ${jpName.charAt(0)} (${enName.charAt(0)})`;

          setEntry({
            id: rand.id,
            name: jpName,
            jpName,
            enName: jpName !== enName ? enName : undefined,
            aliases: buildAnimeAliases(rand.name, rand.jpName),
            image: rand.image,
            hint: hintText,
          });
        }
        setStatus("guessing");
        setTimeout(() => inputRef.current?.focus(), 50);
      } catch (error) {
        console.error(error);
        if (activeModeRef.current !== currentMode) return;
        setStatus("guessing");
        setMessage("โหลดข้อมูลไม่สำเร็จ ลองกดสลับหมวดหรือลองใหม่อีกครั้ง");
        setMessageTone("error");
      }
    },
    [loadAnimeCharacters]
  );

  useEffect(() => {
    fetchRandomEntry(mode);
  }, [mode, fetchRandomEntry]);

  const handleGuess = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!entry) return;

    if (status === "revealed") {
      fetchRandomEntry(mode);
      return;
    }

    if (status !== "guessing") return;

    const normalized = guess.trim().toLowerCase();
    if (!normalized) return;

    const isMatch = entry.aliases.includes(normalized);
    if (isMatch) {
      setStatus("revealed");
      setStreak((s) => {
        const next = s + 1;
        if (next > (highScore[mode] || 0)) {
          setHighScore((prev) => ({ ...prev, [mode]: next }));
        }
        return next;
      });
      const label = entry.enName ? `${entry.jpName} (${entry.enName})` : entry.jpName;
      setMessage(`ถูกต้อง — ${label}`);
      setMessageTone("success");
      setShowSuggestions(false);
      if (mode === "pokemon") playCry(entry.latestCry);
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 450);
      setMessage("ยังไม่ตรง — ลองสะกดชื่อญี่ปุ่นหรืออังกฤษอีกครั้ง");
      setMessageTone("error");
    }
  };

  const handleGiveUp = () => {
    if (status === "guessing" && entry) {
      setStatus("revealed");
      setStreak(0);
      const label = entry.enName ? `${entry.jpName} (${entry.enName})` : entry.jpName;
      setMessage(`เฉลย: ${label}`);
      setMessageTone("neutral");
      setShowSuggestions(false);
      if (mode === "pokemon") playCry(entry.latestCry);
    }
  };

  const handleUseHint = () => {
    if (hintUsed || status !== "guessing") return;
    if (streak > 0) {
      setStreak((s) => Math.max(0, s - 1));
    }
    setHintUsed(true);
    setShowHint(true);
  };

  const handleInputChange = (val: string) => {
    setGuess(val);
    const q = val.trim().toLowerCase();
    if (q.length > 0) {
      const filtered = allNames
        .filter((item) => item.aliases.some((alias) => alias.includes(q)))
        .slice(0, 6);
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const selectSuggestion = (option: NameOption) => {
    setGuess(option.secondary || option.primary);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFDF7] dark:bg-[#12100E] text-[#181411] dark:text-[#F5EFE6] relative">
      {/* Dynamic Per-Series Manga Screentone & Speedlines */}
      <div
        className="fixed inset-0 pointer-events-none -z-0 overflow-hidden"
        style={
          {
            "--tone-color": `color-mix(in srgb, ${currentModeInfo.accent} 13%, transparent)`,
            "--speed-color": `color-mix(in srgb, ${currentModeInfo.accent} 6%, transparent)`,
          } as React.CSSProperties
        }
        aria-hidden="true"
      >
        <div className="absolute inset-0 manga-speedlines transition-colors duration-500" />
        <div
          className="absolute inset-0 manga-screentone transition-colors duration-500"
          style={{
            maskImage: "radial-gradient(circle at 20% 20%, black 0%, transparent 65%)",
            WebkitMaskImage: "radial-gradient(circle at 20% 20%, black 0%, transparent 65%)",
          }}
        />
      </div>

      {/* Top Bar */}
      <header className="border-b border-[#EAE0D0] dark:border-[#2E2924] bg-[#FFFDF7]/90 dark:bg-[#12100E]/90 sticky top-0 z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#52525B] dark:text-[#A89F94] hover:text-[#09090B] dark:hover:text-[#F5EFE6] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2563EB]"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5m6 6l-6-6 6-6" />
            </svg>
            <span>หน้าหลัก</span>
          </Link>

          <Link href="/" className="font-bold text-lg tracking-tight text-[#09090B] dark:text-[#F5EFE6]">
            AniGuess
          </Link>

          <div className="flex items-center gap-2.5">
            <ThemeToggle />
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold"
              style={{ backgroundColor: currentModeInfo.softBg, color: currentModeInfo.accent }}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: currentModeInfo.accent }}
              />
              <span className="hidden sm:inline">{currentModeInfo.name}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Colorful Mode Selector Strip */}
      <div className="border-b border-[#E4E4E7] dark:border-[#2E2924] bg-white dark:bg-[#1B1815]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3">
          <div
            className="flex gap-2 overflow-x-auto pb-1 snap-x"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            role="tablist"
            aria-label="เลือกหมวดหมู่อนิเมะ"
          >
            {GAME_MODES.map((m) => {
              const active = mode === m.id;
              return (
                <button
                  key={m.id}
                  role="tab"
                  aria-selected={active}
                  onClick={() => {
                    setMode(m.id);
                    setStreak(0);
                    setAllNames([]);
                  }}
                  style={
                    active
                      ? { backgroundColor: m.accent, borderColor: m.accent, color: "#FFFFFF" }
                      : undefined
                  }
                  className={`snap-start shrink-0 px-3.5 py-2 rounded-xl border text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#2563EB] ${
                    active
                      ? "shadow-xs"
                      : "bg-[#FAFAFA] dark:bg-[#25211D] text-[#52525B] dark:text-[#A89F94] border-[#E4E4E7] dark:border-[#2E2924] hover:border-[#09090B]/30 dark:hover:border-[#F5EFE6]/30 hover:text-[#09090B] dark:hover:text-[#F5EFE6]"
                  }`}
                >
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: active ? "#FFFFFF" : m.accent }}
                    aria-hidden="true"
                  />
                  <span>{m.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Split Specimen Sheet */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Specimen Card */}
          <section className="lg:col-span-6 rounded-2xl border border-[#E4E4E7] dark:border-[#2E2924] bg-white dark:bg-[#1B1815] overflow-hidden shadow-xs">
            <div className="px-5 py-3.5 border-b border-[#EAE0D0] dark:border-[#2E2924] flex items-center justify-between gap-2">
              {entry ? (
                <div className="font-mono text-xs font-medium text-[#645B52] dark:text-[#A89F94]">
                  {`SPECIMEN #${String(entry.id).padStart(4, "0")}`}
                </div>
              ) : (
                <div className="w-28 h-4 rounded bg-[#F7F1E6] dark:bg-[#25211D] animate-pulse" />
              )}
              <div className="flex items-center gap-2">
                <span
                  className="font-mono text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-lg"
                  style={{
                    backgroundColor: currentModeInfo.softBg,
                    color: currentModeInfo.accent,
                  }}
                >
                  {currentModeInfo.mechanic}
                </span>
                {mode === "pokemon" && entry?.latestCry && (
                  <button
                    type="button"
                    onClick={() => playCry(entry.latestCry)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#09090B] text-white hover:bg-[#2563EB] transition-colors font-mono text-[10px] font-semibold uppercase tracking-wider cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB]"
                    title="ฟังเสียงร้องโปเกมอน"
                    aria-label="ฟังเสียงร้องโปเกมอน"
                  >
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.85 14,18.71V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16.02C15.5,15.29 16.5,13.77 16.5,12M3,9V15H7L12,20V4L7,9H3Z" />
                    </svg>
                    <span>CRY</span>
                  </button>
                )}
              </div>
            </div>

            <div
              className={`relative aspect-square w-full max-h-[420px] mx-auto flex items-center justify-center bg-[#FAFAFA] dark:bg-[#12100E] dot-stage overflow-hidden ${
                shake ? "shake" : ""
              }`}
            >
              {status === "revealed" && (
                <div
                  className="absolute inset-0 pointer-events-none opacity-15 transition-opacity duration-500"
                  style={{
                    background: `radial-gradient(circle at center, ${currentModeInfo.accent} 0%, transparent 70%)`,
                  }}
                />
              )}

              {entry ? (
                <div className="relative w-full h-full p-8 sm:p-12">
                  {!imageLoaded && (
                    <div className="absolute inset-10 rounded-2xl bg-[#EAE0D0]/70 animate-pulse" />
                  )}
                  <Image
                    key={entry.id}
                    src={entry.image}
                    alt={status === "revealed" ? entry.jpName : "Mystery character silhouette"}
                    fill
                    onLoad={() => setImageLoaded(true)}
                    className={`object-contain p-6 transition-all duration-500 ${
                      imageLoaded ? "opacity-100" : "opacity-0"
                    } ${
                      status === "revealed"
                        ? mode === "pokemon"
                          ? "reveal scale-105"
                          : "reveal-anime scale-105"
                        : mode === "pokemon"
                        ? "silhouette"
                        : "anime-blur"
                    }`}
                    priority
                    sizes="(max-width: 1024px) 100vw, 500px"
                  />
                </div>
              ) : (
                <div className="w-full h-full p-10 sm:p-14 flex items-center justify-center">
                  <div className="w-full h-full max-w-[260px] max-h-[260px] rounded-2xl bg-[#EAE0D0]/75 animate-pulse" />
                </div>
              )}

              {(status === "loading" || (entry && !imageLoaded)) && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white/75 dark:bg-[#12100E]/80 backdrop-blur-xs z-20">
                  <div className="pokeball-spinner" />
                  <span className="font-mono text-xs uppercase tracking-widest text-[#645B52] dark:text-[#A89F94]">
                    Loading...
                  </span>
                </div>
              )}
            </div>

            <div className="px-5 py-3.5 border-t border-[#E4E4E7] dark:border-[#2E2924] bg-white dark:bg-[#1B1815] flex items-center justify-between gap-2">
              <span className="font-mono text-xs text-[#71717A] dark:text-[#A89F94]">STATUS</span>
              <span
                className="font-mono text-xs font-bold tracking-wide"
                style={{
                  color: status === "revealed" ? "#059669" : currentModeInfo.accent,
                }}
              >
                {status === "revealed" && entry
                  ? `VERIFIED // ${entry.enName || entry.jpName}`
                  : "UNIDENTIFIED"}
              </span>
            </div>
          </section>

          {/* Right Column: Control Desk */}
          <section className="lg:col-span-6 flex flex-col gap-5">
            {/* Scoreboard */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-[#E4E4E7] dark:border-[#2E2924] bg-white dark:bg-[#1B1815] p-4 sm:p-5">
                <div className="font-mono text-[11px] uppercase tracking-wider text-[#71717A] dark:text-[#A89F94] mb-1">
                  Current Streak
                </div>
                <div className="font-mono text-3xl sm:text-4xl font-bold text-[#09090B] dark:text-[#F5EFE6]">
                  {String(streak).padStart(2, "0")}
                </div>
              </div>
              <div className="rounded-2xl border border-[#E4E4E7] dark:border-[#2E2924] bg-white dark:bg-[#1B1815] p-4 sm:p-5">
                <div className="font-mono text-[11px] uppercase tracking-wider text-[#71717A] dark:text-[#A89F94] mb-1">
                  Best Record
                </div>
                <div
                  className="font-mono text-3xl sm:text-4xl font-bold"
                  style={{ color: currentModeInfo.accent }}
                >
                  {String(highScore[mode] || 0).padStart(2, "0")}
                </div>
              </div>
            </div>

            {/* Control Card */}
            <div className="rounded-2xl border border-[#E4E4E7] dark:border-[#2E2924] bg-white dark:bg-[#1B1815] p-5 sm:p-6 flex flex-col gap-5 shadow-xs">
              <div>
                <div className="font-mono text-xs text-[#71717A] dark:text-[#A89F94] mb-1">
                  {currentModeInfo.jpTitle}
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#09090B] dark:text-[#F5EFE6]">
                  {mode === "pokemon" ? "ใครคือโปเกมอนตัวนี้?" : "ใครคือตัวละครนี้?"}
                </h1>
                <p className="text-sm text-[#52525B] dark:text-[#A89F94] mt-1">
                  พิมพ์ชื่อได้ทั้งภาษาอังกฤษ/โรมันจิ หรือภาษาญี่ปุ่น
                </p>
              </div>

              <form onSubmit={handleGuess} className="flex flex-col gap-3 relative">
                <label htmlFor="character-guess" className="sr-only">
                  ชื่อตัวละคร
                </label>
                <input
                  ref={inputRef}
                  id="character-guess"
                  type="text"
                  value={guess}
                  onChange={(e) => handleInputChange(e.target.value)}
                  onFocus={() => guess.length > 0 && setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                  disabled={status !== "guessing"}
                  placeholder="เช่น Pikachu หรือ ピカチュウ..."
                  autoComplete="off"
                  className="w-full h-13 px-4 rounded-xl bg-[#FAFAFA] dark:bg-[#12100E] border border-[#E4E4E7] dark:border-[#2E2924] text-base sm:text-lg font-medium text-[#09090B] dark:text-[#F5EFE6] placeholder:text-[#A1A1AA] dark:placeholder:text-[#71685E] focus:outline-none focus:bg-white dark:focus:bg-[#1B1815] focus:border-[#09090B] dark:focus:border-[#EA580C] focus:ring-2 focus:ring-[#09090B]/10 dark:focus:ring-[#EA580C]/20 disabled:opacity-50 transition-all"
                  autoFocus
                />

                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute top-14 left-0 w-full bg-white dark:bg-[#1B1815] border border-[#E4E4E7] dark:border-[#2E2924] rounded-xl z-30 max-h-56 overflow-y-auto shadow-lg">
                    {suggestions.map((opt, idx) => (
                      <button
                        key={`${opt.primary}-${idx}`}
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          selectSuggestion(opt);
                        }}
                        className="w-full px-4 py-3 text-left border-b border-[#F4F4F5] dark:border-[#2E2924] last:border-b-0 hover:bg-[#FAFAFA] dark:hover:bg-[#25211D] transition-colors flex items-center justify-between gap-3 cursor-pointer"
                      >
                        <span className="font-semibold text-[#09090B] dark:text-[#F5EFE6]">{opt.primary}</span>
                        {opt.secondary && (
                          <span className="font-mono text-xs text-[#71717A] dark:text-[#A89F94]">
                            {opt.secondary}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}

                <div className="flex flex-wrap gap-2.5 pt-1">
                  {status === "guessing" ? (
                    <>
                      <button
                        type="submit"
                        style={{ backgroundColor: currentModeInfo.accent }}
                        className="flex-1 min-w-[140px] h-12 px-6 rounded-xl text-white font-bold text-sm tracking-wide hover:opacity-90 transition-opacity cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#09090B]"
                      >
                        ทายคำตอบ
                      </button>

                      <button
                        type="button"
                        onClick={handleUseHint}
                        disabled={hintUsed}
                        title="แลก 1 คะแนน Streak เพื่อดูคำใบ้"
                        className="h-12 px-4 rounded-xl bg-[#FFFBEB] border border-[#FDE68A] text-[#B45309] font-semibold text-sm hover:bg-[#FEF3C7] disabled:opacity-40 disabled:cursor-not-allowed transition-colors inline-flex items-center gap-2 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D97706]"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                          />
                        </svg>
                        <span>คำใบ้ (-1)</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleGiveUp}
                        className="h-12 px-5 rounded-xl bg-[#F4F4F5] dark:bg-[#25211D] text-[#52525B] dark:text-[#A89F94] font-semibold text-sm hover:bg-[#E4E4E7] dark:hover:bg-[#2E2924] hover:text-[#09090B] dark:hover:text-[#F5EFE6] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#09090B]"
                      >
                        ยอมแพ้
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fetchRandomEntry(mode)}
                      style={{ backgroundColor: currentModeInfo.accent }}
                      className="w-full h-12 px-6 rounded-xl text-white font-bold text-sm tracking-wide hover:opacity-90 transition-opacity inline-flex items-center justify-center gap-2 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#09090B]"
                    >
                      <span>ตัวถัดไป</span>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                        aria-hidden="true"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-6-6l6 6-6 6" />
                      </svg>
                    </button>
                  )}
                </div>
              </form>

              {message && (
                <div
                  role="status"
                  aria-live="polite"
                  className={`p-3.5 rounded-xl border text-sm font-semibold flex items-center gap-2.5 ${
                    messageTone === "success"
                      ? "bg-[#ECFDF5] border-[#A7F3D0] text-[#065F46]"
                      : messageTone === "error"
                      ? "bg-[#FEF2F2] border-[#FECACA] text-[#B91C1C]"
                      : "bg-[#F4F4F5] border-[#E4E4E7] text-[#09090B]"
                  }`}
                >
                  <span className="font-mono text-xs uppercase shrink-0">
                    {messageTone === "success" ? "OK" : messageTone === "error" ? "ERR" : "INFO"}
                  </span>
                  <span>{message}</span>
                </div>
              )}

              {showHint && entry?.hint && (
                <div className="rounded-xl border border-[#FDE68A] bg-[#FFFBEB] p-4">
                  <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#B45309] mb-1.5">
                    HINT
                  </div>
                  <p className="text-sm text-[#78350F] whitespace-pre-line leading-relaxed">
                    {entry.hint}
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E4E4E7] dark:border-[#2E2924] bg-white dark:bg-[#1B1815] mt-auto relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 font-mono text-xs text-[#71717A] dark:text-[#A89F94]">
          <span>AniGuess — Modern Minimal Edition</span>
          <span>Powered by PokéAPI &amp; AniList</span>
        </div>
      </footer>
    </div>
  );
}
