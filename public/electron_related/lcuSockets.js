const { request } = require("league-connect");
const { LauncherHandler } = require("./lcuHandler/lcuHandler");

const handleChampSelect = (currentWindow, auth, socket) => {
  const url = "/lol-champ-select/v1/session";
  var handler = new LauncherHandler(auth);

  handler
    .getChampSelectData()
    .then((res) => {
      if (!res.errorCode) {
        currentWindow.webContents.send("CHAMPSELECT_CHANGE", {
          data: res,
          event: res,
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });

  socket.subscribe(url, (data, event) => {
    currentWindow.webContents.send("CHAMPSELECT_CHANGE", { data, event });
  });
};

const handleGameLobby = (currentWindow, auth, socket) => {
  const url = "/lol-lobby/v2/lobby";
  var handler = new LauncherHandler(auth);

  handler
    .getLobbyData()
    .then((res) => {
      if (!res.errorCode) {
        currentWindow.webContents.send("LOBBY_CHANGE", {
          data: res,
          event: res,
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });

  socket.subscribe(url, (data, event) => {
    currentWindow.webContents.send("LOBBY_CHANGE", { data, event });
  });
};

const handleGameSession = (currentWindow, auth, socket) => {
  const url = "/lol-gameflow/v1/session";
  var handler = new LauncherHandler(auth);

  handler
    .getSessionData()
    .then((res) => {
      if (!res.errorCode) {
        currentWindow.webContents.send("GAMESESSION_CHANGE", {
          data: res,
          event: res,
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });

  socket.subscribe(url, (data, event) => {
    currentWindow.webContents.send("GAMESESSION_CHANGE", { data, event });
  });
};

module.exports = {
  handleChampSelect,
  handleGameSession,
  handleGameLobby,
};
