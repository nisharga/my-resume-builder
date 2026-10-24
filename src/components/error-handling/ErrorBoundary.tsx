import * as Sentry from "@sentry/react-native";
import React from "react";
import { Pressable, Text, View } from "react-native";

interface Props {
  children: React.ReactNode;
  /** Render a custom fallback instead of the default error screen. */
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false, errorMessage: "" };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorMessage: error.message };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    Sentry.captureException(error, {
      extra: { componentStack: info.componentStack ?? "" },
    });
  }

  reset = (): void => {
    this.setState({ hasError: false, errorMessage: "" });
  };

  render() {
    if (!this.state.hasError) return this.props.children;
    if (this.props.fallback) return this.props.fallback;

    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          padding: 32,
          backgroundColor: "#f8f9fb",
        }}
      >
        {/* Icon placeholder */}
        <View
          style={{
            width: 64,
            height: 64,
            borderRadius: 20,
            backgroundColor: "#fee2e2",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 20,
          }}
        >
          <Text style={{ fontSize: 28 }}>⚠️</Text>
        </View>

        <Text
          style={{
            fontFamily: "Poppins-SemiBold",
            fontSize: 18,
            color: "#1a1f36",
            marginBottom: 8,
            textAlign: "center",
          }}
        >
          Something went wrong
        </Text>

        <Text
          style={{
            fontFamily: "Poppins-Regular",
            fontSize: 13,
            color: "#6b7280",
            textAlign: "center",
            lineHeight: 20,
            marginBottom: 28,
          }}
        >
          An unexpected error occurred. The issue has been reported automatically and we will look
          into it.
        </Text>

        <Pressable
          onPress={this.reset}
          style={({ pressed }) => ({
            backgroundColor: pressed ? "#4f46e5" : "#6366f1",
            paddingVertical: 14,
            paddingHorizontal: 36,
            borderRadius: 14,
          })}
        >
          <Text style={{ fontFamily: "Poppins-SemiBold", fontSize: 14, color: "#fff" }}>
            Try Again
          </Text>
        </Pressable>
      </View>
    );
  }
}
