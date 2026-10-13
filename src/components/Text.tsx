// src/components/Text.tsx
import { Text as RNText, type TextProps } from "react-native";

const variants = {
  heading: "font-inter-bold text-2xl",
  title: "font-inter-semibold text-lg",
  body: "font-inter text-base",
  caption: "font-inter text-sm text-muted-foreground",
} as const;

type Props = TextProps & {
  className?: string;
  variant?: keyof typeof variants;
};

export default function Text({ variant = "body", className, children, ...props }: Props) {
  return (
    <RNText className={`text-foreground ${variants[variant]} ${className ?? ""}`} {...props}>
      {children}
    </RNText>
  );
}
