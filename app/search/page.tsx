"use client";
import { useState, useMemo, useEffect, Suspense } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import BottomNav from "@/components/BottomNav";
import { getAllBundles } from "@/lib/content";
import { buildIndex, search as fuseSearch } from "@/lib/search";
import type { SearchDoc } from "@/lib/search";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function SearchInner(){
  const params = useSearchParams();
  const initial = params.get("q")||"";
  const [q, setQ] = useState(initial);
  const [level, setLevel] = useState<string>("");
  const [kat, setKat] = useState<string>("");
  const bundles = getAllBundles();

  const allDocs: SearchDoc[] = useMemo(()=>{
    const out: SearchDoc[]=[];
    for(const [lvl, b] of Object.entries(bundles)){
      for(const k of b.kanji) out.push({id: lvl+":kanji:"+k.char, title:k.char, yomi: [...k.onyomi, ...k.kunyomi].join(" "), arti:k.arti_id, level:lvl, kategori:"kanji", href:"/level/"+lvl, unit:k.unit});
      for(const k of b.kotoba) out.push({id:k.id, title: k.kanji||k.kana, yomi:k.kana, romaji:k.romaji, arti:k.arti_id, level:lvl, kategori:"kotoba", href:"/level/"+lvl, unit:k.unit});
      for(const k of b.bunpou) out.push({id:k.id, title:k.pola, arti:k.arti, level:lvl, kategori:"bunpou", href:"/level/"+lvl, unit:k.unit});
      for(const k of b.dokkai) out.push({id:k.id, title:k.judul, arti:k.terjemah_id.slice(0,60), level:lvl, kategori:"dokkai", href:"/level/"+lvl, unit:k.unit});
      for(const k of b.choukai) out.push({id:k.id, title:k.judul, arti:k.terjemah_id.slice(0,60), level:lvl, kategori:"choukai", href:"/level/"+lvl, unit:k.unit});
    }
    return out;
  },[bundles]);

  useEffect(()=>{ buildIndex(allDocs); },[allDocs]);
  useEffect(()=>{ if(initial) setQ(initial); },[initial]);

  const results = useMemo(()=>{
    let r = q.trim() ? fuseSearch(q, 30) : allDocs.slice(0,20);
    if(level) r = r.filter(d=>d.level===level);
    if(kat) r = r.filter(d=>d.kategori===kat);
    return r.slice(0,30);
  },[q, level, kat, allDocs]);

  return (
    <>
      <div className="flex flex-wrap gap-2 mb-4">
        <input autoFocus value={q} onChange={e=>setQ(e.target.value)} placeholder="mis: taberu, 食べる, makan, はたらく..." className="flex-1 min-w-[240px] border rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-red-400" />
        <select value={level} onChange={e=>setLevel(e.target.value)} className="border rounded-xl px-3 py-2 text-sm">
          <option value="">Semua level</option><option value="n5">N5</option><option value="n4">N4</option><option value="n3">N3</option><option value="n2">N2</option>
        </select>
        <select value={kat} onChange={e=>setKat(e.target.value)} className="border rounded-xl px-3 py-2 text-sm">
          <option value="">Semua kategori</option><option value="kanji">Kanji</option><option value="kotoba">Kotoba</option><option value="bunpou">Bunpou</option><option value="dokkai">Dokkai</option><option value="choukai">Choukai</option>
        </select>
      </div>
      <div className="text-xs opacity-60 mb-3">{results.length} hasil {q? 'untuk "'+q+'"':''}</div>
      <div className="grid gap-2">
        {results.map(d=>(
          <Link key={d.id} href={d.href} className="rounded-xl border bg-white dark:bg-white/5 p-3 flex items-center gap-3 hover:shadow-sm">
            <span className={"text-xs px-2 py-0.5 rounded-full text-white "+(d.level==="n5"?"bg-emerald-500":d.level==="n4"?"bg-sky-500":d.level==="n3"?"bg-amber-500":"bg-red-500")}>{d.level.toUpperCase()}</span>
            <span className="text-xs px-2 py-0.5 rounded-full border capitalize">{d.kategori}</span>
            <span className="font-medium">{d.title}</span>
            <span className="text-sm opacity-60 truncate">{[d.yomi, d.romaji, d.arti].filter(Boolean).join(" · ")}</span>
            <span className="ml-auto text-xs opacity-50">{d.unit}</span>
          </Link>
        ))}
        {results.length===0 && <div className="text-center py-12 opacity-60">Tidak ada hasil. Coba kata kunci lain atau ganti filter.</div>}
      </div>
    </>
  );
}

export default function SearchPage(){
  return (
    <div className="min-h-screen">
      <Header />
      <div className="max-w-[1280px] mx-auto flex">
        <Sidebar />
        <main className="flex-1 px-4 py-6 pb-20 lg:pb-6">
          <h1 className="text-2xl font-bold mb-2">Pencarian Global</h1>
          <p className="text-sm opacity-60 mb-4">Cari kanji/kana/romaji/arti — filter level &amp; kategori. Shortcut ⌘K / Ctrl+K.</p>
          <Suspense fallback={<div className="text-sm opacity-60">Memuat…</div>}>
            <SearchInner />
          </Suspense>
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
