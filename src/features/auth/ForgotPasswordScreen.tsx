import { Button } from "@/components";
import { Header, Logo, Screen } from "@/components/core";
import { FormTitle, FormInput, OtpInput } from "../../components/form";
import { colors } from "@/styles/colors";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail } from "lucide-react-native";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Pressable, Text, View } from "react-native";
import Animated, { FadeInRight, FadeOutLeft } from "react-native-reanimated";
import { forgotPasswordSchema, type ForgotPasswordFormData } from "./schemas";

type Step = "email" | "otp";

export default function ForgotPasswordScreen() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");

  const { control, handleSubmit } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onEmailSubmit = (data: ForgotPasswordFormData) => {
    console.log("Send OTP to:", data.email);
    setEmail(data.email);
    setOtp("");
    setOtpError("");
    setStep("otp");
  };

  const onOtpSubmit = () => {
    if (otp.replace(/ /g, "").length < 6) {
      setOtpError("Please enter the complete 6-digit code");
      return;
    }
    setOtpError("");
    console.log("Verify OTP:", { email, otp });
  };

  return (
    <Screen>
      <Header title="" className="bg-secondary" />
      <View className="items-center py-4">
        <Logo />
      </View>

      <View className="flex-1 px-6 pt-2 pb-8">
        {step === "email" ? (
          <Animated.View
            key="email"
            entering={FadeInRight.duration(300)}
            exiting={FadeOutLeft.duration(200)}
            style={{ flex: 1 }}
          >
            <FormTitle
              title="Forgot Password"
              subtitle="Enter your email and we'll send you a reset code."
            />

            <FormInput
              name="email"
              control={control}
              label="Email"
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              leftIcon={<Mail size={18} color={colors.subtleForeground} />}
            />

            <View className="mt-6">
              <Button onPress={handleSubmit(onEmailSubmit)}>Send Code</Button>
            </View>
          </Animated.View>
        ) : (
          <Animated.View
            key="otp"
            entering={FadeInRight.duration(300)}
            exiting={FadeOutLeft.duration(200)}
            style={{ flex: 1 }}
          >
            <FormTitle
              title="Enter OTP"
              subtitle={
                <Text className="base-normal text-center">
                  We sent a 6-digit code to <Text className="sm-medium">{email}</Text>
                </Text>
              }
            />

            <OtpInput value={otp} onChange={setOtp} error={otpError} />

            <View className="mt-6">
              <Button onPress={onOtpSubmit}>Verify Code</Button>
            </View>

            {/* Change email / resend */}
            <View className="mt-6 flex-row justify-center gap-4">
              <Pressable onPress={() => setStep("email")}>
                <Text className="sm-medium">Change Email</Text>
              </Pressable>
              <Text className="sm-gray">·</Text>
              <Pressable onPress={() => console.log("Resend OTP to:", email)}>
                <Text className="sm-medium">Resend Code</Text>
              </Pressable>
            </View>
          </Animated.View>
        )}
      </View>
    </Screen>
  );
}
