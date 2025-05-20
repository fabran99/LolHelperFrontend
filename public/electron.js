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
} = require("./electron_handler/lcuSockets");
// Game requests
const {
  updateRunePage,
  getSummonerInfoById,
  getSummonerInfoByName,
  getBestChampsBySummoner,
  getRankedStatsByPuuid,
  checkReadyForMatch,
  AskLane,
  getSummonerMasteries,
  getMatchlist,
  restartUx,
  getCurrentSummonerData,
  getCurrentGameData,
  getSummonerDetail,
  genericRequest,
} = require("./electron_handler/gameRequests");
require("@electron/remote/main").initialize();

// Os handler
const { importBuild } = require("./electron_handler/osHandler");

let mainWindow;
let loadingScreen;

let socket;

// Evito multiples instancias
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.on("second-instance", (event, commandLine, workingDirectory) => {
    // Someone tried to run a second instance, we should focus our window.
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
}

// Pantalla de carga
const createLoadingScreen = () => {
  loadingScreen = new BrowserWindow({
    width: 500,
    height: 300,
    frame: false,
    transparent: true,
  });

  loadingScreen.setResizable(false);
  loadingScreen.loadURL(
    isDev
      ? `file://${path.join(__dirname, "./loading.html")}`
      : `file://${path.join(__dirname, "../build/loading.html")}`
  );

  loadingScreen.on("closed", () => (loadingScreen = null));

  loadingScreen.webContents.on("did-finish-load", () => {
    loadingScreen.focus();
    loadingScreen.show();
  });
};

// Ventana principal
const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 640,
    icon: "",
    webPreferences: {
      nodeIntegration: true,
      preload: __dirname + "/electron_handler/preload.js",
      contextIsolation: false,
      enableRemoteModule: true,
    },
    frame: false,
    resizable: false,
    show: false,
  });

  mainWindow.setMenuBarVisibility(false);

  // Inicio react
  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );
  require("@electron/remote/main").enable(mainWindow.webContents);

  // Abro herramientas de desarrollo
  if (isDev) {
    mainWindow.webContents.once("dom-ready", async () => {
      await addExtensions();
      mainWindow.webContents.openDevTools();
    });
    // Agrego extensiones
  }

  mainWindow.on("ready-to-show", () => {
    if (loadingScreen) {
      loadingScreen.close();
    }
    mainWindow.show();
    // mainWindow.focus();
  });

  // Cierro programa al cerrar ventana
  mainWindow.on("closed", () => (mainWindow = null));
};

// Se ejecuta cuando inicia la app
app.on("ready", () => {
  // if (!isDev) {
  createLoadingScreen();
  // }
  createWindow();
  autoUpdater.checkForUpdates();
  setInterval(() => {
    autoUpdater.checkForUpdates();
  }, 1000 * 60 * 5);
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
let connector = null;
ipc.on("WORKING", () => {
  if (connector) {
    connector.stop();
    connector = null;
  }
  if (socket) {
    for (key in socket.subscriptions) {
      socket.unsubscribe(key);
    }
    socket = null;
  }
  connector = new LCUConnector();
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
      console.log(socket.subscriptions);
      for (key in socket.subscriptions) {
        socket.unsubscribe(key);
      }
      socket = null;
    }
    connector = null;
    console.log("disconnected");
  });

  connector.start();
});

// Requests al launcher

ipc.handle("CHANGE_RUNES", updateRunePage);
ipc.handle("GET_SUMMONER_INFO_BY_ID", getSummonerInfoById);
ipc.handle("GET_SUMMONER_INFO_BY_NAME", getSummonerInfoByName);
ipc.handle("GET_BEST_CHAMPS_BY_ID", getBestChampsBySummoner);
ipc.handle("GET_RANKED_STATS_BY_PUUID", getRankedStatsByPuuid);
ipc.handle("CHECK_READY_FOR_MATCH", checkReadyForMatch);
ipc.handle("ASK_FOR_LANE", AskLane);
ipc.handle("GET_SUMMONER_MASTERIES_BY_ID", getSummonerMasteries);
ipc.handle("GET_MATCHLIST_BY_PUUID", getMatchlist);
ipc.handle("RESTART_UX", restartUx);
ipc.handle("GET_CURRENT_GAME_DATA", getCurrentGameData);
ipc.handle("GET_SUMMONER_DETAIL", getSummonerDetail);
ipc.handle("LCU_REQUEST", genericRequest);

