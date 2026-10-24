import { Carousel, Icons, Screen } from "@/components";
import { Text, View, View as RNView } from "react-native";
import {
  WelcomeGreeting,
  CreateCvBanner,
  UploadCvBanner,
  CvCard,
  EmptyResume,
  StatsRow,
  shouldShowOverview,
} from "./components";
import SpotlightTour, { type ElementRect } from "./components/SpotlightTour";
import { useRouter, useFocusEffect } from "expo-router";
import IconButton from "@/components/ui/IconButton";
import { colors } from "@/styles";
import { useAppDispatch } from "@/redux/store";
import { loadCVById, resetToNewCV } from "@/redux/features/cvSlice";
import { getAllCVs, getCV, saveCV, genCVId, formatUpdatedAt, deleteCV } from "@/utils/cvStorage";
import { shareCV } from "@/utils/shareCV";
import { getExportHistory } from "@/utils/exportHistory";
import { toast } from "@/utils/toast";
import type { CVListItem } from "@/types/cv";
import { useCallback, useEffect, useRef, useState } from "react";

const MAX_RECENT = 3;

const HomeScreen = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [recentCVs, setRecentCVs] = useState<CVListItem[]>([]);
  const [totalCVs, setTotalCVs] = useState(0);
  const [totalExports, setTotalExports] = useState(0);
  const [lastEditTimestamp, setLastEditTimestamp] = useState<number | null>(null);

  // ====================================================
  // ================== SpotLight Tour ==================
  // ====================================================
  const [showOverview, setShowOverview] = useState(false);

  // refs for spotlight targets
  const carouselRef = useRef<RNView>(null);
  const statsRef = useRef<RNView>(null);
  const createBannerRef = useRef<RNView>(null);
  const importBannerRef = useRef<RNView>(null);

  const [carouselRect, setCarouselRect] = useState<ElementRect | null>(null);
  const [statsRect, setStatsRect] = useState<ElementRect | null>(null);
  const [createBannerRect, setCreateBannerRect] = useState<ElementRect | null>(null);
  const [importBannerRect, setImportBannerRect] = useState<ElementRect | null>(null);

  useEffect(() => {
    shouldShowOverview()
      .then(setShowOverview)
      .catch(() => {});
  }, []);

  // Measure spotlight targets once on mount, after layout settles
  useEffect(() => {
    const id = setTimeout(() => {
      carouselRef.current?.measureInWindow((x, y, w, h) => {
        if (w > 0) setCarouselRect({ x, y, w, h });
      });
      statsRef.current?.measureInWindow((x, y, w, h) => {
        if (w > 0) setStatsRect({ x, y, w, h });
      });
      createBannerRef.current?.measureInWindow((x, y, w, h) => {
        if (w > 0) setCreateBannerRect({ x, y, w, h });
      });
      importBannerRef.current?.measureInWindow((x, y, w, h) => {
        if (w > 0) setImportBannerRect({ x, y, w, h });
      });
    }, 500);
    return () => clearTimeout(id);
  }, []);

  // end tour

  useFocusEffect(
    useCallback(() => {
      getAllCVs()
        .then((list) => {
          const sorted = [...list].sort((a, b) => b.updatedAt - a.updatedAt);
          setTotalCVs(sorted.length);
          setLastEditTimestamp(sorted[0]?.updatedAt ?? null);
          setRecentCVs(sorted.slice(0, MAX_RECENT));
        })
        .catch(() => {});
      getExportHistory()
        .then((history) => setTotalExports(history.length))
        .catch(() => {});
    }, []),
  );

  async function handleEdit(id: string) {
    await dispatch(loadCVById(id));
    router.push("/(tabs)/create-resume");
  }

  async function handleView(id: string) {
    await dispatch(loadCVById(id));
    router.push("/cv-preview");
  }

  async function handleDelete(id: string) {
    await deleteCV(id);
    getAllCVs()
      .then((list) =>
        setRecentCVs([...list].sort((a, b) => b.updatedAt - a.updatedAt).slice(0, MAX_RECENT)),
      )
      .catch(() => {});
    toast.success("CV deleted.");
  }

  async function handleDuplicate(id: string) {
    const cv = await getCV(id);
    if (!cv) return;
    const copy = { ...cv, id: genCVId(), updatedAt: Date.now() };
    await saveCV(copy);
    getAllCVs()
      .then((list) =>
        setRecentCVs([...list].sort((a, b) => b.updatedAt - a.updatedAt).slice(0, MAX_RECENT)),
      )
      .catch(() => {});
    toast.success("CV duplicated successfully.");
  }

  async function handleShare(id: string) {
    try {
      await shareCV(id, "PDF");
    } catch {
      toast.error("Could not share the CV. Please try again.");
    }
  }

  function handleNewCV() {
    dispatch(resetToNewCV());
    router.push("/(tabs)/create-resume");
  }

  function handleNotificationPress() {
    router.push("/notifications");
  }

  return (
    <Screen>
      {/* Stats header */}
      <View className="mb-4 px-4">
        <WelcomeGreeting
          totalCVs={totalCVs}
          totalExports={totalExports}
          lastEditTimestamp={lastEditTimestamp}
          onNotificationPress={handleNotificationPress}
        />
      </View>

      {/* Carousel */}
      <View ref={carouselRef} collapsable={false} className="mb-4 px-4">
        <Carousel />
      </View>

      {/* Stats row */}
      <View ref={statsRef} collapsable={false} className="mb-4 px-4">
        <StatsRow
          totalCVs={totalCVs}
          totalExports={totalExports}
          lastEditTimestamp={lastEditTimestamp}
        />
      </View>

      {/* Create CV banner */}
      <View ref={createBannerRef} collapsable={false} className="mb-4 px-4">
        <CreateCvBanner onPress={handleNewCV} />
      </View>

      {/* Upload / import banner */}
      <View ref={importBannerRef} collapsable={false} className="mb-4 px-4">
        <UploadCvBanner onPress={() => router.push("/upload-resume")} />
      </View>

      {/* Recent CVs */}
      <View>
        <View className="mb-2 flex-row items-center justify-between px-4">
          <Text className="base-semibold text-foreground!">Recent CVs</Text>
          <IconButton onPress={() => router.push("/(tabs)/my-cv")} className="flex flex-row gap-1">
            <Text className="sm-medium">View All</Text>
            <Icons.ArrowRight size={18} color={colors.primary} strokeWidth={2} />
          </IconButton>
        </View>

        {recentCVs.length === 0 ? (
          <EmptyResume />
        ) : (
          <View className="mx-4 mt-1 overflow-hidden rounded-2xl bg-white">
            {recentCVs.map((cv, i) => (
              <View key={cv.id}>
                <CvCard
                  {...cv}
                  formattedDate={formatUpdatedAt(cv.updatedAt)}
                  onEdit={handleEdit}
                  onView={handleView}
                  onDelete={handleDelete}
                  onDuplicate={handleDuplicate}
                  onShare={handleShare}
                />
                {i < recentCVs.length - 1 && <View className="mx-4 h-px bg-border" />}
              </View>
            ))}
          </View>
        )}
      </View>

      {/* SpotLight tour */}
      <SpotlightTour
        show={showOverview}
        carouselRect={carouselRect}
        statsRect={statsRect}
        createBannerRect={createBannerRect}
        importBannerRect={importBannerRect}
        onDone={() => setShowOverview(false)}
      />
    </Screen>
  );
};

export default HomeScreen;
