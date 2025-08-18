import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
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

/* 2. Helper for an empty food item */
const emptyFood = () => ({
  quantityInGrams: "",
  foodName: "",
  macros: { protein: 0, calories: 0, carbs: 0, fat: 0 },
});

const LogMeals = () => {
  const colorScheme = useColorScheme();

  /* 3. Start with one empty item */
  const [meal, setMeal] = useState<Meal>({
    id: "",
    mealType: MealType.BREAKFAST,
    items: [emptyFood()],
    loggedAt: new Date().toISOString(),
  });

  /* 4. Meal-type picker stays the same */
  const mealTypes = Object.values(MealType).filter(
    (k) => typeof k === "string"
  );

  /* 5. Update helpers that work by index */
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

  /* 6. TanStack mutation is unchanged */
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

  /* 7. Render */
  return (
    <SafeAreaProvider>
      <SafeAreaView
        className={clsx(
          colorScheme === "dark" ? "dark" : "",
          "bg-background h-full w-full"
        )}
      >
        <View className="w-full flex items-center relative px-2 h-full">
          {/* back button */}
          <TouchableOpacity
            className="text-foreground flex flex-row items-center mt-2 self-start"
            onPress={() => router.back()}
          >
            <MaterialCommunityIcons
              name="chevron-left"
              size={30}
              color={colorScheme === "dark" ? "white" : "black"}
            />
            <Text className="text-foreground text-sm ml-1">Back</Text>
          </TouchableOpacity>

          {/* heading */}
          <Text className="font-bold text-foreground text-2xl self-start mt-6 mb-4">
            Log Your Daily Meals
          </Text>

          {/* meal type dropdown – unchanged */}
          <SelectDropdown
            data={mealTypes}
            onSelect={(_, i) =>
              setMeal((p) => ({ ...p, mealType: mealTypes[i] }))
            }
            renderButton={(selectedItem, isOpened) => (
              <View className="bg-background w-full h-14 border border-border rounded-2xl flex flex-row items-center px-4 justify-between mb-4">
                <Text className="text-foreground">
                  {selectedItem || "Select the meal type"}
                </Text>
                <MaterialCommunityIcons
                  name={isOpened ? "chevron-up" : "chevron-down"}
                  color={colorScheme === "dark" ? "white" : "black"}
                  size={20}
                />
              </View>
            )}
            renderItem={(item) => (
              <View className="py-4 px-3 flex-1 items-center">
                <Text className="text-white">{item}</Text>
              </View>
            )}
            showsVerticalScrollIndicator={false}
            dropdownStyle={styles.dropdownMenuStyle}
            disableAutoScroll
          />

          {/* list of foods */}
          <FlatList
            className="w-full"
            data={meal.items}
            keyExtractor={(_, i) => String(i)}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View className="h-4" />}
            renderItem={({ item, index }) => (
              <View className="border border-border rounded-2xl p-3 mb-4 w-full">
                {/* row 1: food name */}
                <TextInput
                  placeholder="Enter meal name"
                  style={{
                    color: colorScheme === "dark" ? "#ffffff" : "#000000",
                  }}
                  placeholderTextColor={
                    colorScheme === "dark" ? "#9CA3AF" : "#6B7280"
                  }
                  className="border border-border rounded-2xl px-3 h-12 mb-2"
                  value={item.foodName}
                  onChangeText={(v) => updateItem(index, "foodName", v)}
                />

                {/* row 2: quantity */}
                <TextInput
                  placeholder="Quantity in grams"
                  keyboardType="numeric"
                  style={{
                    color: colorScheme === "dark" ? "#ffffff" : "#000000",
                  }}
                  placeholderTextColor={
                    colorScheme === "dark" ? "#9CA3AF" : "#6B7280"
                  }
                  className="border border-border rounded-2xl px-3 h-12 mb-2"
                  value={String(item.quantityInGrams)}
                  onChangeText={(v) => updateItem(index, "quantityInGrams", v)}
                />

                {/* macros – 2x2 grid */}
                <View className="flex-row justify-between gap-2">
                  <TextInput
                    placeholder="Calories"
                    keyboardType="numeric"
                    style={{
                      color: colorScheme === "dark" ? "#ffffff" : "#000000",
                    }}
                    placeholderTextColor={
                      colorScheme === "dark" ? "#9CA3AF" : "#6B7280"
                    }
                    className="border border-border rounded-2xl px-3 h-12 flex-1"
                    // value={String(item.macros.calories)}
                    onChangeText={(v) =>
                      updateMacro(index, "calories", parseInt(v) || 0)
                    }
                  />
                  <TextInput
                    placeholder="Fat"
                    keyboardType="numeric"
                    style={{
                      color: colorScheme === "dark" ? "#ffffff" : "#000000",
                    }}
                    placeholderTextColor={
                      colorScheme === "dark" ? "#9CA3AF" : "#6B7280"
                    }
                    className="border border-border rounded-2xl px-3 h-12 flex-1"
                    // value={String(item.macros.fat)}
                    onChangeText={(v) =>
                      updateMacro(index, "fat", parseInt(v) || 0)
                    }
                  />
                </View>

                <View className="flex-row justify-between gap-2 mt-2">
                  <TextInput
                    placeholder="Carbs"
                    keyboardType="numeric"
                    style={{
                      color: colorScheme === "dark" ? "#ffffff" : "#000000",
                    }}
                    placeholderTextColor={
                      colorScheme === "dark" ? "#9CA3AF" : "#6B7280"
                    }
                    className="border border-border rounded-2xl px-3 h-12 flex-1"
                    // value={String(item.macros.carbs)}
                    onChangeText={(v) =>
                      updateMacro(index, "carbs", parseInt(v) || 0)
                    }
                  />
                  <TextInput
                    placeholder="Protein"
                    keyboardType="numeric"
                    style={{
                      color: colorScheme === "dark" ? "#ffffff" : "#000000",
                    }}
                    placeholderTextColor={
                      colorScheme === "dark" ? "#9CA3AF" : "#6B7280"
                    }
                    className="border border-border rounded-2xl px-3 h-12 flex-1"
                    // value={String(item.macros.protein)}
                    onChangeText={(v) =>
                      updateMacro(index, "protein", parseInt(v) || 0)
                    }
                  />
                </View>

                {/* remove button */}
                {meal.items.length > 1 && (
                  <TouchableOpacity
                    className="mt-2 self-end"
                    onPress={() => removeFood(index)}
                  >
                    <MaterialCommunityIcons name="delete" size={24} color="red" />
                  </TouchableOpacity>
                )}
              </View>
            )}
            ListHeaderComponent={
              <TouchableOpacity
                className="bg-primary rounded-2xl h-14 items-center justify-center mb-12 w-full self-center"
                onPress={addFood}
              >
                <Text className="text-white font-semibold">
                  Add another food
                </Text>
              </TouchableOpacity>
            }
            contentContainerStyle={{ paddingBottom: 140 }}
          />

          {/* Save button – pinned to bottom */}
          <TouchableOpacity
            className="bg-primary w-full max-w-lg absolute bottom-10 rounded-2xl items-center justify-center h-14 disabled:opacity-50"
            disabled={isPending}
            onPress={() => handleLoggingMeal(meal)}
          >
            <Text className="text-white font-semibold">
              {isPending ? "Saving…" : "Save Meal"}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default LogMeals;

/* styles unchanged */
const styles = StyleSheet.create({
  dropdownButtonTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "200",
    color: "#151E26",
  },
  dropdownButtonArrowStyle: { fontSize: 28 },
  dropdownButtonIconStyle: { fontSize: 28, marginRight: 8 },
  dropdownMenuStyle: {
    backgroundColor: "hsl(var(--background))",
    borderRadius: 10,
  },
  dropdownItemStyle: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
  },
  dropdownItemTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "500",
    color: "#151E26",
  },
  dropdownItemIconStyle: { fontSize: 28, marginRight: 8 },
});
