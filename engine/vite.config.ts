import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 8233,
    watch: {
      usePolling: true
    },
    proxy: {
      '/api/': {
        target: 'http://127.0.0.1:8666',
        changeOrigin: true,
      }
    }
  }
})
