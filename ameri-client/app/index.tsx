import { useEffect } from "react";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Text, View } from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";
import {clsx} from "clsx";

export default function Index() {

  const colorScheme = useColorScheme()
  useEffect(() => {
    async function checkAuth() {
      const token = await AsyncStorage.getItem("accessToken");
      
      if (token) {
        router.replace("/(tabs)");
      } else {
        router.replace("/login");
      }
    }
    checkAuth();
  }, []);

  return <View className={clsx(colorScheme === "dark" && "dark", "bg-background text-foreground flex items-center justify-center h-screen")}><Text>Loading</Text></View>;
}
