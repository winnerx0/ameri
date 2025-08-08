import { useColorScheme } from "@/hooks/useColorScheme";
import { UserData } from "@/types";
import { api, BACKEND_URL } from "@/utils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { clsx } from "clsx";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
export default function HomeScreen() {

  const colorScheme = useColorScheme();

  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    async function fetchData() {

      const res = await api.get(BACKEND_URL + "/user/me", {
        headers: {
          "Content-Type": "application/json"
        },
      });
      setUserData(res.data.data as UserData);
    }
    fetchData();
  }, []);

  console.log(userData);
  return (
    <SafeAreaProvider>
      <SafeAreaView
        className={clsx(
          colorScheme === "dark" ? "dark" : "",
          "bg-background h-screen items-center pt-12 gap-4 px-4"
        )}
      >
        <View
          className={clsx(
            colorScheme === "dark" && "dark",
            "border border-border h-48 rounded-md w-full flex flex-col py-2 px-4 bg-card"
          )}
        >
          <Text
            className={clsx(
              colorScheme === "dark" && "dark",
              "text-foreground text-3xl font-bold"
            )}
          >
            Hey {userData?.username}
          </Text>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
