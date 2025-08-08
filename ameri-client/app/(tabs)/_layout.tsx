import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useColorScheme } from "@/hooks/useColorScheme";
import "../../global.css"
export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarActiveTintColor: colorScheme === "dark" ? "#60a5fa" : "#3b82f6", 
        tabBarInactiveTintColor: colorScheme === "dark" ? "#6b7280" : "#9ca3af",
        tabBarStyle: Platform.select({
          ios: {
            position: "absolute",
            backgroundColor:
              colorScheme === "dark" ? "hsl(222.2 84% 4.9%)" : "#ffffff",
            borderTopColor: colorScheme === "dark" ? "#374151" : "#e5e7eb",
          },
          default: {
            backgroundColor:
              colorScheme === "dark" ? "hsl(222.2 84% 4.9%)" : "#ffffff",
            borderTopColor: colorScheme === "dark" ? "#374151" : "#e5e7eb",
          },
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Icon size={28} name="home" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="capture"
        options={{
          title: "Capture",
          tabBarIcon: ({ color }) => (
            <Icon size={28} name="camera" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <Icon size={28} name="face-man-profile" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
