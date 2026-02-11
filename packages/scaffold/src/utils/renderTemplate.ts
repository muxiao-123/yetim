import * as fs from 'node:fs'
import * as path from 'node:path'
import { pathToFileURL } from 'node:url'
import deepMerge from './deepMerge'
import sortDependencies from './sortDependencies'

import type { Callbacks } from '@/types'
/**
 * Renders a template folder/file to the file system,
 * by recursively copying all files under the `src` directory,
 * with the following exception:
 *   - `_filename` should be renamed to `.filename`
 *   - Fields in `package.json` should be recursively merged
 * @param {string} src source filename to copy
 * @param {string} dest destination filename of the copy operation
 */
function renderTemplate(src: string, dest: string, callbacks: Callbacks) {
  const stats = fs.statSync(src)

  if (stats.isDirectory()) {
    if (path.basename(src) === 'node_modules') {
      return
    }

    // 如果是目录，递归渲染所有
    fs.mkdirSync(dest, { recursive: true })
    for (const file of fs.readdirSync(src)) {
      renderTemplate(path.resolve(src, file), path.resolve(dest, file), callbacks)
    }
    return
  }

  const filename = path.basename(src)

  if (filename === 'package.json' && fs.existsSync(dest)) {
    // 合并代替覆盖
    const existing = JSON.parse(fs.readFileSync(dest, 'utf8'))
    const newPackage = JSON.parse(fs.readFileSync(src, 'utf8'))
    console.log(existing, newPackage)
    const pkg = sortDependencies(deepMerge(existing, newPackage))
    console.log(pkg)
    fs.writeFileSync(dest, `${JSON.stringify(pkg, null, 2)}\n`)
    return
  }

  if (filename.startsWith('_')) {
    // 重命名 `_file` to `.file`
    dest = path.resolve(path.dirname(dest), filename.replace(/^_/, '.'))
  }

  if (filename === '_gitignore' && fs.existsSync(dest)) {
    const existing = fs.readFileSync(dest, 'utf8')
    const newGitignore = fs.readFileSync(src, 'utf8')
    fs.writeFileSync(dest, `${existing}\n${newGitignore}`)
    return
  }

  if (filename.endsWith('.data.mjs')) {
    // 使用目标路径作为key,
    dest = dest.replace(/\.data\.mjs$/, '')

    // 增加一个回调函数在进程的时候
    callbacks.push(async (dataStore) => {
      const getData = (await import(pathToFileURL(src).toString())).default

      // 通过getData方法获取合并属性
      dataStore[dest] = await getData({
        oldData: dataStore[dest] || {},
      })
    })

    return // 跳过复制文件
  }

  fs.copyFileSync(src, dest)
}

export default renderTemplate
