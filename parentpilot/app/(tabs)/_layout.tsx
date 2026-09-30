import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Text } from "react-native";
import { FamilyProvider } from "@/hooks/FamilyProvider";
import { colors } from "@/theme";

type IconName = keyof typeof Ionicons.glyphMap;

const TABS: { name: string; title: string; icon: IconName; iconActive: IconName }[] = [
  { name: "index", title: "Today", icon: "sunny-outline", iconActive: "sunny" },
  { name: "ask", title: "Ask", icon: "chatbubble-ellipses-outline", iconActive: "chatbubble-ellipses" },
  { name: "memory", title: "Memory", icon: "bookmark-outline", iconActive: "bookmark" },
  { name: "reminders", title: "Reminders", icon: "notifications-outline", iconActive: "notifications" },
  { name: "community", title: "Community", icon: "people-outline", iconActive: "people" },
];

export default function TabsLayout() {
  return (
    <FamilyProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textSecondary,
          tabBarItemStyle: { paddingHorizontal: 0 },
          tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
        }}
      >
        {TABS.map((t) => (
          <Tabs.Screen
            key={t.name}
            name={t.name}
            options={{
              title: t.title,
              tabBarAccessibilityLabel: t.title,
              // Explicit label: five tabs must fit a 360-390pt phone without truncating.
              tabBarLabel: ({ color }) => (
                <Text numberOfLines={1} style={{ color, fontSize: 11, lineHeight: 16, fontWeight: "600", letterSpacing: -0.2 }}>
                  {t.title}
                </Text>
              ),
              tabBarIcon: ({ focused, color, size }) => (
                <Ionicons name={focused ? t.iconActive : t.icon} size={size} color={color} />
              ),
            }}
          />
        ))}
      </Tabs>
    </FamilyProvider>
  );
}
