import { View, Text } from "react-native";
import React from "react";
import { clsx } from "clsx";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useColorScheme } from "@/hooks/useColorScheme";

const MealLogsScreen = () => {
  const colorScheme = useColorScheme();
  return (
    <SafeAreaProvider>
      <SafeAreaView
        className={clsx(
          colorScheme === "dark" ? "dark" : "",
          "bg-background h-full"
        )}
      ></SafeAreaView>
    </SafeAreaProvider>
  );
};

export default MealLogsScreen;
