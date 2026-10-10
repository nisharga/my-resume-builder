import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { AlertCircle } from "lucide-react-native";
import { useTheme } from "@/src/context";
import { fontFamily } from "@/styles/theme";

interface ErrorMessageProps {
  error: any;
  onRetry?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ error, onRetry }) => {
  const { colors } = useTheme();

  const message =
    error?.data?.message || error?.error || "Something went wrong";

  return (
    <View style={styles.container}>
      <AlertCircle size={40} color={colors.error || "#FF5252"} />
      <Text style={[styles.text, { color: colors.text }]}>{message}</Text>

      {onRetry && (
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={onRetry}
        >
          <Text style={styles.buttonText}>Try Again</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ErrorMessage;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontFamily: fontFamily.medium,
    fontSize: 14,
    textAlign: "center",
    marginTop: 10,
    marginBottom: 15,
    opacity: 0.7,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  buttonText: {
    color: "#FFF",
    fontFamily: fontFamily.bold,
    fontSize: 14,
  },
});
