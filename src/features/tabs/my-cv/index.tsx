import { Screen } from "@/components";
import { View } from "react-native";
import { CvCard, EmptyResume, type CvCardData } from "../home/components";

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

const MyCVScreen = () => {
  const handleEdit = (id: string) => console.log("Edit", id);
  const handleView = (id: string) => console.log("View", id);
  const handleDelete = (id: string) => console.log("Delete", id);

  return (
    <Screen>
      {/* Recent CVs */}
      <View className="">
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

export default MyCVScreen;
