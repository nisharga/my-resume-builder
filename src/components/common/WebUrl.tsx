import { fontFamilyTheme } from "@/styles";
import { colors } from "@/styles/colors";
import * as WebBrowser from "expo-web-browser";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

const WebUrl = ({ url, title: _title, label }: { url: string; title: string; label: string }) => (
  <TouchableOpacity onPress={() => WebBrowser.openBrowserAsync(url)}>
    <Text style={[styles.link, { color: colors.primary }]}>{label}</Text>
  </TouchableOpacity>
);

export default WebUrl;

const styles = StyleSheet.create({
  link: {
    fontSize: 12,
    fontFamily: fontFamilyTheme.semiBold,
  },
});
