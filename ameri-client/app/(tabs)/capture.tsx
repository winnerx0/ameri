import { Button, Text, TouchableOpacity, View } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRef } from "react";
import { clsx } from "clsx";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabTwoScreen() {
  const colorScheme = useColorScheme();

  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);

  if (!permission) {
    return (
      <View
        className={clsx(
          colorScheme === "dark" ? "dark" : "",
          "bg-background h-screen"
        )}
      />
    );
  }

  if (!permission.granted) {
    return (
      <View
        className={clsx(
          colorScheme === "dark" ? "dark" : "",
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

  const takePictue = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();

      console.log(photo.uri);

      const randomString = Math.random().toString(36).substring(2, 10);
      const file = base64ToFile(photo.base64!, randomString +".jpeg");
      console.log("file", file);
    }
  };

  function base64ToFile(base64: string, filename: string) {
    // Split into [meta, data]
    const [meta, data] = base64.split(",");
    const mime = meta.match(/:(.*?);/)![1]; 

    // Decode Base64 to binary
    const binary = atob(data);
    const arrayBuffer = new ArrayBuffer(binary.length);
    const uint8Array = new Uint8Array(arrayBuffer);

    for (let i = 0; i < binary.length; i++) {
      uint8Array[i] = binary.charCodeAt(i);
    }

    return new File([uint8Array], filename, { type: mime });
  }

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
