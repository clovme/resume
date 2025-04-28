import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { resolve } from 'path'
import autoprefixer from 'autoprefixer'

export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      resolvers: [ElementPlusResolver()]
    }),
  ],
  css: {
    postcss: {
      plugins: [
        autoprefixer({
          overrideBrowserslist: ['last 2 versions', '> 1%', 'ie 11']
        })
      ]
    }
  },
  build: {
    outDir: '../api/public',
    emptyOutDir: true,
    sourcemap: false, // 关闭 sourcemap
    minify: 'terser', // 使用 terser 进行代码压缩
    terserOptions: {
      compress: {
        drop_console: true,    // 去掉 console.log 等调试代码
        drop_debugger: true,   // 去掉 debugger 语句
        pure_funcs: ['console.log']  // 去掉特定函数调用
      },
      format: {
        comments: false, // 移除注释
      },
      mangle: {
        toplevel: true, // 混淆顶级作用域变量
      },
    },
    chunkSizeWarningLimit: 500, // 提示超大 chunk 文件（可选）
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';   // 抽取第三方依赖到 vendor
          }
        },
      },
    },
    target: 'esnext',   // 目标环境，选择最新的标准
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  optimizeDeps: {
    include: ['vue-cropper']
  }
})
