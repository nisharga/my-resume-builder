import { ScrollView } from "react-native";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { updatePersonal } from "@/redux/features/cvSlice";
import { LabeledInput } from "@/components";
import CVSectionScreen from "./CVSectionScreen";
import LiveFab from "../LiveFab";
import { PERSONAL_DETAILS_FIELDS } from "@/config";

export default function PersonalSection() {
  const dispatch = useAppDispatch();
  const personal = useAppSelector((s) => s.cv.personal);

  return (
    <CVSectionScreen title="Personal details">
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 120 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {PERSONAL_DETAILS_FIELDS.map(({ key, label, placeholder, keyboard, autoCapitalize }) => (
          <LabeledInput
            key={key}
            label={label}
            value={personal[key]}
            onChangeText={(v) => dispatch(updatePersonal({ [key]: v }))}
            placeholder={placeholder}
            keyboardType={keyboard ?? "default"}
            autoCapitalize={autoCapitalize ?? "words"}
          />
        ))}
      </ScrollView>
      <LiveFab sectionId="personal" />
    </CVSectionScreen>
  );
}
