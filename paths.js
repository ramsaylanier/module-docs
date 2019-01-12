const { resolve } = require("path")

module.exports = {
  root: resolve(__dirname, "./src/client"),
  outputPath: resolve(__dirname, "./", "build"),
  entryPath: resolve(__dirname, "./src", "client/index.js"),
  templatePath: resolve(__dirname, "./src", "client/template.html")
}
