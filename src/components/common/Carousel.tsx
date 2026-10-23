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

interface CarouselItem {
  id: string;
  image: ImageSourcePropType;
}

const ITEMS: CarouselItem[] = [
  { id: "1", image: require("../../../assets/carousel/1.jpeg") },
  { id: "2", image: require("../../../assets/carousel/2.jpeg") },
  { id: "3", image: require("../../../assets/carousel/3.jpeg") },
  { id: "4", image: require("../../../assets/carousel/4.jpeg") },
  { id: "5", image: require("../../../assets/carousel/5.jpeg") },
  { id: "6", image: require("../../../assets/carousel/6.jpeg") },
];

export default function Carousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollX] = useState(() => new Animated.Value(0));
  const scrollRef = useRef<ScrollView>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touching = useRef(false);
  const activeIndexRef = useRef(0);

  // Memoized so Animated.event is created once — fixes react-hooks/refs lint error
  const onScroll = useMemo(
    () =>
      Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
        useNativeDriver: true,
      }),
    [scrollX],
  );

  // Index tracking on JS side — fired only at scroll end, not every frame
  const handleScrollEnd = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / CARD_W);
    if (idx !== activeIndexRef.current && idx >= 0 && idx < ITEMS.length) {
      activeIndexRef.current = idx;
      setActiveIndex(idx);
    }
  }, []);

  const stopAutoPlay = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startAutoPlay = useCallback(() => {
    stopAutoPlay();
    timerRef.current = setInterval(() => {
      if (touching.current) return;
      const next = (activeIndexRef.current + 1) % ITEMS.length;
      (scrollRef.current as any)?.scrollTo({ x: next * CARD_W, animated: true });
      activeIndexRef.current = next;
      setActiveIndex(next);
    }, 3000);
  }, [stopAutoPlay]);

  useEffect(() => {
    startAutoPlay();
    return stopAutoPlay;
  }, [startAutoPlay, stopAutoPlay]);

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
        onScroll={onScroll}
        onScrollEndDrag={handleScrollEnd}
        onMomentumScrollEnd={handleScrollEnd}
        onTouchStart={() => {
          touching.current = true;
          stopAutoPlay();
        }}
        onTouchEnd={() => {
          touching.current = false;
          startAutoPlay();
        }}
      >
        {ITEMS.map((item, i) => {
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

                {/* Dots — bottom center */}
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
