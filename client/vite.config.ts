import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {},
  build: {
    sourcemap: process.env.NODE_ENV === "development",
  },
});
