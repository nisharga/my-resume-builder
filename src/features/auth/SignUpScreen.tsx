import { Button } from "@/components";
import { Header, Screen } from "@/components/core";
import WebUrl from "@/components/common/WebUrl";
import { colors } from "@/styles/colors";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { Mail } from "lucide-react-native";
import { useForm } from "react-hook-form";
import { Pressable, Text, View } from "react-native";
import { FormCheckbox, FormInput, FormPasswordInput } from "../../components/form";
import { signupSchema, type SignupFormData } from "./schemas";
import { setAuthToken } from "./storageAuth";

export default function SignUpScreen() {
  const router = useRouter();

  const { control, handleSubmit } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: { email: "", password: "", confirmPassword: "", termsAccepted: false },
  });

  const onSubmit = async (data: SignupFormData) => {
    console.log("Sign up:", data);
    await setAuthToken("mock-token");
    router.replace("/(tabs)");
  };

  return (
    <Screen>
      <Header title="" className="bg-secondary" />

      <View className="flex-1 px-6 pt-2 pb-8">
        {/* Title */}
        <View className="mb-8">
          <Text className="three-xl-medium mb-1">Create Account</Text>
          <Text className="base-normal">Create your account to get started.</Text>
        </View>

        {/* Form */}
        <View className="gap-4">
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

          <FormPasswordInput
            name="password"
            control={control}
            label="Password"
            placeholder="Enter your password"
          />

          <FormPasswordInput
            name="confirmPassword"
            control={control}
            label="Confirm Password"
            placeholder="Confirm your password"
          />

          {/* Terms + privacy policy */}
          <FormCheckbox
            name="termsAccepted"
            control={control}
            label={
              <>
                <Text className="sm-gray">I agree to the </Text>
                <WebUrl
                  url="https://example.com/terms"
                  title="Terms and Conditions"
                  label="Terms and Conditions"
                />
                <Text className="sm-gray"> and </Text>
                <WebUrl
                  url="https://example.com/privacy"
                  title="Privacy Policy"
                  label="Privacy Policy"
                />
              </>
            }
          />
        </View>

        {/* Submit */}
        <View className="mt-6">
          <Button onPress={handleSubmit(onSubmit)}>Create Account</Button>
        </View>

        {/* Divider */}
        <View className="my-6 flex-row items-center gap-3">
          <View className="h-px flex-1 bg-border" />
          <Text className="sm-gray">Or</Text>
          <View className="h-px flex-1 bg-border" />
        </View>

        {/* Social buttons */}
        <View className="flex-row gap-3">
          <Pressable className="flex-1 flex-row items-center justify-center gap-2 rounded-xl border border-border bg-white py-3.5 active:opacity-70 dark:bg-secondary">
            <Text className="text-lg">G</Text>
            <Text className="sm-semibold">Google</Text>
          </Pressable>
          <Pressable className="flex-1 flex-row items-center justify-center gap-2 rounded-xl border border-border bg-white py-3.5 active:opacity-70 dark:bg-secondary">
            <Text className="text-lg"></Text>
            <Text className="sm-semibold">Apple</Text>
          </Pressable>
        </View>

        {/* Log in link */}
        <View className="mt-auto pt-8">
          <Pressable onPress={() => router.push("/(auth)/login")}>
            <Text className="sm-gray text-center">
              Already have an account? <Text className="sm-medium">Log in</Text>
            </Text>
          </Pressable>
        </View>
      </View>
    </Screen>
  );
}
