import { Button, Text, TouchableOpacity, View } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRef } from "react";
import { clsx } from "clsx";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabTwoScreen() {

  const colorScheme = useColorScheme();

  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null)

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
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  const takePictue = async() => {
    if(cameraRef.current){
        const photo = await cameraRef.current.takePictureAsync();

        console.log(photo.uri)
    }
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
