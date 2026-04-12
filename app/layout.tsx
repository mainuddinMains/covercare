import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import TabNav from "@/components/TabNav";
import DisclaimerBanner from "@/components/DisclaimerBanner";
import { LanguageProvider } from "@/contexts/language";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CoverCare",
  description: "Affordable healthcare navigation — find clinics, plans, and providers",
};

const SOURCES = [
  { label: "HRSA",          href: "https://findahealthcenter.hrsa.gov" },
  { label: "CMS / Medicare",href: "https://data.cms.gov" },
  { label: "Healthcare.gov",href: "https://www.healthcare.gov" },
  { label: "211.org",       href: "https://www.211.org" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <LanguageProvider>
          <TabNav />
          <DisclaimerBanner />
          <main className="flex-1 flex flex-col">{children}</main>
          <footer className="border-t border-gray-100 bg-white py-3 px-4">
            <div className="max-w-2xl mx-auto space-y-1.5">
              <p className="text-center text-[11px] text-gray-400">
                CoverCare provides general guidance only — not medical advice.{" "}
                <a href="tel:911" className="underline hover:text-gray-600 font-medium">911</a>{" "}
                for emergencies.
              </p>
              <div className="flex items-center justify-center gap-1 flex-wrap">
                <span className="text-[11px] text-gray-400">Data sources:</span>
                {SOURCES.map((s, i) => (
                  <span key={s.href} className="text-[11px]">
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-600 hover:underline transition-colors"
                    >
                      {s.label}
                    </a>
                    {i < SOURCES.length - 1 && (
                      <span className="text-gray-300 ml-1">·</span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          </footer>
        </LanguageProvider>
      </body>
    </html>
  );
}
