import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import checkFile from "eslint-plugin-check-file";
import perfectionist from "eslint-plugin-perfectionist";
import unusedImports from "eslint-plugin-unused-imports";
import { defineConfig, globalIgnores } from "eslint/config";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  {
    plugins: {
      "check-file": checkFile,
      perfectionist,
      "unused-imports": unusedImports,
    },

    rules: {
      "unused-imports/no-unused-imports": "error",

      "unused-imports/no-unused-vars": [
        "warn",
        {
          args: "after-used",
          argsIgnorePattern: "^_",
          vars: "all",
          varsIgnorePattern: "^_",
          caughtErrors: "none",
        },
      ],

      "perfectionist/sort-imports": "error",
    },
  },

  // Enforce kebab-case only in application directories.
  {
    files: [
      "app/**/*.{js,jsx,ts,tsx}",
      "components/**/*.{js,jsx,ts,tsx}",
      "features/**/*.{js,jsx,ts,tsx}",
      "lib/**/*.{js,jsx,ts,tsx}",
      "server/**/*.{js,jsx,ts,tsx}",
    ],
    rules: {
      "check-file/filename-naming-convention": [
        "error",
        {
          "**/*.{js,jsx,ts,tsx}": "KEBAB_CASE",
        },
        {
          ignoreMiddleExtensions: true,
        },
      ],
    },
  },

  // Next.js requires these exact reserved filenames.
  {
    files: [
      "app/**/page.{js,jsx,ts,tsx}",
      "app/**/layout.{js,jsx,ts,tsx}",
      "app/**/loading.{js,jsx,ts,tsx}",
      "app/**/error.{js,jsx,ts,tsx}",
      "app/**/global-error.{js,jsx,ts,tsx}",
      "app/**/not-found.{js,jsx,ts,tsx}",
      "app/**/route.{js,jsx,ts,tsx}",
      "app/**/template.{js,jsx,ts,tsx}",
      "app/**/default.{js,jsx,ts,tsx}",
      "app/**/instrumentation.{js,jsx,ts,tsx}",
      "app/**/middleware.{js,jsx,ts,tsx}",
    ],
    rules: {
      "check-file/filename-naming-convention": "off",
    },
  },

  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts", "coverage/**", "dist/**"]),
]);

export default eslintConfig;
