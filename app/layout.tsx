import type { Metadata, Viewport } from "next";
import { Baloo_2, Nunito } from "next/font/google";
import "./globals.css";
import PwaInstall from "@/components/PwaInstall";

const display = Baloo_2({ variable: "--font-display", subsets: ["latin"], weight: ["500","600","700","800"] });
const body = Nunito({ variable: "--font-body", subsets: ["latin"], weight: ["400","600","700","800"] });

export const viewport: Viewport = {
  themeColor: "#2d7ff9",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};
export const metadata: Metadata = {
  title: "Soumatome Study — Belajar JLPT N5-N2",
  description: "Belajar Bahasa Jepang terstruktur untuk JLPT N5-N2: Kanji, Kotoba, Bunpou, Dokkai, Choukai. SRS, Kuis, Progres. Bisa offline & tambah ke layar utama.",
  manifest: "/manifest.json",
  appleWebApp: { capable: true, title: "Soumatome", statusBarStyle: "default" },
  formatDetection: { telephone: false },
  icons: {
    icon: [{ url: "/icon-192.png", sizes: "192x192" }, { url: "/favicon.png", sizes: "32x32" }],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning className={`${display.variable} ${body.variable}`}>
      <head>
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <script dangerouslySetInnerHTML={{__html:`(function(){try{var t=localStorage.getItem('soumatome-theme');var s=window.matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light';var c=t==='dark'||t==='light'?t:s;document.documentElement.setAttribute('data-theme',c);if(c==='dark')document.documentElement.classList.add('dark')}catch(e){}})()`}} />
      </head>
      <body className="min-h-screen antialiased">
        {children}
        <PwaInstall />
        <script dangerouslySetInnerHTML={{__html:`if('serviceWorker' in navigator){window.addEventListener('load',function(){navigator.serviceWorker.register('/sw.js').then(function(r){console.log('SW',r.scope)}).catch(function(e){console.warn('SW fail',e)})})}`}} />
      </body>
    </html>
  );
}
