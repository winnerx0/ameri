import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { clsx } from "clsx";
import { useColorScheme } from "@/hooks/useColorScheme";
import { router } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import axios, { isAxiosError } from "axios";
import { BACKEND_URL } from "@/utils";
import { useScreen } from "@/utils/store";
import { LoginResponse } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";

const OTP = () => {
  const colorScheme = useColorScheme();

  const [otp, setOtp] = useState<string[]>(["", "", "", ""]);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [timer, setTimer] = useState<number>(120);
  const [email, setEmail] = useState<string | null>(null);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const { screen, setScreen } = useScreen();

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

  // Timer countdown
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleOtpChange = (value: string, index: number) => {
    // Only allow numeric input
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
      setActiveIndex(index + 1);
    }

    // Auto focus previous input on delete
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

  const { isPending, mutate: handleVerifyOtp } = useMutation({
    mutationKey: ["verify-otp"],
    mutationFn: async () => {
      const otpCode = otp.join("");
      console.log(otpCode, email);

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
      if (isAxiosError(e)) {
        console.log(e.response?.data.message);
      }
    },
  });

  const { isPending: isResendOtpLoading, mutate: handleSendOtp } = useMutation({
    mutationKey: ["send-verification-otp"],
    mutationFn: async (email: string) => {
      const res = await axios.post(
        BACKEND_URL + "/auth/send-verification-token",
        {
          email,
        },
        {
          validateStatus: (status) => status === 409,
        }
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
      if (isAxiosError(e)) {
        console.log(e.response?.data.message);
      }
    },
  });

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const isOtpComplete = otp.every((digit) => digit !== "");

  return (
    <View
      className={clsx(
        colorScheme === "dark" && "dark",
        "bg-background flex-1 px-6 w-full flex flex-col items-center"
      )}
    >
      {/* Header */}
      <View className="flex flex-col justify-center items-center mt-8 mb-12 w-full">
        <Text
          className={clsx(
            colorScheme === "dark" && "dark",
            "text-foreground text-3xl font-bold mb-2"
          )}
        >
          Verify OTP
        </Text>
        <Text
          className={clsx(
            colorScheme === "dark" ? "dark" : "",
            "text-muted-foreground text-base text-center"
          )}
        >
          Enter the 4-digit code sent to{"\n"} {email}
        </Text>
      </View>

      {/* OTP Input Fields */}
      <View className="flex items-center flex-row mb-8 gap-6 w-full">
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => { inputRefs.current[index] = ref; }}
            value={digit}
            onChangeText={(value) => handleOtpChange(value, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            onFocus={() => setActiveIndex(index)}
            maxLength={1}
            keyboardType="numeric"
            returnKeyType="done"
            textAlign="center"
            selectTextOnFocus
            className={clsx(
              colorScheme === "dark" && "dark",
              "w-12 h-14 border-2 rounded-lg text-center text-xl font-bold",
              digit
                ? "border-green-500"
                : activeIndex === index
                ? "border-primary"
                : "border-border"
            )}
            style={{
              color: colorScheme === "dark" ? "#ffffff" : "#000000",
            }}
          />
        ))}
      </View>

      {/* Timer */}
      <View className="flex items-center mb-8">
        {timer > 0 ? (
          <Text
            className={clsx(
              colorScheme === "dark" && "dark",
              "text-muted-foreground text-base"
            )}
          >
            Resend code in {formatTime(timer)}
          </Text>
        ) : (
          <TouchableOpacity
            className="disabled:opacity-40"
            onPress={() => email && handleSendOtp(email)}
            disabled={isResendOtpLoading}
          >
            <Text
              className={clsx(
                colorScheme === "dark" && "dark",
                "text-foreground font-semibold text-sm"
              )}
            >
              Resend OTP
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Verify Button */}
      <TouchableOpacity
        onPress={() => handleVerifyOtp()}
        disabled={!isOtpComplete || isPending}
        className={clsx(
          colorScheme === "dark" && "dark",
          "bg-primary rounded-lg h-14 items-center justify-center mb-6 disabled:opacity-40 w-[350px]",
          (!isOtpComplete || isPending) && "opacity-50"
        )}
      >
        <Text
          className={clsx(
            colorScheme === "dark" && "dark",
            "text-white text-base font-semibold"
          )}
        >
          {isPending ? "Verifying..." : "Verify OTP"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => setScreen({ path: "login" })}
        className="items-center"
      >
        <Text
          className={clsx(
            colorScheme === "dark" && "dark",
            "text-muted-foreground text-base"
          )}
        >
          Go Back
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default OTP;
