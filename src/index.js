const program = require("commander")
const makeServer = require("./server/serve")
const path = require("path")

const getConfig = () => {
  const configPath = path.join(process.cwd(), "./module-docs.config.js")
  try {
    const config = require(configPath)
    if (!config) return null
    return config
  } catch (_) {
    return null
  }
}

program.command("start").action(() => {
  const modulePath = path.join(process.cwd(), "./node_modules")
  const config = getConfig()
  makeServer(modulePath, config)
})

program.parse(process.argv)
