import {
  UPDATE_GAMEINFO,
  CLEAN_GAMEINFO,
  START_FETCHING_CURRENT_GAME,
  STOP_FETCHING_CURRENT_GAME,
} from "./ingame.types";

var initialState = {
  isInGame: false,
  activePlayer: null,
  allPlayers: null,
  events: null,
  gameData: null,
  lastEvent: 0,
  fetchingGame: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_GAMEINFO:
      return {
        ...state,
        ...action.payload,
        fetchingGame: true,
      };
    case CLEAN_GAMEINFO:
      return {
        ...state,
        ...initialState,
      };
    case STOP_FETCHING_CURRENT_GAME:
      return {
        ...state,
        ...initialState,
      };
    case START_FETCHING_CURRENT_GAME:
      return {
        ...state,
        fetchingGame: true,
      };
    default:
      return state;
  }
};
