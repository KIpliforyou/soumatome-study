"use client";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import BottomNav from "@/components/BottomNav";
import Link from "next/link";
import { useStore, heatmapData } from "@/lib/store";
import { getAllBundles } from "@/lib/content";

const levelMeta: Record<string,{title:string; desc:string; bg:string; accent:string}> = {
  n5:{title:"N5 — Pemula", desc:"Hiragana/katakana & kosakata sehari-hari", bg:"var(--green-soft)", accent:"var(--green)"},
  n4:{title:"N4 — Dasar", desc:"Kalimat panjang, keigo ringan", bg:"var(--blue-soft)", accent:"var(--blue)"},
  n3:{title:"N3 — Menengah", desc:"Koran & email mulai kebaca", bg:"var(--orange-soft)", accent:"var(--orange)"},
  n2:{title:"N2 — Menengah-Atas", desc:"Bisnis & akademik", bg:"var(--purple-soft)", accent:"var(--purple)"},
};

export default function Dashboard(){
  const store = useStore();
  const bundles = getAllBundles();
  const heat = heatmapData(store.activity, 56);
  const totalLessons = Object.values(bundles).reduce((a,b)=>a+b.kanji.length+b.kotoba.length+b.bunpou.length,0);
  const done = Object.keys(store.completedLessons).filter(k=>store.completedLessons[k]).length;

  return (
    <div className="min-h-screen">
      <Header />
      <div className="app-shell !min-h-0">
        <Sidebar />
        <main className="flex-1 px-4 lg:px-6 py-6 pb-24 lg:pb-6 max-w-[1280px] mx-auto w-full">
          <div className="topbar">
            <div>
              <small>DASHBOARD · <b>SOUMATOME STUDY</b></small>
              <h1 style={{margin:"6px 0 0", fontSize:"22px", fontWeight:900, fontFamily:"var(--font-display)"}}>Mau belajar apa hari ini?</h1>
              <p className="text-sm mt-1">JLPT N5-N2 — Kanji, Kotoba, Bunpou, Dokkai, Choukai. SRS & kuis tersimpan lokal.</p>
            </div>
            <div className="hidden sm:flex gap-2 flex-wrap">
              <span className="pill">🔥 {store.streak} hari</span>
              <span className="pill" style={{background:"var(--yellow)"}}>⭐ {store.xp} XP</span>
              <span className="pill">🎯 {store.settings.targetHarian}/hari</span>
              <span className="pill">{done}/{totalLessons} lesson</span>
            </div>
          </div>

          {store.lastStudyDate && (
            <div className="cartoon-card yellow flex items-center justify-between mb-6">
              <div>
                <div className="text-xs font-black tracking-widest opacity-60">LANJUTKAN BELAJAR</div>
                <div className="font-black" style={{fontFamily:"var(--font-display)"}}>Level {store.lastLevel.toUpperCase()} — terakhir {store.lastStudyDate}</div>
              </div>
              <Link href={"/level/"+store.lastLevel} className="primary">Lanjutkan →</Link>
            </div>
          )}

          <h2 style={{fontFamily:"var(--font-display)", fontWeight:800, marginBottom:"10px"}}>Pilih Level</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {Object.entries(bundles).map(([lvl, b])=> {
              const total = b.kanji.length + b.kotoba.length + b.bunpou.length;
              const d = Object.keys(store.completedLessons).filter(k=>k.startsWith(lvl+":")).length;
              const pct = total? Math.round(d/total*100):0;
              const m = levelMeta[lvl];
              const isActive = store.lastLevel===lvl;
              return (
                <Link key={lvl} href={"/level/"+lvl} className="cartoon-card hover:translate-y-[-2px] transition-transform" style={{background: m.bg}}>
                  {isActive && <span className="absolute top-3 right-3 text-xs font-black pill" style={{background:"var(--yellow)"}}>Aktif</span>}
                  <div className="w-12 h-12 rounded-xl grid place-items-center font-black text-white border-[2.5px] border-[var(--ink)] shadow-[2px_2px_0_var(--ink)]" style={{background:m.accent}}>{lvl.toUpperCase()}</div>
                  <div className="mt-3 font-black" style={{fontFamily:"var(--font-display)"}}>{m.title}</div>
                  <div className="text-sm" style={{color:"var(--muted)"}}>{m.desc}</div>
                  <div className="text-xs mt-2 font-bold">{b.kanji.length} kanji · {b.kotoba.length} kotoba · {b.bunpou.length} bunpou</div>
                  <div className="progress-track mt-3"><div className="progress-fill" style={{width: pct+"%", background:m.accent}} /></div>
                  <div className="text-xs mt-1 font-bold">{pct}% · {d}/{total}</div>
                </Link>
              );
            })}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="cartoon-card">
              <div className="font-black" style={{fontFamily:"var(--font-display)"}}>Aktivitas · Heatmap</div>
              <div className="flex flex-wrap gap-1 mt-3">
                {heat.map(h=>(
                  <div key={h.date} title={h.date+": "+h.count} className="w-[18px] h-[18px] rounded-md border-[1.5px] border-[var(--ink)]" style={{background: h.count===0?"var(--surface)":h.count===1?"var(--green-soft)":h.count<3?"var(--green)":"var(--ink)", opacity: h.count===0?0.2:1}} />
                ))}
              </div>
              <div className="text-xs mt-2" style={{color:"var(--muted)"}}>56 hari terakhir · hari aktif: {Object.values(store.activity).filter(v=>v>0).length}</div>
            </div>
            <div className="cartoon-card soft-blue">
              <div className="font-black" style={{fontFamily:"var(--font-display)"}}>Aksi cepat</div>
              <div className="grid grid-cols-2 gap-2 mt-3">
                <Link href="/flashcard" className="secondary text-center">🃏 Flashcard</Link>
                <Link href="/quiz" className="secondary text-center">📝 Kuis</Link>
                <Link href="/search" className="secondary text-center">🔍 Cari (⌘K)</Link>
                <Link href="/progress" className="secondary text-center">📊 Progres</Link>
              </div>
              <div className="mt-4 flex gap-2 flex-wrap">
                <button onClick={()=>{
                  const blob=new Blob([store.exportJson()],{type:"application/json"});
                  const url=URL.createObjectURL(blob); const a=document.createElement("a"); a.href=url; a.download="soumatome-progress.json"; a.click(); URL.revokeObjectURL(url);
                }} className="secondary text-sm">Export</button>
                <label className="secondary text-sm cursor-pointer">Import<input type="file" className="hidden" accept=".json" onChange={e=>{
                  const f=e.target.files?.[0]; if(!f) return; const r=new FileReader(); r.onload=()=>{ try{ store.importJson(r.result as string); alert("Import berhasil"); }catch{alert("Gagal") } }; r.readAsText(f);
                }} /></label>
                <Link href="/settings" className="secondary text-sm">Pengaturan</Link>
              </div>
            </div>
          </div>
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
