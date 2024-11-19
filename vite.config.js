import { fileURLToPath, URL } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tailwindcss from 'tailwindcss';
export default defineConfig({
    plugins: [react()],
    server: {
        port: 3000,
        host: true
    },
    css: {
        postcss: {
            plugins: [tailwindcss()]
        }
    },
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    build: {
        chunkSizeWarningLimit: 3000
    }
});
