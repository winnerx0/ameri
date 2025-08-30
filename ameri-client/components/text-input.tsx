import { AppColors, LoginRequest, RegisterRequest } from "@/types";
import { TextInput, View } from "react-native";
import { KeyboardTypeOptions } from "react-native";
import { ThemedText } from "./ThemedText";

type InputProps =
  | {
      type: "login";
      data: keyof LoginRequest;
      value?: string;
      setData: React.Dispatch<React.SetStateAction<LoginRequest>>;
      label: string;
      placeholder: string;
      keyboardType: KeyboardTypeOptions;
      colors: AppColors;
    }
  | {
      type: "register";
      data: keyof RegisterRequest;
      value?: string;
      setData: (field: keyof RegisterRequest, value: any) => void;
      label: string;
      placeholder: string;
      keyboardType: KeyboardTypeOptions;
      colors: AppColors;
    };

const Input = (props: InputProps) => {
  const {
    label,
    data,
    value,
    placeholder,
    keyboardType,
    setData,
    colors,
    type,
  } = props;

  return (
    <View className="flex items-start gap-2">
      <ThemedText className="font-light">{label}</ThemedText>
      <TextInput
        value={value}
        placeholder={placeholder}
        keyboardType={keyboardType}
        placeholderTextColor={colors.placeholder}
        style={{
          color: colors.text,
        }}
        className="border border-border rounded-2xl px-2 h-14 py-2 w-[350px]"
        onChangeText={(text) => {
          if (type === "login") {
            setData((prev) => ({ ...prev, [data]: text }));
          } else {
            setData(data, text);
          }
        }}
      />
    </View>
  );
};

export default Input;
