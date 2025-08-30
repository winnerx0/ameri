import {
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useTheme } from "@react-navigation/native";
import { router } from "expo-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";

import { api, BACKEND_URL } from "@/utils";
import { Text } from "react-native";
import Loading from "@/components/Loading";
import InputField from "@/components/input-field";
import { UserData } from "@/types";

interface PersonalInfo {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  dateOfBirth: string;
}

const PersonalInfoEdit = () => {
  const { colors } = useTheme();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<Pick<UserData, "username" | "email" | "dateOfBirth">>({
    username: "",
    email: "",
    dateOfBirth: "",
  });

  const [isNavigationReady, setIsNavigationReady] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsNavigationReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleGoBack = () => {
    try {
      if (isNavigationReady && router.canGoBack()) router.back();
      else router.replace("/(tabs)/home");
    } catch {
      router.replace("/(tabs)/home");
    }
  };

  /* --- fetch current user --- */
  const { data, isLoading } = useQuery({
    queryKey: ["user-data"],
    queryFn: async () => {
      const res = await api.get(BACKEND_URL + "/user/me");
      if (res.status !== 200) throw new Error("Failed to fetch user data");
      const data = res.data.data;
console.log("data", data)
      setFormData(data);
      return data as UserData;
    },
  });
  
  console.log("form data", formData)

  /* --- update mutation --- */
  const { mutate: updatePersonalInfo, isPending } = useMutation({
    mutationKey: ["update-personal-info"],
    mutationFn: async (data: UserData) => {
      const res = await api.put(BACKEND_URL + "/user/me", data);
      if (res.status !== 200)
        throw new Error(res.data?.message || "Update failed");
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-data"] });
      queryClient.invalidateQueries({ queryKey: ["user-personal-info"] });
      Alert.alert("Success", "Personal information updated!");
      handleGoBack();
    },
    onError: () =>
      Alert.alert(
        "Error",
        "Could not update your information. Please try again.",
      ),
  });

  const handleSave = () => {
    if (!formData.username.trim() || !formData.email.trim()) {
      Alert.alert("Validation Error", "Username and email are required.");
      return;
    }
    updatePersonalInfo(formData);
  };



  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={{ backgroundColor: colors.background }}
        className="h-full w-full"
      >
        {/* Header */}
        {
           !data && isLoading ? (<Loading/>) : data ? <>
            <ThemedView className="px-4 py-2 border-b border-border/50">
              <TouchableOpacity
                className="flex flex-row items-center mb-4"
                onPress={handleGoBack}
              >
                <MaterialCommunityIcons
                  name="chevron-left"
                  size={24}
                  color={colors.text}
                />
                <ThemedText className="text-base ml-1 font-medium">Back</ThemedText>
              </TouchableOpacity>
    
              <ThemedText className="font-bold text-3xl mb-2">
                Personal Information
              </ThemedText>
              <ThemedText className="text-base mb-6 opacity-70">
                Update your personal details
              </ThemedText>
            </ThemedView>
    
            <ScrollView
              className="flex-1 px-4"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingTop: 20, paddingBottom: 120 }}
            >
              <ThemedView className="space-y-4">
                <InputField
                  label="Username"
                  defaultValue={data.username}
                  value={formData.username}
                  onChangeText={(t) => setFormData((p) => ({ ...p, username: t }))}
                  placeholder="Enter your username"
                  icon="account"
                />
                <InputField
                  label="Email"
                  disabled
                  defaultValue={data.email}
                  value={formData.email}
                  onChangeText={(t) => setFormData((p) => ({ ...p, email: t }))}
                  placeholder="Enter your email"
                  keyboardType="email-address"
                  icon="email"
                />
                {/*<InputField
                  label="First Name"
                  value={formData.firstName}
                  onChangeText={(t) => setFormData((p) => ({ ...p, firstName: t }))}
                  placeholder="Enter your first name"
                  icon="account-outline"
                />
                <InputField
                  label="Last Name"
                  value={formData.lastName}
                  onChangeText={(t) => setFormData((p) => ({ ...p, lastName: t }))}
                  placeholder="Enter your last name"
                  icon="account-outline"
                />*/}
                {/*<InputField
                  label="Phone Number"
                  value={formData.phone}
                  onChangeText={(t) => setFormData((p) => ({ ...p, phone: t }))}
                  placeholder="Enter your phone number"
                  keyboardType="phone-pad"
                  icon="phone"
                />*/}
                <InputField
                  label="Date of Birth"
                  value={formData.dateOfBirth}
                  onChangeText={(t) =>
                    setFormData((p) => ({ ...p, dateOfBirth: t }))
                  }
                  placeholder="YYYY-MM-DD"
                  icon="calendar"
                />
              </ThemedView>
            </ScrollView>
    
            {/* Save Button */}
            <ThemedView className="sticky bottom-16 left-0 right-0 border-t border-border/50 p-4">
              <TouchableOpacity
                style={{
                  backgroundColor: colors.primary,
                  opacity: isPending ? 0.5 : 1,
                }}
                disabled={isPending}
                onPress={handleSave}
                className="rounded-xl items-center justify-center h-14 shadow-lg"
              >
                {isPending ? (
                  <ThemedView className="flex-row items-center">
                    <ActivityIndicator size="small" color="#fff" />
                    <ThemedText className="text-white font-bold text-lg ml-2">
                      Saving...
                    </ThemedText>
                  </ThemedView>
                ) : (
                  <Text className="text-white font-bold text-lg">Save Changes</Text>
                )}
              </TouchableOpacity>
            </ThemedView>
          </> : <></>
        }
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default PersonalInfoEdit;
