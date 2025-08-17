import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { clsx } from "clsx";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useColorScheme } from "@/hooks/useColorScheme";
import { router, useLocalSearchParams } from "expo-router";
import { MealRecepie } from "@/types";
import { MaterialCommunityIcons } from "@expo/vector-icons";

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
      >
        <View className="w-full flex items-center relative px-2 h-full">
          <TouchableOpacity
            className="text-foreground flex flex-row items-center mt-10 self-start"
            onPress={() => router.back()}
          >
            <MaterialCommunityIcons
              name="chevron-left"
              size={30}
              color={colorScheme === "dark" ? "white" : "black"}
            />
            <Text className="text-foreground text-sm ml-1">Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default MealData;
