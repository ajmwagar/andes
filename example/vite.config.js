import { defineConfig } from "vite";
import { docsKit } from "@ajmwagar/andes/vite";

const root = import.meta.dirname;

export default defineConfig({
  root,
  plugins: [
    docsKit({
      root,
      repoRoot: root,
      manifest: "docs.json",
      defaultAudience: "public",
    }),
  ],
  optimizeDeps: { exclude: ["@ajmwagar/andes"] },
  server: { port: 4321, strictPort: true },
  preview: { port: 4321, strictPort: true },
  build: { outDir: "dist", emptyOutDir: true },
});
