import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Link, router } from "expo-router";
import { useState } from "react";
import SelectDropdown from "react-native-select-dropdown";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Gender, Goal } from "@/types";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { clsx } from "clsx";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useRegisterStore } from "@/utils/store";

export default function ContinueScreen() {
  const colorScheme = useColorScheme();
  const [form, setForm] = useState({
    gender: "",
    goal: "",
  });

  const [date, setDate] = useState("");

  const genders = Object.values(Gender);
  const goals = Object.values(Goal);

  const { updateField } = useRegisterStore();

  function insertAt(str: string, index: number, char: string) {
    return str.slice(0, index) + char + str.slice(index);
  }

  function formatDateString(date: string) {
    const numbersOnly = date.replace(/\D/g, "");

    if (numbersOnly.length >= 8) {
      return insertAt(insertAt(numbersOnly, 4, "-"), 7, "-");
    } else if (numbersOnly.length >= 4) {
      return insertAt(numbersOnly, 4, "-");
    }
    return numbersOnly;
  }

  return (
    <View className="flex flex-col gap-6 items-center">
      <View className="flex items-start gap-2">
        <Text className="text-foreground">Gender</Text>
        <SelectDropdown
          data={genders}
          onSelect={(selectedItem: Gender, index: number) => {
            setForm((prev) => ({
              ...prev,
              gender: Object.keys(Gender)[index],
            }));
            updateField("gender", Object.values(Gender)[index]);
          }}
          renderButton={(selectedItem: Goal, isOpened) => {
            return (
              <View className="bg-background w-[350px] h-14 border border-border rounded-2xl flex flex-row items-center p-2 justify-between">
                <Text className="text-foreground">
                  {selectedItem || "Select your gender"}
                </Text>
                <MaterialCommunityIcons
                  name={isOpened ? "chevron-up" : "chevron-down"}
                  className="text-white"
                />
              </View>
            );
          }}
          renderItem={(item: Goal, index, isSelected) => {
            return (
              <View className="text-white flex gap-2 py-4 bg-background p-2 flex-1 flex-row items-center justify-center">
                <Text
                  className={clsx(
                    colorScheme === "dark" && "dark",
                    "text-foreground text-base"
                  )}
                >
                  {genders[index]}
                </Text>
              </View>
            );
          }}
          showsVerticalScrollIndicator={false}
          dropdownStyle={styles.dropdownMenuStyle}
          disableAutoScroll
        />
      </View>
      <View className="flex items-start gap-2">
        <Text className="text-foreground">Date Of Birth</Text>
        <TextInput
          placeholder="YYYY-MM-DD"
          keyboardType="number-pad"
          value={formatDateString(date)}
          maxLength={10}
          className="border border-border rounded-2xl px-2 h-14 py-2 w-[350px] text-foreground"
          onChangeText={(date) => setDate(date)}
        />
      </View>
      <View className="flex items-start gap-2">
        <Text className="text-foreground">Goal</Text>
        <SelectDropdown
          data={goals}
          onSelect={(selectedItem: Goal, index: number) => {
            setForm((prev) => ({ ...prev, goal: Object.keys(Goal)[index] }));
            updateField("goal", Object.values(Goal)[index]);
          }}
          renderButton={(selectedItem: Goal, isOpened) => {
            return (
              <View className="bg-background w-[350px] h-14 border border-border rounded-2xl flex flex-row items-center p-2 justify-between">
                <Text className="text-foreground">
                  {selectedItem || "Select your goal"}
                </Text>
                <MaterialCommunityIcons
                  name={isOpened ? "chevron-up" : "chevron-down"}
                  className="text-white"
                />
              </View>
            );
          }}
          renderItem={(item: Goal, index, isSelected) => {
            console.log(goals[index]);
            return (
              <View className="text-white flex gap-2 py-4 bg-background p-2 flex-1 flex-row items-center justify-center">
                <Text
                  className={clsx(
                    colorScheme === "dark" && "dark",
                    "text-foreground text-base"
                  )}
                >
                  {goals[index]}
                </Text>
              </View>
            );
          }}
          showsVerticalScrollIndicator={false}
          dropdownStyle={styles.dropdownMenuStyle}
          disableAutoScroll
        />
      </View>
      <TouchableOpacity
        className="mt-8 bg-primary w-[350px] h-14 rounded-2xl items-center justify-center"
        onPress={() => router.push("/(auth)/continuep2")}
      >
        <Text className="text-white">Continue</Text>
      </TouchableOpacity>
      <Text className="text-foreground mt-4">
        Don&apos;t have an account ?{" "}
        <Link href="/register" className="text-primary">
          Register
        </Link>
      </Text>
    </View>
  );
}

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
