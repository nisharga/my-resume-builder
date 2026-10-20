import { useRef, useState } from "react";
import { Pressable, ScrollView, Text, View, useWindowDimensions } from "react-native";
import { Maximize2, X } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useAppSelector } from "@/redux/store";
import ScaledPage from "./ScaledPage";

interface Props {
  /** Which section to highlight in the live preview. */
  sectionId?: string;
}

export default function LiveFab({ sectionId }: Props) {
  const [docked, setDocked] = useState(false);
  const router = useRouter();
  const cv = useAppSelector((s) => s.cv);
  const { width } = useWindowDimensions();
  const scrollRef = useRef<ScrollView>(null);

  const THUMB_W = 62;
  const PANEL_W = width - 32;

  if (docked) {
    return (
      <View
        style={{
          height: "40%",
          backgroundColor: "#fff",
          borderBottomWidth: 1,
          borderBottomColor: "#E6E8EC",
        }}
      >
        {/* Panel header */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 16,
            paddingVertical: 10,
            borderBottomWidth: 1,
            borderBottomColor: "#E6E8EC",
          }}
        >
          <View
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: "#4CAF50",
              marginRight: 6,
            }}
          />
          <Text style={{ flex: 1, fontSize: 13, fontWeight: "600", color: "#1A1F36" }}>
            Live preview
          </Text>
          <Pressable
            onPress={() => router.push("/cv-preview")}
            hitSlop={8}
            style={{ marginRight: 12 }}
          >
            <Maximize2 size={18} color="#6B7280" />
          </Pressable>
          <Pressable onPress={() => setDocked(false)} hitSlop={8}>
            <X size={18} color="#6B7280" />
          </Pressable>
        </View>

        {/* Scrollable preview */}
        <ScrollView
          ref={scrollRef}
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 16 }}
          showsVerticalScrollIndicator={false}
        >
          <ScaledPage targetWidth={PANEL_W} cv={cv} highlightSection={sectionId} />
        </ScrollView>
      </View>
    );
  }

  // Floating button (bottom-right)
  return (
    <View
      style={{
        position: "absolute",
        bottom: 100,
        right: 16,
        zIndex: 10,
      }}
      pointerEvents="box-none"
    >
      <Pressable
        onPress={() => setDocked(true)}
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "#fff",
          borderRadius: 14,
          paddingVertical: 6,
          paddingHorizontal: 8,
          gap: 8,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.12,
          shadowRadius: 8,
          elevation: 6,
        }}
      >
        {/* Tiny CV thumbnail */}
        <View
          style={{
            width: THUMB_W,
            height: THUMB_W * (1123 / 794),
            borderRadius: 4,
            overflow: "hidden",
            backgroundColor: "#F4F6F9",
          }}
        >
          <ScaledPage targetWidth={THUMB_W} clip cv={cv} />
        </View>

        {/* Live label */}
        <View style={{ gap: 3 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <View
              style={{
                width: 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: "#4CAF50",
              }}
            />
            <Text
              style={{
                fontSize: 12,
                fontWeight: "700",
                color: "#4CAF50",
              }}
            >
              Live
            </Text>
          </View>
        </View>
      </Pressable>
    </View>
  );
}
