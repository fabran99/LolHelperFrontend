const { request } = require("league-connect");
const {
  LauncherHandler,
  SummonersHandler,
} = require("./lcuHandler/lcuHandler");

const handleChampSelect = (currentWindow, auth, socket) => {
  const url = "/lol-champ-select/v1/session";
  var handler = new LauncherHandler(auth);
  const summonersHandler = new SummonersHandler(auth);

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

  socket.subscribe(url, async (data, event) => {
    currentWindow.webContents.send("CHAMPSELECT_CHANGE", { data, event });
  });
};

const handleGameLobby = (currentWindow, auth, socket) => {
  const url = "/lol-lobby/v2/lobby";
  var handler = new LauncherHandler(auth);
  const summonersHandler = new SummonersHandler(auth);

  handler
    .getLobbyData()
    .then(async (res) => {
      if (!res.errorCode) {
        for (let i = 0; i < res.members.length; i++) {
          const member = res.members[i];
          const summonerData = await summonersHandler.getSummonerDataByPuuid(
            member.puuid
          );
          res.members[i] = {
            ...res.members[i],
            ...summonerData,
          };
        }

        currentWindow.webContents.send("LOBBY_CHANGE", {
          data: res,
          event: res,
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });

  socket.subscribe(url, async (data, event) => {
    if (data.members) {
      for (let i = 0; i < data.members.length; i++) {
        const member = data.members[i];
        const summonerData = await summonersHandler.getSummonerDataByPuuid(
          member.puuid
        );
        data.members[i] = {
          ...data.members[i],
          ...summonerData,
        };
      }
    }

    currentWindow.webContents.send("LOBBY_CHANGE", { data, event });
  });
};

const handleGameSession = (currentWindow, auth, socket) => {
  const url = "/lol-gameflow/v1/session";
  var handler = new LauncherHandler(auth);
  const summonersHandler = new SummonersHandler(auth);

  handler
    .getSessionData()
    .then(async (res) => {
      if (res?.gameData?.teamOne) {
        for (let i = 0; i < res.gameData.teamOne.length; i++) {
          const member = res.gameData.teamOne[i];
          const summonerData = await summonersHandler.getSummonerDataByPuuid(
            member.puuid
          );
          res.gameData.teamOne[i] = {
            ...res.gameData.teamOne[i],
            ...summonerData,
          };
        }
        for (let i = 0; i < res.gameData.teamTwo.length; i++) {
          const member = res.gameData.teamTwo[i];
          const summonerData = await summonersHandler.getSummonerDataByPuuid(
            member.puuid
          );
          res.gameData.teamTwo[i] = {
            ...res.gameData.teamTwo[i],
            ...summonerData,
          };
        }
      }
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

  socket.subscribe(url, async (data, event) => {
    if (data?.gameData?.teamOne) {
      for (let i = 0; i < data.gameData.teamOne.length; i++) {
        const member = data.gameData.teamOne[i];
        const summonerData = await summonersHandler.getSummonerDataByPuuid(
          member.puuid
        );
        data.gameData.teamOne[i] = {
          ...data.gameData.teamOne[i],
          ...summonerData,
        };
      }
      for (let i = 0; i < data.gameData.teamTwo.length; i++) {
        const member = data.gameData.teamTwo[i];
        const summonerData = await summonersHandler.getSummonerDataByPuuid(
          member.puuid
        );
        data.gameData.teamTwo[i] = {
          ...data.gameData.teamTwo[i],
          ...summonerData,
        };
      }
    }
    currentWindow.webContents.send("GAMESESSION_CHANGE", { data, event });
  });
};

module.exports = {
  handleChampSelect,
  handleGameSession,
  handleGameLobby,
};
