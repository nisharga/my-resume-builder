import { Icons, Screen } from "@/components";
import { ScrollView, Text, Pressable, View } from "react-native";
import { WelcomeGreeting, CreateCvBanner, CvCard, type CvCardData } from "./components";
import { useRouter } from "expo-router";
import IconButton from "@/components/ui/IconButton";
import { colors } from "@/styles";

const MOCK_CVS: CvCardData[] = [
  { id: "1", title: "Software Engineer CV", updatedAt: "2 hours ago" },
  { id: "2", title: "Product Manager CV", updatedAt: "Yesterday" },
  { id: "3", title: "UI/UX Designer CV", updatedAt: "3 days ago" },
  { id: "4", title: "Graphic Designer CV", updatedAt: "6 hours ago" },
  { id: "5", title: "UI/UX Designer CV", updatedAt: "5 days ago" },
  { id: "6", title: "Software Engineer CV", updatedAt: "2 days ago" },
  { id: "7", title: "Graphic Designer CV", updatedAt: "5 days ago" },
];

const HomeScreen = () => {
  const handleEdit = (id: string) => console.log("Edit", id);
  const handleView = (id: string) => console.log("View", id);
  const handleDelete = (id: string) => console.log("Delete", id);

  const router = useRouter();
  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="pb-8">
        {/* Greeting */}
        <View className="mb-4 px-4">
          <WelcomeGreeting welcomeLabel="Nisharga Kabir" />
        </View>

        {/* Create CV banner */}
        <View className="mb-4 px-4">
          <CreateCvBanner onPress={() => router.push("/create-resume")} />
        </View>

        {/* Recent CVs */}
        <View className="">
          {/* Section header */}
          <View className="mb-2 flex-row items-center justify-between px-4">
            <Text className="sm-bold">Recent CVs</Text>
            <IconButton onPress={() => router.push("/resumes")} className="flex flex-row gap-1">
              <Text className="sm-medium">View All</Text>
              <Icons.ArrowRight size={18} color={colors.primary} strokeWidth={2} />
            </IconButton>
          </View>

          {/* CV list */}
          <View className="mx-4 mt-1 overflow-hidden rounded-2xl bg-white">
            {MOCK_CVS.map((cv, i) => (
              <View key={cv.id}>
                <CvCard {...cv} onEdit={handleEdit} onView={handleView} onDelete={handleDelete} />
                {i < MOCK_CVS.length - 1 && <View className="mx-4 h-px bg-border" />}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
};

export default HomeScreen;
