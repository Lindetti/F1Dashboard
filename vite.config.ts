import { defineConfig } from "vite";
import tailwindcss from "tailwindcss";

export default defineConfig({
  css: {
    postcss: {
      plugins: [tailwindcss],
    },
  },
  server: {
    headers: {
      "Content-Security-Policy":
        "script-src 'self' 'unsafe-inline' 'unsafe-eval'; object-src 'none';",
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          leaflet: ["leaflet", "react-leaflet"],
        },
      },
    },
  },
});
