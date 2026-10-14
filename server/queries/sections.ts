import "server-only";
import { asc, eq } from "drizzle-orm";
import { cacheLife } from "next/cache";
import { db } from "@/db";
import { section } from "@/db/schema";

export type SectionOption = { id: string; name: string };

/** The sections of a level, in programme order. They rarely change, so they are cached. */
export async function getSections(levelId = "bac"): Promise<SectionOption[]> {
  "use cache";
  cacheLife("days");
  return db
    .select({ id: section.id, name: section.name })
    .from(section)
    .where(eq(section.levelId, levelId))
    .orderBy(asc(section.sort));
}
