import { useRef, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { addSkill, removeSkill } from "@/redux/features/cvSlice";
import { X } from "lucide-react-native";
import { colors } from "@/styles/colors";
import CVSectionScreen from "./CVSectionScreen";
import LiveFab from "../LiveFab";

export default function SkillsSection() {
  const dispatch = useAppDispatch();
  const skills = useAppSelector((s) => s.cv.skills);
  const [input, setInput] = useState("");
  const inputRef = useRef<TextInput>(null);

  function handleAdd() {
    if (input.trim()) {
      dispatch(addSkill(input.trim()));
      setInput("");
    }
  }

  return (
    <CVSectionScreen title="Skills">
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Input row */}
        <View style={{ flexDirection: "row", gap: 8, marginBottom: 16 }}>
          <View
            style={{
              flex: 1,
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: 12,
              backgroundColor: "#fff",
              paddingHorizontal: 14,
            }}
          >
            <TextInput
              ref={inputRef}
              value={input}
              onChangeText={setInput}
              placeholder="Type a skill"
              placeholderTextColor={colors.subtleForeground}
              returnKeyType="done"
              onSubmitEditing={handleAdd}
              style={{ fontSize: 16, color: colors.foreground, paddingVertical: 14 }}
            />
          </View>
          <Pressable
            onPress={handleAdd}
            style={{
              backgroundColor: colors.primary,
              borderRadius: 12,
              paddingHorizontal: 18,
              justifyContent: "center",
            }}
            accessibilityRole="button"
            accessibilityLabel="Add skill"
          >
            <Text style={{ color: "#fff", fontSize: 14, fontWeight: "600" }}>Add</Text>
          </Pressable>
        </View>

        {/* Chips */}
        {skills.length === 0 ? (
          <Text style={{ color: colors.mutedForeground, fontSize: 14 }}>
            {'Add skills like "Figma" or "Teamwork"'}
          </Text>
        ) : (
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {skills.map((sk) => (
              <View
                key={sk}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 6,
                  backgroundColor: colors.accent,
                  borderRadius: 20,
                  paddingVertical: 6,
                  paddingLeft: 12,
                  paddingRight: 6,
                }}
              >
                <Text style={{ fontSize: 14, color: colors.foreground }}>{sk}</Text>
                <Pressable
                  onPress={() => dispatch(removeSkill(sk))}
                  hitSlop={4}
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 10,
                    backgroundColor: colors.border,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  accessibilityLabel={`Remove ${sk}`}
                  accessibilityRole="button"
                >
                  <X size={11} color={colors.foreground} strokeWidth={2.5} />
                </Pressable>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
      <LiveFab sectionId="skills" />
    </CVSectionScreen>
  );
}
