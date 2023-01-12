const path = require("path")
const { exec } = require("child_process")
const {  checkNodeModulesExist, deleteNodeModules, installNodeModules }  = require("../utils")

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
  try {
    const nodeModulesPath = path.join(__dirname, "../../node_modules")
    const isNodeModuleExist = await checkNodeModulesExist(nodeModulesPath)
    if(isNodeModuleExist) {
      const isPackageJsonModified = checkPackageJsonModified()
      if(isPackageJsonModified) {
        console.log("package.json has been modified, delete node_modules cache and install node_modules")
        console.log("delete node_modules......")
        await deleteNodeModules()
        console.log("install node_modules......")
        await installNodeModules()
      }else {
        console.log("use codebuild s3 cache node_modules")
      }
    }else {
      console.log("node modules does not exist, install node_modules......")
      await installNodeModules()
    }
    process.exit(0)
  }catch(error) {
    console.log(error)
    process.exit(1)
  }
}

run()

