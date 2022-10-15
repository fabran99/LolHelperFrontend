import { createSelector } from "reselect";

const selectPlayers = (state) => state.players;

export const selectPlayerBySummonerId = (summonerId) => {
  return createSelector([selectPlayers], (players) => players[summonerId]);
};
