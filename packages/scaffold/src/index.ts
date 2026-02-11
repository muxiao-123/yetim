import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import mri from 'mri'
import * as prompts from '@clack/prompts'
import picocolors from 'picocolors'
import ejs from 'ejs'

import type { Callbacks } from '@/types'

import {
  copy,
  emptyDir,
  formatTargetDir,
  getInstallCommand,
  getRunCommand,
  isEmpty,
  isValidPackageName,
  pkgFromUserAgent,
  renameFiles,
  toValidPackageName,
} from '@/utils'
import renderTemplate from '@/utils/renderTemplate'
import { preOrderDirectoryTraverse } from '@/utils/directoryTraverse'
import { templateArr, templatePlugins, templateUI } from '@/constant'

const args = mri<{
  template?: string
  help?: boolean
  immediate?: boolean
  overwrite?: boolean
  interative?: boolean
}>(process.argv.slice(2), {
  boolean: ['hep', 'immediate', 'overwrite', 'interative'],
  alias: { h: 'help', i: 'immediate' },
})

const cwd = process.cwd()

// prettier-ignore
const helpMessage = `\
Usage: create-vite [OPTION]... [DIRECTORY]
`
const templateNames = templateArr.map((t) => t.name)

async function init() {
  const argTargetDir = args._[0] ? formatTargetDir(args._[0]) : undefined
  const argtemplate = args.template
  const arghelp = args.help
  const argImmediate = args.immediate
  const argOverwrite = args.overwrite
  const defaultTargetDir = 'mux-project'

  if (arghelp) {
    console.log(helpMessage)
    return
  }

  const interactive = args.interative ?? process.stdin.isTTY
  const pkgInfo = pkgFromUserAgent(process.env.npm_config_user_agent)
  const cancel = () => prompts.cancel('操作禁止')

  // 1. 得到项目名和目标目录
  let targetDir = argTargetDir
  if (!targetDir) {
    if (interactive) {
      const projectName = await prompts.text({
        message: '项目名:',
        defaultValue: defaultTargetDir,
        placeholder: defaultTargetDir,
        validate: (value: string | undefined) => {
          return !value || formatTargetDir(value).length > 0 ? undefined : '不合法的项目名'
        },
      })
      if (prompts.isCancel(projectName)) return cancel()
      targetDir = formatTargetDir(projectName)
    } else {
      targetDir = defaultTargetDir
    }
  }

  // 2. 操作目录如果存在并且不为空
  if (fs.existsSync(targetDir) && !isEmpty(targetDir)) {
    let overwrite: 'yes' | 'no' | 'ignore' | undefined = argOverwrite ? 'yes' : undefined
    if (!overwrite) {
      if (interactive) {
        const res = await prompts.select({
          message: `${
            targetDir === '.' ? '当前目录' : `目标目录 "${targetDir}"`
          } 不为空. 请选择如何处理:`,
          options: [
            {
              label: '中止操作',
              value: 'no',
            },
            {
              label: '移除所有存在文件，并继续',
              value: 'yes',
            },
            {
              label: '忽略所有文件并继续',
              value: 'ignore',
            },
          ],
        })
        if (prompts.isCancel(res)) return cancel()
        overwrite = res
      } else {
        overwrite = 'no'
      }
    }

    switch (overwrite) {
      case 'yes':
        emptyDir(targetDir)
        break
      case 'no':
        cancel()
        return
    }
  }

  // 3.得到包名
  let packageName = path.basename(path.resolve(targetDir))
  if (!isValidPackageName(packageName)) {
    if (interactive) {
      const packageNameResult = await prompts.text({
        message: 'Package name:',
        defaultValue: toValidPackageName(packageName),
        placeholder: toValidPackageName(packageName),
        validate(dir: string | undefined) {
          if (dir && !isValidPackageName(dir)) {
            return '不合法的 package.json 名'
          }
        },
      })
      if (prompts.isCancel(packageNameResult)) return cancel()
      packageName = packageNameResult
    } else {
      packageName = toValidPackageName(packageName)
    }
  }

  // 4. 选择一个模板（vue或者electron）
  let template = argtemplate
  let hasInvalidArgTemplate = false
  if (argtemplate && !templateNames.includes(argtemplate)) {
    template = undefined
    hasInvalidArgTemplate = true
  }
  if (!template) {
    if (interactive) {
      const framework = await prompts.select({
        message: hasInvalidArgTemplate
          ? `"${argtemplate}" 不是一个合法的模板. 请在下面选择一个: `
          : '选择一个模板:',
        options: templateArr.map((framework) => {
          const frameworkColor = framework.color
          return {
            label: frameworkColor(framework.display || framework.name),
            value: framework.name,
          }
        }),
      })
      if (prompts.isCancel(framework)) return cancel()

      template = framework
    } else {
      template = 'template-vue'
    }
  }

  const pkgManager = pkgInfo ? pkgInfo.name : 'npm'
  const root = path.join(cwd, targetDir)

  // 仅在构建模板时创建目录，不做自定义操作指令
  fs.mkdirSync(root, { recursive: true })
  prompts.log.step(`脚手架项目在 ${root}...`)

  const templateDir = path.resolve(fileURLToPath(import.meta.url), '../..', `template/${template}`)

  const callbacks = [] as Callbacks

  renderTemplate(templateDir, targetDir, callbacks)
  if (template === 'template-vue') {
    // UI选择
    const currentUI: string[] = []
    if (currentUI.length === 0) {
      const currentUITemplate = await prompts.select({
        message: '选择一个组件库:',
        options: templateUI.map((ui) => {
          const frameworkColor = ui.color
          return {
            label: frameworkColor(ui.display || ui.name),
            value: ui.name,
          }
        }),
        initialValue: '',
      })
      if (currentUITemplate) {
        currentUI.push(currentUITemplate as string)
      }
    }
    const templateRoot = fileURLToPath(new URL('../template', import.meta.url))
    const render = function render(templateName: string) {
      const templateDir = path.resolve(templateRoot, templateName)
      renderTemplate(templateDir, root, callbacks)
    }
    if (currentUI.length) {
      render(`template-ui/${currentUI[0]}`)
    }

    // 额外vite插件配置选择
    const currentTemplatePlugins: string[] = []
    if (currentTemplatePlugins.length === 0) {
      const cssPluginTemplate = await prompts.multiselect({
        message: '选择0个或者多个插件',
        options: templatePlugins.map((plugin) => {
          const frameworkColor = plugin.color
          return {
            label: frameworkColor(plugin.display || plugin.name),
            value: plugin.name,
          }
        }),
        required: false,
      })
      if (cssPluginTemplate) {
        currentTemplatePlugins.push(...(cssPluginTemplate as string[]))
      }
    }
    if (currentTemplatePlugins.length) {
      for (const key of currentTemplatePlugins) {
        render(`template-plugins/${key}`)
      }
    }
  }
  const dataStore: Record<string, { plugins: unknown[]; cssPostCssPlugins: unknown[] }> = {}
  // 进程回调
  for (const cb of callbacks) {
    await cb(dataStore)
  }
  console.log(Object.keys(dataStore))
  if (Object.keys(dataStore)) {
    // EJS模板渲染
    preOrderDirectoryTraverse(
      root,

      () => {},
      (filepath: string) => {
        if (filepath.endsWith('.ejs')) {
          const template = fs.readFileSync(filepath, 'utf-8')
          const dest = filepath.replace(/\.ejs$/, '')
          const destParam = dataStore[dest]
          if (destParam !== undefined && !destParam?.plugins) {
            destParam.plugins = []
          }
          if (destParam !== undefined && !destParam?.cssPostCssPlugins) {
            destParam.cssPostCssPlugins = []
          }
          // const content = ejs.render(template, dataStore[dest])
          const content = ejs.render(template, destParam ?? { plugins: [], cssPostCssPlugins: [] })

          fs.writeFileSync(dest, content)
          fs.unlinkSync(filepath)
        }
      },
    )
  }
  const pkg = JSON.parse(fs.readFileSync(path.join(targetDir, `package.json`), 'utf-8'))

  pkg.name = packageName

  const write = (file: string, content?: string) => {
    const targetPath = path.join(root, renameFiles[file] ?? file)
    if (content) {
      fs.writeFileSync(targetPath, content)
    } else {
      copy(path.join(templateDir, file), targetPath)
    }
  }
  write('package.json', `${JSON.stringify(pkg, null, 2)}\n`)

  if (argImmediate) {
    console.log('开始安装请等候 ....')
    // install(root, pkgManager)
    // start(root, pkgManager)
  } else {
    let doneMessage = ''
    const cdProjectName = path.relative(cwd, root)
    doneMessage += `Done. Now run:\n`
    if (root !== cwd) {
      doneMessage += `\n  cd ${cdProjectName.includes(' ') ? `"${cdProjectName}"` : cdProjectName}`
    }
    doneMessage += `\n  ${getInstallCommand(pkgManager).join(' ')}`
    doneMessage += `\n  ${getRunCommand(pkgManager, 'dev').join(' ')}`
    prompts.outro(doneMessage)
  }
}

init().catch((e) => {
  console.log(picocolors.bgBlack(e))
  process.exit(1)
})
