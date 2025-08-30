import { View } from "react-native";
import { useTheme } from "@react-navigation/native";
import { ViewProps } from "react-native";
import { AppColors } from "@/types";

type Colors = "primary" | "secondary" | "background" | "text" | "border" | "card" | "placeholder"
export function ThemedView({
  className,
  children,
  color,
  props,
  border
}: {
  className?: string;
  children?: React.ReactNode;
  color?: Colors;
  props?: ViewProps | object[];
  border?: Colors;
}) {
  const { colors } = useTheme();

  const typedColors = colors as AppColors;
  return (
    <View
      {...props}
      className={className}
      style={[{ backgroundColor: typedColors[color ?? "background"], borderColor: border ? typedColors[border] : typedColors.border}]}
    >
      {children}
    </View>
  );
}
