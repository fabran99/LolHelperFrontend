const fs = require("fs");
const remote = require("electron").remote;

const buildRoute = `C:\\Riot Games\\League of Legends\\Config\\Champions`;

const createFolder = (route) => {
  mkdir(route, { recursive: true });
};

const writeToFile = async (route, data) => {
  return fs.promises.writeFile(route, data);
};

const importBuild = (currentWindow, build) => {
  var buildDict = JSON.parse(build);
  var route = `${buildRoute}\\${buildDict.champion}\\Recommended\\`;
  fs.mkdir(route, { recursive: true }, (err) => {
    if (err) {
      console.log(err);
      currentWindow.webContents.send("BUILD_FAILED", true);
    } else {
      fs.writeFile(`${route}\\LolHelper.json`, build, (err) => {
        if (err) {
          currentWindow.webContents.send("BUILD_FAILED", true);
          console.log(err);
        } else {
          currentWindow.webContents.send("BUILD_APPLIED", true);
        }
      });
    }
  });
};

module.exports = {
  importBuild,
};
