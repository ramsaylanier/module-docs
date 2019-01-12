const { resolve } = require("path")

module.exports = {
  root: resolve(__dirname, "./src/client"),
  outputPath: resolve(__dirname, "./", "build"),
  entryPath: resolve(__dirname, "./lib", "client/index.js"),
  templatePath: resolve(__dirname, "./lib", "client/template.html")
}
