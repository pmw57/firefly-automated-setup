import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { Plugin } from 'vite';

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

/**
 * A custom Vite plugin to remove the Tailwind CDN fallback script during dev/build.
 * This allows index.html to be statically previewed, while Vite handles Tailwind processing.
 */
const tailwindCdnFallbackPlugin = (): Plugin => ({
  name: 'vite-plugin-tailwind-cdn-fallback',
  transformIndexHtml(html) {
    // This hook runs for both 'serve' and 'build' commands.
    // We remove the block identified by our special comments.
    const regex = /<!--\s*TAILWIND_CDN_START\s*-->[\s\S]*?<!--\s*TAILWIND_CDN_END\s*-->/g;
    return html.replace(regex, '');
  }
});

/**
 * A custom Vite plugin to remove the importmap during Vitest runs.
 * The importmap is for browser-based previews, but it forces Vitest to fetch
 * dependencies from CDNs, which drastically slows down the 'transform' and 'import'
 * test phases. This plugin removes it only when `process.env.VITEST` is true.
 */
const removeImportmapForTestPlugin = (): Plugin => ({
  name: 'vite-plugin-remove-importmap-for-test',
  transformIndexHtml(html) {
    if (process.env.VITEST) {
      return html.replace(/<script type="importmap">[\s\S]*?<\/script>/, '');
    }
    return html;
  }
});


// https://vitejs.dev/config/
export default defineConfig({
  base: '/firefly-automated-setup/',
  plugins: [
    react(),
    removeImportmapForTestPlugin(), // Add the new plugin to fix test speed
    tailwindCdnFallbackPlugin(), // Add our custom plugin
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['expansion_sprites.png', 'logo.svg', 'robots.txt', 'sitemap.xml', 'google45bc800396599bee.html'],
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
    environment: 'node',
    setupFiles: './tests/setup.ts',
    deps: {
      optimizer: {
        ssr: {
          enabled: true,
        },
      },
    },
  },
});