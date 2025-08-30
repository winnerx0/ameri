import { View, Text } from "react-native";
import React from "react";
import { clsx } from "clsx";
import { useColorScheme } from "@/hooks/useColorScheme";
import { ThemedView } from "./ThemedView";

const Loading = () => {
  return (
    <View className="w-full h-full items-center justify-center flex self-center">
      <ThemedView
      border="text"
        className={clsx(
          "animate-spin size-8 rounded-full border-4 border-t-transparent"
        )}
      />
    </View>
  );
};

export default Loading;
