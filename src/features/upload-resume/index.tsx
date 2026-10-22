import { Screen } from "@/components";
import { ScreenHeader } from "@/components/common";
import { loadCVById } from "@/redux/features/cvSlice";
import { useAppDispatch } from "@/redux/store";
import { colors } from "@/styles/colors";
import type { CVData } from "@/types/cv";
import { genCVId, saveCV } from "@/utils/cvStorage";
import { sampleResume } from "@/data/sample-resume";
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
    // Log the real PDF data — swap sampleResume for API response when ready
    console.log("PDF file ready to send to API:", {
      name: fileRef.current?.name,
      size: fileRef.current?.size ? `${(fileRef.current.size / 1024).toFixed(1)} KB` : "unknown",
      base64Length: fileRef.current?.base64.length,
    });
    console.log("Parsed CV (static — replace with API response):", sampleResume);

    const cv: CVData = { ...sampleResume, id: genCVId(), updatedAt: Date.now() };
    await saveCV(cv);
    await dispatch(loadCVById(cv.id));
    router.replace("/(tabs)/create-resume");
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
