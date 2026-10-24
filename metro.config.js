const { getDefaultConfig } = require("expo/metro-config");
const { withNativewind } = require("nativewind/metro");
const { withSentryConfig } = require("@sentry/react-native/metro");

const config = getDefaultConfig(__dirname);
const nativewindConfig = withNativewind(config, { inlineRem: 16 });

// withSentryConfig adds the source-map serializer so Sentry can map
// minified stack frames back to your original source code.
module.exports = withSentryConfig(nativewindConfig);
