import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import svgr from "vite-plugin-svgr";

// https://vite.dev/config/
//export default defineConfig({
//  plugins: [react(),
//    tailwindcss(),
//    svgr(),
//  ],
//})


export default defineConfig({
  plugins: [react(), tailwindcss(), svgr()],
  server: {
    proxy: {
      '/api': 'http://localhost:8081'
    }
  }
})

// vite.config.js
//
//export default defineConfig({
//  plugins: [react()],
//  server: {
//    host: true, // This is essential for Docker to access the server from outside the container
//    port: 5173, // Set a consistent port
//    strictPort: true,
//    watch: {
//      usePolling: true // Needed for hot reloading to work reliably in some Docker environments
//    }
//  },
//});



  



