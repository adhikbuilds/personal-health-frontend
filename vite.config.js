import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const fastapiHost = env.FASTAPI_HOST || 'localhost'
  const fastapiPort = env.FASTAPI_PORT || '8082'
  const httpTarget = `http://${fastapiHost}:${fastapiPort}`
  const wsTarget = `ws://${fastapiHost}:${fastapiPort}`

  return {
    plugins: [react()],
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: httpTarget,
          changeOrigin: true,
          rewrite: (pathname) => pathname.replace(/^\/api/, ''),
        },
        '/ws': {
          target: wsTarget,
          changeOrigin: true,
          ws: true,
          rewrite: (pathname) => pathname.replace(/^\/ws/, ''),
        },
      },
    },
    build: {
      outDir: 'dist',
    },
  }
})
