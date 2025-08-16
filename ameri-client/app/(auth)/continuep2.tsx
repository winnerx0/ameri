import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";
import { useState } from "react";
import SelectDropdown from "react-native-select-dropdown";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Goal, UserMetadata } from "@/types";
import { clsx } from "clsx";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function ContinueP2Screen() {
  const colorScheme = useColorScheme();
  const [form, setForm] = useState<UserMetadata>({
    dob: new Date(),
    goal: Goal.STAY_HEALTHY,
    weight: 0,
    height: 0,
    heathConditons: {},
  });

  const goals = Object.values(Goal).filter((key) => typeof key === "string");

  return (
    <SafeAreaProvider>
      <SafeAreaView className="dark bg-background text-foreground h-screen items-center justify-center gap-4">
        <SelectDropdown
          data={goals}
          onSelect={(selectedItem: string, index: number) => {
            console.log(form);
            setForm((prev) => ({ ...prev, goal: Object.values(Goal)[index] }));
          }}
          renderButton={(selectedItem: string, isOpened) => {
            return (
              <View className="bg-background w-[350px] h-14 border border-border rounded-2xl flex flex-row items-center p-2 justify-between">
                <Text className="text-foreground">
                  {selectedItem || "Select your gender"}
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
        <View className="flex items-start gap-2">
          <Text className="text-foreground">Password</Text>
          <TextInput
            placeholder="Secure1234@"
            keyboardType="visible-password"
            className="border border-border rounded-2xl px-2 h-14 py-2 w-[350px] text-foreground"
          />
        </View>
        <View className="flex items-start gap-2">
          <Text className="text-foreground">Confirm Password</Text>
          <TextInput
            placeholder="Secure1234@"
            keyboardType="visible-password"
            className="border border-border rounded-2xl px-2 h-14 py-2 w-[350px] text-foreground"
          />
        </View>
        <TouchableOpacity className="mt-8 bg-primary w-[350px] h-14 rounded-2xl items-center justify-center">
          <Text className="text-white">Login</Text>
        </TouchableOpacity>
        <Text className="text-foreground mt-4">
          Don&apos;t have an account ?{" "}
          <Link href="/register" className="text-primary">
            Register
          </Link>
        </Text>
      </SafeAreaView>
    </SafeAreaProvider>
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
