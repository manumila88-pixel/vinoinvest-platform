import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 600,
    target: "es2020",
    cssCodeSplit: true,
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/recharts") || id.includes("node_modules/d3")) return "charts";
          if (id.includes("node_modules/@supabase")) return "supabase";
          if (id.includes("node_modules/react-window")) return "virtual";
          if (id.includes("node_modules/i18next") || id.includes("node_modules/react-i18next")) return "i18n";
          if (id.includes("node_modules/react") || id.includes("node_modules/react-dom") || id.includes("node_modules/react-router")) return "vendor";
        },
      },
    },
  },
});
