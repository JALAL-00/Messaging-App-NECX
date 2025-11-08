import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // --- VITEST CONFIGURATION ---
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js', // This will be our setup file
  },
})