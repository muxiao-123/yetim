import { runServer } from 'verdaccio'

async function startVerdaccio() {
  const server = await runServer('./verdaccio.config.yaml')
  server.listen(4183, () => {
    console.log('Verdaccio 已启动:', `http://localhost:4183`)
  })
}
startVerdaccio().catch(console.error)
