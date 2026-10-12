"use client";
import { useState, useEffect, useMemo } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import BottomNav from "@/components/BottomNav";
import { getAllBundles } from "@/lib/content";
import { useStore } from "@/lib/store";
import { dueCount } from "@/lib/srs";

type Card = { id:string; front:string; back:string; kana?:string; romaji?:string; level:string; unit:string; cat:string };

export default function FlashcardPage(){
  const bundles = getAllBundles();
  const store = useStore();
  const [level, setLevel] = useState("n5");
  const [mode, setMode] = useState<"baru"|"review"|"salah">("baru");
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [showFurigana, setShowFurigana] = useState(true);

  const cards: Card[] = useMemo(()=>{
    const b = bundles[level as keyof typeof bundles];
    if(!b) return [];
    const out: Card[]=[];
    for(const k of b.kanji) out.push({id: level+":kanji:"+k.char, front:k.char, back: k.arti_id+" — ON "+k.onyomi.join(" ")+" / KUN "+k.kunyomi.join(" "), kana: k.contoh_kata[0]?.kana, level, unit:k.unit, cat:"kanji"});
    for(const k of b.kotoba) out.push({id:k.id, front: k.kanji? k.kanji+"（"+k.kana+"）": k.kana, back: k.arti_id+" — "+k.kelas_kata+" — "+k.contoh_kalimat.jp, kana:k.kana, romaji:k.romaji, level, unit:k.unit, cat:"kotoba"});
    return out;
  },[level, bundles]);

  const filtered = useMemo(()=>{
    if(mode==="review"){
      const due = Object.values(store.srsCards).filter(c=>c.due<=Date.now()).map(c=>c.id);
      const set = new Set(due);
      const f = cards.filter(c=>set.has(c.id));
      return f.length? f : cards.slice(0, Math.min(10,cards.length));
    }
    if(mode==="salah"){
      const laps = Object.entries(store.srsCards).filter(([,v])=>v.lapses>0).map(([k])=>k);
      const set=new Set(laps);
      return cards.filter(c=>set.has(c.id));
    }
    return cards;
  },[cards, mode, store.srsCards]);

  const cur = filtered[idx % Math.max(1, filtered.length)];

  useEffect(()=>{
    const onKey=(e:KeyboardEvent)=>{
      if(e.code==="Space"){ e.preventDefault(); setFlipped(v=>!v); }
      if(["Digit1","Digit2","Digit3","Digit4"].includes(e.code) && cur){
        const map: Record<string,0|1|2|3>={Digit1:0,Digit2:1,Digit3:2,Digit4:3};
        store.ensureCard(cur.id); store.rateCard(cur.id, map[e.code]); setFlipped(false); setIdx(i=>i+1);
      }
      if(e.code==="ArrowRight"){ setFlipped(false); setIdx(i=>i+1); }
      if(e.code==="ArrowLeft"){ setFlipped(false); setIdx(i=>Math.max(0,i-1)); }
    };
    window.addEventListener("keydown", onKey); return ()=>window.removeEventListener("keydown",onKey);
  },[cur, store]);

  useEffect(()=>{ setIdx(0); setFlipped(false); },[level, mode]);

  const totalCards = Object.keys(store.srsCards).length;
  const due = dueCount(Object.values(store.srsCards));

  return (
    <div className="min-h-screen">
      <Header />
      <div className="max-w-[1280px] mx-auto flex">
        <Sidebar />
        <main className="flex-1 px-4 py-6 pb-20 lg:pb-6">
          <h1 className="text-2xl font-bold mb-2">Flashcard — SRS (SM-2)</h1>
          <p className="text-sm opacity-60 mb-4">Spasi = flip · 1 Lagi · 2 Sulit · 3 Bagus · 4 Mudah · ← → navigasi · TTS 🔊</p>

          <div className="flex flex-wrap gap-2 mb-4">
            {(["n5","n4","n3","n2"] as const).map(l=>(
              <button key={l} onClick={()=>setLevel(l)} className={"px-3 py-1.5 rounded-full text-sm "+(level===l?"bg-slate-900 text-white dark:bg-white dark:text-black":"border")}>{l.toUpperCase()}</button>
            ))}
            <span className="text-sm px-3 py-1.5 rounded-full border">{due} review hari ini · {totalCards} kartu dipelajari</span>
            <label className="text-sm flex items-center gap-1 ml-2"><input type="checkbox" checked={showFurigana} onChange={e=>setShowFurigana(e.target.checked)} /> Furigana</label>
          </div>

          <div className="flex gap-2 mb-4">
            {(["baru","review","salah"] as const).map(m=>(
              <button key={m} onClick={()=>setMode(m)} className={"px-4 py-1.5 rounded-full text-sm capitalize "+(mode===m?"bg-red-500 text-white":"border")}>{m==="baru"?"Baru":m==="review"?"Review hari ini":"Sering salah"}</button>
            ))}
          </div>

          {!cur ? (
            <div className="rounded-2xl border p-8 text-center opacity-60">Tidak ada kartu di mode ini. Coba mode Baru.</div>
          ) : (
            <div className="max-w-[560px] mx-auto">
              <div className="text-xs opacity-60 mb-2">{idx+1} / {filtered.length} · {cur.level.toUpperCase()} · {cur.unit} · {cur.cat}</div>
              <div
                onClick={()=>setFlipped(v=>!v)}
                className="rounded-2xl border bg-white dark:bg-white/5 p-8 min-h-[220px] grid place-items-center text-center cursor-pointer select-none shadow-sm hover:shadow-md transition"
              >
                {!flipped ? (
                  <div>
                    <div className="text-5xl font-bold" style={{fontFamily:"'Noto Serif JP', serif"}}>{cur.front}</div>
                    {showFurigana && cur.kana && <div className="text-sm opacity-60 mt-2">{cur.kana} {cur.romaji? "["+cur.romaji+"]":""}</div>}
                    <div className="text-xs opacity-40 mt-4">klik / spasi untuk balik</div>
                  </div>
                ) : (
                  <div>
                    <div className="text-lg">{cur.back}</div>
                    {cur.kana && <div className="text-sm opacity-60 mt-2">{cur.kana}</div>}
                  </div>
                )}
              </div>

              <div className="flex justify-center gap-2 mt-4">
                <button onClick={()=>{
                  const u=new SpeechSynthesisUtterance(cur.front); u.lang="ja-JP"; speechSynthesis.speak(u);
                }} className="px-3 py-1.5 rounded-full border text-sm">🔊 Audio</button>
                <button onClick={()=>{ setFlipped(false); setIdx(i=>Math.max(0,i-1)); }} className="px-3 py-1.5 rounded-full border text-sm">← Sebelumnya</button>
                <button onClick={()=>{ setFlipped(false); setIdx(i=>i+1); }} className="px-4 py-1.5 rounded-full bg-slate-900 text-white dark:bg-white dark:text-black text-sm">Lewati →</button>
              </div>

              {flipped && (
                <div className="grid grid-cols-4 gap-2 mt-4">
                  {[
                    {k:0,label:"Lagi",sub:"10m",cls:"bg-red-500"},
                    {k:1,label:"Sulit",sub:"1h",cls:"bg-orange-500"},
                    {k:2,label:"Bagus",sub:"1h+",cls:"bg-emerald-500"},
                    {k:3,label:"Mudah",sub:"3h+",cls:"bg-sky-500"},
                  ].map(b=>(
                    <button key={b.k} onClick={()=>{
                      store.ensureCard(cur.id); store.rateCard(cur.id, b.k as 0|1|2|3); setFlipped(false); setIdx(i=>i+1);
                    }} className={"rounded-xl text-white p-3 text-sm font-medium "+b.cls}>
                      <div>{b.label}</div><div className="text-xs opacity-80">{b.sub} · {b.k+1}</div>
                    </button>
                  ))}
                </div>
              )}
              <div className="text-xs opacity-60 mt-3 text-center">Swipe / klik · keyboard 1-4 untuk nilai</div>
            </div>
          )}
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
