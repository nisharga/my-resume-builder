import { Text } from "react-native";

export default function SectionLabel({ label }: { label: string }) {
  return (
    <Text
      className="mb-2 px-1 text-xs tracking-widest text-muted-foreground"
      style={{ fontFamily: "Poppins-SemiBold" }}
    >
      {label.toUpperCase()}
    </Text>
  );
}
