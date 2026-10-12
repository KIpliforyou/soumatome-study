# Soumatome Study — Belajar JLPT N5-N2

Web app belajar bahasa Jepang terstruktur untuk JLPT N5-N2: Kanji, Kotoba, Bunpou, Dokkai, Choukai. SRS flashcard, kuis, progres, PWA offline.

UI Bahasa Indonesia. Istilah Jepang: kanji + furigana + romaji.

## Jalankan lokal

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run validate:content  # validasi JSON konten (zod)
```

## Tambah konten
- Skema Zod di `lib/schemas.ts` (`ContentBundle`: kanji/kotoba/bunpou/dokkai/choukai/quiz)
- Edit `content/n5.json` dst. atau upload via Pengaturan → Import konten
- Validasi: `npm run validate:content` — build gagal kalau data rusak
- Generator template di `scripts/generate.ts`

## Sumber data & atribusi
- **JMdict / KANJIDIC2** (EDRDG) — CC BY-SA 3.0 — bacaan/arti sebagai referensi, bukan copy-paste massal
- Daftar JLPT komunitas berlisensi terbuka
- Penjelasan bunpou & contoh kalimat orisinal (ditulis sendiri, tidak menyalin buku Soumatome)
- Struktur navigasi (Kanji/Goi/Bunpou/Dokkai/Choukai per minggu) mengikuti silabus Soumatome sebagai kerangka.

## Tech
Next.js 16 App Router + TypeScript + Tailwind 4 + Zustand (persist localStorage) + Fuse.js + Zod + Vitest + next-pwa

## Deploy
```bash
gh repo create soumatome-study --public --source=. --push
vercel --prod
```

## Cakupan v1
N5 24/24/10, N4 22/18/8, N3 61/30/17, N2 63/28/16 — total 170 kanji, 100 kotoba, 51 bunpou, 10 dokkai, 9 choukai, 39 quiz
