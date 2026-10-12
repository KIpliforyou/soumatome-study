"use client";
import { useState, useEffect, useMemo } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import BottomNav from "@/components/BottomNav";
import { getAllBundles } from "@/lib/content";
import { useStore } from "@/lib/store";
import { dueCount } from "@/lib/srs";

type Card = {
  id:string; front:string; backArti:string; onyomi?:string[]; kunyomi?:string[]; contoh?:{kata:string;kana:string;arti:string}[]; kana?:string; romaji?:string; level:string; unit:string; cat:string; detail?:string;
};

export default function FlashcardPage(){
  const bundles = getAllBundles();
  const store = useStore();
  const [level, setLevel] = useState("n5");
  const [mode, setMode] = useState<"baru"|"review"|"salah"|"kanji"|"kotoba">("baru");
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [showFurigana, setShowFurigana] = useState(true);
  const [showRomaji, setShowRomaji] = useState(false);

  const cards: Card[] = useMemo(()=>{
    const b = bundles[level as keyof typeof bundles];
    if(!b) return [];
    const out: Card[]=[];
    for(const k of b.kanji) out.push({
      id: level+":kanji:"+k.char, front:k.char, backArti: k.arti_id,
      onyomi: k.onyomi, kunyomi: k.kunyomi, contoh: k.contoh_kata,
      level, unit:k.unit, cat:"kanji", detail: k.strokes? `Strokes: ${k.strokes}`: undefined
    });
    for(const k of b.kotoba) out.push({
      id:k.id, front: k.kanji? k.kanji+"（"+k.kana+"）": k.kana, backArti: k.arti_id,
      kana:k.kana, romaji:k.romaji, level, unit:k.unit, cat:"kotoba", detail: k.kelas_kata+" — "+k.contoh_kalimat.jp+" — "+k.contoh_kalimat.id
    });
    return out;
  },[level, bundles]);

  const filtered = useMemo(()=>{
    let base = cards;
    if(mode==="kanji") base = cards.filter(c=>c.cat==="kanji");
    else if(mode==="kotoba") base = cards.filter(c=>c.cat==="kotoba");
    else if(mode==="review"){
      const due = new Set(Object.values(store.srsCards).filter(c=>c.due<=Date.now()).map(c=>c.id));
      const f = base.filter(c=>due.has(c.id));
      return f.length? f : base.slice(0, Math.min(12, base.length));
    } else if(mode==="salah"){
      const laps = new Set(Object.entries(store.srsCards).filter(([,v])=>v.lapses>0).map(([k])=>k));
      const f = base.filter(c=>laps.has(c.id));
      return f.length? f : [];
    }
    return base;
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
          <h1 className="text-2xl font-bold mb-1">Flashcard — SRS (SM-2)</h1>
          <p className="text-sm opacity-60 mb-3">Spasi = flip · 1 Lagi · 2 Sulit · 3 Bagus · 4 Mudah · ← → navigasi · 🔊 TTS · Kanji tampil onyomi/kunyomi + contoh di balik kartu</p>

          <div className="flex flex-wrap gap-2 mb-3">
            {(["n5","n4","n3","n2"] as const).map(l=>{
              const b = bundles[l];
              return <button key={l} onClick={()=>setLevel(l)} className={"px-3 py-1.5 rounded-full text-sm "+(level===l?"bg-slate-900 text-white dark:bg-white dark:text-black":"border")}>{l.toUpperCase()} <span className="opacity-60 text-xs">({b.kanji.length+b.kotoba.length})</span></button>
            })}
            <span className="text-sm px-3 py-1.5 rounded-full border">{due} review hari ini · {totalCards} dipelajari</span>
          </div>
          <div className="flex flex-wrap gap-2 mb-3 items-center">
            {(["baru","review","salah","kanji","kotoba"] as const).map(m=>(
              <button key={m} onClick={()=>setMode(m)} className={"px-4 py-1.5 rounded-full text-sm capitalize "+(mode===m?"bg-red-500 text-white":"border")}>{m==="baru"?"Semua":m==="review"?"Review hari ini":m==="salah"?"Sering salah":m}</button>
            ))}
            <label className="text-sm flex items-center gap-1 ml-2"><input type="checkbox" checked={showFurigana} onChange={e=>setShowFurigana(e.target.checked)} /> Furigana</label>
            <label className="text-sm flex items-center gap-1"><input type="checkbox" checked={showRomaji} onChange={e=>setShowRomaji(e.target.checked)} /> Romaji</label>
          </div>

          {!cur ? (
            <div className="rounded-2xl border p-8 text-center opacity-60">Tidak ada kartu di mode ini. Coba mode Semua/Kanji/Kotoba.</div>
          ) : (
            <div className="max-w-[600px] mx-auto">
              <div className="text-xs opacity-60 mb-2 flex justify-between"><span>{idx+1} / {filtered.length} · {cur.level.toUpperCase()} · {cur.unit} · {cur.cat}</span><span>{cur.cat==="kanji"?"Kanji":"Kotoba"}</span></div>
              <div
                onClick={()=>setFlipped(v=>!v)}
                className="rounded-2xl border bg-white dark:bg-white/5 p-6 min-h-[280px] flex flex-col justify-center text-center cursor-pointer select-none shadow-sm hover:shadow-md transition"
              >
                {!flipped ? (
                  <div className="w-full">
                    <div className="text-6xl font-bold" style={{fontFamily:"'Noto Serif JP', serif"}}>{cur.front}</div>
                    {cur.cat==="kanji" && <div className="text-sm opacity-60 mt-2">Ketuk untuk lihat arti, bacaan & contoh</div>}
                    {cur.cat==="kotoba" && showFurigana && cur.kana && <div className="text-sm opacity-60 mt-2">{cur.kana} {showRomaji && cur.romaji? "["+cur.romaji+"]":""}</div>}
                    {cur.cat==="kotoba" && !showFurigana && showRomaji && cur.romaji && <div className="text-sm opacity-60 mt-2">[{cur.romaji}]</div>}
                    <div className="text-xs opacity-40 mt-4">klik / spasi untuk balik — swipe di HP</div>
                  </div>
                ) : (
                  <div className="w-full text-left">
                    {cur.cat==="kanji" ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2"><span className="text-3xl font-bold" style={{fontFamily:"'Noto Serif JP', serif"}}>{cur.front}</span><span className="text-lg">— {cur.backArti}</span></div>
                        {cur.detail && <div className="text-xs opacity-60">{cur.detail}</div>}
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="p-2 rounded-xl bg-orange-50 dark:bg-orange-900/20"><div className="text-xs opacity-60">Onyomi (音読み)</div><div className="font-medium">{cur.onyomi?.length? cur.onyomi.join(" ・ "): "—"}</div></div>
                          <div className="p-2 rounded-xl bg-sky-50 dark:bg-sky-900/20"><div className="text-xs opacity-60">Kunyomi (訓読み)</div><div className="font-medium">{cur.kunyomi?.length? cur.kunyomi.join(" ・ "): "—"}</div></div>
                        </div>
                        <div className="text-sm">
                          <div className="font-medium text-xs opacity-60 mb-1">Contoh kata (relevan untuk recall)</div>
                          <div className="space-y-1">
                            {(cur.contoh||[]).map((c,i)=>(
                              <div key={i} className="flex justify-between bg-slate-50 dark:bg-white/5 rounded-lg px-3 py-1.5 text-sm">
                                <span><b>{c.kata}</b> <span className="opacity-60">({c.kana})</span></span><span className="opacity-70">{c.arti}</span>
                              </div>
                            ))}
                            {(!cur.contoh || cur.contoh.length===0) && <div className="text-xs opacity-60">Belum ada contoh — tambah di content JSON</div>}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="text-xl font-bold">{cur.front}</div>
                        <div className="text-sm"><span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-xs mr-2">{cur.backArti}</span><span className="text-xs opacity-60">{cur.detail?.split(" — ")[0]}</span></div>
                        {showFurigana && cur.kana && <div className="text-sm opacity-70">Kana: {cur.kana}</div>}
                        {showRomaji && cur.romaji && <div className="text-sm opacity-70">Romaji: {cur.romaji}</div>}
                        <div className="text-sm opacity-80 mt-2 p-2 rounded-xl bg-slate-50 dark:bg-white/5">{cur.detail?.split(" — ").slice(1).join(" — ")}</div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex justify-center gap-2 mt-4 flex-wrap">
                <button onClick={()=>{
                  const t = cur.cat==="kanji" ? cur.front : (cur.kana||cur.front);
                  const u=new SpeechSynthesisUtterance(t); u.lang="ja-JP"; speechSynthesis.speak(u);
                }} className="px-3 py-1.5 rounded-full border text-sm">🔊 Audio</button>
                <button onClick={()=>{ setFlipped(false); setIdx(i=>Math.max(0,i-1)); }} className="px-3 py-1.5 rounded-full border text-sm">← Sebelumnya</button>
                <button onClick={()=>{ setFlipped(false); setIdx(i=>i+1); }} className="px-4 py-1.5 rounded-full bg-slate-900 text-white dark:bg-white dark:text-black text-sm">Lewati →</button>
              </div>

              {flipped && (
                <div className="grid grid-cols-4 gap-2 mt-4">
                  {[
                    {k:0,label:"Lagi",sub:"10m",cls:"bg-red-500"},
                    {k:1,label:"Sulit",sub:"~1h",cls:"bg-orange-500"},
                    {k:2,label:"Bagus",sub:"1d",cls:"bg-emerald-500"},
                    {k:3,label:"Mudah",sub:"3d+",cls:"bg-sky-500"},
                  ].map(b=>(
                    <button key={b.k} onClick={()=>{
                      store.ensureCard(cur.id); store.rateCard(cur.id, b.k as 0|1|2|3); setFlipped(false); setIdx(i=>i+1);
                    }} className={"rounded-xl text-white p-3 text-sm font-medium "+b.cls}>
                      <div>{b.label}</div><div className="text-xs opacity-80">{b.sub} · {b.k+1}</div>
                    </button>
                  ))}
                </div>
              )}
              <div className="text-xs opacity-60 mt-3 text-center">Geser / klik · keyboard 1-4 untuk nilai · progress tersimpan otomatis</div>
            </div>
          )}
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
