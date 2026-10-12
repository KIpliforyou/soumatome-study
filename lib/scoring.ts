export function scoreQuiz(answers: Record<string,string>, key: Record<string,string>){
  let correct=0; const total=Object.keys(key).length;
  for(const k of Object.keys(key)) if(answers[k]===key[k]) correct++;
  return { correct, total, percent: total? Math.round(correct/total*100):0 };
}
export function readiness(completed: number, total: number, avgAccuracy: number){
  if(total===0) return 0;
  const coverage = completed/total;
  return Math.round((coverage*0.6 + avgAccuracy*0.4)*100);
}
