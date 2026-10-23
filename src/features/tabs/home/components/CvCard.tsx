import { FileText, Pencil, Eye, Trash2, MoreVertical, Copy, Share2 } from "lucide-react-native";
import { useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import { colors } from "@/styles/colors";
import IconButton from "@/components/ui/IconButton";
import type { TemplateId } from "@/types/cv";

export interface CvCardData {
  id: string;
  name: string;
  jobTitle: string;
  template: TemplateId;
  accent: string;
  updatedAt: number;
}

interface CvCardProps extends CvCardData {
  formattedDate: string;
  onEdit?: (id: string) => void;
  onView?: (id: string) => void;
  onDelete?: (id: string) => void;
  onDuplicate?: (id: string) => void;
  onShare?: (id: string) => void;
}

const TEMPLATE_LABELS: Record<TemplateId, string> = {
  classic: "Classic",
  sidebar: "Sidebar",
  minimal: "Minimal",
};

export default function CvCard({
  id,
  name,
  jobTitle,
  template,
  accent,
  formattedDate,
  onEdit,
  onView,
  onDelete,
  onDuplicate,
  onShare,
}: CvCardProps) {
  const [menuVisible, setMenuVisible] = useState(false);

  const displayName = name || "Untitled CV";

  const actions = [
    {
      label: "View",
      icon: <Eye size={16} color={colors.foreground} />,
      onPress: () => onView?.(id),
    },
    {
      label: "Edit",
      icon: <Pencil size={16} color={colors.foreground} />,
      onPress: () => onEdit?.(id),
    },
    {
      label: "Share",
      icon: <Share2 size={16} color={colors.foreground} />,
      onPress: () => onShare?.(id),
    },
    {
      label: "Duplicate",
      icon: <Copy size={16} color={colors.foreground} />,
      onPress: () => onDuplicate?.(id),
    },
    {
      label: "Delete",
      icon: <Trash2 size={16} color={colors.destructive} />,
      onPress: () => onDelete?.(id),
      destructive: true,
    },
  ];

  return (
    <>
      <Pressable
        className="flex-row items-center gap-3 px-4 py-3 active:bg-gray-50"
        onPress={() => onView?.(id)}
      >
        {/* CV thumbnail with accent color */}
        <View
          style={{ backgroundColor: `${accent}18` }}
          className="h-14 w-11 items-center justify-between overflow-hidden rounded-md px-1.5 py-1.5"
        >
          <View className="w-full gap-0.5">
            <View
              style={{ backgroundColor: accent + "66" }}
              className="h-0.5 w-full rounded-full"
            />
            <View style={{ backgroundColor: accent + "44" }} className="h-0.5 w-3/4 rounded-full" />
            <View
              style={{ backgroundColor: accent + "33" }}
              className="h-0.5 w-full rounded-full"
            />
            <View style={{ backgroundColor: accent + "22" }} className="h-0.5 w-2/3 rounded-full" />
          </View>
          <FileText size={14} color={accent} strokeWidth={1.5} />
        </View>

        {/* Info */}
        <View className="flex-1 gap-0.5">
          <Text className="sm-semibold" numberOfLines={1}>
            {displayName}
          </Text>
          {jobTitle ? (
            <Text className="caption" numberOfLines={1}>
              {jobTitle}
            </Text>
          ) : null}
          <View className="mt-1 flex-row items-center gap-2">
            {/* Template badge */}
            <View
              style={{ backgroundColor: `${accent}18`, borderColor: `${accent}33` }}
              className="rounded-full border px-2 py-0.5"
            >
              <Text style={{ color: accent, fontSize: 10, fontWeight: "600" }}>
                {TEMPLATE_LABELS[template]}
              </Text>
            </View>
            <Text className="caption">{formattedDate}</Text>
          </View>
        </View>

        {/* Three-dot menu trigger — stops tap-to-view from firing */}
        <IconButton onPress={() => setMenuVisible(true)} className="p-2" hitSlop={8}>
          <MoreVertical size={18} color={colors.mutedForeground} />
        </IconButton>
      </Pressable>

      {/* Action menu modal */}
      <Modal
        transparent
        animationType="fade"
        visible={menuVisible}
        onRequestClose={() => setMenuVisible(false)}
      >
        <Pressable className="flex-1 bg-black/40" onPress={() => setMenuVisible(false)}>
          <Pressable
            className="absolute right-4 bottom-8 left-4 overflow-hidden rounded-2xl bg-white"
            onPress={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <View className="border-b border-border px-4 py-3">
              <Text className="sm-semibold" numberOfLines={1}>
                {displayName}
              </Text>
              {jobTitle ? <Text className="caption mt-0.5">{jobTitle}</Text> : null}
            </View>

            {/* Actions */}
            {actions.map((action, i) => (
              <Pressable
                key={action.label}
                onPress={() => {
                  setMenuVisible(false);
                  action.onPress();
                }}
                className={`flex-row items-center gap-3 px-4 py-4 active:bg-gray-50 ${
                  i < actions.length - 1 ? "border-b border-border" : ""
                }`}
              >
                {action.icon}
                <Text className={`sm-semibold ${action.destructive ? "text-destructive" : ""}`}>
                  {action.label}
                </Text>
              </Pressable>
            ))}

            {/* Cancel */}
            <Pressable
              onPress={() => setMenuVisible(false)}
              className="mx-4 mt-2 mb-4 items-center rounded-xl bg-secondary py-3 active:opacity-70"
            >
              <Text className="sm-semibold">Cancel</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}
