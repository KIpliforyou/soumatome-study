import { z } from "zod";
export const LevelEnum = z.enum(["n5","n4","n3","n2"]);
export type Level = z.infer<typeof LevelEnum>;

export const KanjiSchema = z.object({
  char: z.string().min(1),
  onyomi: z.array(z.string()).default([]),
  kunyomi: z.array(z.string()).default([]),
  arti_id: z.string().min(1),
  strokes: z.number().optional(),
  contoh_kata: z.array(z.object({ kata: z.string(), kana: z.string(), arti: z.string() })).default([]),
  level: LevelEnum,
  unit: z.string().min(1),
});
export const KotobaSchema = z.object({
  id: z.string().min(1),
  kanji: z.string().optional(),
  kana: z.string().min(1),
  romaji: z.string().min(1),
  arti_id: z.string().min(1),
  kelas_kata: z.string().min(1),
  contoh_kalimat: z.object({ jp: z.string(), kana: z.string(), id: z.string() }),
  level: LevelEnum,
  unit: z.string().min(1),
});
export const BunpouSchema = z.object({
  id: z.string().min(1),
  pola: z.string().min(1),
  arti: z.string().min(1),
  rumus: z.string().min(1),
  inti_singkat: z.string().min(1),
  penjelasan: z.string().min(1),
  perbandingan: z.string().optional(),
  contoh: z.array(z.object({ jp: z.string(), kana: z.string(), id: z.string() })).min(3).max(5),
  kesalahan_umum: z.array(z.string()).default([]),
  level: LevelEnum,
  unit: z.string().min(1),
  tags: z.array(z.string()).default([]),
});
export const DokkaiSchema = z.object({
  id: z.string().min(1),
  judul: z.string().min(1),
  teks: z.string().min(1),
  kana: z.string().optional(),
  terjemah_id: z.string().min(1),
  pertanyaan: z.array(z.object({ q: z.string(), opsi: z.array(z.string()).min(2), jawaban: z.number(), penjelasan: z.string() })).min(1),
  level: LevelEnum,
  unit: z.string().min(1),
});
export const ChoukaiSchema = z.object({
  id: z.string().min(1),
  judul: z.string().min(1),
  naskah: z.string().min(1),
  terjemah_id: z.string().min(1),
  pertanyaan: z.array(z.object({ q: z.string(), opsi: z.array(z.string()).min(2), jawaban: z.number(), penjelasan: z.string() })).min(1),
  level: LevelEnum,
  unit: z.string().min(1),
});
export const QuizSchema = z.object({
  id: z.string().min(1),
  tipe: z.enum(["pilihan_ganda","isi_titik","susun_kalimat","tebak_bacaan","tebak_arti"]),
  pertanyaan: z.string().min(1),
  opsi: z.array(z.string()).optional(),
  jawaban: z.string().min(1),
  penjelasan: z.string().min(1),
  tag: z.string().min(1),
  level: LevelEnum,
  unit: z.string().optional(),
  kategori: z.enum(["kanji","kotoba","bunpou","campuran"]).default("campuran"),
});

export const ContentBundleSchema = z.object({
  kanji: z.array(KanjiSchema).default([]),
  kotoba: z.array(KotobaSchema).default([]),
  bunpou: z.array(BunpouSchema).default([]),
  dokkai: z.array(DokkaiSchema).default([]),
  choukai: z.array(ChoukaiSchema).default([]),
  quiz: z.array(QuizSchema).default([]),
});
export type ContentBundle = z.infer<typeof ContentBundleSchema>;
