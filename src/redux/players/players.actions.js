import { UPDATE_PLAYER_DATA, PLAYER_INFO_IS_UPDATING } from "./players.types";

export const updatePlayerData = (playerData) => ({
  type: UPDATE_PLAYER_DATA,
  payload: playerData,
});

export const playerInfoIsUpdating = (summonerId) => ({
  type: PLAYER_INFO_IS_UPDATING,
  payload: summonerId,
});
