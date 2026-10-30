import { fontFamilyTheme } from "@/styles";
import { markOverviewSeen } from "./SpotLightTourStorage";
import { colors } from "@/styles/colors";
import { useEffect, useState } from "react";
import { Dimensions, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Circle, Defs, Mask, Rect } from "react-native-svg";

// Singleton lock — prevents two mounted instances from both opening the Modal
let tourIsOpen = false;

const TAB_COUNT = 5;
const TAB_CONTENT_H = 64;
const RECT_PAD = 40;

// ─── types ────────────────────────────────────────────────────────────────────
export interface ElementRect {
  x: number;
  y: number;
  w: number;
  h: number;
}
export type BellRect = ElementRect;

type Target =
  | { kind: "header" }
  | { kind: "carousel" }
  | { kind: "stats" }
  | { kind: "createBanner" }
  | { kind: "importBanner" }
  | { kind: "tab"; index: number };

type Spot =
  | { shape: "circle"; cx: number; cy: number; r: number }
  | { shape: "rect"; x: number; y: number; w: number; h: number; radius: number };

interface Step {
  target: Target;
  title: string;
  description: string;
}

const STEPS: Step[] = [
  {
    target: { kind: "header" },
    title: "Notifications",
    description:
      "On the top right you will find the notification bell. Tap it to see your recently built resumes — view any of them instantly, share directly with a friend, or check the details of your last export.",
  },
  {
    target: { kind: "carousel" },
    title: "Tips and Tricks",
    description:
      "Swipe through these cards to discover tips and tricks on how to build a standout resume — from formatting advice to export best practices to help you land your dream job.",
  },
  {
    target: { kind: "stats" },
    title: "Your Resume Stats",
    description:
      "At a glance — see how many resumes you have built, how many times you have exported, and when you last made an edit.",
  },
  {
    target: { kind: "createBanner" },
    title: "Create New CV",
    description:
      "Start fresh right here! Fill in four simple sections to build your resume with ease. Use the Preview button anytime to see how it looks. Important: once you are done, make sure to download as PDF or Google Doc — if you close the app without saving, your resume will be lost.",
  },
  {
    target: { kind: "importBanner" },
    title: "Import Existing CV",
    description:
      "Already have a resume? Upload it and we will extract all your existing data and fill every field automatically — no retyping needed. This is the fastest way to build your resume. Note: an internet connection is required for the AI to process your file.",
  },
  {
    target: { kind: "tab", index: 0 },
    title: "Home Tab",
    description:
      "Your main dashboard. See your stats, browse recent CVs, and quickly create or import a resume.",
  },
  {
    target: { kind: "tab", index: 1 },
    title: "Templates",
    description:
      "Choose your template and accent color here. You can also add extra custom fields that are not in the default layout — just make sure to toggle them on, otherwise they won't appear on your resume. Whatever template and color you pick here will be applied by default in the Create Resume tab.",
  },
  {
    target: { kind: "tab", index: 2 },
    title: "Create Resume",
    description:
      "Fill in your resume details here, then hit Preview to see it live — zoom in 2× or 3× for a closer look. At the bottom you will find three buttons: PDF and Doc instantly download your resume in those formats, and Edit takes you back to make changes. You can also customise colors and other options to match your preferred style.",
  },
  {
    target: { kind: "tab", index: 3 },
    title: "My CVs",
    description:
      "All your saved resumes in one list. Search, sort, duplicate, share, or delete any CV from here.",
  },
  {
    target: { kind: "tab", index: 4 },
    title: "Settings",
    description:
      "All your app settings in one place. Toggle notifications, set reminders, and personalise your experience. You can also read the Terms & Conditions and Privacy Policy, check the current app version, and get a peek at upcoming features.",
  },
];

interface SpotlightTourProps {
  show: boolean;
  carouselRect: ElementRect | null;
  statsRect: ElementRect | null;
  createBannerRect: ElementRect | null;
  importBannerRect: ElementRect | null;
  onDone: () => void;
}

