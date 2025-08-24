import { Link, router } from "expo-router";
import { useColorScheme } from "@/hooks/useColorScheme";
import { RegisterResponse, Screen } from "@/types";
import { BACKEND_URL } from "@/utils";
import axios from "axios";
import { useRegisterStore } from "@/utils/store";
import { useState } from "react";
import { Text, TouchableOpacity, View, TextInput } from "react-native";
import ContinueScreen from "./continue";
import ContinueP2 from "./continuep2";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function RegisterScreen() {
  const colorScheme = useColorScheme();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { registerData, updateField } = useRegisterStore();

  const [screen, setScreen] = useState<Screen>("login");
  console.log(registerData);

  return (
    <View className="flex flex-col items-center justify-center gap-6">
      {screen !== "login" && (
        <TouchableOpacity
          className="text-foreground flex flex-row items-center mt-2 self-start"
          onPress={() =>
            setScreen((prev) =>
              prev === "continueP2"
                ? "continue"
                : prev === "continue"
                ? "login"
                : "login"
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
      {screen === "continue" ? (
        <ContinueScreen setScreen={setScreen} />
      ) : screen === "continueP2" ? (
        <ContinueP2 setScreen={setScreen} />
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
            onPress={() => setScreen("continue")}
            // disabled={
            //   isLoading ||
            //   Object.values(registerData).some((v) => !v || v.trim() === "")
            // }
          >
            <Text className="text-white">
              {isLoading ? "Loading..." : "Continue"}
            </Text>
          </TouchableOpacity>

          <Text className="text-foreground mt-4">
            Have an account ?{" "}
            <Link href="/login" className="text-primary">
              Login
            </Link>
          </Text>
        </View>
      )}
      {/* <View></View> */}
    </View>
  );
}
