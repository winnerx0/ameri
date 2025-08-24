import { useColorScheme } from "@/hooks/useColorScheme";
import { clsx } from "clsx";
import { Text, View, TouchableOpacity } from "react-native";

const ProfileItem = ({
  title,
  value,
  onPress,
}: {
  title: string;
  value: string;
  onPress: () => void;
}) => {
  const colorScheme = useColorScheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      className={clsx(
        colorScheme === "dark" ? "dark" : "",
        "bg-card border border-border rounded-lg p-4 flex-row justify-between items-center"
      )}
    >
      <View>
        <Text
          className={clsx(
            colorScheme === "dark" ? "dark" : "",
            "text-muted-foreground text-sm"
          )}
        >
          {title}
        </Text>
        <Text
          className={clsx(
            colorScheme === "dark" ? "dark" : "",
            "text-foreground text-base font-medium mt-1"
          )}
        >
          {value}
        </Text>
      </View>
      <Text
        className={clsx(
          colorScheme === "dark" ? "dark" : "",
          "text-muted-foreground text-lg"
        )}
      >
        →
      </Text>
    </TouchableOpacity>
  );
};

export default ProfileItem;
