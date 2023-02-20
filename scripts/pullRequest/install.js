const path = require("path")
const { exec } = require("child_process")
const { checkNodeModulesExistAndNotEmpty, request, createStdout } = require("../utils")

const checkPackageJsonModified = () => {
  return new Promise((resolve, reject) => {
    const prNumber = process.env.CODEBUILD_WEBHOOK_TRIGGER.split("/")[1]
    const headBranch = process.env.CODEBUILD_WEBHOOK_HEAD_REF.match(/(refs\/heads\/)(.+)/)[2]
    request({
      method: "GET",
      hostname: "api.github.com",
      path: `/repos/simpsons01/CodebuildDemo/pulls/${prNumber}`,
      headers: {
        Authorization: `token ${process.env.GITHUB_ACCESS_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
        "user-agent": "node.js",
      },
    }).then(res => {
      const commitNum = JSON.parse(res).commits
      exec(`git log ${headBranch} -n ${commitNum} --oneline --pretty='format:' --name-only`, (error, stdout, stderr) => {
        if(error) return reject(error)
        if(stderr) return reject(stderr)
        const isPackageJsonModified = stdout.split("\n").some(str => str === "package.json")
        resolve(isPackageJsonModified)
      })
    }).catch(reject)
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