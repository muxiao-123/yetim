// 返回插件信息
export default function getData({ oldData }) {
  const Visualizer = {
    name: 'Visualizer',
    importer: "import { visualizer } from 'rollup-plugin-visualizer'",
    initializer: 'visualizer()',
  }

  return {
    ...oldData,
    plugins: oldData.plugins?.flatMap?.((plugin) => plugin).concat([Visualizer]) ?? [Visualizer],
  }
}
