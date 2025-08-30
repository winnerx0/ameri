import { router, Tabs } from "expo-router";
import React, { useEffect } from "react";
import { Platform, Text, View } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { useColorScheme } from "@/hooks/useColorScheme";
import { clsx } from "clsx";
import { MaterialCommunityIcons } from "@expo/vector-icons";
export default function TabLayout() {
 	const { isDarkColorScheme } = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,

        tabBarActiveTintColor: isDarkColorScheme
          ? "hsl(217.2 91.2% 59.8%)"
          : "hsl(221.2 83.2% 53.3%)",
        tabBarInactiveTintColor: isDarkColorScheme
          ? "hsl(215 20.2% 65.1%)"
          : "hsl(215.4 16.3% 46.9%)",
        tabBarStyle: {
          backgroundColor: isDarkColorScheme
            ? "hsl(222.2 84% 4.9%)"
            : "hsl(0 0% 100%)",
          borderTopColor: isDarkColorScheme
            ? "hsl(217.2 32.6% 17.5%)"
            : "hsl(214.3 31.8% 91.4%)",
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons size={28} name="home" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="capture"
        options={{
          title: "Capture",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons size={28} name="camera" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              size={28}
              name="face-man-profile"
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
