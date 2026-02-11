### 报错提示

- 没有配置tsconfigdir
- 如果设置正确了，查看是否启动了eslint缓存和并发检验
- 有则取消，再缓存
- 不然会被eslint误导导致检验失败

### 打包问题

- 原样输出需要设置 target: 'exnext',以及外部依赖不处理 其他值不一定生效
- export default 会被转成var定义方法形式
