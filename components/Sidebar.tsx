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
    <aside className="sidebar hidden lg:flex">
      <div className="brand"><b>総</b> Soumatome <strong>Study</strong></div>
      <div className="side-label">Menu</div>
      <nav className="space-y-1">
        {items.map(it=>(
          <Link key={it.href} href={it.href} className="nav">
            <i>{it.icon}</i>{it.label}
          </Link>
        ))}
      </nav>
      <div className="mt-auto pt-6">
        <div className="panel" style={{padding:"12px"}}>
          <div className="text-xs font-black tracking-widest">SOUMATOME</div>
          <div className="text-xs opacity-60">Konten orisinal · JMdict CC BY-SA</div>
        </div>
      </div>
    </aside>
  );
}
