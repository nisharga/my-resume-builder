import { Button } from "@/components";
import { Header, Logo, Screen } from "@/components/core";
import { FormInput, FormTitle, OtpInput } from "../../components/form";
import { colors } from "@/styles/colors";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { Mail } from "lucide-react-native";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Pressable, Text, View } from "react-native";
import Animated, { FadeInRight, FadeOutLeft } from "react-native-reanimated";
import {
  STATIC_DEVICE_DETAILS,
  useLoginCustomerMutation,
  useVerifyOtpMutation,
} from "@/redux/api-queries/authApi";
import { toast } from "@/utils/toast";
import { forgotPasswordSchema, type ForgotPasswordFormData } from "./schemas";

type Step = "email" | "otp";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");

  const [loginCustomer, { isLoading: isSending }] = useLoginCustomerMutation();
  const [verifyOtp, { isLoading: isVerifying }] = useVerifyOtpMutation();

  const { control, handleSubmit } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onEmailSubmit = async (data: ForgotPasswordFormData) => {
    try {
      await loginCustomer({ email: data.email }).unwrap();
      setEmail(data.email);
      setOtp("");
      setOtpError("");
      setStep("otp");
      toast.success(`A login code was sent to ${data.email}`);
    } catch (err: any) {
      const message = err?.data?.message ?? "Failed to send code. Please try again.";
      toast.error(message);
    }
  };

  const onOtpSubmit = async () => {
    const clean = otp.replace(/ /g, "");
    if (clean.length < 4) {
      setOtpError("Please enter the complete 4-digit code");
      return;
    }
    setOtpError("");

    try {
      await verifyOtp({
        email,
        otp: clean,
        role: "CUSTOMER",
        forceLogin: true,
        deviceDetails: STATIC_DEVICE_DETAILS,
      }).unwrap();

      toast.success("You have successfully logged in.");
      router.replace("/(tabs)");
    } catch (err: any) {
      const message = err?.data?.message ?? "Invalid code. Please try again.";
      toast.error(message);
    }
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
              title="Sign In"
              subtitle="Enter your email and we'll send you a login code."
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
              <Button onPress={handleSubmit(onEmailSubmit)} disabled={isSending}>
                {isSending ? "Sending..." : "Send Code"}
              </Button>
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
              title="Enter Code"
              subtitle={
                <Text className="base-normal text-center">
                  We sent a 6-digit code to <Text className="sm-medium">{email}</Text>
                </Text>
              }
            />

            <OtpInput value={otp} onChange={setOtp} error={otpError} />

            <View className="mt-6">
              <Button onPress={onOtpSubmit} disabled={isVerifying}>
                {isVerifying ? "Verifying..." : "Verify Code"}
              </Button>
            </View>

            <View className="mt-6 flex-row justify-center gap-4">
              <Pressable onPress={() => setStep("email")}>
                <Text className="sm-medium">Change Email</Text>
              </Pressable>
              <Text className="sm-gray">·</Text>
              <Pressable
                onPress={() => {
                  setOtp("");
                  setOtpError("");
                  handleSubmit(onEmailSubmit)();
                }}
              >
                <Text className="sm-medium">Resend Code</Text>
              </Pressable>
            </View>
          </Animated.View>
        )}
      </View>
    </Screen>
  );
}
