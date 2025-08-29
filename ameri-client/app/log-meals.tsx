import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { useColorScheme } from "@/hooks/useColorScheme";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { clsx } from "clsx";
import { router } from "expo-router";
import SelectDropdown from "react-native-select-dropdown";
import { Macros, Meal, MealType } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { api, BACKEND_URL } from "@/utils";
import { MaterialCommunityIcons } from "@expo/vector-icons";

/* Helper for an empty food item */
const emptyFood = () => ({
  quantityInGrams: "",
  foodName: "",
  macros: { protein: 0, calories: 0, carbs: 0, fat: 0 },
});

const LogMeals = () => {
  const colorScheme = useColorScheme();

  const [meal, setMeal] = useState<Meal>({
    id: "",
    mealType: MealType.BREAKFAST,
    items: [emptyFood()],
    loggedAt: new Date().toISOString(),
  });

  const mealTypes = Object.values(MealType).filter(
    (k) => typeof k === "string"
  );

  const updateItem = (index: number, field: string, value: any) =>
    setMeal((prev) => {
      const copy = [...prev.items];
      copy[index] = { ...copy[index], [field]: value };
      return { ...prev, items: copy };
    });

  const updateMacro = (index: number, macro: keyof Macros, value: number) =>
    setMeal((prev) => {
      const copy = [...prev.items];
      copy[index] = {
        ...copy[index],
        macros: { ...copy[index].macros, [macro]: value },
      };
      return { ...prev, items: copy };
    });

  const addFood = () =>
    setMeal((prev) => ({ ...prev, items: [...prev.items, emptyFood()] }));

  const removeFood = (index: number) =>
    setMeal((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));

  const { mutate: handleLoggingMeal, isPending } = useMutation({
    mutationKey: ["log-meal"],
    mutationFn: async (meal: Meal) => {
      const res = await api.post(BACKEND_URL + "/meal/log-meal", meal);
      if (res.status !== 201) throw new Error(res.data);
    },
    onSuccess: () => router.back(),
    onError: (e) => {
      console.log(e);
    },
  });

  const MacroInput = ({
    placeholder,
    value,
    onChangeText,
    icon,
  }: {
    placeholder: string;
    value: number;
    onChangeText: (value: string) => void;
    icon: string;
  }) => (
    <View className="flex-1 relative">
      <MaterialCommunityIcons
        name={icon as any}
        size={16}
        color={colorScheme === "dark" ? "#9CA3AF" : "#6B7280"}
        style={{ position: "absolute", left: 12, top: 14, zIndex: 1 }}
      />
      <TextInput
        placeholder={placeholder}
        keyboardType="numeric"
        style={{
          color: colorScheme === "dark" ? "#ffffff" : "#000000",
        }}
        placeholderTextColor={colorScheme === "dark" ? "#9CA3AF" : "#6B7280"}
        className="border border-border rounded-xl px-3 pl-10 h-12"
        value={value > 0 ? String(value) : ""}
        onChangeText={onChangeText}
        returnKeyType="done"
      />
    </View>
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView
        className={clsx(
          colorScheme === "dark" ? "dark" : "",
          "bg-background h-full w-full"
        )}
      >
        {/* Header */}
        <View className="px-4 py-2 border-b border-border/50">
          <TouchableOpacity
            className="flex flex-row items-center mb-4"
            onPress={() => router.back()}
          >
            <MaterialCommunityIcons
              name="chevron-left"
              size={24}
              color={colorScheme === "dark" ? "white" : "black"}
            />
            <Text className="text-foreground text-base ml-2 font-medium">
              Back
            </Text>
          </TouchableOpacity>

          <Text className="font-bold text-foreground text-3xl ml-2 mb-2">
            Log Your Meals
          </Text>
          <Text className="text-muted-foreground text-base ml-2 mb-6">
            Track your daily nutrition intake
          </Text>

          {/* Meal Type Selection */}
          <SelectDropdown
            data={mealTypes}
            onSelect={(_, i) =>
              setMeal((p) => ({ ...p, mealType: mealTypes[i] }))
            }
            renderButton={(selectedItem, isOpened) => (
              <View
                className={clsx(
                  colorScheme === "dark" && "dark",
                  "bg-card border border-border rounded-xl flex flex-row items-center p-4 justify-between shadow-sm"
                )}
              >
                <View className="flex flex-row items-center">
                  <MaterialCommunityIcons
                    name="silverware-fork-knife"
                    size={20}
                    color={colorScheme === "dark" ? "white" : "black"}
                    style={{ marginRight: 12 }}
                  />
                  <Text className="text-foreground font-medium text-base">
                    {selectedItem || "Select meal type"}
                  </Text>
                </View>
                <MaterialCommunityIcons
                  name={isOpened ? "chevron-up" : "chevron-down"}
                  color={colorScheme === "dark" ? "white" : "black"}
                  size={20}
                />
              </View>
            )}
            renderItem={(item) => (
              <TouchableOpacity
                className={clsx(
                  colorScheme === "dark" && "dark",
                  "bg-background px-4 py-4 border-b border-border/30 last:border-b-0"
                )}
              >
                <Text className="text-foreground text-base font-medium">
                  {item}
                </Text>
              </TouchableOpacity>
            )}
            showsVerticalScrollIndicator={false}
            dropdownStyle={styles.dropdownMenuStyle}
            disableAutoScroll
          />
        </View>

        {/* Food Items List */}
        <ScrollView
          className="flex-1 px-4"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 20, paddingBottom: 120 }}
        >
          {meal.items.map((item, index) => (
            <View
              key={index}
              className="bg-card border border-border rounded-2xl p-4 mb-4 shadow-sm"
            >
              {/* Food Item Header */}
              <View className="flex flex-row items-center justify-between mb-4">
                <Text className="text-foreground font-semibold text-lg">
                  Food Item {index + 1}
                </Text>
                {meal.items.length > 1 && (
                  <TouchableOpacity
                    onPress={() => removeFood(index)}
                    className="p-1"
                  >
                    <MaterialCommunityIcons
                      name="close-circle"
                      size={24}
                      color="#EF4444"
                    />
                  </TouchableOpacity>
                )}
              </View>

              {/* Food Name Input */}
              <View className="mb-4">
                <Text className="text-foreground font-medium mb-2 text-sm uppercase tracking-wide opacity-70">
                  Food Name
                </Text>
                <View className="relative">
                  <MaterialCommunityIcons
                    name="food"
                    size={18}
                    color={colorScheme === "dark" ? "#9CA3AF" : "#6B7280"}
                    style={{
                      position: "absolute",
                      left: 12,
                      top: 13,
                      zIndex: 1,
                    }}
                  />
                  <TextInput
                    placeholder="Enter food name"
                    style={{
                      color: colorScheme === "dark" ? "#ffffff" : "#000000",
                    }}
                    placeholderTextColor={
                      colorScheme === "dark" ? "#9CA3AF" : "#6B7280"
                    }
                    className="border border-border rounded-xl px-3 pl-12 h-12 text-base"
                    value={item.foodName}
                    onChangeText={(v) => updateItem(index, "foodName", v)}
                  />
                </View>
              </View>

              {/* Quantity Input */}
              <View className="mb-4">
                <Text className="text-foreground font-medium mb-2 text-sm uppercase tracking-wide opacity-70">
                  Quantity
                </Text>
                <View className="relative">
                  <MaterialCommunityIcons
                    name="scale"
                    size={18}
                    color={colorScheme === "dark" ? "#9CA3AF" : "#6B7280"}
                    style={{
                      position: "absolute",
                      left: 12,
                      top: 13,
                      zIndex: 1,
                    }}
                  />
                  <TextInput
                    placeholder="Weight in grams"
                    keyboardType="numeric"
                    style={{
                      color: colorScheme === "dark" ? "#ffffff" : "#000000",
                    }}
                    placeholderTextColor={
                      colorScheme === "dark" ? "#9CA3AF" : "#6B7280"
                    }
                    className="border border-border rounded-xl px-3 pl-12 h-12 text-base"
                    value={String(item.quantityInGrams)}
                    onChangeText={(v) =>
                      updateItem(index, "quantityInGrams", v)
                    }
                  />
                </View>
              </View>

              {/* Macros Section */}
              <View>
                <Text className="text-foreground font-medium mb-3 text-sm uppercase tracking-wide opacity-70">
                  Nutrition Information
                </Text>

                <View className="space-y-3">
                  {/* Row 1: Calories & Fat */}
                  <View className="flex-row gap-3">
                    <MacroInput
                      placeholder="Calories"
                      value={item.macros.calories}
                      onChangeText={(v) =>
                        updateMacro(index, "calories", parseInt(v) || 0)
                      }
                      icon="fire"
                    />
                    <MacroInput
                      placeholder="Fat (g)"
                      value={item.macros.fat}
                      onChangeText={(v) =>
                        updateMacro(index, "fat", parseInt(v) || 0)
                      }
                      icon="water"
                    />
                  </View>

                  {/* Row 2: Carbs & Protein */}
                  <View className="flex-row gap-3">
                    <MacroInput
                      placeholder="Carbs (g)"
                      value={item.macros.carbs}
                      onChangeText={(v) =>
                        updateMacro(index, "carbs", parseInt(v) || 0)
                      }
                      icon="grain"
                    />
                    <MacroInput
                      placeholder="Protein (g)"
                      value={item.macros.protein}
                      onChangeText={(v) =>
                        updateMacro(index, "protein", parseInt(v) || 0)
                      }
                      icon="dumbbell"
                    />
                  </View>
                </View>
              </View>
            </View>
          ))}

          {/* Add Food Button */}
          <TouchableOpacity
            className="bg-secondary border-2 border-dashed border-primary/30 rounded-2xl h-16 items-center justify-center mb-4"
            onPress={addFood}
          >
            <View className="flex flex-row items-center">
              <MaterialCommunityIcons
                name="plus-circle"
                size={24}
                color={colorScheme === "dark" ? "white" : "black"}
              />
              <Text className="text-foreground font-semibold ml-2 text-base">
                Add Another Food
              </Text>
            </View>
          </TouchableOpacity>
        </ScrollView>

        {/* Save Button - Fixed at bottom */}
        <View className="sticky bottom-0 left-0 right-0 bg-background border-t border-border/50 p-4">
          <TouchableOpacity
            className={clsx(
              "bg-primary rounded-xl items-center justify-center h-14 shadow-lg",
              (isPending || Object.values(meal).some((v) => !v)) && "opacity-50"
            )}
            disabled={isPending || Object.values(meal).some((v) => !v)}
            onPress={() => handleLoggingMeal(meal)}
          >
            <Text className="text-white font-bold text-lg">
              {isPending ? "Saving..." : "Save Meal"}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default LogMeals;

const styles = StyleSheet.create({
  dropdownMenuStyle: {
    backgroundColor: "hsl(var(--background))",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "hsl(var(--border))",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
});
