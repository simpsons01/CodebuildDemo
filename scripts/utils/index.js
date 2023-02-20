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

const checkNodeModulesExistAndNotEmpty = (nodeModulesPath) => {
  return new Promise((resolve) => {
    fs.readdir(nodeModulesPath, (err, files) => {
      if(err) return resolve(false)
      const hasFiles = files.length > 0
      resolve(hasFiles)
    })
  })
}

const createStdout = (...args) => console.log(...args)

module.exports = {
  request,
  checkNodeModulesExistAndNotEmpty,
  createStdout
}