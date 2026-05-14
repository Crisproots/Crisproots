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
      // Unused variables / imports
      "@typescript-eslint/no-unused-vars": "warn",
      "no-unused-vars": "warn",

      // Explicit any
      "@typescript-eslint/no-explicit-any": "warn",

      // Unescaped entities in JSX
      "react/no-unescaped-entities": "warn",

      // prefer-const
      "prefer-const": "warn",

      // require() style imports
      "@typescript-eslint/no-require-imports": "warn",

      // React hooks exhaustive-deps
      "react-hooks/exhaustive-deps": "warn",

      // Next.js specific
      "@next/next/no-img-element": "warn",
      "@next/next/no-html-link-for-pages": "warn",

      // Anonymous default exports
      "import/no-anonymous-default-export": "warn",
    },
  },
];

export default eslintConfig;
