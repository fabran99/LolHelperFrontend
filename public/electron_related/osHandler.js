const fs = require("fs");
const buildRoute = `C:\\Riot Games\\League of Legends\\Config\\Champions`;

const importBuild = (currentWindow, build) => {
  var buildDict = JSON.parse(build);
  var route = `${buildRoute}\\${buildDict.champion}\\Recommended\\`;

  fs.mkdir(route, { recursive: true }, (err) => {
    if (err) {
      console.log(err);
      currentWindow.webContents.send("BUILD_FAILED", true);
    } else {
      var allExists = true;
      buildDict.lanes.forEach((lane, i) => {
        var filename = `${route}\\LolHelper${lane}.json`;
        var exists = fs.existsSync(filename);
        if (!exists) {
          allExists = false;
        }
        var build = buildDict.builds[i];

        fs.writeFileSync(filename, JSON.stringify(build));
      });

      currentWindow.webContents.send("BUILD_APPLIED", !allExists);
    }
  });
};

module.exports = {
  importBuild,
};
