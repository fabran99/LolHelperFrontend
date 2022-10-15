import { createSelector } from "reselect";
import { QUEUENAMES, SUMMONER_RIFT } from "../../constants/game.constants";

const baseSelect = (state) => state.gameSession;
const selectGameData = (state) =>
  state.gameSession ? state.gameSession.gameData : null;
const selectGameClient = (state) =>
  state.gameSession ? state.gameSession.gameClient : null;
const selectGameMap = (state) =>
  state.gameSession ? state.gameSession.map : null;

// Game info
export const selectIsSummonerRift = createSelector(
  [selectGameData],
  (gameData) => {
    if (gameData && gameData.queue) {
      return gameData.queue.mapId == SUMMONER_RIFT;
    } else {
      return false;
    }
  }
);

export const selectGameSessionGameData = createSelector(
  [baseSelect],
  (gameSession) => {
    if (gameSession && gameSession.gameData) {
      return gameSession.gameData;
    } else {
      return null;
    }
  }
);

export const selectGameName = createSelector(
  [selectGameData, selectGameMap],
  (gameData, gameMap) => {
    if (gameData || !gameMap) {
      return "";
    }
    var isCustom = gameData.isCustomGame;
    var queuename = isCustom ? "Custom" : gameData.queue.description;
    return `${queuename} - ${gameMap.name}`;
  }
);

export const selectGameModeShortName = createSelector(
  [baseSelect],
  (gameSession) => {
    if (!gameSession || !gameSession.gameData) {
      return "";
    }
    var queueName = gameSession.map.gameModeShortName;
    return queueName;
  }
);

export const selectGameQueue = createSelector([selectGameData], (gameData) => {
  if (gameData) {
    return gameData.queue;
  } else {
    return null;
  }
});

export const selectGameHasBans = createSelector(
  [selectGameData],
  (gameData) => {
    try {
      return gameData.queue.gameTypeConfig.banMode == "StandardBanStrategy";
    } catch {
      return false;
    }
  }
);

export const selectIsValidQueue = createSelector(
  [selectGameData],
  (gameData) => {
    try {
      if (QUEUENAMES[gameData.queue.id]) {
        return QUEUENAMES[gameData.queue.id];
      }
    } catch {
      return false;
    }
    return false;
  }
);

export const selectCurrentPhase = createSelector(
  [baseSelect],
  (gameData) => gameData.phase || null
);

export const selectIsTFT = createSelector([baseSelect], (gameData) => {
  var isTFT = false;
  try {
    isTFT = baseSelect.gameSession.map.gameMode == "TFT";
  } catch {
    isTFT = false;
  }
  return isTFT;
});

export const selectGameTeams = createSelector([selectGameData], (gameData) => {
  if (gameData) {
    return {
      teamOne: gameData.teamOne,
      teamTwo: gameData.teamTwo,
    };
  } else {
    return null;
  }
});

export const selectIngameTeams = createSelector([baseSelect], (gameSession) => {
  if (gameSession && gameSession.teams) {
    return {
      teamOne: gameSession.teams.teamOne,
      teamTwo: gameSession.teams.teamTwo,
    };
  } else {
    return null;
  }
});
