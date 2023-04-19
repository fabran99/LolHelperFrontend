import { UPDATE_SUMMONER, CLEAN_SUMMONER } from "./summoner.types";

var initialState = {
  summonerId: null,
  accountId: null,
  displayName: null,
  puuid: null,
  profileIconId: null,
  summonerLevel: null,
  tier: null,
  wins: null,
  division: null,
  isInPromo: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_SUMMONER:
      return {
        ...state,
        ...action.payload,
      };
    case CLEAN_SUMMONER:
      return {
        ...state,
        ...initialState,
      };
    default:
      return state;
  }
};
