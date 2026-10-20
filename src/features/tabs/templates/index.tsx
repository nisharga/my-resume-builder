import { Screen } from "@/components";
import { ScreenHeader } from "@/components/common";
import Sheet from "@/components/ui/Sheet";
import { colors } from "@/styles/colors";
import { Plus, Trash2 } from "lucide-react-native";
import { type ImageSourcePropType } from "react-native";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { AddFieldForm, TemplateCard, type AdditionalField } from "./components";

// ─── data ─────────────────────────────────────────────────────────────────────

const TEMPLATES: { id: string; name: string; image: ImageSourcePropType }[] = [
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
  const [selectedId, setSelectedId] = useState("classic");
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
              selected={selectedId === tpl.id}
              onSelect={() => setSelectedId(tpl.id)}
            />
          ))}
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
          trigger={
            <View className="flex-row items-center justify-center gap-2 rounded-2xl border border-dashed border-primary/50 bg-accent py-4">
              <View className="h-6 w-6 items-center justify-center rounded-full bg-primary">
                <Plus size={14} color="#fff" strokeWidth={2.5} />
              </View>
              <Text className="text-sm text-primary" style={{ fontFamily: "Poppins-SemiBold" }}>
                Add Additional Field
              </Text>
            </View>
          }
        >
          <AddFieldForm onAdd={addField} onClose={() => setSheetOpen(false)} />
        </Sheet>
      </View>
    </Screen>
  );
}
