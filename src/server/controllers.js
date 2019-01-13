const fs = require("fs")
const pipe = require("lodash/fp/pipe")
const promisify = require("util").promisify
const readdir = promisify(fs.readdir)
const readFile = promisify(fs.readFile)

exports.getFiles = (path, config) => async (req, res) => {
  const files = await readdir(path)
  res.send({ files, config })
}

exports.getReadme = path => async (req, res) => {
  const name = req.params.name
  const dir = `${path}/${name}`

  const findReadme = files => files.find(f => f.name === "README.md")

  const getDirectories = files =>
    files.filter(f => f.isDirectory() && f.name !== "node_modules")

  const getReadmeFromChildren = parentDir => children => {
    const readmes = children.map(async child => {
      const childDir = `${parentDir}/${child.name}`
      const files = await readdir(childDir, { withFileTypes: true })
      const readme = findReadme(files)
      const readmeContent = readme
        ? await readFile(`${childDir}/${readme.name}`, "utf8")
        : null

      return readme
        ? {
            readme: {
              name: child.name,
              path: `${childDir}/${readme.name}`,
              content: readmeContent
            }
          }
        : {}
    })

    return Promise.all(readmes)
  }

  const files = await readdir(dir, { withFileTypes: true })

  try {
    const readme = findReadme(files)
    const readmeContents = readme
      ? await readFile(`${dir}/${readme.name}`, "utf8")
      : null

    const children = await pipe(
      getDirectories,
      getReadmeFromChildren(dir)
    )(files)

    const obj = {
      root: {
        readme: {
          path: dir,
          content: readmeContents
        },
        children: children
      }
    }

    res.send({ readme: obj })
  } catch (err) {
    console.log("Unable to scan directory: " + err)
    res.send({ readme: "No Readme Found" })
  }
}
