import { Button, ButtonText } from "@/components/ui/button";
import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { Input, InputField } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import { LucideSalad } from "lucide-react-native";
import { Controller, useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { z } from "zod";

// 1. Validation Schema
const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function HomeScreen() {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Submit Handler — logs data to console when valid
  const onSubmit = (data: LoginFormData) => {
    console.log("Form Data:", data);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.formContainer}>
            <Text style={styles.title}>Login</Text>

            {/* Email Input */}
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <FormControl
                  isInvalid={Boolean(errors.email)}
                  style={styles.formControl}
                >
                  <FormControlLabel>
                    <FormControlLabelText className="text-base font-normal text-[#111000]/80">
                      Email
                    </FormControlLabelText>
                  </FormControlLabel>
                  <Input className="flex flex-row justify-center items-center">
                    <LucideSalad color="#009989" />
                    <InputField
                      placeholder="Enter your email"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                    />
                  </Input>

                  {errors.email?.message ? (
                    <FormControlError>
                      <FormControlErrorText>
                        {errors.email.message}
                      </FormControlErrorText>
                    </FormControlError>
                  ) : null}
                </FormControl>
              )}
            />

            {/* Password Input */}
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <FormControl
                  isInvalid={Boolean(errors.password)}
                  style={styles.formControl}
                >
                  <FormControlLabel>
                    <FormControlLabelText>Password</FormControlLabelText>
                  </FormControlLabel>
                  <Input>
                    <InputField
                      placeholder="Enter your password"
                      secureTextEntry
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                    />
                  </Input>

                  {errors.password?.message ? (
                    <FormControlError>
                      <FormControlErrorText>
                        {errors.password.message}
                      </FormControlErrorText>
                    </FormControlError>
                  ) : null}
                </FormControl>
              )}
            />

            {/* Submit Button */}
            <Button
              style={styles.button}
              disabled={isSubmitting}
              onPress={handleSubmit(onSubmit)}
            >
              {isSubmitting ? (
                <Spinner size="small" color="#FFFFFF" />
              ) : (
                <ButtonText>Submit</ButtonText>
              )}
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  formContainer: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 24,
  },
  formControl: {
    marginBottom: 16,
  },
  button: {
    marginTop: 12,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },
});
