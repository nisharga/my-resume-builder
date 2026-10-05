import { Tabs } from "expo-router";
import {
  FileText,
  Home,
  LayoutTemplate,
  LucideIcon,
  Plus,
  User,
} from "lucide-react-native";
import { Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const PRIMARY = "#0000ff";

const CONTENT_HEIGHT = 58;

function NoRippleTabButton(props: any) {
  return <Pressable {...props} android_ripple={null} style={props.style} />;
}

function ElevatedPlusIcon() {
  return (
    <View style={styles.plusWrapper}>
      <Plus size={26} color="#FFFFFF" strokeWidth={2.5} />
    </View>
  );
}

type TabConfig = {
  name: string;
  title: string;
  icon?: LucideIcon;
  isCenter?: boolean; // the elevated "+" button
};

export const TABS: TabConfig[] = [
  { name: "index", title: "Home", icon: Home },
  { name: "templates", title: "Templates", icon: LayoutTemplate },
  { name: "create-resume", title: "", isCenter: true },
  { name: "resumes", title: "My CV", icon: FileText },
  { name: "profile", title: "Profile", icon: User },
];

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = CONTENT_HEIGHT + insets.bottom;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: PRIMARY,
        tabBarInactiveTintColor: "#9CA3AF",
        tabBarButton: NoRippleTabButton,
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopWidth: 1,
          borderTopColor: "#E5E7EB",
          height: tabBarHeight,
          paddingTop: 8,
          paddingBottom: insets.bottom,
          overflow: "visible",
        },
        tabBarLabelStyle: styles.label,
      }}
    >
      {TABS.map(({ name, title, icon: Icon, isCenter }) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            title,
            tabBarIcon: ({ color, size }) =>
              isCenter ? (
                <ElevatedPlusIcon />
              ) : Icon ? (
                <Icon size={size} color={color} />
              ) : null,
          }}
        />
      ))}
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
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: PRIMARY,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -40,
    borderColor: "white",
    borderWidth: 4,
  },
});
