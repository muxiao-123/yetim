import path from 'node:path'
import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: 'src/idnex.ts',
  // 跳过node_modules模块，默认项目中有
  skipNodeModulesBundle: true,
  target: 'esnext',
  // 保持源码目录映射, 无包模式-仅转义，无合并
  unbundle: true,
  minify: false,
  inlineOnly: false as const,
  fixedExtension: false,
  plugins: [],
  outputOptions: {
    dir: 'dist',
    // chunkFileNames: '[name]/[name].js',
    entryFileNames: (chunkInfo: { name: any; moduleIds: string[] }) => {
      let fileName = path.basename(chunkInfo.moduleIds[0])
      const extName = path.extname(chunkInfo.moduleIds[0])
      fileName = fileName.replace(extName, '')
      return `[name]/${fileName}.js`
    },
  },
  alias: {
    // '@': fileURLToPath(new URL('./src', import.meta.url)),
  },
  exports: true,
})
