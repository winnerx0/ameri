import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { clsx } from "clsx";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function ProfileScreen() {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaProvider>
      <SafeAreaView
        className={clsx(
          colorScheme === "dark" ? "dark" : "",
          "bg-background h-screen items-center pt-12 gap-4 px-4"
        )}
      ></SafeAreaView>
    </SafeAreaProvider>
  );
}
