import { Button } from "@/components";
import { Header, Screen } from "@/components/core";
import { colors } from "@/styles/colors";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail } from "lucide-react-native";
import { useForm } from "react-hook-form";
import { Text, View } from "react-native";
import { FormInput } from "../../components/form";
import { forgotPasswordSchema, type ForgotPasswordFormData } from "./schemas";

export default function ForgotPasswordScreen() {
  const { control, handleSubmit } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = (data: ForgotPasswordFormData) => {
    console.log("Forgot password:", data);
  };

  return (
    <Screen>
      <Header title="" className="bg-secondary" />

      <View className="flex-1 px-6 pt-2 pb-8">
        {/* Title */}
        <View className="mb-8">
          <Text className="three-xl-medium mb-1">Forgot Password</Text>
          <Text className="base-normal">Enter your email and we will send you a reset code.</Text>
        </View>

        {/* Form */}
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

        {/* Submit */}
        <View className="mt-6">
          <Button onPress={handleSubmit(onSubmit)}>Send Code</Button>
        </View>
      </View>
    </Screen>
  );
}
