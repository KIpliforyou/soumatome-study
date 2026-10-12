import { describe, it, expect } from "vitest";
import { scoreQuiz, readiness } from "@/lib/scoring";

describe("scoring", ()=>{
  it("scores correctly", ()=>{
    const r = scoreQuiz({a:"x",b:"y"}, {a:"x",b:"z"});
    expect(r.correct).toBe(1); expect(r.total).toBe(2); expect(r.percent).toBe(50);
  });
  it("readiness mixes coverage and accuracy", ()=>{
    expect(readiness(5,10,0.8)).toBeGreaterThan(50);
  });
});
