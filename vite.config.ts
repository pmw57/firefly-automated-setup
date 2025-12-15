
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// Generate a version string based on the current date (YYYY.MM.DD)
const getVersion = () => {
  const date = new Date();
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
};

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  define: {
    '__APP_VERSION__': JSON.stringify(getVersion()),
  },
  plugins: [
    react(),
    VitePWA({ 
      registerType: 'autoUpdate',
      includeAssets: ['logo.svg', 'expansion_sprites.png'],
      manifest: {
        name: 'Firefly: The Game - Automated Setup',
        short_name: 'Firefly Setup',
        description: 'Automated setup wizard for Firefly: The Game',
        theme_color: '#7f1d1d',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: 'logo.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
        // Define runtime caching for external images (Sprite Sheet)
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/cf\.geekdo-images\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'firefly-images',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    }),
    // Custom plugin to clean up index.html for production builds
    command === 'build' && {
      name: 'html-transform',
      transformIndexHtml(html) {
        return html
          // Remove Tailwind CDN and Config (handled by build process in production)
          .replace(/<!-- Tailwind CDN \(Restored for Preview\) -->[\s\S]*?<script src="https:\/\/cdn\.tailwindcss\.com"><\/script>/, '')
          .replace(/<script>\s*tailwind\.config\s*=\s*\{[\s\S]*?\}\s*<\/script>/, '')
          // Remove Import Map (handled by Vite bundle in production)
          .replace(/<!-- AI Studio Import Map \(Restored for Preview\) -->[\s\S]*?<script type="importmap">[\s\S]*?<\/script>/, '')
          // Remove manual CSS link (handled by Vite bundle in production)
          .replace(/<link rel="stylesheet" href="\/index.css">/, '');
      }
    }
  ],
  // Use empty string to ensure assets use relative paths.
  // This allows the app to work on both AI Studio (root) and GitHub Pages (subdirectory).
  base: '',
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup.ts',
  }
}))
