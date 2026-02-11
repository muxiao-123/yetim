// 返回插件信息
export default function getData({ oldData }) {
  const AutoImport = {
    name: 'AutoImport',
    importer: "import AutoImport from 'unplugin-auto-import/vite'",
    initializer: 'AutoImport({resolvers: [VantResolver()]})',
  }
  const Components = {
    name: 'Components',
    importer: "import Components from 'unplugin-vue-components/vite'",
    initializer: 'Components({resolvers: [VantResolver()]})',
  }
  const VantResolver = {
    name: 'VantResolver',
    importer: "import { VantResolver } from '@vant/auto-import-resolver'",
  }

  return {
    ...oldData,
    plugins: [AutoImport, Components, VantResolver],
  }
}
