import { colors } from "@/styles";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  ImageSourcePropType,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");
const CARD_W = width - 32;
const CARD_H = Math.round(CARD_W / 1.8);
const AUTOPLAY_MS = 5000;
// Roughly how long an animated scrollTo takes, so we can jump off the clone after it lands
const SCROLL_ANIM_MS = 400;

interface CarouselItem {
  id: string;
  image: ImageSourcePropType;
}

const ITEMS: CarouselItem[] = [
  { id: "1", image: { uri: "https://picsum.photos/seed/cv-1/1200/600" } },
  { id: "2", image: { uri: "https://picsum.photos/seed/cv-2/1200/600" } },
  { id: "3", image: { uri: "https://picsum.photos/seed/cv-3/1200/600" } },
  { id: "4", image: { uri: "https://picsum.photos/seed/cv-4/1200/600" } },
  { id: "5", image: { uri: "https://picsum.photos/seed/cv-5/1200/600" } },
  { id: "6", image: { uri: "https://picsum.photos/seed/cv-6/1200/600" } },
];

const N = ITEMS.length;

/**
 * Infinite loop trick: put a copy of the last slide before the first, and a copy
 * of the first slide after the last:
 *
 *   [6'] [1] [2] [3] [4] [5] [6] [1']
 *     0   1   2   3   4   5   6   7     <- "virtual" positions
 *
 * The user swipes onto a copy, and as soon as it settles we jump (without animation)
 * to the real slide with the same image. The jump is invisible because the images match.
 */
const FIRST = ITEMS[0]!;
const LAST = ITEMS[N - 1]!;

const SLIDES: CarouselItem[] = [
  { id: "clone-last", image: LAST.image },
  ...ITEMS,
  { id: "clone-first", image: FIRST.image },
];

/** Virtual position (0..N+1) -> real item index (0..N-1) */
const toReal = (v: number) => (v - 1 + N) % N;

export default function Carousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollX] = useState(() => new Animated.Value(CARD_W));
  const scrollRef = useRef<ScrollView>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const jumpTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touching = useRef(false);
  const positionedRef = useRef(false);
  const virtualRef = useRef(1); // start on the real first slide, not the clone

  const onScroll = useMemo(
    () =>
      Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
        useNativeDriver: true,
      }),
    [scrollX],
  );

  const scrollToVirtual = useCallback((v: number, animated: boolean) => {
    (scrollRef.current as any)?.scrollTo({ x: v * CARD_W, animated });
  }, []);

  /** Records where we landed; if it's a clone, silently jumps to the matching real slide. */
  const settleAt = useCallback(
    (v: number) => {
      let target = v;
      if (v <= 0)
        target = N; // copy of last -> real last
      else if (v >= N + 1) target = 1; // copy of first -> real first

      if (target !== v) scrollToVirtual(target, false);

      virtualRef.current = target;
      setActiveIndex(toReal(target));
    },
    [scrollToVirtual],
  );

  const stopAutoPlay = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (jumpTimerRef.current) {
      clearTimeout(jumpTimerRef.current);
      jumpTimerRef.current = null;
    }
  }, []);

  const startAutoPlay = useCallback(() => {
    stopAutoPlay();
    timerRef.current = setInterval(() => {
      const next = virtualRef.current + 1;
      scrollToVirtual(next, true);
      virtualRef.current = next;
      setActiveIndex(toReal(next));

      // Landed on the copy of the first slide: once the animation finishes,
      // jump back to the real first slide so the loop can keep going forward.
      if (next === N + 1) {
        jumpTimerRef.current = setTimeout(() => settleAt(N + 1), SCROLL_ANIM_MS);
      }
    }, AUTOPLAY_MS);
  }, [stopAutoPlay, scrollToVirtual, settleAt]);

  useEffect(() => {
    startAutoPlay();
    return stopAutoPlay;
  }, [startAutoPlay, stopAutoPlay]);

  const handleMomentumEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      settleAt(Math.round(e.nativeEvent.contentOffset.x / CARD_W));
      startAutoPlay();
    },
    [settleAt, startAutoPlay],
  );

  const handleDragEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const x = e.nativeEvent.contentOffset.x;
      const v = Math.round(x / CARD_W);
      if (Math.abs(x - v * CARD_W) < 1) settleAt(v);
      startAutoPlay();
    },
    [settleAt, startAutoPlay],
  );

  return (
    <View style={{ height: CARD_H }}>
      <Animated.ScrollView
        ref={scrollRef as any}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={CARD_W}
        snapToAlignment="start"
        bounces={false}
        scrollEventThrottle={16}
        contentOffset={{ x: CARD_W, y: 0 }}
        onLayout={() => {
          // Start on the real first slide (contentOffset isn't honoured everywhere)
          if (!positionedRef.current) {
            positionedRef.current = true;
            scrollToVirtual(1, false);
          }
        }}
        onScroll={onScroll}
        // Only settle once the swipe has fully stopped; settling on drag end
        // could jump while the page is still moving.
        onMomentumScrollEnd={handleMomentumEnd}
        onTouchStart={() => {
          touching.current = true;
          stopAutoPlay();
        }}
        onTouchEnd={() => {
          touching.current = false;
          startAutoPlay();
        }}
      >
        {SLIDES.map((item, i) => {
          const inputRange = [(i - 1) * CARD_W, i * CARD_W, (i + 1) * CARD_W];
          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.94, 1, 0.94],
            extrapolate: "clamp",
          });
          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.65, 1, 0.65],
            extrapolate: "clamp",
          });

          return (
            <Animated.View
              key={item.id}
              style={{ width: CARD_W, height: CARD_H, transform: [{ scale }], opacity }}
            >
              <TouchableOpacity activeOpacity={0.95} className="flex-1 overflow-hidden rounded-2xl">
                <Image source={item.image} className="h-full w-full" resizeMode="cover" />

                {/* Dots — bottom center (always N dots, based on the real index) */}
                <View
                  className="absolute right-0 bottom-2.5 left-0 flex-row items-center justify-center gap-1.5"
                  pointerEvents="none"
                >
                  {ITEMS.map((_, di) => (
                    <View
                      key={di}
                      style={{
                        width: di === activeIndex ? 20 : 7,
                        height: di === activeIndex ? 8 : 7,
                        borderRadius: 4,
                        backgroundColor:
                          di === activeIndex ? colors.secondary : "rgba(74,108,247,0.75)",
                        marginBottom: 6,
                      }}
                    />
                  ))}
                </View>
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </Animated.ScrollView>
    </View>
  );
}
