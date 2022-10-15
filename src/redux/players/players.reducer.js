import { UPDATE_PLAYER_DATA } from "./players.types";

var initialState = {};

export default (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_PLAYER_DATA:
      let currentState = { ...state };
      let playerData = action.payload;
      // Chequeo si trae summonerId, si no tiene no hago nada
      if (!playerData.summonerId) {
        return state;
      }

      // Guardo la fecha actual en la que se actualizo la info
      playerData.lastUpdate = new Date();
      // Chequeo si tiene todas las keys completadas o no
      let infoIsComplete = true;
      let importantKeys = [
        "division",
        "tier",
        "displayName",
        "puuid",
        "summonerId",
        "summonerLevel",
        "profileIconId",
        "wins",
        "isInPromo",
        "bestChamps",
        "masteryLevels",
        "matchlist",
      ];
      for (let key of importantKeys) {
        if (playerData[key] == null) {
          infoIsComplete = false;
          break;
        }
      }

      playerData.infoIsComplete = infoIsComplete;
      let keysToIgnore = ["detailModalVisible"];
      for (let key of keysToIgnore) {
        delete playerData[key];
      }

      currentState[playerData.summonerId] = playerData;

      return currentState;

    default:
      return state;
  }
};
