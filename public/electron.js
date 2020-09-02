const electron = require("electron");
const ipc = electron.ipcMain;
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require("path");
const join = path.join;
const isDev = require("electron-is-dev");
const { lstatSync, readdirSync } = require("fs");
const { autoUpdater } = require("electron-updater");
// LCU
const LCUConnector = require("lcu-connector");
const { auth, connect } = require("league-connect");
// Socket handler
const {
  handleChampSelect,
  handleGameSession,
  handleGameLobby,
} = require("./electron_related/lcuSockets");
// Game requests
const {
  updateRunePage,
  getSummonerInfoById,
  getBestChampsBySummoner,
  getRankedStatsByPuuid,
  checkReadyForMatch,
  AskLane,
  getSummonerMasteries,
  getMatchlist,
  restartUx,
  getCurrentSummonerData,
  getCurrentGameData,
} = require("./electron_related/gameRequests");

// Os handler
const { importBuild } = require("./electron_related/osHandler");

let mainWindow;
let socket;

var createWindow = () => {
  // Agrego extensiones
  if (isDev) {
    addExtensions();
  }

  mainWindow = new BrowserWindow({
    width: 1024,
    height: 640,
    icon: "",
    webPreferences: {
      nodeIntegration: true,
      preload: __dirname + "/electron_related/preload.js",
    },
    frame: false,
    resizable: false,
  });

  mainWindow.setMenuBarVisibility(false);

  // Inicio react
  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );

  // Abro herramientas de desarrollo
  mainWindow.webContents.openDevTools();

  // Cierro programa al cerrar ventana
  mainWindow.on("closed", () => (mainWindow = null));
};

app.on("ready", () => {
  createWindow();
  autoUpdater.checkForUpdates();
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// Manejo listener del juego
ipc.on("WORKING", () => {
  if (socket) {
    for (key in socket.subscriptions) {
      socket.unsubscribe(key);
    }
    socket = null;
  }
  const connector = new LCUConnector();
  console.log("working");
  // Escucho el archivo lockfile para avisar si hubo cambios
  connector.on("connect", (data) => {
    auth().then((res) => {
      console.log(res);
      mainWindow.webContents.send("LCU_CONNECT", res);

      startListeners(res);
    });

    console.log("connected");
  });
  connector.on("disconnect", () => {
    mainWindow.webContents.send("LCU_DISCONNECT", true);
    if (socket) {
      for (key in socket.subscriptions) {
        socket.unsubscribe(key);
      }
      socket = null;
    }
    console.log("disconnected");
  });

  connector.start();
});

// Requests al launcher

ipc.handle("CHANGE_RUNES", updateRunePage);
ipc.handle("GET_SUMMONER_INFO_BY_ID", getSummonerInfoById);
ipc.handle("GET_BEST_CHAMPS_BY_ID", getBestChampsBySummoner);
ipc.handle("GET_RANKED_STATS_BY_PUUID", getRankedStatsByPuuid);
ipc.handle("CHECK_READY_FOR_MATCH", checkReadyForMatch);
ipc.handle("ASK_FOR_LANE", AskLane);
ipc.handle("GET_SUMMONER_MASTERIES_BY_ID", getSummonerMasteries);
ipc.handle("GET_MATCHLIST_BY_PUUID", getMatchlist);
ipc.handle("RESTART_UX", restartUx);
ipc.handle("GET_CURRENT_GAME_DATA", getCurrentGameData);

// Datos del summoner actual
ipc.handle("GET_CURRENT_SUMMONER_DATA", getCurrentSummonerData);

// Acciones del os
ipc.handle("IMPORT_ITEMS", (event, data) => {
  importBuild(mainWindow, data);
});

// Listeners del juego
const startListeners = (auth_data) => {
  setTimeout(() => {
    connect(auth_data).then((lcusocket) => {
      socket = lcusocket;
      handleChampSelect(mainWindow, auth_data, socket);
      handleGameSession(mainWindow, auth_data, socket);
      handleGameLobby(mainWindow, auth_data, socket);
    });
  }, 5000);
};

// Auto update
// when the update is ready, notify the BrowserWindow
autoUpdater.on("update-downloaded", (info) => {
  console.log("downloaded", info);
  mainWindow.webContents.send("updateReady");
});

ipc.on("quitAndInstall", (event, arg) => {
  console.log("install");
  autoUpdater.quitAndInstall();
});

// Extensiones para desarrollo
const addExtensions = () => {
  var extension_path = join(
    process.env.APPDATA.replace(process.env.APPDATA.split(path.sep).pop(), ""),
    "Local",
    "Google",
    "Chrome",
    "User Data",
    "Default",
    "Extensions"
  );
  var react_dev_tools = "fmkadmapgofadopljbjfkapdkoienihi";
  var redux_dev_tools = "lmhkpmbekcpmknklioeibfkpmmfibljd";

  const isDirectory = (source) => lstatSync(source).isDirectory();
  const getDirectories = (source) =>
    readdirSync(source)
      .map((name) => join(source, name))
      .filter(isDirectory);

  try {
    BrowserWindow.addDevToolsExtension(
      getDirectories(`${path.join(extension_path, react_dev_tools)}`)[0]
    );
    BrowserWindow.addDevToolsExtension(
      getDirectories(`${path.join(extension_path, redux_dev_tools)}`)[0]
    );
  } catch {
    console.log("No extensions");
  }
};
