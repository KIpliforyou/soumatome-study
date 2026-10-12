"use client";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import BottomNav from "@/components/BottomNav";
import { useStore, heatmapData } from "@/lib/store";
import { getAllBundles } from "@/lib/content";
import { readiness } from "@/lib/scoring";
import { useMemo } from "react";

export default function ProgressPage(){
  const store = useStore();
  const bundles = getAllBundles();
  const heat = heatmapData(store.activity, 84);
  const totalLessons = Object.values(bundles).reduce((acc,b)=> acc + b.kanji.length + b.kotoba.length + b.bunpou.length, 0);
  const done = Object.keys(store.completedLessons).filter(k=>store.completedLessons[k]).length;
  const avgAcc = store.quizHistory.length ? Math.round(store.quizHistory.reduce((a,c)=>a + c.score/c.total,0)/store.quizHistory.length*100)/100 : 0;
  // readiness per level computed below
  const dueToday = useMemo(()=> Object.values(store.srsCards).filter(c=>c.due<=Date.now()).length, [store.srsCards]);
  const weak = (()=> {
    const miss: Record<string,number>={};
    for(const h of store.quizHistory) if(h.score/h.total < 0.6) miss[h.level]=(miss[h.level]||0)+1;
    return Object.entries(miss).sort((a,b)=>b[1]-a[1]).slice(0,5);
  })();

  return (
    <div className="min-h-screen">
      <Header />
      <div className="max-w-[1280px] mx-auto flex">
        <Sidebar />
        <main className="flex-1 px-4 py-6 pb-20 lg:pb-6">
          <h1 className="text-2xl font-bold mb-4">Progres Belajar</h1>

          <div className="grid sm:grid-cols-4 gap-3 mb-6">
            <div className="rounded-2xl border bg-white dark:bg-white/5 p-4"><div className="text-xs opacity-60">Lesson selesai</div><div className="text-2xl font-bold">{done}/{totalLessons}</div><div className="text-xs opacity-60">{totalLessons? Math.round(done/totalLessons*100):0}% coverage</div></div>
            <div className="rounded-2xl border bg-white dark:bg-white/5 p-4"><div className="text-xs opacity-60">Rata-rata akurasi kuis</div><div className="text-2xl font-bold">{store.quizHistory.length? Math.round(avgAcc*100)+"%":"—"}</div><div className="text-xs opacity-60">{store.quizHistory.length} kuis dikerjakan</div></div>
            <div className="rounded-2xl border bg-white dark:bg-white/5 p-4"><div className="text-xs opacity-60">Streak</div><div className="text-2xl font-bold">🔥 {store.streak} hari</div><div className="text-xs opacity-60">Terakhir {store.lastStudyDate||"—"}</div></div>
            <div className="rounded-2xl border bg-white dark:bg-white/5 p-4"><div className="text-xs opacity-60">Kartu SRS</div><div className="text-2xl font-bold">{Object.keys(store.srsCards).length}</div><div className="text-xs opacity-60">{dueToday} jatuh tempo hari ini</div></div>
          </div>

          <div className="rounded-2xl border bg-white dark:bg-white/5 p-4 mb-6">
            <div className="font-semibold mb-3">Aktivitas harian (heatmap)</div>
            <div className="flex flex-wrap gap-1">
              {heat.map(h=>(
                <div key={h.date} title={h.date+": "+h.count} className={"w-5 h-5 rounded-sm "+(h.count===0?"bg-slate-100 dark:bg-white/5":h.count===1?"bg-emerald-200":h.count<3?"bg-emerald-400":"bg-emerald-600")} />
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="rounded-2xl border bg-white dark:bg-white/5 p-4">
              <div className="font-semibold mb-2">Estimasi kesiapan per level</div>
              {(["n5","n4","n3","n2"] as const).map(l=>{
                const b=bundles[l]; const tot=b.kanji.length+b.kotoba.length+b.bunpou.length;
                const d=Object.keys(store.completedLessons).filter(k=>k.startsWith(l+":")).length;
                const r=readiness(d, tot, avgAcc);
                return (
                  <div key={l} className="flex items-center gap-3 py-2">
                    <span className="w-10 text-sm font-bold">{l.toUpperCase()}</span>
                    <div className="flex-1 h-2 rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden"><div className="h-full bg-red-500" style={{width: r+"%"}} /></div>
                    <span className="text-sm w-12 text-right">{r}%</span>
                  </div>
                );
              })}
              <div className="text-xs opacity-60 mt-2">Rumus: 60% coverage + 40% akurasi kuis</div>
            </div>
            <div className="rounded-2xl border bg-white dark:bg-white/5 p-4">
              <div className="font-semibold mb-2">Area lemah</div>
              {weak.length===0 ? <div className="text-sm opacity-60">Belum ada — kerjakan kuis dulu.</div> : weak.map(([lvl,c])=>(
                <div key={lvl} className="flex justify-between py-1 text-sm"><span>{lvl.toUpperCase()}</span><span className="opacity-60">{c} kuis &lt;60%</span></div>
              ))}
              <div className="mt-4">
                <div className="font-semibold text-sm mb-1">Riwayat kuis</div>
                {store.quizHistory.length===0 ? <div className="text-xs opacity-60">Belum ada riwayat</div> : store.quizHistory.slice(-10).reverse().map(h=>(
                  <div key={h.id} className="flex justify-between text-xs py-1 border-b last:border-0"><span>{h.level.toUpperCase()} — {h.score}/{h.total}</span><span className="opacity-60">{new Date(h.at).toLocaleDateString("id-ID")}</span></div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button onClick={()=>{
              const blob=new Blob([store.exportJson()],{type:"application/json"});
              const url=URL.createObjectURL(blob); const a=document.createElement("a"); a.href=url; a.download="soumatome-progress.json"; a.click(); URL.revokeObjectURL(url);
            }} className="px-4 py-2 rounded-xl border text-sm">Export progres (JSON)</button>
            <label className="px-4 py-2 rounded-xl border text-sm cursor-pointer">Import<input type="file" className="hidden" accept=".json" onChange={e=>{
              const f=e.target.files?.[0]; if(!f) return; const r=new FileReader(); r.onload=()=>{ store.importJson(r.result as string); alert("Import ok"); }; r.readAsText(f);
            }} /></label>
          </div>
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
