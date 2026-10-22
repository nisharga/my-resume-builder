import type { TemplateId } from "@/types/cv";

export const ACCENT_COLORS = [
  "#2B5F75",
  "#2F4B8A",
  "#6B3FA0",
  "#1F7A55",
  "#9A3B26",
  "#333A45",
] as const;

export const ACCENT_COLOR_NAMES: Record<(typeof ACCENT_COLORS)[number], string> = {
  "#2B5F75": "Ocean",
  "#2F4B8A": "Navy",
  "#6B3FA0": "Violet",
  "#1F7A55": "Forest",
  "#9A3B26": "Rust",
  "#333A45": "Slate",
};

export const TEMPLATES: { id: TemplateId; name: string }[] = [
  { id: "classic", name: "Classic" },
  { id: "sidebar", name: "Sidebar" },
  { id: "minimal", name: "Minimal" },
];
