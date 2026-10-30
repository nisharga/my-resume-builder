import { colors } from "@/styles/colors";
import { Tabs } from "expo-router";
import { FileText, Home, LayoutTemplate, LucideIcon, Plus, Settings } from "lucide-react-native";
import { Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const CONTENT_HEIGHT = 64;

function NoRippleTabButton(props: any) {
  return <Pressable {...props} android_ripple={null} style={props.style} />;
}

function ElevatedPlusIcon() {
  return (
    <View style={styles.plusWrapper}>
      <Plus size={26} color={colors.white} strokeWidth={2.5} />
    </View>
  );
}

type TabConfig = {
  name: string;
  title: string;
  icon?: LucideIcon;
  isCenter?: boolean;
};

export const TABS: TabConfig[] = [
  { name: "index", title: "Home", icon: Home },
  { name: "templates", title: "Templates", icon: LayoutTemplate },
  { name: "create-resume", title: "", isCenter: true },
  { name: "my-cv", title: "My CV", icon: FileText },
  { name: "setting", title: "Settings", icon: Settings },
];

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = CONTENT_HEIGHT + insets.bottom;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.mutedForeground,
        tabBarButton: NoRippleTabButton,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopWidth: 1,
          borderTopColor: colors.border,
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
              isCenter ? <ElevatedPlusIcon /> : Icon ? <Icon size={size} color={color} /> : null,
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
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -40,
    borderColor: colors.white,
    borderWidth: 4,
  },
});
