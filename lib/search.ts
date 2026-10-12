import Fuse from "fuse.js";
export type SearchDoc = { id: string; title: string; yomi?: string; romaji?: string; arti?: string; level: string; kategori: string; href: string; unit: string };
let fuse: Fuse<SearchDoc> | null = null;
export function buildIndex(docs: SearchDoc[]){
  fuse = new Fuse(docs, { keys: ["title","yomi","romaji","arti","kategori"], threshold: 0.35, ignoreLocation: true, includeScore: true });
}
export function search(q: string, limit=20): SearchDoc[]{
  if(!fuse || !q.trim()) return [];
  return fuse.search(q).slice(0, limit).map(r=>r.item);
}
export function filterBy(docs: SearchDoc[], level?: string, kategori?: string){
  return docs.filter(d=> (!level||d.level===level) && (!kategori||d.kategori===kategori));
}