// Datos del summoner actual
ipc.handle("GET_CURRENT_SUMMONER_DATA", getCurrentSummonerData);

// Datos de la partida actual
let timeoutFetching = null;
let stopFetchingGame = false;
ipc.on("START_FETCHING_CURRENT_GAME", (event, data) => {
  stopFetchingGame = false;
  console.log("Empezando fetching");
  const sendGameData = () => {
    clearTimeout(timeoutFetching);

    if (stopFetchingGame) {
      return;
    }

    getCurrentGameData()
      .then((data) => {
        mainWindow.webContents.send("CURRENT_GAME_CHANGE", data);
        var gameStarted = data.events.Events && data.events.Events.length > 0;
        timeoutFetching = setTimeout(
          () => {
            sendGameData();
          },
          gameStarted ? 1000 : 3000
        );
      })
      .catch((e) => {
        console.log(e);
        // Reintento
        timeoutFetching = setTimeout(() => {
          sendGameData();
        }, 3000);
      });
  };

  sendGameData();
});

ipc.on("STOP_FETCHING_CURRENT_GAME", () => {
  // Dejo de pedir datos del juego actual
  console.log("STOP FETCHING");
  clearTimeout(timeoutFetching);
  stopFetchingGame = true;
});

// Acciones del os
ipc.handle("IMPORT_ITEMS", (event, data) => {
  importBuild(mainWindow, data);
});

// Listeners del juego
const startListeners = (auth_data) => {
  console.log("Inicio los listeners");
  setTimeout(() => {
    connect(auth_data)
      .then((lcusocket) => {
        socket = lcusocket;
        handleChampSelect(mainWindow, auth_data, socket);
        handleGameSession(mainWindow, auth_data, socket);
        handleGameLobby(mainWindow, auth_data, socket);
      })
      .catch(async (err) => {
        setTimeout(() => {
          // Reintentar
          console.log("RETRYING TO CONNECT");
          startListeners(auth_data);
        }, 10000);
      });
  }, 10000);
};

// Auto update
// when the update is ready, notify the BrowserWindow
autoUpdater.on("update-downloaded", (info) => {
  console.log("downloaded", info);
  mainWindow.webContents.send("updateReady", info);
});

autoUpdater.on("checking-for-update", () => {
  console.log("Checking for update...");
});
autoUpdater.on("update-available", (info) => {
  console.log("Update available:", info);
});
autoUpdater.on("update-not-available", (info) => {
  console.log("No update available:", info);
});
autoUpdater.on("error", (err) => {
  console.log("Error in auto-updater:", err);
});
autoUpdater.on("download-progress", (progressObj) => {
  console.log(`Download speed: ${progressObj.bytesPerSecond}`);
  console.log(`Downloaded ${progressObj.percent.toFixed(2)}%`);
});

ipc.on("quitAndInstall", (event, arg) => {
  console.log("install");
  autoUpdater.quitAndInstall();
});

// Extensiones para desarrollo
const addExtensions = async () => {
  try {
    const {
      default: installExtension,
      REACT_DEVELOPER_TOOLS,
      REDUX_DEVTOOLS,
    } = require("electron-devtools-installer");
    const names = await Promise.all([
      // installExtension(REACT_DEVELOPER_TOOLS),
      installExtension(REDUX_DEVTOOLS),
    ]);
  } catch (err) {
    console.error("Failed to install DevTools:", err);
  }
};
