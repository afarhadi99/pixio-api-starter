// eslint.config.mjs
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

// Define the ignore pattern
const ignoresPattern = "supabase-functions/**"; // Ignores the directory and everything inside it

const eslintConfig = [
  // Add the ignores configuration at the top level
  {
    ignores: [
        ignoresPattern,
        "**/node_modules/**", // Good practice to explicitly ignore node_modules
        "**/.next/**",      // Ignore Next.js build output
        "**/dist/**",       // Ignore common build output directories
        "**/build/**"       // Ignore common build output directories
    ]
  },

  // Existing configurations
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // Global rules
  {
    rules: {
      // Allow unused variables that start with underscore
      "@typescript-eslint/no-unused-vars": ["warn", {
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_",
        "ignoreRestSiblings": true
      }],

      // Warn instead of error for prefer-const
      "prefer-const": "warn",
    }
  },

  // Specific rules for supabase middleware
  {
    files: ["src/lib/supabase/middleware.ts"],
    rules: {
      "prefer-const": "off" // Turn off just for this file
    }
  }
];

export default eslintConfig;
