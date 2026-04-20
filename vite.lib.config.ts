import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'
import { resolve } from 'path'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: {
        foundations: resolve(__dirname, 'src/foundations/index.ts'),
        ecosystem: resolve(__dirname, 'src/ecosystem/index.ts'),
        components: resolve(__dirname, 'src/components/index.ts'),
        native: resolve(__dirname, 'src/native.ts'),
      },
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: ['react', 'react/jsx-runtime', 'react-dom', 'react-native', 'react-native-web'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
})
