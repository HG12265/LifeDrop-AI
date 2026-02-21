import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      // --- WORKBOX CONFIG (Vercel Build Fix) ---
      workbox: {
        // 5MB varaikkum files-ah cache panna allow panroam (Large bundle fix)
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, 
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
      },
      manifest: {
        name: 'LifeDrop: AI Blood Donation',
        short_name: 'LifeDrop',
        description: 'Blockchain secured AI-powered blood donation platform',
        theme_color: '#dc2626',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
  // --- BUILD OPTIMIZATIONS ---
  build: {
    minify: 'esbuild', 
    sourcemap: false,
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
})