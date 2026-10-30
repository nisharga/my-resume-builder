const { getSentryExpoConfig } = require("@sentry/react-native/metro");
const { withNativewind } = require("nativewind/metro");

// getSentryExpoConfig replaces expo's getDefaultConfig and adds
// Sentry's source-map support in a way that works with Expo's serializer.
const config = getSentryExpoConfig(__dirname);

module.exports = withNativewind(config, { inlineRem: 16 });

// const { getDefaultConfig } = require("expo/metro-config");
// const { withNativewind } = require("nativewind/metro");
// const { withSentryConfig } = require("@sentry/react-native/metro");

// const config = getDefaultConfig(__dirname);
// const nativewindConfig = withNativewind(config, { inlineRem: 16 });

// // withSentryConfig adds the source-map serializer so Sentry can map
// // minified stack frames back to your original source code.
// module.exports = withSentryConfig(nativewindConfig);
