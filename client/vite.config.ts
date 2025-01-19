import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {},
  build: {
    sourcemap: process.env.NODE_ENV === "development",
  },
  // test: {
  //   //TODO: Solve  The last overload error.type 'UserConfigExport'
  //   environment: "jsdom",
  //   globals: true,
  //   setupFiles: "./src/setupTests.ts",
  //   coverage: {
  //     provider: "istanbul", // or 'v8'
  //   },
  // },
});
