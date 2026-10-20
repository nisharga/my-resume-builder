import type { CVData } from "@/types/cv";
import ClassicTemplate from "./templates/ClassicTemplate";
import MinimalTemplate from "./templates/MinimalTemplate";
import SidebarTemplate from "./templates/SidebarTemplate";

interface Props {
  cv: CVData;
  highlightSection?: string;
  onSectionLayout?: (id: string, y: number) => void;
}

export default function CVPage({ cv, highlightSection, onSectionLayout }: Props) {
  const props = { cv, highlightSection, onSectionLayout };

  switch (cv.template) {
    case "classic":
      return <ClassicTemplate {...props} />;
    case "minimal":
      return <MinimalTemplate {...props} />;
    case "sidebar":
    default:
      return <SidebarTemplate {...props} />;
  }
}
