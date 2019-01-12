const express = require("express")
const fs = require("fs")
const webpack = require("webpack")
const config = require("../webpack.config")
const devMiddleware = require("webpack-dev-middleware")
const compiler = webpack(config)
const bodyParser = require("body-parser")

const PORT = 4444

const getFiles = (path, config, res) => {
  fs.readdir(path, function(err, files) {
    // handling error
    if (err) {
      return console.log("Unable to scan directory: " + err)
    }

    res.send({ files, config })
  })
}

const getReadme = (path, name, res) => {
  const dir = `${path}/${name}`
  fs.readdir(dir, function(err, files) {
    // handling error
    if (err) {
      console.log("Unable to scan directory: " + err)
      res.send({ readme: "No Readme Found" })
      return
    }

    const readme = files.find(f => f === "README.md")
    if (!readme) {
      res.send({ readme: "No Readme Found" })
      return
    }

    fs.readFile(`${dir}/${readme}`, "utf8", (err, data) => {
      if (err) throw err
      res.send({ readme: data })
    })
  })
}

module.exports = (modulePath, config) => {
  const app = express()

  app.use(bodyParser.json())
  app.use(devMiddleware(compiler))

  app.post("/modules", (req, res) => {
    getFiles(modulePath, config, res)
  })

  app.post("/module/:name", (req, res) => {
    getReadme(modulePath, req.params.name, res)
  })

  app.get("*", function response(req, res) {
    res.sendFile("./client/template.html", { root: __dirname })
  })

  app.listen(PORT, () => {
    console.log(`app listening on port ${PORT}`)
  })
}
