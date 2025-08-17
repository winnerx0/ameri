import { Slot } from "expo-router";
import "../../global.css";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { clsx } from "clsx";
import { useColorScheme } from "@/hooks/useColorScheme";
export default function AuthLayout() {
  const colorScheme = useColorScheme();
  return (
    <SafeAreaProvider>
      <SafeAreaView
        className={clsx(
          colorScheme === "dark" ? "dark" : "",
          "bg-background h-full items-center justify-center gap-4"
        )}
      >
        <Slot />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
