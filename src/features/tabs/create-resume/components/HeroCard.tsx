import { Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Info } from "lucide-react-native";
import ScaledPage from "@/features/cv/ScaledPage";
import { TEMPLATES } from "@/features/cv/constants";
import { colors } from "@/styles/colors";
import type { CVData } from "@/types/cv";
import { SectionHeaderAction } from "./SectionHeaderAction";

interface Props {
  cv: CVData;
  onPreview: () => void;
}

export default function HeroCard({ cv, onPreview }: Props) {
  const router = useRouter();
  const THUMB_W = 88;
  const CV_Number = "#1";
  const templateName = TEMPLATES.find((t) => t.id === cv.template)?.name ?? "Sidebar";
  const templateColor = "Blue";

  function goToTemplates() {
    router.push("/(tabs)/templates");
  }

  console.log("cv", cv);

  return (
    <View className="mx-4 overflow-hidden rounded-2xl border border-border bg-white p-4">
      <View className="flex-row gap-4">
        {/* CV thumbnail */}
        <Pressable
          onPress={onPreview}
          className="active:opacity-75"
          style={{
            width: THUMB_W,
            height: THUMB_W * (1123 / 794),
            borderRadius: 8,
            overflow: "hidden",
            backgroundColor: "#F4F6F9",
          }}
        >
          <ScaledPage targetWidth={THUMB_W} clip cv={cv} />
        </Pressable>

        {/* Info */}
        <View className="flex-1 justify-center gap-2.5">
          {/* Resume ID */}
          <SectionHeaderAction label="CV No" value={CV_Number} onActionPress={goToTemplates} />
          <SectionHeaderAction
            label="Template"
            value={templateName}
            onActionPress={goToTemplates}
          />
          <SectionHeaderAction label="Color" value={templateColor} onActionPress={goToTemplates} />

          {/* Hint */}
          <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 5, marginTop: 2 }}>
            <Text style={{ fontSize: 11, color: colors.mutedForeground, flex: 1, lineHeight: 16 }}>
              You can change it before export as well.
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
