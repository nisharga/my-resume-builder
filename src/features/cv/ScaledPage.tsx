import React, { memo, useState } from "react";
import { View } from "react-native";
import CVPage from "./CVPage";
import type { CVData, TemplateId } from "@/types/cv";

interface Props {
  /** Width the scaled page should visually occupy. */
  targetWidth: number;
  /** Extra zoom multiplier (default 1). */
  zoom?: number;
  /** If true, clips to A4 ratio height (for thumbnails). */
  clip?: boolean;
  cv: CVData;
  templateOverride?: TemplateId;
  highlightSection?: string;
  onSectionLayout?: (id: string, y: number) => void;
}

function ScaledPage({
  targetWidth,
  zoom = 1,
  clip = false,
  cv,
  templateOverride,
  highlightSection,
  onSectionLayout,
}: Props) {
  const [pageHeight, setPageHeight] = useState(1123);

  const effectiveCv = templateOverride ? { ...cv, template: templateOverride } : cv;
  const scale = (targetWidth / 794) * zoom;
  const displayedHeight = clip ? targetWidth * (1123 / 794) : pageHeight * scale;

  return (
    <View
      style={{
        width: targetWidth * zoom,
        height: displayedHeight,
        overflow: "hidden",
      }}
    >
      <View
        style={{
          width: 794,
          // transformOrigin 'top left' (RN 0.74+) scales from the top-left corner
          // so the visual content aligns with the container's origin.
          transformOrigin: "top left",
          transform: [{ scale }],
        }}
        onLayout={(e) => setPageHeight(e.nativeEvent.layout.height)}
      >
        <CVPage
          cv={effectiveCv}
          highlightSection={highlightSection}
          onSectionLayout={onSectionLayout}
        />
      </View>
    </View>
  );
}

export default memo(ScaledPage);
