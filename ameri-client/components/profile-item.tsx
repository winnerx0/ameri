import { TouchableOpacity } from "react-native";
import { useTheme } from "@react-navigation/native";

import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";

const ProfileItem = ({
  title,
  value,
  onPress,
}: {
  title: string;
  value: string;
  onPress: () => void;
}) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: colors.card,
        borderColor: colors.border,
      }}
      className="border rounded-lg p-4 flex-row justify-between items-center"
    >
      <ThemedView>
        <ThemedText className="text-sm opacity-70">{title}</ThemedText>
        <ThemedText className="text-base font-medium mt-1">{value}</ThemedText>
      </ThemedView>
      <ThemedText className="text-lg opacity-70">→</ThemedText>
    </TouchableOpacity>
  );
};

export default ProfileItem;