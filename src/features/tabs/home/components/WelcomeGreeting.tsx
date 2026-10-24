import { colors } from "@/styles/colors";
import { Icons } from "@/components";
import IconButton from "@/components/ui/IconButton";
import { Image, Text, View } from "react-native";
import WavingHand from "./WavingHand";

interface WelcomeGreetingProps {
  totalCVs: number;
  totalExports: number;
  lastEditTimestamp: number | null;
  onNotificationPress?: () => void;
}

export default function WelcomeGreeting({ onNotificationPress }: WelcomeGreetingProps) {
  return (
    <View className="gap-3 py-2">
      {/* Brand row */}
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          <View className="-left-4">
            <Image
              source={require("../../../../../assets/adaptive-icon.png")}
              style={{ width: 64, height: 64 }}
              resizeMode="cover"
            />
          </View>
          <View className="-ml-6">
            <View className="flex-row items-center gap-1">
              <Text className="lg-medium font-bold text-[#1a1f36]">Resume Builder</Text>
              <View className="">
                <WavingHand />
              </View>
            </View>
            <Text className="xs-normal">Land your dream job in minutes</Text>
          </View>
        </View>

        <IconButton onPress={onNotificationPress} className="h-10 w-10 rounded-full bg-accent">
          <Icons.Bell size={20} color={colors.foreground} strokeWidth={1.8} />
        </IconButton>
      </View>
    </View>
  );
}
