import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ThemedView } from "./ThemedView";
import { TextInput } from "react-native";
import { useTheme } from "@react-navigation/native";
const MacroInput = ({
  placeholder,
  value,
  onChangeText,
  icon,
}: {
  placeholder: string;
  value: number;
  onChangeText: (value: string) => void;
  icon: string;
}) => {
  const { colors } = useTheme();
  return (
    <ThemedView className="flex-1 relative">
      <MaterialCommunityIcons
        name={icon as any}
        size={16}
        color={colors.text}
        style={{ position: "absolute", left: 12, top: 14, zIndex: 1 }}
      />
      <TextInput
        placeholder={placeholder}
        keyboardType="numeric"
        placeholderTextColor={colors.text}
        style={{ color: colors.text }}
        className="border border-border rounded-xl px-3 pl-10 h-12"
        value={value > 0 ? String(value) : ""}
        onChangeText={onChangeText}
        returnKeyType="done"
      />
    </ThemedView>
  );
};

export default MacroInput;
