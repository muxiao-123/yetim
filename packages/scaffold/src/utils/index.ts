import fs from 'node:fs'
import path from 'node:path'

export function formatTargetDir(targetDir: string) {
  return targetDir.trim().replace(/\/+$/g, '')
}
export function isValidPackageName(projectName: string) {
  return /^(?:@[a-z\d\-*~][a-z\d\-*._~]*\/)?[a-z\d\-~][a-z\d\-._~]*$/.test(projectName)
}
export function toValidPackageName(projectName: string) {
  return projectName
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/^[._]/, '')
    .replace(/[^a-z\d\-~]+/g, '-')
}
export function copy(src: string, target: string) {
  const stat = fs.statSync(src)
  if (stat.isDirectory()) {
    copyDir(src, target)
  } else {
    fs.copyFileSync(src, target)
  }
}

export function copyDir(srcDir: string, targetDir: string) {
  fs.mkdirSync(targetDir, { recursive: true })
  for (const file of fs.readdirSync(srcDir)) {
    const srcFile = path.resolve(srcDir, file)
    const targetFile = path.resolve(targetDir, file)
    copy(srcFile, targetFile)
  }
}

export function emptyDir(dir: string) {
  if (!fs.existsSync(dir)) {
    return
  }
  for (const file of fs.readdirSync(dir)) {
    if (file === '.git') {
      continue
    }
    fs.rmSync(path.resolve(dir, file), { recursive: true, force: true })
  }
}
interface PkgInfo {
  name: string
  version: string
}

export function pkgFromUserAgent(userAgent: string | undefined): PkgInfo | undefined {
  if (!userAgent) return undefined
  const pkgSpec = userAgent.split(' ')[0]
  const pkgSpecArr = pkgSpec.split('/')
  return {
    name: pkgSpecArr[0],
    version: pkgSpecArr[1],
  }
}
// export function getRoot() {
//   return ''
// }
export function isEmpty(path: string) {
  const files = fs.readdirSync(path)
  return files.length === 0 || (files.length === 1 && files[0] === '.git')
}
export const renameFiles: Record<string, string | undefined> = {
  _gitignore: '.gitignore',
}
export function getInstallCommand(agent = 'pnpm') {
  if (agent === 'yarn') {
    return [agent]
  }
  return [agent, 'install']
}
export function getRunCommand(agent: string, script: string) {
  switch (agent) {
    case 'yarn':
    case 'pnpm':
    case 'bun':
      return [agent, script]
    case 'deno':
      return [agent, 'task', script]
    default:
      return [agent, 'run', script]
  }
}
