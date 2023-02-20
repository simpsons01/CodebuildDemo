const path = require("path")
const { exec } = require("child_process")
const { checkNodeModulesExistAndNotEmpty, createStdout }  = require("../utils")

const checkPackageJsonModified = () => {
  return new Promise((resolve, reject) => {
    const start = process.env.CODEBUILD_WEBHOOK_PREV_COMMIT
    const end = process.env.CODEBUILD_RESOLVED_SOURCE_VERSION
    exec(`git log ${start}..${end} --oneline --pretty='format:' --name-only`, (error, stdout, stderr) => {
      if(error) return reject(error)
      if(stderr) return reject(stderr)
      const isPackageJsonModified = stdout.split("\n").some(str => str === "package.json")
      resolve(isPackageJsonModified)
    })
  })
}

const run = async () => {
  let shouldReinstallNodeModules = false
  try {
    const nodeModulesPath = path.join(__dirname, "../../node_modules")
    const isNodeModuleExist = await checkNodeModulesExistAndNotEmpty(nodeModulesPath)
    if(isNodeModuleExist) {
      const isPackageJsonModified = await checkPackageJsonModified()
      if(isPackageJsonModified) {
        shouldReinstallNodeModules = true
      }
    }else {
      shouldReinstallNodeModules = true
    }
  }catch(error) {
    shouldReinstallNodeModules = true
  }
  createStdout(shouldReinstallNodeModules)
}

run()
