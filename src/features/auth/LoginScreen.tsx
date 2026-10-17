import { Button } from "@/components";
import { Header, Logo, Screen } from "@/components/core";
import { FormTitle, FormInput, FormPasswordInput } from "../../components/form";
import { colors } from "@/styles/colors";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { Mail } from "lucide-react-native";
import { useForm } from "react-hook-form";
import { Pressable, Text, View } from "react-native";
import { loginSchema, type LoginFormData } from "./schemas";

export default function LoginScreen() {
  const router = useRouter();

  const { control, handleSubmit } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginFormData) => {
    console.log("Login:", data);
  };

  return (
    <Screen>
      <Header title="" className="opacity-0" />
      <View className="items-center py-4">
        <Logo />
      </View>

      <View className="flex-1 px-6 pt-2 pb-8">
        <FormTitle title="Welcome Back" subtitle="Login to access your resume builder." />

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

          {/* Forgot password */}
          <Pressable onPress={() => router.push("/(auth)/forgot-password")} className="self-end">
            <Text className="sm-medium">Forgot Password?</Text>
          </Pressable>
        </View>

        {/* Submit */}
        <View className="mt-6">
          <Button onPress={handleSubmit(onSubmit)}>Log In</Button>
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

        {/* Footer */}
        <View className="mt-auto items-center gap-2 pt-8">
          <Pressable onPress={() => router.push("/(auth)/signup")}>
            <Text className="sm-gray">
              Don&apos;t have an account? <Text className="sm-medium">Create one</Text>
            </Text>
          </Pressable>
        </View>
      </View>
    </Screen>
  );
}
