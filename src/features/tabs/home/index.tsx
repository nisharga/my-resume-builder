import { Icons, Screen } from "@/components";
import { Text, Pressable, View } from "react-native";
import { WelcomeGreeting, CreateCvBanner, CvCard, EmptyResume } from "./components";
import { useRouter, useFocusEffect } from "expo-router";
import IconButton from "@/components/ui/IconButton";
import { colors } from "@/styles";
import { useAppDispatch } from "@/redux/store";
import { loadCVById, resetToNewCV } from "@/redux/features/cvSlice";
import { getAllCVs, getCV, saveCV, genCVId, formatUpdatedAt } from "@/utils/cvStorage";
import { toast } from "@/utils/toast";
import type { CVListItem } from "@/types/cv";
import { useCallback, useState } from "react";

const MAX_RECENT = 5;

const HomeScreen = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [recentCVs, setRecentCVs] = useState<CVListItem[]>([]);

  useFocusEffect(
    useCallback(() => {
      getAllCVs()
        .then((list) =>
          setRecentCVs([...list].sort((a, b) => b.updatedAt - a.updatedAt).slice(0, MAX_RECENT)),
        )
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

  function handleNewCV() {
    dispatch(resetToNewCV());
    router.push("/(tabs)/create-resume");
  }

  return (
    <Screen>
      {/* Greeting */}
      <View className="mb-4 px-4">
        <WelcomeGreeting welcomeLabel="Nisharga Kabir" />
      </View>

      {/* Create CV banner */}
      <View className="mb-4 px-4">
        <CreateCvBanner onPress={handleNewCV} />
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
                  onDuplicate={handleDuplicate}
                />
                {i < recentCVs.length - 1 && <View className="mx-4 h-px bg-border" />}
              </View>
            ))}
          </View>
        )}
      </View>
    </Screen>
  );
};

export default HomeScreen;
