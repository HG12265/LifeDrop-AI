import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      
      // --- WORKBOX CONFIG (Termux Crash Fix) ---
      workbox: {
        // ✅ MUKKIYAM: 'development' mode use panna Workbox entha 
        // heavy optimization-um pannaathu, so build crash aagathu.
        mode: 'development', 
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, 
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        sourcemap: false,
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
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
        ]
      }
    })
  ],

  // --- BUILD SETTINGS (Termux Optimization) ---
  build: {
    minify: false, // Terser-ah full-ah off panroam
    cssMinify: false,
    sourcemap: false,
    chunkSizeWarningLimit: 3000,
    rollupOptions: {
      output: {
        // ✅ CODE SPLITTING: Periya 3MB file-ah chinna chunks-ah pirikkiroam
        // Ippo Termux-ku load romba kuraiyum
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString();
          }
        },
      },
    },
  },
})