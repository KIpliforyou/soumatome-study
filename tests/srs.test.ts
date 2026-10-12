import { describe, it, expect } from "vitest";
import { createCard, review } from "@/lib/srs";

describe("SRS SM-2", ()=>{
  it("creates card due now", ()=>{
    const c = createCard("x", 1000);
    expect(c.due).toBe(1000);
    expect(c.ease).toBe(2.5);
  });
  it("rating Lagi resets interval and reschedules 10min", ()=>{
    const c = createCard("x", 0);
    const n = review(c, 0, 0);
    expect(n.interval).toBe(0);
    expect(n.due).toBe(10*60*1000);
  });
  it("Bagus increases interval", ()=>{
    const c = createCard("x", 0);
    const a = review(c, 2, 0);
    expect(a.interval).toBe(1);
    const b = review(a, 2, a.due);
    expect(b.interval).toBe(3);
  });
  it("Mudah boosts ease", ()=>{
    const c = createCard("x", 0);
    const n = review(c, 3, 0);
    expect(n.ease).toBeGreaterThan(2.5);
  });
});
