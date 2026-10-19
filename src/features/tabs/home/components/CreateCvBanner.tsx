import { Icons } from "@/components";
import { colors } from "@/styles/colors";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowRight, FileText } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

interface CreateCvBannerProps {
  onPress?: () => void;
}

export default function CreateCvBanner({ onPress }: CreateCvBannerProps) {
  return (
    <Pressable onPress={onPress} className="overflow-hidden rounded-2xl active:opacity-90">
      <LinearGradient
        colors={[colors.primaryGradientFrom, colors.purple]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="flex-row items-center gap-4 px-4 py-6"
      >
        {/* Icon */}
        <View className="h-12 w-12 items-center justify-center rounded-xl bg-white/20">
          <Icons.FileText size={26} color={colors.white} strokeWidth={1.8} />
        </View>

        {/* Text */}
        <View className="flex-1">
          <Text className="sm-bold text-white!">Create New CV</Text>
          <Text className="xss-normal mt-1 text-white/80">
            Start building your professional resume
          </Text>
        </View>

        {/* Arrow */}
        <View className="h-9 w-9 items-center justify-center rounded-full bg-white/25">
          <Icons.ArrowRight size={18} color={colors.white} strokeWidth={2.5} />
        </View>
      </LinearGradient>
    </Pressable>
  );
}
