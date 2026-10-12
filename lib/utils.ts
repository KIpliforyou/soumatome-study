export function cn(...c: (string|false|undefined|null)[]) { return c.filter(Boolean).join(" "); }
export function levelLabel(l: string){ return l.toUpperCase(); }
export function levelColor(l: string){
  const m: Record<string,string>={n5:"bg-emerald-500",n4:"bg-sky-500",n3:"bg-amber-500",n2:"bg-red-500"};
  return m[l]||"bg-slate-500";
}
