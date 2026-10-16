import {
  BottomSheet,
  BottomSheetBackdrop,
  BottomSheetContent,
  BottomSheetDragIndicator,
  BottomSheetItem,
  BottomSheetItemText,
  BottomSheetPortal,
  BottomSheetTrigger,
} from "@/components/ui/bottomsheet";
import { StyleSheet, Text, View } from "react-native";
import { Button, Header, Screen } from "@/components/core";
import { useState } from "react";
import { Icons } from "@/components/Icons";

export default function ResumesScreen() {
  const [loading, setLoading] = useState(false);
  return (
    <Screen className="px-2">
      <Header
        title="Resume"
        sticky={true}
        className="z-20 mb-4 border-b-2 bg-transparent"
        right={<Icons.ArrowRight />}
        onRightPress={() => console.log("Right Press")}
      />
      <Text style={styles.title}>All CVs</Text>
      <Text style={styles.title}>All CVs</Text>
      <Text style={styles.title}>All CVs</Text>
      <Text style={styles.title}>All CVs</Text>
      <Text style={styles.title}>All CVs</Text>
      <Text style={styles.title}>All CVs</Text>
      <Text style={styles.title}>All CVs</Text>
      <Text style={styles.title}>All CVs</Text>
      <Text style={styles.title}>All CVs</Text>
      <Text style={styles.title}>All CVs</Text>
      <Text style={styles.title}>All CVs</Text>
      <Text style={styles.title}>All CVs</Text>
      <Text style={styles.title}>All CVs</Text>
      <Text style={styles.title}>All CVs</Text>
      <Text style={styles.title}>All CVs</Text>
      <Text style={styles.title}>All CVs</Text>
      <Text style={styles.title}>All CVs</Text>
      <Text style={styles.title}>All CVs</Text>
      <Text style={styles.title}>All CVs</Text>
      <Text style={styles.title}>All CVs</Text>
      <Text style={styles.title}>All CVs</Text>
      <Text style={styles.title}>All CVs</Text>
      <Text style={styles.title}>All CVs</Text>
      <Text style={styles.title}>All CVs</Text>
      <Text style={styles.title}>All CVs</Text>
      <Text style={styles.title}>All CVs</Text>
      <Text style={styles.title}>All CVs</Text>
      <Text style={styles.title}>All CVs</Text>
      <Text style={styles.title}>All CVs</Text>
      <Text style={styles.title}>All CVs</Text>
      <Text style={styles.title}>All CVs</Text>
      <Text style={styles.title}>All CVs</Text>
      <Text style={styles.title}>All CVs</Text>
      <Text style={styles.title}>All CVs</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
  },
});
