import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Skip linting in production
const isProduction = process.env.NODE_ENV === 'production';

// Return empty config in production
if (isProduction) {
  console.log('Skipping ESLint in production build');
  export default [];
}

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    // Next.js specific configuration
    settings: {
      next: {
        rootDir: [__dirname],
      },
    },
    // ESLint configuration to match the previous next.config.ts
    rules: {
      // This mirrors the ignoreDuringBuilds: true setting from next.config.ts
      '@next/next/no-html-link-for-pages': 'off',
      'react/jsx-key': 'off',
    },
  },
];

export default eslintConfig;
