import { View, Text } from "react-native";
import React from "react";
import { clsx } from "clsx";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useLocalSearchParams } from "expo-router";
import { MealRecepie } from "@/types";

const MealData = () => {
  const colorScheme = useColorScheme();
  const { data }: { data: string } = useLocalSearchParams();

  const mealData: MealRecepie = JSON.parse(data);

  console.log(mealData);
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

export default MealData;
