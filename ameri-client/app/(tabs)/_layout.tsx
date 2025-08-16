import { router, Tabs } from "expo-router";
import React, { useEffect } from "react";
import { Platform, Text, View } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useColorScheme } from "@/hooks/useColorScheme";
import "../../global.css";
import { useAuth } from "@/components/context/AuthContext";
export default function TabLayout() {
  const colorScheme = useColorScheme();

  const { token, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!token) {
        router.replace("/login");
      }
    }
  }, [token, loading]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Loading...</Text>
      </View>
    );
  }

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
      <Tabs.Screen
        name="log-meals"
        options={{
          title: "LogMeals",
          href: null,
        }}
      />
    </Tabs>
  );
}
