import { CheckCircle2, FileText } from "lucide-react-native";
import { useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system/legacy";
import { colors } from "@/styles/colors";
import { AndroidNavSpacer, Button } from "@/components";

export interface PickedFile {
  name: string;
  uri: string;
  size?: number;
  base64: string;
}

interface Props {
  onNext: (file: PickedFile) => void;
}

export default function StepUpload({ onNext }: Props) {
  const [file, setFile] = useState<PickedFile | null>(null);
  const [loading, setLoading] = useState(false);

  async function handlePickFile() {
    const result = await DocumentPicker.getDocumentAsync({
      type: "application/pdf",
      copyToCacheDirectory: true,
    });

    if (result.canceled) return;

    const asset = result.assets[0];
    setLoading(true);

    try {
      const base64 = await FileSystem.readAsStringAsync(asset.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const picked: PickedFile = {
        name: asset.name,
        uri: asset.uri,
        size: asset.size,
        base64,
      };

      console.log("PDF picked:", {
        name: picked.name,
        uri: picked.uri,
        size: picked.size ? `${(picked.size / 1024).toFixed(1)} KB` : "unknown",
        base64Length: base64.length,
        base64Preview: base64.slice(0, 100) + "...",
      });

      setFile(picked);
    } catch (e) {
      console.error("Failed to read PDF:", e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View className="flex-1 px-4 pt-2">
      <Text className="xl-bold mb-1 text-foreground">Upload your resume</Text>
      <Text className="sm-normal mb-6 text-muted-foreground">
        AI will read your PDF and fill in your new CV automatically.
      </Text>

      {/* Drop zone */}
      <Pressable
        onPress={handlePickFile}
        disabled={loading}
        style={{
          borderWidth: 2,
          borderColor: file ? colors.success : colors.border,
          borderStyle: "dashed",
          borderRadius: 16,
        }}
        className="mb-5 items-center justify-center py-14 active:opacity-80"
      >
        {loading ? (
          <>
            <ActivityIndicator color={colors.primary} size="large" />
            <Text className="caption mt-3" style={{ color: colors.mutedForeground }}>
              Reading file...
            </Text>
          </>
        ) : file ? (
          <>
            <CheckCircle2 size={52} color={colors.success} strokeWidth={1.5} />
            <Text className="sm-semibold mt-3 text-foreground" numberOfLines={1}>
              {file.name}
            </Text>
            {file.size && (
              <Text className="caption mt-1" style={{ color: colors.mutedForeground }}>
                {(file.size / 1024).toFixed(1)} KB
              </Text>
            )}
            <Text className="caption mt-2" style={{ color: colors.mutedForeground }}>
              Tap to change file
            </Text>
          </>
        ) : (
          <>
            <View
              style={{
                width: 72,
                height: 88,
                backgroundColor: "#f1f5f9",
                borderRadius: 10,
                padding: 12,
                alignItems: "center",
                gap: 6,
                marginBottom: 14,
              }}
            >
              <FileText size={26} color={colors.mutedForeground} strokeWidth={1.5} />
              {[80, 60, 72, 50].map((w, i) => (
                <View
                  key={i}
                  style={{
                    height: 4,
                    width: `${w}%`,
                    backgroundColor: colors.border,
                    borderRadius: 2,
                  }}
                />
              ))}
            </View>
            <Text className="sm-semibold text-foreground">Choose your PDF resume</Text>
            <Text className="caption mt-1" style={{ color: colors.mutedForeground }}>
              Tap to browse files
            </Text>
          </>
        )}
      </Pressable>

      {/* Secondary pick button */}
      <Pressable
        onPress={handlePickFile}
        disabled={loading}
        style={{
          backgroundColor: file ? colors.success + "18" : colors.secondary,
          borderRadius: 12,
        }}
        className="mb-4 items-center py-3.5 active:opacity-75"
      >
        <Text className="sm-semibold" style={{ color: file ? colors.success : colors.foreground }}>
          {file ? "Change File" : "Browse PDF Files"}
        </Text>
      </Pressable>

      <View className="flex-1" />

      {/* Next CTA */}

      <Button
        onPress={file ? () => onNext(file) : undefined}
        style={{ backgroundColor: file ? colors.primary : colors.border }}
        className="rounded-xl"
      >
        <Text className="sm-semibold text-white!">Analyze with AI</Text>
      </Button>
      <AndroidNavSpacer />
    </View>
  );
}
