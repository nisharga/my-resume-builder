import type { CVData, PersonalInfo } from "@/types/cv";

/** "2020 – 2023" (en dash). Skips empty parts. */
export function formatDates(start: string, end: string): string {
  const parts = [start, end].filter(Boolean);
  return parts.join(" – ");
}

/** Split a multi-line description into trimmed bullet strings. */
export function splitBullets(desc: string): string[] {
  return desc
    .split("\n")
    .map((line) => line.replace(/^[\-•\*]\s*/, "").trim())
    .filter(Boolean);
}

/** Contact info lines (email, phone, location, website), skipping blanks. */
export function getContacts(personal: PersonalInfo): string[] {
  return [personal.email, personal.phone, personal.location, personal.website].filter(Boolean);
}

export interface SectionCompletion {
  personal: boolean;
  summary: boolean;
  experience: boolean;
  education: boolean;
  skills: boolean;
}

export function getSectionCompletion(cv: CVData): SectionCompletion {
  return {
    personal: Boolean(cv.personal.name && cv.personal.email),
    summary: cv.summary.length > 20,
    experience: cv.experience.length >= 1,
    education: cv.education.length >= 1,
    skills: cv.skills.length >= 3,
  };
}

export function completedCount(completion: SectionCompletion): number {
  return Object.values(completion).filter(Boolean).length;
}
