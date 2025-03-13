import { defineConfig, loadEnv, ServerOptions } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  
  const serverConfig: ServerOptions = {
    host: env.VITE_WEB_HOST || 'localhost',
    port: parseInt(env.VITE_WEB_PORT || '3000'),
    strictPort: true, // Не змінювати порт, якщо він зайнятий
    proxy: {
      '/api': {
        target: `${env.VITE_API_PROTOCOL || 'https'}://${env.VITE_API_HOST || 'localhost'}:${env.VITE_API_PORT || '4096'}`,
        changeOrigin: true,
        secure: false, // Дозволяємо самопідписані сертифікати
        ws: true, // Підтримка WebSocket
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      }
    }
  };

  if (env.VITE_WEB_PROTOCOL === 'https') {
    serverConfig.https = {
      key: fs.readFileSync(path.resolve(__dirname, 'certs/key.pem')),
      cert: fs.readFileSync(path.resolve(__dirname, 'certs/cert.pem')),
    };
  }
  
  return {
    plugins: [react()],
    server: serverConfig,
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  }
})

