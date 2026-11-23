"use client";

import { useSyncExternalStore } from "react";

function subscribe(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
}

function getSnapshot() {
  return document.documentElement.classList.contains("dark");
}

function getServerSnapshot() {
  return false;
}

export default function ThemeToggle() {
  const isDark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggleTheme = () => {
    const nextDark = !isDark;
    document.documentElement.classList.toggle("dark", nextDark);
    try {
      localStorage.setItem("aniguess-theme", nextDark ? "dark" : "light");
    } catch {
      // Ignore storage errors
    }
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "สลับเป็นโหมดสว่าง" : "สลับเป็นโหมดมืด"}
      title={isDark ? "โหมดสว่าง (Light Mode)" : "โหมดมืด (Dark Mode)"}
      className="w-9 h-9 rounded-xl border border-[#EAE0D0] dark:border-[#2E2924] bg-white dark:bg-[#1B1815] text-[#181411] dark:text-[#F5EFE6] hover:border-[#EA580C] dark:hover:border-[#EA580C] transition-colors inline-flex items-center justify-center cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EA580C]"
    >
      {isDark ? (
        <svg
          className="w-4 h-4 text-[#F59E0B]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ) : (
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
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      )}
    </button>
  );
}
