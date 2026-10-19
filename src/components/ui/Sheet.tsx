import IconButton from "@/components/ui/IconButton";
import { colors } from "@/styles/colors";
import { X } from "lucide-react-native";
import { useState, type ReactNode } from "react";
import { Modal, Pressable, Text, View } from "react-native";

interface SheetProps {
  /** What the user taps to open the sheet */
  trigger: ReactNode;
  triggerClassName?: string;
  /** Optional heading shown at the top of the sheet */
  title?: string;
  /**
   * Sheet content. Pass a function to receive the `close` callback,
   * which lets inner buttons (e.g. Apply) close the sheet.
   *
   * @example
   * <Sheet trigger={<Button />}>
   *   {(close) => <Pressable onPress={close}><Text>Done</Text></Pressable>}
   * </Sheet>
   */
  children: ReactNode | ((close: () => void) => ReactNode);
}

export default function Sheet({ trigger, triggerClassName, title, children }: SheetProps) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <>
      {/* Trigger — tapping this opens the sheet */}
      <Pressable onPress={() => setOpen(true)} className={triggerClassName}>
        {trigger}
      </Pressable>

      <Modal transparent animationType="slide" visible={open} onRequestClose={close}>
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
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}
