import { DefaultTheme, defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'yetim',
  description: '前端知识点合集',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '主页', link: '/' },
      { text: '基础', link: '/base' },
      { text: '项目', link: '/project' },
      { text: '问题', link: '/issue' },
    ],
    sidebar: {
      '/base/': { base: '/base/', items: sideBarBase() },
      '/issue/': { base: '/issue/', items: sideBarIssue() },
      '/project/': { base: '/project/', items: sideBarProject() },
    },
    outline: {
      label: '页面导航',
    },
    socialLinks: [{ icon: 'github', link: '' }],
  },
})
function sideBarBase(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: '基础',
      collapsed: false,
      items: [
        {
          text: '',
          link: '',
        },
      ],
    },
  ]
}
function sideBarIssue(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: '问题',
      collapsed: false,
      items: [
        {
          text: '',
          link: '',
        },
      ],
    },
  ]
}
function sideBarProject(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: '项目',
      collapsed: false,
      items: [
        {
          text: '',
          link: '',
        },
      ],
    },
  ]
}
