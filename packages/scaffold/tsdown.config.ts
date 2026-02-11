import { fileURLToPath } from 'url'
import { defineConfig } from 'tsdown'

export default defineConfig(() => {
  return {
    entry: 'src/index.ts',
    target: 'node20',
    minify: false,
    inlineOnly: false as const,
    fixedExtension: false,
    plugins: [],
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  }
})
