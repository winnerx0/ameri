import { useFonts } from "expo-font";
import { router, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  DarkTheme,
  DefaultTheme,
  type Theme,
  ThemeProvider,
} from "@react-navigation/native";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Platform } from "react-native";
import "../global.css";

export default function RootLayout() {
  const [queryClient] = useState(() => new QueryClient());

  const { colorScheme, isDarkColorScheme } = useColorScheme();
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = useState(false);
  const hasMounted = useRef(false);

  useEffect(() => {
    if (hasMounted.current) {
      return;
    }

    if (Platform.OS === "web") {
      document.documentElement.classList.add("bg-background");
    }
    // setAndroidNavigationBar(colorScheme);
    setIsColorSchemeLoaded(true);
    hasMounted.current = true;
  }, []);

  if (!isColorSchemeLoaded) {
    return null;
  }

  // const [loaded] = useFonts({
  //   SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  // });

  // if (!loaded) {
  //   // Async font loading only occurs in development.
  //   return null;
  // }

  const NAV_THEME = {
    light: {
      background: "hsl(0 0% 100%)",
      border: "hsl(220 13% 91%)",
      card: "hsl(0 0% 100%)",
      notification: "hsl(0 84.2% 60.2%)",
      primary: "hsl(221.2 83.2% 53.3%)",
      text: "hsl(222.2 84% 4.9%)",
      secondary: "hsl(222.2 40% 94%)",
      placeholder: "hsla(0, 0%, 0%, 0.5)",
    },
    dark: {
      background: "hsl(222.2 84% 4.9%)",
      border: "hsl(217.2 32.6% 17.5%)",
      card: "hsl(222.2 84% 4.9%)",
      notification: "hsl(0 72% 51%)",
      primary: "hsl(217.2 91.2% 59.8%)",
      text: "hsl(210 40% 98%)",
      secondary: "hsl(217.2 32.6% 17.5%)",
      placeholder: "hsla(0, 0%, 100%, 0.5)",
    },
  };

  const LIGHT_THEME: Theme = {
    ...DefaultTheme,
    colors: NAV_THEME.light,
  };
  const DARK_THEME: Theme = {
    ...DarkTheme,
    colors: NAV_THEME.dark,
  };

  console.log(isDarkColorScheme);
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
        <GestureHandlerRootView style={{ flex: 1 }}>
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
            <Stack.Screen
              name="dietary-preferences"
              options={{ headerShown: false }}
            />
            <Stack.Screen name="+not-found" />
          </Stack>
        </GestureHandlerRootView>
        <StatusBar style={isDarkColorScheme ? "light" : "dark"} />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
