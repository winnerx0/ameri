import { useColorScheme } from "@/hooks/useColorScheme";
import { Meal, NutritionSummary, UserData } from "@/types";
import { api, BACKEND_URL } from "@/utils";
import { AxiosError } from "axios";
import { clsx } from "clsx";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker from "@react-native-community/datetimepicker";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
export default function HomeScreen() {
  const colorScheme = useColorScheme();

  const [show, setShow] = useState<boolean>(false);
  const [date, setDate] = useState<Date | null>(null);

  const { data: userData } = useQuery({
    queryKey: ["fetchuserdata"],
    queryFn: async () => {
      try {
        const res = await api.get(BACKEND_URL + "/user/me", {
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (res.status !== 200) {
          throw new Error(res.data.message);
        }
        return res.data.data as UserData;
      } catch (error) {
        if (error instanceof AxiosError) console.error(error.response?.data);
        console.error("error", error);
      }
    },
  });

  const { data: summary, isLoading: isSummaryLoading } = useQuery({
    queryKey: ["fetchsummary", date],
    queryFn: async () => {
      try {
        const res = await api.get(
          BACKEND_URL +
            `/nutrition/summary?date=${
              (date ?? new Date()).toISOString().split("T")[0]
            }`,
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
        return res.data as NutritionSummary;
      } catch (error) {
        if (error instanceof AxiosError)
          console.error("error", error.response?.data);
        console.error(error);
      }
    },
  });

  const { data: meals, isLoading: isMealLoading } = useQuery({
    queryKey: ["fetchmeals"],
    queryFn: async () => {
      try {
        const res = await api.get(BACKEND_URL + "/meal/get-meal-logs?size=5", {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (res.status === 500) {
          throw new Error(res.data.message);
        }

        console.log(res.data.content);
        return res.data.content as Meal[];
      } catch (error) {
        if (error instanceof AxiosError)
          console.error("error", error.response?.data);
        console.error(error);
      }
    },
  });

  console.log(summary);
  return (
    <SafeAreaProvider>
      <SafeAreaView
        className={clsx(
          colorScheme === "dark" ? "dark" : "",
          "bg-background h-screen pt-12 flex flex-col px-4"
        )}
      >
        <ScrollView
          contentContainerStyle={{
            paddingBottom: 60,
            gap: 16,
          }}
          showsVerticalScrollIndicator={false}
        >
          <Text
            className={clsx(
              colorScheme === "dark" ? "dark text-zinc-400" : "text-zinc-600",
              "text-[15px] font-light self-start mt-12"
            )}
          >
            {new Date().getUTCHours() >= 12 &&  new Date().getUTCHours() < 16
              ? "Good Afternoon"
              : new Date().getUTCHours() >= 16 && new Date().getUTCHours() <= 23
              ? "Good Evening"
              : "Good Morning"}
            .
          </Text>
          <Text
            className={clsx(
              colorScheme === "dark" && "dark",
              "text-foreground text-3xl font-bold self-start"
            )}
          >
            Hey {userData?.username}
          </Text>
          {/* <Text
        
            className={clsx(
              colorScheme === "dark" && "dark",
              "text-foreground text-3xl self-start font-bold"
            )}
        >
          Ameri
        </Text> */}
          <TouchableOpacity
            onPress={() => setShow(!show)}
            className={clsx(
              colorScheme === "dark" && "dark",
              "bg-primary rounded-md w-max h-8 flex flex-row gap-2 justify-center items-center self-start px-2"
            )}
          >
            <Text
              className={clsx(
                colorScheme === "dark" && "dark",
                "text-white text-sm flex flex-row items-center"
              )}
            >
              <Icon name="calendar" />
            </Text>
            <Text
              className={clsx(
                colorScheme === "dark" && "dark",
                "text-white text-sm font-bold flex flex-row items-center"
              )}
            >
              {date?.toDateString() ?? "Today"}
            </Text>
            <Text
              className={clsx(
                colorScheme === "dark" && "dark",
                "text-white text-sm flex flex-row items-center"
              )}
            >
              <Icon name="chevron-down" />
            </Text>
          </TouchableOpacity>
          {show && (
            <DateTimePicker
              testID="datetimepicker"
              value={new Date()}
              mode="date"
              onChange={(e) => {
                setDate(new Date(e.nativeEvent.timestamp));

                setShow(!show);
              }}
            />
          )}
          <View
            className={clsx(
              colorScheme === "dark" && "dark",
              "flex-1 border border-border bg-secondary h-48 rounded-2xl w-full flex flex-col items-center justify-center py-2 px-4 gap-4"
            )}
          >
            <Text
              className={clsx(
                colorScheme === "dark" && "dark",
                "text-foreground font-bold self-start"
              )}
            >
              Daily Metadata
            </Text>
            <View className="flex flex-row gap-4 items-center w-full">
              <View className="flex flex-col gap-4">
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
                  "w-full flex flex-col gap-4 justify-center py-2 px-4"
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
            {/* <RadarChart data = {data} donut /> */}
          </View>
          <View className="w-full flex-row gap-4">
            <TouchableOpacity className="flex-1 bg-primary h-10 rounded-md flex-row gap-2 justify-center items-center px-2">
              <Icon name="bowl" color="white" />
              <Text className="text-white text-sm font-bold">
                Generate Meal
              </Text>
            </TouchableOpacity>

            <TouchableOpacity className="flex-1 bg-primary h-10 rounded-md flex-row gap-2 justify-center items-center px-2" onPress={() => router.push("/log-meals")}>
              <Icon name="book" color="white" />
              <Text className="text-white text-sm font-bold">Log Meal</Text>
            </TouchableOpacity>
          </View>

          <View className="flex flex-col gap-4 mt-12 w-full">
            <Text
              className={clsx(
                colorScheme === "dark" && "dark",
                "text-foreground font-bold text-2xl mb-8"
              )}
            >
              Previous Meals
            </Text>
            {meals &&
              (meals.length === 0 ? (
                <View className="items-center justify-center flex">
                  <Text>No Meals Logged</Text>
                </View>
              ) : (
                meals.map((meal) => (
                  <View
                    key={meal.id}
                    className={clsx(
                      colorScheme === "dark" && "dark",
                      "border border-border bg-secondary h-20 rounded-2xl flex flex-col items-center justify-center py-2 px-4 gap-4"
                    )}
                  >
                    <Text
                      className={clsx(
                        colorScheme === "dark" && "dark",
                        "text-foreground"
                      )}
                    >
                      {meal.items[0].foodName}
                    </Text>
                  </View>
                ))
              ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
