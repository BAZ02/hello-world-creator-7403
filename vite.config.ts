// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  vite: {
    plugins: [
      VitePWA({
        registerType: "autoUpdate",
        includeAssets: ["favicon.ico", "pwa-192.svg", "pwa-512.svg"],
        manifest: {
          name: "Espace Stagiaires CFP02",
          short_name: "Espace Stagiaires",
          description: "Espace sécurisé pour les stagiaires, formateurs et administrateurs du CFP02.",
          theme_color: "#16324F",
          background_color: "#F4F7F8",
          display: "standalone",
          start_url: "/",
          scope: "/",
          icons: [
            { src: "/pwa-192.svg", sizes: "192x192", type: "image/svg+xml", purpose: "any maskable" },
            { src: "/pwa-512.svg", sizes: "512x512", type: "image/svg+xml", purpose: "any maskable" },
          ],
        },
      }),
    ],
  },
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
});
