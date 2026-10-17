/**
 * JS mirror of the CSS @theme tokens in global.css.
 * Change values here AND in global.css together — this file is for
 * React Native StyleSheet usage where NativeWind className can't be used
 * (e.g. tab bar config, navigation options).
 */

export const colors = {
  // Brand
  primary: "#4a6cf7",
  secondary: "#f1f2f5",
  tertiary: "#212121",

  // Surface
  background: "#f7f8fa",
  white: "#ffffff",
  black: "#000000",

  // Text
  foreground: "#1a1f36",
  heading: "#1a1f36",
  body: "#6b7280",
  mutedForeground: "#6b7280",
  subtleForeground: "#9aa3af",

  // Borders
  border: "#e6e8ec",
  divider: "#dcdde1",
  input: "#e6e8ec",

  // Semantic
  success: "#4caf50",
  warning: "#f59e0b",
  destructive: "#e7000b",
  link: "#4a6cf7",
  purple: "#8b8fff",
  ring: "#4a6cf7",

  // Component tokens
  accent: "#eef2ff",
  accentForeground: "#1a1f36",
  popover: "#ffffff",
  popoverForeground: "#1a1f36",
  muted: "#073b74",

  // Gradients
  primaryGradientFrom: "#4a6cf7",
  primaryGradientTo: "#6c8cff",

  // toast bg
  successBg: "#ecfdf5",
  warningBg: "#fffbeb",
  destructiveBg: "#fef2f2",
};

export const darkColors = {
  primary: "#5b7cfa",
  secondary: "#1e2330",
  tertiary: "#e4e6eb",

  background: "#0e1117",
  surface: "#161a23",
  white: "#ffffff",
  black: "#000000",

  foreground: "#f5f6fa",
  heading: "#f5f6fa",
  body: "#a0a8b6",
  mutedForeground: "#a0a8b6",
  subtleForeground: "#7c8595",

  border: "#262b37",
  divider: "#2e3442",
  input: "#2e3442",

  success: "#5cc160",
  warning: "#fbbf24",
  destructive: "#ff6467",
  link: "#7c95ff",
  purple: "#a3a6ff",
  ring: "#7c95ff",

  accent: "#1f2640",
  accentForeground: "#f5f6fa",
  popover: "#1b202b",
  popoverForeground: "#f5f6fa",
  muted: "#1e2330",

  primaryGradientFrom: "#5b7cfa",
  primaryGradientTo: "#7c95ff",

  successBg: "#052e16",
  warningBg: "#1c1400",
  destructiveBg: "#1c0002",
};
