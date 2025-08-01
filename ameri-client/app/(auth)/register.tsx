import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Link, router } from "expo-router";
import { Label } from "@react-navigation/elements";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default function RegisterScreen() {
  return (
    <SafeAreaProvider>
      <SafeAreaView className="dark bg-background text-foreground h-screen items-center justify-center gap-4">
        <Text className="text-3xl font-bold text-foreground">Ameri</Text>
        <Text className="text-foreground italic">Manage your health the right way</Text>
        <View className="flex items-start gap-2">
          <Label className="text-foreground">Username</Label>
          <TextInput
            placeholder="samuelmadison@gmail.com"
            className="border border-border rounded-2xl px-2 h-14 py-2 w-[350px] text-foreground"
          />
        </View>
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
        <TouchableOpacity className="mt-8 bg-primary w-[350px] h-14 rounded-2xl items-center justify-center" onPress={() => router.push('/continue')}>
          <Text className="text-white">Continue <Icon name="chevron-right"/></Text>
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
