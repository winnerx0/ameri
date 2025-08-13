import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { useColorScheme } from "@/hooks/useColorScheme";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { clsx } from "clsx";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { router } from "expo-router";

const LogMeals = () => {
  const colorScheme = useColorScheme();
  return (
    <SafeAreaProvider>
      <SafeAreaView
        className={clsx(
          colorScheme === "dark" ? "dark" : "",
          "bg-background h-screen flex flex-col px-4"
        )}
      >
        <TouchableOpacity className="flex flex-row items-center mt-12" onPress={() => router.back()}>
          <Icon name="chevron-left" size={30} />

        <Text
          className={clsx(
            colorScheme === "dark" && "dark",
            "text-foreground text-sm flex flex-row items-center"
          )}
        >
          Go Back
        </Text>
        </TouchableOpacity>
        <Text
          className={clsx(
            colorScheme === "dark" ? "dark text-zinc-400" : "text-zinc-600",
            "text-[15px] font-light self-start mt-12"
          )}
        >
          LogMeals
        </Text>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default LogMeals;
