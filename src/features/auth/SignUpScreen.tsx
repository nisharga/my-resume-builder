import { Button } from "@/components";
import { Header, Logo, Screen } from "@/components/core";
import { FormTitle, FormCheckbox, FormInput, FormPasswordInput } from "../../components/form";
import WebUrl from "@/components/common/WebUrl";
import {
  AUTH_EMAIL_LABEL,
  AUTH_EMAIL_PLACEHOLDER,
  AUTH_OR,
  AUTH_PASSWORD_LABEL,
  AUTH_PASSWORD_PLACEHOLDER,
  AUTH_SOCIAL_APPLE,
  AUTH_SOCIAL_GOOGLE,
  SIGNUP_BTN,
  SIGNUP_CONFIRM_PASSWORD_LABEL,
  SIGNUP_CONFIRM_PASSWORD_PLACEHOLDER,
  SIGNUP_HAS_ACCOUNT,
  SIGNUP_LOGIN_LINK,
  SIGNUP_PRIVACY_AND,
  SIGNUP_PRIVACY_LABEL,
  SIGNUP_PRIVACY_URL,
  SIGNUP_SUBTITLE,
  SIGNUP_TERMS_LABEL,
  SIGNUP_TERMS_PREFIX,
  SIGNUP_TERMS_URL,
  SIGNUP_TITLE,
} from "@/config/appConfig";
import { colors } from "@/styles/colors";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { Mail } from "lucide-react-native";
import { useForm } from "react-hook-form";
import { Pressable, Text, View } from "react-native";
import { signupSchema, type SignupFormData } from "./schemas";

export default function SignUpScreen() {
  const router = useRouter();

  const { control, handleSubmit } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: { email: "", password: "", confirmPassword: "", termsAccepted: false },
  });

  const onSubmit = async (data: SignupFormData) => {
    console.log("Sign up:", data);
  };

  return (
    <Screen>
      <Header title="" className="bg-secondary" />
      <View className="items-center py-4">
        <Logo />
      </View>

      <View className="flex-1 px-6 pt-2 pb-8">
        <FormTitle title={SIGNUP_TITLE} subtitle={SIGNUP_SUBTITLE} />

        {/* Form */}
        <View className="gap-4">
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

          <FormPasswordInput
            name="password"
            control={control}
            label={AUTH_PASSWORD_LABEL}
            placeholder={AUTH_PASSWORD_PLACEHOLDER}
          />

          <FormPasswordInput
            name="confirmPassword"
            control={control}
            label={SIGNUP_CONFIRM_PASSWORD_LABEL}
            placeholder={SIGNUP_CONFIRM_PASSWORD_PLACEHOLDER}
          />

          {/* Terms + privacy policy */}
          <FormCheckbox
            name="termsAccepted"
            control={control}
            label={
              <>
                <Text className="sm-gray">{SIGNUP_TERMS_PREFIX}</Text>
                <WebUrl
                  url={SIGNUP_TERMS_URL}
                  title={SIGNUP_TERMS_LABEL}
                  label={SIGNUP_TERMS_LABEL}
                />
                <Text className="sm-gray">{SIGNUP_PRIVACY_AND}</Text>
                <WebUrl
                  url={SIGNUP_PRIVACY_URL}
                  title={SIGNUP_PRIVACY_LABEL}
                  label={SIGNUP_PRIVACY_LABEL}
                />
              </>
            }
          />
        </View>

        {/* Submit */}
        <View className="mt-6">
          <Button onPress={handleSubmit(onSubmit)}>{SIGNUP_BTN}</Button>
        </View>

        {/* Divider */}
        <View className="my-6 flex-row items-center gap-3">
          <View className="h-px flex-1 bg-border" />
          <Text className="sm-gray">{AUTH_OR}</Text>
          <View className="h-px flex-1 bg-border" />
        </View>

        {/* Social buttons */}
        <View className="flex-row gap-3">
          <Pressable className="flex-1 flex-row items-center justify-center gap-2 rounded-xl border border-border bg-white py-3.5 active:opacity-70 dark:bg-secondary">
            <Text className="text-lg">G</Text>
            <Text className="sm-semibold">{AUTH_SOCIAL_GOOGLE}</Text>
          </Pressable>
          <Pressable className="flex-1 flex-row items-center justify-center gap-2 rounded-xl border border-border bg-white py-3.5 active:opacity-70 dark:bg-secondary">
            <Text className="text-lg"></Text>
            <Text className="sm-semibold">{AUTH_SOCIAL_APPLE}</Text>
          </Pressable>
        </View>

        {/* Log in link */}
        <View className="mt-auto pt-8">
          <Pressable onPress={() => router.push("/(auth)/login")}>
            <Text className="sm-gray text-center">
              {SIGNUP_HAS_ACCOUNT} <Text className="sm-medium">{SIGNUP_LOGIN_LINK}</Text>
            </Text>
          </Pressable>
        </View>
      </View>
    </Screen>
  );
}
