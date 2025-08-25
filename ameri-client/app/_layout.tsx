import { useFonts } from "expo-font";
import { router, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useScreen } from "@/utils/store";

export default function RootLayout() {
  const [queryClient] = useState(() => new QueryClient());

  const { setScreen } = useScreen();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem("accessToken");

        const currentScreen = await AsyncStorage.getItem("currentScreen");

        if (currentScreen === "otp" && !token) {
          setScreen({ path: "otp" });
        } else if(currentScreen === "otp" && token){
          setScreen({ path: "otp" });
        }else if (!token) {
          setScreen({ path: "register" });
        } else if(token){
         router.replace("/(tabs)/home")
        }
      } catch (error) {
        console.log("Auth check error:", error);
        // setScreen({ path: "login" });
      }
    };

    checkAuth();
  }, []);

  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Stack>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="log-meals" options={{ headerShown: false }} />
        <Stack.Screen name="meal-logs" options={{ headerShown: false }} />
        <Stack.Screen
          name="meal-data"
          options={{ headerShown: false, animation: "slide_from_bottom" }}
        />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </QueryClientProvider>
  );
}
