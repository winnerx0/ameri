import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Link } from "expo-router";
import SelectDropdown from "react-native-select-dropdown";
import { Gender, Goal } from "@/types";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { clsx } from "clsx";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useRegisterStore, useScreen } from "@/utils/store";

export default function ContinueScreen() {

  const { setScreen } = useScreen();
  const colorScheme = useColorScheme();

  const genders = Object.values(Gender);
  const goals = Object.values(Goal);

  const { registerData, updateField } = useRegisterStore();

  function formatDateInput(str: string): string {
    // remove non-digits
    const cleaned = str.replace(/\D/g, "");

    if (cleaned.length <= 4) {
      return cleaned; // typing year
    } else if (cleaned.length <= 6) {
      return `${cleaned.slice(0, 4)}-${cleaned.slice(4)}`; // typing year + month
    } else {
      return `${cleaned.slice(0, 4)}-${cleaned.slice(4, 6)}-${cleaned.slice(
        6,
        8
      )}`; // full YYYY-MM-DD
    }
  }

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
    <View className="flex flex-col gap-6 items-center">
      <View className="flex items-start gap-2">
        <Text className="text-foreground">Gender</Text>
        <SelectDropdown
          data={genders}
          onSelect={(selectedItem: Gender, index: number) => {
            updateField("gender", Object.keys(Gender)[index]);
            console.log("Selected gender:", Object.keys(Gender));
          }}
          renderButton={(selectedItem: Goal, isOpened) => {
            return (
              <View
                className={clsx(
                  colorScheme === "dark" && "dark",
                  "bg-background w-[350px] h-14 border border-border rounded-2xl flex flex-row items-center p-2 justify-between"
                )}
              >
                <Text className="text-foreground">
                  {registerData.gender
                    ? `${
                        registerData.gender.charAt(0).toUpperCase() +
                        registerData.gender.slice(1).toLowerCase()
                      }`
                    : "Select your gender"}
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
              <View
                className={clsx(
                  colorScheme === "dark" && "dark",
                  "bg-background w-[350px] h-14 divide-border divide-y-2 flex flex-col items-center p-2 justify-center hover:bg-secondary"
                )}
              >
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
          value={formatDateInput(registerData.dateOfBirth)}
          maxLength={10}
          className="border border-border rounded-2xl px-2 h-14 py-2 w-[350px] text-foreground"
          onChangeText={(date) => updateField("dateOfBirth", date)}
          returnKeyType="done"
        />
      </View>
      <View className="flex items-start gap-2">
        <Text className="text-foreground">Goal</Text>
        <SelectDropdown
          data={goals}
          onSelect={(selectedItem: Goal, index: number) => {
            updateField("goal", Object.keys(Goal)[index]);
          }}
          renderButton={(selectedItem: Goal, isOpened) => {
            return (
              <View
                className={clsx(
                  colorScheme === "dark" && "dark",
                  "bg-background w-[350px] h-14 border border-border rounded-2xl flex flex-row items-center p-2 justify-between"
                )}
              >
                <Text className="text-foreground">
                  {registerData.goal
                    ? `${
                        registerData.goal.charAt(0).toUpperCase() +
                        registerData.goal
                          .slice(1)
                          .replace("_", " ")
                          .toLowerCase()
                      }`
                    : "Select your goal"}
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
              <View
                className={clsx(
                  colorScheme === "dark" && "dark",
                  "bg-background w-[350px] h-14 divide-border divide-y-2 flex flex-col items-center p-2 justify-center hover:bg-secondary"
                )}
              >
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
        className="mt-8 bg-primary w-[350px] h-14 rounded-2xl items-center justify-center disabled:opacity-40"
        disabled={Object.values(cleanedData).some((v) => !v)}
        onPress={() => setScreen({ path: "continueP2" })}
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
