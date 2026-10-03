import { useTheme } from "./ThemeContext";
import React, { createContext, useContext, useState, useCallback, useMemo } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ToastContextType {
  showToast: (title: string, message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { colors } = useTheme();
  const [visible, setVisible] = useState(false);
  const [content, setContent] = useState({ title: "", message: "" });

  const hideToast = useCallback(() => setVisible(false), []);

  const showToast = useCallback((title: string, message: string) => {
    setContent({ title, message });
    setVisible(true);

    // Auto-hide after 4 seconds (standard for toasts with buttons)
    const timer = setTimeout(() => {
      setVisible(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        overlay: {
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          justifyContent: "center",
          alignItems: "center",
        },
        container: {
          width: "80%",
          backgroundColor: colors.surface,
          borderRadius: 16,
          padding: 24,
          alignItems: "center",
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 12,
          elevation: 8,
          borderWidth: 1,
          borderColor: colors.border,
        },
        title: {
          fontFamily: "Poppins-Bold",
          fontSize: 18,
          marginBottom: 12,
          color: colors.text.primary,
          textAlign: "center",
        },
        message: {
          fontFamily: "Poppins-Regular",
          fontSize: 15,
          color: colors.text.secondary,
          marginBottom: 24,
          textAlign: "center",
          lineHeight: 22,
        },
        actions: {
          flexDirection: "row",
          justifyContent: "flex-end", // Centered button for Toast
          width: "100%",
        },
        button: {
          paddingVertical: 10,
          paddingHorizontal: 16,
          borderRadius: 8,
          justifyContent: "center",
          alignItems: "center",
          minWidth: 80,
          backgroundColor: colors.primary,
        },
        buttonText: {
          color: colors.text.white,
          fontFamily: "Poppins-SemiBold",
          fontSize: 14,
        },
      }),
    [colors],
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Modal visible={visible} transparent animationType="fade" onRequestClose={hideToast}>
        <View style={styles.overlay}>
          <View style={styles.container}>
            {content.title ? <Text style={styles.title}>{content.title}</Text> : null}
            <Text style={styles.message}>{content.message}</Text>

            <View style={styles.actions}>
              <TouchableOpacity style={styles.button} onPress={hideToast}>
                <Text style={styles.buttonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context.showToast;
};
