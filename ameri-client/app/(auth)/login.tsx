import { View, TextInput, Text, TouchableOpacity } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Link, router } from "expo-router";
import { Label } from "@react-navigation/elements";
import { useState } from "react";
import { LoginRequest, LoginResponse } from "@/types";
import axios, { AxiosError } from "axios";
import { BACKEND_URL } from "@/utils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { clsx } from "clsx";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function LoginScreen() {

  const colorScheme = useColorScheme();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [data, setData] = useState<LoginRequest>({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleLogin = async () => {
    setIsLoading(true);
    console.log(data)
    try {
      const res = await axios.post(BACKEND_URL + "/auth/login", data, {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 10000
      });

      if (res.status !== 200) {
        throw new Error(res.data);
      }

      const response: LoginResponse = await res.data;

      await AsyncStorage.setItem("accessToken", response.accessToken);
      await AsyncStorage.setItem("refreshToken", response.refreshToken);
      console.log(response);
      router.push("/(tabs)");
    } catch (e) {
      if(e instanceof AxiosError){
        console.log(e)
      }
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };
  return (
      <SafeAreaView
        className={clsx(
          colorScheme === "dark" ? "dark" : "",
          "bg-background h-screen items-center justify-center gap-4"
        )}
      >
        <Text className="text-3xl font-bold text-foreground">Ameri</Text>
        <Text className="italic text-foreground">
          Manage your health the right way
        </Text>
        <View className="flex items-start gap-2">
          <Label
            style={{
              color: colorScheme === "dark" ? "#ffffff" : "#000000",
            }}
          >
            Email
          </Label>
          <TextInput
            placeholder="samuelmadison@gmail.com"
            keyboardType="email-address"
            style={{
              color: colorScheme === "dark" ? "#ffffff" : "#000000",
            }}
            placeholderTextColor={
              colorScheme === "dark" ? "#9CA3AF" : "#6B7280"
            }
            className="border border-border rounded-2xl px-2 h-14 py-2 w-[350px]"
            onChangeText={(email) => setData((prev) => ({ ...prev, email }))}
          />
        </View>
        <View className="flex items-start gap-2">
          <Label
            style={{
              color: colorScheme === "dark" ? "#ffffff" : "#000000",
            }}
          >
            Password
          </Label>
          <TextInput
            placeholder="samuel123@"
            keyboardType="visible-password"
            style={{
              color: colorScheme === "dark" ? "#ffffff" : "#000000",
            }}
            placeholderTextColor={
              colorScheme === "dark" ? "#9CA3AF" : "#6B7280"
            }
            className="border border-border rounded-2xl px-2 h-14 py-2 w-[350px] text-foreground"
            onChangeText={(password) =>
              setData((prev) => ({ ...prev, password }))
            }
          />
        </View>
        <View className="flex items-start gap-2">
          <Label
            style={{
              color: colorScheme === "dark" ? "#ffffff" : "#000000",
            }}
          >
            Confirm Password
          </Label>
          <TextInput
            placeholder="samuel123@"
            keyboardType="visible-password"
            style={{
              color: colorScheme === "dark" ? "#ffffff" : "#000000",
            }}
            placeholderTextColor={
              colorScheme === "dark" ? "#9CA3AF" : "#6B7280"
            }
            className="border border-border rounded-2xl px-2 h-14 py-2 w-[350px] text-foreground"
            onChangeText={(confirmPassword) =>
              setData((prev) => ({ ...prev, confirmPassword }))
            }
          />
        </View>
        <TouchableOpacity
          className={clsx(
             (isLoading || Object.values(data).some((v) => v.trim() === "")) && "disabled:opacity-40", 
            "mt-8 bg-primary w-[350px] h-14 rounded-2xl items-center justify-center"
          )}
          onPress={handleLogin}
          disabled={
            isLoading || Object.values(data).some((v) => v.trim() === "")
          }
        >
          <Text className="text-white">
            {isLoading ? "Loading..." : "Login"}
          </Text>
        </TouchableOpacity>
        <Text className="text-foreground mt-4">
          Don&apos;t have an account ?{" "}
          <Link href="/register" className="text-primary">
            Register
          </Link>
        </Text>
      </SafeAreaView>
  );
}
