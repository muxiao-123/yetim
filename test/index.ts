import path from 'node:path'
import { fileURLToPath } from 'node:url'

// 参数,文件路径 => 当前目录
export function getDirName(url: string) {
  const __fileName = fileURLToPath(new URL('./', url))
  const __dirname = path.resolve(__fileName)
  return __dirname
}
// json，模板
export const getTemplate = (name: string) => {
  return {
    name: `@yetim/${name}`,
    version: '0.0.1',
    description: '',
    type: 'module',
    main: 'index.js',
    scripts: {
      test: 'echo "Error: no test specified" && exit 1',
    },
    keywords: [],
    author: 'muxiao-123',
    license: 'MIT',
    packageManager: 'pnpm@10.28.1',
  }
}
// 目录格式化
export const formatDir = (dir: string | symbol) => {
  return String(dir).trim().replace(/\/+$/g, '')
}
export default {}
