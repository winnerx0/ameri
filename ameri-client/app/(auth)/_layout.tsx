import { Slot } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { clsx } from "clsx";
import { useColorScheme } from "@/hooks/useColorScheme";
export default function AuthLayout() {
  const colorScheme = useColorScheme();
  return (
    <SafeAreaView
      className={clsx(
        "h-full items-center justify-center gap-4 w-full"
      )}
    >
      <Slot />
    </SafeAreaView>
  );
}
