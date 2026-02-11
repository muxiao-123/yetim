### 设计思路

1.参考create-vite https://github.com/vitejs/packages/create-vite

## 流程步骤

-开始 --定义模板 --定义参数 --获取参数 --根据参数执行命令 --获取最终所有参数值 --获取本地包管理器 --拷贝文件夹 --生成并修改package.json属性 --可选择立即执行或者自行执行 -结束

配置的思路
根据后缀名，将数据获取方法存到回调中 复制文件不复制该类文件，只存数据
根据回调数据 依次执行回调函数，将对应数据写到配置文件中

## 引入插件

1.@clack/prompts 优雅简洁的命令提问工具
2.Cross-spawn 跨平台的node模块 创建/执行子进程
3.mri 轻量解析命令行传入参数 转js对象
4.picocolors 轻量级命令行输出颜色库 添加颜色和样式 增强命令行可读性
5.tsdown 新一代ts文件打包工具6. ejs 模板引擎，通过传入参数渲染文件内容 合并vite（eslint等）配置

husky commitentlint gitcz

cz-config配置文件必须是cjs不然无法识别

## 代码规范

husky + lint-staged + cz

## 所需插件

eslint prettier eslint-config-prettier eslint-plugin-prettier typescript-eslint
@commitlint/cli
@commitlint/config-conventional 配合提交钩子
cz-conventional-changelog log日志
cz-customizable 自定义提交样式
cz-customizable 提交插件 需要配合 commitizen
