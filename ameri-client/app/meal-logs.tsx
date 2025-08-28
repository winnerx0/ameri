import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import React from "react";
import { clsx } from "clsx";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useColorScheme } from "@/hooks/useColorScheme";
import { api, BACKEND_URL } from "@/utils";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Meal } from "@/types";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import Loading from "@/components/Loading";

const MealLogsScreen = () => {
  const colorScheme = useColorScheme();

  const {
    data: meals,
    isLoading: isMealLoading,
    // refetch: refetchMeals,
    // isRefetching: isMealsRefetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["fetch-all-meals"],
    queryFn: async ({ pageParam = 0 }) => {
      const res = await api.get(
        BACKEND_URL + `/meal/get-meal-logs?page=${pageParam}&size=5`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("data", res.data);
      return res.data as {
        page: { number: number; totalPages: number };
        content: Meal[];
      };
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) =>
      lastPage?.page.number + 1 < lastPage?.page.totalPages
        ? lastPage?.page.number + 1
        : undefined,
  });

  console.log("meals", meals);
  return (
    <SafeAreaProvider>
      <SafeAreaView
        className={clsx(
          colorScheme === "dark" ? "dark" : "",
          "bg-background w-full"
        )}
      >
        <View className="h-screen flex flex-col">
          <View className="flex flex-col gap-4 mb-4 pl-4">
            <View className="py-2 w-full">
              <TouchableOpacity
                className="flex-row items-center"
                onPress={() => router.back()}
              >
                <MaterialCommunityIcons
                  name="chevron-left"
                  size={30}
                  color={colorScheme === "dark" ? "white" : "black"}
                />
                <Text className="text-foreground text-sm">Back</Text>
              </TouchableOpacity>
            </View>
            <View>
              <Text
                className={clsx(
                  colorScheme === "dark" && "dark",
                  "text-foreground font-semibold text-3xl"
                )}
              >
                Meal Logs
              </Text>
            </View>
          </View>
          {isMealLoading || isFetchingNextPage ? (
            <Loading />
          ) : (
            <ScrollView
              contentContainerStyle={{
                paddingBottom: 100,
              }}
              showsVerticalScrollIndicator={false}
              className="flex flex-col gap-6 w-full h-full px-4"
            >
              <View className="flex flex-col h-full">
                {meals &&
                meals.pages.flatMap((page) => page!.content).length === 0 ? (
                  <View
                    className={clsx(
                      colorScheme === "dark" && "dark",
                      "border border-border bg-secondary rounded-xl py-8 items-center justify-center"
                    )}
                  >
                    <MaterialCommunityIcons
                      name="food-off"
                      size={32}
                      color={colorScheme === "dark" ? "#64748B" : "#94A3B8"}
                    />
                    <Text
                      className={clsx(
                        colorScheme === "dark" && "dark",
                        "text-muted-foreground mt-2"
                      )}
                    >
                      No Meals Logged
                    </Text>
                  </View>
                ) : (
                  <View style={{ gap: 12 }}>
                    {meals!.pages
                      .flatMap((page) => page!.content)
                      .map((meal) => (
                        <View
                          key={meal.id}
                          className={clsx(
                            colorScheme === "dark" && "dark",
                            "border border-border bg-secondary rounded-xl p-4"
                          )}
                        >
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              gap: 12,
                            }}
                          >
                            <View
                              style={{
                                width: 40,
                                height: 40,
                                backgroundColor:
                                  colorScheme === "dark"
                                    ? "#4A5568"
                                    : "#F1F5F9",
                                borderRadius: 20,
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <MaterialCommunityIcons
                                name="food"
                                size={20}
                                color={
                                  colorScheme === "dark" ? "#A0AEC0" : "#64748B"
                                }
                              />
                            </View>
                            <View style={{ flex: 1 }}>
                              <Text
                                className={clsx(
                                  colorScheme === "dark" && "dark",
                                  "text-foreground font-semibold"
                                )}
                              >
                                {meal.mealType}
                              </Text>
                              <Text
                                className={clsx(
                                  colorScheme === "dark" && "dark",
                                  "text-muted-foreground text-sm"
                                )}
                              >
                                {meal.items.length} item
                                {meal.items.length !== 1 ? "s" : ""}
                              </Text>
                            </View>
                            <MaterialCommunityIcons
                              name="chevron-right"
                              size={16}
                              color={
                                colorScheme === "dark" ? "#64748B" : "#94A3B8"
                              }
                            />
                          </View>
                        </View>
                      ))}
                    <Text
                      className={clsx(
                        colorScheme === "dark" && "dark",
                        "text-muted-foreground self-center",
                        !hasNextPage && "hidden"
                      )}
                      onPress={() => fetchNextPage()}
                    >
                      View More
                    </Text>
                  </View>
                )}
              </View>
            </ScrollView>
          )}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default MealLogsScreen;
