import { ScrollView, Text, TextInput, View } from "react-native";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { updateSummary } from "@/redux/features/cvSlice";
import { colors } from "@/styles/colors";
import CVSectionScreen from "./CVSectionScreen";
import LiveFab from "../LiveFab";

export default function SummarySection() {
  const dispatch = useAppDispatch();
  const summary = useAppSelector((s) => s.cv.summary);

  return (
    <CVSectionScreen title="Summary">
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text className="label-text mb-2">About You</Text>
        <View
          style={{
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 12,
            backgroundColor: "#fff",
            padding: 14,
          }}
        >
          <TextInput
            value={summary}
            onChangeText={(v) => dispatch(updateSummary(v))}
            placeholder="2–4 sentences about your experience and strengths"
            placeholderTextColor={colors.subtleForeground}
            multiline
            style={{
              fontSize: 16,
              color: colors.foreground,
              minHeight: 120,
              textAlignVertical: "top",
            }}
          />
        </View>
        <Text style={{ marginTop: 8, fontSize: 13, color: colors.mutedForeground }}>
          Keep it short. Recruiters read this first.
        </Text>
      </ScrollView>
      <LiveFab sectionId="summary" />
    </CVSectionScreen>
  );
}
