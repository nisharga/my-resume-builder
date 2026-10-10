import { useLanguage, useTheme } from "@/src/context";
import { spacing } from "@/styles/theme";
import { ArrowLeft } from "lucide-react-native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const ComponentHeader = ({
  title,
  onSeeAll,
  showSeeAll = true,
  onBack,
}: any) => {
  const { colors } = useTheme();
  const { t } = useLanguage();

  return (
    <View style={styles(colors).container}>
      <View style={styles(colors).leftContent}>
        {onBack && (
          <TouchableOpacity onPress={onBack} style={styles(colors).backButton}>
            <ArrowLeft size={24} color={colors.text.primary} />
          </TouchableOpacity>
        )}
        <Text
          numberOfLines={1}
          style={[styles(colors).title, onBack && styles(colors).titleWithBack]}
        >
          {title}
        </Text>
      </View>

      {showSeeAll && !onBack && (
        <TouchableOpacity onPress={onSeeAll} activeOpacity={0.7}>
          <Text style={styles(colors).seeAll}>{t("viewAll") || "See all"}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ComponentHeader;

const styles = (colors: any) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      backgroundColor: "transparent",
    },
    leftContent: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    title: {
      fontSize: 22,
      fontFamily: "Poppins-Bold",
      color: colors.text.primary,
      letterSpacing: 0.5,
      includeFontPadding: false,
      lineHeight: 28,
    },
    titleWithBack: {
      marginLeft: spacing.xs,
    },
    backButton: {
      padding: spacing.xs,
    },
    seeAll: {
      fontSize: 14,
      fontFamily: "Poppins-Medium",
      color: colors.primary,
      marginLeft: spacing.sm,
    },
  });
