import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Link, router } from "expo-router";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Goal, RegisterResponse, TagInputProps, UserMetadata } from "@/types";
import { BACKEND_URL } from "@/utils";
import axios from "axios";
import SelectDropdown from "react-native-select-dropdown";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { useRegisterStore } from "@/utils/store";
import { clsx } from "clsx";
import TagInput from "@/components/tag-input";

export default function ContinueP2Screen() {
  const colorScheme = useColorScheme();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [healthConditions, setHealthConditions] = useState<string[]>([]);
  const [form, setForm] = useState<UserMetadata>({
    dob: new Date(),
    goal: Goal.STAY_HEALTHY,
    weight: 0,
    height: 0,
    heathConditons: {},
  });

  const { registerData, updateField } = useRegisterStore();

  const goals = Object.values(Goal).filter((key) => typeof key === "string");

  const handleRegister = async () => {
    setIsLoading(true);
    try {
      const res = await axios.post(
        BACKEND_URL + "/auth/register",
        registerData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 10000,
        }
      );

      if (res.status !== 200) {
        throw new Error(res.data);
      }

      const response: RegisterResponse = await res.data;

      console.log(response);
      router.push("/(tabs)");
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const HealthCondition = ({
    tag,
    onRemove,
  }: {
    tag: string;
    onRemove: () => void;
  }) => {
    const colorScheme = useColorScheme();

    return (
      <View
        className={clsx(
          colorScheme === "dark" ? "dark" : "",
          "bg-primary rounded-full px-3 py-2 flex-row items-center m-1"
        )}
      >
        <View
          className={clsx(
            colorScheme === "dark" ? "dark" : "",
            "w-2 h-2 rounded-full bg-destructive-foreground mr-2"
          )}
        />
        <Text
          className={clsx(
            colorScheme === "dark" ? "dark" : "",
            "text-destructive-foreground text-sm font-medium mr-2"
          )}
        >
          {tag}
        </Text>
        <TouchableOpacity onPress={onRemove}>
          <Text
            className={clsx(
              colorScheme === "dark" ? "dark" : "",
              "text-destructive-foreground text-base font-bold"
            )}
          >
            ×
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const HealthConditionInput = (props: Omit<TagInputProps, "tagComponent">) => (
    <TagInput
      {...props}
      tagComponent={HealthCondition}
      placeholder="Enter health conditions..."
    />
  );
  return (
    <View className="flex flex-col gap-6 items-center w-full">
      <View className="flex items-start gap-2">
        <Text className="text-foreground">Health Conditions</Text>
        <HealthConditionInput
          onTagsChange={(tags) => setHealthConditions(tags)}
          initialTags={healthConditions}
          maxTags={10}
        />
      </View>
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
