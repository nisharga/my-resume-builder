import { Screen } from "@/components";
import { ScreenHeader } from "@/components/common";
import { loadCVById } from "@/redux/features/cvSlice";
import { useAppDispatch } from "@/redux/store";
import { colors } from "@/styles/colors";
import type { CVData } from "@/types/cv";
import { genCVId, saveCV } from "@/utils/cvStorage";
import { parseResumeWithAI } from "@/services/api/geminiService";
import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { useRef, useState } from "react";
import { Pressable, Text, View } from "react-native";
import StepAnalyzing from "./components/StepAnalyzing";
import StepUpload, { type PickedFile } from "./components/StepUpload";

const STEP_LABELS = ["Upload", "Analyzing", "Fill CV"];

export default function UploadResumeScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [step, setStep] = useState<1 | 2>(1);
  const fileRef = useRef<PickedFile | null>(null);

  function handleUploadNext(file: PickedFile) {
    fileRef.current = file;
    setStep(2);
  }

  async function handleAnalysisDone() {
    const file = fileRef.current;
    if (!file) return;

    try {
      const parsed = await parseResumeWithAI(file.base64);
      console.log("Gemini parsed CV:", JSON.stringify(parsed, null, 2));

      const cv: CVData = { ...parsed, id: genCVId(), updatedAt: Date.now() };
      await saveCV(cv);
      await dispatch(loadCVById(cv.id));
      router.replace("/(tabs)/create-resume");
    } catch (e) {
      console.error("Failed to parse resume:", e);
    }
  }

  return (
    <Screen>
      <ScreenHeader
        title="Import Resume"
        left={
          step === 1 ? (
            <Pressable onPress={() => router.back()} hitSlop={8} className="active:opacity-60">
              <ChevronLeft size={24} color={colors.foreground} />
            </Pressable>
          ) : null
        }
      />

      {/* Step progress */}
      <View className="px-4 pt-1 pb-4">
        <View className="mb-2 flex-row gap-1.5">
          {STEP_LABELS.map((_, i) => (
            <View
              key={i}
              style={{
                flex: 1,
                height: 4,
                borderRadius: 2,
                backgroundColor: i + 1 <= step ? colors.primary : colors.border,
              }}
            />
          ))}
        </View>
        <Text className="caption" style={{ color: colors.mutedForeground }}>
          Step {step} of {STEP_LABELS.length} — {STEP_LABELS[step - 1]}
        </Text>
      </View>

      {step === 1 && <StepUpload onNext={handleUploadNext} />}
      {step === 2 && <StepAnalyzing onDone={handleAnalysisDone} />}
    </Screen>
  );
}
