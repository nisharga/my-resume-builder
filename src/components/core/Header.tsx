import type { ReactNode } from "react";
import { Text, View } from "react-native";

type Props = {
  title?: string;
  /** Left slot — typically a back button or logo */
  left?: ReactNode;
  /** Right slot — typically an action button */
  right?: ReactNode;
  /** Show a bottom border (default: true) */
  border?: boolean;
  className?: string;
};

/**
 * Page-level navigation header.
 *
 * Usage inside Screen:
 *   <Screen header={<Header title="Resume" right={<ShareButton />} />} scroll>
 *
 * Usage as a sticky scroll child (pass its index via stickyHeaderIndices):
 *   <Screen scroll stickyHeaderIndices={[0]}>
 *     <Header title="Stats" sticky />
 *     ...content
 *   </Screen>
 */
export default function Header({ title, left, right, border = true, className = "" }: Props) {
  return (
    <View
      className={`flex-row items-center bg-background px-4 py-3 ${
        border ? "border-b border-border" : ""
      } ${className}`}
    >
      {/* Left slot — fixed width keeps title centred */}
      <View className="w-10">{left}</View>

      {/* Title — fills remaining space, centred */}
      <View className="flex-1 items-center">
        {title ? <Text className="header-title text-foreground">{title}</Text> : null}
      </View>

      {/* Right slot — fixed width mirrors left */}
      <View className="w-10 items-end">{right}</View>
    </View>
  );
}
