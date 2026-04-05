import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/gemini": {
        target: "https://generativelanguage.googleapis.com",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace("/gemini", ""),
      },
    },
  },
  optimizeDeps: {
    include: ['@mediapipe/pose', '@mediapipe/camera_utils']
  },
  define: {
    global: 'window',
  },
})
