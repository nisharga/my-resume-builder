import { AndroidNavSpacer } from "@/components/core";
import IconButton from "@/components/ui/IconButton";
import { colors } from "@/styles/colors";
import { X } from "lucide-react-native";
import { useState, type ReactNode } from "react";
import { Modal, Pressable, Text, View } from "react-native";

interface SheetProps {
  trigger: ReactNode;
  triggerClassName?: string;
  title?: string;
  open?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  children: ReactNode | ((close: () => void) => ReactNode);
}

export default function Sheet({
  trigger,
  triggerClassName,
  title,
  children,
  open: controlledOpen,
  onOpen,
  onClose,
}: SheetProps) {
  const [internalOpen, setInternalOpen] = useState(false);

  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;

  const open = () => {
    isControlled ? onOpen?.() : setInternalOpen(true);
  };
  const close = () => {
    setInternalOpen(false);
    onClose?.();
  };

  return (
    <>
      {/* Trigger — tapping this opens the sheet */}
      <Pressable onPress={open} className={triggerClassName}>
        {trigger}
      </Pressable>

      <Modal transparent animationType="slide" visible={isOpen} onRequestClose={close}>
        {/* Dim backdrop — tap to dismiss */}
        <Pressable className="flex-1 justify-end bg-black/40" onPress={close}>
          {/* Sheet card — stop touches from bubbling to backdrop */}
          <Pressable
            className="rounded-t-3xl bg-white px-4 pt-3 pb-8"
            onPress={(e) => e.stopPropagation()}
          >
            {/* Drag handle */}
            <View className="mb-4 h-1 w-10 self-center rounded-full bg-border" />

            {/* Title row (only rendered when title is provided) */}
            {title && (
              <View className="mb-5 flex-row items-center justify-between">
                <Text className="base-medium">{title}</Text>
                <IconButton
                  onPress={close}
                  className="h-8 w-8 items-center justify-center rounded-full bg-secondary"
                >
                  <X size={15} color={colors.foreground} strokeWidth={2.5} />
                </IconButton>
              </View>
            )}

            {/* Content — function children receive the close callback */}
            {typeof children === "function" ? children(close) : children}

            <AndroidNavSpacer />
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}
