import { Text, TouchableOpacity, View, Platform } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRef } from "react";
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
          "bg-background h-screen"
        )}
      />
    );
  }

  if (!permission.granted) {
    return (
      <View
        className={clsx(
          colorScheme === "dark" && "dark",
          "bg-background items-center justify-center gap-4 h-screen"
        )}
      >
        <Text
          className={clsx(
            colorScheme === "dark" && "dark",
            "text-foreground font-bold"
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
              "text-foreground font-bold"
            )}
          >
            Grant Permission
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  async function uriToFile(uri: string, filename: string) {
    const response = await fetch(uri);
    const blob = await response.blob();
    return new File([blob], filename, { type: blob.type });
  }

  const takePictue = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();

      console.log("url", photo.uri);

      let file;

      // for web

      if (Platform.OS === "web") {
        file = await uriToFile(photo.uri, "image.png");
      } else if (Platform.OS === "android" || Platform.OS === "ios") {
        file = {
          uri: photo.uri,
          name: "image.png",
          type: "image/png",
        };
      }

      console.log("this is the file", file);

      const formData = new FormData();

      formData.append("file", file);

      try {
        const res = await api.post(
          BACKEND_URL + "/meal/get-meal-metadata",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (res.status !== 200) {
          throw new Error(res.data);
        }

        const data: MealRecepie = res.data;

        // if (data.status === "Rejected") {
        //   console.log(res.data);
        // } else {
          router.push({
            pathname: "/meal-data",
            params: {
              data: JSON.stringify(data),
            },
          });
        // }
      } catch (error) {
        console.error("error ", error);
      }
    }
  };

  return (
    <CameraView
      autofocus="on"
      ref={cameraRef}
      pictureSize="1920x1080"
      className={clsx(colorScheme === "dark" ? "dark" : "", "h-full flex-1")}
    >
      <View className="h-screen flex items-center justify-center mt-[300px]">
        <TouchableOpacity
          onPress={takePictue}
          className={clsx(
            colorScheme === "dark" && "dark",
            "bg-background size-[80px] rounded-full border border-border"
          )}
        ></TouchableOpacity>
      </View>
    </CameraView>
  );
}
