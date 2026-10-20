import { Platform, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function AndroidNavSpacer() {
  const { bottom } = useSafeAreaInsets();
  console.log("bottom", bottom);

  if (Platform.OS !== "android" || bottom === 0) return null;

  return <View style={{ height: bottom }} />;
}
