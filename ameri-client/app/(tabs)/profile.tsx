import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import {
  TouchableOpacity,
  Image,
  ScrollView,
  RefreshControl,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { useTheme } from "@react-navigation/native";
import api, { BACKEND_URL } from "@/utils";
import { UserData } from "@/types";
import Loading from "@/components/Loading";
import { MaterialCommunityIcons } from "@expo/vector-icons";

/* NEW imports */
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";

import ProfileItem from "@/components/profile-item";
import { Text } from "react-native";
import { useScreen } from "@/utils/store";

export default function Profile() {
  const { colors } = useTheme();
  const { setScreen } = useScreen()

  const logout = async () => {
    await AsyncStorage.multiRemove(["accessToken", "refreshToken"]);
    setScreen({path: "login"})
    router.replace("/(auth)");
  };

  const { data, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: ["user-data"],
    queryFn: async () => {
      const res = await api(BACKEND_URL + "/user/me");
      if (res.status !== 200) throw new Error("Network response was not ok");
      return res.data.data as UserData;
    }
  });

  const { data: dietaryData } = useQuery({
    queryKey: ["user-dietary-preferences"],
    queryFn: async () => {
      const res = await api.get(BACKEND_URL + "/user/dietary-preferences");
      if (res.status !== 200) return { dietaryRestrictions: [] };
      return res.data.data;
    },
  });

  const formatDietaryRestrictions = () => {
    if (
      !dietaryData?.dietaryRestrictions ||
      dietaryData.dietaryRestrictions.length === 0
    ) {
      return "Not set";
    }
    return (
      dietaryData.dietaryRestrictions.slice(0, 2).join(", ") +
      (dietaryData.dietaryRestrictions.length > 2 ? "..." : "")
    );
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ backgroundColor: colors.background }} className="flex-1">
        {isLoading ? (
          <Loading />
        ) : (
          data && (
            <ScrollView
              className="px-4"
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
              }
            >
              {/* Header */}
              <ThemedView className="items-center pt-8 pb-6">
                <ThemedView
                  color="primary"
                  className="w-24 h-24 rounded-full items-center justify-center mb-4"
                >
                  <ThemedText className=" text-2xl font-bold">
                    {data.username.charAt(0).toUpperCase()}
                  </ThemedText>
                </ThemedView>
                <ThemedText className="text-xl font-bold">
                  {data.username}
                </ThemedText>
                <ThemedText className="text-base opacity-70">
                  {data.email}
                </ThemedText>
              </ThemedView>

              {/* Stats Cards */}
              <ThemedView className="flex-row justify-between mb-6">
                <ThemedView
                  color="card"
                  className="border border-border rounded-lg p-4 flex-1 mr-2 items-center"
                >
                  <ThemedText className="text-2xl font-bold">
                    {data.loggedMeals}
                  </ThemedText>
                  <ThemedText className="text-sm opacity-70">
                    Meals Logged
                  </ThemedText>
                </ThemedView>

                <ThemedView
                  color="card"
                  className="border border-border rounded-lg p-4 flex-1 ml-2 items-center"
                >
                  <ThemedText className="text-2xl font-bold">23</ThemedText>
                  <ThemedText className="text-sm opacity-70">
                    Day Streak
                  </ThemedText>
                </ThemedView>
              </ThemedView>

              {/* Profile Options */}
              <ThemedView className="gap-3">
                <ProfileItem
                  title="Personal Information"
                  value={`${data.username || "Name"}, ${data.email}`}
                  onPress={() => router.push("/personal-info-edit")}
                />

                <ProfileItem
                  title="Dietary Preferences"
                  value={formatDietaryRestrictions()}
                  onPress={() => router.push("/dietary-preferences")}
                />
              </ThemedView>

              {/* Sign Out Button */}
              <TouchableOpacity
                style={{ backgroundColor: colors.notification }}
                className="rounded-lg p-4 mt-8 mb-16"
                onPress={logout}
              >
                <Text className="text-white font-semibold text-center text-base">
                  Sign Out
                </Text>
              </TouchableOpacity>
            </ScrollView>
          )
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}