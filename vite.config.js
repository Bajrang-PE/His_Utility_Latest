import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'
import { dirname, resolve } from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/db',
  server: {
    // https: {
    //   key: fs.readFileSync(path.resolve(__dirname, 'certs/uat.dcservices.in.key')),
    //   cert: fs.readFileSync(path.resolve(__dirname, 'certs/uat.dcservices.in.crt')),
    // },
    // port: 3000,
    host: '0.0.0.0',
    open: true,
    proxy: {
      // '/usm': {
      //   target: 'http://10.226.17.6:8084',
      //   changeOrigin: true,
      //   secure: false,
      // },
      // '/hisutils': {
      //   target: 'http://10.226.17.6:8024',
      //   changeOrigin: true,
      //   secure: false,
      // }
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'), // Use @ to refer to /src directory
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          topbar: ['./src/modules/his-utils/components/sidebar/TopBar.jsx'],
          sidebar: ['./src/modules/his-utils/components/sidebar/Sidebar.jsx'],
          tabDash: ['./src/modules/his-utils/components/sidebar/TabDash.jsx'],
          parameters: ['./src/modules/his-utils/components/sidebar/Parameters.jsx'],
          WidgetDash: ['./src/modules/his-utils/components/sidebar/WidgetDash.jsx'],
          GraphDash: ['./src/modules/his-utils/components/sidebar/GraphDash.jsx'],
          TabularDash: ['./src/modules/his-utils/components/sidebar/TabularDash.jsx'],
          KpiDash: ['./src/modules/his-utils/components/sidebar/KpiDash.jsx'],
          MapDash: ['./src/modules/his-utils/components/sidebar/MapDash.jsx'],
          fontawesome: ['@fortawesome/free-solid-svg-icons'],
          proSidebar: ['react-pro-sidebar']

        },
      },
    },
  },
})
