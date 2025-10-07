import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { createServer } from "./server";
import { fileURLToPath } from "url";

// Fix __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    fs: {
      allow: [
        // ✅ Added this line to allow the root "BOTS" folder (where index.html is)
        path.resolve(__dirname, "."),

        // existing allowed folders
        path.resolve(__dirname, "client"),
        path.resolve(__dirname, "shared"),
        path.resolve(__dirname, "public"),
      ],
      deny: [".env", ".env.*", "*.{crt,pem}", "**/.git/**", "server/**"],
    },
  },
  build: {
    outDir: "dist/spa",
  },
  plugins: [react(), expressPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },
}));

function expressPlugin(): Plugin {
  return {
    name: "express-plugin",
    apply: "serve", // only in dev
    configureServer(server) {
      const app = createServer();
      server.middlewares.use(app);
    },
  };
}
