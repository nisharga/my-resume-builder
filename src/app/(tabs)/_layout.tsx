import { Tabs } from "expo-router";
import { FileText, Home, LayoutTemplate, Plus, User } from "lucide-react-native";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const PRIMARY = "#ff0000";

// Fixed content height: icon (24) + label (11) + gaps (~23) = 58
const CONTENT_HEIGHT = 58;

function ElevatedPlusIcon() {
  return (
    <View style={styles.plusWrapper}>
      <Plus size={26} color="#FFFFFF" strokeWidth={2.5} />
    </View>
  );
}

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  // Adapts to every Android nav mode and iOS home indicator automatically:
  // - Emulator 3-button nav  → insets.bottom ≈ 48 → height = 106
  // - Phone gesture nav      → insets.bottom ≈ 16 → height = 74
  // - iPhone home indicator  → insets.bottom ≈ 34 → height = 92
  const tabBarHeight = CONTENT_HEIGHT + insets.bottom;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: PRIMARY,
        tabBarInactiveTintColor: "#9CA3AF",
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopWidth: 1,
          borderTopColor: "#E5E7EB",
          height: tabBarHeight,
          paddingTop: 8,
          // Setting paddingBottom = insets.bottom tells React Navigation
          // we already handled the inset — it won't add another layer on top
          paddingBottom: insets.bottom,
          overflow: "visible",
        },
        tabBarLabelStyle: styles.label,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />

      <Tabs.Screen
        name="templates"
        options={{
          title: "Templates",
          tabBarIcon: ({ color, size }) => (
            <LayoutTemplate size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="create-resume"
        options={{
          title: "",
          tabBarIcon: () => <ElevatedPlusIcon />,
        }}
      />

      <Tabs.Screen
        name="resumes"
        options={{
          title: "My CV",
          tabBarIcon: ({ color, size }) => <FileText size={size} color={color} />,
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 11,
    fontWeight: "500",
    marginTop: 2,
  },
  plusWrapper: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: PRIMARY,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -40,
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
});
