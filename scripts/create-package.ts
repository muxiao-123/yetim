#! /usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import mri from 'mri'
import { isCancel, text } from '@clack/prompts'
import picocolors from 'picocolors'
// import { getDirName, getTemplate, formatDir } from '@yetim/utils'
// import { getDirName, getTemplate, formatDir } from '../packages/utils/index.ts'
import { formatDir, getDirName, getTemplate } from '@/index'

const args = mri<{
  packageName?: string
}>(process.argv.slice(2))
let packageName = args._[0]
const __dirname = getDirName(import.meta.url)
const root = path.resolve(__dirname, '../../packages')
console.log(root)
const create = (targetDir: string) => {
  fs.mkdirSync(targetDir, { recursive: true })
  fs.writeFileSync(
    `${targetDir}/package.json`,
    `${JSON.stringify(getTemplate(path.basename(targetDir)), null, 2)}\n`,
  )
  console.log(picocolors.green(`成功创建package.json${targetDir}`))
}
async function run() {
  if (!packageName) {
    const projectName = await text({
      message: '请输入项目路径',
      placeholder: 'projectName',
      defaultValue: 'projectName',
    })
    if (!isCancel(projectName)) {
      packageName = formatDir(projectName)
      if (fs.existsSync(`${root}/${packageName}`)) {
        console.log(picocolors.red('包目录已经存在！，请检查输入目录'))
        return
      }
    }
    const targetDir = path.resolve(root, packageName)
    create(targetDir)
    return
  }
  packageName = formatDir(packageName)
  const targetDir = path.resolve(root, packageName)
  if (fs.existsSync(targetDir)) {
    console.log(picocolors.red('包目录已经存在！，请检查输入目录'))
    return
  }
  create(targetDir)
}

run().catch((error) => {
  console.log(picocolors.red(error))
})
