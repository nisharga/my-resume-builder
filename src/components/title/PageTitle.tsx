import React from "react";
import { View, Text, StyleSheet, ViewStyle } from "react-native";
import { type LucideIcon } from "lucide-react-native";
import { useTheme } from "@/src/context";
import { fontFamily } from "@/src/theme";

interface PageTitleProps {
  title: string;
  Icon?: LucideIcon;
  containerStyle?: ViewStyle;
}

const PageTitle: React.FC<PageTitleProps> = ({ title, Icon, containerStyle }) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.headerArea, containerStyle]}>
      <View style={styles.headerLeft}>
        {Icon && (
          <View style={[styles.headerIconBg, { backgroundColor: colors.primary + "14" }]}>
            <Icon size={20} color={colors.primary} />
          </View>
        )}
        <Text style={[styles.headerTitle, { color: colors.text }]}>{title}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerArea: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 10,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  headerIconBg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 26,
    fontFamily: fontFamily.bold,
    letterSpacing: -0.5,
  },
});

export default PageTitle;
