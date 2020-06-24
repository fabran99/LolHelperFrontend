const { request } = require("league-connect");

const handleChampSelect = (currentWindow, auth, socket) => {
  const url = "/lol-champ-select/v1/session";
  request(
    {
      url,
      method: "GET",
    },
    auth
  )
    .then((res) => {
      res.json().then((res) => {
        if (!res.errorCode) {
          currentWindow.webContents.send("CHAMPSELECT_CHANGE", {
            data: res,
            event: res,
          });
        }
      });
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
  request(
    {
      url,
      method: "GET",
    },
    auth
  )
    .then((res) => {
      res.json().then((res) => {
        if (!res.errorCode) {
          currentWindow.webContents.send("LOBBY_CHANGE", {
            data: res,
            event: res,
          });
        }
      });
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
  request(
    {
      url,
      method: "GET",
    },
    auth
  )
    .then((res) => {
      res.json().then((res) => {
        if (!res.errorCode) {
          currentWindow.webContents.send("GAMESESSION_CHANGE", {
            data: res,
            event: res,
          });
        }
      });
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
