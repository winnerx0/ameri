import { Link } from "expo-router";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Screen } from "@/types";
import { BACKEND_URL } from "@/utils";
import axios, { isAxiosError } from "axios";
import { useRegisterStore, useScreen } from "@/utils/store";
import { useState } from "react";
import { Text, TouchableOpacity, View, TextInput } from "react-native";
import ContinueScreen from "../../components/continue";
import ContinueP2 from "../../components/continuep2";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useMutation } from "@tanstack/react-query";
import OTP from "../../components/otp";
import LoginScreen from "../../components/login";

export default function Index() {
  const colorScheme = useColorScheme();

  const { registerData, updateField } = useRegisterStore();

  const { screen, setScreen } = useScreen();
  console.log(registerData, screen);

  const { mutate: handleVerifyAccount, isPending } = useMutation({
    mutationKey: ["verify-account"],
    mutationFn: async () => {
      await axios.post(
        BACKEND_URL + "/auth/verify-account",
        {
          email: registerData.email,
          username: registerData.username,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    },
    onSuccess: () => setScreen({ path: "continue" }),
    onError: (e) => {
      if (isAxiosError(e)) {
        console.log(e.response?.data.message);
      } else {
        console.log(e.message);
      }
    },
  });

  const {
    goal,
    gender,
    healthConditions,
    height,
    weight,
    dateOfBirth,
    ...cleanedData
  } = registerData;

  return (
    <View className="flex flex-col items-center justify-center gap-6">
      {screen.path !== "login" && (
        <TouchableOpacity
          className="text-foreground flex flex-row items-center mt-2 self-start"
          onPress={() =>
            setScreen(
              screen.path === "continueP2"
                ? { path: "continue" }
                : { path: "login" }
            )
          }
        >
          <MaterialCommunityIcons
            name="chevron-left"
            size={30}
            color={colorScheme === "dark" ? "white" : "black"}
          />
          <Text className="text-foreground text-sm ml-1">Back</Text>
        </TouchableOpacity>
      )}
      {screen.path === "continue" ? (
        <ContinueScreen />
      ) : screen.path === "continueP2" ? (
        <ContinueP2 />
      ) : screen.path === "otp" ? (
        <OTP />
      ) : screen.path === "login" ? (
        <LoginScreen />
      ) : (
        <View className="flex flex-col gap-6 items-center">
          <Text className="text-3xl font-bold text-foreground">Ameri</Text>
          <Text className="italic text-foreground">
            Manage your health the right way
          </Text>

          <View className="flex items-start gap-2">
            <Text className="text-foreground">Username</Text>
            <TextInput
              placeholder="samuel"
              value={registerData.username}
              style={{
                color: colorScheme === "dark" ? "#ffffff" : "#000000",
              }}
              placeholderTextColor={
                colorScheme === "dark" ? "#9CA3AF" : "#6B7280"
              }
              className="border border-border rounded-2xl px-2 h-14 py-2 w-[350px]"
              onChangeText={(username) => updateField("username", username)}
            />
          </View>

          <View className="flex items-start gap-2">
            <Text className="text-foreground">Email</Text>
            <TextInput
              placeholder="samuelmadison@gmail.com"
              value={registerData.email}
              keyboardType="email-address"
              style={{
                color: colorScheme === "dark" ? "#ffffff" : "#000000",
              }}
              placeholderTextColor={
                colorScheme === "dark" ? "#9CA3AF" : "#6B7280"
              }
              className="border border-border rounded-2xl px-2 h-14 py-2 w-[350px]"
              onChangeText={(email) => updateField("email", email)}
            />
          </View>

          <View className="flex items-start gap-2">
            <Text className="text-foreground">Password</Text>
            <TextInput
              placeholder="samuel123@"
              value={registerData.password}
              secureTextEntry
              style={{
                color: colorScheme === "dark" ? "#ffffff" : "#000000",
              }}
              placeholderTextColor={
                colorScheme === "dark" ? "#9CA3AF" : "#6B7280"
              }
              className="border border-border rounded-2xl px-2 h-14 py-2 w-[350px]"
              onChangeText={(password) => updateField("password", password)}
            />
          </View>

          <TouchableOpacity
            className="mt-8 bg-primary w-[350px] h-14 rounded-2xl items-center justify-center disabled:opacity-40"
            onPress={() => handleVerifyAccount()}
            disabled={isPending || Object.values(cleanedData).some((v) => !v)}
          >
            <Text className="text-white">
              {isPending ? "Loading..." : "Continue"}
            </Text>
          </TouchableOpacity>
          <View className="mt-4 flex flex-row items-center">
            <Text className="text-foreground"> Have an account ? </Text>
            <TouchableOpacity
              onPress={() => setScreen({ path: "login" })}
              className=""
            >
              <Text className="text-primary">Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      {/* <View></View> */}
    </View>
  );
}
