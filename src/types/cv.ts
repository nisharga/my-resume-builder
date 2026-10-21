import type { KeyboardTypeOptions } from "react-native";

export type TemplateId = "classic" | "sidebar" | "minimal";

export interface PersonalInfo {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  portfolio: string;
  linkedin: string;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  start: string;
  end: string;
  desc: string; // one bullet point per line
}

export interface Education {
  id: string;
  degree: string;
  school: string;
  start: string;
  end: string;
}

export interface CVListItem {
  id: string;
  name: string;
  jobTitle: string;
  template: TemplateId;
  accent: string;
  updatedAt: number;
}

export interface CVData {
  id: string;
  updatedAt: number;
  template: TemplateId;
  accent: string;
  personal: PersonalInfo;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: string[];
}

export interface FieldDef {
  key: keyof PersonalInfo;
  label: string;
  placeholder: string;
  keyboard?: KeyboardTypeOptions;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
}
