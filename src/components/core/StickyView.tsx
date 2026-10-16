import type { ReactNode } from "react";
import { View, type ViewProps } from "react-native";

type Props = ViewProps & {
  /** Tells Screen to pin this child to the top when scrolled past */
  sticky?: boolean;
  children: ReactNode;
};

// Thin wrapper around View. The `sticky` prop is consumed by Screen's
// auto-detection logic — it is not forwarded to the native View.
export default function StickyView({ sticky: _sticky, children, ...props }: Props) {
  return <View {...props}>{children}</View>;
}
