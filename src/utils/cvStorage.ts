import AsyncStorage from "@react-native-async-storage/async-storage";
import type { CVData, CVListItem } from "@/types/cv";

// ─── Keys ────────────────────────────────────────────────────────────────────

export const CV_LIST_KEY = "@cv_list_v1"; // index of all CVs (preview fields only)
const cvKey = (id: string) => `@cv_${id}`; // full CVData incl. achievements[], skills[], etc.

// ─── ID generator ────────────────────────────────────────────────────────────

export function genCVId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

// ─── List item helper ─────────────────────────────────────────────────────────

export function makeCVListItem(cv: CVData): CVListItem {
  return {
    id: cv.id,
    name: cv.personal.name || "Untitled CV",
    jobTitle: cv.personal.title,
    template: cv.template,
    accent: cv.accent,
    updatedAt: cv.updatedAt,
  };
}

// ─── CRUD ─────────────────────────────────────────────────────────────────────

export async function getAllCVs(): Promise<CVListItem[]> {
  const json = await AsyncStorage.getItem(CV_LIST_KEY);
  if (!json) return [];
  return JSON.parse(json) as CVListItem[];
}

export async function getCV(id: string): Promise<CVData | null> {
  const json = await AsyncStorage.getItem(cvKey(id));
  if (!json) return null;
  return JSON.parse(json) as CVData;
}

/** Upsert — creates or updates both the full CV and the list entry. */
export async function saveCV(cv: CVData): Promise<void> {
  await AsyncStorage.setItem(cvKey(cv.id), JSON.stringify(cv));

  const list = await getAllCVs();
  const idx = list.findIndex((item) => item.id === cv.id);
  const listItem = makeCVListItem(cv);
  if (idx === -1) {
    list.unshift(listItem);
  } else {
    list[idx] = listItem;
  }
  await AsyncStorage.setItem(CV_LIST_KEY, JSON.stringify(list));
}

export async function deleteCV(id: string): Promise<void> {
  await AsyncStorage.removeItem(cvKey(id));
  const list = await getAllCVs();
  await AsyncStorage.setItem(CV_LIST_KEY, JSON.stringify(list.filter((item) => item.id !== id)));
}

// ─── Formatting ───────────────────────────────────────────────────────────────

export function formatUpdatedAt(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days = Math.floor(diff / 86_400_000);

  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return new Date(timestamp).toLocaleDateString();
}
