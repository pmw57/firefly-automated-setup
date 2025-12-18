import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// Generate a version string based on the current date and time (YYYY.MM.DD.HHMMSS)
const getVersion = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}.${month}.${day}.${hours}${minutes}${seconds}`;
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['expansion_sprites.png', 'logo.svg'],
      manifest: {
        name: 'Firefly Automated Setup Guide',
        short_name: 'Firefly Setup',
        description: 'A dynamic, step-by-step setup guide for Firefly: The Game board game.',
        theme_color: '#7f1d1d',
        icons: [
          {
            src: 'logo.svg',
            sizes: '192x192 512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png}'],
        // Don't add revision query param to assets with hash in filename
        dontCacheBustURLsMatching: /\.[a-f0-9]{8}\./,
        // Prioritize fetching the latest index.html to avoid stale cache issues.
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.mode === 'navigate',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'pages',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 Days
              },
            },
          },
        ],
      }
    })
  ],
  define: {
    __APP_VERSION__: JSON.stringify(getVersion()),
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup.ts',
  },
});