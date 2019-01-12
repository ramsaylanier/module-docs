const program = require("commander")
const makeServer = require("./server")
const path = require("path")

const getConfig = () => {
  const configPath = path.join(process.cwd(), "./module-docs.config.js")
  const config = require(configPath)
  return config
}

program.command("start").action(() => {
  const modulePath = path.join(process.cwd(), "./node_modules")
  const config = getConfig()
  makeServer(modulePath, config)
})

program.parse(process.argv)
