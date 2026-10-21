import { Screen } from "@/components";
import { Additionalbutton, ScreenHeader } from "@/components/common";
import Sheet from "@/components/ui/Sheet";
import { colors } from "@/styles/colors";
import { ACCENT_COLORS } from "@/features/cv/constants";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import {
  setAccent,
  setTemplate,
  addAchievement,
  toggleAchievement,
  removeAchievement,
} from "@/redux/features/cvSlice";
import type { TemplateId } from "@/types/cv";
import { Check, Plus, Trash2 } from "lucide-react-native";
import { type ImageSourcePropType } from "react-native";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { AddFieldForm, TemplateCard } from "./components";

// ─── data ─────────────────────────────────────────────────────────────────────

const TEMPLATES: { id: TemplateId; name: string; image: ImageSourcePropType }[] = [
  {
    id: "classic",
    name: "Classic",
    image: require("../../../../assets/image/Clasic.png") as ImageSourcePropType,
  },
  {
    id: "minimal",
    name: "Minimal",
    image: require("../../../../assets/image/Minimal.png") as ImageSourcePropType,
  },
  {
    id: "sidebar",
    name: "Sidebar",
    image: require("../../../../assets/image/sidebar.png") as ImageSourcePropType,
  },
];

// ─── screen ───────────────────────────────────────────────────────────────────

export default function TemplatesScreen() {
  const dispatch = useAppDispatch();
  const cv = useAppSelector((s) => s.cv);

  const [fieldSheetOpen, setFieldSheetOpen] = useState(false);
  const [achSheetOpen, setAchSheetOpen] = useState(false);

  return (
    <Screen>
      <ScreenHeader title="Templates" className="mb-4" />

      <View className="px-4 pb-8">
        {/* Template grid */}
        <View className="mb-6 flex-row flex-wrap justify-between gap-y-5">
          {TEMPLATES.map((tpl) => (
            <TemplateCard
              key={tpl.id}
              name={tpl.name}
              image={tpl.image}
              selected={cv.template === tpl.id}
              accent={cv.accent}
              onSelect={() => dispatch(setTemplate(tpl.id))}
            />
          ))}
        </View>

        {/* Accent color */}
        <View className="mb-6">
          <Text
            className="mb-3 text-xs tracking-widest text-muted-foreground"
            style={{ fontFamily: "Poppins-SemiBold" }}
          >
            ACCENT COLOR
          </Text>
          <View className="flex-row flex-wrap gap-3">
            {ACCENT_COLORS.map((hex) => (
              <Pressable
                key={hex}
                onPress={() => dispatch(setAccent(hex))}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: hex,
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: cv.accent === hex ? 3 : 0,
                  borderColor: colors.foreground,
                }}
              >
                {cv.accent === hex && <Check size={18} color="#fff" strokeWidth={3} />}
              </Pressable>
            ))}
          </View>
        </View>

        {/* ── Achievements & Rewards ─────────────────────────────────────────── */}
        <View className="">
          <Text
            className="mb-3 text-xs tracking-widest text-muted-foreground"
            style={{ fontFamily: "Poppins-SemiBold" }}
          >
            ADDITIONAL FIELDS
          </Text>

          <View className="mb-3 overflow-hidden rounded-2xl bg-white">
            {cv.achievements.map((item, i) => (
              <View
                key={item.id}
                style={
                  i < cv.achievements.length - 1
                    ? { borderBottomWidth: 1, borderBottomColor: colors.border }
                    : undefined
                }
                className="flex-row items-center gap-3 px-4 py-3.5"
              >
                {/* Dot indicator — colored when enabled */}
                <View
                  style={{ backgroundColor: item.enabled ? cv.accent : colors.border }}
                  className="h-2 w-2 rounded-full"
                />

                {/* Name */}
                <Text
                  className="flex-1 text-sm"
                  style={{
                    fontFamily: item.enabled ? "Poppins-SemiBold" : "Poppins-Regular",
                    color: item.enabled ? colors.foreground : colors.mutedForeground,
                  }}
                  numberOfLines={2}
                >
                  {item.name}
                </Text>

                {/* Enable / Disable toggle */}
                <Pressable
                  onPress={() => dispatch(toggleAchievement(item.id))}
                  hitSlop={6}
                  style={{
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    borderRadius: 20,
                    backgroundColor: item.enabled ? cv.accent : colors.border,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 11,
                      fontFamily: "Poppins-SemiBold",
                      color: item.enabled ? "#fff" : colors.mutedForeground,
                    }}
                  >
                    {item.enabled ? "On" : "Off"}
                  </Text>
                </Pressable>

                {/* Delete */}
                <Pressable onPress={() => dispatch(removeAchievement(item.id))} hitSlop={8}>
                  <Trash2 size={15} color={colors.destructive} strokeWidth={2} />
                </Pressable>
              </View>
            ))}
          </View>
        </View>

        {/* Add additional field — joins the same list with toggle + delete */}
        <Sheet
          title="Add Additional Field"
          open={fieldSheetOpen}
          onOpen={() => setFieldSheetOpen(true)}
          onClose={() => setFieldSheetOpen(false)}
          trigger={<Additionalbutton label=" Add Additional Field" />}
        >
          <AddFieldForm
            onAdd={(field) =>
              dispatch(addAchievement({ name: field.title, enabled: true, value: "" }))
            }
            onClose={() => setFieldSheetOpen(false)}
          />
        </Sheet>
      </View>
    </Screen>
  );
}
