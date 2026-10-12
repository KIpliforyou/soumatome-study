"use client";
import { useParams } from "next/navigation";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import BottomNav from "@/components/BottomNav";
import Link from "next/link";
import { getBundle, getUnits } from "@/lib/content";
import { useStore } from "@/lib/store";
import { useState } from "react";

export default function LevelPage(){
  const { level } = useParams<{level:string}>();
  const bundle = getBundle(level);
  const store = useStore();
  const [tab, setTab] = useState<"kanji"|"kotoba"|"bunpou"|"dokkai"|"choukai"|"quiz">("kanji");
  if(!bundle) return <div className="p-8">Level tidak ditemukan</div>;
  const units = getUnits(bundle);
  const cats: Record<string, any[]> = { kanji: bundle.kanji, kotoba: bundle.kotoba, bunpou: bundle.bunpou, dokkai: bundle.dokkai, choukai: bundle.choukai, quiz: bundle.quiz };

  return (
    <div className="min-h-screen">
      <Header />
      <div className="max-w-[1280px] mx-auto flex">
        <Sidebar />
        <main className="flex-1 px-4 py-6 pb-20 lg:pb-6">
          <div className="flex items-center gap-2 mb-4">
            <Link href="/" className="text-sm opacity-60 hover:opacity-100">← Dashboard</Link>
            <span className="text-sm px-2 py-0.5 rounded-full bg-slate-900 text-white dark:bg-white dark:text-black">{level.toUpperCase()}</span>
            <button onClick={()=>store.setLastLevel(level)} className="ml-auto text-sm px-3 py-1 rounded-full border">Jadikan level aktif</button>
          </div>
          <h1 className="text-2xl font-bold mb-1">Level {level.toUpperCase()}</h1>
          <p className="text-sm opacity-60 mb-4">{bundle.kanji.length} kanji · {bundle.kotoba.length} kotoba · {bundle.bunpou.length} bunpou · {bundle.dokkai.length} dokkai · {bundle.choukai.length} choukai</p>

          <div className="flex flex-wrap gap-2 mb-6">
            {(["kanji","kotoba","bunpou","dokkai","choukai","quiz"] as const).map(c=>(
              <button key={c} onClick={()=>setTab(c)} className={"px-4 py-1.5 rounded-full text-sm font-medium capitalize "+(tab===c?"bg-red-500 text-white":"border hover:bg-slate-50 dark:hover:bg-white/10")}>{c}</button>
            ))}
          </div>

          {units.map(unit=> {
            const items = (cats[tab] as any[]).filter((x:any)=>x.unit===unit);
            if(items.length===0) return null;
            return (
              <div key={unit} className="mb-6">
                <h2 className="font-semibold mb-2 capitalize">{unit.replace("-"," ") } <span className="text-xs opacity-60">· {items.length} materi</span></h2>
                <div className="grid gap-2">
                  {items.map((it:any)=>{
                    const key = level+":"+tab+":"+unit+":"+(it.char||it.id||it.pola||it.judul);
                    const done = !!store.completedLessons[key];
                    return (
                      <div key={key} className="rounded-xl border bg-white dark:bg-white/5 p-3 flex items-start gap-3">
                        <input type="checkbox" checked={done} onChange={()=>store.toggleLesson(key)} className="mt-1" />
                        <div className="flex-1 min-w-0">
                          {tab==="kanji" && <div><span className="text-2xl font-bold" style={{fontFamily:"'Noto Serif JP', serif"}}>{it.char}</span> <span className="text-sm opacity-70">— {it.arti_id}</span> <span className="text-xs opacity-60 ml-2">ON {it.onyomi.join(" ")} / KUN {it.kunyomi.join(" ")}</span></div>}
                          {tab==="kotoba" && <div><span className="font-semibold">{it.kanji? it.kanji+"（"+it.kana+"）": it.kana}</span> <span className="text-sm">[{it.romaji}]</span> — {it.arti_id} <span className="text-xs opacity-60">· {it.kelas_kata}</span><div className="text-sm opacity-70">{it.contoh_kalimat.jp} — {it.contoh_kalimat.id}</div></div>}
                          {tab==="bunpou" && (
                            <div>
                              <div className="font-semibold">{it.pola} — {it.arti}</div>
                              <div className="text-xs px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-900/30 inline-block mt-1">{it.rumus}</div>
                              <div className="text-sm mt-1"><span className="font-medium">Inti:</span> {it.inti_singkat}</div>
                              <div className="text-sm opacity-80 mt-1">{it.penjelasan}</div>
                              {it.perbandingan && <div className="text-xs mt-1 p-2 rounded bg-slate-50 dark:bg-white/5">⚖️ {it.perbandingan}</div>}
                              <div className="mt-2 space-y-1 text-sm">
                                {it.contoh.map((c:any,i:number)=>(<div key={i} className="pl-3 border-l-2"> {c.jp} <span className="opacity-60">— {c.id}</span></div>))}
                              </div>
                              <div className="flex gap-2 mt-2">
                                <button onClick={()=>{
                                  const u=new SpeechSynthesisUtterance(it.contoh[0].jp); u.lang="ja-JP"; speechSynthesis.speak(u);
                                }} className="text-xs px-2 py-1 rounded-full border">🔊 TTS</button>
                                <button onClick={()=>store.toggleBookmark(it.id)} className={"text-xs px-2 py-1 rounded-full border "+(store.bookmarks.includes(it.id)?"bg-amber-400":"")}>{store.bookmarks.includes(it.id)?"★ Bookmark":"☆ Bookmark"}</button>
                              </div>
                            </div>
                          )}
                          {tab==="dokkai" && <div><div className="font-semibold">{it.judul}</div><div className="text-sm whitespace-pre-wrap mt-1">{it.teks}</div><div className="text-xs opacity-60 mt-1">→ {it.terjemah_id}</div></div>}
                          {tab==="choukai" && (
                            <div>
                              <div className="font-semibold">{it.judul}</div>
                              <div className="text-sm mt-1 whitespace-pre-wrap">{it.naskah}</div>
                              <button onClick={()=>{
                                const u=new SpeechSynthesisUtterance(it.naskah.replace(/\n/g," ")); u.lang="ja-JP"; u.rate=0.9; speechSynthesis.speak(u);
                              }} className="mt-2 text-xs px-3 py-1 rounded-full bg-sky-500 text-white">▶️ Putar (TTS)</button>
                            </div>
                          )}
                          {tab==="quiz" && <div><div className="text-sm font-medium">{it.pertanyaan}</div><div className="text-xs opacity-60">Jawaban: {it.jawaban} · {it.penjelasan}</div></div>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
