import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
  build: {
    rollupOptions: {
      input: {
        home: path.resolve(__dirname, "index.html"),
        kurtaSurwal: path.resolve(__dirname, "kurta-surwal.html"),
        lehenga: path.resolve(__dirname, "lehenga.html"),
        pants: path.resolve(__dirname, "pants.html"),
        tops: path.resolve(__dirname, "shirt-tops-blouses.html"),
        admin: path.resolve(__dirname, "admin.html"),
      },
    },
  },
});
