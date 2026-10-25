const versions = require("./versions.json");

export default ({ config }) => {
  const profile = process.env.APP_PROFILE; // "preview" | "production" | undefined
  const v = versions[profile];

  // development / local: fall back to app.json
  if (!v) {
    return { ...config, runtimeVersion: config.version };
  }

  const version = `${v.major}.0.0`;

  return {
    ...config,
    version,
    runtimeVersion: version,
    updates: {
      ...config.updates,
      requestHeaders: { "expo-channel-name": profile },
    },
    extra: {
      ...config.extra,
      otaVersion: `${v.major}.0.${v.ota}`,
    },
  };
};
