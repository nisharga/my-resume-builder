import GorhomBottomSheet, {
  BottomSheetBackdrop,
  BottomSheetHandle,
  BottomSheetView,
  type BottomSheetBackdropProps,
  type BottomSheetHandleProps,
} from "@gorhom/bottom-sheet";
import { createContext, useContext, useRef, type ReactNode, type ComponentType } from "react";
import { Pressable, Text, type PressableProps, type TextProps } from "react-native";

type SheetContextType = { ref: React.RefObject<GorhomBottomSheet | null> };
const SheetContext = createContext<SheetContextType>({ ref: { current: null } });

function BottomSheet({ children }: { children: ReactNode }) {
  const ref = useRef<GorhomBottomSheet>(null);
  return <SheetContext.Provider value={{ ref }}>{children}</SheetContext.Provider>;
}

function BottomSheetTrigger({ children, ...props }: PressableProps & { children: ReactNode }) {
  const { ref } = useContext(SheetContext);
  return (
    <Pressable {...props} onPress={() => ref.current?.expand()}>
      {children}
    </Pressable>
  );
}

type PortalProps = {
  children: ReactNode;
  snapPoints?: (string | number)[];
  backdropComponent?: ComponentType<BottomSheetBackdropProps>;
  handleComponent?: ComponentType<BottomSheetHandleProps>;
  className?: string;
};

function BottomSheetPortal({
  children,
  snapPoints = ["50%"],
  backdropComponent,
  handleComponent,
}: PortalProps) {
  const { ref } = useContext(SheetContext);
  return (
    <GorhomBottomSheet
      ref={ref}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose
      backdropComponent={backdropComponent}
      handleComponent={handleComponent}
    >
      {children}
    </GorhomBottomSheet>
  );
}

function BottomSheetContent({
  children,
  style,
}: {
  children: ReactNode;
  style?: object;
  className?: string;
}) {
  return <BottomSheetView style={style}>{children}</BottomSheetView>;
}

function BottomSheetDragIndicator(props: BottomSheetHandleProps) {
  return <BottomSheetHandle {...props} />;
}

function BottomSheetItem({ children, ...props }: PressableProps & { children: ReactNode }) {
  return <Pressable {...props}>{children}</Pressable>;
}

function BottomSheetItemText({ children, ...props }: TextProps & { children: ReactNode }) {
  return <Text {...props}>{children}</Text>;
}

export {
  BottomSheet,
  BottomSheetBackdrop,
  BottomSheetContent,
  BottomSheetDragIndicator,
  BottomSheetItem,
  BottomSheetItemText,
  BottomSheetPortal,
  BottomSheetTrigger,
};
