import {
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  Alert,
  ActivityIndicator,
  useColorScheme,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { clsx } from "clsx";
import { router } from "expo-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, BACKEND_URL } from "@/utils";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";

interface PersonalInfo {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  dateOfBirth: string;
}

const PersonalInfoEdit = () => {

  const colorScheme = useColorScheme();
  
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<PersonalInfo>({
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    dateOfBirth: "",
  });

  const [isNavigationReady, setIsNavigationReady] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsNavigationReady(true);
    }, 100);

    return () => clearTimeout(timer);
  }, [colorScheme]);

  const handleGoBack = () => {
    try {
      if (isNavigationReady && router.canGoBack()) {
        router.back();
      } else {
        router.replace("/(tabs)/home");
      }
    } catch (error) {
      console.log("Navigation error:", error);
      router.replace("/(tabs)/home");
    }
  };

  // Fetch current user data
  const { isLoading } = useQuery({
    queryKey: ["user-personal-info"],
    queryFn: async () => {
      const res = await api.get(BACKEND_URL + "/user/me");
      if (res.status !== 200) throw new Error("Failed to fetch user data");
      const data = res.data.data;
       setFormData({
         username: data.username || "",
         email: data.email || "",
         firstName: data.firstName || "",
         lastName: data.lastName || "",
         phone: data.phone || "",
         dateOfBirth: data.dateOfBirth || "",
       });

       return data
    },
  
  
  });

  // Update personal info mutation
  const { mutate: updatePersonalInfo, isPending } = useMutation({
    mutationKey: ["update-personal-info"],
    mutationFn: async (data: PersonalInfo) => {
      const res = await api.put(BACKEND_URL + "/user/me", data);
      if (res.status !== 200)
        throw new Error(res.data?.message || "Update failed");
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-data"] });
      queryClient.invalidateQueries({ queryKey: ["user-personal-info"] });
      Alert.alert("Success", "Personal information updated successfully!");
      handleGoBack();
    },
    onError: (error: any) => {
      console.log("Error updating personal info:", error);
      Alert.alert(
        "Error",
        "Failed to update personal information. Please try again."
      );
    },
  });

  const handleSave = () => {
    if (!formData.username.trim() || !formData.email.trim()) {
      Alert.alert(
        "Validation Error",
        "Username and email are required fields."
      );
      return;
    }
    updatePersonalInfo(formData);
  };

  const InputField = ({
    label,
    value,
    onChangeText,
    placeholder,
    keyboardType = "default",
    icon,
  }: {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder: string;
    keyboardType?: "default" | "email-address" | "phone-pad" | "numeric";
    icon: string;
  }) => (
    <View className="mb-4">
      <Text className="text-foreground font-medium mb-2 text-sm uppercase tracking-wide opacity-70">
        {label}
      </Text>
      <View className="relative">
        <MaterialCommunityIcons
          name={icon as any}
          size={18}
          color={colorScheme === "dark" ? "#9CA3AF" : "#6B7280"}
          style={{ position: "absolute", left: 12, top: 13, zIndex: 1 }}
        />
        <TextInput
          placeholder={placeholder}
          keyboardType={keyboardType}
          style={{
            color: colorScheme === "dark" ? "#ffffff" : "#000000",
          }}
          placeholderTextColor={colorScheme === "dark" ? "#9CA3AF" : "#6B7280"}
          className="border border-border rounded-xl px-3 pl-12 h-12 text-base"
          value={value}
          onChangeText={onChangeText}
        />
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaProvider>
        <SafeAreaView className="bg-background flex-1 items-center justify-center">
          <ActivityIndicator
            size="large"
            color={colorScheme === "dark" ? "white" : "black"}
          />
          <Text className="text-foreground mt-4">Loading profile...</Text>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView
        className={clsx(
          colorScheme === "dark" ? "dark" : "",
          "bg-background h-full w-full"
        )}
      >
        {/* Header */}
        <View className="px-4 py-2 border-b border-border/50">
          <TouchableOpacity
            className="flex flex-row items-center mb-4"
            onPress={handleGoBack}
          >
            <MaterialCommunityIcons
              name="chevron-left"
              size={24}
              color={colorScheme === "dark" ? "white" : "black"}
            />
            <Text className="text-foreground text-base ml-1 font-medium">
              Back
            </Text>
          </TouchableOpacity>

          <Text className="font-bold text-foreground text-3xl mb-2">
            Personal Information
          </Text>
          <Text className="text-muted-foreground text-base mb-6">
            Update your personal details
          </Text>
        </View>

        <ScrollView
          className="flex-1 px-4"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 20, paddingBottom: 120 }}
        >
          <View className="space-y-4">
            <InputField
              label="Username"
              value={formData.username}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, username: text }))
              }
              placeholder="Enter your username"
              icon="account"
            />

            <InputField
              label="Email"
              value={formData.email}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, email: text }))
              }
              placeholder="Enter your email"
              keyboardType="email-address"
              icon="email"
            />

            <InputField
              label="First Name"
              value={formData.firstName}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, firstName: text }))
              }
              placeholder="Enter your first name"
              icon="account-outline"
            />

            <InputField
              label="Last Name"
              value={formData.lastName}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, lastName: text }))
              }
              placeholder="Enter your last name"
              icon="account-outline"
            />

            <InputField
              label="Phone Number"
              value={formData.phone}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, phone: text }))
              }
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
              icon="phone"
            />

            <InputField
              label="Date of Birth"
              value={formData.dateOfBirth}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, dateOfBirth: text }))
              }
              placeholder="YYYY-MM-DD"
              icon="calendar"
            />
          </View>
        </ScrollView>

        {/* Save Button */}
        <View className="absolute bottom-0 left-0 right-0 bg-background border-t border-border/50 p-4">
          <TouchableOpacity
            className={clsx(
              "bg-primary rounded-xl items-center justify-center h-14 shadow-lg",
              isPending && "opacity-50"
            )}
            disabled={isPending}
            onPress={handleSave}
          >
            {isPending ? (
              <View className="flex-row items-center">
                <ActivityIndicator size="small" color="white" />
                <Text className="text-white font-bold text-lg ml-2">
                  Saving...
                </Text>
              </View>
            ) : (
              <Text className="text-white font-bold text-lg">Save Changes</Text>
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default PersonalInfoEdit;
