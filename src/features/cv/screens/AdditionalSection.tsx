import { ScrollView, Text, View } from "react-native";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { updateAchievementValue } from "@/redux/features/cvSlice";
import { LabeledInput } from "@/components";
import { colors } from "@/styles/colors";
import CVSectionScreen from "./CVSectionScreen";
import LiveFab from "../LiveFab";

export default function AdditionalSection() {
  const dispatch = useAppDispatch();
  const achievements = useAppSelector((s) => s.cv.achievements);

  const enabled = achievements.filter((a) => a.enabled);

  return (
    <CVSectionScreen title="Additional Fields">
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {enabled.length === 0 ? (
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              paddingTop: 60,
              gap: 8,
            }}
          >
            <Text style={{ fontSize: 15, fontWeight: "600", color: colors.mutedForeground }}>
              No fields enabled
            </Text>
            <Text style={{ fontSize: 13, color: colors.mutedForeground, textAlign: "center" }}>
              Go to Templates → Additional Fields to enable some.
            </Text>
          </View>
        ) : (
          <View style={{ gap: 16 }}>
            {enabled.map((item) => (
              <View key={item.id}>
                {/* Section label matching the achievement name */}
                <LabeledInput
                  label={item.name}
                  value={item.value}
                  onChangeText={(v) => dispatch(updateAchievementValue({ id: item.id, value: v }))}
                  placeholder={`Enter details for ${item.name}...`}
                  multiline
                  style={{ minHeight: 80 }}
                />
              </View>
            ))}
          </View>
        )}
      </ScrollView>
      <LiveFab sectionId="additional" />
    </CVSectionScreen>
  );
}
