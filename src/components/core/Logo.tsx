import { fontFamilyTheme } from "@/styles";
import { colors } from "@/styles/colors";
import { Image } from "expo-image";
import { useEffect } from "react";
import { Text, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

const logo = require("../../../assets/adaptive-icon.png");

export default function Logo() {
  const scale = useSharedValue(0.5);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(1, { damping: 12, stiffness: 120 });
    opacity.value = withSpring(1, { damping: 16, stiffness: 100 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[animStyle, { alignItems: "center", marginTop: -20 }]}>
      <Image
        source={logo}
        style={{ width: 120, height: 120 }}
        contentFit="contain"
        testID="logo-image"
      />
      <View style={{ alignItems: "center", marginTop: -32 }}>
        <Text
          style={{
            fontSize: 22,
            fontFamily: fontFamilyTheme.bold,
            color: colors.primary,
            letterSpacing: -0.3,
          }}
        >
          Resume Builder
        </Text>
        <Text
          style={{
            fontSize: 12,
            fontFamily: fontFamilyTheme.regular,
            color: colors.mutedForeground,
            letterSpacing: 0.4,
            marginTop: -8,
          }}
        >
          Build your career story
        </Text>
      </View>
    </Animated.View>
  );
}
