"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useReminders } from "@/hooks/useReminders";
import { useLanguage } from "@/contexts/language";
import { Locale } from "@/lib/i18n";
import AccessibilityPanel from "./AccessibilityPanel";

export default function TabNav() {
  const pathname = usePathname();
  const { upcoming } = useReminders();
  const { locale, setLocale, t } = useLanguage();

  const MAIN_TABS = [
    { href: "/",          label: t.nav_chat },
    { href: "/hospitals", label: t.nav_hospitals },
    { href: "/estimate",  label: t.nav_cost },
    { href: "/guide",     label: "Visit Guide" },
  ];

  function toggleLocale() {
    setLocale(locale === "en" ? "es" : "en");
  }

  return (
    <nav aria-label="Main navigation" className="border-b border-gray-200 bg-white sticky top-0 z-10">
      <div className="max-w-2xl mx-auto px-4 flex items-center justify-between">
        {/* Left: brand + main tabs */}
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
          <span className="text-sm font-bold text-blue-600 mr-3 py-3 select-none flex-shrink-0" aria-hidden="true">
            CoverCare
          </span>

          {MAIN_TABS.map((tab) => {
            const isCurrent = pathname === tab.href;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                aria-current={isCurrent ? "page" : undefined}
                className={`flex-shrink-0 text-sm px-3 py-3 border-b-2 transition-colors whitespace-nowrap ${
                  isCurrent
                    ? "border-blue-600 text-blue-600 font-medium"
                    : "border-transparent text-gray-500 hover:text-gray-800"
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>

        {/* Right: secondary nav + controls */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {/* Reminders */}
          <Link
            href="/reminders"
            aria-current={pathname === "/reminders" ? "page" : undefined}
            aria-label={`${t.nav_reminders}${upcoming.length > 0 ? `, ${upcoming.length} upcoming` : ""}`}
            className={`relative text-sm px-3 py-3 border-b-2 transition-colors ${
              pathname === "/reminders"
                ? "border-blue-600 text-blue-600 font-medium"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            {t.nav_reminders}
            {upcoming.length > 0 && (
              <span
                className="absolute top-2 right-1 w-4 h-4 bg-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none"
                aria-hidden="true"
              >
                {upcoming.length > 9 ? "9+" : upcoming.length}
              </span>
            )}
          </Link>

          {/* Profile */}
          <Link
            href="/profile"
            aria-current={pathname === "/profile" ? "page" : undefined}
            className={`text-sm px-3 py-3 border-b-2 transition-colors ${
              pathname === "/profile"
                ? "border-blue-600 text-blue-600 font-medium"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            {t.nav_profile}
          </Link>

          {/* Language toggle */}
          <button
            onClick={toggleLocale}
            aria-label={locale === "en" ? "Switch to Spanish" : "Cambiar a inglés"}
            className="ml-1 text-xs font-semibold px-2.5 py-1 rounded-full border border-gray-200 text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-colors"
          >
            {locale === "en" ? "ES" : "EN"}
          </button>

          {/* Accessibility controls */}
          <div className="ml-1">
            <AccessibilityPanel />
          </div>
        </div>
      </div>
    </nav>
  );
}
