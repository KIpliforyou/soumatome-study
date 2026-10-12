import Link from "next/link";
export function LevelCard({ level, title, desc, stats }: { level:string; title:string; desc:string; stats:string }){
  const colors: Record<string,string>={n5:"from-emerald-400 to-emerald-600",n4:"from-sky-400 to-sky-600",n3:"from-amber-400 to-orange-500",n2:"from-red-500 to-rose-600"};
  return (
    <Link href={"/level/"+level} className="rounded-2xl border bg-white dark:bg-white/5 p-4 flex flex-col gap-3 hover:shadow-md transition">
      <div className={"h-20 rounded-xl bg-gradient-to-br "+(colors[level]||"from-slate-400 to-slate-600")+" grid place-items-center text-white font-bold text-2xl"}>{level.toUpperCase()}</div>
      <div><div className="font-semibold">{title}</div><div className="text-sm opacity-70">{desc}</div></div>
      <div className="text-xs opacity-60">{stats}</div>
    </Link>
  );
}
