import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  RefreshControl,
} from "react-native";
import { clsx } from "clsx";
import { useColorScheme } from "@/hooks/useColorScheme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import ProfileItem from "@/components/profile-item";
import { useQuery } from "@tanstack/react-query";
import api, { BACKEND_URL } from "@/utils";
import { UserData } from "@/types";
import Loading from "@/components/Loading";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function Profile() {
  const colorScheme = useColorScheme();

  const logout = async () => {
    await AsyncStorage.multiRemove(["accessToken", "refreshToken"]);
    router.replace("/(auth)");
  };

  const { data, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: ["user-data"],
    queryFn: async () => {
      const res = await api(BACKEND_URL + "/user/me");
      if (res.status !== 200) throw new Error("Network response was not ok");
      return res.data.data as UserData;
    },
  });

  // Fetch dietary preferences for display
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

  console.log(data);

  return (
    <SafeAreaProvider>
      <SafeAreaView
        className={clsx(
          colorScheme === "dark" ? "dark" : "",
          "bg-background flex-1"
        )}
      >
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
              <View className="items-center pt-8 pb-6">
                <View
                  className={clsx(
                    colorScheme === "dark" ? "dark" : "",
                    "w-24 h-24 rounded-full bg-primary items-center justify-center mb-4"
                  )}
                >
                  <Text
                    className={clsx(
                      colorScheme === "dark" ? "dark" : "",
                      "text-white text-2xl font-bold"
                    )}
                  >
                    {data.username.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <Text
                  className={clsx(
                    colorScheme === "dark" ? "dark" : "",
                    "text-foreground text-xl font-bold"
                  )}
                >
                  {data.username}
                </Text>
                <Text
                  className={clsx(
                    colorScheme === "dark" ? "dark" : "",
                    "text-muted-foreground text-base"
                  )}
                >
                  {data.email}
                </Text>
              </View>

              {/* Stats Cards */}
              <View className="flex-row justify-between mb-6">
                <View
                  className={clsx(
                    colorScheme === "dark" ? "dark" : "",
                    "bg-card border border-border rounded-lg p-4 flex-1 mr-2 items-center"
                  )}
                >
                  <Text
                    className={clsx(
                      colorScheme === "dark" ? "dark" : "",
                      "text-foreground text-2xl font-bold"
                    )}
                  >
                    {data.loggedMeals}
                  </Text>
                  <Text
                    className={clsx(
                      colorScheme === "dark" ? "dark" : "",
                      "text-muted-foreground text-sm"
                    )}
                  >
                    Meals Logged
                  </Text>
                </View>

                <View
                  className={clsx(
                    colorScheme === "dark" ? "dark" : "",
                    "bg-card border border-border rounded-lg p-4 flex-1 ml-2 items-center"
                  )}
                >
                  <Text
                    className={clsx(
                      colorScheme === "dark" ? "dark" : "",
                      "text-foreground text-2xl font-bold"
                    )}
                  >
                    23
                  </Text>
                  <Text
                    className={clsx(
                      colorScheme === "dark" ? "dark" : "",
                      "text-muted-foreground text-sm"
                    )}
                  >
                    Day Streak
                  </Text>
                </View>
              </View>

              {/* Profile Options */}
              <View className="gap-3">
                <ProfileItem
                  title="Personal Information"
                  value={`${data.username || "Name"}, ${data.email}`}
                  onPress={() => router.push("/personal-info-edit")}
                  // icon="account-edit"
                />

                <ProfileItem
                  title="Dietary Preferences"
                  value={formatDietaryRestrictions()}
                  onPress={() => router.push("/dietary-preferences")}
                  // icon="food"
                />

                {/* <ProfileItem
                  title="Nutrition Goals"
                  value="Set daily calorie and macro targets"
                  onPress={() => router.push("/nutrition-goals")}
                  // icon="target"
                /> */}

                {/* <ProfileItem
                  title="App Settings"
                  value="Notifications, theme, units"
                  onPress={() => router.push("/app-settings")}
                  icon="cog"
                /> */}
              </View>

              {/* Sign Out Button */}
              <TouchableOpacity
                className={clsx(
                  colorScheme === "dark" && "dark",
                  "bg-red-600 rounded-lg p-4 mt-8 mb-16"
                )}
                onPress={logout}
              >
                <Text
                  className={clsx(
                    colorScheme === "dark" ? "dark" : "",
                    "text-destructive-foreground font-semibold text-center text-base"
                  )}
                >
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
