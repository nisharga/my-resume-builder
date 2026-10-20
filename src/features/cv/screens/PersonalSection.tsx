import { ScrollView, Text, TextInput, View } from "react-native";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { updatePersonal } from "@/redux/features/cvSlice";
import { colors } from "@/styles/colors";
import CVSectionScreen from "./CVSectionScreen";
import LiveFab from "../LiveFab";
import { FIELDS } from "@/config";

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
        {FIELDS.map(({ key, label, placeholder, keyboard, autoCapitalize }) => (
          <View key={key} style={{ gap: 6 }}>
            <Text className="sm-bold text-body!">{label}</Text>
            <View
              style={{
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 12,
                backgroundColor: "#fff",
                paddingHorizontal: 14,
              }}
            >
              <TextInput
                value={personal[key]}
                onChangeText={(v) => dispatch(updatePersonal({ [key]: v }))}
                placeholder={placeholder}
                placeholderTextColor={colors.subtleForeground}
                keyboardType={keyboard ?? "default"}
                autoCapitalize={autoCapitalize ?? "words"}
                style={{ fontSize: 16, color: colors.foreground, paddingVertical: 14 }}
              />
            </View>
          </View>
        ))}
      </ScrollView>
      <LiveFab sectionId="personal" />
    </CVSectionScreen>
  );
}
