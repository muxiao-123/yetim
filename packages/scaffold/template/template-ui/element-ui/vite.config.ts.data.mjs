// 返回插件信息
export default function getData({ oldData }) {
  const AutoImport = {
    name: 'AutoImport',
    importer: "import AutoImport from 'unplugin-auto-import/vite'",
    initializer: 'AutoImport({resolvers: [ElementPlusResolver()]})',
  }
  const Components = {
    name: 'Components',
    importer: "import Components from 'unplugin-vue-components/vite'",
    initializer: 'Components({resolvers: [ElementPlusResolver()]})',
  }
  const ElementPlusResolver = {
    name: 'ElementPlusResolver',
    importer: "import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'",
  }

  return {
    ...oldData,
    plugins: [AutoImport, Components, ElementPlusResolver],
  }
}
