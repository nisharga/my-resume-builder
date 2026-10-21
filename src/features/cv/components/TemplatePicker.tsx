import { Pressable, Text, View } from "react-native";
import { Check } from "lucide-react-native";
import { colors } from "@/styles/colors";
import { TEMPLATES } from "../constants";
import type { TemplateId } from "@/types/cv";

interface Props {
  selected: TemplateId;
  onSelect: (id: TemplateId) => void;
}

export default function TemplatePicker({ selected, onSelect }: Props) {
  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 12,
        overflow: "hidden",
        backgroundColor: "#fff",
      }}
    >
      {TEMPLATES.map((tpl, i) => (
        <View key={tpl.id}>
          {i > 0 && <View style={{ height: 1, backgroundColor: colors.border }} />}
          <Pressable
            onPress={() => onSelect(tpl.id)}
            accessibilityRole="radio"
            accessibilityState={{ checked: tpl.id === selected }}
            accessibilityLabel={tpl.name}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: 14,
              paddingVertical: 13,
              backgroundColor: tpl.id === selected ? `${colors.primary}0D` : "#fff",
            }}
          >
            <Text
              style={{
                fontSize: 15,
                fontWeight: tpl.id === selected ? "600" : "400",
                color: tpl.id === selected ? colors.primary : colors.foreground,
              }}
            >
              {tpl.name}
            </Text>
            {tpl.id === selected && <Check size={16} color={colors.primary} strokeWidth={2.5} />}
          </Pressable>
        </View>
      ))}
    </View>
  );
}
