import { Screen } from "@/components";
import { Additionalbutton, ScreenHeader } from "@/components/common";
import Sheet from "@/components/ui/Sheet";
import { colors } from "@/styles/colors";
import { ACCENT_COLORS } from "@/features/cv/constants";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { setAccent, setTemplate } from "@/redux/features/cvSlice";
import type { TemplateId } from "@/types/cv";
import { Check, Plus, Trash2 } from "lucide-react-native";
import { type ImageSourcePropType } from "react-native";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { AddFieldForm, TemplateCard, type AdditionalField } from "./components";

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

  const [fields, setFields] = useState<AdditionalField[]>([]);
  const [sheetOpen, setSheetOpen] = useState(false);

  function addField(field: Omit<AdditionalField, "id">) {
    setFields((prev) => [...prev, { ...field, id: Date.now().toString() }]);
  }

  function removeField(id: string) {
    setFields((prev) => prev.filter((f) => f.id !== id));
  }

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

        {/* Additional fields list */}
        {fields.length > 0 && (
          <View className="mb-4">
            <Text
              className="mb-3 text-xs tracking-widest text-muted-foreground"
              style={{ fontFamily: "Poppins-SemiBold" }}
            >
              ADDITIONAL FIELDS
            </Text>
            <View className="overflow-hidden rounded-2xl bg-white">
              {fields.map((field, i) => (
                <View
                  key={field.id}
                  className={`flex-row items-start gap-3 px-4 py-3.5 ${i < fields.length - 1 ? "border-b border-border" : ""}`}
                >
                  <View className="mt-1.5 h-2 w-2 rounded-full bg-primary" />
                  <View className="flex-1">
                    <Text className="sm-semibold text-foreground">{field.title}</Text>
                  </View>
                  <Pressable onPress={() => removeField(field.id)} hitSlop={8}>
                    <Trash2 size={15} color={colors.destructive} strokeWidth={2} />
                  </Pressable>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Add additional field */}
        <Sheet
          title="Add Additional Field"
          open={sheetOpen}
          onOpen={() => setSheetOpen(true)}
          onClose={() => setSheetOpen(false)}
          trigger={<Additionalbutton label=" Add Additional Field"></Additionalbutton>}
        >
          <AddFieldForm onAdd={addField} onClose={() => setSheetOpen(false)} />
        </Sheet>
      </View>
    </Screen>
  );
}
