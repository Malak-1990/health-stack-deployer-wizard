import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path'; // استيراد مكتبة path لاستخدامها في alias

export default defineConfig({
  root: 'public', // Set the project root to 'public'
  plugins: [
    react(),
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
        start_url: "/", // This will be relative to the new root, so it's effectively /public/
        lang: "ar",
        dir: "rtl",
        icons: [
          // Paths for icons in the manifest might need adjustment if they are not served correctly.
          // Assuming they are relative to the 'public' directory itself.
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
            url: "/patient-dashboard", // URLs should be relative to the domain root
            icons: [{ src: "/icon-192x192.png", sizes: "192x192" }]
          },
          {
            name: "لوحة تحكم الطبيب",
            short_name: "طبيب",
            description: "متابعة المرضى",
            url: "/doctor-dashboard", // URLs should be relative to the domain root
            icons: [{ src: "/icon-192x192.png", sizes: "192x192" }]
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      // __dirname is the directory of vite.config.ts (PROJECT_ROOT)
      // So, '@' should point to PROJECT_ROOT/src
      '@': path.resolve(__dirname, 'src'),
    },
  },
  build: {
    // The output directory for the build, relative to the project root (not the new 'public' root)
    // Vite's default 'dist' is usually fine. If 'root' is 'public', 'outDir' defaults to '../dist'.
    // We might need to explicitly set it if the default behavior is not what's expected.
    // For now, let's rely on the default outDir relative to the new root, which would be 'public/dist'.
    // Or, more commonly, it should be '../dist' from the perspective of the vite.config.js file if root is 'public'.
    outDir: '../dist', // Output to 'dist' at the project's actual root
  }
});
