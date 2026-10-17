import { colors } from "@/styles/colors";
import { Briefcase, FileText, LayoutTemplate, type LucideIcon } from "lucide-react-native";

// ─── App ──────────────────────────────────────────────────────────────────────

export const APP_NAME = "My Resume Builder";
export const SPLASH_TITLE = "CV Builder";
export const SPLASH_TAGLINE = "Create Professional CVs in Minutes";

// ─── Onboarding ───────────────────────────────────────────────────────────────

export type Slide = {
  Icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  title: string;
  description: string;
};

export const ONBOARDING_SLIDES: Slide[] = [
  {
    Icon: FileText,
    iconBg: colors.accent,
    iconColor: colors.primary,
    title: "Build Your CV",
    description: "Create stunning professional resumes in minutes with our easy-to-use builder.",
  },
  {
    Icon: LayoutTemplate,
    iconBg: "#FFF7ED",
    iconColor: colors.warning,
    title: "Choose a Template",
    description: "Pick from professionally designed templates that make you stand out.",
  },
  {
    Icon: Briefcase,
    iconBg: "#F0FDF4",
    iconColor: colors.success,
    title: "Get Hired",
    description: "Download and share your CV to land your dream job.",
  },
];

export const ONBOARDING_BTN_NEXT = "Next";
export const ONBOARDING_BTN_GET_STARTED = "Get Started";
export const ONBOARDING_BTN_SKIP = "Skip";
