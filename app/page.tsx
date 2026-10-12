"use client";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import BottomNav from "@/components/BottomNav";
import Link from "next/link";
import { useStore, heatmapData } from "@/lib/store";
import { getAllBundles } from "@/lib/content";

const levelMeta: Record<string,{title:string; desc:string}> = {
  n5:{title:"N5 — Pemula", desc:"Dasar hiragana/katakana, kosakata sehari-hari"},
  n4:{title:"N4 — Dasar", desc:"Kalimat lebih panjang, keigo ringan"},
  n3:{title:"N3 — Menengah", desc:"Korannya mulai kebaca"},
  n2:{title:"N2 — Menengah-Atas", desc:"Bisnis & akademik"},
};

export default function Dashboard(){
  const store = useStore();
  const bundles = getAllBundles();
  const heat = heatmapData(store.activity, 56);

  return (
    <div className="min-h-screen">
      <Header />
      <div className="max-w-[1280px] mx-auto flex">
        <Sidebar />
        <main className="flex-1 px-4 py-6 pb-20 lg:pb-6">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <span className="text-sm px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30">🔥 Streak {store.streak} hari</span>
            <span className="text-sm px-3 py-1 rounded-full border">XP {store.xp}</span>
            <span className="text-sm px-3 py-1 rounded-full border">Target harian {store.settings.targetHarian}</span>
          </div>

          {store.lastStudyDate && (
            <div className="mb-6 p-4 rounded-2xl border bg-white dark:bg-white/5 flex items-center justify-between">
              <div>
                <div className="text-sm opacity-60">Lanjutkan belajar</div>
                <div className="font-semibold">Level {store.lastLevel.toUpperCase()} — terakhir {store.lastStudyDate}</div>
              </div>
              <Link href={"/level/"+store.lastLevel} className="px-4 py-2 rounded-xl bg-red-500 text-white font-medium">Lanjutkan →</Link>
            </div>
          )}

          <h2 className="font-semibold mb-3">Pilih Level</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {Object.entries(bundles).map(([lvl, b])=> {
              const total = b.kanji.length + b.kotoba.length + b.bunpou.length;
              const done = Object.keys(store.completedLessons).filter(k=>k.startsWith(lvl+":")).length;
              const pct = total? Math.round(done/total*100):0;
              const m = levelMeta[lvl];
              return (
                <Link key={lvl} href={"/level/"+lvl} className="rounded-2xl border bg-white dark:bg-white/5 p-4 hover:shadow-md transition">
                  <div className={"h-16 rounded-xl grid place-items-center text-white font-bold text-xl "+ (lvl==="n5"?"bg-emerald-500":lvl==="n4"?"bg-sky-500":lvl==="n3"?"bg-amber-500":"bg-red-500")}>{lvl.toUpperCase()}</div>
                  <div className="mt-3 font-semibold">{m.title}</div>
                  <div className="text-sm opacity-60">{m.desc}</div>
                  <div className="text-xs mt-2 opacity-60">{b.kanji.length} kanji · {b.kotoba.length} kotoba · {b.bunpou.length} bunpou</div>
                  <div className="mt-3 h-2 rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden"><div className="h-full bg-red-500" style={{width: pct+"%"}} /></div>
                  <div className="text-xs mt-1 opacity-60">{pct}% selesai · {done}/{total} lesson</div>
                </Link>
              );
            })}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-2xl border bg-white dark:bg-white/5 p-4">
              <div className="font-semibold mb-3">Aktivitas (heatmap)</div>
              <div className="grid grid-cols-14 gap-1">
                {heat.map(h=>(
                  <div key={h.date} title={h.date+": "+h.count} className={"w-5 h-5 rounded-sm "+ (h.count===0?"bg-slate-100 dark:bg-white/5":h.count===1?"bg-emerald-200":h.count<3?"bg-emerald-400":"bg-emerald-600")} />
                ))}
              </div>
              <div className="text-xs opacity-60 mt-2">56 hari terakhir · total hari aktif: {Object.values(store.activity).filter(v=>v>0).length}</div>
            </div>
            <div className="rounded-2xl border bg-white dark:bg-white/5 p-4">
              <div className="font-semibold mb-2">Aksi cepat</div>
              <div className="grid grid-cols-2 gap-2">
                <Link href="/flashcard" className="p-3 rounded-xl border hover:bg-slate-50 dark:hover:bg-white/10">🃏 Flashcard</Link>
                <Link href="/quiz" className="p-3 rounded-xl border hover:bg-slate-50 dark:hover:bg-white/10">📝 Kuis</Link>
                <Link href="/search" className="p-3 rounded-xl border hover:bg-slate-50 dark:hover:bg-white/10">🔍 Cari (⌘K)</Link>
                <Link href="/progress" className="p-3 rounded-xl border hover:bg-slate-50 dark:hover:bg-white/10">📊 Progres</Link>
              </div>
              <div className="mt-4 flex gap-2">
                <button onClick={()=>{
                  const blob=new Blob([store.exportJson()],{type:"application/json"});
                  const url=URL.createObjectURL(blob); const a=document.createElement("a"); a.href=url; a.download="soumatome-progress.json"; a.click(); URL.revokeObjectURL(url);
                }} className="text-sm px-3 py-1.5 rounded-full border">Export progres</button>
                <label className="text-sm px-3 py-1.5 rounded-full border cursor-pointer">Import<input type="file" className="hidden" accept=".json" onChange={e=>{
                  const f=e.target.files?.[0]; if(!f) return; const r=new FileReader(); r.onload=()=>{ try{ store.importJson(r.result as string); alert("Import berhasil"); }catch{alert("Gagal") } }; r.readAsText(f);
                }} /></label>
              </div>
            </div>
          </div>
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
