import type { Metadata } from "next";
import "./globals.css";

export const viewport = { themeColor: "#ef4444" };

export const metadata: Metadata = {
  title: "Soumatome Study — Belajar JLPT N5-N2",
  description: "Belajar Bahasa Jepang terstruktur untuk JLPT N5-N2: Kanji, Kotoba, Bunpou, Dokkai, Choukai. SRS, Kuis, Progres.",
  manifest: "/manifest.json",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans+JP:wght@400;500;700&family=Noto+Serif+JP:wght@600&display=swap" rel="stylesheet" />
        <script dangerouslySetInnerHTML={{__html:`(function(){try{var t=localStorage.getItem('soumatome-theme');var d=window.matchMedia('(prefers-color-scheme:dark)').matches;if(t==='dark'||(!t&&d))document.documentElement.classList.add('dark')}catch(e){}})()`}} />
      </head>
      <body className="min-h-screen antialiased">
        {children}
        <script dangerouslySetInnerHTML={{__html:`if('serviceWorker' in navigator){window.addEventListener('load',function(){navigator.serviceWorker.register('/sw.js').catch(function(){})})}`}} />
      </body>
    </html>
  );
}
