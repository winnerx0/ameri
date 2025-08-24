import { Link, router } from "expo-router";
import { useColorScheme } from "@/hooks/useColorScheme";
import { RegisterResponse } from "@/types";
import { BACKEND_URL } from "@/utils";
import axios from "axios";
import { useRegisterStore } from "@/utils/store";
import { useState } from "react";
import { Text, TouchableOpacity, View, TextInput } from "react-native";

export default function RegisterScreen() {
  const colorScheme = useColorScheme();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { registerData, updateField } = useRegisterStore();

  console.log(registerData);

  return (
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
          placeholderTextColor={colorScheme === "dark" ? "#9CA3AF" : "#6B7280"}
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
          placeholderTextColor={colorScheme === "dark" ? "#9CA3AF" : "#6B7280"}
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
          placeholderTextColor={colorScheme === "dark" ? "#9CA3AF" : "#6B7280"}
          className="border border-border rounded-2xl px-2 h-14 py-2 w-[350px]"
          onChangeText={(password) => updateField("password", password)}
        />
      </View>

      <TouchableOpacity
        className="mt-8 bg-primary w-[350px] h-14 rounded-2xl items-center justify-center disabled:opacity-40"
        onPress={() => router.push("/(auth)/continue")}
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
  );
}
