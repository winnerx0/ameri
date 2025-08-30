import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Button,
  KeyboardTypeOptions,
} from "react-native";
import { Link, router } from "expo-router";
import { useState } from "react";
import { AppColors, LoginRequest, LoginResponse } from "@/types";
import axios, { isAxiosError } from "axios";
import { BACKEND_URL } from "@/utils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation } from "@tanstack/react-query";
import { useTheme } from "@react-navigation/native";
import { useScreen } from "@/utils/store";
import { ThemedText } from "@/components/ThemedText";
import Input from "@/components/text-input";
export default function LoginScreen() {
  const { colors } = useTheme();

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

  console.log(data);
  return (
    <View className="flex flex-col gap-6 items-center h-full justify-center">
      <ThemedText className="text-3xl font-bold">Ameri</ThemedText>
      <ThemedText className="italic text-foreground">
        Manage your health the right way
      </ThemedText>

      <Input
        type="login"
        colors={colors}
        value={data.email}
        label="Email"
        placeholder="samuelmadison@gmail.com"
        keyboardType="email-address"
        data={"email"}
        setData={setData}
      />
      <Input
        type="login"
        colors={colors}
           value={data.password}
        label="Password"
        placeholder="samuel123@"
        keyboardType="visible-password"
        data={"password"}
        setData={setData}
      />
      <Input
        type="login"
        colors={colors}
           value={data.confirmPassword}
        label="Confirm Password"
        placeholder="samuel123@"
        keyboardType="visible-password"
        data={"confirmPassword"}
        setData={setData}
      />
      <TouchableOpacity
        className="disabled:opacity-40 mt-8 bg-primary w-[350px] h-14 rounded-2xl items-center justify-center"
        onPress={() => handleLogin()}
        disabled={isPending || Object.values(data).some((v) => v.trim() === "")}
      >
        <Text className="text-white">{isPending ? "Loading..." : "Login"}</Text>
      </TouchableOpacity>
      <View className="mt-4 flex flex-row items-center">
        <ThemedText className="text-foreground">
          {" "}
          Don&apos;t have an account ?{" "}
        </ThemedText>
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
