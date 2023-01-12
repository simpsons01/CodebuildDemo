const path = require("path")
const { exec } = require("child_process")
const { checkNodeModulesExist, deleteNodeModules, installNodeModules, request } = require("../utils")

const checkPackageJsonModified = () => {
  return new Promise((resolve, reject) => {
    const prNumber = process.env.CODEBUILD_WEBHOOK_TRIGGER.split("/")[1]
    console.log(`pr number is ${prNumber}`)
    const headBranch = process.env.CODEBUILD_WEBHOOK_HEAD_REF.match(/(refs\/heads\/)(.+)/)[2]
    console.log(`headBranch is ${headBranch}`)
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
      const commitNum = res.commits
      console.log(`commitNum is ${commitNum}`)
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
  try {
    const nodeModulesPath = path.join(__dirname, "../../node_modules")
    const isNodeModuleExist = await checkNodeModulesExist(nodeModulesPath)
    if(isNodeModuleExist) {
      const isPackageJsonModified = await checkPackageJsonModified()
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
