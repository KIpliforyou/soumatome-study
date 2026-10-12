"use client";
import { useState, useMemo } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import BottomNav from "@/components/BottomNav";
import { getAllBundles } from "@/lib/content";
import { useStore } from "@/lib/store";

export default function QuizPage(){
  const bundles = getAllBundles();
  const store = useStore();
  const [level, setLevel] = useState("n5");
  const [started, setStarted] = useState(false);
  const [answers, setAnswers] = useState<Record<string,string>>({});
  const [done, setDone] = useState(false);
  const [mockMode, setMockMode] = useState(false);

  const quiz = useMemo(()=>{
    const b = bundles[level as keyof typeof bundles];
    if(!b) return [];
    const q = [...b.quiz];
    if(mockMode){
      const all = Object.values(bundles).flatMap(x=>x.quiz);
      return all.sort(()=>Math.random()-0.5).slice(0, Math.min(10, all.length));
    }
    return q;
  },[level, bundles, mockMode]);

  const score = useMemo(()=>{
    let c=0; for(const q of quiz) if(answers[q.id]===q.jawaban) c++; return {c, total: quiz.length, pct: quiz.length? Math.round(c/quiz.length*100):0};
  },[answers, quiz]);

  if(!started){
    return (
      <div className="min-h-screen">
        <Header />
        <div className="app-shell !min-h-0 max-w-[1280px] mx-auto">
          <Sidebar />
          <main className="flex-1 px-4 lg:px-6 py-6 pb-24 lg:pb-6 w-full max-w-[1280px] mx-auto">
            <h1 className="text-2xl font-bold mb-2">Kuis</h1>
            <p className="text-sm opacity-60 mb-4">Pilihan ganda, tebak bacaan/arti. Skor + riwayat tersimpan.</p>
            <div className="flex gap-2 mb-4 flex-wrap">
              {(["n5","n4","n3","n2"] as const).map(l=>(
                <button key={l} onClick={()=>setLevel(l)} className={"px-3 py-1.5 rounded-full text-sm "+(level===l?"bg-slate-900 text-white dark:bg-white dark:text-black":"border")}>{l.toUpperCase()} ({bundles[l].quiz.length})</button>
              ))}
              <label className="flex items-center gap-2 text-sm ml-2"><input type="checkbox" checked={mockMode} onChange={e=>setMockMode(e.target.checked)} /> Mock test campuran</label>
            </div>
            <div className="rounded-2xl border bg-white dark:bg-white/5 p-6 max-w-[560px]">
              <div className="font-semibold">Siap kuis {level.toUpperCase()}?</div>
              <div className="text-sm opacity-60">{quiz.length} soal · tanpa timer di v1 (timer di mock test: 60s/soal)</div>
              <button onClick={()=>{ setStarted(true); setAnswers({}); setDone(false); }} className="mt-4 px-6 py-2 rounded-xl bg-red-500 text-white font-medium">Mulai</button>
            </div>
          </main>
        </div>
        <BottomNav />
      </div>
    );
  }

  if(done){
    return (
      <div className="min-h-screen">
        <Header />
        <div className="app-shell !min-h-0 max-w-[1280px] mx-auto">
          <Sidebar />
          <main className="flex-1 px-4 py-6 pb-20 lg:pb-6 max-w-[720px]">
            <h1 className="text-2xl font-bold">Hasil — {score.c}/{score.total} ({score.pct}%)</h1>
            <div className="mt-2 h-3 rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden"><div className="h-full bg-emerald-500" style={{width: score.pct+"%"}} /></div>
            <div className="mt-6 space-y-3">
              {quiz.map(q=>{
                const ok = answers[q.id]===q.jawaban;
                return (
                  <div key={q.id} className={"rounded-xl border p-3 "+(ok?"bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200":"bg-red-50 dark:bg-red-900/20 border-red-200")}>
                    <div className="text-sm font-medium">{q.pertanyaan}</div>
                    <div className="text-xs mt-1">Jawabanmu: <b>{answers[q.id]||"(kosong)"}</b> {ok?"✓":"✗"} · Kunci: <b>{q.jawaban}</b></div>
                    <div className="text-xs opacity-70 mt-1">{q.penjelasan}</div>
                  </div>
                );
              })}
            </div>
            <div className="flex gap-2 mt-6">
              <button onClick={()=>{ setStarted(false); setDone(false); }} className="px-4 py-2 rounded-xl border">Kembali</button>
              <button onClick={()=>{ setAnswers({}); setDone(false); }} className="px-4 py-2 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-black">Ulangi</button>
            </div>
          </main>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <div className="app-shell !min-h-0 max-w-[1280px] mx-auto">
        <Sidebar />
        <main className="flex-1 px-4 py-6 pb-20 lg:pb-6 max-w-[720px]">
          <div className="flex items-center gap-2 mb-4">
            <button onClick={()=>setStarted(false)} className="text-sm opacity-60 hover:opacity-100">← Keluar</button>
            <span className="text-sm px-2 py-0.5 rounded-full bg-slate-900 text-white dark:bg-white dark:text-black">{level.toUpperCase()}</span>
            <span className="text-sm opacity-60">{Object.keys(answers).length}/{quiz.length} terjawab</span>
          </div>
          <div className="space-y-4">
            {quiz.map((q, i)=>(
              <div key={q.id} className="rounded-2xl border bg-white dark:bg-white/5 p-4">
                <div className="text-sm font-medium">{i+1}. {q.pertanyaan} <span className="text-xs opacity-60">· {q.tipe}</span></div>
                <div className="mt-2 grid gap-2">
                  {(q.opsi || [q.jawaban]).map((opt:string)=>(
                    <label key={opt} className={"flex items-center gap-2 px-3 py-2 rounded-xl border cursor-pointer "+(answers[q.id]===opt?"bg-slate-900 text-white dark:bg-white dark:text-black":"hover:bg-slate-50 dark:hover:bg-white/10")}>
                      <input type="radio" name={q.id} checked={answers[q.id]===opt} onChange={()=>setAnswers(a=>({...a,[q.id]:opt}))} className="hidden" />
                      <span className="text-sm">{opt}</span>
                    </label>
                  ))}
                  {!q.opsi && (
                    <input placeholder="Ketik jawaban..." value={answers[q.id]||""} onChange={e=>setAnswers(a=>({...a,[q.id]:e.target.value}))} className="border rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-red-400" />
                  )}
                </div>
              </div>
            ))}
          </div>
          <button onClick={()=>{
            setDone(true);
            store.recordQuiz({id: Date.now().toString(), score: Object.entries(answers).filter(([k,v])=> quiz.find(q=>q.id===k)?.jawaban===v).length, total: quiz.length, at: Date.now(), level});
          }} className="mt-6 w-full py-3 rounded-xl bg-red-500 text-white font-semibold">Selesai & Lihat Skor</button>
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
