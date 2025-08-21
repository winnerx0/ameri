import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  ScrollView,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { clsx } from "clsx";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useColorScheme } from "@/hooks/useColorScheme";
import { router, useLocalSearchParams } from "expo-router";
import { MealRecepie } from "@/types";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { api, BACKEND_URL } from "@/utils";
import FormData from "form-data";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

const MealData = () => {
  const colorScheme = useColorScheme();
  const { photoUri }: { photoUri: string } = useLocalSearchParams();

  console.log(photoUri);

  const { data, isLoading, error } = useQuery({
    queryKey: ["fetch-meal-data", photoUri],
    queryFn: async () => {
      let file;

      if (Platform.OS === "web") {
        file = await uriToFile(photoUri, "image.png");
      } else if (Platform.OS === "android" || Platform.OS === "ios") {
        file = {
          uri: photoUri,
          name: "image.png",
          type: "image/png",
        };
      }

      console.log("this is the file", file);

      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await api.post(
          BACKEND_URL + "/meal/get-meal-metadata",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (res.status !== 200) {
          throw new Error(res.data);
        }

        const data: MealRecepie = res.data;

        return data;
      } catch (error) {
        console.error("error ", error);

        if (error instanceof AxiosError) {
          throw new Error(error.response?.data);
        }
        if (error instanceof Error) {
          throw new Error(error.message);
        }
      }
    },
  });

  const { mutate: handleSaveMealLog, isPending } = useMutation({
    mutationKey: ["log-meal"],
    mutationFn: async () => {
      let meal;
      if (data?.status === "Accepted") {
        meal = {
          mealType: data.meal_type,
          items: [
            {
              foodName: data.cuisine,
              quantityInGrams: data.portion_size,
              macros: {
                carbs: parseFloat(data.macronutrients.carbohydrates),
                protein: parseFloat(data.macronutrients.protein),
                fat: parseFloat(data.macronutrients.fat),
                calories: parseFloat(data.calories),
              },
            },
          ],
        };
      }
      const res = await api.post(BACKEND_URL + "/meal/log-meal", meal);
      if (res.status === 201) {
        throw new Error(res.data);
      }
    },
    onSuccess: () => {
      router.replace("/")
    },
    onError: (e) => {
      console.error(e.message);
    },
  });
  async function uriToFile(uri: string, filename: string) {
    const response = await fetch(uri);
    const blob = await response.blob();
    return new File([blob], filename, { type: blob.type });
  }

  // Loading Component
  const LoadingComponent = () => (
    <View
      className={clsx(
        colorScheme === "dark" && "dark",
        "bg-background",
        "h-full flex items-center justify-center px-6"
      )}
    >
      <View className="items-center">
        <MaterialCommunityIcons
          name="food"
          size={64}
          color={colorScheme === "dark" ? "#3B82F6" : "#1D4ED8"}
        />
        <Text
          className={clsx(
            "text-2xl font-bold mt-4",
            colorScheme === "dark" ? "text-white" : "text-slate-800"
          )}
        >
          Analyzing Your Meal
        </Text>
        <Text
          className={clsx(
            "text-base mt-2 text-center",
            colorScheme === "dark" ? "text-slate-300" : "text-slate-600"
          )}
        >
          Please wait while we process your image...
        </Text>
      </View>
    </View>
  );

  // Info Card Component
  const InfoCard = ({
    title,
    children,
    icon,
  }: {
    title: string;
    children: React.ReactNode;
    icon: any;
  }) => (
    <View
      className={clsx(
        "rounded-xl p-4 mb-4 shadow-sm",
        colorScheme === "dark"
          ? "bg-slate-800 border border-slate-700"
          : "bg-white border border-blue-100"
      )}
    >
      <View className="flex-row items-center mb-3">
        <MaterialCommunityIcons
          name={icon}
          size={20}
          color={colorScheme === "dark" ? "#60A5FA" : "#2563EB"}
        />
        <Text
          className={clsx(
            "text-lg font-semibold ml-2",
            colorScheme === "dark" ? "text-white" : "text-slate-800"
          )}
        >
          {title}
        </Text>
      </View>
      {children}
    </View>
  );

  // Rejected Meal Component
  const RejectedMeal = () => (
    <View className="flex-1 items-center justify-center px-6">
      <View
        className={clsx(
          "rounded-2xl p-8 items-center w-full max-w-sm",
          colorScheme === "dark" ? "bg-red-700/20" : "bg-red-50"
        )}
      >
        <MaterialCommunityIcons
          name="alert-circle"
          size={64}
          color={colorScheme === "dark" ? "#F87171" : "#DC2626"}
        />
        <Text
          className={clsx(
            "text-2xl font-bold mt-4 text-center",
            colorScheme === "dark" ? "text-red-400" : "text-red-700"
          )}
        >
          {data?.status}
        </Text>
        <Text
          className={clsx(
            "text-base mt-2 text-center",
            colorScheme === "dark" ? "text-red-300" : "text-red-600"
          )}
        >
          {(data?.status === "Rejected" && data.reason) ||
            "Unable to identify this meal"}
        </Text>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaProvider>
        <SafeAreaView
          className={clsx(
            colorScheme === "dark" && "dark",
            "bg-background h-full"
          )}
        >
          <LoadingComponent />
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView
        className={clsx(
          colorScheme === "dark" && "dark",
          "bg-background h-full"
        )}
      >
        {/* Header */}
        <View className="px-4 py-2">
          <TouchableOpacity
            className="flex-row items-center"
            onPress={() => router.back()}
          >
            <MaterialCommunityIcons
              name="chevron-left"
              size={28}
              color={colorScheme === "dark" ? "#60A5FA" : "#2563EB"}
            />
            <Text
              className={clsx(
                "text-base font-medium ml-1",
                colorScheme === "dark" ? "text-blue-400" : "text-blue-600"
              )}
            >
              Back
            </Text>
          </TouchableOpacity>
        </View>

        {data && data.status === "Rejected" ? (
          <RejectedMeal />
        ) : (
          <ScrollView
            className="flex-1 px-4 py-4"
            showsVerticalScrollIndicator={false}
          >
            {/* Hero Section */}
            <View
              className={clsx(
                "rounded-2xl p-6 mb-6 items-center shadow-lg",
                colorScheme === "dark"
                  ? "bg-gradient-to-br from-blue-900 to-blue-800"
                  : "bg-gradient-to-br from-blue-500 to-blue-600"
              )}
            >
              <MaterialCommunityIcons
                name="check-circle"
                size={48}
                color={colorScheme === "dark" ? "#60A5DD" : "#2563EB"}
              />
              <Text
                className={clsx(
                  colorScheme === "dark" && "dark",
                  "text-foreground text-2xl font-bold"
                )}
              >
                {data?.status}
              </Text>
              <Text
                className={clsx(
                  colorScheme === "dark" && "dark",
                  "text-muted-foreground text-sm font-bold"
                )}
              >
                Confidence: {data?.confidence}
              </Text>
            </View>

            {/* Basic Info */}
            <View className="flex-row gap-3 mb-4">
              <View
                className={clsx(
                  "flex-1 rounded-xl p-4 items-center",
                  colorScheme === "dark"
                    ? "bg-slate-800 border border-slate-700"
                    : "bg-white border border-blue-100"
                )}
              >
                <MaterialCommunityIcons
                  name="clock-outline"
                  size={24}
                  color={colorScheme === "dark" ? "#60A5FA" : "#2563EB"}
                />
                <Text
                  className={clsx(
                    "font-semibold mt-2",
                    colorScheme === "dark" ? "text-white" : "text-slate-800"
                  )}
                >
                  {data?.meal_type}
                </Text>
                <Text
                  className={clsx(
                    "text-sm",
                    colorScheme === "dark" ? "text-slate-400" : "text-slate-600"
                  )}
                >
                  Meal Type
                </Text>
              </View>

              <View
                className={clsx(
                  "flex-1 rounded-xl p-4 items-center",
                  colorScheme === "dark"
                    ? "bg-slate-800 border border-slate-700"
                    : "bg-white border border-blue-100"
                )}
              >
                <MaterialCommunityIcons
                  name="earth"
                  size={24}
                  color={colorScheme === "dark" ? "#60A5FA" : "#2563EB"}
                />
                <Text
                  className={clsx(
                    "font-semibold mt-2",
                    colorScheme === "dark" ? "text-white" : "text-slate-800"
                  )}
                >
                  {data?.cuisine}
                </Text>
                <Text
                  className={clsx(
                    "text-sm",
                    colorScheme === "dark" ? "text-slate-400" : "text-slate-600"
                  )}
                >
                  Cuisine
                </Text>
              </View>
            </View>

            {/* Food Items */}
            <InfoCard title="Identified Items" icon="food-variant">
              {data?.items?.map((item, index) => (
                <View key={index} className="flex-row items-center mb-2">
                  <View
                    className={clsx(
                      "w-2 h-2 rounded-full mr-3",
                      colorScheme === "dark" ? "bg-blue-400" : "bg-blue-500"
                    )}
                  />
                  <Text
                    className={clsx(
                      "text-base flex-1",
                      colorScheme === "dark"
                        ? "text-slate-200"
                        : "text-slate-700"
                    )}
                  >
                    {item}
                  </Text>
                </View>
              ))}
            </InfoCard>

            {/* Nutrition Overview */}
            <InfoCard title="Nutrition Overview" icon="nutrition">
              <View className="flex-row justify-between mb-3">
                <Text
                  className={clsx(
                    "text-base",
                    colorScheme === "dark" ? "text-slate-300" : "text-slate-600"
                  )}
                >
                  Calories
                </Text>
                <Text
                  className={clsx(
                    "text-base font-semibold",
                    colorScheme === "dark" ? "text-white" : "text-slate-800"
                  )}
                >
                  {data?.calories}
                </Text>
              </View>
              <View className="flex-row justify-between mb-3">
                <Text
                  className={clsx(
                    "text-base",
                    colorScheme === "dark" ? "text-slate-300" : "text-slate-600"
                  )}
                >
                  Portion Size
                </Text>
                <Text
                  className={clsx(
                    "text-base font-semibold",
                    colorScheme === "dark" ? "text-white" : "text-slate-800"
                  )}
                >
                  {data?.portion_size}
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text
                  className={clsx(
                    "text-base",
                    colorScheme === "dark" ? "text-slate-300" : "text-slate-600"
                  )}
                >
                  Water Content
                </Text>
                <Text
                  className={clsx(
                    "text-base font-semibold",
                    colorScheme === "dark" ? "text-white" : "text-slate-800"
                  )}
                >
                  {data?.water_content}
                </Text>
              </View>
            </InfoCard>

            {/* Macronutrients */}
            <InfoCard title="Macronutrients" icon="chart-pie">
              <View className="flex flex-col gap-2">
                {Object.entries(data?.macronutrients || {}).map(
                  ([key, value]) => (
                    <View
                      key={key}
                      className="flex-row justify-between items-center"
                    >
                      <Text
                        className={clsx(
                          "text-base capitalize",
                          colorScheme === "dark"
                            ? "text-slate-300"
                            : "text-slate-600"
                        )}
                      >
                        {key}
                      </Text>
                      <View
                        className={clsx(
                          "px-3 py-1 rounded-full",
                          colorScheme === "dark"
                            ? "bg-blue-900/50"
                            : "bg-blue-100"
                        )}
                      >
                        <Text
                          className={clsx(
                            "text-sm font-semibold",
                            colorScheme === "dark"
                              ? "text-blue-300"
                              : "text-blue-800"
                          )}
                        >
                          {value}
                        </Text>
                      </View>
                    </View>
                  )
                )}
              </View>
            </InfoCard>

            {/* Vitamins */}
            <InfoCard title="Vitamins" icon="pill">
              <View className="flex-row flex-wrap gap-2">
                {Object.entries(data?.vitamins || {}).map(([key, value]) => (
                  <View
                    key={key}
                    className={clsx(
                      "px-3 py-2 rounded-lg flex-row items-center",
                      colorScheme === "dark" ? "bg-slate-700" : "bg-blue-50"
                    )}
                  >
                    <Text
                      className={clsx(
                        "text-sm font-semibold mr-1",
                        colorScheme === "dark"
                          ? "text-blue-300"
                          : "text-blue-700"
                      )}
                    >
                      {key.toUpperCase()}:
                    </Text>
                    <Text
                      className={clsx(
                        "text-sm",
                        colorScheme === "dark"
                          ? "text-slate-300"
                          : "text-slate-600"
                      )}
                    >
                      {value}
                    </Text>
                  </View>
                ))}
              </View>
            </InfoCard>

            {/* Minerals */}
            <InfoCard title="Minerals" icon="diamond-stone">
              <View className="flex-row flex-wrap gap-2">
                {Object.entries(data?.minerals || {}).map(([key, value]) => (
                  <View
                    key={key}
                    className={clsx(
                      "px-3 py-2 rounded-lg flex-row items-center",
                      colorScheme === "dark" ? "bg-slate-700" : "bg-blue-50"
                    )}
                  >
                    <Text
                      className={clsx(
                        "text-sm font-semibold mr-1 capitalize",
                        colorScheme === "dark"
                          ? "text-blue-300"
                          : "text-blue-700"
                      )}
                    >
                      {key}:
                    </Text>
                    <Text
                      className={clsx(
                        "text-sm",
                        colorScheme === "dark"
                          ? "text-slate-300"
                          : "text-slate-600"
                      )}
                    >
                      {value}
                    </Text>
                  </View>
                ))}
              </View>
            </InfoCard>

            {/* Bottom spacing */}
            <View className="h-6" />
            <TouchableOpacity
              onPress={() => handleSaveMealLog()}
              disabled={isPending}
              className="w-full bg-primary h-14 rounded-lg flex items-center justify-center"
            >
              <Text className="font-bold text-white">Add Meal To Log</Text>
            </TouchableOpacity>
          </ScrollView>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default MealData;
