import type { Metadata } from "next";
import { Orbitron, Rajdhani, JetBrains_Mono, Inter } from "next/font/google";
import "./globals.css";

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["700", "900"],
  display: "swap",
});

const rajdhani = Rajdhani({
  variable: "--font-rajdhani",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kyl Ponio — Vibe Coder",
  description:
    "Jayson Ponio Mallari (A.K.A Kyl Ponio) — Full-stack developer & Vibe Coder from the Philippines. Building cinematic 3D web experiences with React, Three.js, and a whole lot of ✨.",
  keywords: ["Kyl Ponio", "Jayson Ponio Mallari", "portfolio", "3D web", "React", "Three.js", "Next.js", "TypeScript", "Vibe Coder", "Philippines"],
  authors: [{ name: "Jayson Ponio Mallari", url: "https://kylponio.com" }],
  robots: { index: true, follow: true },
  openGraph: {
    title: "Kyl Ponio — Vibe Coder",
    description: "Cinematic 3D portfolio. Interactive mini-game. Guitar vibe mode. Full-stack dev from 🇵🇭.",
    type: "website",
    siteName: "Kyl Ponio Portfolio",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kyl Ponio — Vibe Coder",
    description: "Cinematic 3D portfolio. Interactive mini-game. Guitar vibe mode. Full-stack dev from 🇵🇭.",
    creator: "@kylponio",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${orbitron.variable} ${rajdhani.variable} ${jetbrains.variable} ${inter.variable} h-full antialiased bg-void`}
    >
      <body className="min-h-full text-ink-100 overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
