import { useState } from "react";
import { Pressable, ScrollView, Text, View, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, Check, Edit2, FileText, LayoutTemplate } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { setAccent, setTemplate } from "@/redux/features/cvSlice";
import { colors } from "@/styles/colors";
import { ACCENT_COLORS, TEMPLATES } from "../constants";
import ScaledPage from "../ScaledPage";
import Sheet from "@/components/ui/Sheet";
import type { TemplateId } from "@/types/cv";
import { toast } from "@/utils/toast";

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
  const pageWidth = width - 32; // 16px padding each side

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
                paddingHorizontal: 10,
                paddingVertical: 4,
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

      {/* CV body */}
      <ScrollView
        style={{ flex: 1, backgroundColor: "#E8EBF0" }}
        contentContainerStyle={{ padding: 16 }}
        horizontal={zoom > 1}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled>
          <ScaledPage targetWidth={pageWidth} zoom={zoom} cv={cv} />
        </ScrollView>
      </ScrollView>

      {/* Footer toolbar */}
      <View
        style={{
          flexDirection: "row",
          borderTopWidth: 1,
          borderTopColor: colors.border,
          backgroundColor: "#fff",
        }}
      >
        {/* Template */}
        <Sheet
          title="Template"
          trigger={
            <View
              style={{
                flex: 1,
                alignItems: "center",
                paddingVertical: 12,
                gap: 4,
              }}
            >
              <LayoutTemplate size={22} color={colors.mutedForeground} strokeWidth={1.8} />
              <Text style={{ fontSize: 12, fontWeight: "600", color: colors.mutedForeground }}>
                Template
              </Text>
            </View>
          }
        >
          {(close) => (
            <View style={{ gap: 16 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                {TEMPLATES.map((tpl) => (
                  <Pressable
                    key={tpl.id}
                    onPress={() => {
                      dispatch(setTemplate(tpl.id as TemplateId));
                      close();
                    }}
                    style={{ alignItems: "center", gap: 6 }}
                  >
                    <View
                      style={{
                        width: 80,
                        height: 80 * (1123 / 794),
                        borderRadius: 6,
                        overflow: "hidden",
                        borderWidth: cv.template === tpl.id ? 3 : 1,
                        borderColor: cv.template === tpl.id ? colors.primary : colors.border,
                      }}
                    >
                      <ScaledPage
                        targetWidth={80}
                        clip
                        cv={cv}
                        templateOverride={tpl.id as TemplateId}
                      />
                    </View>
                    <Text style={{ fontSize: 12, fontWeight: "500", color: colors.foreground }}>
                      {tpl.name}
                    </Text>
                  </Pressable>
                ))}
              </View>
              <Pressable
                onPress={close}
                style={{
                  backgroundColor: colors.primary,
                  borderRadius: 12,
                  alignItems: "center",
                  paddingVertical: 14,
                }}
              >
                <Text style={{ color: "#fff", fontWeight: "600", fontSize: 15 }}>Done</Text>
              </Pressable>
            </View>
          )}
        </Sheet>

        {/* Color */}
        <Sheet
          title="Accent color"
          trigger={
            <View style={{ flex: 1, alignItems: "center", paddingVertical: 12, gap: 4 }}>
              <View
                style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: cv.accent }}
              />
              <Text style={{ fontSize: 12, fontWeight: "600", color: colors.mutedForeground }}>
                Color
              </Text>
            </View>
          }
        >
          {(close) => (
            <View style={{ gap: 16 }}>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
                {ACCENT_COLORS.map((hex) => (
                  <Pressable
                    key={hex}
                    onPress={() => {
                      dispatch(setAccent(hex));
                      close();
                    }}
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 22,
                      backgroundColor: hex,
                      alignItems: "center",
                      justifyContent: "center",
                      borderWidth: cv.accent === hex ? 2 : 0,
                      borderColor: colors.foreground,
                    }}
                  >
                    {cv.accent === hex && <Check size={18} color="#fff" strokeWidth={3} />}
                  </Pressable>
                ))}
              </View>
              <Pressable
                onPress={close}
                style={{
                  backgroundColor: colors.primary,
                  borderRadius: 12,
                  alignItems: "center",
                  paddingVertical: 14,
                }}
              >
                <Text style={{ color: "#fff", fontWeight: "600", fontSize: 15 }}>Done</Text>
              </Pressable>
            </View>
          )}
        </Sheet>

        {/* Edit */}
        <Pressable
          onPress={() => router.back()}
          style={{ flex: 1, alignItems: "center", paddingVertical: 12, gap: 4 }}
          accessibilityRole="button"
          accessibilityLabel="Edit CV"
        >
          <Edit2 size={22} color={colors.mutedForeground} strokeWidth={1.8} />
          <Text style={{ fontSize: 12, fontWeight: "600", color: colors.mutedForeground }}>
            Edit
          </Text>
        </Pressable>

        {/* PDF */}
        <Pressable
          onPress={() => toast.info("PDF export: install expo-print & expo-sharing to enable.")}
          style={{
            flex: 1,
            alignItems: "center",
            paddingVertical: 12,
            gap: 4,
            backgroundColor: colors.primary,
          }}
          accessibilityRole="button"
          accessibilityLabel="Export PDF"
        >
          <FileText size={22} color="#fff" strokeWidth={1.8} />
          <Text style={{ fontSize: 12, fontWeight: "600", color: "#fff" }}>PDF</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
