import { ConfigContext, ExpoConfig } from "expo/config";
import versions from "./versions.json";

type Variant = keyof typeof versions;

const variant: Variant = process.env.APP_VARIANT === "production" ? "production" : "preview";

const { major, ota } = versions[variant];

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...(config as ExpoConfig),
  version: `${major}.0.0`,
  runtimeVersion: `${ota}.0.0`,
});
