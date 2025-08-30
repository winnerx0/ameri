import { Text, TextProps } from "react-native";
import { useTheme } from "@react-navigation/native";

export function ThemedText({className, children, onPress, props}: {className?: string, children?: React.ReactNode, onPress?: () => void, props?: TextProps}) {
  const { colors } = useTheme();
  return <Text {...props} className={className} style={[{ color: colors.text }]} onPress={onPress}>{children}</Text>;
}
