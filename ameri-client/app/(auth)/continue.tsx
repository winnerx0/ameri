import { TouchableOpacity, StyleSheet, TextInput } from "react-native";
import { Link } from "expo-router";
import SelectDropdown from "react-native-select-dropdown";
import { Gender, Goal } from "@/types";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRegisterStore, useScreen } from "@/utils/store";
import { useTheme } from "@react-navigation/native";

import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Text } from "react-native";

export default function ContinueScreen() {
  const { colors } = useTheme();
  const { setScreen } = useScreen();

  const genders = Object.values(Gender);
  const goals   = Object.values(Goal);

  const { registerData, updateField } = useRegisterStore();

  const formatDateInput = (str: string): string => {
    const cleaned = str.replace(/\D/g, "");
    if (cleaned.length <= 4) return cleaned;
    if (cleaned.length <= 6)
      return `${cleaned.slice(0, 4)}-${cleaned.slice(4)}`;
    return `${cleaned.slice(0, 4)}-${cleaned.slice(4, 6)}-${cleaned.slice(
      6,
      8
    )}`;
  };

  const {
    username,
    password,
    healthConditions,
    height,
    weight,
    email,
    ...cleanedData
  } = registerData;

  return (
    <ThemedView className="flex flex-col gap-6 items-center">
      {/* Gender */}
      <ThemedView className="flex items-start gap-2">
        <ThemedText>Gender</ThemedText>
        <SelectDropdown
          data={genders}
          onSelect={(_, index) =>
            updateField("gender", Object.keys(Gender)[index])
          }
          renderButton={(selectedItem, isOpened) => (
            <ThemedView
              className="w-[350px] h-14 border border-border rounded-2xl flex-row items-center p-2 justify-between"
            >
              <ThemedText>
                {registerData.gender
                  ? `${
                      registerData.gender.charAt(0).toUpperCase() +
                      registerData.gender.slice(1).toLowerCase()
                    }`
                  : "Select your gender"}
              </ThemedText>
              <MaterialCommunityIcons
                name={isOpened ? "chevron-up" : "chevron-down"}
                color={colors.text}
                size={24}
              />
            </ThemedView>
          )}
          renderItem={(_, index) => (
            <TouchableOpacity
               style={{backgroundColor:colors.background}}
              className="w-[350px] h-14 items-center justify-center"
            >
              <ThemedText>{genders[index]}</ThemedText>
            </TouchableOpacity>
          )}
          showsVerticalScrollIndicator={false}
          dropdownStyle={[styles.dropdownMenuStyle, { backgroundColor: colors.background }]}
          disableAutoScroll
        />
      </ThemedView>

      {/* Date of Birth */}
      <ThemedView className="flex items-start gap-2">
        <ThemedText>Date Of Birth</ThemedText>
        <ThemedView border="text"  className="w-[350px] h-14 border border-border rounded-2xl flex-row items-center p-2 justify-between">
          
        <TextInput
          placeholder="YYYY-MM-DD"
          keyboardType="number-pad"
          maxLength={10}
          value={formatDateInput(registerData.dateOfBirth)}
          onChangeText={(date) => updateField("dateOfBirth", date)}
            style={{ color: colors.text }}
          className="rounded-2xl px-2 h-full py-2 w-[350px]"
          returnKeyType="done"
        />
        </ThemedView>
      </ThemedView>

      {/* Goal */}
      <ThemedView className="flex items-start gap-2">
        <ThemedText>Goal</ThemedText>
        <SelectDropdown
          data={goals}
          onSelect={(_, index) =>
            updateField("goal", Object.keys(Goal)[index])
          }
          renderButton={(selectedItem, isOpened) => (
            <ThemedView
              className="w-[350px] h-14 border border-border rounded-2xl flex-row items-center p-2 justify-between"
            >
              <ThemedText >
                
                {registerData.goal
                  ? `${
                      registerData.goal.charAt(0).toUpperCase() +
                      registerData.goal
                        .slice(1)
                        .replace("_", " ")
                        .toLowerCase()
                    }`
                  : "Select your goal"}
              </ThemedText>
              <MaterialCommunityIcons
                name={isOpened ? "chevron-up" : "chevron-down"}
                color={colors.text}
                size={24}
              />
            </ThemedView>
          )}
          renderItem={(_, index) => (
            <TouchableOpacity
           style={{backgroundColor:colors.background}}
              className="w-[350px] h-14 items-center justify-center"
            >
              <ThemedText>{goals[index]}</ThemedText>
            </TouchableOpacity>
          )}
          showsVerticalScrollIndicator={false}
          dropdownStyle={[styles.dropdownMenuStyle, { backgroundColor: colors.background }]}
          disableAutoScroll
        />
      </ThemedView>

      <TouchableOpacity
        style={{ backgroundColor: colors.primary }}
        className="mt-8 w-[350px] h-14 rounded-2xl items-center justify-center disabled:opacity-40"
        disabled={Object.values(cleanedData).some((v) => !v)}
        onPress={() => setScreen({ path: "continueP2" })}
      >
        <Text className="text-white">Continue</Text>
      </TouchableOpacity>

     
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  dropdownMenuStyle: {
    borderRadius: 10,
  },
});