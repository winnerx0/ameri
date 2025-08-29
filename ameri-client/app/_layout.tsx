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
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="log-meals" options={{ headerShown: false }} />
        <Stack.Screen name="meal-logs" options={{ headerShown: false }} />
        <Stack.Screen
          name="generate-meal"
          options={{ headerShown: false, presentation: "modal" }}
        />
        <Stack.Screen
          name="meal-data"
          options={{ headerShown: false, animation: "slide_from_bottom" }}
        />
        <Stack.Screen
          name="personal-info-edit"
          options={{ headerShown: false }}
        />
        <Stack.Screen name="dietary-preferences" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </QueryClientProvider>
  );
}
