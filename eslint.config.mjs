import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Disable strict TypeScript rules that block development
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-empty-object-type": "off",

      // Disable strict React rules
      "react-hooks/exhaustive-deps": "warn", // Change from error to warning
      "react/no-unescaped-entities": "off",

      // Allow unused parameters (common in React props)
      "no-unused-vars": "off",
    },
  },
];

export default eslintConfig;
