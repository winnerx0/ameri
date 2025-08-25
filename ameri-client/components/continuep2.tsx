import { View, TextInput, Text, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import { useColorScheme } from "@/hooks/useColorScheme";
import { RegisterResponse, TagInputProps } from "@/types";
import { BACKEND_URL } from "@/utils";
import axios from "axios";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRegisterStore, useScreen } from "@/utils/store";
import { clsx } from "clsx";
import TagInput from "@/components/tag-input";
import { useMutation } from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ContinueP2() {
  // const colorScheme = useColorScheme();
  const { registerData, updateField } = useRegisterStore();

  const { setScreen } = useScreen();

  const { isPending, mutate: handleRegisteration } = useMutation({
    mutationKey: ["register"],
    mutationFn: async () => {
      const res = await axios.post(
        BACKEND_URL + "/auth/register",
        {
          ...registerData,
          dateOfBirth: new Date(registerData.dateOfBirth),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const response: RegisterResponse = await res.data;
      return response;
    },
    onSuccess: async () => {
      setScreen({ path: "otp", data: registerData.email });
      await AsyncStorage.setItem("currentScreen", "otp");
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
            updateField("healthConditions", tags);
          }}
          initialTags={registerData.healthConditions}
          maxTags={5}
        />
      </View>
      <View className="flex items-start gap-2">
        <Text className="text-foreground">Weight</Text>
        <TextInput
          placeholder="Enter weight in kg"
          keyboardType="number-pad"
          value={registerData.weight ? registerData.weight.toString() : ""}
          className="border border-border rounded-2xl px-2 h-14 py-2 w-[350px] text-foreground"
          onChangeText={(weight) => updateField("weight", parseFloat(weight))}
          returnKeyType="done"
        />
      </View>
      <View className="flex items-start gap-2">
        <Text className="text-foreground">Height</Text>
        <TextInput
          placeholder="Enter height in cm"
          keyboardType="number-pad"
          value={registerData.height ? registerData.height.toString() : ""}
          className="border border-border rounded-2xl px-2 h-14 py-2 w-[350px] text-foreground"
          onChangeText={(height) => updateField("height", parseFloat(height))}
          returnKeyType="done"
        />
      </View>
      <TouchableOpacity
        className="disabled:opacity-40 mt-8 bg-primary w-[350px] h-14 rounded-2xl items-center justify-center"
        disabled={isPending || Object.values(registerData).some((v) => !v)}
        onPress={() => handleRegisteration()}
      >
        <Text className="text-white">Register</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setScreen({ path: "login" })}>
        <Text className="text-foreground mt-4">
          Already have an account ?{" "}
          <Text className="text-primary">Login</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}
