import Link from "next/link";
const items = [
  { href:"/", label:"Dashboard", icon:"🏠" },
  { href:"/level/n5", label:"N5", icon:"🌸" },
  { href:"/level/n4", label:"N4", icon:"🌿" },
  { href:"/level/n3", label:"N3", icon:"🔥" },
  { href:"/level/n2", label:"N2", icon:"⚡" },
  { href:"/flashcard", label:"Flashcard", icon:"🃏" },
  { href:"/quiz", label:"Kuis", icon:"📝" },
  { href:"/progress", label:"Progres", icon:"📊" },
  { href:"/settings", label:"Pengaturan", icon:"⚙️" },
];
export default function Sidebar(){
  return (
    <aside className="hidden lg:block w-[240px] shrink-0">
      <div className="sticky top-[64px] p-3 space-y-1">
        {items.map(it=>(
          <Link key={it.href} href={it.href} className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 text-sm font-medium">
            <span>{it.icon}</span>{it.label}
          </Link>
        ))}
        <div className="pt-4 text-xs opacity-60 px-3">© Soumatome Study — konten orisinal</div>
      </div>
    </aside>
  );
}
