import { View } from "react-native";
import { useTheme } from "@react-navigation/native";
import { ViewProps } from "react-native";

type AppColors = {
  primary: string;
  secondary?: string;
  background: string;
  text: string;
  border: string;
  card: string;
};

type Colors = "primary" | "secondary" | "background" | "text" | "border" | "card"
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
