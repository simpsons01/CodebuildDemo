const https = require("https")
const exec = require("child_process")

const request = (option, body) => {
  return new Promise((resolve, reject) => {
    const req = https.request(option, (res) => {
        const chunks = [];
        res.on("data", (data) => chunks.push(data));
        res.on("end", () => {
          let resBody = Buffer.concat(chunks).toString()
          resolve(resBody);
        });
      }
    );
    req.on("error", (err) => reject(err));
    if(body)  req.write(body)
    req.end();
  });
};

const checkNodeModulesExist = (nodeModulesPath) => {
  return new Promise((resolve) => {
    fs.readdir(nodeModulesPath, (err) => {
      if(err) return resolve(false)
      resolve(true)
    })
  })
}

const deleteNodeModules = () => {
  return new Promise((resolve, reject) => {
    exec("rm -rf node_modules", (error, stdout, stderr) => {
      if(error) return  reject(error)
      if(stderr) return reject(stderr)
      resolve()
    })
  })
}

const installNodeModules = () => {
  return new Promise((resolve, reject) => {
    exec("npm install", (error, stdout, stderr) => {
      if(error) reject(error)
      if(stderr) console.log(stderr)
      else if(stdout) console.log(stdout)
      resolve()
    })
  })
}

module.exports = {
  request,
  checkNodeModulesExist,
  deleteNodeModules,
  installNodeModules
}