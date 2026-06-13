import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [
      react(), 
      tailwindcss(),
      {
        name: 'pwa-sw-timestamp',
        closeBundle() {
          try {
            const swPath = path.resolve(process.cwd(), 'dist/sw.js');
            if (fs.existsSync(swPath)) {
              let content = fs.readFileSync(swPath, 'utf8');
              const buildId = Date.now().toString();
              // Replace CACHE_NAME with a dynamic name based on build timestamp
              content = content.replace(
                /const CACHE_NAME = "[^"]+";/,
                `const CACHE_NAME = "engage-pwa-${buildId}";`
              );
              // Append a build version comment at the end
              content += `\n// Build ID: ${buildId}\n`;
              fs.writeFileSync(swPath, content, 'utf8');
              console.log(`[PWA Plugin] Successfully updated sw.js with Build ID: ${buildId}`);
            } else {
              console.warn(`[PWA Plugin] sw.js not found at ${swPath}`);
            }
          } catch (error) {
            console.error('[PWA Plugin] Failed to append build timestamp to sw.js:', error);
          }
        }
      }
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
