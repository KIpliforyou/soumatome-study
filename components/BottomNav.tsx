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
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-[var(--surface)] border-t-[3px] border-[var(--ink)] flex justify-around py-2 px-2">
      {tabs.map(t=>(
        <Link key={t.href} href={t.href} className={"flex flex-col items-center px-3 py-1.5 rounded-xl text-xs font-bold border-2 "+(p===t.href?"bg-[var(--yellow)] border-[var(--ink)] shadow-[2px_2px_0_var(--ink)] text-[var(--ink)]":"border-transparent opacity-70")}>
          <span className="text-base">{t.icon}</span>{t.label}
        </Link>
      ))}
    </nav>
  );
}
