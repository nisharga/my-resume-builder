import { useLanguage } from "@/src/context";
import { colors } from "@/styles/theme";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

const WebUrl = ({
  url,
  title,
  label,
}: {
  url: string;
  title: string;
  label: string;
}) => {
  const { t } = useLanguage();
  const router = useRouter();
  return (
    <TouchableOpacity
      onPress={() => {
        router.push({
          pathname: "/webview", // Absolute path to app/webview.tsx
          params: {
            url: url,
            title: title,
          },
        });
      }}
    >
      <Text style={[styles.footerLink, { color: colors.primary }]}>
        {" "}
        {label}{" "}
      </Text>
    </TouchableOpacity>
  );
};

export default WebUrl;

const styles = StyleSheet.create({
  footerLink: {
    fontSize: 12,
    fontFamily: "Poppins-SemiBold",
  },
});
