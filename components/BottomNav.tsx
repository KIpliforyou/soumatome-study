"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
const tabs = [
  { href:"/", label:"Home", icon:"🏠" },
  { href:"/level/n5", label:"N5", icon:"🌸" },
  { href:"/flashcard", label:"Card", icon:"🃏" },
  { href:"/quiz", label:"Kuis", icon:"📝" },
  { href:"/progress", label:"Progres", icon:"📊" },
];
export default function BottomNav(){
  const p = usePathname();
  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-white/95 dark:bg-[#0a0a0f]/95 backdrop-blur border-t flex justify-around py-1">
      {tabs.map(t=>(
        <Link key={t.href} href={t.href} className={"flex flex-col items-center px-3 py-1 rounded-lg text-xs "+(p===t.href?"text-red-500 font-semibold":"opacity-70")}>
          <span className="text-base">{t.icon}</span>{t.label}
        </Link>
      ))}
    </nav>
  );
}
