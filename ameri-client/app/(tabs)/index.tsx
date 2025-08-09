import { useColorScheme } from "@/hooks/useColorScheme";
import { NutritionSummary, UserData } from "@/types";
import { api, BACKEND_URL } from "@/utils";
import { AxiosError } from "axios";
import { clsx } from "clsx";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
export default function HomeScreen() {
  
  const colorScheme = useColorScheme();

  const [userData, setUserData] = useState<UserData | null>(null);
  const [summary, setSummary] = useState<NutritionSummary | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await api.get(BACKEND_URL + "/user/me", {
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (res.status !== 200) {
          throw new Error(res.data.message);
        }
        setUserData(res.data.data as UserData);
      } catch (error) {
        if (error instanceof AxiosError) console.error(error.response?.data);
        console.error("error", error);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await api.get(
          BACKEND_URL + `/nutrition/summary?date=${new Date().toISOString().split("T")[0]}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );


         if (res.status === 500) {
           throw new Error(res.data.message);
         }

        console.log(res.data);
        setSummary(res.data as NutritionSummary);
      } catch (error) {
        if (error instanceof AxiosError) console.error("error", error.response?.data);
        console.error(error);
      }
    }
    fetchData();
  }, []);

  console.log(summary);
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
            "border border-border h-48 rounded-2xl w-full flex flex-col py-2 px-4 bg-card gap-4"
          )}
        >
          <View className="flex flex-row gap-4 items-center w-full">
            <View className="flex flex-col gap-4">
              <Text
                className={clsx(
                  colorScheme === "dark" && "dark",
                  "text-foreground text-2xl font-bold"
                )}
              >
                Hey {userData?.username},
              </Text>
              <Text
                className={clsx(
                  colorScheme === "dark" && "dark",
                  "text-foreground text-md font-bold"
                )}
              >
                Carbs: {summary?.totalCarbs}
              </Text>
              <Text
                className={clsx(
                  colorScheme === "dark" && "dark",
                  "text-foreground text-md font-bold"
                )}
              >
                Calories: {summary?.totalCalories}
              </Text>
              <Text
                className={clsx(
                  colorScheme === "dark" && "dark",
                  "text-foreground text-md font-bold"
                )}
              >
                Protein: {summary?.totalProtein}
              </Text>
            </View>

            <View
              className={clsx(
                colorScheme === "dark" && "dark",
                "w-full flex flex-col gap-4 justify-center py-2 px-4 bg-card"
              )}
            >
              <Text
                className={clsx(
                  colorScheme === "dark" && "dark",
                  "text-foreground font-bold"
                )}
              >
                Weight: {userData?.weight} kg
              </Text>
              <Text
                className={clsx(
                  colorScheme === "dark" && "dark",
                  "text-foreground font-bold"
                )}
              >
               Height: {userData?.height} cm
              </Text>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
