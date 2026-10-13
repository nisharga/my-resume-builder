// eslint.config.js
const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");
const eslintConfigPrettier = require("eslint-config-prettier/flat");

module.exports = defineConfig([
  expoConfig,
  eslintConfigPrettier, // must come last: turns off ESLint rules that conflict with Prettier
  {
    ignores: ["dist/*", "android/*", "ios/*", ".expo/*", "node_modules/*"],
  },
]);
