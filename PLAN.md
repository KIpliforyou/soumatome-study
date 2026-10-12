# PLAN — Soumatome Study

## Versions (pinned stable 2026-10-12)
| Package | Version |
|---------|---------|
| next | 16.4.0 |
| react / react-dom | 19.2.0 / 19.2.0 |
| typescript | 5.8.3 |
| tailwindcss | 4.1.12 |
| @types/node | 22.15.0 |
| @types/react / @types/react-dom | 19.1.9 / 19.1.6 |
| zustand | 5.0.8 |
| fuse.js | 7.1.0 |
| zod | 4.1.5 |
| vitest | 4.0.2 |
| eslint | 9.39.5 |
| eslint-config-next | 16.4.0 |
| prettier | 3.6.2 |
| next-pwa | 5.6.0 |

## Architecture
- Single Next.js App Router at repo root (no monorepo workspaces — Vercel root build)
- /app — routes (dashboard, level pages, flashcard, quiz, search, settings, about)
- /components — ui (shadcn), layout, flashcard, quiz, charts
- /lib — srs (SM-2), scoring, search (Fuse index), store (zustand persist), schemas (zod)
- /content/{n5,n4,n3,n2} — static JSON per kategori
- /scripts — generate + validate content (zod)
- /tests — vitest (srs, scoring)

## Phases
0 scaffold green build
1 schemas + content N5 N4 (kanji/goi/bunpou/dokkai/choukai/quiz) + generator/validator + import
2 dashboard + belajar + flashcard SRS + bunpou detail
3 quiz + search + progress + bookmark + settings + PWA
4 polish + deploy GitHub + Vercel

## Notes
- Konten orisinal, tidak scrape Soumatome. Atribusi JMdict/KANJIDIC2 di About.
- localStorage via zustand persist, siap Supabase nanti.
