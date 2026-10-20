import { ScrollView, Text, TextInput, View } from "react-native";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { updatePersonal } from "@/redux/features/cvSlice";
import { colors } from "@/styles/colors";
import type { KeyboardTypeOptions } from "react-native";
import type { PersonalInfo } from "@/types/cv";
import CVSectionScreen from "./CVSectionScreen";
import LiveFab from "../LiveFab";

interface FieldDef {
  key: keyof PersonalInfo;
  label: string;
  placeholder: string;
  keyboard?: KeyboardTypeOptions;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
}

const FIELDS: FieldDef[] = [
  { key: "name", label: "Full name", placeholder: "e.g. Nusrat Jahan", autoCapitalize: "words" },
  {
    key: "title",
    label: "Job title",
    placeholder: "e.g. Product Designer",
    autoCapitalize: "words",
  },
  {
    key: "email",
    label: "Email",
    placeholder: "you@mail.com",
    keyboard: "email-address",
    autoCapitalize: "none",
  },
  {
    key: "phone",
    label: "Phone",
    placeholder: "+880 1711 000000",
    keyboard: "phone-pad",
    autoCapitalize: "none",
  },
  {
    key: "location",
    label: "Location",
    placeholder: "e.g. Dhaka, Bangladesh",
    autoCapitalize: "words",
  },
  {
    key: "website",
    label: "Website",
    placeholder: "yoursite.com",
    keyboard: "url",
    autoCapitalize: "none",
  },
  {
    key: "portfolio",
    label: "Portfolio (optional)",
    placeholder: "yourportfolio.com",
    keyboard: "url",
    autoCapitalize: "none",
  },
  {
    key: "linkedin",
    label: "LinkedIn (optional)",
    placeholder: "linkedin.com/in/yourname",
    keyboard: "url",
    autoCapitalize: "none",
  },
];

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
            <Text style={{ fontSize: 14, fontWeight: "600", color: colors.mutedForeground }}>
              {label}
            </Text>
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
