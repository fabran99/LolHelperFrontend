import { createSelector } from "reselect";

const selectSummoner = (state) => state.summoner;

export const selectSummonerIsLogged = createSelector(
  [selectSummoner],
  (summoner) => summoner.summonerId != null && summoner.profileIconId != null
);