export type SrsRating = 0|1|2|3; // 0=lagi 1=sulit 2=bagus 3=mudah
export type SrsCard = {
  id: string;
  ease: number; // 1.3 - 2.5
  interval: number; // days
  due: number; // timestamp ms
  reps: number;
  lapses: number;
};

export function createCard(id: string, now = Date.now()): SrsCard {
  return { id, ease: 2.5, interval: 0, due: now, reps: 0, lapses: 0 };
}

export function review(card: SrsCard, rating: SrsRating, now = Date.now()): SrsCard {
  let { ease, interval, reps, lapses } = card;
  if (rating === 0) {
    lapses += 1;
    reps = 0;
    interval = 0;
    ease = Math.max(1.3, ease - 0.2);
    return { ...card, ease, interval, reps, lapses, due: now + 10*60*1000 }; // 10 min
  }
  if (rating === 1) {
    ease = Math.max(1.3, ease - 0.15);
    interval = reps === 0 ? 1 : Math.max(1, Math.round(interval * 1.2));
  } else if (rating === 2) {
    interval = reps === 0 ? 1 : reps === 1 ? 3 : Math.round(interval * ease);
  } else {
    ease = Math.min(2.8, ease + 0.1);
    interval = reps === 0 ? 3 : reps === 1 ? 4 : Math.round(interval * ease * 1.15);
  }
  reps += 1;
  const due = now + interval * 86400000;
  return { id: card.id, ease, interval, due, reps, lapses };
}

export function dueCount(cards: SrsCard[], now = Date.now()){ return cards.filter(c=>c.due<=now).length; }
export function sortByDue(cards: SrsCard[]){ return [...cards].sort((a,b)=>a.due-b.due); }
