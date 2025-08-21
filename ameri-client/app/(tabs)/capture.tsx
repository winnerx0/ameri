import { Text, TouchableOpacity, View, Platform, ActivityIndicator } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useEffect, useRef, useState } from "react";
import { clsx } from "clsx";
import { useColorScheme } from "@/hooks/useColorScheme";
import { api, BACKEND_URL } from "@/utils";
import FormData from "form-data";
import { MealRecepie } from "@/types";
import { router } from "expo-router";
export default function TabTwoScreen() {
  const colorScheme = useColorScheme();

  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  
    if (!permission) {
      return (
        <View
          className={clsx(
            colorScheme === "dark" && "dark",
            "bg-background h-screen items-center justify-center",
          )}
        >
        </View>
      );
    }

  if (!permission.granted) {
    return (
      <View
        className={clsx(
          colorScheme === "dark" && "dark",
          "bg-background items-center justify-center gap-4 h-screen",
        )}
      >
        <Text
          className={clsx(
            colorScheme === "dark" && "dark",
            "text-foreground font-bold",
          )}
        >
          We need your permission to show the camera
        </Text>
        <TouchableOpacity
          onPress={requestPermission}
          className="bg-primary h-10 rounded-md w-48 flex items-center justify-center"
        >
          <Text
            className={clsx(
              colorScheme === "dark" && "dark",
              "text-foreground font-bold",
            )}
          >
            Grant Permission
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePictue = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();

      console.log("url", photo.uri);
      router.push({
        pathname: "/meal-data",
        params: {
          photoUri: photo.uri,
        },
      });
    }
  };

  return (
    <CameraView
      autofocus="on"
      pictureSize="1920x1080"
      ref={cameraRef}
      className={clsx(
        colorScheme === "dark" && "dark",
        "bg-background h-full flex-1",
      )}
    >
      <View className="h-screen flex items-center justify-center mt-[300px]">
        <TouchableOpacity
          onPress={takePictue}
          className={clsx(
            colorScheme === "dark" && "dark",
            "bg-background size-[80px] rounded-full border-8 border-border",
          )}
        ></TouchableOpacity>
      </View>
    </CameraView>
  );
}
