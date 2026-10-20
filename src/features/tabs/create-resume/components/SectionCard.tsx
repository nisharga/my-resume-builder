import { Pressable, Text, View } from "react-native";
import { Check, ChevronRight } from "lucide-react-native";
import { colors } from "@/styles/colors";

interface Props {
  title: string;
  subtitle: string;
  complete: boolean;
  onPress: () => void;
}

export default function SectionCard({ title, subtitle, complete, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center gap-3 bg-white px-4 py-4 active:opacity-75"
      accessibilityRole="button"
      accessibilityLabel={`${title}: ${subtitle}`}
    >
      {/* Status circle */}
      <View
        style={{
          width: 28,
          height: 28,
          borderRadius: 14,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: complete ? colors.success : "transparent",
          borderWidth: complete ? 0 : 1.5,
          borderColor: colors.border,
        }}
      >
        {complete && <Check size={14} color="#fff" strokeWidth={3} />}
      </View>

      {/* Text */}
      <View className="flex-1">
        <Text className="sm-semibold text-foreground">{title}</Text>
        <Text className="text-[13px] text-muted-foreground" numberOfLines={1}>
          {subtitle}
        </Text>
      </View>

      <ChevronRight size={18} color={colors.mutedForeground} strokeWidth={2} />
    </Pressable>
  );
}
