import { colors } from "@/styles/colors";
import { CheckCircle, Info, XCircle } from "lucide-react-native";
import { forwardRef, useCallback, useImperativeHandle, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ToastVariant = "success" | "error" | "info";

export interface ToastConfig {
  variant: ToastVariant;
  message: string;
  duration?: number;
}

export interface AppToastRef {
  show: (config: ToastConfig) => void;
  hide: () => void;
}

// ─── Variant tokens ───────────────────────────────────────────────────────────

const VARIANTS: Record<ToastVariant, { bg: string; border: string; icon: typeof CheckCircle }> = {
  success: {
    bg: colors.successBg,
    border: colors.success,
    icon: CheckCircle,
  },
  error: {
    bg: colors.destructiveBg,
    border: colors.destructive,
    icon: XCircle,
  },
  info: {
    bg: colors.accent,
    border: colors.primary,
    icon: Info,
  },
};

// ─── Component ────────────────────────────────────────────────────────────────

const AppToast = forwardRef<AppToastRef>((_, ref) => {
  const { top } = useSafeAreaInsets();
  const [config, setConfig] = useState<ToastConfig | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const translateY = useSharedValue(-120);
  const opacity = useSharedValue(0);

  const animIn = useCallback(() => {
    translateY.value = withSpring(0, { damping: 18, stiffness: 200 });
    opacity.value = withTiming(1, { duration: 200 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const animOut = useCallback((onDone?: () => void) => {
    translateY.value = withTiming(-120, { duration: 280 });
    opacity.value = withTiming(0, { duration: 280 }, (finished) => {
      "worklet";
      if (finished && onDone) runOnJS(onDone)();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hide = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    animOut(() => setConfig(null));
  }, [animOut]);

  const show = useCallback(
    (next: ToastConfig) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      setConfig(next);
      translateY.value = -120;
      opacity.value = 0;
      animIn();
      timerRef.current = setTimeout(hide, next.duration ?? 3000);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [animIn, hide],
  );

  useImperativeHandle(ref, () => ({ show, hide }), [show, hide]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  if (!config) return null;

  const { bg, border, icon: Icon } = VARIANTS[config.variant];

  return (
    <Animated.View
      style={[
        styles.container,
        animStyle,
        { top: top + 12, borderLeftColor: border, backgroundColor: bg },
      ]}
    >
      <View style={[styles.iconWrap, { backgroundColor: border }]}>
        <Icon size={16} color="#fff" strokeWidth={2.5} />
      </View>
      <View style={styles.body}>
        <Text style={styles.message} numberOfLines={2}>
          {config.message}
        </Text>
      </View>
    </Animated.View>
  );
});

AppToast.displayName = "AppToast";

export default AppToast;

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 16,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 14,
    borderLeftWidth: 4,
    paddingVertical: 12,
    paddingHorizontal: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    zIndex: 9999,
  },
  iconWrap: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  body: {
    flex: 1,
    gap: 2,
  },
  message: {
    fontFamily: "Inter-Medium",
    fontSize: 13,
    color: colors.foreground,
    lineHeight: 18,
  },
});
