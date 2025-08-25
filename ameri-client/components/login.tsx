import { View, TextInput, Text, TouchableOpacity, Button } from "react-native";
import { Link, router } from "expo-router";
import { useState } from "react";
import { LoginRequest, LoginResponse } from "@/types";
import axios, { isAxiosError } from "axios";
import { BACKEND_URL } from "@/utils";
import { useColorScheme } from "@/hooks/useColorScheme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation } from "@tanstack/react-query";
import { useScreen } from "@/utils/store";
export default function LoginScreen() {
  const colorScheme = useColorScheme();

  const [data, setData] = useState<LoginRequest>({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { setScreen } = useScreen();

  const { mutate: handleLogin, isPending } = useMutation({
    mutationKey: ["login"],
    mutationFn: async () => {
      console.log(data);
      const res = await axios.post(BACKEND_URL + "/auth/login", data, {
        headers: {
          "Content-Type": "application/json",
        },
        validateStatus: (status) => status < 500,
      });
      if (res.status === 403) {
        setScreen({ path: "otp", data: data.email });
        await AsyncStorage.multiSet([
          ["currentScreen", "otp"],
          ["email", data.email],
        ]);
        return;
      }

      console.log(res.status);

      const response: LoginResponse = await res.data;
      console.log(response);
      await AsyncStorage.multiSet([
        ["accessToken", response.accessToken],
        ["refreshToken", response.refreshToken],
      ]);
      router.replace("/(tabs)/home");
    },
    onError: (e) => {
      if (isAxiosError(e)) {
        console.log(e.response?.data.message);
      } else {
        console.log(e.message);
      }
    },
  });
  return (
    <View className="flex flex-col gap-6 items-center">
      <Text className="text-3xl font-bold text-foreground">Ameri</Text>
      <Text className="italic text-foreground">
        Manage your health the right way
      </Text>
      <View className="flex items-start gap-2">
        <Text
          style={{
            color: colorScheme === "dark" ? "#ffffff" : "#000000",
          }}
        >
          Email
        </Text>
        <TextInput
          placeholder="samuelmadison@gmail.com"
          keyboardType="email-address"
          style={{
            color: colorScheme === "dark" ? "#ffffff" : "#000000",
          }}
          placeholderTextColor={colorScheme === "dark" ? "#9CA3AF" : "#6B7280"}
          className="border border-border rounded-2xl px-2 h-14 py-2 w-[350px]"
          onChangeText={(email) => setData((prev) => ({ ...prev, email }))}
        />
      </View>
      <View className="flex items-start gap-2">
        <Text
          style={{
            color: colorScheme === "dark" ? "#ffffff" : "#000000",
          }}
        >
          Password
        </Text>
        <TextInput
          placeholder="samuel123@"
          keyboardType="visible-password"
          style={{
            color: colorScheme === "dark" ? "#ffffff" : "#000000",
          }}
          placeholderTextColor={colorScheme === "dark" ? "#9CA3AF" : "#6B7280"}
          className="border border-border rounded-2xl px-2 h-14 py-2 w-[350px] text-foreground"
          onChangeText={(password) =>
            setData((prev) => ({ ...prev, password }))
          }
        />
      </View>
      <View className="flex items-start gap-2">
        <Text
          style={{
            color: colorScheme === "dark" ? "#ffffff" : "#000000",
          }}
        >
          Confirm Password
        </Text>
        <TextInput
          placeholder="samuel123@"
          keyboardType="visible-password"
          style={{
            color: colorScheme === "dark" ? "#ffffff" : "#000000",
          }}
          placeholderTextColor={colorScheme === "dark" ? "#9CA3AF" : "#6B7280"}
          className="border border-border rounded-2xl px-2 h-14 py-2 w-[350px] text-foreground"
          onChangeText={(confirmPassword) =>
            setData((prev) => ({ ...prev, confirmPassword }))
          }
        />
      </View>
      <TouchableOpacity
        className="disabled:opacity-40 mt-8 bg-primary w-[350px] h-14 rounded-2xl items-center justify-center"
        onPress={() => handleLogin()}
        disabled={isPending || Object.values(data).some((v) => v.trim() === "")}
      >
        <Text className="text-white">{isPending ? "Loading..." : "Login"}</Text>
      </TouchableOpacity>
      <View className="mt-4 flex flex-row items-center">
        <Text className="text-foreground"> Don&apos;t have an account ? </Text>
        <TouchableOpacity
          onPress={() => setScreen({ path: "register" })}
          className=""
        >
          <Text className="text-primary">Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
