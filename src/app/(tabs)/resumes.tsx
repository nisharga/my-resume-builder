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
import { Button } from "../../components/core";
import { useState } from "react";
import { Icons } from "@/src/components/Icons";

export default function ResumesScreen() {
  const [loading, setLoading] = useState(false);
  return (
    <View style={styles.content}>
      <Text style={styles.title}>All CVs</Text>

      <BottomSheet>
        <BottomSheetTrigger className="bg-white">
          <Text>Open BottomSheet</Text>
        </BottomSheetTrigger>
        <BottomSheetPortal
          snapPoints={["25%", "50%"]}
          backdropComponent={BottomSheetBackdrop}
          handleComponent={BottomSheetDragIndicator}
          className="bg-transparent"
        >
          <BottomSheetContent className="bg-white">
            <BottomSheetItem className="bg-black">
              <BottomSheetItemText>Item 1</BottomSheetItemText>
            </BottomSheetItem>
            <BottomSheetItem className="bg-black">
              <BottomSheetItemText>Item 2</BottomSheetItemText>
            </BottomSheetItem>
            <BottomSheetItem className="bg-black">
              <BottomSheetItemText>Item 3</BottomSheetItemText>
            </BottomSheetItem>
          </BottomSheetContent>
        </BottomSheetPortal>
      </BottomSheet>

      <Button
        onPress={() => console.log("Clicked")}
        // innerClassName="rounded-[32px]" // or "rounded-4xl" if defined in tailwind.config.js
        // gradientColors={["#FF512F", "#DD2476"]}
        innerClassName="rounded-[2px]"
      >
        <Icons.Moon strokeWidth={1} className="stroke-amber-300 text-white" />
        <Text className="text-base text-white">Get Started</Text>
      </Button>
    </View>
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
