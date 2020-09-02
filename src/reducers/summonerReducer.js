import { UPDATE_SUMMONER } from "../actions/types";

var initialState = {
  summonerId: null,
  accountId: null,
  displayName: null,
  puuid: null,
  profileIconId: null,
  summonerLevel: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_SUMMONER:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};
