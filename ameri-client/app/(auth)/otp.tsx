import {
  ScrollView,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  Text,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@react-navigation/native";
import { useMutation } from "@tanstack/react-query";
import { useState, useRef, useEffect } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { TextInput } from "react-native";
import axios, { isAxiosError } from "axios";
import { useScreen } from "@/utils/store";
import { BACKEND_URL } from "@/utils";
import { LoginResponse } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";

const OTP = () => {
  const { colors } = useTheme();
  const { screen, setScreen } = useScreen();

  const [otp, setOtp] = useState<string[]>(["", "", "", ""]);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [timer, setTimer] = useState<number>(120);
  const [email, setEmail] = useState<string | null>(null);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  /* ---------- helpers ---------- */
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  /* ---------- effects ---------- */
  useEffect(() => {
    async function fetchEmail() {
      const savedEmail = screen.data ?? (await AsyncStorage.getItem("email"));
      if (savedEmail) {
        setEmail(savedEmail);
        handleSendOtp(savedEmail);
      }
    }
    fetchEmail();
  }, []);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  /* ---------- OTP input handlers ---------- */
  const handleOtpChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
      setActiveIndex(index + 1);
    }
    if (!value && index > 0) {
      inputRefs.current[index - 1]?.focus();
      setActiveIndex(index - 1);
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
      setActiveIndex(index - 1);
    }
  };

  /* ---------- mutations ---------- */
  const { isPending, mutate: handleVerifyOtp } = useMutation({
    mutationKey: ["verify-otp"],
    mutationFn: async () => {
      const otpCode = otp.join("");
      const res = await axios.post(BACKEND_URL + "/auth/verify-token", {
        email,
        otp: otpCode,
      });
      return res.data as LoginResponse;
    },
    onSuccess: async (response) => {
      await AsyncStorage.multiSet([
        ["accessToken", response.accessToken],
        ["refreshToken", response.refreshToken],
      ]);
      await AsyncStorage.multiRemove(["email", "currentScreen"]);
      router.replace("/(tabs)/home");
    },
    onError: (e) => {
      setOtp(["", "", "", ""]);
      inputRefs.current[0]?.focus();
      setActiveIndex(0);
      if (isAxiosError(e)) console.log(e.response?.data.message);
    },
  });

  const { isPending: isResendOtpLoading, mutate: handleSendOtp } = useMutation({
    mutationKey: ["send-verification-otp"],
    mutationFn: async (email: string) => {
      const res = await axios.post(
        BACKEND_URL + "/auth/send-verification-token",
        { email },
        { validateStatus: (status) => status === 409 },
      );
      if (res.status === 409) {
        router.replace("/(tabs)/home");
        throw new Error(res.data.message);
      }
    },
    onMutate: () => {
      setTimer(120);
      setOtp(["", "", "", ""]);
      inputRefs.current[0]?.focus();
      setActiveIndex(0);
    },
    onError: (e) => {
      if (isAxiosError(e)) console.log(e.response?.data.message);
    },
  });

  const isOtpComplete = otp.every((d) => d !== "");

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={{ backgroundColor: colors.background }}
        className="flex-1 items-center gap-4 px-6 mt-8 h-full"
      >
        {/* Title */}
        <ThemedText className="text-3xl font-bold mb-2">Verify OTP</ThemedText>
        <ThemedText className="text-muted-foreground text-center mb-8">
          Enter the 4-digit code sent to{"\n"}
          {email}
        </ThemedText>

        {/* OTP inputs */}
        <ThemedView className="flex-row gap-4 mb-8">
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(r) => (inputRefs.current[index] = r)}
              value={digit}
              onChangeText={(v) => handleOtpChange(v, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              onFocus={() => setActiveIndex(index)}
              maxLength={1}
              keyboardType="numeric"
              returnKeyType="done"
              selectTextOnFocus
              style={{
                color: colors.text,
                borderColor: digit
                  ? colors.primary
                  : activeIndex === index
                    ? colors.primary
                    : colors.border,
              }}
              className="w-12 h-14 border-2 rounded-lg text-center text-xl font-bold"
            />
          ))}
        </ThemedView>

        {/* Timer / Resend */}
        <ThemedView className="mb-8">
          {timer > 0 ? (
            <ThemedText>Resend code in {formatTime(timer)}</ThemedText>
          ) : (
            <TouchableOpacity
              onPress={() => email && handleSendOtp(email)}
              disabled={isResendOtpLoading}
            >
              <Text style={{ color: colors.primary }} className="font-semibold">
                Resend OTP
              </Text>
            </TouchableOpacity>
          )}
        </ThemedView>

        {/* Verify */}
        <TouchableOpacity
          style={{
            backgroundColor: colors.primary,
            opacity: isOtpComplete && !isPending ? 1 : 0.4,
          }}
          disabled={!isOtpComplete || isPending}
          onPress={() => handleVerifyOtp()}
          className="h-14 rounded-lg items-center justify-center w-full"
        >
          <ThemedText style={{ color: colors.card }}>
            {isPending ? "Verifying…" : "Verify OTP"}
          </ThemedText>
        </TouchableOpacity>

        {/* Back */}
        <TouchableOpacity
          onPress={() => setScreen({ path: "login" })}
          className="mt-4"
        >
          <ThemedText style={{ color: colors.primary }}>Go Back</ThemedText>
        </TouchableOpacity>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default OTP;
