import Link from "next/link";
export default function NotFound(){ return <div className="p-8 text-center"><h1 className="text-2xl font-bold">404 — Halaman tidak ditemukan</h1><Link href="/" className="text-red-500 underline">Kembali ke Dashboard</Link></div>; }
