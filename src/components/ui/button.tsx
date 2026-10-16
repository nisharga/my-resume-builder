import { type ReactNode } from "react";
import { Pressable, Text, type PressableProps, type TextProps } from "react-native";

function Button({ children, ...props }: PressableProps & { children: ReactNode }) {
  return <Pressable {...props}>{children}</Pressable>;
}

function ButtonText({ children, ...props }: TextProps & { children: ReactNode }) {
  return <Text {...props}>{children}</Text>;
}

export { Button, ButtonText };
