import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { useColorScheme } from "@/hooks/useColorScheme";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { clsx } from "clsx";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { router } from "expo-router";
import SelectDropdown from "react-native-select-dropdown";
import { MealType } from "@/types";

const LogMeals = () => {
  const colorScheme = useColorScheme();

  const mealTypes = Object.values(MealType).filter(
    (key) => typeof key === "string"
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView
        className={clsx(
          colorScheme === "dark" ? "dark" : "",
          "bg-background h-screen flex flex-col px-4 items-center relative"
        )}
      >
        <TouchableOpacity
          className={clsx(
            colorScheme === "dark" && "dark",
            "text-foreground flex flex-row items-center mt-10 self-start"
          )}
          onPress={() => router.back()}
        >
          <Icon
            name="chevron-left"
            size={30}
            color={clsx(colorScheme === "dark" ? "white" : "black")}
          />

          <Text
            className={clsx(
              colorScheme === "dark" && "dark",
              "text-foreground text-sm flex flex-row items-center"
            )}
          >
            Go Back
          </Text>
        </TouchableOpacity>
        <View className="flex flex-col items-center gap-8 mt-4 w-full px-4">
          <Text
            className={clsx(
              colorScheme === "dark" && "dark",
              "font-bold text-foreground text-2xl self-start mt-10 mb-8"
            )}
          >
            Log Your Daily Meals
          </Text>

          <SelectDropdown
            data={mealTypes}
            onSelect={(selectedItem: string, index: number) => {
              // console.log(form);
              // setForm((prev) => ({...prev, goal: Object.values(Goal)[index]}))
            }}
            renderButton={(selectedItem: string, isOpened) => {
              return (
                <View className="bg-background w-full h-14 border border-border rounded-2xl flex flex-row items-center p-2 justify-between">
                  <Text className="text-foreground">
                    {selectedItem || "Select the meal type"}
                  </Text>
                  <Icon
                    name={isOpened ? "chevron-up" : "chevron-down"}
                    color={clsx(colorScheme === "dark" ? "white" : "black")}
                    size={20}
                  />
                </View>
              );
            }}
            renderItem={(item: string, index, isSelected) => {
              return (
                <View className="text-white flex gap-2 py-4 bg-background p-2 flex-1 flex-row items-center justify-center">
                  <Text className="text-white ">{item}</Text>
                </View>
              );
            }}
            showsVerticalScrollIndicator={false}
            dropdownStyle={styles.dropdownMenuStyle}
            disableAutoScroll
          />
          <TextInput
            placeholder="Enter meal name"
            style={{
              color: colorScheme === "dark" ? "#ffffff" : "#000000",
            }}
            placeholderTextColor={
              colorScheme === "dark" ? "#9CA3AF" : "#6B7280"
            }
            className="border border-border rounded-2xl px-2 h-14 py-2 w-full"
            // onChangeText={(email) => setData((prev) => ({ ...prev, email }))}
          />
          <TextInput
            placeholder="Enter quantity in grams"
            keyboardType="numeric"
            style={{
              color: colorScheme === "dark" ? "#ffffff" : "#000000",
            }}
            placeholderTextColor={
              colorScheme === "dark" ? "#9CA3AF" : "#6B7280"
            }
            className="border border-border rounded-2xl px-2 h-14 py-2 w-full"
            // onChangeText={(email) => setData((prev) => ({ ...prev, email }))}
          />
          <View className="flex flex-row col-span-2 items-center gap-2">
            <TextInput
              placeholder="Enter calories"
              keyboardType="numeric"
              style={{
                color: colorScheme === "dark" ? "#ffffff" : "#000000",
              }}
              placeholderTextColor={
                colorScheme === "dark" ? "#9CA3AF" : "#6B7280"
              }
              className="border border-border rounded-2xl px-2 h-14 py-2 w-1/2"
              // onChangeText={(email) => setData((prev) => ({ ...prev, email }))}
            />
            <TextInput
              placeholder="Enter fats"
              keyboardType="numeric"
              style={{
                color: colorScheme === "dark" ? "#ffffff" : "#000000",
              }}
              placeholderTextColor={
                colorScheme === "dark" ? "#9CA3AF" : "#6B7280"
              }
              className="border border-border rounded-2xl px-2 h-14 py-2 w-1/2"
              // onChangeText={(email) => setData((prev) => ({ ...prev, email }))}
            />
          </View>
          <View className="flex flex-row col-span-2 items-center gap-2">
            <TextInput
              placeholder="Enter carbs"
              keyboardType="numeric"
              style={{
                color: colorScheme === "dark" ? "#ffffff" : "#000000",
              }}
              placeholderTextColor={
                colorScheme === "dark" ? "#9CA3AF" : "#6B7280"
              }
              className="border border-border rounded-2xl px-2 h-14 py-2 w-1/2"
              // onChangeText={(email) => setData((prev) => ({ ...prev, email }))}
            />
            <TextInput
              placeholder="Enter protein"
              keyboardType="numeric"
              style={{
                color: colorScheme === "dark" ? "#ffffff" : "#000000",
              }}
              placeholderTextColor={
                colorScheme === "dark" ? "#9CA3AF" : "#6B7280"
              }
              className="border border-border rounded-2xl px-2 h-14 py-2 w-1/2"
              // onChangeText={(email) => setData((prev) => ({ ...prev, email }))}
            />
          </View>
        <TouchableOpacity className="bg-primary w-full absolute rounded-2xl items-center justify-center h-14 -bottom-36 disabled:opacity-50" disabled>
          <Text className="text-white">Save Meal</Text>
        </TouchableOpacity>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default LogMeals;

const styles = StyleSheet.create({
  dropdownButtonTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "200",
    color: "#151E26",
  },
  dropdownButtonArrowStyle: {
    fontSize: 28,
  },
  dropdownButtonIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
  dropdownMenuStyle: {
    backgroundColor: "hsl(var(--background))",
    borderRadius: 10,
  },
  dropdownItemStyle: {
    width: "100%",
    flexDirection: "row",
    paddingHorizontal: 12,
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
  dropdownItemIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
});
