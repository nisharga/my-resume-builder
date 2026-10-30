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
  {
    rules: {
      // Reanimated shared values (.value mutations) are a false positive for this rule
      "react-hooks/immutability": "off",
    },
  },
  {
    files: ["**/__tests__/**/*.[jt]s?(x)", "**/*.test.[jt]s?(x)"],
    rules: {
      // jest.mock() factories are hoisted before imports so require() is the only option
      "@typescript-eslint/no-require-imports": "off",
    },
  },
]);
