import { useState } from "react";
import { Pressable, ScrollView, Text, View, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { setAccent, setTemplate } from "@/redux/features/cvSlice";
import { colors } from "@/styles/colors";
import ScaledPage from "../ScaledPage";
import ExportButtons from "../components/ExportButtons";
import TemplatePicker from "../components/TemplatePicker";
import AccentColorPicker from "../components/AccentColorPicker";
import { Accordion } from "@/components/ui/Accordion";
import { toast } from "@/utils/toast";
import type { TemplateId } from "@/types/cv";

const ZOOM_LEVELS = [
  { label: "Fit", value: 1 },
  { label: "2×", value: 1.6 },
  { label: "3×", value: 2.4 },
] as const;

export default function PreviewScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const cv = useAppSelector((s) => s.cv);
  const { width } = useWindowDimensions();
  const [zoomIdx, setZoomIdx] = useState(0);

  const zoom = ZOOM_LEVELS[zoomIdx]?.value ?? 1;
  const pageWidth = width - 32;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["top", "bottom"]}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 8,
          paddingVertical: 10,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
          backgroundColor: colors.background,
        }}
      >
        <Pressable
          onPress={() => router.back()}
          hitSlop={8}
          style={{ width: 44, alignItems: "center" }}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <ArrowLeft size={22} color={colors.foreground} strokeWidth={2} />
        </Pressable>

        <Text
          style={{
            flex: 1,
            textAlign: "center",
            fontSize: 17,
            fontWeight: "600",
            color: colors.foreground,
          }}
        >
          Preview
        </Text>

        {/* Zoom segmented control */}
        <View
          style={{
            flexDirection: "row",
            backgroundColor: colors.border,
            borderRadius: 8,
            padding: 2,
            marginRight: 4,
          }}
        >
          {ZOOM_LEVELS.map((z, i) => (
            <Pressable
              key={z.label}
              onPress={() => setZoomIdx(i)}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 6,
                backgroundColor: zoomIdx === i ? "#fff" : "transparent",
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "600",
                  color: zoomIdx === i ? colors.foreground : colors.mutedForeground,
                }}
              >
                {z.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Scrollable body: CV + customisation controls */}
      <ScrollView
        style={{ flex: 1, backgroundColor: "#E8EBF0" }}
        contentContainerStyle={{ padding: 16, gap: 16 }}
        horizontal={zoom > 1}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled>
          {/* CV page */}
          <ScaledPage targetWidth={pageWidth} zoom={zoom} cv={cv} />

          {/* Customisation accordion */}
          <View style={{ marginTop: 16 }}>
            <Accordion title="Customize">
              <View style={{ padding: 16, gap: 16 }}>
                {/* Template */}
                <View style={{ gap: 8 }}>
                  <Text style={{ fontSize: 13, fontWeight: "600", color: colors.mutedForeground }}>
                    TEMPLATE
                  </Text>
                  <TemplatePicker
                    selected={cv.template}
                    onSelect={(id: TemplateId) => dispatch(setTemplate(id))}
                  />
                </View>

                {/* Color */}
                <View style={{ gap: 8 }}>
                  <Text style={{ fontSize: 13, fontWeight: "600", color: colors.mutedForeground }}>
                    COLOR
                  </Text>
                  <AccentColorPicker
                    selected={cv.accent}
                    onSelect={(hex) => dispatch(setAccent(hex))}
                  />
                </View>
              </View>
            </Accordion>
          </View>
        </ScrollView>
      </ScrollView>

      {/* Bottom export bar */}
      <ExportButtons
        onEdit={() => router.back()}
        onPDF={() => toast.info("PDF export: install expo-print & expo-sharing to enable.")}
        onDocs={() => toast.info("Google Docs export coming soon.")}
      />
    </SafeAreaView>
  );
}
