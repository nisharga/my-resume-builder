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

export default function ResumesScreen() {
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
