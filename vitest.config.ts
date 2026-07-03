import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";
import { alias, define } from "./vite-shared.config";

export default defineConfig({
  resolve: { alias },
  define,
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: false,
    css: true,
    setupFiles: ["./src/test/setup.ts"],
    restoreMocks: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/**/*.d.ts",
        "src/**/*.model.ts",
        "src/**/*.type.ts",
        "src/test/**",
        "src/app/router/**",
        "src/app/providers/theme.config.ts",
        "src/main.tsx",
        "src/shared/config/constants.const.ts",
      ],
    },
  },
});
