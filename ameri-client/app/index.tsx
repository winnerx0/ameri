import { useEffect } from "react";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Text, View } from "react-native";

export default function Index() {
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

  return <View className="dark "><Text>Loading</Text></View>;
}
