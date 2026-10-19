import { Check } from "lucide-react-native";
import { Image, type ImageSourcePropType, Pressable, Text, View } from "react-native";

export interface TemplateCardProps {
  name: string;
  image: ImageSourcePropType;
  selected: boolean;
  onSelect: () => void;
}

export default function TemplateCard({ name, image, selected, onSelect }: TemplateCardProps) {
  return (
    <Pressable onPress={onSelect} className="active:opacity-80" style={{ width: "48%" }}>
      <View
        className={`overflow-hidden rounded-2xl border-2 ${selected ? "border-primary" : "border-border"}`}
      >
        <Image source={image} style={{ width: "100%", height: 200 }} resizeMode="cover" />

        {selected && (
          <View className="absolute top-2 right-2 h-6 w-6 items-center justify-center rounded-full bg-primary">
            <Check size={13} color="#fff" strokeWidth={3} />
          </View>
        )}

        {selected && (
          <View className="absolute right-0 bottom-0 left-0 items-center bg-primary/80 py-1">
            <Text style={{ fontFamily: "Poppins-SemiBold", fontSize: 11, color: "#fff" }}>
              Selected
            </Text>
          </View>
        )}
      </View>

      <Text
        className={`mt-2 text-center text-sm ${selected ? "text-primary" : "text-foreground"}`}
        style={{ fontFamily: selected ? "Poppins-SemiBold" : "Poppins-Regular" }}
      >
        {name}
      </Text>
    </Pressable>
  );
}
