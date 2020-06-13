const electron = require("electron");
const ipc = electron.ipcMain;
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require("path");
const join = path.join;
const isDev = require("electron-is-dev");
const { lstatSync, readdirSync } = require("fs");

// LCU
const LCUConnector = require("lcu-connector");
const { auth, connect } = require("league-connect");
// Socket handler
const {
  handleChampSelect,
  handleGameSession,
} = require("./electron_related/lcuSockets");

let mainWindow;
let socket;

var createWindow = () => {
  // Agrego extensiones
  if (isDev) {
    addExtensions();
  }

  mainWindow = new BrowserWindow({
    width: 1200,
    height: 750,
    icon: "",
    webPreferences: {
      nodeIntegration: true,
      preload: __dirname + "/electron_related/preload.js",
    },
    frame: false,
    resizable: false,
    transparent: true,
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

app.on("ready", createWindow);
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

const startListeners = (auth_data) => {
  setTimeout(() => {
    connect(auth_data).then((lcusocket) => {
      socket = lcusocket;
      handleChampSelect(mainWindow, auth_data, socket);
      handleGameSession(mainWindow, auth_data, socket);
    });
  }, 5000);
};

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

  // var direc

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
