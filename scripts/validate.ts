import { readFileSync, readdirSync } from "fs";
import { join } from "path";
import { ContentBundleSchema } from "../lib/schemas";

const contentDir = join(process.cwd(), "content");
let ok = true;
for(const f of readdirSync(contentDir)){
  if(!f.endsWith(".json")) continue;
  const p = join(contentDir, f);
  try{
    const j = JSON.parse(readFileSync(p,"utf-8"));
    ContentBundleSchema.parse(j);
    console.log("✓", f);
  }catch(e: unknown){
    console.error("✗", f, e instanceof Error ? e.message : String(e));
    ok = false;
  }
}
if(!ok){ console.error("Validation failed"); process.exit(1); }
console.log("All content valid");
