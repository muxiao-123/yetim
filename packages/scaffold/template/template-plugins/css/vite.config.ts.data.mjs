// 返回插件信息
export default function getData({ oldData }) {
  const autoPrefix = {
    name: 'autoPrefix',
    importer: "import autoPrefix from 'autoprefixer'",
    initializer: 'autoPrefix()',
  }
  const postcssPxToRem = {
    name: 'postcssPxToRem',
    importer: "import postcssPxToRem from 'postcss-pxtorem'",
    initializer: `postcssPxToRem({
              rootValue: 16,
              unitPrecision: 5,
              propList: ['font', 'font-size', 'line-height', 'letter-spacing'],
              selectorBlackList: [],
              replace: true,
              mediaQuery: false,
              minPixelValue: 0,
              exclude: /node_modules/i,
            })`,
  }
  const currentPlugin = [autoPrefix, postcssPxToRem]
  return {
    ...oldData,
    cssPostCssPlugins:
      oldData.cssPostCssPlugins?.flatMap?.((plugin) => plugin).concat(currentPlugin) ??
      currentPlugin,
  }
}
