const fs = require("fs");

const appendToFile = async (content, filePath) =>
  new Promise((resolve, reject) => {
    fs.appendFile(filePath, content, function (err) {
      if (err) reject(err);
      console.log(`${filePath} changed!`);
      resolve(`${filePath} changed!`);
    });
  });

const saveFile = async (content, filePath) =>
  new Promise((resolve, reject) => {
    fs.writeFile(filePath, content, function (err) {
      if (err) reject(err);
      console.log(`${filePath} saved!`);
      resolve(`${filePath} saved!`);
    });
  });

const moveFile = async (oldPath, newPath) =>
  new Promise((resolve, reject) => {
    fs.rename(oldPath, newPath, function (err) {
      if (err) reject(err);
      console.log(`File from ${oldPath} moved to ${newPath}!`);
      resolve(`File from ${oldPath} moved to ${newPath}!`);
    });
  });

const readFile = (filePath) =>
  new Promise((resolve, reject) => {
    fs.readFile(filePath, "utf8", function (err, content) {
      if (err) reject(err);
      resolve(content);
    });
  });

const listFiles = (pathDirectory) =>
  new Promise((resolve, reject) => {
    fs.readdir(pathDirectory, "utf8", function (err, files) {
      if (err) reject(err);
      resolve(files);
    });
  });


  async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }

module.exports = {
  appendToFile,
  saveFile,
  moveFile,
  readFile,
  listFiles,
  asyncForEach
};
