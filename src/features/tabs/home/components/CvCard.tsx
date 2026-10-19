import { FileText, Pencil, Eye, Trash2, MoreVertical } from "lucide-react-native";
import { useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import { colors } from "@/styles/colors";
import IconButton from "@/components/ui/IconButton";

export interface CvCardData {
  id: string;
  title: string;
  updatedAt: string;
}

interface CvCardProps extends CvCardData {
  onEdit?: (id: string) => void;
  onView?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function CvCard({ id, title, updatedAt, onEdit, onView, onDelete }: CvCardProps) {
  const [menuVisible, setMenuVisible] = useState(false);

  const actions = [
    {
      label: "Edit",
      icon: <Pencil size={16} color={colors.foreground} />,
      onPress: () => onEdit?.(id),
    },
    {
      label: "View",
      icon: <Eye size={16} color={colors.foreground} />,
      onPress: () => onView?.(id),
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
      <View className="flex-row items-center gap-3 px-4 py-3">
        {/* CV thumbnail */}
        <View className="h-14 w-11 items-center justify-between overflow-hidden rounded-md bg-accent px-1.5 py-1.5">
          <View className="w-full gap-0.5">
            <View className="h-0.5 w-full rounded-full bg-primary/40" />
            <View className="h-0.5 w-3/4 rounded-full bg-primary/30" />
            <View className="h-0.5 w-full rounded-full bg-primary/20" />
            <View className="h-0.5 w-2/3 rounded-full bg-primary/20" />
          </View>
          <FileText size={14} color={colors.primary} strokeWidth={1.5} />
        </View>

        {/* Info */}
        <View className="flex-1">
          <Text className="sm-semibold" numberOfLines={1}>
            {title}
          </Text>
          <Text className="caption mt-0.5">Updated {updatedAt}</Text>
        </View>

        {/* Three-dot menu trigger */}
        <IconButton onPress={() => setMenuVisible(true)} className="p-2" hitSlop={8}>
          <MoreVertical size={18} color={colors.mutedForeground} />
        </IconButton>
      </View>

      {/* Action menu modal */}
      <Modal
        transparent
        animationType="fade"
        visible={menuVisible}
        onRequestClose={() => setMenuVisible(false)}
      >
        <Pressable className="flex-1 bg-black/40" onPress={() => setMenuVisible(false)}>
          {/* Menu card */}
          <Pressable
            className="absolute right-4 bottom-8 left-4 overflow-hidden rounded-2xl bg-white"
            onPress={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <View className="border-b border-border px-4 py-3">
              <Text className="sm-semibold" numberOfLines={1}>
                {title}
              </Text>
            </View>

            {/* Actions */}
            {actions.map((action, i) => (
              <Pressable
                key={action.label}
                onPress={() => {
                  setMenuVisible(false);
                  action.onPress();
                }}
                className={`flex-row items-center gap-3 px-4 py-4 active:bg-gray-50 ${i < actions.length - 1 ? "border-b border-border" : ""}`}
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
