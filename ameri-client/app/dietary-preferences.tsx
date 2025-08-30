import {
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@react-navigation/native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import Loading from "@/components/Loading";

import { api, BACKEND_URL, dietaryOptions } from "@/utils";
import { router } from "expo-router";
import { Text } from "react-native";

interface DietaryData {
  dietaryRestrictions: string[];
  allergies: string[];
  preferredCuisines: string[];
}

const DietaryPreferences = () => {
  const { colors } = useTheme();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<DietaryData>({
    dietaryRestrictions: [],
    allergies: [],
    preferredCuisines: [],
  });

  const handleGoBack = () => {
    router.back();
  };

  /* --- fetch current dietary preferences --- */
  const { data, isLoading } = useQuery({
    queryKey: ["user-dietary-preferences"],
    queryFn: async () => {
      try {
        const res = await api.get(BACKEND_URL + "/user/me", {
          validateStatus: (status) => status === 200,
        });
        if (res.status !== 200)
          throw new Error("Failed to fetch dietary preferences");

        const data = res.data.data.healthConditions || {
          dietaryRestrictions: [],
          allergies: [],
        };

        setFormData(data);

        return data as typeof dietaryOptions;
      } catch (error) {
        console.log(error);
      }
    },
  });

  console.log("data", formData);

  /* --- update dietary preferences mutation --- */
  const { mutate: updateDietaryPreferences, isPending } = useMutation({
    mutationKey: ["update-dietary-preferences"],
    mutationFn: async (data: DietaryData) => {
      const res = await api.put(BACKEND_URL + "/user/me", {
        healthConditions: data,
      });
      if (res.status !== 200)
        throw new Error(res.data?.message || "Update failed");
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-data"] });
      queryClient.invalidateQueries({ queryKey: ["user-dietary-preferences"] });
      Alert.alert("Success", "Dietary preferences updated!");
      handleGoBack();
    },
    onError: () =>
      Alert.alert(
        "Error",
        "Could not update your preferences. Please try again."
      ),
  });

  const toggleItem = (category: keyof DietaryData, item: string) => {
    setFormData((prev) => ({
      ...prev,
      [category]: (prev[category] as string[]).includes(item)
        ? (prev[category] as string[]).filter((i) => i !== item)
        : [...(prev[category] as string[]), item],
    }));
  };

  const handleSave = () => updateDietaryPreferences(formData);

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
    <ThemedView className="mb-6">
      <ThemedView className="flex-row items-center mb-3">
        <MaterialCommunityIcons
          name={icon as any}
          size={18}
          color={colors.text}
        />
        <ThemedText className="font-medium ml-2 text-sm uppercase tracking-wide opacity-70">
          {title}
        </ThemedText>
      </ThemedView>
      <ThemedView className="flex-row flex-wrap gap-2">
        {items.map((item) => (
          <TouchableOpacity
            key={item}
            onPress={() => toggleItem(category, item)}
            style={{
              backgroundColor: selected.includes(item)
                ? colors.primary
                : colors.card,
              borderColor: selected.includes(item)
                ? colors.primary
                : colors.border,
            }}
            className="px-4 py-2 rounded-full border"
          >
            <Text
              style={{
                color: selected.includes(item) ? "white" : colors.text,
              }}
              className="text-white text-sm font-medium"
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </ThemedView>
    </ThemedView>
  );

  if (isLoading) {
    return (
      <Loading/>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={{ backgroundColor: colors.background }}
        className="h-full w-full"
      >
        {/* Header */}
        <ThemedView className="px-4 py-2 border-b border-border/50">
          <TouchableOpacity
            className="flex flex-row items-center mb-4"
            onPress={handleGoBack}
          >
            <MaterialCommunityIcons
              name="chevron-left"
              size={24}
              color={colors.text}
            />
            <ThemedText className="text-base ml-1 font-medium">Back</ThemedText>
          </TouchableOpacity>

          <ThemedText className="font-bold text-3xl mb-2">
            Dietary Preferences
          </ThemedText>
          <ThemedText className="text-base mb-6 opacity-70">
            Set your dietary restrictions and food preferences
          </ThemedText>
        </ThemedView>

        <ScrollView
          className="flex-1 px-4"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 20, paddingBottom: 120 }}
        >
          <ThemedView className="space-y-6">
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

            {/* <CategorySection
              title="Preferred Cuisines"
              items={dietaryOptions.cuisines}
              selected={formData.preferredCuisines}
              category="preferredCuisines"
              icon="earth"
            /> */}

            {/* <CategorySection
              title="Health Goals"
              items={dietaryOptions.goals}
              selected={formData.healthGoals}
              category="healthGoals"
              icon="target"
            /> */}

            {/* Additional Notes */}
            <ThemedView>
              <ThemedView className="flex-row items-center mb-3">
                <MaterialCommunityIcons
                  name="note-text"
                  size={18}
                  color={colors.text}
                />
                <ThemedText className="font-medium ml-2 text-sm uppercase tracking-wide opacity-70">
                  Additional Notes
                </ThemedText>
              </ThemedView>
            </ThemedView>
          </ThemedView>
        </ScrollView>

        {/* Save Button */}
        <ThemedView className="sticky bottom-16 left-0 right-0 border-t border-border/50 p-4">
          <TouchableOpacity
            style={{
              backgroundColor: colors.primary,
              opacity: isPending ? 0.5 : 1,
            }}
            disabled={isPending}
            onPress={handleSave}
            className="rounded-xl items-center justify-center h-14 shadow-lg"
          >
            <Text
              className="text-white font-bold text-lg disabled:opacity-50"
              disabled={isPending}
            >
              Save Preferences
            </Text>
          </TouchableOpacity>
        </ThemedView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default DietaryPreferences;
