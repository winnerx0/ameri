import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Link, router } from "expo-router";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useColorScheme } from "@/hooks/useColorScheme";
import {clsx} from "clsx";
import { RegisterRequest, RegisterResponse } from "@/types";
import { BACKEND_URL } from "@/utils";
import { useState } from "react";
import axios from "axios";

export default function RegisterScreen() {
  

  const colorScheme = useColorScheme();

    const [isLoading, setIsLoading] = useState<boolean>(false);
  
    const [data, setData] = useState<RegisterRequest>({
      username: "",
      email: "",
      password: "",
    });
  
    const handleRegister = async () => {
      setIsLoading(true);
      try {
        const res = await axios.post(BACKEND_URL + "/auth/register", data, {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 10000
        });
  
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
  
  return (
    <SafeAreaProvider>
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
          <Text
            style={{
              color: colorScheme === "dark" ? "#ffffff" : "#000000",
            }}
          >
            Username
          </Text>
          <TextInput
            placeholder="samuel"
            style={{
              color: colorScheme === "dark" ? "#ffffff" : "#000000",
            }}
            placeholderTextColor={
              colorScheme === "dark" ? "#9CA3AF" : "#6B7280"
            }
            className="border border-border rounded-2xl px-2 h-14 py-2 w-[350px]"
            onChangeText={(username) =>
              setData((prev) => ({ ...prev, username }))
            }
          />
        </View>
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
            placeholderTextColor={
              colorScheme === "dark" ? "#9CA3AF" : "#6B7280"
            }
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
            placeholderTextColor={
              colorScheme === "dark" ? "#9CA3AF" : "#6B7280"
            }
            className="border border-border rounded-2xl px-2 h-14 py-2 w-[350px]"
            onChangeText={(password) => setData((prev) => ({ ...prev, password }))}
          />
        </View>
        <TouchableOpacity
          className="mt-8 bg-primary w-[350px] h-14 rounded-2xl items-center justify-center"
          onPress={() => router.push("/continue")}
        >
          <Text className="text-white">
            Continue
            {/* <Icon name="chevron-right" /> */}
          </Text>
        </TouchableOpacity>
        <Text className="text-foreground mt-4">
          Have an account ?{" "}
          <Link href="/login" className="text-primary">
            Login
          </Link>
        </Text>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
