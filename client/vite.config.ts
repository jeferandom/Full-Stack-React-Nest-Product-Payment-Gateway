import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    https: process.env.NODE_ENV !== "development",
  },
  build: {
    sourcemap: process.env.NODE_ENV === "development",
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/setupTests.ts",
    coverage: {
      provider: "istanbul", // or 'v8'
    },
  },
});
