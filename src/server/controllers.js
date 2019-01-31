const fs = require("fs")
const pipe = require("lodash/fp/pipe")
const some = require("lodash/some")
const promisify = require("util").promisify
const readdir = promisify(fs.readdir)
const readFile = promisify(fs.readFile)

const blacklist = [".bin", ".cache", ".yarn-integrity"]

const filterThroughBlacklist = files =>
  files.filter(f => !blacklist.includes(f))
const checkFilesForFile = files => fileName =>
  some(files, f => f.name === fileName)
const getDirectories = files =>
  files.filter(f => f.isDirectory() && f.name !== "node_modules")
const checkPackage = files => {
  const checkFilesFor = checkFilesForFile(files)
  return {
    hasReadme: checkFilesFor("README.md"),
    hasPackageInfo: checkFilesFor("package.json")
  }
}

const getDirectoryContent = async directory => {
  const files = await readdir(directory, { withFileTypes: true })
  const { hasReadme, hasPackageInfo } = checkPackage(files)
  const readmeContent =
    hasReadme && (await readFile(`${directory}/README.md`, "utf8"))

  const packageInfo =
    hasPackageInfo && (await readFile(`${directory}/package.json`, "utf8"))

  return {
    files,
    readmeContent,
    packageInfo
  }
}

exports.getPackageInfo = path => async (req, res) => {
  const packageInfo = await readFile(path, "utf8")
  res.send({ packageInfo })
}

exports.getFiles = (path, config) => async (req, res) => {
  const files = await readdir(path)
  const filteredFiles = filterThroughBlacklist(files)
  res.send({ files: filteredFiles, config })
}

exports.getPackage = path => async (req, res) => {
  const name = req.params.name
  const dir = `${path}/${name}`

  const getPackagesFromChildren = parentDir => children => {
    const readmes = children.map(async child => {
      const childDir = `${parentDir}/${child.name}`
      const { readmeContent, packageInfo } = await getDirectoryContent(childDir)
      return readmeContent || packageInfo
        ? {
            name: child.name,
            path: `${childDir}/README.md`,
            content: readmeContent,
            info: packageInfo
          }
        : {}
    })

    return Promise.all(readmes)
  }

  try {
    const { files, readmeContent, packageInfo } = await getDirectoryContent(dir)
    const children = await pipe(
      getDirectories,
      getPackagesFromChildren(dir)
    )(files)

    const pkg = {
      path: dir,
      content: readmeContent,
      info: packageInfo,
      children: children
    }

    res.send({ pkg })
  } catch (err) {
    console.log("Unable to scan directory: " + err)
    res.send({ pkg: "No Readme Found" })
  }
}
