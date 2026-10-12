"use client";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import BottomNav from "@/components/BottomNav";
import { useStore } from "@/lib/store";
import { ContentBundleSchema } from "@/lib/schemas";
import { useState } from "react";

export default function SettingsPage(){
  const store = useStore();
  const [msg, setMsg] = useState("");
  return (
    <div className="min-h-screen">
      <Header />
      <div className="app-shell !min-h-0 max-w-[1280px] mx-auto">
        <Sidebar />
        <main className="flex-1 px-4 lg:px-6 py-6 pb-24 lg:pb-6 w-full max-w-[760px] mx-auto">
          <h1 className="text-2xl font-bold mb-4">Pengaturan</h1>

          <div className="space-y-4">
            <div className="rounded-2xl border bg-white dark:bg-white/5 p-4">
              <div className="font-semibold mb-2">Tampilan</div>
              <div className="flex flex-wrap gap-3 items-center">
                <label className="text-sm">Tema
                  <select value={store.settings.theme} onChange={e=>store.updateSettings({theme: e.target.value as any})} className="ml-2 border rounded-lg px-2 py-1">
                    <option value="system">System</option><option value="light">Light</option><option value="dark">Dark</option>
                  </select>
                </label>
                <label className="text-sm">Ukuran font
                  <input type="range" min={14} max={20} value={store.settings.fontSize} onChange={e=>store.updateSettings({fontSize: parseInt(e.target.value)})} className="ml-2" />
                  <span className="ml-2 text-xs">{store.settings.fontSize}px</span>
                </label>
              </div>
              <div className="flex gap-4 mt-3">
                <label className="text-sm flex items-center gap-2"><input type="checkbox" checked={store.settings.furigana} onChange={e=>store.updateSettings({furigana: e.target.checked})} /> Furigana</label>
                <label className="text-sm flex items-center gap-2"><input type="checkbox" checked={store.settings.romaji} onChange={e=>store.updateSettings({romaji: e.target.checked})} /> Romaji</label>
              </div>
            </div>

            <div className="rounded-2xl border bg-white dark:bg-white/5 p-4">
              <div className="font-semibold mb-2">Belajar</div>
              <label className="text-sm">Target harian (lesson)
                <input type="number" min={1} max={100} value={store.settings.targetHarian} onChange={e=>store.updateSettings({targetHarian: parseInt(e.target.value)||15})} className="ml-2 border rounded-lg px-2 py-1 w-20" />
              </label>
            </div>

            <div className="rounded-2xl border bg-white dark:bg-white/5 p-4">
              <div className="font-semibold mb-2">Import konten (JSON sesuai skema)</div>
              <p className="text-xs opacity-60 mb-2">Upload file JSON dengan shape {`{kanji, kotoba, bunpou, dokkai, choukai, quiz}`}. Validator zod akan cek sebelum simpan. File ditaruh di localStorage (v1).</p>
              <label className="px-4 py-2 rounded-xl border text-sm cursor-pointer">Pilih file JSON<input type="file" accept=".json" className="hidden" onChange={e=>{
                const f=e.target.files?.[0]; if(!f) return;
                const r=new FileReader(); r.onload=()=>{
                  try{
                    const j=JSON.parse(r.result as string);
                    ContentBundleSchema.parse(j);
                    localStorage.setItem("soumatome-import-"+Date.now(), JSON.stringify(j));
                    setMsg("✓ Valid! Tersimpan di localStorage (cek DevTools > Application). Integrasi penuh ke content akan di v2.");
                  }catch(err:any){ setMsg("✗ Invalid: "+ (err.message||String(err))); }
                }; r.readAsText(f);
              }} /></label>
              {msg && <div className="text-xs mt-2 p-2 rounded bg-slate-50 dark:bg-white/5">{msg}</div>}
              <div className="text-xs opacity-60 mt-2">Skema Zod ada di lib/schemas.ts — lihat README untuk contoh.</div>
            </div>

            <div className="rounded-2xl border bg-white dark:bg-white/5 p-4">
              <div className="font-semibold mb-2">Data</div>
              <div className="flex gap-2 flex-wrap">
                <button onClick={()=>{
                  const blob=new Blob([store.exportJson()],{type:"application/json"});
                  const url=URL.createObjectURL(blob); const a=document.createElement("a"); a.href=url; a.download="soumatome-progress.json"; a.click();
                }} className="px-4 py-2 rounded-xl border text-sm">Export progres</button>
                <label className="px-4 py-2 rounded-xl border text-sm cursor-pointer">Import progres<input type="file" className="hidden" accept=".json" onChange={e=>{
                  const f=e.target.files?.[0]; if(!f) return; const r=new FileReader(); r.onload=()=>{ store.importJson(r.result as string); alert("Import ok"); }; r.readAsText(f);
                }} /></label>
                <button onClick={()=>{ if(confirm("Reset semua progres?")) store.resetAll(); }} className="px-4 py-2 rounded-xl bg-red-500 text-white text-sm">Reset progres</button>
              </div>
            </div>
          </div>
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
