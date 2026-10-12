import type { Metadata, Viewport } from "next";
import { Baloo_2, Nunito } from "next/font/google";
import "./globals.css";

const display = Baloo_2({ variable: "--font-display", subsets: ["latin"], weight: ["500","600","700","800"] });
const body = Nunito({ variable: "--font-body", subsets: ["latin"], weight: ["400","600","700","800"] });

export const viewport: Viewport = { themeColor: "#2d7ff9", width: "device-width", initialScale: 1 };
export const metadata: Metadata = {
  title: "Soumatome Study — Belajar JLPT N5-N2",
  description: "Belajar Bahasa Jepang terstruktur untuk JLPT N5-N2: Kanji, Kotoba, Bunpou, Dokkai, Choukai. SRS, Kuis, Progres.",
  manifest: "/manifest.json",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning className={`${display.variable} ${body.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{__html:`(function(){try{var t=localStorage.getItem('soumatome-theme');var s=window.matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light';var c=t==='dark'||t==='light'?t:s;document.documentElement.setAttribute('data-theme',c);if(c==='dark')document.documentElement.classList.add('dark')}catch(e){}})()`}} />
      </head>
      <body className="min-h-screen antialiased">
        {children}
        <script dangerouslySetInnerHTML={{__html:`if('serviceWorker' in navigator){window.addEventListener('load',function(){navigator.serviceWorker.register('/sw.js').catch(function(){})})}`}} />
      </body>
    </html>
  );
}
