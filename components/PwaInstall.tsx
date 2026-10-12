"use client";
import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: "accepted"|"dismissed" }> };

export default function PwaInstall(){
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [offline, setOffline] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(()=>{
    const onBefore = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => { setInstalled(true); setDeferred(null); };
    const onOnline = () => setOffline(!navigator.onLine);
    const onOffline = () => setOffline(!navigator.onLine);
    window.addEventListener("beforeinstallprompt", onBefore as EventListener);
    window.addEventListener("appinstalled", onInstalled);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    setOffline(!navigator.onLine);
    // already installed (standalone)?
    if (window.matchMedia("(display-mode: standalone)").matches) setInstalled(true);
    // dismissed persisted
    try { if (localStorage.getItem("pwa-dismissed")==="1") setDismissed(true); } catch {}
    return ()=>{
      window.removeEventListener("beforeinstallprompt", onBefore as EventListener);
      window.removeEventListener("appinstalled", onInstalled);
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  },[]);

  const install = async () => {
    if(!deferred) return;
    await deferred.prompt();
    const { outcome } = await deferred.userChoice;
    if(outcome==="accepted") setInstalled(true);
    setDeferred(null);
  };
  const dismiss = () => {
    setDismissed(true);
    try{ localStorage.setItem("pwa-dismissed","1"); }catch{}
  };

  return (
    <>
      {offline && (
        <div className="fixed bottom-[72px] lg:bottom-4 right-4 z-40 pill" style={{background:"var(--yellow)"}}>
          📴 Offline · konten tersimpan tetap bisa dibuka
        </div>
      )}
      {!installed && deferred && !dismissed && (
        <div className="fixed bottom-[76px] lg:bottom-4 left-4 right-4 lg:left-auto lg:right-4 lg:max-w-[420px] z-40 cartoon-card yellow flex gap-3 items-center">
          <div className="w-10 h-10 rounded-xl bg-white border-[2.5px] border-[var(--ink)] grid place-items-center font-black shadow-[2px_2px_0_var(--ink)]">📲</div>
          <div className="flex-1 min-w-0">
            <div className="font-black text-sm" style={{fontFamily:"var(--font-display)"}}>Tambah ke layar utama</div>
            <div className="text-xs" style={{color:"var(--muted)"}}>Install Soumatome — buka tanpa browser, bisa offline.</div>
          </div>
          <button onClick={install} className="primary text-sm whitespace-nowrap">Install</button>
          <button onClick={dismiss} className="secondary text-sm px-3 py-2">Nanti</button>
        </div>
      )}
      {installed && (
        <div className="fixed bottom-[72px] lg:bottom-4 right-4 z-40 pill" style={{background:"var(--green-soft)", borderColor:"var(--ink)"}}>
          ✅ Terinstall — buka dari layar utama
        </div>
      )}
    </>
  );
}
