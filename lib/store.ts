"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SrsCard } from "./srs";
import { createCard, review as srsReview } from "./srs";
import type { SrsRating } from "./srs";

export type Progress = {
  completedLessons: Record<string, boolean>; // key: level:category:unit:id
  streak: number;
  lastStudyDate: string | null; // YYYY-MM-DD
  dailyTarget: number;
  xp: number;
  quizHistory: { id: string; score: number; total: number; at: number; level: string }[];
  srsCards: Record<string, SrsCard>;
  bookmarks: string[];
  notes: Record<string,string>;
  settings: { fontSize: number; furigana: boolean; romaji: boolean; theme: "light"|"dark"|"system"; targetHarian: number };
  lastLevel: string;
  activity: Record<string, number>; // YYYY-MM-DD -> count
};

const todayStr = ()=> new Date().toISOString().slice(0,10);

type Store = Progress & {
  toggleLesson: (key: string)=>void;
  setLastLevel: (l: string)=>void;
  addXp: (n: number)=>void;
  recordQuiz: (r: Progress["quizHistory"][number])=>void;
  ensureCard: (id: string)=>void;
  rateCard: (id: string, rating: SrsRating)=>void;
  toggleBookmark: (id: string)=>void;
  setNote: (id: string, v: string)=>void;
  updateSettings: (p: Partial<Progress["settings"]>)=>void;
  touchActivity: ()=>void;
  exportJson: ()=>string;
  importJson: (s: string)=>void;
  resetAll: ()=>void;
};

const initial: Progress = {
  completedLessons: {},
  streak: 0,
  lastStudyDate: null,
  dailyTarget: 10,
  xp: 0,
  quizHistory: [],
  srsCards: {},
  bookmarks: [],
  notes: {},
  settings: { fontSize: 16, furigana: true, romaji: false, theme: "system", targetHarian: 15 },
  lastLevel: "n5",
  activity: {},
};

export const useStore = create<Store>()(persist((set, get)=>({
  ...initial,
  toggleLesson: (key)=> set(s=>{
    const v = {...s.completedLessons, [key]: !s.completedLessons[key]};
    const today = todayStr();
    const act = {...s.activity, [today]: (s.activity[today]||0)+1};
    let streak = s.streak; let last = s.lastStudyDate;
    if(last !== today){
      const y = new Date(); y.setDate(y.getDate()-1);
      const yStr = y.toISOString().slice(0,10);
      if(last===yStr) streak+=1; else if(last!==today) streak = last? streak+1 : 1;
      last = today;
    }
    return { completedLessons: v, activity: act, streak, lastStudyDate: last, xp: s.xp+5 };
  }),
  setLastLevel: (l)=> set({ lastLevel: l }),
  addXp: (n)=> set(s=>({ xp: s.xp+n })),
  recordQuiz: (r)=> set(s=>({ quizHistory: [...s.quizHistory, r], xp: s.xp + Math.round(r.score/r.total*10) })),
  ensureCard: (id)=> set(s=> s.srsCards[id] ? s : { srsCards: {...s.srsCards, [id]: createCard(id)} }),
  rateCard: (id, rating)=> set(s=>{
    const c = s.srsCards[id] || createCard(id);
    const nc = srsReview(c, rating);
    return { srsCards: {...s.srsCards, [id]: nc}, xp: s.xp+2 };
  }),
  toggleBookmark: (id)=> set(s=>({ bookmarks: s.bookmarks.includes(id) ? s.bookmarks.filter(x=>x!==id) : [...s.bookmarks, id]})),
  setNote: (id,v)=> set(s=>({ notes: {...s.notes, [id]: v}})),
  updateSettings: (p)=> set(s=>({ settings: {...s.settings, ...p}})),
  touchActivity: ()=> set(s=>{ const t=todayStr(); return { activity: {...s.activity, [t]:(s.activity[t]||0)+1}};}),
  exportJson: ()=> JSON.stringify(get(), null, 2),
  importJson: (str)=> { try{ const o=JSON.parse(str); set(o);}catch{} },
  resetAll: ()=> set({...initial}),
}), { name: "soumatome-store", version: 2 }));

export function heatmapData(activity: Record<string,number>, days=90){
  const out: {date:string;count:number}[]=[];
  const now=new Date();
  for(let i=days-1;i>=0;i--){ const d=new Date(now); d.setDate(d.getDate()-i); const k=d.toISOString().slice(0,10); out.push({date:k,count:activity[k]||0});}
  return out;
}
