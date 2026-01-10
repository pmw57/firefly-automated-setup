

import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react-swc'
import { VitePWA } from 'vite-plugin-pwa'

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
const tailwindCdnFallbackPlugin = () => ({
  name: 'vite-plugin-tailwind-cdn-fallback',
  transformIndexHtml(html: string) {
    const regex = /<!--\s*TAILWIND_CDN_START\s*-->[\s\S]*?<!--\s*TAILWIND_CDN_END\s*-->/g;
    return html.replace(regex, '');
  }
});


export default defineConfig(({ mode }) => ({
  base: '/firefly-automated-setup/',
  plugins: [
    react(),
    // Plugins below are not needed for tests and can slow down setup.
    mode !== 'test' && tailwindCdnFallbackPlugin(),
    mode !== 'test' && VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'assets/images/game/expansion_sprites.png', 
        'assets/images/branding/logo.svg', 
        'assets/images/branding/qrcode.png',
        'assets/sounds/rocker-switch.mp3',
        'robots.txt', 
        'sitemap.xml', 
        'google45bc800396599bee.html',
        'assets/images/textures/starfield-noise-texture.svg',
        'assets/images/textures/parchment-body-texture.svg',
        'assets/images/textures/parchment-dossier-texture.svg',
        'assets/images/textures/metal-noise-texture.svg',
        'assets/images/game/firefly-cover.png'
      ],
      manifest: {
        name: 'Firefly Automated Setup Guide',
        short_name: 'Firefly Setup',
        description: 'A dynamic, step-by-step setup guide for Firefly: The Game board game.',
        theme_color: '#7f1d1d',
        background_color: '#f5f0e1',
        display: 'standalone',
        scope: '/firefly-automated-setup/',
        start_url: '/firefly-automated-setup/',
        icons: [
          {
            src: 'assets/images/branding/logo.svg',
            sizes: '192x192 512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,mp3}'],
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
  ].filter(Boolean),
  define: {
    __APP_VERSION__: JSON.stringify(getVersion()),
  },
  test: {
    globals: true,
    environment: 'jsdom',
    // FIX: Suppress JSDOM's localStorage warning by providing a mock URL.
    // This resolves the "localstorage-file was provided without a valid path"
    // warning that can appear when running tests in a Node.js environment.
    environmentOptions: {
      jsdom: {
        url: 'http://localhost/',
      },
    },
    setupFiles: './tests/setup.ts',
    isolate: true,
    alias: {
      'virtual:pwa-register': './tests/pwa-register.mock.ts'
    }
  },
}));