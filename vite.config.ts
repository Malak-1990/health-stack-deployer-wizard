import path from 'path';
import { defineConfig, type UserConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  root: '.', // الجذر هو نفس المجلد الحالي
  publicDir: 'public', // مجلد الملفات الثابتة
  plugins: [
    react({
      devOptions: { fastRefresh: true }
    }),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'], // حسب الحاجة
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
          { src: "/icon-152x152.png", sizes: "152x152", type: "image/png", purpose: "maskable any" },
          { src: "/icon-180x180.png", sizes: "180x180", type: "image/png", purpose: "maskable any" },
          { src: "/icon-192x192.png", sizes: "192x192", type: "image/png", purpose: "maskable any" },
          { src: "/icon-512x512.png", sizes: "512x512", type: "image/png", purpose: "maskable any" }
        ],
        shortcuts: [
          {
            name: "لوحة تحكم المريض",
            short_name: "مريض",
            description: "مراقبة معدل ضربات القلب",
            url: "/patient-dashboard",
            icons: [{ src: "/icon-192x192.png", sizes: "192x192" }]
          },
          {
            name: "لوحة تحكم الطبيب",
            short_name: "طبيب",
            description: "متابعة المرضى",
            url: "/doctor-dashboard",
            icons: [{ src: "/icon-192x192.png", sizes: "192x192" }]
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  build: {
    sourcemap: true,
    target: 'esnext',
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'public/index.html'),
      }
    }
  }
} satisfies UserConfig);
