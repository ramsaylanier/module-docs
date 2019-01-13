const express = require("express")
const webpack = require("webpack")
const config = require("../webpack.config")
const devMiddleware = require("webpack-dev-middleware")
const compiler = webpack(config)
const bodyParser = require("body-parser")
const FileController = require("./controllers")

const PORT = 4444

module.exports = (modulePath, config) => {
  const app = express()

  app.use(bodyParser.json())
  app.use(
    devMiddleware(compiler, {
      open: true,
      stats: "errors-only"
    })
  )

  app.post("/modules", FileController.getFiles(modulePath, config))

  app.post("/module/:name", FileController.getReadme(modulePath))

  app.get("*", function response(req, res) {
    res.sendFile("./client/template.html", { root: __dirname })
  })

  app.listen(PORT, () => {
    console.log(`Module Docs is running at http://localhost:${PORT}`)
  })
}
