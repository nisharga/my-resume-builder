import { Tabs } from "expo-router";
import {
  FileText,
  Home,
  LayoutTemplate,
  Plus,
  User,
} from "lucide-react-native";
import { Platform, StyleSheet, View } from "react-native";

const PRIMARY = "#ff0000";

function ElevatedPlusIcon() {
  return (
    <View style={styles.plusWrapper}>
      <Plus size={26} color="#FFFFFF" strokeWidth={2.5} />
    </View>
  );
}

const TAB_BAR_HEIGHT = Platform.OS === "ios" ? 82 : 108;

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: PRIMARY,
        tabBarInactiveTintColor: "#9CA3AF",
        tabBarStyle: styles.tabBar,
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
          tabBarIcon: ({ color, size }) => (
            <FileText size={size} color={color} />
          ),
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
  tabBar: {
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    height: TAB_BAR_HEIGHT,
    paddingTop: 8,
    // Extra bottom gap for Android gesture nav bar
    paddingBottom: Platform.OS === "ios" ? 0 : 14,
    overflow: "visible", // Required so the elevated button renders above the bar
  },
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
    // Pulls the circle up above the tab bar
    marginTop: -40,
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
});
