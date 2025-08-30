import { View, ActivityIndicator } from "react-native";
import { useTheme } from "@react-navigation/native";
const Loading = () => {
  const { colors } = useTheme();
  return (
    <View className="w-full h-full items-center justify-center flex self-center">
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
};

export default Loading;
