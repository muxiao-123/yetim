import path from 'node:path'
import { fileURLToPath } from 'node:url'
import fs from 'node:fs'
import { type DefaultTheme } from 'vitepress'

type ConfigType = 'Base' | 'Issue' | 'Project'
const BaseMap = {} as const
const IssueMap = {
  config: '配置相关',
  test: '测试',
} as const
const ProjectMap = {} as const

function getDirName(url: string) {
  const __fileName = fileURLToPath(new URL('./', url))
  const __dirname = path.resolve(__fileName)
  return __dirname
}
function getTargetConfigMap(type: ConfigType): { [key: string]: string } {
  if (type === 'Base') {
    return BaseMap
  }
  if (type === 'Issue') {
    return IssueMap
  }
  if (type === 'Project') {
    return ProjectMap
  }
  return Object.create({})
}
export function getSidebarItems(dir: string, type: ConfigType) {
  const __dirname = getDirName(import.meta.url)
  const targetDir = path.resolve(__dirname, `../../${dir}`)
  const sideItem: DefaultTheme.SidebarItem[] = []

  if (fs.existsSync(targetDir)) {
    let files = fs.readdirSync(targetDir)
    const index = files.findIndex((file) => file === 'index.md')
    if (index > -1) {
      files.splice(index, 1)
    }
    files = files.filter((file) => /\.md$/.test(file)).map((file) => file.replace(/\.md$/, ''))
    const currentTagetMap = getTargetConfigMap(type)
    for (const file of files) {
      sideItem.push({ text: currentTagetMap[file], link: file })
    }
  }
  return sideItem
}
