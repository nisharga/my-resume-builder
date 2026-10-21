import Image from "@/components/core/Image";
import { Check } from "lucide-react-native";
import { type ImageSourcePropType, Pressable, Text, View } from "react-native";

export interface TemplateCardProps {
  name: string;
  image: ImageSourcePropType;
  selected: boolean;
  accent: string;
  onSelect: () => void;
}

export default function TemplateCard({
  name,
  image,
  selected,
  accent,
  onSelect,
}: TemplateCardProps) {
  return (
    <Pressable onPress={onSelect} className="active:opacity-80" style={{ width: "48%" }}>
      <View
        className="overflow-hidden rounded-2xl border-2"
        style={{ borderColor: selected ? accent : "#E2E8F0" }}
      >
        <Image src={image as number} style={{ width: "100%", height: 260 }} />

        {selected && (
          <View
            className="absolute top-2 right-2 h-6 w-6 items-center justify-center rounded-full"
            style={{ backgroundColor: accent }}
          >
            <Check size={13} color="#fff" strokeWidth={3} />
          </View>
        )}

        {selected && (
          <View
            className="absolute right-0 bottom-0 left-0 items-center py-1"
            style={{ backgroundColor: accent + "CC" }}
          >
            <Text style={{ fontFamily: "Poppins-SemiBold", fontSize: 11, color: "#fff" }}>
              Selected
            </Text>
          </View>
        )}
      </View>

      <Text
        className="mt-2 text-center text-sm"
        style={{
          fontFamily: selected ? "Poppins-SemiBold" : "Poppins-Regular",
          color: selected ? accent : undefined,
        }}
      >
        {name}
      </Text>
    </Pressable>
  );
}
