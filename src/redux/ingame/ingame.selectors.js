import { createSelector } from "reselect";

const baseSelect = (state) => state.ingame;

// allPlayers
export const selectAllPlayers = createSelector([baseSelect], (inGameData) => {
  if (inGameData && inGameData.allPlayers) {
    return inGameData.allPlayers;
  } else {
    return null;
  }
});
