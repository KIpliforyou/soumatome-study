"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";

const levels = ["n5","n4","n3","n2"] as const;
export default function Header(){
  const path = usePathname();
  const [openSearch, setOpenSearch] = useState(false);
  const [q, setQ] = useState("");
  const theme = useStore(s=>s.settings.theme);
  const update = useStore(s=>s.updateSettings);
  useEffect(()=>{
    const onKey=(e:KeyboardEvent)=>{ if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="k"){ e.preventDefault(); setOpenSearch(v=>!v);} if(e.key==="Escape") setOpenSearch(false);};
    window.addEventListener("keydown", onKey); return ()=>window.removeEventListener("keydown", onKey);
  },[]);
  useEffect(()=>{
    const root=document.documentElement;
    const sys = window.matchMedia("(prefers-color-scheme:dark)").matches ? "dark":"light";
    const cur = theme==="system"? sys : theme;
    root.classList.toggle("dark", cur==="dark");
    localStorage.setItem("soumatome-theme", theme);
  },[theme]);
  return (
    <header className="sticky top-0 z-30 backdrop-blur bg-white/80 dark:bg-[#0a0a0f]/80 border-b">
      <div className="max-w-[1280px] mx-auto px-4 h-[56px] flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2 font-bold text-[18px] tracking-tight">
          <span className="w-8 h-8 rounded-lg bg-red-500 text-white grid place-items-center text-sm">総</span>
          <span className="hidden sm:inline">Soumatome Study</span>
        </Link>
        <nav className="hidden md:flex items-center gap-1 ml-2">
          {levels.map(l=>(
            <Link key={l} href={"/level/"+l} className={"px-3 py-1.5 rounded-full text-sm font-medium "+(path.startsWith("/level/"+l)?"bg-slate-900 text-white dark:bg-white dark:text-black":"hover:bg-slate-100 dark:hover:bg-white/10")}>{l.toUpperCase()}</Link>
          ))}
          <Link href="/about" className={"px-3 py-1.5 rounded-full text-sm "+(path==="/about"?"bg-slate-900 text-white dark:bg-white dark:text-black":"hover:bg-slate-100")}>About</Link>
        </nav>
        <div className="flex-1" />
        <button onClick={()=>setOpenSearch(v=>!v)} className="hidden sm:flex items-center gap-2 text-sm px-3 py-1.5 rounded-full border bg-white dark:bg-white/10">
          <span className="opacity-60">Cari</span><span className="text-xs border rounded px-1.5 py-0.5">⌘K</span>
        </button>
        <button onClick={()=>update({theme: theme==="dark"?"light":"dark"})} className="w-9 h-9 rounded-full border grid place-items-center">{theme==="dark"?"☀️":"🌙"}</button>
      </div>
      {openSearch && (
        <div className="border-t bg-white dark:bg-[#0a0a0f] p-3">
          <div className="max-w-[1280px] mx-auto flex gap-2">
            <input autoFocus value={q} onChange={e=>setQ(e.target.value)} placeholder="Cari kanji, kotoba, bunpou... (kana/romaji/arti)" className="flex-1 border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-red-400" />
            <a href={"/search?q="+encodeURIComponent(q)} className="px-4 py-2 rounded-lg bg-red-500 text-white font-medium">Cari</a>
            <button onClick={()=>setOpenSearch(false)} className="px-3 py-2 rounded-lg border">Tutup</button>
          </div>
        </div>
      )}
    </header>
  );
}
