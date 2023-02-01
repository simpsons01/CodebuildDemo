const https = require("https")
const { exec } = require("child_process")
const fs = require("fs");

const request = (option, body) => {
  return new Promise((resolve, reject) => {
    const req = https.request(option, (res) => {
        const chunks = [];
        res.on("data", (data) => chunks.push(data));
        res.on("end", () => {
          resolve(Buffer.concat(chunks).toString());
        });
      }
    );
    req.on("error", (err) => reject(err));
    if(body)  req.write(body)
    req.end();
  });
};

const checkNodeModulesEmpty = (nodeModulesPath) => {
  return new Promise((resolve, reject) => {
    fs.readdir(nodeModulesPath, (err, files) => {
      if(err) return reject(err)
      const isEmpty = files.length === 0
      resolve(isEmpty)
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
  checkNodeModulesEmpty,
  deleteNodeModules,
  installNodeModules
}
