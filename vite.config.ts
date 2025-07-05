import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { VitePWA } from 'vite-plugin-pwa';
import { componentTagger } from "lovable-tagger";
import path from "path";

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: "نظام مراقبة مرضى القلب",
        short_name: "مراقبة القلب",
        description: "نظام متكامل لمراقبة الحالة الصحية عن بُعد - جامعة الزاوية",
        theme_color: "#dc2626",
        background_color: "#ffffff",
        display: "standalone",
        orientation: "portrait",
        scope: "/",
        start_url: "/",
        lang: "ar",
        dir: "rtl",
        icons: [
          { "src": "/icon-152x152.png", "sizes": "152x152", "type": "image/png", "purpose": "maskable any" },
          { "src": "/icon-180x180.png", "sizes": "180x180", "type": "image/png", "purpose": "maskable any" },
          { "src": "/icon-192x192.png", "sizes": "192x192", "type": "image/png", "purpose": "maskable any" },
          { "src": "/icon-512x512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable any" }
        ],
        shortcuts: [
          {
            name: "لوحة تحكم المريض",
            short_name: "مريض",
            description: "مراقبة معدل ضربات القلب",
            url: "/patient-dashboard",
            icons: [{ "src": "/icon-192x192.png", "sizes": "192x192" }]
          },
          {
            name: "لوحة تحكم الطبيب",
            short_name: "طبيب",
            description: "متابعة المرضى",
            url: "/doctor-dashboard",
            icons: [{ "src": "/icon-192x192.png", "sizes": "192x192" }]
          }
        ]
      }
    })
  ].filter(Boolean),
  server: {
    host: "::",
    port: 8080
  },
  build: {
    sourcemap: true,
    target: "esnext"
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));

