import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";
import { Label } from "@react-navigation/elements";

export default function LoginScreen() {
  return (
    <SafeAreaProvider>
      <SafeAreaView className="dark bg-background text-foreground h-screen items-center justify-center gap-4">
        <Text className="text-3xl font-bold text-foreground">Ameri</Text>
        <Text className="italic text-foreground">Manage your health the right way</Text>
        <View className="flex items-start gap-2">
          <Label className="text-foreground">Email</Label>
          <TextInput
            placeholder="samuelmadison@gmail.com"
            keyboardType="email-address"
            className="border border-border rounded-2xl px-2 h-14 py-2 w-[350px] text-foreground"
          />
        </View>
        <View className="flex items-start gap-2">
          <Label className="text-foreground">Password</Label>
          <TextInput
            placeholder="Secure1234@"
            keyboardType="visible-password"
            className="border border-border rounded-2xl px-2 h-14 py-2 w-[350px] text-foreground"
          />
        </View>
        <View className="flex items-start gap-2">
          <Label className="text-foreground">Confirm Password</Label>
          <TextInput
            placeholder="Secure1234@"
            keyboardType="visible-password"
            className="border border-border rounded-2xl px-2 h-14 py-2 w-[350px] text-foreground"
          />
        </View>
        <TouchableOpacity className="mt-8 bg-primary w-[350px] h-14 rounded-2xl items-center justify-center">
          <Text className="text-white">Login</Text>
        </TouchableOpacity>
        <Text className="text-foreground mt-4">
          Don&apos;t have an account ?{" "}
          <Link href="/register" className="text-primary">
            Register
          </Link>
        </Text>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
