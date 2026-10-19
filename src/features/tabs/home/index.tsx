import { Icons, Screen } from "@/components";
import { ScrollView, Text, Pressable, View } from "react-native";
import {
  WelcomeGreeting,
  CreateCvBanner,
  CvCard,
  EmptyResume,
  type CvCardData,
} from "./components";
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
  { id: "8", title: "Software Engineer CV", updatedAt: "2 hours ago" },
  { id: "9", title: "Product Manager CV", updatedAt: "Yesterday" },
  { id: "10", title: "UI/UX Designer CV", updatedAt: "3 days ago" },
  { id: "11", title: "Graphic Designer CV", updatedAt: "6 hours ago" },
  { id: "12", title: "UI/UX Designer CV", updatedAt: "5 days ago" },
  { id: "13", title: "Software Engineer CV", updatedAt: "2 days ago" },
  { id: "14", title: "Graphic Designer CV", updatedAt: "5 days ago" },
  { id: "21", title: "Software Engineer CV", updatedAt: "2 hours ago" },
  { id: "22", title: "Product Manager CV", updatedAt: "Yesterday" },
  { id: "23", title: "UI/UX Designer CV", updatedAt: "3 days ago" },
  { id: "24", title: "Graphic Designer CV", updatedAt: "6 hours ago" },
  { id: "25", title: "UI/UX Designer CV", updatedAt: "5 days ago" },
  { id: "26", title: "Software Engineer CV", updatedAt: "2 days ago" },
  { id: "27", title: "Graphic Designer CV", updatedAt: "5 days ago" },
  { id: "31", title: "Software Engineer CV", updatedAt: "2 hours ago" },
  { id: "42", title: "Product Manager CV", updatedAt: "Yesterday" },
  { id: "43", title: "UI/UX Designer CV", updatedAt: "3 days ago" },
  { id: "44", title: "Graphic Designer CV", updatedAt: "6 hours ago" },
  { id: "45", title: "UI/UX Designer CV", updatedAt: "5 days ago" },
  { id: "46", title: "Software Engineer CV", updatedAt: "2 days ago" },
  { id: "47", title: "Graphic Designer CV", updatedAt: "5 days ago" },
];

const HomeScreen = () => {
  const handleEdit = (id: string) => console.log("Edit", id);
  const handleView = (id: string) => console.log("View", id);
  const handleDelete = (id: string) => console.log("Delete", id);

  const router = useRouter();
  return (
    <Screen>
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
          <Text className="base-semibold text-foreground!">Recent CVs</Text>
          <IconButton onPress={() => router.push("/resumes")} className="flex flex-row gap-1">
            <Text className="sm-medium">View All</Text>
            <Icons.ArrowRight size={18} color={colors.primary} strokeWidth={2} />
          </IconButton>
        </View>

        {/* CV list or empty state */}
        {MOCK_CVS.length === 0 ? (
          <EmptyResume />
        ) : (
          <View className="mx-4 mt-1 overflow-hidden rounded-2xl bg-white">
            {MOCK_CVS.map((cv, i) => (
              <View key={cv.id}>
                <CvCard {...cv} onEdit={handleEdit} onView={handleView} onDelete={handleDelete} />
                {i < MOCK_CVS.length - 1 && <View className="mx-4 h-px bg-border" />}
              </View>
            ))}
          </View>
        )}
      </View>
    </Screen>
  );
};

export default HomeScreen;
