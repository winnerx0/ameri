import { View, Text } from "react-native";
import React from "react";
import { clsx } from "clsx";
import { useColorScheme } from "@/hooks/useColorScheme";

const Loading = () => {
  const colorScheme = useColorScheme();
  return (
    <View className="w-full h-full items-center justify-center flex self-center">
      <View
        className={clsx(
          colorScheme === "dark" && "dark",
          "animate-spin size-8 rounded-full border-4 border-foreground border-t-transparent"
        )}
      />
    </View>
  );
};

export default Loading;
