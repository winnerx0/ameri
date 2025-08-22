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
    <View
      className={clsx(
        colorScheme === "dark" && "dark",
        "bg-background h-full flex flex-col gap-8 justify-center px-8 relative"
      )}
    >
      <CameraView
        autofocus="on"
        //  ratio="4:3"
        ref={cameraRef}
        className="border-4 border-border"
      >
        <View className="m-auto size-[350px]  flex items-center justify-center self-center justify-self-center"></View>
      </CameraView>
      <TouchableOpacity
        onPress={takePictue}
        className={clsx(
          colorScheme === "dark" && "dark",
          "bg-foreground size-[80px] rounded-full border-8 border-border self-center absolute bottom-28"
        )}
      ></TouchableOpacity>
    </View>
  );
}
