import { AndroidNavSpacer, Icons, Screen, StickyView } from "@/components";
import { ScreenHeader } from "@/components/common";
import IconButton from "@/components/ui/IconButton";
import { colors } from "@/styles/colors";
import { useAppDispatch } from "@/redux/store";
import { loadCVById, resetToNewCV } from "@/redux/features/cvSlice";
import { getAllCVs, getCV, saveCV, genCVId, deleteCV, formatUpdatedAt } from "@/utils/cvStorage";
import { shareCV } from "@/utils/shareCV";
import { toast } from "@/utils/toast";
import type { CVListItem } from "@/types/cv";
import { Check, Plus, Search, SlidersHorizontal, X } from "lucide-react-native";
import { useCallback, useMemo, useState } from "react";
import { Alert, Modal, Pressable, Text, TextInput, View } from "react-native";
import { CvCard, EmptyResume } from "../home/components";
import { useFocusEffect, useRouter } from "expo-router";

type SortOption = "newest" | "oldest" | "a_z" | "z_a";

const SORT_OPTIONS: { key: SortOption; label: string; sub: string }[] = [
  { key: "newest", label: "Newest First", sub: "Most recently updated" },
  { key: "oldest", label: "Oldest First", sub: "Least recently updated" },
  { key: "a_z", label: "Title A → Z", sub: "Alphabetical order" },
  { key: "z_a", label: "Title Z → A", sub: "Reverse alphabetical" },
];

function applySorting(cvs: CVListItem[], sort: SortOption): CVListItem[] {
  const copy = [...cvs];
  switch (sort) {
    case "oldest":
      return copy.sort((a, b) => a.updatedAt - b.updatedAt);
    case "a_z":
      return copy.sort((a, b) => a.name.localeCompare(b.name));
    case "z_a":
      return copy.sort((a, b) => b.name.localeCompare(a.name));
    default:
      return copy.sort((a, b) => b.updatedAt - a.updatedAt);
  }
}