export default function SpotlightTour({
  show,
  carouselRect,
  statsRect,
  createBannerRect,
  importBannerRect,
  onDone,
}: SpotlightTourProps) {
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(false);
  const insets = useSafeAreaInsets();
  const { width: W, height: H } = Dimensions.get("window");

  useEffect(() => {
    const timer = setTimeout(() => {
      if (show && !tourIsOpen) {
        tourIsOpen = true;
        setVisible(true);
      } else if (!show) {
        setVisible(false);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [show]);

  // Clamp step in case of stale state from Fast Refresh
  const safeStep = Math.min(step, STEPS.length - 1);
  const current = STEPS[safeStep]!;
  const isLast = safeStep === STEPS.length - 1;

  // ── spotlight geometry ──────────────────────────────────────────────────────
  function getSpot(): Spot {
    const t = current.target;

    if (t.kind === "header") {
      return {
        shape: "circle",
        cx: W - 31,
        cy: insets.top + 27,
        r: 30,
      };
    }

    if (t.kind === "carousel" && carouselRect) {
      return {
        shape: "rect",
        x: carouselRect.x - RECT_PAD,
        y: carouselRect.y - RECT_PAD + 50,
        w: carouselRect.w + RECT_PAD * 2,
        h: carouselRect.h + RECT_PAD * 2 - 50,
        radius: 20,
      };
    }

    if (t.kind === "stats" && statsRect) {
      return {
        shape: "rect",
        x: statsRect.x - RECT_PAD,
        y: statsRect.y - RECT_PAD + 60,
        w: statsRect.w + RECT_PAD * 2,
        h: statsRect.h + RECT_PAD * 2 - 100 + 30,
        radius: 16,
      };
    }

    if (t.kind === "createBanner" && createBannerRect) {
      return {
        shape: "rect",
        x: createBannerRect.x - RECT_PAD,
        y: createBannerRect.y - 12 + 25,
        w: createBannerRect.w + RECT_PAD * 2,
        h: createBannerRect.h + 24,
        radius: 20,
      };
    }

    if (t.kind === "importBanner" && importBannerRect) {
      return {
        shape: "rect",
        x: importBannerRect.x - RECT_PAD,
        y: importBannerRect.y - 12 + 25,
        w: importBannerRect.w + RECT_PAD * 2,
        h: importBannerRect.h + 24,
        radius: 20,
      };
    }

    if (t.kind === "tab") {
      const tabW = W / TAB_COUNT;
      const isCreateTab = t.index === 2;
      return {
        shape: "circle",
        cx: tabW * t.index + tabW / 2,
        cy: H - insets.bottom - TAB_CONTENT_H / 2 - (isCreateTab ? 25 : 0),
        r: 32,
      };
    }

    return { shape: "circle", cx: W / 2, cy: H / 2, r: 48 };
  }

  const spot = getSpot();

  const spotCenterY = spot.shape === "circle" ? spot.cy : spot.y + spot.h / 2;
  const spotBottomEdge = spot.shape === "circle" ? spot.cy + spot.r : spot.y + spot.h;
  const spotTopEdge = spot.shape === "circle" ? spot.cy - spot.r : spot.y;
  const tooltipBelow = spotCenterY < H * 0.55;
  const tooltipTop = tooltipBelow ? spotBottomEdge + 16 : undefined;
  const tooltipBottom = tooltipBelow ? undefined : H - spotTopEdge + 16 + (safeStep === 6 ? 20 : 0);

  // ── actions ─────────────────────────────────────────────────────────────────
  function dismiss() {
    tourIsOpen = false;
    markOverviewSeen();
    setVisible(false);
    onDone();
  }

  function advance() {
    if (isLast) dismiss();
    else setStep((s) => s + 1);
  }

  function skip() {
    dismiss();
  }

  function goBack() {
    if (safeStep > 0) setStep((s) => s - 1);
  }

  // ── SVG helpers ──────────────────────────────────────────────────────────────
  function renderCutout() {
    if (spot.shape === "circle") {
      return <Circle cx={spot.cx} cy={spot.cy} r={spot.r} fill="black" />;
    }
    return (
      <Rect
        x={spot.x}
        y={spot.y}
        width={spot.w}
        height={spot.h}
        rx={spot.radius}
        ry={spot.radius}
        fill="black"
      />
    );
  }

  function renderRing() {
    if (spot.shape === "circle") {
      return (
        <Circle
          cx={spot.cx}
          cy={spot.cy}
          r={spot.r + 3}
          stroke={colors.primary}
          strokeWidth={2.5}
          fill="none"
        />
      );
    }
    return (
      <Rect
        x={spot.x - 3}
        y={spot.y - 3}
        width={spot.w + 6}
        height={spot.h + 6}
        rx={spot.radius + 2}
        ry={spot.radius + 2}
        stroke={colors.primary}
        strokeWidth={2.5}
        fill="none"
      />
    );
  }

  return (
    <Modal transparent animationType="fade" visible={visible} statusBarTranslucent>
      <Pressable style={StyleSheet.absoluteFill} onPress={advance} />

      {/* Dark overlay with cutout */}
      <Svg width={W} height={H} style={StyleSheet.absoluteFill} pointerEvents="none">
        <Defs>
          <Mask id="cutout">
            <Rect x={0} y={0} width={W} height={H} fill="white" />
            {renderCutout()}
          </Mask>
        </Defs>
        <Rect x={0} y={0} width={W} height={H} fill="rgba(0,0,0,0.55)" mask="url(#cutout)" />
      </Svg>

      {/* Accent ring */}
      <Svg width={W} height={H} style={StyleSheet.absoluteFill} pointerEvents="none">
        {renderRing()}
      </Svg>

      {/* Tooltip */}
      <View
        style={[
          StyleSheet.absoluteFill,
          { justifyContent: tooltipBelow ? "flex-start" : "flex-end" },
        ]}
        pointerEvents="box-none"
      >
        <View
          style={{
            marginHorizontal: 20,
            marginTop: tooltipTop,
            marginBottom: tooltipBottom,
            backgroundColor: "#fff",
            borderRadius: 20,
            padding: 20,
            shadowColor: "#000",
            shadowOpacity: 0.18,
            shadowRadius: 16,
            shadowOffset: { width: 0, height: 4 },
            elevation: 10,
            gap: 10,
          }}
        >
          {/* Header: title left, counter right */}
          <View
            style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}
          >
            <Text
              style={{
                fontFamily: fontFamilyTheme.semiBold,
                fontSize: 16,
                color: colors.foreground,
              }}
            >
              {current.title}
            </Text>
            <Text
              style={{
                fontFamily: fontFamilyTheme.regular,
                fontSize: 12,
                color: colors.mutedForeground,
              }}
            >
              {safeStep + 1} / {STEPS.length}
            </Text>
          </View>

          {/* Description */}
          <Text
            style={{
              fontFamily: fontFamilyTheme.regular,
              fontSize: 13,
              color: colors.mutedForeground,
              lineHeight: 21,
            }}
          >
            {current.description}
          </Text>

          {/* Progress pills */}
          <View style={{ flexDirection: "row", gap: 4, flexWrap: "wrap" }}>
            {STEPS.map((_, i) => (
              <View
                key={i}
                style={{
                  width: i === safeStep ? 22 : 6,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: i === safeStep ? colors.primary : colors.border,
                }}
              />
            ))}
          </View>

          {/* Row 1: Prev | Next */}
          <View style={{ flexDirection: "row", gap: 10, marginTop: 2 }}>
            <Pressable
              onPress={goBack}
              disabled={safeStep === 0}
              style={{
                flex: 1,
                alignItems: "center",
                paddingVertical: 13,
                borderRadius: 14,
                borderWidth: 1,
                borderColor: colors.border,
                opacity: safeStep === 0 ? 0.35 : 1,
              }}
            >
              <Text
                style={{
                  fontFamily: fontFamilyTheme.semiBold,
                  fontSize: 14,
                  color: colors.mutedForeground,
                }}
              >
                Prev
              </Text>
            </Pressable>
            <Pressable
              onPress={advance}
              style={{
                flex: 1,
                alignItems: "center",
                paddingVertical: 13,
                borderRadius: 14,
                backgroundColor: colors.primary,
              }}
            >
              <Text style={{ fontFamily: fontFamilyTheme.semiBold, fontSize: 14, color: "#fff" }}>
                {isLast ? "Got it!" : "Next"}
              </Text>
            </Pressable>
          </View>

          {/* Row 2: full-width Skip */}
          <Pressable
            onPress={skip}
            style={{
              alignItems: "center",
              paddingVertical: 12,
              borderRadius: 14,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <Text
              style={{
                fontFamily: fontFamilyTheme.semiBold,
                fontSize: 14,
                color: colors.mutedForeground,
              }}
            >
              Skip Tour
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
