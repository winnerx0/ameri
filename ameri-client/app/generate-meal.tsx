import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  ActivityIndicator,
  Image,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { useColorScheme } from "@/hooks/useColorScheme";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { clsx } from "clsx";
import { router } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import { api, BACKEND_URL } from "@/utils";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";

interface DetectedIngredient {
  name: string;
  confidence: number;
  portion_size: string;
  macros_per_portion: {
    calories: string;
    protein: string;
    carbohydrates: string;
    fat: string;
  };
}

interface Recipe {
  type: string;
  name: string;
  description: string;
  ingredients_used: string[];
  instructions: string;
  macros_per_serving: {
    calories: string;
    protein: string;
    carbohydrates: string;
    fat: string;
  };
  suitable_for: string[];
  recipe_id: string;
}

interface GeneratedMealResponse {
  status: string;
  detected_ingredients: DetectedIngredient[];
  recipes: Recipe[];
}

const GenerateMeal = () => {
  const colorScheme = useColorScheme();

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [generatedMealData, setGeneratedMealData] =
    useState<GeneratedMealResponse | null>(null);

  const { mutate: generateMeal, isPending } = useMutation({
    mutationKey: ["generate-meal"],
    mutationFn: async (): Promise<GeneratedMealResponse> => {
      const formData = new FormData();

      if (selectedImage) {
        formData.append("file", {
          uri: selectedImage,
          type: "image/jpeg",
          name: "meal-image.jpg",
        } as any);
      }
      const res = await api.post("/meal/create-meal-recipes", formData);
      if (res.status !== 200) throw new Error(res.data);
      return res.data;
    },
    onSuccess: (data) => {
      setGeneratedMealData(data);
    },
    onError: (e) => {
      console.log("Error generating meal:", e);
      Alert.alert(
        "Error",
        "Failed to generate meal recipes. Please try again."
      );
    },
  });

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
        "Camera roll permissions are required to select images."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [9, 16],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
        "Camera permissions are required to take photos."
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,

      aspect: [9, 16],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const showImageOptions = () => {
    Alert.alert("Select Image", "Choose how you want to add an image", [
      { text: "Camera", onPress: takePhoto },
      { text: "Gallery", onPress: pickImage },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const getTotalMacros = (recipe: Recipe) => {
    const calories = parseInt(
      recipe.macros_per_serving.calories.replace("kcal", "")
    );
    const protein = parseInt(
      recipe.macros_per_serving.protein.replace("g", "")
    );
    const carbs = parseInt(
      recipe.macros_per_serving.carbohydrates.replace("g", "")
    );
    const fat = parseInt(recipe.macros_per_serving.fat.replace("g", ""));

    return { calories, protein, carbs, fat };
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView
        className={clsx(
          colorScheme === "dark" ? "dark" : "",
          "bg-background h-full w-full"
        )}
      >
        {/* Header */}
        <View className="px-4 py-2 border-b border-border/50 flex w-full">
          <Text className="font-semibold text-foreground text-3xl mb-2 self-center">
            Generate Recipes
          </Text>
        </View>

        <ScrollView
          className="flex-1 px-4"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 20, paddingBottom: 120 }}
        >
          {!generatedMealData ? (
            // Image Upload Section
            <View className="flex flex-col gap-6">
              {/* Image Upload */}
              <View>
                <Text className="text-foreground font-medium mb-3 text-sm uppercase tracking-wide opacity-70">
                  Upload Ingredients Photo
                </Text>

                {selectedImage ? (
                  <View className="relative">
                    <Image
                      source={{ uri: selectedImage }}
                      className="w-full h-64 rounded-2xl"
                      style={{ resizeMode: "cover" }}
                    />
                    <TouchableOpacity
                      className="absolute top-4 right-4 bg-red-500 rounded-full p-2"
                      onPress={() => setSelectedImage(null)}
                    >
                      <MaterialCommunityIcons
                        name="close"
                        size={20}
                        color="white"
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      className="absolute bottom-4 right-4 bg-black/50 rounded-full p-2"
                      onPress={showImageOptions}
                    >
                      <MaterialCommunityIcons
                        name="camera"
                        size={20}
                        color="white"
                      />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity
                    className="bg-card border-2 border-dashed border-border rounded-2xl h-64 items-center justify-center"
                    onPress={showImageOptions}
                  >
                    <MaterialCommunityIcons
                      name="camera-plus"
                      size={48}
                      color={colorScheme === "dark" ? "#9CA3AF" : "#6B7280"}
                    />
                    <Text className="text-muted-foreground font-medium text-lg mt-4">
                      Add Ingredients Photo
                    </Text>
                    <Text className="text-muted-foreground text-sm mt-2 text-center px-4">
                      Take a photo or select from gallery to identify
                      ingredients
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Generate Button */}
              <TouchableOpacity
                className={clsx(
                  "bg-primary rounded-xl items-center justify-center h-14 shadow-lg mt-6",
                  isPending && "opacity-50"
                )}
                disabled={isPending}
                onPress={() => generateMeal()}
              >
                {isPending ? (
                  <View className="flex-row items-center">
                    <ActivityIndicator size="small" color="white" />
                    <Text className="text-white font-bold text-lg ml-2">
                      Generating Meals...
                    </Text>
                  </View>
                ) : (
                  <View className="flex-row items-center">
                    {/* <MaterialCommunityIcons
                      name="sparkles"
                      size={20}
                      color="white"
                    /> */}
                    <Text className="text-white font-bold text-lg ml-2">
                      Generate Recipes
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          ) : (
            // Generated Recipes Display
            <View className="flex flex-col gap-6">
              {/* Success Header */}
              <View className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
                <View className="flex-row items-center mb-2">
                  <MaterialCommunityIcons
                    name="check-circle"
                    size={24}
                    color="#10B981"
                  />
                  <Text className="text-green-800 dark:text-green-300 font-bold text-lg ml-2">
                    Recipes Generated Successfully!
                  </Text>
                </View>
                <Text className="text-green-700 dark:text-green-400">
                  Found {generatedMealData.detected_ingredients.length}{" "}
                  ingredients and created {generatedMealData.recipes.length}{" "}
                  recipes
                </Text>
              </View>

              {/* Detected Ingredients */}
              <View className="bg-card border border-border rounded-2xl p-4 shadow-sm">
                <View className="flex-row items-center mb-4">
                  <MaterialCommunityIcons
                    name="food"
                    size={20}
                    color={colorScheme === "dark" ? "white" : "black"}
                  />
                  <Text className="text-foreground font-bold text-lg ml-2">
                    Detected Ingredients
                  </Text>
                </View>

                <View className="flex-row flex-wrap gap-2">
                  {generatedMealData.detected_ingredients.map(
                    (ingredient, index) => (
                      <View
                        key={index}
                        className="bg-primary/10 border border-primary/20 rounded-full px-3 py-2"
                      >
                        <Text className="text-primary font-medium text-sm">
                          {ingredient.name} ({ingredient.confidence}%)
                        </Text>
                      </View>
                    )
                  )}
                </View>
              </View>

              {/* Recipe Cards */}
              {generatedMealData.recipes.map((recipe, index) => {
                const macros = getTotalMacros(recipe);
                return (
                  <View
                    key={index}
                    className="bg-card border border-border rounded-2xl p-4 shadow-sm"
                  >
                    {/* Recipe Header */}
                    <View className="flex-row items-start justify-between mb-3">
                      <View className="flex-1">
                        <View className="flex-row items-center mb-2">
                          <MaterialCommunityIcons
                            name={
                              recipe.type === "Salad"
                                ? "leaf"
                                : "silverware-fork-knife"
                            }
                            size={18}
                            color={colorScheme === "dark" ? "white" : "black"}
                          />
                          <Text className="text-foreground font-bold text-lg ml-2">
                            {recipe.name}
                          </Text>
                        </View>
                        <Text className="text-muted-foreground text-sm leading-5">
                          {recipe.description}
                        </Text>
                      </View>
                      <View className="bg-primary/10 rounded-full px-3 py-1 ml-3">
                        <Text className="text-primary font-semibold text-xs uppercase">
                          {recipe.type}
                        </Text>
                      </View>
                    </View>

                    {/* Macros */}
                    <View className="bg-secondary/50 rounded-xl p-3 mb-4">
                      <Text className="text-foreground font-semibold mb-2">
                        Nutrition per serving:
                      </Text>
                      <View className="flex-row justify-between">
                        <Text className="text-sm text-muted-foreground">
                          🔥 {macros.calories} cal
                        </Text>
                        <Text className="text-sm text-muted-foreground">
                          🥩 {macros.protein}g protein
                        </Text>
                        <Text className="text-sm text-muted-foreground">
                          🌾 {macros.carbs}g carbs
                        </Text>
                        <Text className="text-sm text-muted-foreground">
                          🥑 {macros.fat}g fat
                        </Text>
                      </View>
                    </View>

                    {/* Ingredients Used */}
                    <View className="mb-4">
                      <Text className="text-foreground font-semibold mb-2">
                        Ingredients used:
                      </Text>
                      <Text className="text-muted-foreground text-sm">
                        {recipe.ingredients_used.join(", ")}
                      </Text>
                    </View>

                    {/* Instructions */}
                    <View className="mb-4">
                      <Text className="text-foreground font-semibold mb-2">
                        Instructions:
                      </Text>
                      <Text className="text-muted-foreground text-sm leading-5">
                        {recipe.instructions}
                      </Text>
                    </View>

                    {/* Suitable For Tags */}
                    <View>
                      <Text className="text-foreground font-semibold mb-2">
                        Perfect for:
                      </Text>
                      <View className="flex-row flex-wrap gap-2">
                        {recipe.suitable_for.map((tag, tagIndex) => (
                          <View
                            key={tagIndex}
                            className="bg-green-100 dark:bg-green-900/30 rounded-full px-2 py-1"
                          >
                            <Text className="text-green-700 dark:text-green-300 text-xs font-medium capitalize">
                              {tag.replace("-", " ")}
                            </Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  </View>
                );
              })}

              {/* Action Button */}
              <TouchableOpacity
                className="bg-primary border border-border rounded-2xl items-center justify-center h-14"
                onPress={() => {
                  setGeneratedMealData(null);
                  setSelectedImage(null);
                }}
              >
                <Text className="text-white  font-semibold">
                  Generate New Recipes
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default GenerateMeal;

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
