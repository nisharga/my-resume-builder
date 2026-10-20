import { Pressable, Text, View } from "react-native";
import ScaledPage from "@/features/cv/ScaledPage";
import Sheet from "@/components/ui/Sheet";
import type { CVData, TemplateId } from "@/types/cv";
import { ACCENT_COLORS, TEMPLATES } from "@/features/cv/constants";
import { colors } from "@/styles/colors";
import { Check } from "lucide-react-native";

interface Props {
  cv: CVData;
  onPreview: () => void;
  onSetTemplate: (id: TemplateId) => void;
  onSetAccent: (hex: string) => void;
}

export default function HeroCard({ cv, onPreview, onSetTemplate, onSetAccent }: Props) {
  const THUMB_W = 88;

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
        <View className="flex-1 justify-center gap-1">
          <Text className="sm-bold text-foreground" numberOfLines={1}>
            {cv.personal.name || "Untitled CV"}
          </Text>
          <Text className="text-[13px] text-muted-foreground">
            {TEMPLATES.find((t) => t.id === cv.template)?.name ?? "Sidebar"} template
          </Text>

          {/* Action buttons */}
          <View className="mt-2 flex-row gap-2">
            <Sheet
              title="Template"
              trigger={
                <View className="rounded-full border border-border px-3 py-1.5">
                  <Text className="text-[13px] font-medium text-foreground">Template</Text>
                </View>
              }
            >
              {(close) => (
                <View className="gap-4">
                  <View className="flex-row justify-around">
                    {TEMPLATES.map((tpl) => (
                      <Pressable
                        key={tpl.id}
                        onPress={() => {
                          onSetTemplate(tpl.id);
                          close();
                        }}
                        className="items-center gap-1"
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
                          <ScaledPage targetWidth={80} clip cv={cv} templateOverride={tpl.id} />
                        </View>
                        <Text className="text-[12px] font-medium text-foreground">{tpl.name}</Text>
                      </Pressable>
                    ))}
                  </View>
                  <Pressable onPress={close} className="items-center rounded-xl bg-primary py-3">
                    <Text className="text-[15px] font-semibold text-white">Done</Text>
                  </Pressable>
                </View>
              )}
            </Sheet>

            <Sheet
              title="Accent color"
              trigger={
                <View className="flex-row items-center gap-1.5 rounded-full border border-border px-3 py-1.5">
                  <View
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: 6,
                      backgroundColor: cv.accent,
                    }}
                  />
                  <Text className="text-[13px] font-medium text-foreground">Color</Text>
                </View>
              }
            >
              {(close) => (
                <View className="gap-4">
                  <View className="flex-row flex-wrap gap-3">
                    {ACCENT_COLORS.map((hex) => (
                      <Pressable
                        key={hex}
                        onPress={() => {
                          onSetAccent(hex);
                          close();
                        }}
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 20,
                          backgroundColor: hex,
                          alignItems: "center",
                          justifyContent: "center",
                          borderWidth: cv.accent === hex ? 2 : 0,
                          borderColor: colors.foreground,
                        }}
                      >
                        {cv.accent === hex && <Check size={16} color="#fff" strokeWidth={3} />}
                      </Pressable>
                    ))}
                  </View>
                  <Pressable onPress={close} className="items-center rounded-xl bg-primary py-3">
                    <Text className="text-[15px] font-semibold text-white">Done</Text>
                  </Pressable>
                </View>
              )}
            </Sheet>
          </View>
        </View>
      </View>
    </View>
  );
}
