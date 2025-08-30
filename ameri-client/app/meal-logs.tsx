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
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@react-navigation/native";

const MealLogsScreen = () => {
  const {colors} = useTheme();

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
          "w-full"
        )}
      >
        <ThemedView className="h-screen flex flex-col">
          <View className="flex flex-col gap-4 mb-4 pl-4">
            <View className="py-2 w-full">
              <TouchableOpacity
                className="flex-row items-center"
                onPress={() => router.back()}
              >
                <MaterialCommunityIcons
                  name="chevron-left"
                  size={30}
                  color={colors.text}
                />
                <Text className="text-foreground text-sm">Back</Text>
              </TouchableOpacity>
            </View>
            <View>
              <ThemedText
                className={clsx(
                  "text-foreground font-semibold text-3xl"
                )}
              >
                Meal Logs
              </ThemedText>
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
                  <ThemedView
                    color="secondary"
                    className={clsx(
                      "rounded-xl py-8 items-center justify-center"
                    )}
                  >
                    <MaterialCommunityIcons
                      name="food-off"
                      size={32}
                      color={colors.text}
                    />
                    <ThemedText
                      className={clsx(
                        "text-muted-foreground mt-2"
                      )}
                    >
                      No Meals Logged
                    </ThemedText>
                  </ThemedView>
                ) : (
                  <View style={{ gap: 12 }}>
                    {meals!.pages
                      .flatMap((page) => page!.content)
                      .map((meal) => (
                        <ThemedView
                          color="secondary"
                          key={meal.id}
                          className={clsx(
                            "border border-border rounded-xl p-4"
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
                                backgroundColor: colors.text,
                                borderRadius: 20,
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <MaterialCommunityIcons
                                name="food"
                                size={20}
                                color={colors.background}
                              />
                            </View>
                            <View style={{ flex: 1 }}>
                              <ThemedText
                                className={clsx(
                                  "text-foreground font-semibold"
                                )}
                              >
                                {meal.mealType}
                              </ThemedText>
                              <ThemedText
                                className={clsx(
                                  "text-muted-foreground text-sm"
                                )}
                              >
                                {meal.items.length} item
                                {meal.items.length !== 1 ? "s" : ""}
                              </ThemedText>
                            </View>
                            <MaterialCommunityIcons
                              name="chevron-right"
                              size={16}
                              color={colors.text}
                            />
                          </View>
                        </ThemedView>
                      ))}
                    <ThemedText
                      className={clsx(
                        "text-muted-foreground self-center",
                        !hasNextPage && "hidden"
                      )}
                      onPress={() => fetchNextPage()}
                    >
                      View More
                    </ThemedText>
                  </View>
                )}
              </View>
            </ScrollView>
          )}
        </ThemedView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default MealLogsScreen;
