import { useColorScheme } from "@/hooks/useColorScheme";
import { Meal, NutritionSummary, UserData } from "@/types";
import { api, BACKEND_URL } from "@/utils";
import { AxiosError } from "axios";
import { clsx } from "clsx";
import { useCallback, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function HomeScreen() {
  const colorScheme = useColorScheme();

  const [show, setShow] = useState<boolean>(false);
  const [date, setDate] = useState<Date | null>(null);

  const [refreshing, setRefreshing] = useState<boolean>(false);

  const {
    data: userData,
    refetch: refetchUserData,
    isRefetching: isUserDataRefetching,
  } = useQuery({
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
        if (error instanceof AxiosError) console.error("error", error.response?.data);
        console.error("error", error);
      }
    },
  });

  const {
    data: summary,
    isLoading: isSummaryLoading,
    refetch: refetchSummary,
    isRefetching: isSummaryRefetching,
  } = useQuery({
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

  const {
    data: meals,
    isLoading: isMealLoading,
    refetch: refetchMeals,
    isRefetching: isMealsRefetching,
  } = useQuery({
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

  const onRefetch = useCallback(async () => {
    setRefreshing(true);
    await refetchUserData();
    await refetchMeals();
    await refetchSummary();
    setRefreshing(false);
  }, [refetchMeals, refetchSummary, refetchUserData]);

  console.log(summary);
  return (
    <SafeAreaProvider>
      <SafeAreaView
        className={clsx(
          colorScheme === "dark" ? "dark" : "",
          "bg-background h-screen flex flex-col"
        )}
      >
        <ScrollView
          contentContainerStyle={{
            paddingBottom: 100,
            paddingHorizontal: 16,
            paddingTop: 16,
          }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefetch} />
          }
        >
          {/* Header Section */}
          <View style={{ marginBottom: 24 }}>
            <Text
              className={clsx(
                colorScheme === "dark" ? "dark text-zinc-400" : "text-zinc-600",
                "text-[15px] font-light mb-4 mt-6"
              )}
            >
              {new Date().getUTCHours() <= 0 && new Date().getUTCHours() < 11
                ? "Good Morning"
                : new Date().getUTCHours() >= 12 &&
                  new Date().getUTCHours() <= 16
                ? "Good Afternoon"
                : "Good Evening"}
              .
            </Text>
            <Text
              className={clsx(
                colorScheme === "dark" && "dark",
                "text-foreground text-3xl font-bold"
              )}
            >
              Hey {userData?.username}
            </Text>
          </View>

          {/* Date Picker */}
          <TouchableOpacity
            onPress={() => setShow(!show)}
            style={{
              borderRadius: 16,
            }}
            className={clsx(
              colorScheme === "dark" && "dark",
              "bg-primary h-10 flex flex-row gap-2 justify-center items-center self-start px-3 mb-6"
            )}
          >
            <MaterialCommunityIcons name="calendar" size={16} color="white" />
            <Text
              className={clsx(
                colorScheme === "dark" && "dark",
                "text-white text-sm font-semibold"
              )}
            >
              {date?.toDateString() ?? "Today"}
            </Text>
            <MaterialCommunityIcons name="chevron-down" size={16} color="white" />
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

          {/* Daily Metadata Card */}
          <View
            className={clsx(
              colorScheme === "dark" && "dark",
              "border border-border bg-secondary rounded-2xl p-4 mb-6"
            )}
          >
            <Text
              className={clsx(
                colorScheme === "dark" && "dark",
                "text-foreground font-bold text-lg mb-4"
              )}
            >
              Daily Metadata
            </Text>

            <View style={{ flexDirection: "row", gap: 12 }}>
              {/* Nutrition Stats Section */}
              <View style={{ flex: 1, gap: 10 }}>
                {/* Calories Card */}
                <LinearGradient
                  colors={["#FF6B6B", "#FF8E8E"]}
                  style={{
                    borderRadius: 12,
                    padding: 12,
                    shadowColor: "#FF6B6B",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 4,
                    elevation: 4,
                  }}
                >
                  <Text
                    style={{
                      color: "#FFFFFF",
                      fontSize: 10,
                      fontWeight: "600",
                      opacity: 0.9,
                      marginBottom: 2,
                    }}
                  >
                    CALORIES
                  </Text>
                  <Text
                    style={{
                      color: "#FFFFFF",
                      fontSize: 18,
                      fontWeight: "bold",
                    }}
                  >
                    {summary?.totalCalories || 0}
                    <Text style={{ fontSize: 12, fontWeight: "500" }}>
                      {" "}
                      kcal
                    </Text>
                  </Text>
                </LinearGradient>

                {/* Carbs Card */}
                <LinearGradient
                  colors={["#4ECDC4", "#44A08D"]}
                  style={{
                    borderRadius: 12,
                    padding: 12,
                    shadowColor: "#4ECDC4",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 4,
                    elevation: 4,
                  }}
                >
                  <Text
                    style={{
                      color: "#FFFFFF",
                      fontSize: 10,
                      fontWeight: "600",
                      opacity: 0.9,
                      marginBottom: 2,
                    }}
                  >
                    CARBS
                  </Text>
                  <Text
                    style={{
                      color: "#FFFFFF",
                      fontSize: 18,
                      fontWeight: "bold",
                    }}
                  >
                    {summary?.totalCarbs || 0}
                    <Text style={{ fontSize: 12, fontWeight: "500" }}> g</Text>
                  </Text>
                </LinearGradient>

                {/* Protein Card */}
                <LinearGradient
                  colors={["#A18CD1", "#FBC2EB"]}
                  style={{
                    borderRadius: 12,
                    padding: 12,
                    shadowColor: "#A18CD1",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 4,
                    elevation: 4,
                  }}
                >
                  <Text
                    style={{
                      color: "#FFFFFF",
                      fontSize: 10,
                      fontWeight: "600",
                      opacity: 0.9,
                      marginBottom: 2,
                    }}
                  >
                    PROTEIN
                  </Text>
                  <Text
                    style={{
                      color: "#FFFFFF",
                      fontSize: 18,
                      fontWeight: "bold",
                    }}
                  >
                    {summary?.totalProtein || 0}
                    <Text style={{ fontSize: 12, fontWeight: "500" }}> g</Text>
                  </Text>
                </LinearGradient>
              </View>

              {/* User Stats Section */}
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  gap: 10,
                }}
              >
                {/* Weight Card */}
                <View
                  style={{
                    backgroundColor:
                      colorScheme === "dark" ? "#2D3748" : "#FFFFFF",
                    borderRadius: 12,
                    padding: 16,
                    borderWidth: 1,
                    borderColor: colorScheme === "dark" ? "#4A5568" : "#E2E8F0",
                    shadowColor: colorScheme === "dark" ? "#000000" : "#64748B",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: colorScheme === "dark" ? 0.3 : 0.1,
                    shadowRadius: 4,
                    elevation: 2,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <View>
                      <Text
                        style={{
                          color: colorScheme === "dark" ? "#A0AEC0" : "#64748B",
                          fontSize: 10,
                          fontWeight: "600",
                          marginBottom: 2,
                        }}
                      >
                        WEIGHT
                      </Text>
                      <Text
                        style={{
                          color: colorScheme === "dark" ? "#FFFFFF" : "#1A202C",
                          fontSize: 18,
                          fontWeight: "bold",
                        }}
                      >
                        {userData?.weight || 0}
                        <Text style={{ fontSize: 12, fontWeight: "500" }}>
                          {" "}
                          kg
                        </Text>
                      </Text>
                    </View>
                    <View
                      style={{
                        width: 32,
                        height: 32,
                        backgroundColor:
                          colorScheme === "dark" ? "#4A5568" : "#F7FAFC",
                        borderRadius: 16,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Text style={{ fontSize: 14 }}>⚖️</Text>
                    </View>
                  </View>
                </View>

                {/* Height Card */}
                <View
                  style={{
                    backgroundColor:
                      colorScheme === "dark" ? "#2D3748" : "#FFFFFF",
                    borderRadius: 12,
                    padding: 16,
                    borderWidth: 1,
                    borderColor: colorScheme === "dark" ? "#4A5568" : "#E2E8F0",
                    shadowColor: colorScheme === "dark" ? "#000000" : "#64748B",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: colorScheme === "dark" ? 0.3 : 0.1,
                    shadowRadius: 4,
                    elevation: 2,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <View>
                      <Text
                        style={{
                          color: colorScheme === "dark" ? "#A0AEC0" : "#64748B",
                          fontSize: 10,
                          fontWeight: "600",
                          marginBottom: 2,
                        }}
                      >
                        HEIGHT
                      </Text>
                      <Text
                        style={{
                          color: colorScheme === "dark" ? "#FFFFFF" : "#1A202C",
                          fontSize: 18,
                          fontWeight: "bold",
                        }}
                      >
                        {userData?.height || 0}
                        <Text style={{ fontSize: 12, fontWeight: "500" }}>
                          {" "}
                          cm
                        </Text>
                      </Text>
                    </View>
                    <View
                      style={{
                        width: 32,
                        height: 32,
                        backgroundColor:
                          colorScheme === "dark" ? "#4A5568" : "#F7FAFC",
                        borderRadius: 16,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Text style={{ fontSize: 14 }}>📏</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={{ flexDirection: "row", gap: 12, marginBottom: 32 }}>
            <TouchableOpacity
              style={{
                borderRadius: 16,
              }}
              className={clsx(
                colorScheme === "dark" && "dark",
                "flex-1 bg-primary h-12 flex-row gap-2 justify-center items-center"
              )}
            >
              <MaterialCommunityIcons name="bowl" color="white" size={20} />
              <Text className="text-white text-sm font-semibold">
                Generate Meal
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                borderRadius: 16,
              }}
              className={clsx(
                colorScheme === "dark" && "dark",
                "flex-1 bg-primary h-12 rounded-lg flex-row gap-2 justify-center items-center"
              )}
              onPress={() => router.push("/log-meals")}
            >
              <MaterialCommunityIcons name="book" color="white" size={20} />
              <Text className="text-white text-sm font-semibold">Log Meal</Text>
            </TouchableOpacity>
          </View>

          {/* Previous Meals Section */}
          <View>
            <Text
              className={clsx(
                colorScheme === "dark" && "dark",
                "text-foreground font-bold text-xl mb-4"
              )}
            >
              Previous Meals
            </Text>

            {meals && meals.length === 0 ? (
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
                {meals?.map((meal) => (
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
                            colorScheme === "dark" ? "#4A5568" : "#F1F5F9",
                          borderRadius: 20,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <MaterialCommunityIcons
                          name="food"
                          size={20}
                          color={colorScheme === "dark" ? "#A0AEC0" : "#64748B"}
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
                        color={colorScheme === "dark" ? "#64748B" : "#94A3B8"}
                      />
                    </View>
                  </View>
                ))}
                <Text
                  className={clsx(
                    colorScheme === "dark" && "dark",
                    "text-muted-foreground self-center"
                  )} 
                  onPress={() => router.push("/meal-logs")}
                >
                 View More
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
