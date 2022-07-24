const fs = require("fs");
const buildRoute = `C:\\Riot Games\\League of Legends\\Config\\Champions`;

const deleteAllLolHelperFromFolder = (folder) => {
  fs.readdir(folder, (err, files) => {
    if (err) {
      return console.log("No se encuentra la ruta");
    }

    files.forEach((file) => {
      if (file.indexOf("LolHelper") != -1) {
        fs.unlink(`${folder}\\${file}`, (err) => {
          return console.log(err);
        });
      }
    });
  });
};

const importBuild = (currentWindow, build) => {
  var buildDict = JSON.parse(build);
  var route = `${buildRoute}\\${buildDict.champion}\\Recommended\\`;

  fs.mkdir(route, { recursive: true }, (err) => {
    if (err) {
      console.log(err);
      currentWindow.webContents.send("BUILD_FAILED", true);
    } else {
      var allExists = true;
      // Elimino todos los archivos que dijeran LolHelper
      deleteAllLolHelperFromFolder(route);

      buildDict.lanes.forEach((lane, i) => {
        var filename = `${route}\\BardApp${lane}.json`;
        var exists = fs.existsSync(filename);
        if (!exists) {
          allExists = false;
        }
        var build = buildDict.builds[i];

        fs.writeFileSync(filename, JSON.stringify(build));
      });

      currentWindow.webContents.send("BUILD_APPLIED", allExists);
    }
  });
};

module.exports = {
  importBuild,
};
