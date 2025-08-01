import { View, TextInput, Text, TouchableOpacity } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";
import { Label } from "@react-navigation/elements";
import Dropdown from "react-native-input-select";
import { useState } from "react";

export default function ContinueScreen() {
  const [form, setForm] = useState({
    gender: "",
  });
  return (
    <SafeAreaProvider>
      <SafeAreaView className="dark bg-background text-foreground h-screen items-center justify-center gap-4">
        <Dropdown
          label="Select Gender"
          placeholder="Select an gender"
          options={[
            { label: "Male", value: "MALE" },
            { label: "Female", value: "FEMALE" },
          ]}
          onValueChange={(e) => {
            setForm((prev) => ({ ...prev, gender: e?.toString()! }));
          }}
          primaryColor={"hsl(var(--primary))"}
          optionValue={form.gender}
          selectedValue={form.gender}
          dropdownContainerStyle={{ width: 300, justifyContent: "center" }}
        />
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