const MyCVScreen = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [cvList, setCvList] = useState<CVListItem[]>([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("newest");
  const [pendingSort, setPendingSort] = useState<SortOption>("newest");
  const [filterVisible, setFilterVisible] = useState(false);

  // Reload list every time this tab gains focus
  useFocusEffect(
    useCallback(() => {
      getAllCVs()
        .then(setCvList)
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

  function handleDelete(id: string) {
    const cv = cvList.find((c) => c.id === id);
    Alert.alert("Delete CV", `Delete "${cv?.name || "this CV"}"? This cannot be undone.`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await deleteCV(id);
          setCvList((prev) => prev.filter((c) => c.id !== id));
        },
      },
    ]);
  }

  async function handleShare(id: string) {
    try {
      await shareCV(id, "PDF");
    } catch {
      toast.error("Could not share the CV. Please try again.");
    }
  }

  async function handleDuplicate(id: string) {
    const cv = await getCV(id);
    if (!cv) return;
    const copy = { ...cv, id: genCVId(), updatedAt: Date.now() };
    await saveCV(copy);
    getAllCVs()
      .then(setCvList)
      .catch(() => {});
    toast.success("CV duplicated successfully.");
  }

  function handleNewCV() {
    dispatch(resetToNewCV());
    router.push("/(tabs)/create-resume");
  }

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    const result = query
      ? cvList.filter(
          (cv) =>
            cv.name.toLowerCase().includes(query) || cv.jobTitle.toLowerCase().includes(query),
        )
      : cvList;
    return applySorting(result, sort);
  }, [search, sort, cvList]);

  const hasActiveFilter = sort !== "newest";

  function openFilter() {
    setPendingSort(sort);
    setFilterVisible(true);
  }

  function applyFilter() {
    setSort(pendingSort);
    setFilterVisible(false);
  }

  function resetFilter() {
    setPendingSort("newest");
    setSort("newest");
    setFilterVisible(false);
  }

  return (
    <Screen>
      {/* Search + Filter bar — sticky */}
      <StickyView sticky className="bg-secondary px-4 pt-2 pb-3">
        <ScreenHeader title="My CVs" className="mb-2" />

        {/* Search row */}
        <View className="flex-row items-center justify-center rounded-xl border border-border bg-white px-3">
          <Search size={18} color={colors.mutedForeground} strokeWidth={2} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search CVs"
            placeholderTextColor={colors.mutedForeground}
            className="flex-1"
            style={{
              fontFamily: "Poppins-Regular",
              fontSize: 14,
              color: colors.foreground,
              paddingVertical: 8,
              paddingHorizontal: 8,
              marginTop: 4,
            }}
            returnKeyType="search"
          />
          {search.length > 0 && (
            <Pressable onPress={() => setSearch("")} hitSlop={8} className="mr-2">
              <X size={14} color={colors.mutedForeground} strokeWidth={2} />
            </Pressable>
          )}
          <View className="h-5 w-px bg-border" />
          <View className="relative ml-1">
            <Pressable onPress={openFilter} hitSlop={6} className="p-2 active:opacity-60">
              <SlidersHorizontal
                size={16}
                color={hasActiveFilter ? colors.primary : colors.mutedForeground}
                strokeWidth={2}
              />
            </Pressable>
            {hasActiveFilter && (
              <View className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
            )}
          </View>
        </View>
      </StickyView>

      {/* CV list or empty state */}
      {filtered.length === 0 ? (
        <EmptyResume />
      ) : (
        <View className="mx-4 mt-1 overflow-hidden rounded-2xl bg-white">
          {filtered.map((cv, i) => (
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
              {i < filtered.length - 1 && <View className="mx-4 h-px bg-border" />}
            </View>
          ))}
        </View>
      )}

      {/* Sort bottom sheet */}
      <Modal
        transparent
        animationType="slide"
        visible={filterVisible}
        onRequestClose={() => setFilterVisible(false)}
      >
        <Pressable
          className="flex-1 justify-end bg-black/40"
          onPress={() => setFilterVisible(false)}
        >
          <Pressable
            className="rounded-t-3xl bg-white px-4 pt-3 pb-8"
            onPress={(e) => e.stopPropagation()}
          >
            <View className="mb-4 h-1 w-10 self-center rounded-full bg-border" />
            <View className="mb-5 flex-row items-center justify-between">
              <Text className="base-semibold text-foreground">Sort & Filter</Text>
              <IconButton
                onPress={() => setFilterVisible(false)}
                className="h-8 w-8 items-center justify-center rounded-full bg-secondary"
              >
                <X size={15} color={colors.foreground} strokeWidth={2.5} />
              </IconButton>
            </View>

            <View className="mb-6 overflow-hidden rounded-2xl bg-secondary">
              {SORT_OPTIONS.map((option, i) => (
                <Pressable
                  key={option.key}
                  onPress={() => setPendingSort(option.key)}
                  className={`flex-row items-center gap-3 px-4 py-3.5 active:opacity-70 ${
                    i < SORT_OPTIONS.length - 1 ? "border-b border-border" : ""
                  }`}
                >
                  <View
                    className={`h-5 w-5 items-center justify-center rounded-full border-2 ${
                      pendingSort === option.key
                        ? "border-primary bg-primary"
                        : "border-border bg-white"
                    }`}
                  >
                    {pendingSort === option.key && <Check size={11} color="#fff" strokeWidth={3} />}
                  </View>
                  <View className="flex-1">
                    <Text
                      className={`sm-semibold ${
                        pendingSort === option.key ? "text-primary" : "text-foreground"
                      }`}
                    >
                      {option.label}
                    </Text>
                    <Text className="caption mt-0.5">{option.sub}</Text>
                  </View>
                </Pressable>
              ))}
            </View>

            <View className="flex-row gap-3">
              <Pressable
                onPress={resetFilter}
                className="flex-1 items-center rounded-xl border border-border py-3.5 active:opacity-70"
              >
                <Text className="sm-semibold text-muted-foreground">Reset</Text>
              </Pressable>
              <Pressable
                onPress={applyFilter}
                className="flex-1 items-center rounded-xl bg-primary py-3.5 active:opacity-80"
              >
                <Text className="sm-semibold text-white!">Apply</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
        <AndroidNavSpacer />
      </Modal>
    </Screen>
  );
};

export default MyCVScreen;
