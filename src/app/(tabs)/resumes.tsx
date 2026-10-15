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

      <Text className="header-title bg-primary p-2">Header Title</Text>
      <Text className="bg-secondary text-body overline"> Overline</Text>
      <Text className="large-title bg-tertiary text-white!">#e4e6eb Large Title</Text>
      <Text className="section-title bg-link">#0e1117 Section Title</Text>

      <Text className="card-title">Card Title</Text>
      <Text className="body">Body text</Text>
      <Text className="small">Small text</Text>
      <Text className="meta">Meta text</Text>
      <Text className="caption">Caption text</Text>
      <Text className="link">Link text</Text>
      <Text className="btn-label">Button Label</Text>
      <Text className="tab-label">Tab Label</Text>
      <Text className="tab-label-active">Tab Label Active</Text>

      {/* ===== bg-background ===== */}
      <Text className="xss-normal bg-background p-2">xss-normal · bg-background</Text>
      <Text className="xs-normal bg-background p-2">xs-normal · bg-background</Text>
      <Text className="sm-normal bg-background p-2">sm-normal · bg-background</Text>
      <Text className="sm-normal-gray bg-background p-2">sm-normal-gray · bg-background</Text>
      <Text className="sm-normal-primary bg-background p-2">sm-normal-primary · bg-background</Text>
      <Text className="sm-gray bg-background p-2">sm-gray · bg-background</Text>
      <Text className="sm-medium bg-background p-2">sm-medium · bg-background</Text>
      <Text className="sm-semibold bg-background p-2">sm-semibold · bg-background</Text>
      <Text className="sm-bold bg-background p-2">sm-bold · bg-background</Text>
      <Text className="base-normal bg-background p-2">base-normal · bg-background</Text>
      <Text className="base-medium bg-background p-2">base-medium · bg-background</Text>
      <Text className="base-semibold bg-background p-2">base-semibold · bg-background</Text>
      <Text className="lg-normal bg-background p-2">lg-normal · bg-background</Text>
      <Text className="lg-medium bg-background p-2">lg-medium · bg-background</Text>
      <Text className="two-xl-medium bg-background p-2">two-xl-medium · bg-background</Text>

      {/* ===== bg-popover (cards, sheets, modals) ===== */}
      <Text className="xss-normal bg-popover p-2">xss-normal · bg-popover</Text>
      <Text className="xs-normal bg-popover p-2">xs-normal · bg-popover</Text>
      <Text className="sm-normal bg-popover p-2">sm-normal · bg-popover</Text>
      <Text className="sm-normal-gray bg-popover p-2">sm-normal-gray · bg-popover</Text>
      <Text className="sm-normal-primary bg-popover p-2">sm-normal-primary · bg-popover</Text>
      <Text className="sm-gray bg-popover p-2">sm-gray · bg-popover</Text>
      <Text className="sm-medium bg-popover p-2">sm-medium · bg-popover</Text>
      <Text className="sm-semibold bg-popover p-2">sm-semibold · bg-popover</Text>
      <Text className="sm-bold bg-popover p-2">sm-bold · bg-popover</Text>
      <Text className="base-normal bg-popover p-2">base-normal · bg-popover</Text>
      <Text className="base-medium bg-popover p-2">base-medium · bg-popover</Text>
      <Text className="base-semibold bg-popover p-2">base-semibold · bg-popover</Text>
      <Text className="lg-normal bg-popover p-2">lg-normal · bg-popover</Text>
      <Text className="lg-medium bg-popover p-2">lg-medium · bg-popover</Text>
      <Text className="two-xl-medium bg-popover p-2">two-xl-medium · bg-popover</Text>

      {/* ===== bg-secondary ===== */}
      <Text className="xss-normal bg-secondary p-2">xss-normal · bg-secondary</Text>
      <Text className="xs-normal bg-secondary p-2">xs-normal · bg-secondary</Text>
      <Text className="sm-normal bg-secondary p-2">sm-normal · bg-secondary</Text>
      <Text className="sm-normal-gray bg-secondary p-2">sm-normal-gray · bg-secondary</Text>
      <Text className="sm-normal-primary bg-secondary p-2">sm-normal-primary · bg-secondary</Text>
      <Text className="sm-gray bg-secondary p-2">sm-gray · bg-secondary</Text>
      <Text className="sm-medium bg-secondary p-2">sm-medium · bg-secondary</Text>
      <Text className="sm-semibold bg-secondary p-2">sm-semibold · bg-secondary</Text>
      <Text className="sm-bold bg-secondary p-2">sm-bold · bg-secondary</Text>
      <Text className="base-normal bg-secondary p-2">base-normal · bg-secondary</Text>
      <Text className="base-medium bg-secondary p-2">base-medium · bg-secondary</Text>
      <Text className="base-semibold bg-secondary p-2">base-semibold · bg-secondary</Text>
      <Text className="lg-normal bg-secondary p-2">lg-normal · bg-secondary</Text>
      <Text className="lg-medium bg-secondary p-2">lg-medium · bg-secondary</Text>
      <Text className="two-xl-medium bg-secondary p-2">two-xl-medium · bg-secondary</Text>

      {/* ===== bg-accent ===== */}
      <Text className="xss-normal bg-accent p-2">xss-normal · bg-accent</Text>
      <Text className="xs-normal bg-accent p-2">xs-normal · bg-accent</Text>
      <Text className="sm-normal bg-accent p-2">sm-normal · bg-accent</Text>
      <Text className="sm-normal-gray bg-accent p-2">sm-normal-gray · bg-accent</Text>
      <Text className="sm-normal-primary bg-accent p-2">sm-normal-primary · bg-accent</Text>
      <Text className="sm-gray bg-accent p-2">sm-gray · bg-accent</Text>
      <Text className="sm-medium bg-accent p-2">sm-medium · bg-accent</Text>
      <Text className="sm-semibold bg-accent p-2">sm-semibold · bg-accent</Text>
      <Text className="sm-bold bg-accent p-2">sm-bold · bg-accent</Text>
      <Text className="base-normal bg-accent p-2">base-normal · bg-accent</Text>
      <Text className="base-medium bg-accent p-2">base-medium · bg-accent</Text>
      <Text className="base-semibold bg-accent p-2">base-semibold · bg-accent</Text>
      <Text className="lg-normal bg-accent p-2">lg-normal · bg-accent</Text>
      <Text className="lg-medium bg-accent p-2">lg-medium · bg-accent</Text>
      <Text className="two-xl-medium bg-accent p-2">two-xl-medium · bg-accent</Text>

      {/* ===== Colored fills (with their matching text color) ===== */}
      <Text className="base-medium bg-primary p-2 text-primary-foreground">
        Primary button · bg-primary
      </Text>
      <Text className="sm-semibold bg-primary p-2 text-primary-foreground">
        Small button · bg-primary
      </Text>
      <Text className="xs-normal bg-success p-2 text-white">Success badge · bg-success</Text>
      <Text className="xs-normal bg-warning p-2 text-black">Warning badge · bg-warning</Text>
      <Text className="xs-normal bg-destructive p-2 text-white">Error badge · bg-destructive</Text>
      <Text className="sm-normal bg-muted p-2 text-white">Muted surface · bg-muted</Text>
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
