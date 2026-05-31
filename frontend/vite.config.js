import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

// Helper for __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// High-performance Vite orchestration engine configuration
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Establish clean path mapping for complex component tree imports
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    host: "127.0.0.1", // Force IPv4 explicitly
    open: true,
  },
  build: {
    outDir: "dist",
    sourcemap: true, // Essential for production diagnostic monitoring
    rollupOptions: {
      output: {
        // Optimize chunk splitting for complex 3D and interactive components
        manualChunks: {
          vendor: [
            "react",
            "react-dom",
            "react-router-dom",
            "@tanstack/react-query",
          ],
          three: ["three", "@react-three/fiber", "@react-three/drei"],
        },
      },
    },
  },
});
