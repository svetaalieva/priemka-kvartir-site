// eslint.config.mjs
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTs,

  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),

  {
    rules: {
      // 🔥 Полностью отключаем tailwind “каноничные классы”
      "tailwindcss/suggestCanonicalClasses": "off",
      "suggestCanonicalClasses": "off",

      // 🔥 Отключаем предупреждение про setState в effect
      "react-hooks/set-state-in-effect": "off",

      // 🔥 Отключаем any warning
      "@typescript-eslint/no-explicit-any": "off"
    }
  }
]);
