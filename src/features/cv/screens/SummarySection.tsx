import { ScrollView, Text, TextInput, View } from "react-native";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { updateSummary } from "@/redux/features/cvSlice";
import { colors } from "@/styles/colors";
import CVSectionScreen from "./CVSectionScreen";
import LiveFab from "../LiveFab";
import { LabeledInput } from "@/components";

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
        <LabeledInput
          label="About You"
          value={summary}
          onChangeText={(v) => dispatch(updateSummary(v))}
          placeholder="2–4 sentences about your experience and strengths"
          multiline
          style={{ minHeight: 100 }}
          hint="Keep it short. Recruiters read this first."
        />
      </ScrollView>
      <LiveFab sectionId="summary" />
    </CVSectionScreen>
  );
}
