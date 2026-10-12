import { ContentBundleSchema, type ContentBundle } from "./schemas";
import n5 from "@/content/n5.json";
import n4 from "@/content/n4.json";
import n3 from "@/content/n3.json";
import n2 from "@/content/n2.json";

const bundles: Record<string, ContentBundle> = {
  n5: ContentBundleSchema.parse(n5),
  n4: ContentBundleSchema.parse(n4),
  n3: ContentBundleSchema.parse(n3),
  n2: ContentBundleSchema.parse(n2),
};

export function getBundle(level: string): ContentBundle | null {
  return bundles[level] || null;
}
export function getAllBundles(){ return bundles; }
export function allLevels(){ return ["n5","n4","n3","n2"] as const; }

export function getUnits(bundle: ContentBundle){
  const s = new Set<string>();
  for(const k of bundle.kanji) s.add(k.unit);
  for(const k of bundle.kotoba) s.add(k.unit);
  for(const k of bundle.bunpou) s.add(k.unit);
  return [...s].sort();
}
