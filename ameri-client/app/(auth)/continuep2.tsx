import {
  ScrollView,
  Alert,
  TouchableOpacity,
  TextInput,
  View,
  Text,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@react-navigation/native";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";

import { api, BACKEND_URL } from "@/utils";
import { useRegisterStore, useScreen } from "@/utils/store";

/* ---------- shape that ContinueP2 will now store ---------- */
interface ContinueP2DietaryData {
  dietaryRestrictions: string[];
  allergies: string[];
}

const ContinueP2 = () => {
  const { colors } = useTheme();
  const queryClient = useQueryClient();

  const { setScreen } = useScreen();

  const { registerData, updateField } = useRegisterStore();
  /* ---------- local state ---------- */
  const [formData, setFormData] = useState<ContinueP2DietaryData>({
    dietaryRestrictions: [],
    allergies: [],
  });

  const [isNavigationReady, setIsNavigationReady] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setIsNavigationReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  /* ---------- static option lists ---------- */
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
    goals: [],
  };

  /* ---------- mutation to save ---------- */
  const { mutate: updateContinueP2Dietary, isPending } = useMutation({
    mutationKey: ["update-continue-p2-dietary"],
    mutationFn: async (data: ContinueP2DietaryData) => {
      const res = await api.post(BACKEND_URL + "/auth/register", registerData);

      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["continue-p2-dietary"] });
      Alert.alert("Success", "Dietary data saved!");
      setScreen({ path: "otp" });
    },
    onError: () =>
      Alert.alert("Error", "Could not save dietary data. Please try again."),
  });

  /* ---------- helpers ---------- */
  const toggleItem = (category: keyof ContinueP2DietaryData, item: string) => {
    setFormData((prev) => {
      const updated = {
        ...prev,
        [category]: (prev[category] as string[]).includes(item)
          ? (prev[category] as string[]).filter((i) => i !== item)
          : [...(prev[category] as string[]), item],
      };
      updateField("healthConditions", updated);
      return updated;
    });
  };

  const handleSave = () => updateContinueP2Dietary(formData);

  /* ---------- reusable category section ---------- */
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
    category: keyof ContinueP2DietaryData;
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

  /* ---------- render ---------- */
  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={{ backgroundColor: colors.background }}
        className="h-full w-full"
      >
        {/* Header */}
        <ThemedView className="px-4 py-2 border-b border-border/50">
          <ThemedText className="text-base mb-6 opacity-70">
            Pick your restrictions, allergies, and health goals
          </ThemedText>
        </ThemedView>

        <ScrollView
          className="flex-1 px-4 flex flex-col gap-4"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 10, paddingBottom: 120 }}
        >
          <ThemedView className="flex flex-col gap-6">
            {/* 1. Dietary Restrictions */}
            <CategorySection
              title="Dietary Restrictions"
              items={dietaryOptions.restrictions}
              selected={registerData.healthConditions.dietaryRestrictions}
              category="dietaryRestrictions"
              icon="food"
            />

            {/* 2. Allergies */}
            <CategorySection
              title="Allergies"
              items={dietaryOptions.allergies}
              selected={registerData.healthConditions.allergies}
              category="allergies"
              icon="alert-circle"
            />
          </ThemedView>
          <View className="flex flex-col gap-6">
            <ThemedView className="flex items-start gap-2 self-center w-full">
              <ThemedText>Weight</ThemedText>
              <TextInput
                placeholder="Enter weight in kg"
                keyboardType="number-pad"
                value={
                  registerData.weight ? registerData.weight.toString() : ""
                }
                className="border border-border rounded-2xl px-2 h-14 py-2 w-full text-foreground"
                onChangeText={(weight) =>
                  updateField("weight", parseFloat(weight))
                }
                returnKeyType="done"
              />
            </ThemedView>
            <ThemedView className="flex items-start gap-2 self-center w-full">
              <ThemedText>Height</ThemedText>
              <TextInput
                placeholder="Enter height in cm"
                keyboardType="number-pad"
                value={
                  registerData.height ? registerData.height.toString() : ""
                }
                className="border border-border rounded-2xl px-2 h-14 py-2 w-full text-foreground"
                onChangeText={(height) =>
                  updateField("height", parseFloat(height))
                }
                returnKeyType="done"
              />
            </ThemedView>
          </View>
        </ScrollView>

        {/* Save Button */}
        <ThemedView className="absolute bottom-0 left-0 right-0 border-t border-border/50 p-4">
          <TouchableOpacity
            style={{
              backgroundColor: colors.primary,
              opacity: isPending ? 0.5 : 1,
            }}
            disabled={isPending}
            onPress={handleSave}
            className="rounded-xl items-center justify-center h-14 shadow-lg"
          >
            <Text className="text-white font-bold text-lg disabled:opacity-50">
              Save & Continue
            </Text>
          </TouchableOpacity>
        </ThemedView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default ContinueP2;
