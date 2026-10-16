import type { ReactNode } from "react";
import { ScrollView, View } from "react-native";
import { StatusBar, type StatusBarStyle } from "expo-status-bar";
import { SafeAreaView, type Edge } from "react-native-safe-area-context";

type Props = {
  children: ReactNode;
  className?: string;
  scroll?: boolean;
  header?: ReactNode;
  footer?: ReactNode;
  stickyHeaderIndices?: number[];
  statusBar?: StatusBarStyle;
  edges?: Edge[];
};

export default function Screen({
  children,
  className = "",
  scroll = false,
  header,
  footer,
  stickyHeaderIndices,
  statusBar = "dark",
  edges = ["top", "bottom"],
}: Props) {
  return (
    <SafeAreaView edges={edges} className={`flex-1 ${className}`}>
      <StatusBar style={statusBar} />
      {header}
      {scroll ? (
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
          stickyHeaderIndices={stickyHeaderIndices}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      ) : (
        <View className="flex-1">{children}</View>
      )}
      {footer}
    </SafeAreaView>
  );
}
