const fs = require("fs")
const pipe = require("lodash/fp/pipe")
const some = require("lodash/some")
const promisify = require("util").promisify
const readdir = promisify(fs.readdir)
const readFile = promisify(fs.readFile)

exports.getFiles = (path, config) => async (req, res) => {
  const files = await readdir(path)
  res.send({ files, config })
}

exports.getPackage = path => async (req, res) => {
  const name = req.params.name
  const dir = `${path}/${name}`

  const checkForReadme = files => some(files, file => file.name === "README.md")
  const checkForPackageInfo = files =>
    some(files, file => file.name === "package.json")

  const getDirectories = files =>
    files.filter(f => f.isDirectory() && f.name !== "node_modules")

  const getReadmeFromChildren = parentDir => children => {
    const readmes = children.map(async child => {
      const childDir = `${parentDir}/${child.name}`
      const files = await readdir(childDir, { withFileTypes: true })
      const hasReadme = checkForReadme(files)
      const hasPackageInfo = checkForPackageInfo(files)
      const readmeContent = hasReadme
        ? await readFile(`${childDir}/README.md`, "utf8")
        : null

      const packageInfo = hasPackageInfo
        ? await readFile(`${childDir}/package.json`, "utf8")
        : null

      return hasReadme
        ? {
            name: child.name,
            path: `${childDir}/README.md`,
            content: readmeContent,
            info: packageInfo
          }
        : null
    })

    return Promise.all(readmes)
  }

  const files = await readdir(dir, { withFileTypes: true })

  try {
    const hasReadme = checkForReadme(files)
    const hasPackageInfo = checkForPackageInfo(files)

    const readmeContents = hasReadme
      ? await readFile(`${dir}/README.md`, "utf8")
      : null

    const packageInfo = hasPackageInfo
      ? await readFile(`${dir}/package.json`, "utf8")
      : null

    const children = await pipe(
      getDirectories,
      getReadmeFromChildren(dir)
    )(files)

    const pkg = {
      path: dir,
      content: readmeContents,
      info: packageInfo,
      children: children
    }

    res.send({ pkg })
  } catch (err) {
    console.log("Unable to scan directory: " + err)
    res.send({ pkg: "No Readme Found" })
  }
}
