import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

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
    port: 3000,
    open: true, // Auto-launch browser on dev server start
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

