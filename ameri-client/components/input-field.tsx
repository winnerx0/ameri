import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { TextInput } from "react-native";
import { useTheme } from "@react-navigation/native";

const InputField = ({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = "default",
  icon,
  disabled,
  defaultValue
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  keyboardType?: "default" | "email-address" | "phone-pad" | "numeric";
  icon: string;
  disabled?: boolean;
  defaultValue?: string;
}) => {
  const { colors } = useTheme();
  return (
    <ThemedView className="mb-4 flex flex-col gap-4 w-full">
      <ThemedText className="font-medium mb-2 text-sm uppercase tracking-wide opacity-70">
        {label}
      </ThemedText>
      <ThemedView className="relative flex flex-row items-center w-full h-14 border border-border rounded-xl px-4 gap-4">
        <MaterialCommunityIcons
          name={icon as any}
          size={18}
          color={colors.text}
        />
        <TextInput
          placeholder={placeholder}
          keyboardType={keyboardType}
          placeholderTextColor={colors.text}
          defaultValue={defaultValue ?? ""}
          style={{ color: colors.text }}
          className="h-full text-base p-0 w-full"
          value={value}
          onChangeText={onChangeText}
          aria-disabled={disabled}
        />
      </ThemedView>
    </ThemedView>
  );
};
export default InputField;
