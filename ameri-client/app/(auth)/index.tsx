import { Link } from "expo-router";
import { Screen } from "@/types";
import { BACKEND_URL } from "@/utils";
import axios, { isAxiosError } from "axios";
import { useRegisterStore, useScreen } from "@/utils/store";
import { useState } from "react";
import { TouchableOpacity, TextInput,Text } from "react-native";
import ContinueScreen from "./continue";
import ContinueP2 from "./continuep2";
import OTP from "./otp";
import LoginScreen from "./login";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useMutation } from "@tanstack/react-query";
import { useTheme } from "@react-navigation/native";

import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";

export default function Index() {
  const { colors } = useTheme();

  const { registerData, updateField } = useRegisterStore();
  const { screen, setScreen } = useScreen();

  const {
    goal,
    gender,
    healthConditions,
    height,
    weight,
    dateOfBirth,
    ...cleanedData
  } = registerData;

  const { mutate: handleVerifyAccount, isPending } = useMutation({
    mutationKey: ["verify-account"],
    mutationFn: async () => {
      await axios.post(
        BACKEND_URL + "/auth/verify-account",
        {
          email: registerData.email,
          username: registerData.username,
        },
        { headers: { "Content-Type": "application/json" } }
      );
    },
    onSuccess: () => setScreen({ path: "continue" }),
    onError: (e) => {
      console.log(isAxiosError(e) ? e.response?.data.message : e.message);
    },
  });

  console.log(screen)
  return (
    <ThemedView className="gap-6 w-full h-full flex flex-col justify-center">
      {(screen.path === "otp" || screen.path === "continue" || screen.path === "continueP2") && (
        <TouchableOpacity
          className="text-foreground flex flex-row items-center self-start"
          onPress={() =>
            setScreen(
              screen.path === "continueP2"
                ? { path: "continue" }
                : { path: "register" }
            )
          }
        >
          <MaterialCommunityIcons
            name="chevron-left"
            size={20}
            color={colors.text}
          />
          <ThemedText className="text-sm ml-1">Back</ThemedText>
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
        <ThemedView className="flex flex-col gap-6 items-center justify-center h-full">
          <ThemedText className="text-3xl font-bold">Ameri</ThemedText>
          <ThemedText className="italic">
            Manage your health the right way
          </ThemedText>

          <ThemedView className="flex items-start gap-2">
            <ThemedText>Username</ThemedText>
            <TextInput
              placeholder="samuel"
              value={registerData.username}
              style={{
                color: colors.text
              }}
              className="text-foreground border border-border rounded-2xl px-2 h-14 py-2 w-[350px]"
              onChangeText={(username) => updateField("username", username)}
            />
          </ThemedView>

          <ThemedView className="flex items-start gap-2">
            <ThemedText>Email</ThemedText>
            <TextInput
              placeholder="samuelmadison@gmail.com"
              value={registerData.email}
              keyboardType="email-address"
              style={{
                color: colors.text
              }}
              className="text-foreground border border-border rounded-2xl px-2 h-14 py-2 w-[350px]"
              onChangeText={(email) => updateField("email", email)}
            />
          </ThemedView>

          <ThemedView className="flex items-start gap-2">
            <ThemedText>Password</ThemedText>
            <TextInput
              placeholder="samuel123@"
              value={registerData.password}
              style={{
                color: colors.text
              }}
              // secureTextEntry
              className="text-foreground border border-border rounded-2xl px-2 h-14 py-2 w-[350px]"
              onChangeText={(password) => updateField("password", password)}
            />
          </ThemedView>

          <TouchableOpacity
            style={{ backgroundColor: colors.primary }}
            className="mt-8 w-[350px] h-14 rounded-2xl items-center justify-center disabled:opacity-40"
            onPress={() => handleVerifyAccount()}
            disabled={isPending || Object.values(cleanedData).some((v) => !v)}
          >
            <Text className="text-white">
              {isPending ? "Loading..." : "Continue"}
            </Text>
          </TouchableOpacity>

          <ThemedView className="mt-4 flex flex-row items-center">
            <ThemedText> Have an account? </ThemedText>
            <TouchableOpacity onPress={() => setScreen({ path: "login" })}>
              <Text className="text-primary">Login</Text>
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>
      )}
    </ThemedView>
  );
}