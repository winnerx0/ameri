import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import React, {
  useState,
  useRef,
  useEffect,
  SetStateAction,
  Dispatch,
} from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { clsx } from "clsx";
import { useColorScheme } from "@/hooks/useColorScheme";
import { router, useLocalSearchParams } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import axios, { isAxiosError } from "axios";
import { BACKEND_URL } from "@/utils";
import { Screen } from "@/types";

const OTP = ({
  screen,
  setScreen,
}: {
  screen: Screen<string>;
  setScreen: Dispatch<SetStateAction<Screen<any>>>;
}) => {
  const colorScheme = useColorScheme();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [timer, setTimer] = useState(60);

  const inputRefs = useRef<(TextInput | null)[]>([]);

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
    if (value && index < 5) {
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

      if (otpCode.length !== 6) {
        Alert.alert("Error", "Please enter complete OTP code");
        return;
      }

      await axios.post(BACKEND_URL + "/verify-token", {
        email: screen.data,
        token: otpCode,
      });
    },

    onSuccess: () => {
      router.replace("/(tabs)");
    },
    onError: (e) => {
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
      setActiveIndex(0);
      if (isAxiosError(e)) {
        console.log(e.response?.data.message);
      }
    },
  });

  const { isPending: isResendOtpLoading, mutate: handleResendOtp } =
    useMutation({
      mutationKey: ["resend-verification-otp"],
      mutationFn: async () => {
        await axios.post(BACKEND_URL + "/send-verification-token", {
          email: screen.data,
        });
      },

      onMutate: () => {
        setTimer(60);
        setOtp(["", "", "", "", "", ""]);
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
    <SafeAreaView
      className={clsx(
        colorScheme === "dark" ? "dark" : "",
        "bg-background flex-1 px-6"
      )}
    >
      {/* Header */}
      <View className="items-center mt-8 mb-12">
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
          Enter the 6-digit code sent to{"\n"} {screen.data}
        </Text>
      </View>

      {/* OTP Input Fields */}
      <View className="flex-row justify-center items-center mb-8 gap-3">
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => (inputRefs.current[index] = ref)}
            value={digit}
            onChangeText={(value) => handleOtpChange(value, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            onFocus={() => setActiveIndex(index)}
            maxLength={1}
            keyboardType="numeric"
            textAlign="center"
            selectTextOnFocus
            className={clsx(
              colorScheme === "dark" ? "dark" : "",
              "w-12 h-14 border-2 rounded-lg text-center text-xl font-bold",
              activeIndex === index
                ? "border-primary"
                : digit
                ? "border-green-500"
                : "border-border"
            )}
            style={{
              color: colorScheme === "dark" ? "#ffffff" : "#000000",
            }}
          />
        ))}
      </View>

      {/* Timer */}
      <View className="items-center mb-8">
        {timer > 0 ? (
          <Text
            className={clsx(
              colorScheme === "dark" ? "dark" : "",
              "text-muted-foreground text-base"
            )}
          >
            Resend code in {formatTime(timer)}
          </Text>
        ) : (
          <TouchableOpacity onPress={() => handleResendOtp()}>
            <Text
              className={clsx(
                colorScheme === "dark" ? "dark" : "",
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
          colorScheme === "dark" ? "dark" : "",
          "bg-primary rounded-lg h-14 items-center justify-center mb-6",
          (!isOtpComplete || isPending) && "opacity-50"
        )}
      >
        <Text
          className={clsx(
            colorScheme === "dark" ? "dark" : "",
            "text-white text-base font-semibold"
          )}
        >
          {isPending ? "Verifying..." : "Verify OTP"}
        </Text>
      </TouchableOpacity>

      {/* Back to Login */}
      <TouchableOpacity
        onPress={() => setScreen({ path: "continueP2" })}
        className="items-center"
      >
        <Text
          className={clsx(
            colorScheme === "dark" ? "dark" : "",
            "text-muted-foreground text-base"
          )}
        >
          Go Back
        </Text>
      </TouchableOpacity>

      {/* Debug Info (Development only) */}
      {__DEV__ && (
        <View
          className={clsx(
            colorScheme === "dark" ? "dark" : "",
            "absolute bottom-4 left-4 bg-card border border-border rounded p-2"
          )}
        >
          <Text
            className={clsx(
              colorScheme === "dark" ? "dark" : "",
              "text-muted-foreground text-xs"
            )}
          >
            Debug: Use "123456" to verify
          </Text>
          <Text
            className={clsx(
              colorScheme === "dark" ? "dark" : "",
              "text-muted-foreground text-xs"
            )}
          >
            Current: {otp.join("")}
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default OTP;
