import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useScreen } from "@/utils/store";
import { router } from "expo-router";

const Index = () => {
  const { setScreen } = useScreen();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem("accessToken");

        const currentScreen = await AsyncStorage.getItem("currentScreen");

        console.log("token", token);

        if (currentScreen === "otp" && !token) {
          setScreen({ path: "otp" });
        } else if (currentScreen === "otp" && token) {
          setScreen({ path: "otp" });
        } else if (token) {
          router.replace("/(tabs)/home");
        } else {
         router.replace("/login");
        }
      } catch (error) {
        console.log("Auth check error:", error);
        // setScreen({ path: "login" });
      }
    };

    checkAuth();
  }, []);

  return null;
};

export default Index;
