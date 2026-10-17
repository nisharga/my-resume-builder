import { useLogoutMutation } from "@/redux/api-queries/authApi";
import { toast } from "@/utils/toast";
import { useRouter } from "expo-router";
import { LogOut, X } from "lucide-react-native";
import { useState } from "react";
import { Modal, Pressable, Text, TouchableOpacity, View } from "react-native";

export default function LogoutButton() {
  const [visible, setVisible] = useState(false);
  const [logout] = useLogoutMutation();
  const router = useRouter();

  const handleLogout = async () => {
    setVisible(false);
    await logout();
    toast.info("You have been signed out.");
    router.replace("/(auth)/login");
  };

  return (
    <>
      {/* Trigger button */}
      <TouchableOpacity
        className="flex-row items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50 py-4"
        onPress={() => setVisible(true)}
        activeOpacity={0.75}
      >
        <LogOut size={18} color="#ef4444" strokeWidth={2} />
        <Text className="text-sm font-semibold text-red-500">Log Out</Text>
      </TouchableOpacity>

      {/* Confirm modal */}
      <Modal
        transparent
        animationType="fade"
        visible={visible}
        onRequestClose={() => setVisible(false)}
      >
        {/* Backdrop */}
        <Pressable
          className="flex-1 items-center justify-center bg-black/50 px-6"
          onPress={() => setVisible(false)}
        >
          {/* Card — stopPropagation prevents backdrop tap closing when tapping inside */}
          <Pressable
            className="w-full max-w-sm items-center rounded-2xl bg-white p-6"
            onPress={(e) => e.stopPropagation()}
          >
            {/* Close icon */}
            <Pressable
              className="absolute top-4 right-4 p-1"
              onPress={() => setVisible(false)}
              hitSlop={8}
            >
              <X size={18} color="#9ca3af" />
            </Pressable>

            {/* Icon badge */}
            <View className="mb-4 h-14 w-14 items-center justify-center rounded-full bg-red-50">
              <LogOut size={26} color="#ef4444" strokeWidth={2} />
            </View>

            {/* Heading */}
            <Text className="mb-1 text-lg font-semibold text-foreground">Log Out</Text>

            {/* Subtitle */}
            <Text className="mb-6 text-center text-sm text-muted-foreground">
              Are you sure you want to log out of your account?
            </Text>

            {/* Actions */}
            <View className="w-full flex-row gap-3">
              <Pressable
                className="flex-1 items-center rounded-xl border border-border py-3"
                onPress={() => setVisible(false)}
              >
                <Text className="text-sm font-medium text-foreground">Cancel</Text>
              </Pressable>

              <Pressable
                className="flex-1 items-center rounded-xl bg-red-500 py-3"
                onPress={handleLogout}
              >
                <Text className="text-sm font-semibold text-white">Log Out</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}
