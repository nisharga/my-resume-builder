import type { ReactNode } from "react";
import { Text, View } from "react-native";

type Props = {
  title: string;
  children: ReactNode;
  className?: string;
};

/**
 * Labelled content block used to group related items on a page.
 *
 * Usage:
 *   <Section title="Experience">
 *     <ExperienceCard ... />
 *   </Section>
 */
export default function Section({ title, children, className = "" }: Props) {
  return (
    <View className={`mb-6 px-4 ${className}`}>
      <Text className="mb-3 text-lg font-bold text-heading">{title}</Text>
      {children}
    </View>
  );
}
