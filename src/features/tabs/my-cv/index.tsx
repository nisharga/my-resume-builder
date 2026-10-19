import { Icons, Screen, StickyView } from "@/components";
import { ScreenHeader } from "@/components/common";
import IconButton from "@/components/ui/IconButton";
import { colors } from "@/styles/colors";
import { Check, Search, SlidersHorizontal, X } from "lucide-react-native";
import { useMemo, useState } from "react";
import { Modal, Pressable, Text, TextInput, View } from "react-native";
import { CvCard, EmptyResume, type CvCardData } from "../home/components";
import Sheet from "@/components/ui/Sheet";
import { Button, ScrollView } from "@expo/ui";

type SortOption = "newest" | "oldest" | "a_z" | "z_a";

const SORT_OPTIONS: { key: SortOption; label: string; sub: string }[] = [
  { key: "newest", label: "Newest First", sub: "Most recently updated" },
  { key: "oldest", label: "Oldest First", sub: "Least recently updated" },
  { key: "a_z", label: "Title A → Z", sub: "Alphabetical order" },
  { key: "z_a", label: "Title Z → A", sub: "Reverse alphabetical" },
];

const MOCK_CVS: CvCardData[] = [
  { id: "1", title: "Software Engineer CV", updatedAt: "2 hours ago" },
  { id: "2", title: "Product Manager CV", updatedAt: "Yesterday" },
  { id: "3", title: "UI/UX Designer CV", updatedAt: "3 days ago" },
  { id: "4", title: "Graphic Designer CV", updatedAt: "6 hours ago" },
  { id: "5", title: "UI/UX Designer CV", updatedAt: "5 days ago" },
  { id: "6", title: "Software Engineer CV", updatedAt: "2 days ago" },
  { id: "7", title: "Graphic Designer CV", updatedAt: "5 days ago" },
  { id: "8", title: "Software Engineer CV", updatedAt: "2 hours ago" },
  { id: "9", title: "Product Manager CV", updatedAt: "Yesterday" },
  { id: "10", title: "UI/UX Designer CV", updatedAt: "3 days ago" },
  { id: "11", title: "Graphic Designer CV", updatedAt: "6 hours ago" },
  { id: "12", title: "UI/UX Designer CV", updatedAt: "5 days ago" },
  { id: "13", title: "Software Engineer CV", updatedAt: "2 days ago" },
  { id: "14", title: "Graphic Designer CV", updatedAt: "5 days ago" },
];

function applySorting(cvs: CvCardData[], sort: SortOption): CvCardData[] {
  const copy = [...cvs];
  switch (sort) {
    case "oldest":
      return copy.reverse();
    case "a_z":
      return copy.sort((a, b) => a.title.localeCompare(b.title));
    case "z_a":
      return copy.sort((a, b) => b.title.localeCompare(a.title));
    default:
      return copy;
  }
}

const MyCVScreen = () => {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("newest");
  const [pendingSort, setPendingSort] = useState<SortOption>("newest");
  const [filterVisible, setFilterVisible] = useState(false);

  const handleEdit = (id: string) => console.log("Edit", id);
  const handleView = (id: string) => console.log("View", id);
  const handleDelete = (id: string) => console.log("Delete", id);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    const result = query
      ? MOCK_CVS.filter((cv) => cv.title.toLowerCase().includes(query))
      : MOCK_CVS;
    return applySorting(result, sort);
  }, [search, sort]);

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
  const [open, setOpen] = useState(false);
  return (
    <Screen>
      {/* Search + Filter bar — sticky */}
      <StickyView sticky className="bg-secondary px-4 pt-2 pb-3">
        {/* Page title */}
        <ScreenHeader title="My CVs" className="mb-2" />
        {/* Single row: search icon | input | divider | filter icon */}
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

          {/* Vertical divider */}
          <View className="h-5 w-px bg-border" />

          {/* Filter button */}
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

      <Sheet
        trigger={<Icons.CheckCircle />}
        open={open}
        onOpen={() => setOpen(true)} // trigger press → opens
        onClose={() => setOpen(false)} // backdrop/X → closes
        title="Sort & Filter"
      >
        <View className="py-4">
          <Text>Hello</Text>
          <Pressable onPress={() => setOpen(false)}>
            <Text>Close me</Text>
          </Pressable>
        </View>
      </Sheet>

      {/* CV list or empty state */}
      {filtered.length === 0 ? (
        <EmptyResume />
      ) : (
        <View className="mx-4 mt-1 overflow-hidden rounded-2xl bg-white">
          {filtered.map((cv, i) => (
            <View key={cv.id}>
              <CvCard {...cv} onEdit={handleEdit} onView={handleView} onDelete={handleDelete} />
              {i < filtered.length - 1 && <View className="mx-4 h-px bg-border" />}
            </View>
          ))}
        </View>
      )}

      {/* Filter bottom sheet */}
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
            {/* Handle */}
            <View className="mb-4 h-1 w-10 self-center rounded-full bg-border" />

            {/* Header */}
            <View className="mb-5 flex-row items-center justify-between">
              <Text className="base-semibold text-foreground">Sort & Filter</Text>
              <IconButton
                onPress={() => setFilterVisible(false)}
                className="h-8 w-8 items-center justify-center rounded-full bg-secondary"
              >
                <X size={15} color={colors.foreground} strokeWidth={2.5} />
              </IconButton>
            </View>

            {/* Sort by section */}
            <Text className="sm-semibold mb-3 text-muted-foreground">Sort by</Text>
            <View className="mb-6 overflow-hidden rounded-2xl bg-secondary">
              {SORT_OPTIONS.map((option, i) => (
                <Pressable
                  key={option.key}
                  onPress={() => setPendingSort(option.key)}
                  className={`flex-row items-center gap-3 px-4 py-3.5 active:opacity-70 ${
                    i < SORT_OPTIONS.length - 1 ? "border-b border-border" : ""
                  }`}
                >
                  {/* Radio circle */}
                  <View
                    className={`h-5 w-5 items-center justify-center rounded-full border-2 ${
                      pendingSort === option.key
                        ? "border-primary bg-primary"
                        : "border-border bg-white"
                    }`}
                  >
                    {pendingSort === option.key && <Check size={11} color="#fff" strokeWidth={3} />}
                  </View>

                  {/* Labels */}
                  <View className="flex-1">
                    <Text
                      className={`sm-semibold ${pendingSort === option.key ? "text-primary" : "text-foreground"}`}
                    >
                      {option.label}
                    </Text>
                    <Text className="caption mt-0.5">{option.sub}</Text>
                  </View>
                </Pressable>
              ))}
            </View>

            {/* Buttons */}
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
                <Text className="sm-semibold text-white">Apply</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </Screen>
  );
};

export default MyCVScreen;
