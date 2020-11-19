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

export const selectGamePhase = createSelector([baseSelect], (gameSession) =>
  gameSession ? gameSession.phase : null
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
