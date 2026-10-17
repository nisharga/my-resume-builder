import { Button } from "@/components";
import { Header, Logo, Screen } from "@/components/core";
import { FormInput, FormTitle, OtpInput } from "../../components/form";
import {
  AUTH_EMAIL_LABEL,
  AUTH_EMAIL_PLACEHOLDER,
  FORGOT_BTN_SEND,
  FORGOT_BTN_SENDING,
  FORGOT_BTN_VERIFY,
  FORGOT_BTN_VERIFYING,
  FORGOT_CHANGE_EMAIL,
  FORGOT_EMAIL_SUBTITLE,
  FORGOT_EMAIL_TITLE,
  FORGOT_OTP_ERROR,
  FORGOT_OTP_SUBTITLE,
  FORGOT_OTP_TITLE,
  FORGOT_RESEND_CODE,
  FORGOT_TOAST_CODE_SENT,
  FORGOT_TOAST_LOGIN_SUCCESS,
  FORGOT_TOAST_SEND_FAILED,
  FORGOT_TOAST_VERIFY_FAILED,
} from "@/config/appConfig";
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
      toast.success(FORGOT_TOAST_CODE_SENT(data.email));
    } catch (err: any) {
      const message = err?.data?.message ?? FORGOT_TOAST_SEND_FAILED;
      toast.error(message);
    }
  };

  const onOtpSubmit = async () => {
    const clean = otp.replace(/ /g, "");
    if (clean.length < 4) {
      setOtpError(FORGOT_OTP_ERROR);
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

      toast.success(FORGOT_TOAST_LOGIN_SUCCESS);
      router.replace("/(tabs)");
    } catch (err: any) {
      const message = err?.data?.message ?? FORGOT_TOAST_VERIFY_FAILED;
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
            <FormTitle title={FORGOT_EMAIL_TITLE} subtitle={FORGOT_EMAIL_SUBTITLE} />

            <FormInput
              name="email"
              control={control}
              label={AUTH_EMAIL_LABEL}
              placeholder={AUTH_EMAIL_PLACEHOLDER}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              leftIcon={<Mail size={18} color={colors.subtleForeground} />}
            />

            <View className="mt-6">
              <Button onPress={handleSubmit(onEmailSubmit)} disabled={isSending}>
                {isSending ? FORGOT_BTN_SENDING : FORGOT_BTN_SEND}
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
              title={FORGOT_OTP_TITLE}
              subtitle={
                <Text className="base-normal text-center">
                  {FORGOT_OTP_SUBTITLE} <Text className="sm-medium">{email}</Text>
                </Text>
              }
            />

            <OtpInput value={otp} onChange={setOtp} error={otpError} />

            <View className="mt-6">
              <Button onPress={onOtpSubmit} disabled={isVerifying}>
                {isVerifying ? FORGOT_BTN_VERIFYING : FORGOT_BTN_VERIFY}
              </Button>
            </View>

            <View className="mt-6 flex-row justify-center gap-4">
              <Pressable onPress={() => setStep("email")}>
                <Text className="sm-medium">{FORGOT_CHANGE_EMAIL}</Text>
              </Pressable>
              <Text className="sm-gray">·</Text>
              <Pressable
                onPress={() => {
                  setOtp("");
                  setOtpError("");
                  handleSubmit(onEmailSubmit)();
                }}
              >
                <Text className="sm-medium">{FORGOT_RESEND_CODE}</Text>
              </Pressable>
            </View>
          </Animated.View>
        )}
      </View>
    </Screen>
  );
}
