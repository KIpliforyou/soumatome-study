import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import BottomNav from "@/components/BottomNav";
import Link from "next/link";

export default function AboutPage(){
  return (
    <div className="min-h-screen">
      <Header />
      <div className="max-w-[1280px] mx-auto flex">
        <Sidebar />
        <main className="flex-1 px-4 py-6 pb-20 lg:pb-6 max-w-[760px]">
          <h1 className="text-2xl font-bold mb-2">Tentang Soumatome Study</h1>
          <p className="opacity-70 mb-6">Web app belajar bahasa Jepang untuk JLPT N5-N2. Struktur navigasi mengikuti silabus Soumatome (Kanji, Goi, Bunpou, Dokkai, Choukai per minggu), tapi <b>isi konten orisinal</b> — tidak menyalin buku.</p>

          <div className="rounded-2xl border bg-white dark:bg-white/5 p-4 mb-4">
            <h2 className="font-semibold">Sumber data & lisensi</h2>
            <ul className="list-disc pl-5 text-sm mt-2 space-y-1 opacity-80">
              <li><b>JMdict / KANJIDIC2</b> — Electronic Dictionary Research and Development Group, lisensi <b>CC BY-SA 3.0</b>. Atribusi dicantumkan di sini. Data kamus digunakan sebagai referensi bacaan/arti, bukan copy-paste massal.</li>
              <li>Daftar kanji/kotoba JLPT komunitas berlisensi terbuka.</li>
              <li>Penjelasan bunpou & contoh kalimat ditulis sendiri (orisinal).</li>
            </ul>
          </div>

          <div className="rounded-2xl border bg-white dark:bg-white/5 p-4 mb-4">
            <h2 className="font-semibold">Cakupan konten (v1)</h2>
            <div className="text-sm mt-2 space-y-1">
              <div>N5: 24 kanji · 24 kotoba · 10 bunpou · 3 dokkai · 2 choukai · 8 quiz</div>
              <div>N4: 22 kanji · 18 kotoba · 8 bunpou · 1 dokkai · 1 choukai · 5 quiz</div>
              <div>N3: 15 kanji · 8 kotoba · 3 bunpou · 1 dokkai · 1 choukai · 3 quiz</div>
              <div>N2: 13 kanji · 6 kotoba · 3 bunpou · 1 dokkai · 1 choukai · 2 quiz</div>
              <div className="opacity-60">Total: 74 kanji · 56 kotoba · 24 bunpou · 6 dokkai · 5 choukai · 18 quiz</div>
            </div>
          </div>

          <div className="rounded-2xl border bg-white dark:bg-white/5 p-4 mb-4">
            <h2 className="font-semibold">Cara tambah konten</h2>
            <ol className="list-decimal pl-5 text-sm mt-2 space-y-1 opacity-80">
              <li>Lihat skema di <code>lib/schemas.ts</code> (Zod).</li>
              <li>Buat JSON sesuai <code>ContentBundle</code> atau pakai <code>scripts/generate.ts</code> sebagai template.</li>
              <li>Import lewat halaman Pengaturan → Import konten.</li>
              <li>Validasi: <code>npm run validate:content</code> — build gagal kalau data rusak.</li>
            </ol>
          </div>

          <div className="text-sm opacity-60">Hak cipta buku Soumatome tetap milik penerbit. App ini tidak mendistribusikan isi buku.</div>
          <Link href="/" className="inline-block mt-4 px-4 py-2 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-black text-sm">← Kembali ke Dashboard</Link>
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
