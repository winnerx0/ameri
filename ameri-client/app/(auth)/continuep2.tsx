import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Link } from "expo-router";
import { useColorScheme } from "@/hooks/useColorScheme";
import {  RegisterResponse, Screen, TagInputProps } from "@/types";
import { BACKEND_URL } from "@/utils";
import axios from "axios";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Dispatch, SetStateAction, useState } from "react";
import { useRegisterStore } from "@/utils/store";
import { clsx } from "clsx";
import TagInput from "@/components/tag-input";
import { useMutation } from "@tanstack/react-query";

export default function ContinueP2({
  setScreen,
}: {
  setScreen: Dispatch<SetStateAction<Screen>>;
}) {
  const colorScheme = useColorScheme();

  const [healthConditions, setHealthConditions] = useState<string[]>([]);

  const { registerData, updateField } = useRegisterStore();

  const { data, isPending, error } = useMutation({
    mutationKey: ["register"],
    mutationFn: async () => {
      const res = await axios.post(
        BACKEND_URL + "/auth/register",
        registerData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.status !== 200) {
        throw new Error(res.data);
      }

      const response: RegisterResponse = await res.data;
      return response;
    },
    onError: (e) => console.error(e),
  });

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
            "w-2 h-2 rounded-full bg-destructive-foreground mr-2 flex flex-row items-center justify-center"
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
            <MaterialCommunityIcons
              name={"close-circle"}
              size={20}
              color={"white"}
            />
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
          onTagsChange={(tags) => {
            setHealthConditions(tags);
            updateField("heathConditons", tags);
          }}
          initialTags={healthConditions}
          maxTags={5}
        />
      </View>
      <View className="flex items-start gap-2">
        <Text className="text-foreground">Weight</Text>
        <TextInput
          placeholder="Enter weight in kg"
          keyboardType="number-pad"
          className="border border-border rounded-2xl px-2 h-14 py-2 w-[350px] text-foreground"
          onChangeText={(weight) => updateField("weight", parseFloat(weight))}
        />
      </View>
      <View className="flex items-start gap-2">
        <Text className="text-foreground">Height</Text>
        <TextInput
          placeholder="Enter height in kg"
          keyboardType="number-pad"
          className="border border-border rounded-2xl px-2 h-14 py-2 w-[350px] text-foreground"
          onChangeText={(height) => updateField("height", parseFloat(height))}
        />
      </View>
      <TouchableOpacity
        className="disabled:opacity-40 mt-8 bg-primary w-[350px] h-14 rounded-2xl items-center justify-center"
        disabled={isPending || Object.values(registerData).some((v) => !v)}
      >
        <Text className="text-white">Register</Text>
      </TouchableOpacity>
      <Text className="text-foreground mt-4">
        Don&apos;t have an account ?{" "}
        <Link href="/login" className="text-primary">
          Login
        </Link>
      </Text>
    </View>
  );
}

