import picocolors from 'picocolors'
import { Template, TemplateUI } from '@/types'

export const templateArr: Template[] = [
  {
    name: 'template-vue',
    display: 'Vue',
    color: picocolors.blue,
    templateUI: [
      {
        name: 'elementUI',
        display: 'ElementUI',
        color: picocolors.cyan,
      },
      {
        name: 'vant',
        display: 'Vant',
        color: picocolors.blue,
      },
      {
        name: 'tDesign',
        display: 'TDesign',
        color: picocolors.green,
      },
    ],
  },
  {
    name: 'template-electron',
    display: 'Electron',
    color: picocolors.yellow,
  },
]
export const templateUI: TemplateUI[] = [
  {
    name: '',
    display: 'NoUI',
    color: picocolors.cyan,
  },
  {
    name: 'element-ui',
    display: 'ElementUI',
    color: picocolors.blue,
  },
  {
    name: 'vant',
    display: 'Vant',
    color: picocolors.green,
  },
  {
    name: 't-design',
    display: 'TDesign',
    color: picocolors.yellow,
  },
]
export const templatePlugins: TemplateUI[] = [
  {
    name: '',
    display: 'No',
    color: picocolors.cyan,
  },
  {
    name: 'css',
    display: 'css',
    color: picocolors.blue,
  },
  // {
  //   name: 'external-global',
  //   display: 'external-global',
  //   color: picocolors.green,
  // },
  {
    name: 'visualizer',
    display: 'visualizer',
    color: picocolors.yellow,
  },
  {
    name: 'vite-compression',
    display: 'vite-compression',
    color: picocolors.cyan,
  },
]
