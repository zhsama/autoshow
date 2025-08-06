import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // AutoShow项目路径映射
      '@': path.resolve(__dirname, '../../apps/web/src'),
      '@/components': path.resolve(__dirname, '../../apps/web/src/components'),
      '@/lib': path.resolve(__dirname, '../../apps/web/src/lib'),
      '@/hooks': path.resolve(__dirname, '../../apps/web/src/hooks'),
      '@/stores': path.resolve(__dirname, '../../apps/web/src/stores'),
      'src': path.resolve(__dirname, './src'),
      
      // Next.js API模拟
      'next/image': path.resolve(__dirname, './src/mocks/next-image'),
      'next/link': path.resolve(__dirname, './src/mocks/next-link'),
      'next/navigation': path.resolve(__dirname, './src/mocks/next-navigation'),
      'next/dynamic': path.resolve(__dirname, './src/mocks/next-dynamic'),
      'next/router': path.resolve(__dirname, './src/mocks/next-router'),
    }
  },
  define: {
    // 环境变量模拟
    'process.env.NODE_ENV': JSON.stringify('development'),
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'jotai',
      'lucide-react',
      '@radix-ui/react-scroll-area',
      '@radix-ui/react-slot'
    ]
  },
  server: {
    port: 6006,
    host: true,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html')
      }
    }
  }
})