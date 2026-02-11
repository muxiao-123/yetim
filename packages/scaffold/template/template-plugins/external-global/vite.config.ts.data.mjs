// 返回插件信息
export default function getData({ oldData }) {
  const externalGlobal = {
    name: 'externalGlobal',
    importer: "import externalGlobal from 'rollup-plugin-external-globals'",
    initializer: "externalGlobal({ vue: 'Vue' })",
  }
  const createHtmlPlugin = {
    name: 'createHtmlPlugin',
    importer: "import { createHtmlPlugin } from 'vite-plugin-html'",
    initializer: `createHtmlPlugin({
        // minify: true,
        inject: {
          data: {
            vuescript: '<script src="https://unpkg.com/vue@3.5.26/dist/vue.global.js"></script>',
          },
        },
      })`,
  }
  const curentPlugin = [externalGlobal, createHtmlPlugin]
  return {
    ...oldData,
    plugins: oldData.plugins?.flatMap?.((plugin) => plugin).concat(curentPlugin) ?? curentPlugin,
  }
}
