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
    root.setAttribute("data-theme", cur);
    root.classList.toggle("dark", cur==="dark");
    localStorage.setItem("soumatome-theme", theme);
  },[theme]);
  return (
    <header className="sticky top-0 z-30 bg-transparent pt-3">
      <div className="topbar max-w-[1280px] mx-auto">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 font-black text-[18px] tracking-tight" style={{fontFamily:"var(--font-display)"}}>
            <span className="w-9 h-9 rounded-xl bg-[var(--yellow)] text-[var(--ink)] grid place-items-center text-sm border-[2.5px] border-[var(--ink)] shadow-[2.5px_2.5px_0_var(--ink)] rotate-[-3deg]">総</span>
            <span className="hidden sm:inline">Soumatome <span className="text-[var(--accent)]">Study</span></span>
          </Link>
          <nav className="hidden md:flex items-center gap-1 ml-2">
            {levels.map(l=>(
              <Link key={l} href={"/level/"+l} className={"px-3 py-1.5 rounded-full text-sm font-bold border-2 "+(path.startsWith("/level/"+l)?"bg-[var(--yellow)] border-[var(--ink)] shadow-[2px_2px_0_var(--ink)] text-[var(--ink)]":"border-transparent text-[var(--muted)] hover:border-[var(--ink)] hover:bg-white")}>{l.toUpperCase()}</Link>
            ))}
            <Link href="/about" className={"px-3 py-1.5 rounded-full text-sm font-bold border-2 "+(path==="/about"?"bg-[var(--yellow)] border-[var(--ink)] shadow-[2px_2px_0_var(--ink)]":"border-transparent text-[var(--muted)] hover:border-[var(--ink)]")}>About</Link>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={()=>setOpenSearch(v=>!v)} className="hidden sm:flex items-center gap-2 text-sm px-4 py-2 rounded-full border-[2.5px] border-[var(--ink)] bg-white shadow-[2px_2px_0_var(--ink)] font-bold">
            <span className="opacity-60">Cari</span><span className="text-xs border-2 border-[var(--ink)] rounded-full px-2 py-0.5 bg-[var(--yellow)]">⌘K</span>
          </button>
          <button onClick={()=>update({theme: theme==="dark"?"light":"dark"})} className="w-10 h-10 rounded-full border-[2.5px] border-[var(--ink)] grid place-items-center bg-[var(--yellow)] shadow-[2px_2px_0_var(--ink)]">{theme==="dark"?"☀️":"🌙"}</button>
        </div>
      </div>
      {openSearch && (
        <div className="max-w-[1280px] mx-auto mt-2">
          <div className="panel flex gap-2">
            <input autoFocus value={q} onChange={e=>setQ(e.target.value)} placeholder="Cari kanji, kotoba, bunpou... (kana/romaji/arti)" className="flex-1 border-[2.5px] border-[var(--ink)] rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-[var(--accent)] bg-[var(--surface)]" />
            <a href={"/search?q="+encodeURIComponent(q)} className="primary">Cari</a>
            <button onClick={()=>setOpenSearch(false)} className="secondary">Tutup</button>
          </div>
        </div>
      )}
    </header>
  );
}
