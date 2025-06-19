// eslint.config.js

import js from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

// Uncomment below if you use testing libraries (e.g., Jest)
// import jest from "eslint-plugin-jest";

export default [
  {
    ignores: [
      "dist",
      "build",
      "node_modules",
      // Add more ignored folders as needed
    ],
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2022, // Allow latest ES features
      sourceType: "module",
      globals: {
        ...globals.browser,
        // ...globals.node, // Uncomment if you run code in Node.js
      },
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      // "jest": jest, // Uncomment if using Jest
    },
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      // "plugin:jest/recommended", // Uncomment if using Jest
    ],
    rules: {
      // React Hooks best practices
      ...reactHooks.configs.recommended.rules,
      // React Fast Refresh support
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      // TypeScript best practices
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { vars: "all", args: "after-used", ignoreRestSiblings: true },
      ],
      "@typescript-eslint/consistent-type-imports": "warn",
      "@typescript-eslint/prefer-optional-chain": "warn",
      // Additional React rules
      "react/self-closing-comp": "warn",
      // General best practices
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-debugger": "warn",
      // Add more rules as your project evolves!
    },
  },
  // Add further overrides/configs below as needed
];
