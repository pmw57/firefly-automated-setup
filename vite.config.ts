import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [
    react(),
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
}))