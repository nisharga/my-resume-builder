import { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

function SkeletonBox({ className, style }: { className?: string; style?: object }) {
  return <Animated.View className={`rounded-md bg-border ${className ?? ""}`} style={style} />;
}

function CvCardSkeleton({ opacity }: { opacity: any }) {
  const animStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View style={animStyle} className="flex-row items-center gap-3 px-4 py-3">
      {/* Thumbnail */}
      <SkeletonBox style={{ width: 44, height: 56, borderRadius: 6 }} />

      {/* Info */}
      <View className="flex-1 gap-2">
        <SkeletonBox style={{ height: 13, width: "60%", borderRadius: 6 }} />
        <SkeletonBox style={{ height: 11, width: "40%", borderRadius: 6 }} />
        <View className="mt-1 flex-row gap-2">
          <SkeletonBox style={{ height: 16, width: 56, borderRadius: 20 }} />
          <SkeletonBox style={{ height: 16, width: 72, borderRadius: 20 }} />
        </View>
      </View>

      {/* Action button */}
      <SkeletonBox style={{ width: 28, height: 28, borderRadius: 14 }} />
    </Animated.View>
  );
}

const SKELETON_COUNT = 5;

export default function CvListSkeleton() {
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(withTiming(0.35, { duration: 700 }), withTiming(1, { duration: 700 })),
      -1,
      false,
    );
  }, []);

  return (
    <View className="mx-4 mt-1 overflow-hidden rounded-2xl bg-white">
      {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
        <View key={i}>
          <CvCardSkeleton opacity={opacity} />
          {i < SKELETON_COUNT - 1 && <View className="mx-4 h-px bg-border" />}
        </View>
      ))}
    </View>
  );
}
