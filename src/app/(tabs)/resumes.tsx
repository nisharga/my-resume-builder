import { StyleSheet, Text, View } from "react-native";

export default function ResumesScreen() {
  return (
    <View style={styles.content}>
      <Text style={styles.title}>All CVs</Text>
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
