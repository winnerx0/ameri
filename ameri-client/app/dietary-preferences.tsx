import {
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useColorScheme } from "@/hooks/useColorScheme";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { clsx } from "clsx";
import { router } from "expo-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, BACKEND_URL } from "@/utils";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface DietaryData {
  dietaryRestrictions: string[];
  allergies: string[];
  preferredCuisines: string[];
  dislikedFoods: string[];
  healthGoals: string[];
  notes: string;
}

const DietaryPreferences = () => {
  const colorScheme = useColorScheme();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<DietaryData>({
    dietaryRestrictions: [],
    allergies: [],
    preferredCuisines: [],
    dislikedFoods: [],
    healthGoals: [],
    notes: "",
  });

  const [isNavigationReady, setIsNavigationReady] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsNavigationReady(true);
    }, 100);

    return () => clearTimeout(timer);
  }, [colorScheme]);

  const handleGoBack = () => {
    try {
      if (isNavigationReady && router.canGoBack()) {
        router.back();
      } else {
        router.replace("/(tabs)/home");
      }
    } catch (error) {
      console.log("Navigation error:", error);
      router.replace("/(tabs)/home");
    }
  };

  const dietaryOptions = {
    restrictions: [
      "Vegetarian",
      "Vegan",
      "Pescatarian",
      "Gluten-Free",
      "Dairy-Free",
      "Keto",
      "Paleo",
      "Low-Carb",
      "Low-Fat",
      "Low-Sodium",
      "Halal",
      "Kosher",
    ],
    allergies: [
      "Nuts",
      "Peanuts",
      "Shellfish",
      "Fish",
      "Eggs",
      "Dairy",
      "Soy",
      "Wheat",
      "Sesame",
      "Sulfites",
    ],
    cuisines: [
      "Italian",
      "Mexican",
      "Asian",
      "Indian",
      "Mediterranean",
      "American",
      "French",
      "Thai",
      "Japanese",
      "Chinese",
      "Greek",
      "Lebanese",
    ],
    goals: [
      "Weight Loss",
      "Weight Gain",
      "Muscle Building",
      "Heart Health",
      "Lower Cholesterol",
      "Blood Sugar Control",
      "Energy Boost",
      "Better Digestion",
    ],
  };

  // Fetch current dietary preferences
  const { isLoading } = useQuery({
    queryKey: ["user-dietary-preferences"],
    queryFn: async () => {
      const res = await api.get(BACKEND_URL + "/user/dietary-preferences");
      if (res.status !== 200)
        throw new Error("Failed to fetch dietary preferences");
       setFormData(
         res.data.data || {
           dietaryRestrictions: [],
           allergies: [],
           preferredCuisines: [],
           dislikedFoods: [],
           healthGoals: [],
           notes: "",
         }
       ); ;
    },
   
  });

  // Update dietary preferences mutation
  const { mutate: updateDietaryPreferences, isPending } = useMutation({
    mutationKey: ["update-dietary-preferences"],
    mutationFn: async (data: DietaryData) => {
      const res = await api.put(
        BACKEND_URL + "/user/dietary-preferences",
        data
      );
      if (res.status !== 200)
        throw new Error(res.data?.message || "Update failed");
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-data"] });
      queryClient.invalidateQueries({ queryKey: ["user-dietary-preferences"] });
      Alert.alert("Success", "Dietary preferences updated successfully!");
      handleGoBack();
    },
    onError: (error: any) => {
      console.log("Error updating dietary preferences:", error);
      Alert.alert(
        "Error",
        "Failed to update dietary preferences. Please try again."
      );
    },
  });

  const toggleItem = (category: keyof DietaryData, item: string) => {
    if (category === "notes") return;

    setFormData((prev) => ({
      ...prev,
      [category]: (prev[category] as string[]).includes(item)
        ? (prev[category] as string[]).filter((i) => i !== item)
        : [...(prev[category] as string[]), item],
    }));
  };

  const handleSave = () => {
    updateDietaryPreferences(formData);
  };

  const CategorySection = ({
    title,
    items,
    selected,
    category,
    icon,
  }: {
    title: string;
    items: string[];
    selected: string[];
    category: keyof DietaryData;
    icon: string;
  }) => (
    <View className="mb-6">
      <View className="flex-row items-center mb-3">
        <MaterialCommunityIcons
          name={icon as any}
          size={18}
          color={colorScheme === "dark" ? "white" : "black"}
        />
        <Text className="text-foreground font-medium ml-2 text-sm uppercase tracking-wide opacity-70">
          {title}
        </Text>
      </View>
      <View className="flex-row flex-wrap gap-2">
        {items.map((item) => (
          <TouchableOpacity
            key={item}
            onPress={() => toggleItem(category, item)}
            className={clsx(
              "px-4 py-2 rounded-full border",
              selected.includes(item)
                ? "bg-primary border-primary"
                : "bg-card border-border"
            )}
          >
            <Text
              className={clsx(
                "text-sm font-medium",
                selected.includes(item) ? "text-white" : "text-foreground"
              )}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaProvider>
        <SafeAreaView className="bg-background flex-1 items-center justify-center">
          <ActivityIndicator
            size="large"
            color={colorScheme === "dark" ? "white" : "black"}
          />
          <Text className="text-foreground mt-4">Loading preferences...</Text>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

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
            onPress={handleGoBack}
          >
            <MaterialCommunityIcons
              name="chevron-left"
              size={24}
              color={colorScheme === "dark" ? "white" : "black"}
            />
            <Text className="text-foreground text-base ml-1 font-medium">
              Back
            </Text>
          </TouchableOpacity>

          <Text className="font-bold text-foreground text-3xl mb-2">
            Dietary Preferences
          </Text>
          <Text className="text-muted-foreground text-base mb-6">
            Set your dietary restrictions and food preferences
          </Text>
        </View>

        <ScrollView
          className="flex-1 px-4"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 20, paddingBottom: 120 }}
        >
          <View className="space-y-6">
            <CategorySection
              title="Dietary Restrictions"
              items={dietaryOptions.restrictions}
              selected={formData.dietaryRestrictions}
              category="dietaryRestrictions"
              icon="food"
            />

            <CategorySection
              title="Allergies"
              items={dietaryOptions.allergies}
              selected={formData.allergies}
              category="allergies"
              icon="alert-circle"
            />

            <CategorySection
              title="Preferred Cuisines"
              items={dietaryOptions.cuisines}
              selected={formData.preferredCuisines}
              category="preferredCuisines"
              icon="earth"
            />

            <CategorySection
              title="Health Goals"
              items={dietaryOptions.goals}
              selected={formData.healthGoals}
              category="healthGoals"
              icon="target"
            />

            {/* Additional Notes */}
            <View>
              <View className="flex-row items-center mb-3">
                <MaterialCommunityIcons
                  name="note-text"
                  size={18}
                  color={colorScheme === "dark" ? "white" : "black"}
                />
                <Text className="text-foreground font-medium ml-2 text-sm uppercase tracking-wide opacity-70">
                  Additional Notes
                </Text>
              </View>
              <View className="relative">
                <MaterialCommunityIcons
                  name="pencil"
                  size={18}
                  color={colorScheme === "dark" ? "#9CA3AF" : "#6B7280"}
                  style={{ position: "absolute", left: 12, top: 13, zIndex: 1 }}
                />
                <TextInput
                  placeholder="Any other dietary notes or preferences..."
                  multiline
                  numberOfLines={4}
                  style={{
                    color: colorScheme === "dark" ? "#ffffff" : "#000000",
                    textAlignVertical: "top",
                  }}
                  placeholderTextColor={
                    colorScheme === "dark" ? "#9CA3AF" : "#6B7280"
                  }
                  className="border border-border rounded-xl px-3 pl-12 py-3 text-base h-28"
                  value={formData.notes}
                  onChangeText={(text) =>
                    setFormData((prev) => ({ ...prev, notes: text }))
                  }
                />
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Save Button */}
        <View className="absolute bottom-0 left-0 right-0 bg-background border-t border-border/50 p-4">
          <TouchableOpacity
            className={clsx(
              "bg-primary rounded-xl items-center justify-center h-14 shadow-lg",
              isPending && "opacity-50"
            )}
            disabled={isPending}
            onPress={handleSave}
          >
            {isPending ? (
              <View className="flex-row items-center">
                <ActivityIndicator size="small" color="white" />
                <Text className="text-white font-bold text-lg ml-2">
                  Saving...
                </Text>
              </View>
            ) : (
              <Text className="text-white font-bold text-lg">
                Save Preferences
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default DietaryPreferences;
