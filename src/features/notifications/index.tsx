import { Screen } from "@/components";
import { ScreenHeader } from "@/components/common";
import { loadCVById } from "@/redux/features/cvSlice";
import { useAppDispatch } from "@/redux/store";
import { colors } from "@/styles";
import { type ExportRecord, getExportHistory } from "@/utils/exportHistory";
import { formatUpdatedAt } from "@/utils/cvStorage";
import { useRouter, useFocusEffect } from "expo-router";
import { shareCV } from "@/utils/shareCV";
import { toast } from "@/utils/toast";
import { ChevronLeft, FileText, FileType, Share2 } from "lucide-react-native";
import { useCallback, useState } from "react";
import { Pressable, Text, View } from "react-native";

export default function NotificationsScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [records, setRecords] = useState<ExportRecord[]>([]);

  useFocusEffect(
    useCallback(() => {
      getExportHistory()
        .then(setRecords)
        .catch(() => {});
    }, []),
  );

  async function handleView(record: ExportRecord) {
    await dispatch(loadCVById(record.cvId));
    router.push("/cv-preview");
  }

  async function handleShare(record: ExportRecord) {
    try {
      await shareCV(record.cvId, record.format);
    } catch {
      toast.error("Could not share the file. Please try again.");
    }
  }

  return (
    <Screen>
      <ScreenHeader
        title="Notifications"
        left={
          <Pressable onPress={() => router.back()} hitSlop={8} className="active:opacity-60">
            <ChevronLeft size={24} color={colors.foreground} />
          </Pressable>
        }
      />

      <View className="mt-2 px-4">
        {records.length === 0 ? (
          <View className="mt-20 items-center gap-2">
            <FileText size={40} color={colors.border} strokeWidth={1.5} />
            <Text className="sm-normal mt-2 text-muted-foreground">No exports yet</Text>
            <Text className="caption text-center" style={{ color: colors.subtleForeground }}>
              Export a resume as PDF or DOCX and it will appear here.
            </Text>
          </View>
        ) : (
          <View className="overflow-hidden rounded-2xl bg-white">
            {records.map((record, i) => (
              <View key={record.id}>
                <View className="flex-row items-center gap-3 px-4 py-3.5">
                  {/* Format icon */}
                  <View
                    style={{ backgroundColor: colors.primary + "15" }}
                    className="h-10 w-10 items-center justify-center rounded-xl"
                  >
                    {record.format === "PDF" ? (
                      <FileText size={18} color={colors.primary} strokeWidth={1.8} />
                    ) : (
                      <FileType size={18} color={colors.primary} strokeWidth={1.8} />
                    )}
                  </View>

                  {/* Info */}
                  <View className="flex-1 gap-0.5">
                    <Text className="sm-semibold text-foreground" numberOfLines={1}>
                      {record.cvName}
                    </Text>
                    <Text className="caption" style={{ color: colors.mutedForeground }}>
                      Exported as {record.format} · {formatUpdatedAt(record.timestamp)}
                    </Text>
                  </View>

                  {/* Action buttons */}
                  <View className="flex-row gap-2">
                    <Pressable
                      onPress={() => handleShare(record)}
                      style={{ backgroundColor: colors.primary + "15" }}
                      className="h-8 w-8 items-center justify-center rounded-lg active:opacity-70"
                    >
                      <Share2 size={15} color={colors.primary} strokeWidth={2} />
                    </Pressable>
                    <Pressable
                      onPress={() => handleView(record)}
                      style={{ backgroundColor: colors.primary + "15" }}
                      className="rounded-lg px-3 py-1.5 active:opacity-70"
                    >
                      <Text style={{ color: colors.primary }} className="sm-semibold">
                        View
                      </Text>
                    </Pressable>
                  </View>
                </View>

                {i < records.length - 1 && <View className="mx-4 h-px bg-border" />}
              </View>
            ))}
          </View>
        )}
      </View>
    </Screen>
  );
}
