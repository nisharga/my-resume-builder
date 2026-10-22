import { Icons } from "@/components";
import { colors } from "@/styles/colors";
import { LinearGradient } from "expo-linear-gradient";
import { Upload } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

interface Props {
  onPress?: () => void;
}

export default function UploadCvBanner({ onPress }: Props) {
  return (
    <Pressable onPress={onPress} className="overflow-hidden rounded-2xl active:opacity-90">
      <LinearGradient
        colors={["#1F7A55", "#2B5F75"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="flex-row items-center gap-4 px-4 py-6"
      >
        <View className="h-12 w-12 items-center justify-center rounded-xl bg-white/20">
          <Upload size={26} color={colors.white} strokeWidth={1.8} />
        </View>

        <View className="flex-1">
          <Text className="sm-bold text-white!">Import Existing CV</Text>
          <Text className="xss-normal mt-1 text-white/80">Upload your PDF — AI fills it in</Text>
        </View>

        <View className="h-9 w-9 items-center justify-center rounded-full bg-white/25">
          <Icons.ArrowRight size={18} color={colors.white} strokeWidth={2.5} />
        </View>
      </LinearGradient>
    </Pressable>
  );
}
